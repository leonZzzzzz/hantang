import { View } from '@tarojs/components'
import './index.scss'

// import { useEffect } from "@tarojs/taro"

import ParserRichText from '../../ParserRichText/parserRichText'

function ContentWrap(props: any): JSX.Element {

  let { title, content } = props
  // console.log(props)

  // useEffect(() => {
  //   console.log(content)
  // }, [content])

  return (
    <View className="wrap">
      {title && <View className="title">{title}</View>}
      
      <View className="content">
        {/* <wxparser richText={content} /> */}
        <ParserRichText html={content} show-with-animation animation-duration="500" selectable />
      </View>
    </View>
  )
}

ContentWrap.defaultProps = {
  title: '',
  content: '',
}

ContentWrap.config = {
  usingComponents: {
    'wxparser': 'plugin://wxparserPlugin/wxparser'
  }
}

export default ContentWrap