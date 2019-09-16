import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import './index.scss'

import { TitleWrap, GroupJourneyItem } from '@/components/index'

function GroupJourneyWrap(props: any): JSX.Element {
  
  let titleData: any = {
    title: '旅居拼团',
    desc: '超高性价比旅游',
    icon: 'ichaozhipintuan',
    url: '/pagesCommon/group-product/index?current=1'
  }

  let { groupData } = props

  return (
    <View className="group-wrap">
      <TitleWrap titleData={titleData} />

      <ScrollView className="list" scrollX>
        {groupData.length && groupData.map((item: any, index: number) => {
          return <GroupJourneyItem item={item} index={index} key={item.id} />
        })}
      </ScrollView>
    </View>
  )
}

GroupJourneyWrap.defaultProps = {
  groupData: []
}

export default GroupJourneyWrap