import { fetchSmartCompletion } from './api';
import {
  debounce,
  transformTextAreaToEditableDiv,
  insertCompletionSpan,
} from './utils';

let completion = '';
const SMART_COMPLETION_SPAN_ID = 'smart-completion-span';

// 需要 smart compose 的元素选择器
const targetInputSelectors = [
  '#new_comment_field',
  '.tiptap',
  '#contenteditable',
];

const handleInput = async (target: HTMLDivElement): Promise<void> => {
  const inputText = target.innerText;

  if (!inputText) {
    completion = '';
    return;
  }

  try {
    const response = await fetchSmartCompletion(inputText);
    if (response.completion) {
      completion = response.completion;
      insertCompletionSpan(completion);
    }
  } catch (error) {
    console.error('POST 请求失败：', error);
  }
};

const handleKeyDown = (event: KeyboardEvent, target: HTMLDivElement) => {
  if (event.key === 'Tab') {
    event.preventDefault();

    // 查找具有特定id的span
    const completionSpan = document.getElementById(SMART_COMPLETION_SPAN_ID) as HTMLSpanElement;

    if (completionSpan) {
      // 获取当前光标位置的range
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      if (range) {
        const innerSpanHtml = completionSpan.innerHTML;
        completionSpan.remove();
        target.innerHTML += innerSpanHtml; // 使用innerHTML保留格式

        // 更新光标位置到内容的末尾
        range.setStartAfter(target.lastChild ?? range.endContainer);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }

    completion = '';
  } else {
    // 删除span
    const completionSpan = document.getElementById(SMART_COMPLETION_SPAN_ID);
    completionSpan?.remove();
  }
};

const addEventHandler = (target: HTMLDivElement) => {
  if (!target) return;

  let isComposing = false;
  const debouncedInput = debounce(() => handleInput(target), 500);
  target.addEventListener('compositionstart', () => {
    isComposing = true; // 开始组合输入
  });

  target.addEventListener('compositionend', () => {
    isComposing = false; // 结束组合输入
    debouncedInput(); // 结束后手动触发输入处理
  });

  target.addEventListener('input', () => {
    if (!isComposing) {
      debouncedInput(target); // 仅在非组合输入时触发
    }
  });

  target.addEventListener('keydown', (e) => handleKeyDown(e, target));
};

const setupSmartCompose = async (selector: string): Promise<void> => {
  await transformTextAreaToEditableDiv(selector);
  const target = document.querySelector(selector) as HTMLDivElement;

  if (target) {
    addEventHandler(target);
  }
};

const listenChromeStorage = () => {
  try {
    // 监听存储的开关状态变化
    chrome.storage.sync.get('isEnabled', (data) => {
      console.log('isEnabled', data);
      if (data.isEnabled) {
        targetInputSelectors.forEach(setupSmartCompose);
      }
    });

    // 监听开关状态的变化
    chrome.storage.onChanged.addListener((changes) => {
      console.log('changes', changes);
      if (changes.isEnabled) {
        if (changes.isEnabled.newValue) {
          targetInputSelectors.forEach(setupSmartCompose);
        } else {
          location.reload(); // 关闭时刷新页面以移除效果
        }
      }
    });
  } catch {
    targetInputSelectors.forEach(setupSmartCompose);
  }
};

listenChromeStorage();
