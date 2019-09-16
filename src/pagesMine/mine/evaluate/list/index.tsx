import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';

import BaseComponent from '@/utils/components'

import './index.scss';

import { EmptyDataBox, LoadingBox } from '@/components';
import { AtRate } from 'taro-ui';


type StateType = {
  pageLoading: boolean
  list: any[]
  searchData: any
}

interface EvaluateList {
  state: StateType
}

class EvaluateList extends BaseComponent {
  config = {
    navigationBarTitleText: '评价',
    onReachBottomDistance: 200,
    enablePullDownRefresh: true,
  };

  constructor() {
    super();
    this.state = {
      pageLoading: true,
      list: [],
      searchData: {
        productId: '',
        pageNum: 0,
        pageSize: 20,
        total: 0,
      },
    };
  }

  componentDidMount() {
    const { productId } = this.$router.params;
    let { searchData } = this.state;
    searchData.productId = productId;
    this.setState({
      searchData,
    }, () => {
      this.getProductEvaluate();
    });
  }

  onPullDownRefresh() {
    this.getProductEvaluate();
  }

  onReachBottom() {
    let { searchData, list } = this.state;
    if (this.isHasNextPage(searchData, list.length)) {
      this.getProductEvaluate(true)
    }
  }

  // 获取评价
  async getProductEvaluate(isLoadMore?: boolean) {
    let { searchData, list } = this.state;
    if (!isLoadMore) {
      this.setPageLoading(true)
      searchData.pageNum = 0;
      searchData.total = 0;
      list = []
    }
    searchData.pageNum++
    const res = await this.$api.mall.getProductEvaluate(searchData)
    let data = res.data.data;
    if (data.total) searchData.total = data.total;
    if (isLoadMore) {
      list = [...list, ...data.list];
    } else {
      list = data.list;
    }
    this.setState({
      searchData,
      list,
    });
    this.setPageLoading(false)
    Taro.stopPullDownRefresh()
  }

  render() {
    const { list, pageLoading } = this.state;
    return (
      <View className="page-evaluate-list">
        <LoadingBox visible={pageLoading} />

        {list.map((item: any) => {
          return (
            <View className="evaluate-item" key={item.id}>
              <View className="user-wrapper">
                <View className="info">
                  <Image className="headimg" mode="aspectFill" src={item.headImage || this.imgHost + '/attachments/static/logo_notext.png'} />
                  <Text className="name">{item.memberName}</Text>
                  {item.levelIconUrl && <Image className="member-icon" mode="widthFix" src={item.levelIconUrl} />}
                </View>
                <View className="spec">{item.spec}</View>
              </View>
              <View className="content">{item.content}</View>
              <View className="footer">
                <AtRate size={15} value={item.score} />
                <View className="date">{item.createTime}</View>
              </View>
            </View>
          );
        })}
        {!list.length && <EmptyDataBox title="暂无评价" />}
      </View>
    );
  }
}

export default EvaluateList