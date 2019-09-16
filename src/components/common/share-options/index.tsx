import { View } from '@tarojs/components'

import './index.scss'

function ShareOptions(props: any): JSX.Element {

  const { onHandleShare } = props

  const shareBar = [
    {
      id: 1,
      name: '分享给好友',
      icon: 'icon-share',
      type: 'firend',
    },
    {
      id: 2,
      name: '生成小海报',
      icon: 'icon-share',
      type: 'poster'
    }
  ]

  const clickShareBar = (item: any): void => {
    onHandleShare && onHandleShare(item.type)
  }

  return (
    <View className="share-dialog">
      {shareBar && shareBar.map((item: any) => {
        return (
          <View 
            className="item" 
            key={item.id} 
            onClick={() => clickShareBar(item)}
          >
            <View className={`iconfont ${item.icon}`} />
            <View>{item.name}</View>
          </View>
        )
      })}
    </View>
  )

}

ShareOptions.options = {
  addGlobalClass: true
}

export default ShareOptions