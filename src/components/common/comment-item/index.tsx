import { View, Text } from '@tarojs/components'

import './index.scss'

import { Avatar } from '@/components/index'

function CommentItem(props: any): JSX.Element {

  let { item, index } = props

  return (
    <View className={`comment-item ${index !== 0 ? 'top-line' : ''}`}>
      <Avatar imgUrl={item.memberHeadImage} width={80} style={{flexShrink: 0}} />
      <View className="content-wrap">
        <View className="name">{item.memberName}</View>
        <View className="time">{item.createTime && item.createTime.substring(0, 16)}</View>
        <View className="content">{item.content}</View>
        <View className="reply-wrap">
          {item.reply && item.reply.length && item.reply.map((reply: any) => {
            return (
              <View className="reply-item" key={reply.id}>
                <View className="reply-name">{reply.name}：</View>
                <View className="reply-content">{reply.content}</View>
              </View>
            )
          })}
          {/* <View className="more-reply">
            <Text>查看2条回复</Text>
            <Text className="iconfont iyoujiantou" />
          </View> */}
        </View>
      </View>
    </View>
  )
}

CommentItem.defaultProps = {
  item: {}
}

CommentItem.options = {
  addGlobalClass: true
}

export default CommentItem