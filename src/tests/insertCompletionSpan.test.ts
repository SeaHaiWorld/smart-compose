import { insertCompletionSpan, isCursorAtEditableDivEnd } from '../utils';

describe('EditableDiv Functions', () => {
  let editableDiv: HTMLDivElement;
  let range: Range;
  let selection: Selection;

  beforeEach(() => {
    // 创建一个可编辑的 div
    editableDiv = document.createElement('div');
    editableDiv.contentEditable = 'true';
    document.body.appendChild(editableDiv);

    // 创建一个段落元素并添加到可编辑 div
    const p = document.createElement('p');
    p.textContent = 'Hello, world!';
    editableDiv.appendChild(p);

    // 创建一个范围并将光标放在段落的末尾
    selection = window.getSelection()!;
    range = document.createRange();
    range.setStart(p.childNodes[0], (p.childNodes[0] as Text).length); // 光标在文本末尾
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  });

  afterEach(() => {
    // 清理 DOM
    document.body.removeChild(editableDiv);
  });

  describe('isCursorAtEditableDivEnd', () => {
    it('should return true when cursor is at the end of editable div', () => {
      // 光标在文本节点末尾
      const p = editableDiv.querySelector('p')!;
      range.setStart(p.childNodes[0], (p.childNodes[0] as Text).length); // 光标在文本末尾
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      expect(isCursorAtEditableDivEnd(range, editableDiv)).toBe(true);
    });

    it('should return false when cursor is not at the end', () => {
      const p = editableDiv.querySelector('p')!;
      range.setStart(p.childNodes[0], 5); // 光标在文本节点的中间
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      expect(isCursorAtEditableDivEnd(range, editableDiv)).toBe(false);
    });

    it('should return false when cursor is outside the editable div', () => {
      const anotherDiv = document.createElement('div');
      document.body.appendChild(anotherDiv);
      range.setStart(anotherDiv, 0); // 光标在其他 div
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      expect(isCursorAtEditableDivEnd(range, editableDiv)).toBe(false);
    });
  });

  describe('insertCompletionSpan', () => {
    it('should insert a span at the end of editable div', () => {
      const p = editableDiv.querySelector('p')!;
      range.setStart(p.childNodes[0], (p.childNodes[0] as Text).length); // 光标在文本节点末尾
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      insertCompletionSpan('Test', editableDiv);

      const span = editableDiv.querySelector('span');
      expect(span).not.toBeNull();
      expect(span!.textContent).toBe('Test');
      expect(span!.style.color).toBe('gray');
    });

    it('should not insert a span when cursor is not at the end', () => {
      const p = editableDiv.querySelector('p')!;
      range.setStart(p.childNodes[0], 5); // 光标在文本节点的中间
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      insertCompletionSpan('Test', editableDiv);

      const span = editableDiv.querySelector('span');
      expect(span).toBeNull(); // 不应插入 span
    });
  });
});
