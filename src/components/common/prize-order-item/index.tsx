import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

import { CountDown } from '@/components/index'

import config from '@/config/index'

function PrizeOrderItem(props: any): JSX.Element {

  let { item } = props

  const status = {
    notStart: '未抽奖',
    new: '未兑奖',
    checked: '已兑奖',
  }

  return (
    <View className="prize-order-item">
      <View className="info-wrap">
        <View className="cover">
          <Image src={config.imgHost + item.icon} mode="aspectFill" />
        </View>
        <View className="title-wrap">
          <View className="title">{item.title}</View>
          <View className={`type ${(item.status === 'notStart' || item.status === 'new') ? 'yellow' : ''}`}>{status[item.status]}</View>
        </View>
      </View>
      <View className="bottom-wrap">
        {item.status === 'notStart' ?
          <View className="down-wrap">
            <CountDown endTime={item.endTime} className="orange" />
            <Text className="text">后过期</Text>
          </View>
          :
          <View className="prize-text">奖品：{item.lotteryResult.lotteryItemTitle}</View>
        }
        <View className="btn-wrap">
          {item.status === 'notStart' &&
            <Button className="b-item" plain>去抽奖</Button>
          }

          {(item.status === 'new' || item.status === 'checked') &&
            <Button className="b-item border" plain>查看奖品</Button>
          }
        </View>
      </View>
    </View>
  )
}

PrizeOrderItem.defaultProps = {
  item: {},
}

PrizeOrderItem.options = {
  addGlobalClass: true
}

export default PrizeOrderItem