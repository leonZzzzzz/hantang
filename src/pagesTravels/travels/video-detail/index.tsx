import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Video, Textarea, Form, ScrollView } from '@tarojs/components'
import './index.scss'

import { Avatar, Dialog, LoadingBox, CommentItem } from '@/components/index'
import BaseComponent from '@/utils/components'


type StateType = {
  pageLoading: boolean
  commentVisible: boolean
  checkVisible: boolean
  detail: any
  attachmentList: []
  isPraise: boolean
  commentQuantity: number
  praiseQuantity: number
  shareQuantity: number
  comment: string
  commentList: any[]
  isFocus: boolean
}

interface VideoDetail {
  state: StateType
}

class VideoDetail extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '游记视频详情',
    navigationBarBackgroundColor: '#222222',
    navigationBarTextStyle: 'white',
  }

  id: string
  searchData: any

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      detail: {},
      attachmentList: [],
      commentVisible: false,
      checkVisible: false,
      isPraise: false,
      commentQuantity: 0,
      praiseQuantity: 0,
      shareQuantity: 0,
      comment: '',
      commentList: [],
      isFocus: false,
    }
    this.id = ''
    this.searchData = {
      pageNum: 0,
      pageSize: 20,
      total: 0,
      sourceId: ''
    }
  }

  componentWillMount() {
    const { id } = this.$router.params
    this.id = id
    this.searchData.sourceId = id
    this.travelsGet(id)
    this.commentPage()
  }

  /**
   * 详情
   * @param id id
   */
  async travelsGet(id: string) {
    const res = await this.$api.travels.travelsGet({id})
    let data = res.data.data
    this.setState({
      detail: data,
      isPraise: data.isPraise,
      commentQuantity: data.commentQuantity,
      praiseQuantity: data.praiseQuantity,
      shareQuantity: data.shareQuantity,
    })
    this.setPageLoading(false)
  }

  handleMore() {
    if (this.isHasNextPage(this.searchData)) {
      this.commentPage(true)
    }
  }

  /**
   * 评论列表
   */
  async commentPage(isLoadMore?: boolean) {
    let { commentList } = this.state
    if (!isLoadMore) {
      this.searchData.pageNum = 0
      this.searchData.total = 0
      commentList = []
    }
    this.searchData.pageNum++
    const res = await this.$api.travels.commentPage(this.searchData)
    let data = res.data.data
    this.searchData.total = data.total
    this.setState({
      commentList: [...commentList, ...data.list],
      commentQuantity: res.data.data.total,
    })
  }

  /**
   * 新增评论
   * @param params params
   */
  async commentInsert(params: any) {
    await this.$api.travels.commentInsert(params)
    this.commentPage()
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

  handleInput(e: any): void {
    console.log(e)
    this.setState({
      comment: e.detail.value
    })
  }


  render() {
    const { pageLoading, commentVisible, checkVisible, detail, isPraise, commentQuantity, praiseQuantity, shareQuantity, comment, commentList, isFocus } = this.state

    return (
      <View className="video-detail">
        <LoadingBox visible={pageLoading} />
        <View className="user-wrap">
          <View className="user">
            <Avatar imgUrl={detail.headImage} width={50} style={{border: '1px solid #fff'}} />
            <Text className="name">{detail.author}</Text>
          </View>
          <View className="sum">{detail.playTimes}次播放</View>
        </View>
        <View className="title">{detail.title}</View>
        <View className="video-content">
          <Video src={detail.iconUrl} />
        </View>

        <View className="bottom-comment">
          <View 
            className="text"
            onClick={this.handleComment.bind(this, true)}
          >说两句吧~</View>
        </View>

        <View className="btn-wrap">
          <Button className="share">
            <Text className="iconfont iweixin" />
            <Text>发送好友</Text>
          </Button>
          <View className="btn">
            <View className="item" onClick={this.handlePraise.bind(this)}>
              <Text className={`iconfont ${isPraise ? 'ixihuan1' : 'ixihuan'}`} />
              <Text>{praiseQuantity}</Text>
            </View>
            <View className="item" onClick={this.setDialogVisible.bind(this, true, 'checkVisible')}>
              <Text className="iconfont ipinglun" />
              <Text>{commentQuantity}</Text>
            </View>
            <View className="item">
              <Text className="iconfont ifenxiang" />
              <Text>{shareQuantity}</Text>
            </View>
          </View>
        </View>

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
                  // onInput={this.handleInput}
                  autoFocus
                />
              }
              <View className="bottom-btn">

                <Button 
                  className="cancel"
                  plain
                  onClick={this.handleComment.bind(this, false)}
                >取消</Button>

                <Button 
                  className="send"
                  plain
                  formType="submit"
                >发送</Button>

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
            <View className="title-total">共{commentQuantity}条评论</View>

            <ScrollView className="list" scrollY onScrollToLower={this.handleMore.bind(this)}>
              {commentList.length > 0 && commentList.map((item: any, index: number) => {
                return (
                  <CommentItem item={item} index={index} key={item.id} />
                )
              })}
            </ScrollView>
          </View>
        </Dialog>
      </View>
    )
  }
}

export default VideoDetail