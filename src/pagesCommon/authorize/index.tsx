import Taro, { Config } from '@tarojs/taro';
// import MallComponent from '@utils/components';
import { View, Image, Button, Input, Form } from '@tarojs/components';


import './index.scss';

import BaseComponent from '@/utils/components'
import * as globalData from '@/config/global_data'


type StateType = {
  isGetAvatar: boolean
  isTab: boolean
}

interface Authorize {
  state: StateType
}

class Authorize extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '授权登录',
  }

  model: any
  page: string

  constructor() {
    super();
    this.state = {
      isTab: false,
      // model: {
      //   mobile: '',
      //   smsCode: '',
      // },
      // 获取头像的授权 页面状态
      isGetAvatar: false,
      // codeText: '获取验证码',
    };
    // this.code = '';
    // this.isCodeLoading = false;
    // this.timer = '';
    // this.captchaObj = null;
    this.model = {
      headImage: '',
      appellation: '',
      code: '',
      serviceType: 3,
    }
    this.page = ''
  }

  componentDidMount() {
    console.log('【Authorize $router】:', this.$router);
    // const { isGetAvatar } = this.$router.params;
    // this.setState({
    //   isGetAvatar,
    // });
    // let page: string = Taro.getCurrentPages()[Taro.getCurrentPages().length - 1].route

    let page = globalData.get('backPage')
    this.page = page
    let isTab = page === '/pages/index/index' || page === '/pages/sojourn/index' || page === '/pages/travels/index' || page === '/pages/mine/index'
    this.setState({
      isTab
    })
  }

  componentDidShow() {
    // console.log(globalData.get('isNavigateToLogin'));
    // if (this.$env === Taro.ENV_TYPE.WEAPP) {
    //   Taro.login().then(res => {
    //     this.code = res.code;
    //   });
    // }
  }

  componentWillUnmount() {
    globalData.set('isNavigateToLogin', false);
  }

  componentDidHide() {
    globalData.set('isNavigateToLogin', false);
  }


  handleGetUserInfo(e: any) {
    console.log(e)
    let userInfo = e.detail.userInfo;
    if (!userInfo || !userInfo.nickName || !userInfo.avatarUrl) {
      this.showToast('授权失败，请重试')
      return;
    }
    let params = {
      headImage: userInfo.avatarUrl,
      appellation: userInfo.nickName,
    };
    this.model = Object.assign(this.model, params)
    console.log(this.model)
    this.setState({
      isGetAvatar: true
    })
  }
  handleLogin() {
    Taro.login().then(res => {
      console.log(res)
      if (res.code) {
        this.model.code = res.code
        this.memberLogin()
      } else {
        this.showToast('登录失败，请重试')
      }
    })
  }
  async memberLogin(): Promise<any> {
    const res = await this.$api.common.memberLogin(this.model)
    console.log('memberLogin', res)
    this.checkShare()
    Taro.setStorageSync('memberId', res.data.data.memberId)

    if (this.state.isTab) {
      this.switchTab(this.page);
    } else {
      this.redirectTo(this.page)
    }
  }

  checkShare() {
    if (globalData.get('isInvite')) return

    let shareId = Taro.getStorageSync('authShareId')

    let scene = Taro.getStorageSync('scene')


    if (scene !== 1047 && scene !== 1048 && scene !== 1049) {
      globalData.set('isWeappMount', true);
      console.log('set isWeappMount true')
      return
    }

    Taro.setStorageSync('shareId', shareId)
    console.log('shareId', shareId)
    this.shareBind({shareId: shareId})
  }

  // 绑定邀请人
  async shareBind(params: any) {
    await this.$api.mine.shareBind(params)
    globalData.set('isWeappMount', true);
    globalData.set('isInvite', true);
    Taro.removeStorageSync('authShareId')
  }

  render() {
    const { isGetAvatar, isTab } = this.state;
    return (
      <View className="page-authorize">
        {/* <Form reportSubmit onSubmit={this.submitFormId.bind(this)}> */}
          <View className="login-form">
            <View className="logo-wrapper">
              <Image className="logo" src={this.imgHost + '/attachments/static/logo_notext.png'} />
              <View className="title">欢迎来到汉唐华盛！</View>
            </View>
  
            <View className="form-wrapper">
              {!isGetAvatar ? (
                <Button
                  className="input-btn"
                  openType="getUserInfo"
                  formType="submit"
                  onGetUserInfo={this.handleGetUserInfo.bind(this)}
                >
                  获取微信头像和昵称
                </Button>
              ) : (
                <Button
                  className="input-btn"
                  onClick={this.handleLogin.bind(this)}
                >
                  授权登录
                </Button>
              )}
            </View>

            {isTab && (
              <View className="back-wrapper">
                <Button className="btn" formType="submit" onClick={this.switchTab.bind(this, '/pages/index/index')}>
                  返回首页
                </Button>
              </View>
            )}
          </View>
        {/* </Form> */}
      </View>
    );
  }
}

export default Authorize
