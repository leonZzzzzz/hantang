import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, ContentWrap, LoadingBox } from '@/components';

type StateType = {
  pageLoading: boolean
  detail: any
}

interface NewsDetail {
  state: StateType
}

class NewsDetail extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '消息详情',
  }

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      detail: {
        title: '消息详情标题消息详情标题消息详情标题消息详情标题消息详情标题消息详情标题',
        author: '作者',
        time: '2019-07-31 12:12:45',
        content: '哦i到覅送佛送i就是东方就到附近偶是佛'
      }
    }
  }

  componentWillMount() {
    const { id } = this.$router.params
    id && this.noticeDetail(id)
  }

  async noticeDetail(id: string): Promise<any> {
    const res = await this.$api.mine.noticeDetail({ id })
    this.setState({
      detail: res.data.data,
      pageLoading: false,
    })
    this.setPageLoading(false)
  }

  render() {
    const { detail, pageLoading } = this.state

    return (
      <View>
        <LoadingBox visible={pageLoading} />

        <View className="news-detail">
          <View className="title-wrap">
            <View className="title">{detail.title}</View>
            <View className="desc">
              <View>{detail.author}</View>
              <View>{detail.time}</View>
            </View>
          </View>
          <View>
            <ContentWrap content={detail.content} />
          </View>
        </View>

        <LogoWrap />
      </View>
    )
  }
}

export default NewsDetail