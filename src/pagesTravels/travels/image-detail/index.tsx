import Taro, { Config } from '@tarojs/taro'
import { View, Image, Text, ScrollView, Input, Button, Form, Textarea } from '@tarojs/components'
import './index.scss'

import { Avatar, DividingLine, LogoWrap, Dialog, CommentItem, LoadingBox, SojournItem } from '@/components/index'

import config from '@/config/index'
import BaseComponent from '@/utils/components'

type StateType = {
  pageLoading: boolean
  detail: any
  attachmentList: any[]
  commentVisible: boolean
  checkVisible: boolean
  commentList: any[]
  commentQuantity: number
  praiseQuantity: number
  shareQuantity: number
  comment: string
  isPraise: boolean
  isFocus: boolean
  sojournlist: any[]
  last: any
  next: any
}

interface ImageDetail {
  state: StateType
}

class ImageDetail extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '相片游记详情'
  }

  id: string
  searchData: any
  sort: number
  travelslist: any[]
  switchId: string

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      detail: {},
      attachmentList: [],
      comment: '',
      commentVisible: false,
      checkVisible: false,
      commentList: [],
      commentQuantity: 0,
      praiseQuantity: 0,
      shareQuantity: 0,
      isPraise: false,
      isFocus: false,
      sojournlist: [],
      last: {},
      next: {},
    }
    this.id = ''
  }

  componentWillMount() {
    const { id } = this.$router.params
    this.id = id
    this.travelsGet(id)
    this.base()
  }

  onShareAppMessage() {
    const { detail } = this.state
    return {
      title: detail.title,
      imageUrl: detail.iconUrl,
      path: '/pagesTravels/travels/image-detail/index?id=' + detail.id
    }
  }

  /**
   * 详情
   * @param id id
   */
  async travelsGet(id: string) {
    if (!id) return
    this.id = id
    this.setPageLoading(true)
    const res = await this.$api.travels.travelsGet({id})
    let data = res.data.data
    let details = data.details
    let last = data.last || {}
    let next = data.next || {}
    this.setNavTitle(details.title)
    this.setState({
      detail: details,
      attachmentList: details.attachmentList,
      isPraise: details.isPraise,
      commentQuantity: details.commentQuantity,
      praiseQuantity: details.praiseQuantity,
      shareQuantity: details.shareQuantity,
      last,
      next,
    }, () => {
      this.setPageLoading(false)
    })
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    this.commentPage(id)
  }

  // 预览轮播列表的大图
  previewImage = (index: number) => {
    const { attachmentList } = this.state
    if (!attachmentList) return
    let current = attachmentList[index].content
    let urls = attachmentList.map(item => item.content)
    Taro.previewImage({
      current,
      urls
    });
  }

  /**
   * 评论列表
   */
  async commentPage(sourceId: string) {
    const res = await this.$api.travels.commentPage({sourceId})
    this.setState({
      commentList: res.data.data.list,
      commentQuantity: res.data.data.total,
    })
  }

  /**
   * 新增评论
   * @param params params
   */
  async commentInsert(params: any) {
    await this.$api.travels.commentInsert(params)
    this.commentPage(this.id)
    this.handleComment(false)
    this.showToast('评论成功')
  }

  /**
   * 发布评论
   * @param e 
   */
  handleCommentSubmit(e: any) {
    console.log(e)
    const detail = e.detail 
    if (!detail.value.comment) {
      this.showToast('请输入内容')
      return false
    }
    let params = {
      sourceId: this.id,
      sourceType: 6,
      content: detail.value.comment,
      wxMiniFormId: detail.formId,
    }
    this.commentInsert(params)
  }

  /**
   * 评论框显示/隐藏
   * @param state 
   */
  handleComment(state: boolean): void {
    this.setState({
      commentVisible: state,
      isFocus: state,
    })
  }

  /**
   * 点赞
   */
  async handlePraise() {
    const { isPraise, praiseQuantity } = this.state
    let type = isPraise ? 'praiseDelete' : 'praiseInsert'
    let params = {
      sourceId: this.id,
      sourceType: 6
    }
    await this.$api.travels[type](params)
    this.setState({
      isPraise: !isPraise,
      praiseQuantity: isPraise ? (praiseQuantity - 1) : (praiseQuantity + 1)
    });
  }

  /**
   * 基地
   */
  async base() {
    let params = {
      pageNum: 1,
      pageSize: 5,
    }
    const res = await this.$api.sojourn.base(params)
    let data = res.data.data
    this.setState({
      sojournlist: data
    })
  }

  render() {
    let { pageLoading, detail, attachmentList, sojournlist, commentVisible, checkVisible, commentList, comment, commentQuantity, praiseQuantity, shareQuantity, isPraise, isFocus, last, next } = this.state

    return (
      <View>
        <LoadingBox visible={pageLoading} />

        <View className="detail">

          <View className="user">
            <View className="info">
              <Avatar width={50} imgUrl={detail.headImage} />
              <Text className="name">{detail.author}</Text>
            </View>
            <View className="time">{detail.createTime}</View>
          </View>

          <View className="cover">
            {attachmentList.map((item: any, index: number) => {
              return <Image src={item.content} mode="widthFix" key={item.id} onClick={this.previewImage.bind(this, index)} />
            })}
          </View>

          <View className="content-wrap">{detail.title}</View>
          <View className="content-wrap">{detail.content}</View>

          <View className="btn-wrap">

            <Button className="item" plain hoverClass="none" onClick={this.handlePraise.bind(this)}>
              <Text className={`iconfont ${isPraise ? 'ixihuan1' : 'ixihuan'}`} />
              <Text>{praiseQuantity}</Text>
            </Button>
            <Button className="item" plain hoverClass="none" onClick={this.handleComment.bind(this, true)}>
              <Text className="iconfont ipinglun" />
              <Text>{commentQuantity}</Text>
            </Button>
            <Button className="item" plain hoverClass="none" openType="share">
              <Text className="iconfont ifenxiang" />
              <Text>{shareQuantity}</Text>
            </Button>

          </View>
          
          {commentQuantity &&
            <View className="comment-wrap p-b">
              <View className="comment-content">
                {commentList.map((item: any, index: number) => {
                  return ( index < 5 &&
                    <View className="item" key={item.id}>
                      <Text className="name">{item.memberName}：</Text>
                      <Text>{item.content}</Text>
                    </View>
                  )
                })}
                <View 
                  className="more" 
                  onClick={this.setDialogVisible.bind(this, true, 'checkVisible')}>
                  <Text>更多评论</Text>
                  <Text className="iconfont iyoujiantou" />
                </View>
              </View>
            </View>
          }

          <View className="switch-wrap">
            <View 
              className="item" 
              onClick={this.travelsGet.bind(this, last.id ? last.id : '')}
            >
              <Text className="iconfont izuojiantou" />
              <Text className="arrow">上一篇</Text>
              <Text className="title">{last.title || '到头了'}</Text>
            </View>
            <View 
              className="item"
              onClick={this.travelsGet.bind(this, next.id ? next.id : '')}
            >
              <Text className="title">{next.title || '没有了'}</Text>
              <Text className="arrow">下一篇</Text>
              <Text className="iconfont iyoujiantou" />
            </View>
          </View>

          <DividingLine />

          {sojournlist.length > 0 &&
            <View className="recommend-wrap">
              <View className="title-wrap">
                <View>相关推荐</View>
                <View 
                  className="more"
                  onClick={this.switchTab.bind(this, '/pages/sojourn/index')}
                >
                  <Text>更多</Text>
                  <Text className="iconfont iyoujiantou" />
                </View>
              </View>
              <View className="list">
                {sojournlist.map((item: any, index: number) => {
                  return <SojournItem item={item} key={item.id} index={index} />
                })}
              </View>
            </View>
          }
        </View>

        <LogoWrap />

        {/* 发布评论 */}
        <Dialog
          visible={commentVisible}
          position="top"
          isMaskClick={false}
          onClose={this.handleComment.bind(this, false)}
        >
          <Form reportSubmit onSubmit={this.handleCommentSubmit.bind(this)}>
            <View className="comment-wrap">
              {isFocus &&
                <Textarea 
                  placeholder="说两句吧~" 
                  placeholderClass="placeholder"
                  className="comment-textarea"
                  fixed
                  value={comment}
                  name='comment'
                  autoFocus
                />
              }
              <View className="bottom-btn">
                <Button 
                  className="cancel"
                  plain
                  onClick={this.handleComment.bind(this, false)}
                >取消
                </Button>

                <Button 
                  className="send"
                  plain
                  formType="submit"
                >发送
                </Button> 

              </View>
            </View>
          </Form>
        </Dialog>

        {/* 查看评论 */}
        <Dialog
          visible={checkVisible}
          position="bottom"
          isMaskClick={false}
          onClose={this.setDialogVisible.bind(this, false, 'checkVisible')}
        >
          <View className="check-comment-dialog">
            <View 
              className="iconfont iguanbi3 close"
              onClick={this.setDialogVisible.bind(this, false, 'checkVisible')}
            ></View>
            <View className="title">共{commentQuantity}条评论</View>

            <ScrollView className="list" scrollY>
              {commentList.length > 0 && commentList.map((item: any, index: number) => {
                return (
                  <CommentItem item={item} index={index} key={item.id} />
                )
              })}
            </ScrollView>
            {/* <Form reportSubmit onSubmit={this.handleCommentSubmit.bind(this)}>
              <View className="send-wrap">
                <Input placeholder="开始您的精彩点评吧..." name='comment' value={comment} />
                <Button className="send" formType="submit" plain>发布</Button>
              </View>
            </Form> */}
          </View>
        </Dialog>
      </View>
    )
  }
}

export default ImageDetail