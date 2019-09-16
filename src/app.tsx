import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'
import '@tarojs/async-await'

import './app.scss'
import './styles/custom-variables.scss'

import api from '@/api/index'
import * as globalData from '@/config/global_data';


// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/sojourn/index',
      'pages/travels/index',
      'pages/mine/index',
    ],
    subPackages: [
      {
        root: 'pagesCommon',
        pages: [
          'advanced-search/index',
          'authorize/index',
          'firend-help/index',
          'firend-help/detail/index',
          'invite/index',
          'invite/list/index',
          'activity/index',
          'activity/detail/index',
          'activity/sign/index',
          'join-group/index',
          'confirm-order/index',
          'pay-result/index',
          'group-product/index',
          'group-product/detail/index',
          'product/index',
          'product/detail/index',
        ]
      },
      {
        root: 'pagesSojourn',
        pages: [
          'sojourn/introduce/index',
          'sojourn/introduce/map/index',
          'sojourn/detail/index',
          'sojourn/submit-order/index',
          'more-date/index',
        ]
      },
      {
        root: 'pagesTravels',
        pages: [
          'travels/image-detail/index',
          'travels/video-detail/index',
          'travels/release/index',
        ]
      },
      {
        root: 'pagesMine',
        pages: [
          'mine/info/index',
          'mine/info/edit/index',
          'mine/vip-member/index',
          'mine/wallet/index',
          'mine/like/index',
          'mine/order/index',
          'mine/order/detail/index',
          'mine/order/flow/index',
          'mine/after-sales-order/index',
          'mine/news/index',
          'mine/news/detail/index',
          'mine/address/index',
          'mine/address/edit/index',
          'mine/sojourn-order/index',
          'mine/sojourn-order/cancel/index',
          'mine/group-product-order/index',
          'mine/group-journey-order/index',
          'mine/prize-order/index',
          'mine/help-order/index',
          'mine/cart/index',
          'mine/join-activity/index',
          'mine/about/index',
          'mine/after-sale/action/index',
          'mine/after-sale/apply/index',
          'mine/after-sale/detail/index',
          'mine/after-sale/express-bill/index',
          'mine/after-sale/compensate/index',
          'mine/after-sale/compensate/result/index',
          'mine/evaluate/list/index',
          'mine/evaluate/post/index',
        ]
      }
    ],
    preloadRule: {
      'pages/index/index': {
        network: 'all',
        packages: ['pagesCommon', 'pagesSojourn']
      },
      'pages/sojourn/index': {
        network: 'all',
        packages: ['pagesSojourn']
      },
      'pages/travels/index': {
        network: 'all',
        packages: ['pagesTravels']
      },
      'pages/mine/index': {
        network: 'all',
        packages: ['pagesMine']
      }
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
    },
    tabBar: {
      selectedColor: '#d10d23',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '首页',
          iconPath: './img/home-gray.png',
          selectedIconPath: './img/home-red.png',
        },
        {
          pagePath: 'pages/sojourn/index',
          text: '旅居',
          iconPath: './img/lvju-gray.png',
          selectedIconPath: './img/lvju-red.png',
        },
        {
          pagePath: 'pages/travels/index',
          text: '游记',
          iconPath: './img/youji-gray.png',
          selectedIconPath: './img/youji-red.png',
        },
        {
          pagePath: 'pages/mine/index',
          text: '我的',
          iconPath: './img/mine-gray.png',
          selectedIconPath: './img/mine-red.png',
        }
      ]
    },
    permission: {
      "scope.userLocation": {
        desc: "您的位置信息将用于定位"
      }
    },
    plugins: {
      wxparserPlugin: {
        version: "0.2.1",
        provider: "wx9d4d4ffa781ff3ac"
      }
    }
  }

  componentDidMount () {
    this.checkWeappUpdate()
    Taro.removeStorageSync('openId')
    Taro.removeStorageSync('sessionId')
    Taro.removeStorageSync('memberId')
    Taro.removeStorageSync('shareId')
    Taro.removeStorageSync('authShareId')
    Taro.removeStorageSync('scene')

    // polyfill Object.entries
    if (!Object.entries) {
      Object.entries = function(obj) {
        var ownProps = Object.keys(obj),
          i = ownProps.length,
          resArray = new Array(i); // preallocate the Array
        while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];
        return resArray;
      };
    }
    this.checkWeappUpdate()
    this.storeList()

    let { query, scene }: { [scene: string]: any } = this.$router.params
    console.log('scene', scene)
    Taro.setStorageSync('scene', Number(scene))
    Taro.setStorageSync('authShareId', query.scene)
    this.checkShare(query, Number(scene))
  }

  componentDidShow () {
    if (!globalData.get('isWeappMount')) {
      return;
    }

    let { query, scene } = this.$router.params
    console.log('scene', scene)
    Taro.setStorageSync('scene', Number(scene))
    this.checkShare(query, Number(scene))
  }

  componentDidHide () {}

  componentDidCatchError () {}

  // 获取商店id等信息
  async storeList() {
    let res = await api.mall.storeList()
    console.log('storeList', res.data)
    let data = res.data.data
    Taro.setStorageSync('storeId', data[0].id)
    Taro.setStorageSync('storeName', data[0].name)
  }

  // 检查小程序版本更新
  checkWeappUpdate() {
    const updateManager = Taro.getUpdateManager();
    updateManager.onCheckForUpdate(res => {
      // 请求完新版本信息的回调
      console.log('新版本信息：', res.hasUpdate);
    });
    updateManager.onUpdateReady(() => {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，请重启更新小程序',
        showCancel: false,
        success: res => {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        },
      });
    });
    updateManager.onUpdateFailed(err => {
      // 新版本下载失败
      console.log('新版本下载失败', err);
    });
  }

  checkShare(query: any, scene: number) {
    const shareId = Taro.getStorageSync('shareId');
    if (!query.scene || query.scene === shareId || (scene !== 1047 && scene !== 1048 && scene !== 1049)) {
      globalData.set('isWeappMount', true);
      console.log('set isWeappMount true')
      return
    }

    Taro.setStorageSync('shareId', query.scene)
    console.log('shareId', query.scene)
    this.shareBind({shareId: query.scene})
  }

  // 绑定邀请人
  async shareBind(params: any) {
    let res = await api.mine.shareBind(params)
    console.log('shareBind', res)
    if (res.data.code) {
      globalData.set('isWeappMount', true);
      globalData.set('isInvite', true);
      Taro.removeStorageSync('authShareId')
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
