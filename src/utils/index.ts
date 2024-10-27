export const transformTextAreaToEditableDiv = (selector: string): void => {
  const target = document.querySelector(selector) as HTMLTextAreaElement | null;

  if (target && target.tagName.toLowerCase() === 'textarea') {
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

export const isCursorAtEditableDivEnd = (
  range: Range,
  editableDiv: HTMLElement,
): boolean => {
  const { startContainer, startOffset } = range;

  // 确保光标所在的容器是可编辑 div 或其子元素
  if (!editableDiv.contains(startContainer)) {
    return false;
  }

  // 如果没有子节点，直接检查光标是否在文本末尾
  if (!editableDiv.firstChild) {
    return startOffset === 0; // 如果没有内容，光标不在末尾
  }

  const lastChild = editableDiv.lastChild;
  if (lastChild.nodeType === Node.TEXT_NODE) {
    return lastChild === range.startContainer;
  } else {
    return (
      startContainer.textContent.length === startOffset &&
      !startContainer.nextSibling
    );
  }
};

export const insertCompletionSpan = (
  completion: string,
  target: HTMLDivElement,
): void => {
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
  const lastChild = target.lastChild;

  // 判断光标位置
  const isAtEnd = isCursorAtEditableDivEnd(range, target);
  if (isAtEnd) {
    const span = document.createElement('span');
    span.innerText = completion;
    span.style.color = 'gray';
    span.contentEditable = 'false';
    span.id = 'smart-completion-span';

    if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
      target.appendChild(span);
      return;
    }

    // 将 span 插入到目标位置
    if (lastChild instanceof Node) {
      lastChild.insertBefore(span, lastChild.nextSibling);
    }

    // 更新光标位置到span前面
    range?.setStartBefore(span);
    range?.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
};
