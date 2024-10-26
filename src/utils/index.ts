export const transformTextAreaToEditableDiv = (elementId: string): void => {
  if (document.getElementById(elementId)) {
    const target = document.getElementById(elementId) as HTMLTextAreaElement;
    // 检查元素是否是 textarea
    if (target.tagName.toLowerCase() === 'textarea') {
      // 创建一个新的 div 元素
      const editableDiv = document.createElement('div');
      // 复制 textarea 的所有属性到新的 div
      Array.from(target.attributes).forEach((attr) => {
        editableDiv.setAttribute(attr.name, attr.value);
      });

      editableDiv.contentEditable = 'true'; // 设置为可编辑
      editableDiv.innerText = target.value; // 将 textarea 的内容复制到 div 中

      // 替换 textarea 为可编辑的 div
      target.parentNode?.replaceChild(editableDiv, target);
    }
  }
};

export const debounce = (
  func: (...args: unknown[]) => void,
  delay: number,
): ((...args: unknown[]) => void) => {
  let timeoutId: number;
  return function (...args: unknown[]) {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
