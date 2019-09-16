import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

function TravelsEvaluateItem(props: any): JSX.Element {

  let { item, index } = props

  const navigateTo = (): void => {
    Taro.navigateTo({
      url: `/pagesTravels/travels/image-detail/index?id=${item.id}&sort=${item.sort}`
    });
  }

  return (
    <View className={`travels-evaluate-item ${index % 2 === 0 ? 'travels-left' : ''}`} onClick={navigateTo}>
      <View className="cover">
        <Image src={item.iconUrl} mode="widthFix" />
      </View>
      <View className="travels-title-wrap">
        <View className="travels-title">{item.title}</View>
        <View className="user">
          <View className="user-left">
            <View className="head">
              <Image src={item.headImage} mode="widthFix" />
            </View>
            <View className="name">{item.author}</View>
          </View>
          <View className="user-right user-zan">
            {/* <Text className="iconfont ixihuan1" /> */}
            <Text className={`iconfont ${item.isPraise ? 'ixihuan1' : 'ixihuan'}`} />
            <Text>{item.praiseQuantity}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

TravelsEvaluateItem.options = {
  addGlobalClass: true
}


export default TravelsEvaluateItem