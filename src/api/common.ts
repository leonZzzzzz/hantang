import Request from './request'

export default class Common extends Request {
  _request: Request;
  
  constructor() {
    super();
    this._request = new Request()
  }

  // 根据wx.login返回的code从服务器获取session等信息
  getSessionByCode(params: any) {
    return this._request.$post('api/v1/member/authorize', params)
  }

  // 图片上传
  tencentCloud(tempFilePath: any, params?: any) {
    return this._request.$uploadFile('api/v1/attachments/images/tencent_cloud', tempFilePath, params)
  }

  // 授权登录
  memberLogin(params?: any) {
    return this._request.$post('api/v1/member/login', params)
  }
  // 授权注册
  memberRegist(params?: any) {
    return this._request.$get('api/v1/member/regist', params)
  }
  decryptPhone(params?: any) {
    return this._request.$post('api/v1/member/decryptPhone', params)
  }
  bindPhonenum(params?: any) {
    return this._request.$post('api/v1/member/bindPhonenum', params)
  }
  // 绑定信息
  myBindInfo(params?: any) {
    return this._request.$get('api/v1/wechatMember/myBindInfo', params)
  }

  // 获取首页弹框
  getAdDetail(params?: any) {
    return this._request.$get('api/v1/member/getAdDetail', params)
  }
  // 获取首页配置
  getHomepage(params?: any) {
    return this._request.$get('api/v1/member/homePage/getHomepage', params)
  }
  // 搜索
  homePageSearch(params?: any) {
    return this._request.$get('api/v1/member/homePage/search', params)
  }
  
  // 首页轮播图列表
  attachmentTempPage(params?: any) {
    return this._request.$get('api/v1/attachmentTemp/page', params)
  }
  // 首页轮播图详情
  attachmentTempGet(params?: any) {
    return this._request.$get('api/v1/attachmentTemp/get', params)
  }

  // 获取活动类型
  listByTypeAndParent(params?: any) {
    return this._request.$get('api/v1/category/listByTypeAndParent', params)
  }
  // 活动列表
  activityPage(params?: any) {
    return this._request.$get('api/v1/activity/page', params)
  }
  // 活动详情
  activityGet(params?: any) {
    return this._request.$get('api/v1/activity/get', params)
  }
  // 报名列表
  signMembers(params?: any) {
    return this._request.$get('api/v1/activitySign/signMembers', params)
  }
  // 活动报名
  activitySign(params?: any) {
    return this._request.$postJson('api/v1/activitySign/sign', params)
  }
  // 取消活动报名
  activityCancel(params?: any) {
    return this._request.$get('api/v1/activitySign/cancel', params)
  }
  // 我报名的活动列表
  signActivityPage(params?: any) {
    return this._request.$get('api/v1/activity/signActivityPage', params)
  }



  // 支付
  requestPayment(params?: any) {
    return this._request.$requestPayment(params)
  }


    
}