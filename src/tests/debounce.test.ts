import { debounce } from '../utils';

describe('debounce', () => {
  jest.useFakeTimers(); // 使用 Jest 的假计时器

  it('should debounce the function calls', () => {
    const callback = jest.fn(); // 创建一个模拟函数
    const debouncedFunction = debounce(callback, 100);

    debouncedFunction();
    debouncedFunction();
    debouncedFunction();

    expect(callback).not.toBeCalled(); // 在延迟结束之前，函数不应该被调用

    jest.advanceTimersByTime(100); // 快进到 100ms

    expect(callback).toBeCalledTimes(1); // 应该只被调用一次
  });

  it('should call the function with the correct arguments', () => {
    const callback = jest.fn();
    const debouncedFunction = debounce(callback, 100);

    debouncedFunction('arg1', 'arg2');
    jest.advanceTimersByTime(100);

    expect(callback).toBeCalledWith('arg1', 'arg2'); // 检查参数是否正确
  });
});
