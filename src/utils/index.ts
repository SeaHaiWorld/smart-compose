export const transformTextAreaToEditableDiv = (selector: string): void => {
  const target = document.querySelector(selector) as HTMLTextAreaElement | null;

  if (target && target.tagName.toLowerCase() === 'textarea') {
    // 创建一个新的 div 元素
    const editableDiv = document.createElement('div');
    // 复制 textarea 的所有属性到新的 div
    Array.from(target.attributes).forEach(attr => {
      editableDiv.setAttribute(attr.name, attr.value);
    });

    editableDiv.contentEditable = 'true'; // 设置为可编辑
    editableDiv.innerText = target.value; // 将 textarea 的内容复制到 div 中

    // 替换 textarea 为可编辑的 div
    target.parentNode?.replaceChild(editableDiv, target);
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

export const insertCompletionSpan = (completion: string): void => {
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
  const currentNode = range?.startContainer as Text | null;

  // 获取光标偏移量
  const isAtEnd = range?.startOffset === currentNode?.length;

  // 判断光标是否在本行末尾
  if (isAtEnd) {
    const span = document.createElement('span');
    span.innerText = completion;
    span.style.color = 'gray';
    span.contentEditable = 'false';
    span.id = 'smart-completion-span'; // 设置特定id

    range?.insertNode(span);

    // 更新光标位置到span前面
    range?.setStartBefore(span);
    range?.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
};
