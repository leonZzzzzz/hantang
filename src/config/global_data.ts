const globalData = {
  // 标记是否已经加载过小程序的状态
  isWeappMount: false,
  callback: null,
  // 是否跳转到登录页
  isNavigateToLogin: false,
  backPage: '',
  isInvite: false,
};

export function set(key: string, val: any) {
  globalData[key] = val;
}

export function get(key: string) {
  return globalData[key];
}
