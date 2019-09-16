import { View, Text } from '@tarojs/components'
import Taro  from '@tarojs/taro'

import './index.scss'

function NewsItem(props: any): JSX.Element {

  const { item, index } = props

  const navigateTo = (): void => {
    Taro.navigateTo({
      url: '/pagesMine/mine/news/detail/index?id=' + item.id
    })
  }

  return (
    <View className={`news-item ${index !== 0 ? 'line': ''}`} onClick={navigateTo}>
      <View className="left">
        <View className="iconfont ixiaoxi1" />
        <View className="title-wrap">
          <View className="title">{item.title}</View>
          <View className="time">{item.time}</View>
        </View>
      </View>
      <View className="iconfont iyoujiantou right" />
    </View>
  )
}

NewsItem.options = {
  addGlobalClass: true
}

export default NewsItem