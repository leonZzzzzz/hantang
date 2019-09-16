import Taro, { Component, Config } from '@tarojs/taro'
import { View, Picker, Image, Text, Textarea, Button, Form } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, DividingLine } from '@/components';
import dot from '@/img/dot.png'

import util from '@/utils/util'

type StateType = {
  detail: any
  reason: any[]
  reasonIndex: number
  model: any
}

interface CancelSojournOrder {
  state: StateType
}


class CancelSojournOrder extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '取消订单',
  }

  constructor() {
    super()
    this.state = {
      detail: {},
      reason: [
        {
          name: '计划有变',
          type: 'plan_change',
        },
        {
          name: '商家取消行程',
          type: 'seller_cancel_depart',
        },
        {
          name: '其他',
          type: 'other',
        }
      ],
      // reason: ['计划有变', '商家取消行程', '其他'],
      reasonIndex: 0,
      model: {
        id: '',
        reason: '',
        reasonType: '',
      }
    }
  }

  componentWillMount() {
    let detail = Taro.getStorageSync('sojournOrderCancelItem')
    const { id } = this.$router.params
    let { model } = this.state
    model.id = id
    this.setState({
      detail,
      model,
    }, () => {
      Taro.removeStorage({key: 'sojournOrderCancelItem'})
    })
  }

  // 选择事件
  onPickerChange(e: { detail: { value: any; }; }) {
    let index = e.detail.value;
    let { model, reason } = this.state;
    model.reasonType = reason[index].type;
    this.setState({ 
      model,
      reasonIndex: index
    });
  }

  onInputChange(e: { detail: { value: any; }; }) {
    let value = e.detail.value
    let { model } = this.state
    model.reason = value
    this.setState({
      model
    })
  }

  handleSubmit(e: any) {
    const { model } = this.state
    if (!model.reasonType) {
      this.showToast('请选择原因')
      return
    }
    if (model.reasonType === 'other' && !model.reason) {
      this.showToast('请输入原因')
      return
    }
    model.wxMiniFormId = e.detail.formId
    console.log(model)
    this.orderCancel(model)
  }

  async orderCancel(params: any) {
    const res = await this.$api.sojourn.orderCancel(params)
    this.showToast(res.data.message || '取消成功')
    this.navigateBack()
  }


  render() {
    const { detail, reason, reasonIndex, model } = this.state

    return (
      <View>
        <DividingLine />

        <View className="order-wrap">
          <View className="top">订单号：{detail.orderNumber}</View>
          <View className="content-group">
            <View className="cover">
              <Image src={this.imgHost + detail.cover} mode="aspectFill" />
            </View>
            <View className="info-wrap">
              <View className="info">
                <View className="title">{detail.title}</View>
                <View className="unit">出发日期：{detail.departDate}</View>
              </View>
              <View className="price">{util.filterPrice(detail.amount)}</View>
            </View>
          </View>
        </View>

        <DividingLine />

        <View className="cancel-wrap">
          <View className="item">
            <View className="label">取消原因</View>
            <View className="content">
              <Picker
                className="picker"
                mode="selector"
                range={reason}
                rangeKey="name"
                value={reasonIndex}
                onChange={this.onPickerChange.bind(this)}
              >
                <View className="picker__inner">
                  {model.reasonType ? (
                    <Text className="value">{reason[reasonIndex].name}</Text>
                  ) : (
                    <Text className="placeholder">请选择</Text>
                  )}
                  <Text className="iconfont ixiajiantou" />
                </View>
              </Picker>
            </View>
          </View>
          {model.reasonType === 'other' &&
            <View className="remarks-wrap">
              <View className="label">其他原因</View>
              <Textarea
                className="textarea"
                maxlength={300}
                disabled={model.reasonType !== 'other'}
                value={model.reason}
                placeholder="请输入取消原因(选填,300字以内)"
                onInput={this.onInputChange.bind(this)}
              />
            </View>
          }
        </View>

        <View className="tip-wrap">
          <View className="title-wrap">
              <Image src={dot} mode="widthFix" className="dot" />
              <Text>改退政策</Text>
              <Image src={dot} mode="widthFix" className="dot" />
          </View>
          <View className="content">
          <View>出行前1天0点（含）之后退订，收取80%违约金；</View>
          <View>出行前1天0点至出行前7天0点（含）之间退订，收取50%违约金；</View>
          <View>出行前7天0点至出行前30天0点（含）之间退订，收取30%违约金；</View>
          </View>
        </View>

        <Form reportSubmit onSubmit={this.handleSubmit.bind(this)}>
          <Button className="btn" formType="submit">确定取消</Button>
        </Form>

        <LogoWrap />
      </View>
    )
  }
}

export default CancelSojournOrder