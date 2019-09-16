import Taro, { Config } from '@tarojs/taro'
import { View, Text, Input, Switch, Button, Form } from '@tarojs/components'
import { AtInputNumber } from 'taro-ui'
import './index.scss'

import util from '@/utils/util'

import { DividingLine, LoadingBox } from '@/components/index'

import BaseComponent from '@/utils/components'

type StateType = {
  pageLoading: boolean;
  detail: any
  checked: boolean;
  model: any
}

interface SubmitOrder {
  state: StateType
}

class SubmitOrder extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '提交订单'
  }

  id: string
  type: string
  orderId: string

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      detail: {},
      model: {
        travellerQuantity: 1,
        travellers: [
          {
            name: '',
            mobile: '',
            idcard: '',
          }
        ]
      },
      checked: false,
    }
    this.id = ''
    this.type = ''
    this.orderId = ''
  }

  componentWillMount() {
    const { id, type, selectId, organizeOrderId, orderId } = this.$router.params
    let { model } = this.state
    if (organizeOrderId) model.organizeOrderId = organizeOrderId
    
    if (type === 'group') model.groupShoppingItemId = selectId
    else model.journeyGoodsId = selectId
    this.setState({
      model
    })
    this.id = id
    this.type = type
    if (orderId) {
      this.orderId = orderId
      this.orderGet(selectId)
    }
    id && this.journeyProductDetail(id)
  }

  /**
   * 商品详情
   * @param id 详情id
   */
  async journeyProductDetail(id: string): Promise<any> {
    let params: any = {}
    if (this.type === 'group') params.groupShoppingId = id
    else params.id = id
    let type = this.type === 'group' ? 'journeyGroupProductDetail' : 'journeyProductDetail'
    let res = await this.$api.sojourn[type](params)
    console.log('journeyProductDetail', res.data)
    this.setState({
      detail: res.data.data
    })
    this.setPageLoading(false)
  }

  /**
   * 订单详情
   */
  async orderGet(selectId: string) {
    const res = await this.$api.sojourn.orderGet({id: this.orderId})
    let data = res.data.data
    data.journeyGoodsId = selectId
    delete data.productId
    this.setState({
      model: data
    })
  }

  onChangeQty(qty: number): void {
    this.setState((preState: any) => {
      preState.model.travellerQuantity = qty
    })
  }
  handleInput(type: string, index: number, e: any) {
    const value = e.detail.value
    this.setState((preState: any) => {
      preState.model.travellers[index][type] = value
    })
  }

  handleChange(e: any): void {
    this.setState({ checked: e.detail.value })
  }

  handleSubmit(e: any) {
    const { model } = this.state
    model.wxMiniFormId = e.detail.formId
    if (model.travellerQuantity !== model.travellers.length) {
      this.showToast('请添加出行人信息')
      return
    }
    for (let i = 0; i < model.travellers.length; i++) {
      const item = model.travellers[i]
      if (!item.name) {
        this.showToast('请输入出行人姓名')
        return
      }
      if (!item.name) {
        this.showToast('请输入出行人手机')
        return
      }
    }

    console.log(model)
    if (this.orderId) this.orderUpdate(model)
    else if (model.organizeOrderId) this.journeyGroupOrderJoin(model)
    else if (this.type === 'group') this.journeyGroupOrderOrganize(model)
    else this.orderInsert(model)
  }

  /**
   * 单独购买
   * @param params 
   */
  async orderInsert(params: any) {
    const res = await this.$api.sojourn.orderInsert(params)
    console.log(res.data.data)
    const model = {
      id: res.data.data.id,
      walletAmount: 0,
    }
    this.orderPay(model)
  }
  /**
   * 订单修改
   * @param params 
   */
  async orderUpdate(params: any) {
    const res = await this.$api.sojourn.orderUpdate(params)
    console.log(res.data.data)
    const model = {
      id: this.orderId,
      walletAmount: 0,
    }
    this.orderPay(model)
  }
  
  /**
   * 组团下单
   * @param params 
   */
  async journeyGroupOrderOrganize(params: any) {
    const res = await this.$api.sojourn.journeyGroupOrderOrganize(params)
    console.log(res.data.data)
    const model = {
      id: res.data.data.id,
      walletAmount: 0,
    }
    this.orderPay(model)
  }
  /**
   * 参团下单
   * @param params 
   */
  async journeyGroupOrderJoin(params: any) {
    const res = await this.$api.sojourn.journeyGroupOrderJoin(params)
    console.log(res.data.data)
    const model = {
      id: res.data.data.id,
      walletAmount: 0,
    }
    this.orderPay(model)
  }


  async orderPay(params: any) {
    const res = await this.$api.sojourn.orderPay(params)
    console.log(res.data.data)
    let data = res.data.data
    const model = {
      timeStamp: data.timeStamp,
      nonceStr: data.nonceString,
      package: data.pack,
      signType: data.signType,
      paySign: data.paySign,
    }
    this.requestPayment(model, data.orderId)
  }

  async requestPayment(params: any, orderId: string) {
    try {
      await this.$api.common.requestPayment(params)
      // console.log(res.data.data)
      // this.navigateTo('/pagesCommon/pay-result/index?type=success')

      setTimeout(() => {
        // let url = `/pagesMine/mine/order/detail/index?id=${orderId}`;
        let url = `/pagesCommon/pay-result/index?type=success`;
        if (this.type === 'group') url = `/pagesCommon/join-group/index?id=${orderId}&type=sojourn`;
        Taro.redirectTo({ url });
        Taro.hideLoading();
      }, 1000);

    } catch (err) {
      console.log(err)

      this.showToast('取消支付')
      let url = `/pagesMine/mine/sojourn-order/index`;
      // let url = `/pagesMine/mine/sojourn-order/detail/index?id=${orderId}`;
      Taro.redirectTo({ url });
    }
  }

  render() {
    const { pageLoading, detail, model, checked } = this.state

    return (
      <View className="page">
        <LoadingBox visible={pageLoading} />

        <View className="title-wrap">
          <View>{detail.title}</View>
          <View className="desc">
            <Text>费用说明
              <Text className="iconfont iyoujiantou" />
            </Text>
          </View>
        </View>

        {/* <DividingLine /> */}

        <View className="travel-time-wrap d-line">
          <View className="title-wrap">
            <View className="title">选择出行时间</View>
            <View className="t-desc">注：请在出行日期前1天的23点前预定</View>
          </View>
          <View className="group">
            {detail.dateList.map((item: any, index: number) => {
              return (
                <View className={`item ${index % 4 === 0 ? 'left' : ''} ${(model.groupShoppingItemId || model.journeyGoodsId) === (item.groupShoppingItemId || item.id) ? 'select' : '' }`} key={item.id}>
                  <View className="date">{item.departDate}</View>
                  {/* <View className="price">￥{util.filterPrice(item.price)}</View> */}
                </View>
              )
            })}
          </View>
          <View className="num-wrap">
            <View>出行人数</View>
            <AtInputNumber
                className="number"
                type="number"
                min={1}
                step={1}
                value={model.travellerQuantity}
                onChange={this.onChangeQty.bind(this)}
              />
          </View>
        </View>

        <DividingLine />

        <View className="info-wrap">
          <View className="title">出行人信息</View>
          {model.travellers && model.travellers.length && 
            model.travellers.map((item: any, index: number) => {
              return (
                <View className="group" key={item.id}>
                  <View className="item">
                    <View className="label">姓名</View>
                    <Input placeholder="请输入姓名" value={item.name} onInput={this.handleInput.bind(this, 'name', index)} />
                  </View>
                  <View className="item">
                    <View className="label">手机</View>
                    <Input placeholder="请输入手机" type="number" value={item.mobile} onInput={this.handleInput.bind(this, 'mobile', index)} />
                  </View>
                  <View className="item">
                    <View className="label">身份证号</View>
                    <Input placeholder="选填，可待管家确认再录入" type="idcard" value={item.idcard} onInput={this.handleInput.bind(this, 'idcard', index)} />
                  </View>
                </View>
              )
            })
          }
        </View>

        <DividingLine />

        <View className="balance-wrap">
          <View>余额（￥0）</View>
          <Switch checked={checked} disabled={true} color="red" onChange={this.handleChange} />
        </View>

        <DividingLine />

        <View className="gaitui-wrap">
          <View className="title">改退政策</View>
          <View className="content">
            <View>出行前1天0点（含）之后退订，收取80%违约金；</View>
            <View>出行前1天0点至出行前7天0点（含）之间退订，收取50%违约金；</View>
            <View>出行前7天0点至出行前30天0点（含）之间退订，收取30%违约金；</View>
          </View>
        </View>

        <View className="xieyi-wrap">
          {/* <Text className="iconfont igouxuan1" /> */}
          <Text className="iconfont ifeigouxuan" />
          <Text>我已阅读并接受</Text>
          <Text className="blue">《汉唐华盛旅居用户须知》</Text>
        </View>

        <DividingLine height={110} />

        <Form reportSubmit onSubmit={this.handleSubmit.bind(this)}>
          <View className="bottom-wrap">
            <View className="left">
              <View className="top">
                <Text>合计：</Text>
                <Text className="price">{util.filterPrice(detail.groupPrice || detail.price)}</Text>
              </View>
              {/* <View className="sheng">会员已省￥20.00</View> */}
            </View>
            <Button 
              className="jiesuan"
              formType="submit"
            >提交订单</Button>
          </View>
        </Form>
      </View>
    )
  }
}


export default SubmitOrder