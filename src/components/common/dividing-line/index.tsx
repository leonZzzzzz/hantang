import { View } from '@tarojs/components'
import './index.scss'

function DividingLine(props: any): JSX.Element {
  let { height } = props

  let style = {
    height: typeof height === 'string' ? height : (height > 0 ? height : 26) + 'rpx'
  }
  return (
    <View className="dividing-line" style={style}></View>
  )
}

DividingLine.defaultProps = {
  height: 0,
}

export default DividingLine