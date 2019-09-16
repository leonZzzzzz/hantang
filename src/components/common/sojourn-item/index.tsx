import { View, Text, Image, Video } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

import config from '@/config/index'

function SojournItem(props: any): JSX.Element {

  let { item, index, isDetele, onDelete } = props

  const navigateTo = () => {
    // e && e.stopPropagation();
    Taro.navigateTo({ 
      url: `/pagesSojourn/sojourn/introduce/index?id=${item.id}`
    })
  }

  const handleDetele = (e: any) => {
    e.stopPropagation()
    onDelete && onDelete(item.id)
  }

  return (
    <View 
      className={`sojourn-item ${index !== 0 ? 'top-line': ''}`}
      onClick={navigateTo}
    >
      {/* {item.videoUrl ?
        <Video className="video" src={config.imgHost + item.videoUrl} />
        :
        <View className="image-wrap" onClick={navigateTo}>
          {item.iconUrl && item.iconUrl.split(';').map((img: string) => {
            return (
              <View className="image" key={img}>
                <Image src={config.imgHost + img} mode="aspectFill" />
              </View>
            )
          })}
        </View>
      } */}
      <View className="image-cover">
        <Image src={config.imgHost + item.iconUrl} mode="aspectFill" />
      </View>

      <View className="bottom">
        <View className="title">{item.name}</View>
        <View className="desc">{item.desc} </View>
        <View className="bottom">
          <View className="tag-wrap">
            {item.tags && item.tags.split(';').map((tag: string) => {
              return (
                tag && <Text className="tag" key={tag}>{tag}</Text>
                )
            })}
          </View>
          {isDetele ? 
            <View className="iconfont ilajitong delete" onClick={handleDetele} />
            :
            <View className="num">{item.viewCount || 0}人已阅</View>
          }
        </View>
      </View>
    </View>
  )
}

SojournItem.defaultProps = {
  item: {},
  index: 0,
  isDetele: false,
}

SojournItem.options = {
  addGlobalClass: true
}

export default SojournItem