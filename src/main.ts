import { debounce, transformTextAreaToEditableDiv } from './utils';

let suggestion = '';

const handleInput = async (target: HTMLDivElement): Promise<void> => {
  const inputText = target.innerText;

  if (!inputText.length) {
    suggestion = '';
    return;
  }

  // Mock response
  const response = {
    ok: '200',
    suggestion: 'text completion',
  };

  if (response.ok) {
    const data = await response;

    // 添加延迟再插入span
    setTimeout(() => {
      if (data.suggestion) {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        const currentNode = range?.startContainer;

        // 获取光标偏移量
        const isAtEnd = range?.startOffset === (currentNode as Text).length;

        // 判断光标是否在本行末尾
        if (isAtEnd) {
          const span = document.createElement('span');
          span.innerText = data.suggestion;
          span.style.color = 'gray';
          span.contentEditable = 'false';
          span.id = 'suggestion-span'; // 设置特定id

          range?.insertNode(span);

          // 更新光标位置到span前面
          range?.setStartBefore(span);
          range?.collapse(true);
          selection?.removeAllRanges();
          selection?.addRange(range);

          suggestion = data.suggestion;
        }
      }
    }, 500); // 延迟500毫秒
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    event.preventDefault();

    // 查找具有特定id的span
    const existingSpan = document.getElementById(
      'suggestion-span',
    ) as HTMLSpanElement;
    if (existingSpan) {
      // 创建一个文本节点
      const textNode = document.createTextNode(suggestion);

      // 获取当前光标位置的range
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      if (range) {
        // 替换span为文本节点
        existingSpan.remove(); // 删除当前范围内的内容（如果有）
        range.insertNode(textNode); // 插入文本节点

        // 更新光标位置到文本末尾
        range.setStartAfter(textNode);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }

    suggestion = '';
  } else {
    const existingSpan = document.getElementById('suggestion-span');
    if (existingSpan) {
      existingSpan.remove(); // 删除span
    }
  }
};

const setupSmartCompose = async (elementId: string): Promise<void> => {
  await transformTextAreaToEditableDiv(elementId);

  const target = document.getElementById(elementId) as HTMLDivElement;
  if (!target) {
    return;
  }

  const debouncedInput = debounce(handleInput, 200);
  let isComposing = false;
  target.addEventListener('compositionstart', () => {
    isComposing = true; // 开始组合输入
  });

  target.addEventListener('compositionend', () => {
    isComposing = false; // 结束组合输入
    debouncedInput(target); // 结束后手动触发输入处理
  });

  target.addEventListener('input', () => {
    if (!isComposing) {
      debouncedInput(target); // 仅在非组合输入时触发
    }
  });

  target.addEventListener('keydown', handleKeyDown);
};

setupSmartCompose('new_comment_field');
