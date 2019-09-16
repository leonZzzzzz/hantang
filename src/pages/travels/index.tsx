import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, ScrollView, Image } from '@tarojs/components'
import './index.scss'
import { AtSearchBar } from 'taro-ui';

import { ImageItem, VideoItem, DividingLine, MoreLoading, Dialog, TabsWrap, LogoWrap, LoadingBox, EmptyDataBox } from '@/components/index'

import config from '@/config/index'
import BaseComponent from '@/utils/components'

type StateType = {
  pageLoading: boolean
  tabList: any[]
  videoList: object[]
  sendVisible: boolean
  searchData: any
  paneHeight: number
  leftImgList: any[]
  rightImgList: any[]
}

interface Travels {
  state: StateType
}


class Travels extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '游记',
    onReachBottomDistance: 200,
    enablePullDownRefresh: true,
  }

  systemInfo: any
  leftHeight: number
  rightHeight: number
  _leftImgList: any[]
  _rightImgList: any[]
  itemWdith: number
  isMount: boolean
  cacheImg: any[]

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      paneHeight: 0,
      searchData: {
        title: '',
        type: 1,
        pageNum: 0,
        pageSize: 20,
        total: 0,
      },
      tabList: [
        { title: '游记视频', id: 2, current: 2, },
        { title: '游记相片', id: 1, current: 1, }
      ],
      videoList: [],
      leftImgList: [],
      rightImgList: [],
      sendVisible: false,
    }
    this.systemInfo = config.systemInfo
    this.leftHeight = 0
    this.rightHeight = 0
    this._leftImgList = []
    this._rightImgList = []
    this.itemWdith = 0
    this.isMount = false;
    this.cacheImg = []
  }

  onShareAppMessage(res: any) {
    if (res.from === 'button') {
      let { title, coverurl } = res.target.dataset
      return {
        title,
        imageUrl: coverurl
      }
    }
    return {
      title: '游记',
    }
  }

  componentWillMount() {
    console.log(this.systemInfo)
    let percentage = 750 / this.systemInfo.windowWidth
    this.itemWdith = 330 / percentage


    this.travelsPage()

  }
  componentDidShow() {
    // this.getPaneHeight()
    if (!this.isMount) return;
    this.travelsPage();
    
  }

  // 下拉刷新
  onPullDownRefresh() {
    this.travelsPage();
  }

  onReachBottom() {
    let { searchData, videoList, leftImgList, rightImgList } = this.state;
    let length = 0
    if (searchData.type === 1) {
      length = leftImgList.length + rightImgList.length
    } else {
      length = videoList.length
    }
    if (this.isHasNextPage(searchData, length)) {
      this.travelsPage(true)
    }
  }

  getPaneHeight() {
    const query = Taro.createSelectorQuery()
    query.select('.tab-wrap').boundingClientRect()
    query.exec((res) => {
      console.log(res[0].height)
      this.setState({
        paneHeight: this.systemInfo.windowHeight - res[0].height
      })
    })
  }

  

  // 列表
  async travelsPage(isLoadMore?: boolean) {
    let { searchData, leftImgList, rightImgList, videoList } = this.state
    if (!isLoadMore) {
      this.setPageLoading(true);
      searchData.pageNum = 0
      searchData.total = 0
      leftImgList = []
      rightImgList = []
      videoList = []
    }
    searchData.pageNum++
    try {
      let res = await this.$api.travels.travelsPage(searchData)
      let data = res.data.data
      if (searchData.type === 1) {
        this.cacheImg = data.list
      }
      else videoList = [...videoList, ...data.list]
      this.setState({
        leftImgList,
        rightImgList,
        videoList,
        searchData
      }, () => {
        if (searchData.type === 1) this.pushImg()
      })
      Taro.stopPullDownRefresh();
      this.isMount = true;
    
      this.setPageLoading(false);
    } catch (err) {
      Taro.stopPullDownRefresh();
      this.isMount = true;
      this.setPageLoading(false);
    }
  }

  async pushImg() {
    if (this.cacheImg.length === 0) return

    let { leftImgList, rightImgList } = this.state
    if (leftImgList.length === 0) {
      leftImgList.push(this.cacheImg.shift())
    } else if (rightImgList.length === 0) {
      rightImgList.push(this.cacheImg.shift())
    } else {
      const res: any = await this.getGroupHeight()
      if (res.leftHeight <= res.rightHeight) {
        leftImgList.push(this.cacheImg.shift())
      } else {
        rightImgList.push(this.cacheImg.shift())
      }
    }
    this.setState({
      leftImgList,
      rightImgList
    }, () => {
      this.pushImg()
    })
  }

  getGroupHeight() {
    return new Promise((resolve) => {
      const query = Taro.createSelectorQuery()
      query.selectAll('.group').boundingClientRect()
      query.exec((res) => {
        resolve({
          leftHeight: res[0][0].height,
          rightHeight: res[0][1].height
        })
      })
    })
  }

  onSearchChange(value: string): void {
    this.setState((preState: any) => {
      preState.searchData.title = value
    })
  }
  onActionClick() {
    this.travelsPage()
  }

  handleClickTabs(current: number) {
    this.setState((preState: any) => {
      preState.searchData.type = current
    }, () => {
      this.travelsPage()
    })
  }

  takePhoto(): void {
    const cameraContext = Taro.createCameraContext()
    console.log('cameraContext', cameraContext)
    // const CameraContext = Taro.CameraContext
    cameraContext.takePhoto({
      success: (res) => {
        console.log(res)
      },
      fail: (err) => {
        console.log(err)
      }
    })
  }

  // handleScrollLower() {
  //   // console.log(e)
  //   this.travelsPage(this.state.current)
  // }

  goRelease(): void {
    const { searchData } = this.state
    
    Taro.navigateTo({
      url: '/pagesTravels/travels/release/index?type=' + searchData.type
    }).then(() => {
      this.setDialogVisible(false, 'sendVisible')
    })
  }

  

  render() {
    const { pageLoading, searchData, tabList, leftImgList, rightImgList, videoList, sendVisible } = this.state

    return (
      <View>
        <LoadingBox visible={pageLoading} />

        <View className="tab-wrap">

          <View className="fixed-top">
            <AtSearchBar 
              value={searchData.title}
              // disabled={list.length === 0}
              onChange={this.onSearchChange.bind(this)}
              onActionClick={this.onActionClick.bind(this)}
              className="search-bar"
            />
            {/* <TabsWrap
              tabs={tabList}
              current={searchData.type}
              onClickTabs={this.handleClickTabs.bind(this)}
            /> */}
          </View>
        </View>

        <DividingLine height={100} />


        <View className="tabs-pane-wrap">
          
          <View className={`tabs-pane ${searchData.type === 1 ? 'hidden' : ''}`}>
            {videoList.length > 0 ?
              videoList.map((item: any) => {
                return <VideoItem item={item} key={item.id} />
              })
              :
              <EmptyDataBox />
            }
            <LogoWrap />
          </View>

          <View className={`tabs-pane ${searchData.type === 2 ? 'hidden' : ''}`}>
            {(leftImgList.length > 0 || rightImgList.length > 0) ?
              <View className="img-list">
                <View className="group">
                  {leftImgList.map((item: any) => {
                    return <ImageItem item={item} key={item.id} />
                  })}
                </View>
                <View className="group">
                  {rightImgList.map((item: any) => {
                    return <ImageItem item={item} key={item.id} />
                  })}
                </View>
              </View>
              :
              <EmptyDataBox />
            }
            <LogoWrap />
          </View>

        </View>

        {/* <View className="tabs-pane-wrap">
          <ScrollView 
            scrollY 
            className={`tabs-pane ${current !== 0 ? 'hidden' : ''}`} 
            style={{height: paneHeight + 'px'}}
            onScrollToLower={this.handleScrollLower.bind(this)}
          >
            <View>
              {videoList.map((item: any) => {
                return <VideoItem item={item} key={item.id} />
              })}
            </View>
            <LogoWrap />
          </ScrollView>

          <ScrollView 
            scrollY 
            className={`tabs-pane ${current !== 1 ? 'hidden' : ''}`} 
            style={{height: paneHeight + 'px'}}
            onScrollToLower={this.handleScrollLower.bind(this)}
          >
            <View className="img-list">
                <View className="group">
                  {leftImgList.map((item: any) => {
                    return (
                      <View key={item} className="cell">
                        {item.map((cell: any) => {
                          return <ImageItem item={cell} key={cell.id} />
                        })}
                      </View>
                    )
                  })}
                </View>
                <View className="group">
                  {rightImgList.map((item: any) => {
                    return (
                      <View key={item} className="cells">
                        {item.map((cell: any) => {
                          return <ImageItem item={cell} key={cell.id} />
                        })}
                      </View>
                    )
                  })}
                </View>
              </View>
            <LogoWrap />
          </ScrollView>
        </View> */}


        <Button 
          className="send-btn"
          onClick={this.setDialogVisible.bind(this, true, 'sendVisible')}
        >
          <Text className="iconfont ijiahao" />
        </Button>
   

        <Dialog
          visible={sendVisible}
          position="bottom"
          isMaskClick={false}
          onClose={this.setDialogVisible.bind(this, false, 'sendVisible')}
        >
          <View className="send-dialog">
            <View className="item" onClick={this.takePhoto}>
              <View>拍摄</View>
              <View className="desc">相片或视频</View>
            </View>
            <View className="item" onClick={this.goRelease}>
              <View>从手机相册选择</View>
            </View>
            <View 
              className="iconfont iguanbi3 close"
              onClick={this.setDialogVisible.bind(this, false, 'sendVisible')}
            />
          </View>
        </Dialog>
      </View>
    )
  }
}



export default Travels