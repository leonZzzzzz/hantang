import { View, Image, Video, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './index.scss'

function VideoItem(props: any): JSX.Element {

  let { item } = props

  const navigateTo = (): void => {
    Taro.navigateTo({
      url: `/pagesTravels/travels/video-detail/index?id=${item.id}&sort=${item.sort}`
    });
  }

  return (
    <View className="video-item">
      {/* <Video src={item.iconUrl} /> */}
      <View className="top">
        <View className="cover">
          {/* <Image src={item.iconUrl} mode="aspectFill" /> */}
          <Video src={item.iconUrl} />
        </View>
        <View className="title">{item.title}</View>
        <View className="info">
          <View className="head">
            <Image src={item.headImage} />
          </View>
          <View className="name">{item.author}</View>
        </View>
        {/* <View className="time">12:45</View> */}
      </View>
      <View className="bottom">
        <View className="num" onClick={navigateTo}>{item.playTimes}次播放</View>
        <Button className="share" openType="share" data-title={item.title} data-coverUrl={item.iconUrl}>
          <Text className="iconfont iweixin" />
          <Text>分享</Text>
        </Button>
      </View>
    </View>
  )
}

VideoItem.options = {
  addGlobalClass: true
}

VideoItem.defaultProps = {
  item: {},
}

export default VideoItem