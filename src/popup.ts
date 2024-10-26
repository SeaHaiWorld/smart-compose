const genToggleSwitch = () => {
  try {
    const toggleSwitch = document.getElementById(
      'toggle-switch',
    ) as HTMLInputElement;

    // 获取开关的当前状态
    chrome.storage.sync.get('isEnabled', (data) => {
      toggleSwitch.checked = data.isEnabled ?? false; // 默认启用
    });

    // 添加事件监听器以更改状态
    toggleSwitch.addEventListener('change', () => {
      chrome.storage.sync.set({ isEnabled: toggleSwitch.checked }, () => {
        console.log('isEnabled set to:', toggleSwitch.checked); // Debug log
      });
    });
  } catch (e) {
    console.log(e);
  }
};

genToggleSwitch();
