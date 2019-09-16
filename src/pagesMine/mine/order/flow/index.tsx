import Taro from '@tarojs/taro';
// import MallComponent from '../../../utils/components';
import { View } from '@tarojs/components';
import BaseComponent from '@/utils/components'

import './index.scss';
import { LoadingBox } from '@/components/index';

type StateType = {
  pageLoading: boolean
  orderFlowList: any[]
}

interface OrderFlow {
  state: StateType
}

class OrderFlow extends BaseComponent {
  config = {
    navigationBarTitleText: '订单状态',
  };

  id: string

  constructor() {
    super();
    this.state = {
      pageLoading: true,
      orderFlowList: [],
    };
    // 订单id
    this.id = '';
  }

  componentDidMount() {
    this.id = this.$router.params.id;
    this.getOrderFlowList();
  }

  async getOrderFlowList() {
    let res = await this.$api.mall.getOrderFlowList({orderId: this.id})
    this.setState({
      orderFlowList: res.data.data,
    });
    this.setPageLoading(false)
  }

  render() {
    const { orderFlowList, pageLoading } = this.state;
    return (
      <View className="page-order-flow">
        <LoadingBox visible={pageLoading} />

        <View className="order-flow-list">
          {orderFlowList.map((item, index) => {
            return (
              <View
                className={`timeline ${index === 0 ? 'active' : ''} ${
                  index === orderFlowList.length - 1 ? 'last' : ''
                }`}
                key={item.id}
              >
                <View className="timeline__line" />
                <View className="timeline__dot" />
                <View className="timeline__content">
                  <View className="header">
                    <View className="status">{item.statusName}</View>
                    <View className="date">{item.createTime}</View>
                  </View>
                  <View className="body">{item.description}</View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

export default OrderFlow