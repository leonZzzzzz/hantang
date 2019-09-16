import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import './index.scss'

import { GroupProductItem } from '@/components/index'

function RecommendWrap(props: any): JSX.Element {
  
  let { title, url, list } = props
  
  function toMore() {
    if (!url) return
    Taro.navigateTo({
      url
    })
  }

  return (
    <View className="recommend-wrap">
      <View className="recommend-title-wrap">
        <View>{title}</View>
        <View className="more" onClick={toMore}>
          <Text>更多</Text>
          <Text className="iconfont iyoujiantou"></Text>
        </View>
      </View>
      <ScrollView className="list" scrollX>
        {list.length && list.map((item: any, index: number) => {
          return <GroupProductItem item={item} index={index} key={item.id} />
        })}
      </ScrollView>
    </View>
  )
}

RecommendWrap.defaultProps = {
  title: '推荐商品',
  list: [],
  url: '',
}

RecommendWrap.options = {
  addGlobalClass: true
}

export default RecommendWrap