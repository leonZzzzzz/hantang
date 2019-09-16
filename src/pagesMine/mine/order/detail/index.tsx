import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtAccordion } from 'taro-ui';

import './index.scss';

import { CountDown, DividingLine, LoadingBox } from '@/components/index';
import BaseComponent from '@/utils/components'

import config from '@/config/index';

const statusImg_1 = config.imgHost + '/attachments/static/status-1.png'
const statusImg0 = config.imgHost + '/attachments/static/status0.png'
const statusImg1 = config.imgHost + '/attachments/static/status1.png'
const statusImg3 = config.imgHost + '/attachments/static/status3.png'

import util from '@/utils/util'

type StateType = {
  pageLoading: boolean
  orderInfo: any
  orderItems: any
  orderStatusImgs: any
  orderExpressBill: any[]
  compensationStatus: any
}

interface OrderDetail {
  state: StateType
}

class OrderDetail extends BaseComponent {
  config = {
    navigationBarTitleText: '订单详情',
  };
  id: string;
  btnLoading: boolean;
  clipboard: null | any;
  isMount: boolean;

  constructor() {
    super();
    this.state = {
      pageLoading: true,
      // 订单信息
      orderInfo: {},
      // 订单商品列表
      orderItems: [],
      orderStatusImgs: {
        // 已退款
        '-2': statusImg_1,
        // 已取消
        '-1': statusImg_1,
        // 待支付
        '0': statusImg0,
        // 待发货
        '1': statusImg1,
        // 已发货
        '2': statusImg1,
        // 已收货
        '3': statusImg3,
        // 退货中
        '4': statusImg1,
        // 换货中
        '5': statusImg1,
        // 退款中
        '6': statusImg1,
        // 已完成
        '10': statusImg_1,
      },

      // 订单部分发货单列表
      orderExpressBill: [],
      // 订单赔付状态
      compensationStatus: {
        compensationIsOngoing: false,
        showCompensationApply: false,
        showCompensationHistory: false,
      },
    };
    // 订单Id
    this.id = '';
    this.btnLoading = false;
    this.clipboard = null;
    this.isMount = false;
  }

  componentDidMount() {
    const { id } = this.$router.params;
    this.id = id || '';
    this.onInitData();
  }

  componentDidShow() {
    if (!this.isMount) return;
    this.onInitData();
  }

  onInitData() {
    this.getOrderDetail();
    this.getOrderExpressBill();
    this.getOrderCompensationStatus();
  }

  // 获取订单发货单
  async getOrderExpressBill() {
    const res = await this.$api.mall.getOrderExpressBill({orderId: this.id})
    let data = res.data.data;
    for (let item of data) {
      item.isOpen = true;
    }
    this.setState({
      orderExpressBill: data,
    });
  }

  async getOrderCompensationStatus() {
    const res = await this.$api.mall.getOrderCompensationStatus({orderId: this.id})
    this.setState({
      compensationStatus: res.data.data,
    });
  }


  // 获取订单详情
  async getOrderDetail() {
    this.btnLoading = false;
    try {
      const res = await this.$api.mall.getOrderDetail({id: this.id})
      let data = res.data.data;
      this.setState({
        orderInfo: data,
        orderItems: data.orderItems,
      });
      this.isMount = true;
      this.setPageLoading(false)
    } catch (err) {
      this.isMount = true;
      this.setPageLoading(false)
    }
  }

  /**
   * 取消订单
   */
  async cancelOrder() {
    await this.$api.mall.cancelOrder({id: this.id})
    this.showToast('取消成功')
    this.getOrderDetail()
  }

  /**
   * 订单提交重试
   */
  async orderRetryPrepay() {
    const { orderInfo } = this.state
    let params = {
      id: this.id,
      merchantType: 3,
      orderToken: orderInfo.orderToken
    }
    try {
      const res = await this.$api.mall.orderRetryPrepay(params)
      let data = res.data.data
      if (data.needPay) {
        let payParams = {
          token: data.payId,
        }
        this.payRequestParameter(payParams)
      } else {
        this.btnLoading = false;
        Taro.hideLoading();
        this.getOrderDetail();
      }
    } catch (err) {
      Taro.hideLoading();
      this.btnLoading = false;
      this.getOrderDetail()
    }
  }

  /**
   * 拼团订单提交重试
   */
  async groupOrderRetryPrepay() {
    const { orderInfo } = this.state
    let params = {
      id: this.id,
      merchantType: 3,
      orderToken: orderInfo.orderToken
    }
    try {
      const res = await this.$api.mall.groupOrderRetryPrepay(params)
      let data = res.data.data
      if (data.needPay) {
        let payParams = {
          token: data.payId,
        }
        this.payRequestParameter(payParams)
      } else {
        this.btnLoading = false;
        Taro.hideLoading();
        this.getOrderDetail();
      }
    } catch (err) {
      Taro.hideLoading();
      this.btnLoading = false;
      this.getOrderDetail()
    }
  }

  /**
   * 获取订单支付参数
   */
  async payRequestParameter(payParams: any) {
    try {
      let payRes = await this.$api.mall.payRequestParameter(payParams)
      let payData = payRes.data.data
      let params = {
        timeStamp: payData.timeStamp,
        nonceStr: payData.nonceString,
        package: payData.pack,
        signType: payData.signType,
        paySign: payData.paySign,
      }
      this.requestPayment(params)
    } catch (err) {
      Taro.hideLoading();
      this.btnLoading = false;
      this.getOrderDetail()
    }
  }
  /**
   * 发起支付
   */
  async requestPayment(params: any) {
    try {
      await this.$api.common.requestPayment(params)
      this.btnLoading = false;
      this.showToast('支付成功')
      this.getOrderDetail();
    } catch (err) {
      console.log(err)
      this.showToast('取消支付')
      Taro.hideLoading();
      this.btnLoading = false;
      this.getOrderDetail()
    }
  }

  /**
   * 点击底部按钮
   * @param type cancel 取消，pay 支付，compensate 赔付，
   */
  onClickAction(type: string) {
    console.log('type', type)
    if (this.btnLoading) return;

    if (type === 'cancel') {
      Taro.showModal({
        title: '提示',
        content: '是否取消该订单？',
      }).then(res => {
        if (res.confirm) {
          this.btnLoading = true;
          this.cancelOrder()
        }
      });
    } else if (type === 'pay') {
      this.btnLoading = true;
      Taro.showLoading();
      const { orderInfo } = this.state
      if (orderInfo.bizType == 1) this.orderRetryPrepay()
      if (orderInfo.bizType == 2) this.groupOrderRetryPrepay()
    } else if (type === 'compensate') {
      const { compensationStatus, orderInfo } = this.state;
      // 默认跳转申请赔付
      let url = `/pagesMine/mine/after-sale/compensate/index?id=${this.id}`;
      // 如果是赔付中或者有赔付记录，则跳转赔付记录页面
      if (compensationStatus.compensationIsOngoing || compensationStatus.showCompensationHistory) {
        let canApply = orderInfo.extra.compensationAmount < orderInfo.needPayTotalAmount ? 'yes' : 'no';
        url = `/pagesMine/mine/after-sale/compensate/result/index?id=${this.id}&canApply=${canApply}`;
      }
      this.navigateTo(url);
    } else if (type === 'home') {
      // 跳转首页
      let url = '/pages/index/index';
      this.switchTab(url);
    }
  }

  onClipboardData(type: string) {
    const { orderInfo } = this.state;
    let data = orderInfo[type];
    Taro.setClipboardData({
      data: data
    })
  }

  // 复制订单包裹中的数据
  onCopyExpressData(index: number, key: string) {
    const { orderExpressBill } = this.state;
    let item = orderExpressBill[index];
    let data = item[key];
    Taro.setClipboardData({
      data,
    });
  }

  // 是否展开对应包裹订单信息
  onClickAccordion(index: number) {
    let { orderExpressBill } = this.state;
    orderExpressBill[index].isOpen = !orderExpressBill[index].isOpen;
    this.setState({ orderExpressBill });
  }

  render() {
    const { orderItems, orderInfo, orderStatusImgs, orderExpressBill, compensationStatus, pageLoading } = this.state;
    return (
      <View className="page-order-detail">
        <LoadingBox visible={pageLoading} />
        <View className="order-state">
          <View className="content">
            <Text>订单</Text>
            <Text>{orderInfo.statusName}</Text>
            {orderInfo.status === 0 && orderInfo.payStatus === 1 && (
              <View className="time">
                <CountDown endTime={orderInfo.expireTime} styles="text" color="#fe4838" showHour={false} onEnd={this.getOrderDetail.bind(this)} />
                后订单自动关闭
              </View>
            )}
          </View>
          <View className="state-img">
            {orderInfo.id && <Image className="img" src={orderStatusImgs[orderInfo.status]} />}
          </View>
        </View>
        <View className="address-info">
          <View className="iconfont icon-address" />
          <View className="info-wrapper">
            <View className="user">
              <Text>收货人：</Text>
              <Text className="m-r-2">{orderInfo.receiver}</Text>
              <Text>{orderInfo.mobile}</Text>
            </View>
            <View className="address">
              <Text>地址：</Text>
              <Text>{orderInfo.province}</Text>
              <Text>{orderInfo.city}</Text>
              <Text>{orderInfo.area}</Text>
              <Text>{orderInfo.address}</Text>
            </View>
          </View>
        </View>
        {orderInfo.remark && (
          <View>
            {/* <Divider color="#f6f6f6" /> */}
            <DividingLine />
            <View className="cell-item">
              <View className="cell-item__title">订单备注</View>
              <View className="cell-item__content">{orderInfo.remark}</View>
            </View>
          </View>
        )}
        {/* <Divider color="#f6f6f6" /> */}
        <DividingLine />
        <View className="order-item-list">
          {orderItems.map((item: any) => {
            return (
              <View
                className="order-item"
                key={item.id}
                onClick={this.navigateTo.bind(this, `/pagesCommon/${orderInfo.bizType === 2 ? 'group-product' : orderInfo.bizType === 3 ? 'firend-help' : 'product'}/detail/index?id=${orderInfo.bizType === 2 ? item.businessId : orderInfo.bizType === 3 ? item.businessId : item.productId}`)}
              >
                <View className="cover">
                  {item.iconUrl && <Image className="img" mode="aspectFill" src={this.imgHost + item.iconUrl} />}
                </View>
                <View className="info">
                  <View className="info__name">{item.name}</View>
                  <View className="info__specs">{item.specs}</View>
                  <View className="info__price">
                    <View className="price">￥{util.filterPrice(item.nowPrice)}</View>
                    <View className="qty">x{item.qty}</View>
                  </View>
                </View>
              </View>
            );
          })}
          {orderInfo.id && (
            <View className="statistics">
              <View className="qty">
                <Text>共{orderInfo.qty}件商品</Text>
              </View>
              <View className="amount">
                <Text className="m-r-1">支付金额</Text>
                <Text>￥{util.filterPrice(orderInfo.needPayTotalAmount)}</Text>
              </View>
            </View>
          )}
          {orderInfo.discountAmount > 0 && (
            <View className="other-info">
              <Text className="m-r-1">会员已省</Text>
              <Text>￥{util.filterPrice(orderInfo.discountAmount)}</Text>
            </View>
          )}
          <View className="other-info">
            <View className="transportAmount">
              <Text className="m-r-1">快递费</Text>
              {orderInfo.transportAmount > 0 ? <Text>￥{util.filterPrice(orderInfo.transportAmount)}</Text> : <Text>包邮</Text>}
            </View>
          </View>
        </View>

        <DividingLine />

        <View className="order-info">
          <View className="title">订单信息</View>
          <View className="list-item">
            <View>订单编号</View>
            <View>
              <Text className="m-r-1">{orderInfo.orderNo}</Text>
              {orderInfo.orderNo && (
                <Text className="copy-btn" onClick={this.onClipboardData.bind(this, 'orderNo')}>
                  复制
                </Text>
              )}
            </View>
          </View>
          <View className="list-item">
            <View>创建时间</View>
            <View>{orderInfo.createTime}</View>
          </View>
          {orderInfo.logisticsCompany && (
            <View className="list-item">
              <View>物流配送</View>
              <View>{orderInfo.logisticsCompany}</View>
            </View>
          )}
          {orderInfo.logisticsNo && (
            <View className="list-item">
              <View>物流单号</View>
              <View>
                <Text className="m-r-1">{orderInfo.logisticsNo}</Text>
                <Text className="copy-btn" onClick={this.onClipboardData.bind(this, 'logisticsNo')}>复制</Text>
              </View>
            </View>
          )}
          {orderInfo.deliverTime && (
            <View className="list-item">
              <View>发货时间</View>
              <View>{orderInfo.deliverTime}</View>
            </View>
          )}
        </View>

        <DividingLine />

        {orderExpressBill.length > 0 && orderExpressBill.map((item, index) => {
          return (
            <AtAccordion
              className="order-accordion"
              open={item.isOpen}
              hasBorder
              onClick={this.onClickAccordion.bind(this, index)}
              title={`包裹 ${index + 1}`}
              key={item.id}
            >
              <View className="order-item-list accordion">
                {item.items.map((pItem: any) => {
                  return (
                    <View
                      className="order-item"
                      key={pItem.id}
                      onClick={this.navigateTo.bind(
                        this,
                        `/pagesCommon/product/detail/index?id=${pItem.productId}`,
                      )}
                    >
                      <View className="cover">
                        {pItem.icon && <Image className="img" mode="aspectFill" src={this.imgHost + pItem.icon} />}
                      </View>
                      <View className="info">
                        <View className="info__name">{pItem.name}</View>
                        <View className="info__specs">{pItem.spec}</View>
                        <View className="info__price">
                          <View className="qty">x{pItem.quantity}</View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View className="info-list">
                {item.expressCompany && (
                  <View className="list-item">
                    <View>物流配送</View>
                    <View>{item.expressCompany}</View>
                  </View>
                )}
                {item.expressNumber && (
                  <View className="list-item">
                    <View>物流单号</View>
                    <View>
                      <Text className="m-r-1">{item.expressNumber}</Text>
                      <Text className="copy-btn" onClick={this.onCopyExpressData.bind(this, index, 'expressNumber')}>复制</Text>
                    </View>
                  </View>
                )}
                {item.deliverTime && (
                  <View className="list-item">
                    <View>发货时间</View>
                    <View>{item.deliverTime}</View>
                  </View>
                )}
              </View>
            </AtAccordion>
          );
        })}

        <DividingLine />

        {orderInfo.status !== 0 ? (
          <View className="bottom-wrapper">
            {orderInfo.bizType !== 2 && compensationStatus.showCompensationApply && (
              <View className="action-btn" onClick={this.onClickAction.bind(this, 'compensate')}>
                申请赔付
              </View>
            )}
            {compensationStatus.compensationIsOngoing && <View className="action-btn no-border">赔付中...</View>}
            {compensationStatus.showCompensationHistory && (
              <View className="action-btn" onClick={this.onClickAction.bind(this, 'compensate')}>
                赔付详情
              </View>
            )}
            <View className="action-btn" onClick={this.onClickAction.bind(this, 'home')}>
              返回首页
            </View>
          </View>
        ) : (
          <View className="bottom-wrapper">
            <View className="action-btn" onClick={this.onClickAction.bind(this, 'home')}>
              返回首页
            </View>
            {orderInfo.payStatus !== 3 &&
              <View className="action-btn" onClick={this.onClickAction.bind(this, 'cancel')}>
                取消订单
              </View>
            }
            {orderInfo.payStatus === 1 &&
              <View className="action-btn primary" onClick={this.onClickAction.bind(this, 'pay')}>
                支付
              </View>
            }
          </View>
        )}
      </View>
    );
  }
}

export default OrderDetail
