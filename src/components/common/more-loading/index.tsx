import { View } from '@tarojs/components'

import './index.scss'

function MoreLoading(): JSX.Element {

  return (
    <View>
      <View className="more-loading-text">加载更多...</View>
      {/* <View className="more-loading-text">暂无数据</View>
      <View className="more-loading-text">到底了</View> */}
    </View>
  )
}

export default MoreLoading