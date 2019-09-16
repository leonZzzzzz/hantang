import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';

import './index.scss';

import { CountDown, DividingLine, LoadingBox } from '@/components/index';
import BaseComponent from '@/utils/components'

import statusImg_1 from './img/status-1.png';
import statusImg0 from './img/status0.png';
import statusImg1 from './img/status1.png';
import statusImg3 from './img/status3.png';

type StateType = {
  pageLoading: boolean
  orderInfo: any
  orderItems: any
  orderStatusImgs: any
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
    this.getOrderDetail();
  }

  componentDidShow() {
    if (!this.isMount) return;
    this.getOrderDetail();
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
      setTimeout(() => {
        orderInfo.orderToken = err.data.data.orderToken;
        this.setState({
          orderInfo: orderInfo,
        }, () => {
          Taro.hideLoading();
          this.btnLoading = false;
        });
      }, 2000);
    }
  }
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
      this.state.orderInfo.orderToken = err.data.data.orderToken;
      this.setState({
        orderInfo: this.state.orderInfo,
      }, () => {
        Taro.hideLoading();
        this.btnLoading = false;
      });
    }
  }
  async requestPayment(params: any) {
    try {
      await this.$api.common.requestPayment(params)
      this.btnLoading = false;
      Taro.hideLoading();
      this.getOrderDetail();
    } catch (err) {
      console.log(err)
      this.showToast('取消支付')
      this.state.orderInfo.orderToken = err.data.data.orderToken;
      this.setState({
        orderInfo: this.state.orderInfo,
      }, () => {
        Taro.hideLoading();
        this.btnLoading = false;
      });
    }
  }

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
      this.orderRetryPrepay()
    } else if (type === 'list') {
      // 跳转订单列表
      let url = '/pages/mine/order/index';
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
    }).then(() => {
      Taro.getClipboardData({
        success: (getres: any) => {
          console.log(getres.data);
        },
      });
    })
  }

  render() {
    const { orderItems, orderInfo, orderStatusImgs, pageLoading } = this.state;
    return (
      <View className="page-order-detail">
        <LoadingBox visible={pageLoading} />
        <View className="order-state">
          <View className="content">
            <Text>订单</Text>
            <Text>{orderInfo.statusName}</Text>
            {orderInfo.status === 0 && (
              <View className="time">
                {/* <Countdown targetTime={orderInfo.expireTime} color="#fe4838" showHour={false} /> */}
                <CountDown endTime={orderInfo.expireTime} styles="text" color="#fe4838" showHour={false} />
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
          {orderItems.map(item => {
            return (
              <View
                className="order-item"
                key={item.id}
                onClick={this.navigateTo.bind(this, `/pages/mall/product-detail/index?id=${item.productId}`)}
              >
                <View className="cover">
                  {item.iconUrl && <Image className="img" mode="aspectFill" src={this.imgHost + item.iconUrl} />}
                </View>
                <View className="info">
                  <View className="info__name">{item.name}</View>
                  <View className="info__specs">{item.specs}</View>
                  <View className="info__price">
                    <View className="price">￥{item.nowPrice / 100 || 0}</View>
                    <View className="qty">x{item.qty}</View>
                  </View>
                </View>
              </View>
            );
          })}
          <View className="statistics">
            <View className="qty">
              <Text>共{orderInfo.qty}件商品</Text>
            </View>
            {/* <View className="amount">
              <Text>订单金额</Text>
              <Text>￥{orderInfo.totalAmount / 100 || 0}</Text>
            </View>
            <View className="amount">
              <Text>优惠金额</Text>
              <Text>￥{orderInfo.discountAmount / 100 || 0}</Text>
            </View> */}
            <View className="amount">
              <Text className="m-r-1">支付金额</Text>
              <Text>￥{orderInfo.needPayTotalAmount / 100 || 0}</Text>
            </View>
          </View>
          {orderInfo.discountAmount > 0 && (
            <View className="other-info">
              <Text className="m-r-1">会员已省</Text>
              <Text>￥{orderInfo.discountAmount / 100 || 0}</Text>
            </View>
          )}
          <View className="other-info">
            <View className="transportAmount">
              <Text className="m-r-1">快递费</Text>
              {orderInfo.transportAmount > 0 ? (
                <Text>￥{orderInfo.transportAmount / 100 || 0}</Text>
              ) : (
                <Text>包邮</Text>
              )}
            </View>
          </View>
        </View>
        {/* <Divider color="#f6f6f6" /> */}
        <DividingLine />
        <View className="order-info">
          <View className="title">订单信息</View>
          <View className="list-item">
            <View>订单编号</View>
            <View>
              <Text className="m-r-1">{orderInfo.orderNo}</Text>
              {process.env.TARO_ENV === 'weapp' ? (
                <Text className="copy-btn" onClick={this.onClipboardData.bind(this, 'orderNo')}>
                  复制
                </Text>
              ) : (
                <Text className="copy-btn" data-clipboard-text={orderInfo.orderNo}>
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
                {process.env.TARO_ENV === 'weapp' ? (
                  <Text className="copy-btn" onClick={this.onClipboardData.bind(this, 'logisticsNo')}>
                    复制
                  </Text>
                ) : (
                  <Text className="copy-btn" data-clipboard-text={orderInfo.logisticsNo}>
                    复制
                  </Text>
                )}
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
        {/* <Divider color="#f6f6f6" /> */}
        <DividingLine />
        {orderInfo.status !== 0 ? (
          <View className="bottom-wrapper">
            <View className="action-btn" onClick={this.onClickAction.bind(this, 'home')}>
              返回首页
            </View>
            {/* 暂时注释掉，避免从订单列表来回跳转导致页面栈溢出 */}
            {/* <View className="action-btn" onClick={this.onClickAction.bind(this, 'list')}>
              订单列表
            </View> */}
          </View>
        ) : (
          <View className="bottom-wrapper">
            <View className="action-btn" onClick={this.onClickAction.bind(this, 'home')}>
              返回首页
            </View>
            <View className="action-btn" onClick={this.onClickAction.bind(this, 'cancel')}>
              取消订单
            </View>
            <View className="action-btn primary" onClick={this.onClickAction.bind(this, 'pay')}>
              支付
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default OrderDetail
