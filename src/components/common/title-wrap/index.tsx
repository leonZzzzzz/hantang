import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

function TitleWrap(props: any): JSX.Element {
  let { titleData, navType } = props
  
  function navigateTo(): void {
    // if (titleData.type === 'switchTab') {

    // }
    // Taro.navigateTo({
    //   url: titleData.url
    // })
    // Taro.switchTab({
    //   url: titleData.url
    // })
    Taro[navType]({
      url: titleData.url
    })
  }

  return (
    <View className="title-wrap">
      <View className="left">
        <Text className={`iconfont ${titleData.icon}`}></Text>
        <Text className="title">{titleData.title}</Text>
        {titleData.desc &&
          <Text className="desc">{titleData.desc}</Text>
        }
      </View>
      <View className="more" onClick={navigateTo}>
        <Text className="desc">更多</Text>
        <Text className="iconfont iyoujiantou"></Text>
      </View>
    </View>
  )
}

TitleWrap.options = {
  addGlobalClass: true
}

TitleWrap.defaultProps = {
  navType: 'navigateTo',
  titleData: {}
}

export default TitleWrap