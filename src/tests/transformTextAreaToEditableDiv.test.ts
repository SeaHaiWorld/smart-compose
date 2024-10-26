import { transformTextAreaToEditableDiv } from '../utils';

describe('transformTextAreaToEditableDiv', () => {
  beforeEach(() => {
    // 在每个测试之前，创建一个 textarea 元素并添加到 DOM
    document.body.innerHTML =
      '<textarea id="test-area">Test content</textarea>';
  });

  afterEach(() => {
    // 清理 DOM
    document.body.innerHTML = '';
  });

  it('should replace textarea with an editable div', () => {
    transformTextAreaToEditableDiv('#test-area');
    const editableDiv = document.querySelector('div');

    expect(editableDiv).toBeTruthy(); // 确保新 div 存在
    expect(editableDiv.contentEditable).toBe('true'); // 确保 div 是可编辑的
    expect(editableDiv.innerText).toBe('Test content'); // 确保内容正确
  });

  it('should not transform if the selector does not match', () => {
    transformTextAreaToEditableDiv('#non-existing');
    const textarea = document.querySelector('#test-area');

    expect(textarea).toBeTruthy(); // textarea 应该仍然存在
  });

  it('should not transform if the selected element is not a textarea', () => {
    document.body.innerHTML = '<div id="not-a-textarea">Not a textarea</div>';
    transformTextAreaToEditableDiv('#not-a-textarea');
    const nonTextarea = document.querySelector('#not-a-textarea');

    expect(nonTextarea).toBeTruthy(); // div 应该仍然存在
  });
});
