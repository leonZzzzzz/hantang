import Taro, { Config } from '@tarojs/taro'
import { View, Text, Textarea, Switch, Button, Form } from '@tarojs/components'

import './index.scss'
// import config from '@/config'
import BaseComponent from '@/utils/components'
import util from '@/utils/util'

import { AddressWrap, ConfirmOrderGoodsItem, DividingLine, LoadingBox } from '@/components/index'

type StateType = {
  pageLoading: boolean
  address: any
  model: any
  orderItems: any[]
  payment: any
}

interface ConfirmOrder {
  state: StateType
}

class ConfirmOrder extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '确认订单',
  }

  type: string
  id: string
  formId: string
  organizeOrderId: string
  isMount: boolean

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      // 收货地址
      address: {},
      // 支付数据
      model: {
        // 商品总数
        qty: 0,
        // 需支付金额
        totalAmount: 0,
        // 运费
        transportAmount: 0,
        // 钱包金额
        walletAmount: 0,
        // 订单令牌
        orderToken: '',
        // 备注
        remark: '',
      },
      // 支付方式
      payment: {
        wechat: true,
        wallet: false,
      },
      // 订单中的商品
      orderItems: [],
    }
    this.type = ''
    this.id = ''
    this.formId = ''
    this.organizeOrderId = ''
    this.isMount = false
  }

  componentWillMount() {
    const { id, formId, type, organizeOrderId } = this.$router.params
    console.log('confirm-order', organizeOrderId)
    if (organizeOrderId && organizeOrderId !== undefined) this.organizeOrderId = organizeOrderId
    this.type = type
    this.id = id
    this.formId = formId
    this.orderPrepare(type, id, formId)
    this.getAddressList()
  }

  componentDidShow() {
    if (this.isMount) {
      this.getAddressList()
    }
  }

  
  /**
   * 获取订单预览信息
   * @param id 订单ids
   */
  async orderPrepare(type: string, id: string, formId: string) {
    let params: any = {}
    if (type === 'group') {
      const storeId = Taro.getStorageSync('storeId')
      params.groupShoppingItemId = id
      params.storeId = storeId
      if (this.organizeOrderId) params.organizeOrderId = this.organizeOrderId
    } else if (type === 'help') {
      const storeId = Taro.getStorageSync('storeId')
      params.helpShoppingItemId = id
      params.storeId = storeId
    } else {
      params.orderItemIds = id
    }

    if (formId) params.wxMiniFormId = formId;
    let res = await this.$api.mall[type === 'group' ? 'groupOrderPrepare' : type === 'help' ? 'helpOrderPrepare' : 'orderPrepare'](params)
    console.log(res.data)
    let data = res.data.data
    let { model } = this.state
    model.qty = data.qty;
    model.totalAmount = data.totalAmount
    model.transportAmount = data.transportAmount
    model.walletAmount = data.walletAmount
    model.orderToken = data.orderToken
    this.setState({
      model,
      orderItems: data.stores[0].orderItems,
    })
    this.setPageLoading(false)
    this.isMount = true
  }

  /**
   * 获取地址列表
   */
  async getAddressList() {
    const res = await this.$api.mine.addressList()
    let address = Taro.getStorageSync('address')
    console.log('getStorageSync address', address)
    let list = res.data.data
    console.log('list address', list)
    let data = list.filter((res: any) => {
      return res.id = address.id
    })
    console.log('data address', data)
    if (data.length > 0) {
      this.setState({
        address: data[0],
      })
    } else {
      Taro.removeStorageSync('address')
      this.setState({
        address: {},
      })
    }
  }

  /**
   * 留言
   * @param e e.detail.value 输入值
   */
  handleInput(e: any) {
    this.setState((preState: any) => {
      preState.model.remark = e.detail.value
    })
  }


  // 支付方式
  onChangePayment(type: string, e: any) {
    let value = e.detail.value
    console.log(type, value)
    const { payment } = this.state;
    if (payment[type] === value) return;
    for (let key in payment) {
      if (key === type) payment[key] = value
      else payment[key] = !value
    }
    this.setState({ payment });
  }


  /**
   * 点击提交
   * @param e formId
   */
  async handleConfirmOrder(e: any) {
    const { address, payment } = this.state
    if (!address) {
      this.showToast('请选择收货地址')
      return;
    }
    let isUseWallet = payment.wallet
    if (isUseWallet) {
      let modelRes = await Taro.showModal({
        title: '支付提示',
        content: '是否使用余额支付',
      });
      if (modelRes.cancel) {
        return;
      }
    }
    // 支付渠道，cash：现金，wechat：微信。join：汇聚
    const payChannel = isUseWallet ? 'cash' : 'wechat';

    if (this.organizeOrderId) this.groupOrderJoin(payChannel, e.detail.formId)
    else if (this.type === 'group') this.groupOrderOrganize(payChannel, e.detail.formId)
    else if (this.type === 'help') this.helpOrderOrganize(payChannel, e.detail.formId)
    else this.orderPrepay(payChannel, e.detail.formId)
  }

  /**
   * 普通订单提交
   * @param payChannel 支付渠道，cash：现金，wechat：微信。join：汇聚
   * @param wxMiniFormId wxMiniFormId
   */
  async orderPrepay(payChannel: string, wxMiniFormId: string) {
    this.showLoading(true)
    const { address, model } = this.state
    let params = {
      orderItemIds: this.$router.params.id.split('_').join(','),
      addressId: address.id,
      orderToken: model.orderToken,
      remark: model.remark,
      merchantType: 3,
      payChannel,
      wxMiniFormId
    }
    try {
      const res = await this.$api.mall.orderPrepay(params)
      let data = res.data.data
      if (data.needPay) {
        let payParams = {
          token: data.payId,
        }
        this.payRequestParameter(payParams, data)
      }
    } catch (err) {
      console.log(err)
      const data = err.data.data;
      let { model } = this.state
      model.orderToken = data.orderToken
      this.setState({
        model
      }, () => {
        this.showLoading(false)
      })
    }
  }

  /**
   * 团长下单（发起拼团）
   * @param payChannel 支付渠道，cash：现金，wechat：微信。join：汇聚
   * @param wxMiniFormId wxMiniFormId
   */
  async groupOrderOrganize(payChannel: string, wxMiniFormId: string) {
    this.showLoading(true)
    const { address, model } = this.state
    let params = {
      orderToken: model.orderToken,
      payChannel,
      groupShoppingItemId: this.$router.params.id,
      storeId: Taro.getStorageSync('storeId'),
      serviceType: 3,
      addressId: address.id,
      remark: model.remark,
      wxMiniFormId
    }
    try {
      const res = await this.$api.mall.groupOrderOrganize(params)
      let data = res.data.data
      if (data.needPay) {
        let payParams = {
          token: data.payId,
        }
        this.payRequestParameter(payParams, data)
      }
    } catch (err) {
      console.log(err)
      const data = err.data.data;
      let { model } = this.state
      model.orderToken = data.orderToken
      this.setState({
        model
      }, () => {
        this.showLoading(false)
      })
    }
  }

  /**
   * 参团下单（参与拼团）
   * @param payChannel 支付渠道，cash：现金，wechat：微信。join：汇聚
   * @param wxMiniFormId wxMiniFormId
   */
  async groupOrderJoin(payChannel: string, wxMiniFormId: string) {
    this.showLoading(true)
    const { address, model } = this.state
    let params = {
      orderToken: model.orderToken,
      payChannel,
      groupShoppingItemId: this.$router.params.id,
      storeId: Taro.getStorageSync('storeId'),
      serviceType: 3,
      addressId: address.id,
      remark: model.remark,
      wxMiniFormId,
      organizeOrderId: this.organizeOrderId
    }
    try {
      const res = await this.$api.mall.groupOrderJoin(params)
      let data = res.data.data
      if (data.needPay) {
        let payParams = {
          token: data.payId,
        }
        this.payRequestParameter(payParams, data)
      }
    } catch (err) {
      console.log(err)
      const data = err.data.data;
      let { model } = this.state
      model.orderToken = data.orderToken
      this.setState({
        model
      }, () => {
        this.showLoading(false)
      })
    }
  }

  /**
   * 助力下单
   * @param payChannel 支付渠道，cash：现金，wechat：微信。join：汇聚
   * @param wxMiniFormId wxMiniFormId
   */
  async helpOrderOrganize(payChannel: string, wxMiniFormId: string) {
    this.showLoading(true)
    const { address, model } = this.state
    let params = {
      orderToken: model.orderToken,
      payChannel,
      helpShoppingItemId: this.$router.params.id,
      storeId: Taro.getStorageSync('storeId'),
      serviceType: 3,
      addressId: address.id,
      remark: model.remark,
      wxMiniFormId
    }
    try {
      const res = await this.$api.mall.helpOrderOrganize(params)
      let data = res.data.data
      if (data.needPay) {
        let payParams = {
          token: data.payId,
        }
        this.payRequestParameter(payParams, data)
      }
    } catch (err) {
      console.log(err)
      const data = err.data.data;
      let { model } = this.state
      model.orderToken = data.orderToken
      this.setState({
        model
      }, () => {
        this.showLoading(false)
      })
    }
  }

  async payRequestParameter(payParams: any, data: any) {
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
      this.requestPayment(params, data)
    } catch (err) {
      console.log(err)
      const data = err.data.data;
      let { model } = this.state
      model.orderToken = data.orderToken
      this.setState({
        model
      }, () => {
        this.showLoading(false)
      })
    }
  }
  
  async requestPayment(params: any, data: any) {
    try {
      await this.$api.common.requestPayment(params)

      // setTimeout(() => {
        let url = `/pagesMine/mine/order/detail/index?id=${data.orderId}`;
        if (this.type === 'group') url = `/pagesCommon/join-group/index?id=${data.orderId}`;
        if (this.type === 'help') url = `/pagesCommon/firend-help/index?id=${data.orderId}`;
        Taro.redirectTo({ url });
        Taro.hideLoading();
      // }, 1000);

    } catch (err) {
      console.log(err)
      this.showToast('取消支付')

      if (this.type === 'group' || this.type === 'help') {
        this.orderPrepare(this.type, this.id, this.formId)
      } else {
        let url = `/pagesMine/mine/order/detail/index?id=${data.orderId}`;
        Taro.redirectTo({ url });
      }
    }
  }

  render() {
    const { payment, model, orderItems, pageLoading, address } = this.state

    return (
      <View className="confirm-order">
        <LoadingBox visible={pageLoading} />

        <AddressWrap address={address} />

        <DividingLine />

        <View className="content">
          {orderItems.length && orderItems.map((item: any) => {
            return  <ConfirmOrderGoodsItem item={item} key={item.id} />
          })}
          <View className="payway-wrap">
            <View className="way">配送方式</View>
            <View>快递 {model.transportAmount > 0 ? `${util.filterPrice(model.transportAmount)}元` : '包邮'}</View>
          </View>
          <View className="comment-wrap">
          <View className="name">留言</View>
          {!pageLoading &&
            <Textarea 
              value={model.remark} 
              placeholder="说点什么吧~（选填，不可大于64字）" 
              maxlength={64}
              className="area"
              onInput={this.handleInput.bind(this)}
            />
          }
          </View>
        </View>

        <DividingLine />

        <View className="balance-wrap">
          <View>余额（￥{util.filterPrice(model.walletAmount)}）</View>
          <Switch checked={payment.wallet} disabled={model.walletAmount === 0} color="red" onChange={this.onChangePayment.bind(this, 'wallet')} />
        </View>

        <DividingLine height={136} />

        <Form reportSubmit onSubmit={this.handleConfirmOrder.bind(this)}>
          <View className="bottom-wrap">
            <View className="left">
              <View className="top">
                <Text>合计：</Text>
                <Text className="price">{util.filterPrice(model.totalAmount)}</Text>
              </View>
              {/* <View className="sheng">会员已省￥20.00</View> */}
            </View>
            <Button className="jiesuan" formType="submit">去结算</Button>
          </View>
        </Form>
      </View>
    )
  }
}


export default ConfirmOrder
