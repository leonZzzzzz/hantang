import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './index.scss'

import { Avatar } from '@/components/index'

import util from '@/utils/util'

function InviteItem(props: any): JSX.Element {

  const { item, index, type } = props

  return (
    <View className={`invite-item ${index !== 0 ? (type === 'white' ? 'white-line' : 'line') : ''} ${type}`}>
      <View className="left">

        <Avatar imgUrl={item.headImg} width={100} />

        <View className="info">
          <View className="title">{item.memberName}</View>
          <View className="time">{item.createTime}</View>
        </View>
      </View>
      <View className="right">
        <View className="price">
          奖励：￥{util.filterPrice(item.bounty)}
        </View>
        {item.status === 2 &&
          <View className="state">未发放</View>
        }
      </View>
    </View>
  )
}

InviteItem.defaultProps = {
  item: {},
  type: '',
}

export default InviteItem