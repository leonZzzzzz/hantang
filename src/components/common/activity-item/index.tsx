import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'

import config from '@/config/index'

function ActivityItem(props: any): JSX.Element {

  let { item, index } = props

  const navigateTo = (): void => {
    Taro.navigateTo({
      url: '/pagesCommon/activity/detail/index?id=' + item.id
    })
  }

  return (
    <View className={`activity-item ${index !== 0 ? 'top-line': ''}`}  onClick={navigateTo}>
      <View className="left">
        <Image src={config.imgHost + item.iconUrl} mode="aspectFill"></Image>
      </View>
      <View className="right">
        <View className="top">
          <View className="title">{item.title}</View>
          <View className="time">
            {item.startTime &&
              <Text>{item.startTime.substring(0, 10)}</Text>
            }
            {/* <Text>234人已参加</Text> */}
          </View>
        </View>
        <View className="bottom">
          <View className="tag-list">
            <View className="tag">{item.tag}</View>
            <View className="tag">{item.tag}</View>
          </View>
          <View className="sign">我要报名</View>
        </View>
      </View>
    </View>
  )
}

ActivityItem.options = {
  addGlobalClass: true
}

ActivityItem.defaultProps = {
  item: {}
}

export default ActivityItem
