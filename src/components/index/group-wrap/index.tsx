import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import './index.scss'

import { TitleWrap, GroupProductItem } from '@/components/index'

function GroupWrap(props: any): JSX.Element {
  
  let titleData: any = {
    title: '超值拼团',
    desc: '低价到无法想象',
    icon: 'ichaozhipintuan',
    url: '/pagesCommon/group-product/index'
  }

  let { groupProductData } = props

  return (
    <View className="group-wrap">
      <TitleWrap titleData={titleData} />

      <ScrollView className="list" scrollX>
        {groupProductData.length && groupProductData.map((item: any, index: number) => {
          return <GroupProductItem item={item} index={index} key={item.id} />
        })}
      </ScrollView>
    </View>
  )
}

GroupWrap.defaultProps = {
  groupProductData: []
}

export default GroupWrap