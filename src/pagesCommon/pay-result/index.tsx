import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'

import './index.scss'

import dot from '@/img/dot.png'
import success from '@/img/success.png'
import BaseComponent from '@/utils/components'

import { LogoWrap } from '@/components/index'

type StateType = {
  // travelTimeData: object[];
  // qty: number;
  // checked: boolean;
}

interface PayResult {
  state: StateType
}

class PayResult extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '支付结果'
  }

  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <View>
        <View className="page">
          <View className="icon-wrap">
            <View className="success-img">
              <Image src={this.imgHost + '/attachments/static/success.png'} mode="widthFix" />
            </View>
            <View className="text">支付成功</View>
          </View>
          <View className="btn-btn">
            <Button className="check" onClick={this.redirectTo.bind(this, '/pagesMine/mine/sojourn-order/index')}>查看订单</Button>
            <Button className="back" onClick={this.switchTab.bind(this, '/pages/index/index')}>返回首页</Button>
          </View>
          <View className="tip-wrap">
            <View className="title-wrap">
              <Image src={dot} mode="widthFix" className="dot" />
              <Text>温馨提示</Text>
              <Image src={dot} mode="widthFix" className="dot" />
            </View>
            <View className="content">
              <View>支付成功需提前2天预约出行时间；</View>
              <View>预约成功后，管家会致电确认；</View>
              <View>可在”我的“-”我的旅居“查看订单详情。</View>
            </View>
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

        </View>
        <LogoWrap />
      </View>
    )
  }
}


export default PayResult