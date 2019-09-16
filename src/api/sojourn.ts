import Request from './request'

export default class Sojourn extends Request {
  _request: Request;
  
  constructor() {
    super();
    this._request = new Request()
  }

  // 基地列表
  base(params?: any) {
    return this._request.$get('api/v1/journey-base/selectListCanUse', params)
  }
  // 基地详情
  baseDetail(params?: any) {
    return this._request.$get('api/v1/journey-base/queryDetail', params)
  }
  // 已绑定的旅居路线
  bindJourneyLines(params?: any) {
    return this._request.$get('api/v1/journey-base/queryAllBindJourneyLines', params)
  }
  // 已绑定的商品
  bindShops(params?: any) {
    return this._request.$get('api/v1/journey-base/queryAllBindShops', params)
  }

  // 商品列表
  journeyProductPage(params?: any) {
    return this._request.$get('api/v1/journey-product/page', params)
  }
  // 商品详情
  journeyProductDetail(params?: any) {
    return this._request.$get('api/v1/journey-product/get', params)
  }
  // 直接购买
  orderInsert(params?: any) {
    return this._request.$postJson('api/v1/journey-order/insert', params)
  }
  // 组团下单
  journeyGroupOrderOrganize(params?: any) {
    return this._request.$postJson('api/v1/journeyGroupOrder/organize', params)
  }
  // 参团下单
  journeyGroupOrderJoin(params?: any) {
    return this._request.$postJson('api/v1/journeyGroupOrder/join', params)
  }
  // 拼团订单分页
  journeyGroupOrderPage(params?: any) {
    return this._request.$get('api/v1/journeyGroupOrder/page', params)
  }
  // 组团订单列表
  listOrganizerOrder(params?: any) {
    return this._request.$get('api/v1/journeyGroupOrder/listOrganizerOrder', params)
  }
  // 组团订单分页
  pageOrganizerOrder(params?: any) {
    return this._request.$get('api/v1/journeyGroupOrder/pageOrganizerOrder', params)
  }
  // 参团详情
  journeyGroupOrderDetail(params?: any) {
    return this._request.$get('api/v1/journeyGroupOrder/groupDetail', params)
  }

  // 旅居拼团商品列表
  journeyGroupProductPage(params?: any) {
    return this._request.$get('api/v1/journeyGroupProduct/page', params)
  }
  // 旅居拼团商品详情
  journeyGroupProductDetail(params?: any) {
    return this._request.$get('api/v1/journeyGroupProduct/get', params)
  }

  // 订单列表
  orderPage(params?: any) {
    return this._request.$get('api/v1/journey-order/page', params)
  }
  // 订单详情
  orderGet(params?: any) {
    return this._request.$get('api/v1/journey-order/get', params)
  }
  // 订单支付
  orderPay(params?: any) {
    return this._request.$post('api/v1/journey-order/pay', params)
  }
  // 订单修改
  orderUpdate(params?: any) {
    return this._request.$postJson('api/v1/journey-order/update', params)
  }
  // 计算退款金额
  calculateRefundAmount(params?: any) {
    return this._request.$get('api/v1/journey-order/calculate-refund-amount', params)
  }
  // 订单取消
  orderCancel(params?: any) {
    return this._request.$post('api/v1/journey-order/cancel', params)
  }
}