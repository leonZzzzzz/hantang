import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'
import BaseComponent from '@/utils/components'

import { SwiperWrap, ButlerWrap, GroupWrap, SojournWrap, ProductWrap, GroupJourneyWrap, ActivityWrap, LogoWrap, DividingLine, BindWrap, LoadingBox, NavigationBar, Dialog } from '@/components/index'

type StateType = {
  pageLoading: boolean;
  swiperData: object[];
  bindVisible: boolean;
  homePage: any
  bindInfo: any
}

interface Index {
  state: StateType
}


class Index extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '首页',
    navigationStyle: 'custom',
    enablePullDownRefresh: true,
  }

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      homePage: {},
      bindVisible: false,
      swiperData: [],
      bindInfo: {},
    }
  }

  componentWillMount () {
    this.attachmentTempPage()
    this.getHomepage()
    this.myBindInfo()
  }
  onPullDownRefresh() {
    this.setPageLoading(true)
    this.attachmentTempPage()
    this.getHomepage();
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  /**
   * 绑定信息
   */
  async myBindInfo() {
    const res = await this.$api.common.myBindInfo()
    this.setState({
      bindInfo: res.data.data
    })
    Taro.setStorageSync('bindInfo', res.data.data)
  }
  handleBindPhone() {
    this.setState((preState: any) => {
      preState.bindInfo.bindPhoneNum = true
    })
  }
  
  async attachmentTempPage() {
    let res = await this.$api.common.attachmentTempPage()
    console.log(res.data.data.list)
    let list = res.data.data.list.map((item: any) => {
      return this.imgHost + item.url
    })
    this.setState({
      swiperData: list
    })
  }

  async getHomepage(): Promise<any> {
    let res = await this.$api.common.getHomepage()
    this.setState({
      homePage: res.data.data
    })
    this.setPageLoading(false)
    Taro.stopPullDownRefresh();
  }


  handleConfirm(): void {
    console.log('handleConfirm')
  }

  render () {
    const { pageLoading, swiperData, homePage, bindVisible, bindInfo } = this.state
    return (
      <View>
        <LoadingBox visible={pageLoading} />
        
        <NavigationBar />


        <View className='index'>

          <SwiperWrap swiperData={swiperData} />

          <ButlerWrap butlerData={bindInfo.steward} onBindButler={this.setDialogVisible.bind(this, true, 'bindVisible')} />

          {homePage.groupShoppings && homePage.groupShoppings.length > 0 &&
            <View className="d-line">
              <GroupWrap groupProductData={homePage.groupShoppings} />
            </View>
          }

          {homePage.journeyGroupProductResponses && homePage.journeyGroupProductResponses.length > 0 &&
            <View className="d-line">
              <GroupJourneyWrap groupData={homePage.journeyGroupProductResponses} />
            </View>
          }

          {homePage.journeyBases && homePage.journeyBases.length > 0 &&
            <View className="d-line">
              <SojournWrap sojourn={homePage.journeyBases} />
            </View>
          }

          {homePage.products && homePage.products.length > 0 &&
            <View className="d-line">
              <ProductWrap popularifyData={homePage.products} />
            </View>
          }
     
          {homePage.activities && homePage.activities.length > 0 &&
            <View className="d-line">
              <ActivityWrap activityData={homePage.activities} />
            </View>
          }
 
        </View>
        <LogoWrap />

        <Dialog
          visible={bindVisible}
          isMaskClick={false}
          onClose={this.setDialogVisible.bind(this, false, 'bindVisible')}
        >
          <BindWrap 
            visible={bindVisible}
            bindInfo={bindInfo}
            onConfirm={this.myBindInfo.bind(this)}
            onBindPhone={this.handleBindPhone.bind(this)}
            onClose={this.setDialogVisible.bind(this, false, 'bindVisible')}  
          />
        </Dialog>

      </View>
    )
  }
}

export default Index