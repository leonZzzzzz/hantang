import config from '../config/index'
import Taro from '@tarojs/taro'
import * as globalData from '@/config/global_data'

class Request {
  _baseUrl: string;
  retry: number;
  maxRetry: number;
  constructor () {
    this._baseUrl = config.urlHost
    this.retry = 0
    this.maxRetry = 3
  }

  showToast (title: string = '系统出错', icon: string = 'none', duration: number = 3000, mask: boolean = false) {
    Taro.showToast({
      icon: icon,
      title: title,
      duration: duration,
      mask: mask
    })
  }

  async $get (url: string, params: any): Promise<any> {
    const header = { 'Content-Type': 'application/x-www-form-urlencoded'}
    return await this.interceptor(url, params, header, 'GET')
  }

  async $post (url: string, params: any): Promise<any> {
    const header = { 'Content-Type': 'application/x-www-form-urlencoded' }
    return await this.interceptor(url, params, header, 'POST')
  }

  async $postJson (url: string, params: any): Promise<any> {
    const header = { 'Content-Type': 'application/json' }
    return await this.interceptor(url, params, header, 'POST')
  }

  $uploadFile (url: string, temFilePath: string, formData: any) {
    return new Promise((resolve, reject) => {
      Taro.uploadFile({
        url: this._baseUrl + url,
        filePath: temFilePath,
        name:'file',
        formData: formData,
      }).then((res: any) => {
        if (typeof res.data === 'string') res.data = JSON.parse(res.data)
        if (res.data.code === 20000) {
          resolve(res)
        } else {
          this.showToast(res.data.message)
          reject(res)
        }
      }).catch((err) => {
        console.log('uploadFile err ', err.data)
        reject(err)
      })
    })
  }

  // 根据wx.login返回的code从服务器获取session等信息
  _getSessionByCode(params: any) {
    const url = 'api/v1/member/authorize';
    const header = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    return this.request(url, params, header, 'POST');
  }

  // 请求拦截
  async interceptor(url: string, params: any, header: any, method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | undefined) {
    if (process.env.TARO_ENV === 'weapp') {
      if (Taro.getStorageSync('sessionId')) {
        header.WPGSESSID = Taro.getStorageSync('sessionId');
      } else {
        try {
          const res = await Taro.login();
          console.log('login', res)
          const params = {
            code: res.code,
          };
          const session: any = await this._getSessionByCode(params);
          const { sessionId, memberId, openId } = session.data.data;
          header.WPGSESSID = sessionId;
          Taro.setStorageSync('openId', openId);
          Taro.setStorageSync('sessionId', sessionId);
          Taro.setStorageSync('memberId', memberId);
        } catch (err) {
          console.error('interceptor error', err);
        }
      }
      return this.request(url, params, header, method);
    }
    // } else {
    //   return this.webRequest(url, params, header, method);
    // }
  }

  // 封装请求
  request(apiUrl: string, data: any = {}, header: any, method?: any) {
    const url = this._baseUrl + apiUrl
    config.requestConsole && console.log(`${url} params: `, data)

    return new Promise((resolve, reject) => {
      Taro.request({
        url,
        data,
        header,
        method,
      }).then(res => {
        config.requestConsole && console.log(`response`, res.data)
        if (res.data.code === 20000) {
          resolve(res)
        } else {
          let flag = false
          if (config.filterApiUrl.length) {
            for (let i = 0; i < config.filterApiUrl.length; i++) {
              let urlReg = new RegExp(config.filterApiUrl[i].url)
              // let codeReg = new RegExp(config.filterApiUrl[i].code)
              if (urlReg.test(url)) {
                flag = true
              }
            }
          }
          if (flag) {
            let resolveData = {
              data: {
                data: {}
              }
            }
            resolve(resolveData)
          } else if (res.data.code === 63021) {
            // 获取会员失败
            Taro.removeStorageSync('sessionId');
            // 如果没有获取到会员ID，跳转到注册
            if (!Taro.getStorageSync('memberId')) {
              if (!globalData.get('isNavigateToLogin')) {
                globalData.set('isNavigateToLogin', true);
                globalData.set('backPage', this.getPageUrl())
                Taro.redirectTo({
                  url: '/pagesCommon/authorize/index',
                })
              }
              reject(res);
            } else if (this.retry < this.maxRetry) {
              this.retry++;
              this.interceptor(url.replace(this._baseUrl, ''), data, header, method).then(res => {
                resolve(res);
              });
            } else {
              this.showToast(res.data.message)
              reject(res);
            }
          } else {
            reject(res)
            this.showToast(res.data.message)
          }
        }
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 支付
  $requestPayment(params?: any) {
    return new Promise((resolve, reject) => {
      Taro.requestPayment(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  getPageUrl() {
    const router = Taro.getCurrentPages()[Taro.getCurrentPages().length - 1]
    const params = router.$component.$router.params
    const path = router.$component.$router.path
    console.log('page',router)
    console.log(params, path)
    let backPage = path + '?'
    for (let key in params) {
      backPage += `${key}=${params[key]}&`
    }
    backPage = backPage.substring(0, backPage.length - 1)
    return backPage
  }
}

export default Request
