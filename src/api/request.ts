import { XmlMethod, XMLRequestError } from '../types';

function sendXMLRequest<T>(
  url: string,
  method: XmlMethod,
  data?: Record<string, unknown>,
  headers?: Record<string, string>, // 新增参数以设置请求头
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    // 设置请求头
    xhr.setRequestHeader('Accept', 'application/json');
    if (data) {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }
    // 设置自定义请求头
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    // 处理响应
    xhr.onload = () => {
      const { status, statusText, responseText } = xhr;

      if (status >= 200 && status < 300) {
        try {
          const response: T = JSON.parse(responseText);
          resolve(response);
        } catch {
          reject(new Error('解析响应失败'));
        }
      } else {
        // 处理错误响应
        try {
          const errorResponse: XMLRequestError = JSON.parse(responseText);
          const errorMessages = errorResponse.detail
            .map((e) => e.msg)
            .join(', ');
          reject(
            new Error(`请求失败：${status} ${statusText} - ${errorMessages}`),
          );
        } catch {
          reject(
            new Error(`请求失败：${status} ${statusText} - 无法解析错误响应`),
          );
        }
      }
    };

    xhr.onerror = () =>
      reject(new Error(`请求失败：${xhr.status} ${xhr.statusText}`));

    // 发送数据（仅在有数据时发送）
    xhr.send(data ? JSON.stringify(data) : null);
  });
}

export default sendXMLRequest;
