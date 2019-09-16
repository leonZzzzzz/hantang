import { View, Text } from '@tarojs/components'
import './index.scss'

function OpenVip(): JSX.Element {

  return (
    <View className="open-wrap">
      <View className="left">
        <Text className="iconfont iVIP"></Text>
        <Text>开通会员送现金大礼</Text>
      </View>
      <View className="right">
        <Text>立即开通</Text>
        <Text className="iconfont iyoujiantou"></Text>
      </View>
    </View>
  )
}

OpenVip.options = {
  addGlobalClass: true
}

export default OpenVip