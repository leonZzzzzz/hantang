import { View, Image, Text } from '@tarojs/components'
import './index.scss'

import { AtRate } from 'taro-ui';

function SmallEvaluateItem(props: any): JSX.Element {
  let src: string = 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132'

  let { item, index } = props

  return (
    <View className={`small-evaluate-item ${index === 0 ? 'no-left' : ''}`}>
      <View className="left">
        <View className="user">
          <View className="head-image">
            <Image src={item.headImage} mode="widthFix" />
          </View>
          <View className="info">
            <View className="name">{item.memberName}</View>
            {/* <View className="star">
              <Text className="iconfont ixingxing3"></Text>
              <Text className="iconfont ixingxing3"></Text>
              <Text className="iconfont iqumanmanbanxing"></Text>
            </View> */}
            <AtRate value={item.score} size={15} className="star" />
          </View>
        </View>
        <View className="comment">{item.content}</View>
      </View>
      {/* <View className="right">
        <Image src={src} mode="widthFix" />
      </View> */}
    </View>
  )
}

SmallEvaluateItem.options = {
  addGlobalClass: true
}

SmallEvaluateItem.defaultProps = {
  item: {}
}

export default SmallEvaluateItem