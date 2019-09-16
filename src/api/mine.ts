import Request from './request'

export default class Mine extends Request {
  _request: Request;
  
  constructor() {
    super();
    this._request = new Request()
  }

  // 获取地址
  addressGet(params?: any) {
    return this._request.$get('api/mall/v1/address/get', params)
  }
  // 收货地址新增
  addressAdd(params?: any) {
    return this._request.$postJson('api/mall/v1/address/add', params)
  }
  // 收货地址修改
  addressUpdate(params?: any) {
    return this._request.$postJson('api/mall/v1/address/update', params)
  }
  // 收货地址删除
  addressDelete(params?: any) {
    return this._request.$post('api/mall/v1/address/delete', params)
  }
  // 收货地址列表
  addressList(params?: any) {
    return this._request.$get('api/mall/v1/address/list', params)
  }

  // 绑定管家
  bindSteward(params?: any) {
    return this._request.$post('api/v1/wechatMember/bindSteward', params)
  }
  // 根据code查询管家
  queryStewardBaseInfoByCode(params?: any) {
    return this._request.$get('api/v1/wechatMember/queryStewardBaseInfoByCode', params)
  }
  // 请管家联系
  needSteward(params?: any) {
    return this._request.$post('api/v1/wechatMember/needSteward', params)
  }

  // 关于我们
  aboutUs(params?: any) {
    return this._request.$get('api/mall/v1/mallConfig/getAboutUs', params)
  }

  // 消息列表
  noticePage(params?: any) {
    return this._request.$get('api/v1/member/notice/getMemberMessage', params)
  }
  // 消息详情
  noticeDetail(params?: any) {
    return this._request.$get('api/v1/member/notice/readMemberMessageDetail', params)
  }

  // 修改我的资料
  updateMyProfile(params?: any) {
    return this._request.$postJson('api/v1/wechatMember/updateMyProfile', params)
  }
  // 我的资料
  myProfile(params?: any) {
    return this._request.$get('api/v1/wechatMember/myProfile', params)
  }

  // 当前余额
  getCurrentBalance(params?: any) {
    return this._request.$get('api/v1/wechatMember/selectCurrentBalance', params)
  }
  // 余额记录
  pageBalance(params?: any) {
    return this._request.$get('api/v1/wechatMember/pageBalance', params)
  }

  // 查看个人信息
  getMemberInfo(params?: any) {
    return this._request.$get('api/v1/wechatMember/memberInfo', params)
  }
  // 订单数量
  getOrderCount(params?: any) {
    return this._request.$get('api/mall/v1/order/getStatusQuantity', params)
  }


  // 收藏总数
  getMyCollectionCount(params?: any) {
    return this._request.$get('api/v1/member/collection/getMyCollectionCount', params)
  }
  // 收藏旅居基地
  addJourneyBaseCollection(params?: any) {
    return this._request.$post('api/v1/member/collection/addJourneyBaseCollection', params)
  }
  // 取消收藏旅居基地
  deleteJourneyBaseCollection(params?: any) {
    return this._request.$post('api/v1/member/collection/deleteJourneyBaseCollection', params)
  }
  // 旅居基地收藏列表
  pageJourneyBaseCollection(params?: any) {
    return this._request.$get('api/v1/member/collection/pageJourneyBaseCollection', params)
  }
  // 收藏商品
  addProductCollection(params?: any) {
    return this._request.$post('api/v1/member/collection/addProductCollection', params)
  }
  // 取消收藏商品
  deleteProductCollection(params?: any) {
    return this._request.$post('api/v1/member/collection/deleteProductCollection', params)
  }
  // 商品收藏列表
  pageProductCollection(params?: any) {
    return this._request.$get('api/v1/member/collection/pageProductCollection', params)
  }

  // 我的奖品
  myAward(params?: any) {
    return this._request.$get('api/v1/wechatMember/myAward', params)
  }


  /**
   * 推荐有奖
   */
  // 生成海报
  sharePoster(params?: any) {
    return this._request.$get('api/v1/member/share/poster', params)
  }
  // 邀请列表
  shareGetInvite(params?: any) {
    return this._request.$get('api/v1/member/share/getInvite', params)
  }
  // 绑定邀请人
  shareBind(params?: any) {
    return this._request.$post('api/v1/member/share/bind', params)
  }
  // 我的奖励
  shareGetCount(params?: any) {
    return this._request.$get('api/v1/member/share/getCount', params)
  }
}