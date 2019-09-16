import Taro from '@tarojs/taro'

export function setStorage(key: string, value: any | string): Promise<boolean> {
  return new Promise(resolve => {
    Taro.setStorage({key, data: value}).then(() => resolve(true), () => resolve(false))
  })
}

export function getStorage(key: string): Promise<any> {
  return new Promise(resolve => {
    Taro.getStorage({ key }).then((res: any) => resolve(res.data), () => resolve(null))
  })
}

export function getStorageInfo(): Promise<any> {
  return new Promise(resolve => {
    Taro.getStorageInfo().then((res: any) => resolve(res), () => resolve(null))
  })
}

export function removeStorage(key: string): Promise<boolean> {
  return new Promise(resolve => {
    Taro.removeStorage({ key }).then(() => resolve(true), () => resolve(false))
  })
}

export function clearStorage(): void {
  Taro.clearStorage()
}