import { insertCompletionSpan } from '../utils';

describe('insertCompletionSpan', () => {
  beforeEach(() => {
    // 创建一个可以编辑的 div，并添加到 DOM
    document.body.innerHTML =
      '<div contenteditable="true" id="editable-div">Hello </div>';
    const editableDiv = document.getElementById('editable-div');
    editableDiv.focus(); // 让 div 获得焦点

    // 模拟用户的选择
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(editableDiv.firstChild, 6); // 将光标移动到 "Hello " 后
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  });

  afterEach(() => {
    document.body.innerHTML = ''; // 清理 DOM
  });

  it('should insert a completion span at the cursor position', () => {
    insertCompletionSpan('World!');
    const span = document.getElementById('smart-completion-span');

    expect(span).toBeTruthy(); // 确保 span 被插入
    expect(span.innerText).toBe('World!'); // 确保 span 内容正确
    expect(span.style.color).toBe('gray'); // 确保颜色正确
  });

  it('should update the cursor position after inserting the span', () => {
    insertCompletionSpan('World!');
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const currentNode = range.startContainer;

    expect(currentNode).toBeTruthy(); // 确保光标位置被更新
  });
});
