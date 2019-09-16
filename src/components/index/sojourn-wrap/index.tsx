import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

import { TitleWrap, SojournItem } from '@/components/index'

function SojournWrap(props: any): JSX.Element {
  let titleData: any = {
    title: '热门旅居',
    desc: '不知道去哪?看这里',
    icon: 'iremenlvju',
    url: '/pages/sojourn/index'
  }

  let { sojourn } = props

  return (
    <View className="sojourn-wrap">
      <TitleWrap titleData={titleData} navType="switchTab" />
      {sojourn.length && sojourn.map((item: any, index: number) => {
        return <SojournItem item={item} index={index} key={item.id} />
      })}
    </View>
  )
}

SojournWrap.defaultProps = {
  sojourn: []
}

export default SojournWrap