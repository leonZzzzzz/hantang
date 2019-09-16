import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'

import { LoadingBox } from '@/components';

import ParserRichText from '@/components/ParserRichText/parserRichText'

type StateType = {
  pageLoading: boolean
  content: string
}

interface About {
  state: StateType
}

class About extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '关于我们',
  }

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      content: ''
    }
  }

  componentWillMount() {
    this.aboutUs()
  }

  async aboutUs() {
    const res = await this.$api.mine.aboutUs()
    let data = res.data.data
    this.setState({
      content: data.content
    })
    this.setPageLoading(false)
  }

  render() {
    const { content, pageLoading } = this.state

    return (
      <View className="about">
        <LoadingBox visible={pageLoading} />

        <View className="title">汉唐华盛简介</View>
        <View>
          <ParserRichText html={content} show-with-animation animation-duration="500" selectable />
        </View>
      </View>
    )
  }
}

export default About