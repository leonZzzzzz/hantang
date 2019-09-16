import { View, Image } from '@tarojs/components'
import { useMemo } from '@tarojs/taro'

import './index.scss'

function Avatar(props: any): JSX.Element {

  let { imgUrl, width, style, onEvent } = props

  // let styles = {
  //   width: width + 'rpx',
  //   height: width + 'rpx',
  //   ...style
  // }

  const setStyles = (width: number) => {
    return {
      width: width + 'rpx',
      height: width + 'rpx',
      ...style
    }
  }

  const styles = useMemo(() => setStyles(width), [props.width])

  const handleClick = () => {
    onEvent && onEvent()
  }

  return (
    <View className="head-wrap" style={styles} onClick={handleClick}>
      <Image src={imgUrl} mode="widthFix" />
    </View>
  )
}

Avatar.defaultProps = {
  imgUrl: '',
  width: 50,
  style: {},
}

export default Avatar