import Request from './request'

export default class Mall extends Request {
  _request: Request;
  
  constructor() {
    super();
    this._request = new Request()
  }

  // 获取门店列表
  storeList(params?: any) {
    return this._request.$get('api/mall/v1/store/list', params)
  }

  // 拼团商品分页列表
  groupProductPage(params?: any) {
    return this._request.$get('api/mall/v1/groupProduct/page', params)
  }
  // 拼团商品分页详情
  groupProductGet(params?: any) {
    return this._request.$get('api/mall/v1/groupProduct/get', params)
  }
  // 拼团商品项(库存)
  groupProductStock(params?: any) {
    return this._request.$get('api/mall/v1/groupProduct/stock', params)
  }
  // 发起的拼团订单
  listOrganizerOrder(params?: any) {
    return this._request.$get('api/mall/v1/groupOrder/listOrganizerOrder', params)
  }
  // 发起的拼团订单（分页）
  pageOrganizerOrder(params?: any) {
    return this._request.$get('api/mall/v1/groupOrder/pageOrganizerOrder', params)
  }
  // 拼团订单的拼团状况
  groupDetail(params?: any) {
    return this._request.$get('api/mall/v1/groupOrder/groupDetail', params)
  }
  
  // 商品类别列表
  listByTypeAndParentId(params?: any) {
    return this._request.$get('api/v1/category/listByTypeAndParentId', params)
  }
  // 根据商品类别的商品分页列表
  pageByCategory(params?: any) {
    return this._request.$get('api/mall/v1/product/pageByCategory', params)
  }
  // 商品分页列表
  productPage(params?: any) {
    return this._request.$get('api/mall/v1/product/page', params)
  }
  // 商品详情
  productGet(params?: any) {
    return this._request.$get('api/mall/v1/product/get', params)
  }
  // 获取商品项(库存)
  productStock(params?: any) {
    return this._request.$get('api/mall/v1/product/stock', params)
  }


  // 收藏列表
  productCollectionPage(params?: any) {
    return this._request.$get('api/mall/v1/productCollection/page', params)
  }
  // 收藏
  productCollectionInsert(params?: any) {
    return this._request.$post('api/mall/v1/productCollection/insert', params)
  }

  /**
   * 获取购物车数量
   */
  getCartNum(params?: any) {
    return this._request.$get('api/mall/v1/cart/get', params);
  }
  // 加入购物车
  addToCart(params?: any) {
    return this._request.$post('api/mall/v1/cart/addToCart', params)
  }
  // 现在购买
  nowBuy(params?: any) {
    return this._request.$post('api/mall/v1/cart/nowBuy', params)
  }
  // 购物车详情
  listOrderItem(params?: any) {
    return this._request.$get('api/mall/v1/cart/listOrderItem', params)
  }
  // 购物车的数量
  cartNums(params?: any) {
    return this._request.$get('api/mall/v1/cart/get', params)
  }
  // 增加购物车中商品的数量
  addCartNum(params?: any) {
    return this._request.$post('api/mall/v1/cart/add', params);
  }
  // 减少购物车中商品的数量
  deducteCartNum(params?: any) {
    return this._request.$post('api/mall/v1/cart/deducte', params);
  }
  // 移除购物车的商品
  cartDelete(params?: any) {
    return this._request.$post('api/mall/v1/cart/delete', params);
  }
  // 订单提交预览
  orderPrepare(params?: any) {
    return this._request.$get('api/mall/v1/order/prepare', params);
  }
  // 订单提交
  orderPrepay(params?: any) {
    return this._request.$post('api/mall/v1/orderPay/prepay', params);
  }
  // 订单提交重试
  orderRetryPrepay(params?: any) {
    return this._request.$post('api/mall/v1/orderPay/retryPrepay', params);
  }
  // 确认支付
  payRequestParameter(params?: any) {
    return this._request.$get('api/v1/wechat/pay_request_parameter', params);
  }
  // 获取订单发货单
  getByOrder(params?: any) {
    return this._request.$get('api/mall/v1.2/order-express-bill/get-by-order', params);
  }

  // 团长下单（发起拼团）
  groupOrderOrganize(params?: any) {
    return this._request.$post('api/mall/v1/groupOrder/organize', params);
  }
  // 参团下单（参与拼团）
  groupOrderJoin(params?: any) {
    return this._request.$post('api/mall/v1/groupOrder/join', params);
  }
  // 商品拼团情况
  groupShoppingGetInfo(params?: any) {
    return this._request.$get('api/mall/v1/groupShopping/getInfo', params);
  }
  // 订单参团情况
  groupOrderGroupDetail(params?: any) {
    return this._request.$get('api/mall/v1/groupOrder/groupDetail', params);
  }
  // 拼团订单轮播显示
  listOrganizer(params?: any) {
    return this._request.$get('api/mall/v1/groupOrder/listOrganizer', params);
  }
  // 拼团订单提交预览
  groupOrderPrepare(params?: any) {
    return this._request.$get('api/mall/v1/groupOrder/prepare', params);
  }
  // 拼团订单提交重试
  groupOrderRetryPrepay(params?: any) {
    return this._request.$post('api/mall/v1/groupOrder/retryPrepay', params);
  }
  // 拼团订单分页
  groupOrderPage(params?: any) {
    return this._request.$get('api/mall/v1/groupOrder/page', params)
  }

  /**
   * 订获取单列表
   */
  getOrderList(params?: any) {
    return this._request.$get('api/mall/v1/order/page', params);
  }

  /**
   * 获取订单详情
   */
  getOrderDetail(params?: any) {
    return this._request.$get('api/mall/v1/order/detail', params);
  }

  /**
   * 订单取消
   */
  cancelOrder(params?: any) {
    return this._request.$post('api/mall/v1/order/cancel', params);
  }
  /**
   * 订单取消
   */
  receiveOrder(params?: any) {
    return this._request.$post('api/mall/v1/order/receive', params);
  }



  /**
   * 售后
   */
  /**
   * 申请退款
   */
  refundApply(params?: any) {
    return this._request.$postJson('api/mall/v1/after-sale/refund/apply', params);
  }
  /**
   * 获取退款原因
   */
  refundReasonType(params?: any) {
    return this._request.$get('api/mall/v1/after-sale/refund/reason-type', params);
  }
  /**
   * 取消退款
   */
  refundCancel(params?: any) {
    return this._request.$post('api/mall/v1/after-sale/refund/cancel', params);
  }

  /**
   * 申请换货
   */
  exchangeGoodsApply(params?: any) {
    return this._request.$postJson('api/mall/v1/after-sale/exchange-goods/apply', params);
  }
  /**
   * 获取换货原因
   */
  exchangeGoodsReasonType(params?: any) {
    return this._request.$get('api/mall/v1/after-sale/exchange-goods/reason-type', params);
  }
  /**
   * 取消换货
   */
  exchangeGoodsCancel(params?: any) {
    return this._request.$post('api/mall/v1/after-sale/exchange-goods/cancel', params);
  }
  /**
   * 上传快递单
   */
  exchangeGoodsUploadExpressBill(params?: any) {
    return this._request.$post('api/mall/v1/after-sale/exchange-goods/upload-express-bill', params);
  }

  /**
   * 申请退货
   */
  returnGoodsApply(params?: any) {
    return this._request.$postJson('api/mall/v1/after-sale/return-goods/apply', params);
  }
  /**
   * 获取退货原因
   */
  returnGoodsReasonType(params?: any) {
    return this._request.$get('api/mall/v1/after-sale/return-goods/reason-type', params);
  }
  /**
   * 取消退货
   */
  returnGoodsCancel(params?: any) {
    return this._request.$post('api/mall/v1/after-sale/return-goods/cancel', params);
  }
  /**
   * 上传快递单
   */
  returnGoodsUploadExpressBill(params?: any) {
    return this._request.$post('api/mall/v1/after-sale/return-goods/upload-express-bill', params);
  }
  /**
   *  获取订单已冻结的售后数量
   */
  calculateFrozenQuantity(params?: any) {
    return this._request.$get('api/mall/v1/after-sale/calculate-frozen-quantity', params);
  }

  /**
   *  获取订单发货单
   */
  getOrderExpressBill(params?: any) {
    return this._request.$get('api/mall/v1/order-express-bill/get-by-order', params);
  }

  /**
   * 售后订单列表
   */
  afterSalePage(params?: any) {
    return this._request.$get('api/mall/v1/after-sale/page', params)
  }
  /**
   * 售后订单详情
   */
  afterSaleGet(params?: any) {
    return this._request.$get('api/mall/v1/after-sale/get', params)
  }

  /**
   * 申请赔付
   */
  applyOrderCompensation(params?: any) {
    return this._request.$post('api/mall/v1/order-compensation/apply', params);
  }

  /**
   * 取消赔付
   */
  cancelOrderCompensation(params?: any) {
    return this._request.$post('api/mall/v1/order-compensation/cancel', params);
  }

  /**
   *  获取赔付原因类型
   */
  getOrderCompensationReasonType(params?: any) {
    return this._request.$get('api/mall/v1/order-compensation/reason-type', params);
  }

  /**
   *  查看订单赔付记录
   */
  getOrderCompensationList(params?: any) {
    return this._request.$get('api/mall/v1/order-compensation/list-by-order', params);
  }

  /**
   *  获取订单赔付状态
   */
  getOrderCompensationStatus(params?: any) {
    return this._request.$get('api/mall/v1/order/get-compensation-status', params);
  }





  /**
   * 发起退换货
   */
  postAfterSales(params?: any) {
    return this._request.$postJson('api/mall/v1/orderAfterSales/insert', params);
  }

  /**
   *  退换货订单详情
   */
  getAfterSalesDetail(params?: any) {
    return this._request.$get('api/mall/v1/orderAfterSales/get', params);
  }

  /**
   * 录入快递单信息
   */
  postExpressBill(params?: any) {
    return this._request.$post('api/mall/v1/orderAfterSales/saveCourier', params);
  }

  /**
   * 换货订单确认收货
   */
  confirmReceipt(params?: any) {
    return this._request.$post('api/mall/v1/orderAfterSales/confirmReceipt', params);
  }

  /**
   *  获取商品评价列表
   */
  getProductEvaluate(params?: any) {
    return this._request.$get('api/mall/v1/productEvaluate/page', params);
  }

  /**
   *  获取精选的商品评价列表
   */
  getChosenEvaluate(params?: any) {
    return this._request.$get('api/mall/v1/productEvaluate/chosenList', params);
  }

  /**
   *  获取商品评价汇总数据
   */
  getProductEvaluateInfo(params?: any) {
    return this._request.$get('api/mall/v1/productEvaluate/sumNumsByProductId', params);
  }

  /**
   *  获取需要评价的商品列表
   */
  getListForEvaluation(params?: any) {
    return this._request.$get('api/mall/v1/productEvaluate/listForEvaluation', params);
  }

  /**
   *  发布商品评价
   */
  insertProductEvaluate(params?: any) {
    return this._request.$postJson('api/mall/v1/productEvaluate/insert', params);
  }

  /**
   *  删除商品评价
   */
  deleteProductEvaluate(params?: any) {
    return this._request.$post('api/mall/v1/productEvaluate/delete', params);
  }

  /**
   *  订单状态流
   */
  getOrderFlowList(params?: any) {
    return this._request.$get('api/mall/v1/orderFlow/list', params);
  }


  /**
   * 获取收藏列表
   */
  getCollectionList(params?: any) {
    return this._request.$get('api/mall/v1/productCollection/page', params);
  }

  /**
   * 添加到收藏
   */
  addCollection(params?: any) {
    return this._request.$post('api/mall/v1/productCollection/insert', params);
  }

  /**
   * 删除收藏
   */
  delCollection(params?: any) {
    return this._request.$post('api/mall/v1/productCollection/deleteByProduct', params);
  }

  


  /**
   * 助力购
   */
  // 助力商品分页列表
  helpProductPage(params?: any) {
    return this._request.$get('api/mall/v1/helpProduct/page', params);
  }
  // 助力商品详情
  helpProductGet(params?: any) {
    return this._request.$get('api/mall/v1/helpProduct/get', params);
  }
  // 助力商品项(库存)
  helpProductStock(params?: any) {
    return this._request.$get('api/mall/v1/helpProduct/stock', params);
  }
  // 助力订单（分页）
  helpOrderPage(params?: any) {
    return this._request.$get('api/mall/v1/helpOrder/page', params);
  }
  // 助力订单的助力状况
  helpOrderHelpDetail(params?: any) {
    return this._request.$get('api/mall/v1/helpOrder/helpDetail', params);
  }
  // 订单提交预览
  helpOrderPrepare(params?: any) {
    return this._request.$get('api/mall/v1/helpOrder/prepare', params);
  }
  // 订单助力情况
  helpDetail(params?: any) {
    return this._request.$get('api/mall/v1/helpOrder/helpDetail', params);
  }
  // 助力
  help(params?: any) {
    return this._request.$post('api/mall/v1/helpOrder/help', params);
  }
  // 下单
  helpOrderOrganize(params?: any) {
    return this._request.$post('api/mall/v1/helpOrder/organize', params);
  }
  /**
   * 助力购
   */


  
  /**
   * 拼团商品分享海报
   */
  createGroupShoppingPoster(params?: any) {
    return this._request.$get('api/mall/v1/productPoster/createGroupShoppingPoster', params);
  }
}