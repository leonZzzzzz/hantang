import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import { TitleWrap, ActivityItem } from '@/components/index'

function ActivityWrap(props: any): JSX.Element {
  
  let titleData: any = {
    title: '精彩活动',
    desc: '越活动越年轻',
    icon: 'ijingcaihuodong',
    url: '/pagesCommon/activity/index'
  }

  let { activityData } = props

  return (
    <View className="activity-wrap">
      <TitleWrap titleData={titleData} />

      <View className="assemble__list-wrap">
        {activityData.length && activityData.map((item: any, index: number) => {
          return <ActivityItem item={item} index={index} key={item.id} />
        })}
      </View>
    </View>
  )
}

ActivityWrap.defaultProps = {
  activityData: []
}

export default ActivityWrap