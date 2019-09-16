import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import BaseComponent from '@/utils/components'

import './index.scss';
import util from '@/utils/util'
import { CheckBtn, InputNumber, LoadingBox } from '@/components/index';

type StateType = {
  pageLoading: boolean
  orderData: any
  applyItems: any[]
  canApply: boolean
}

interface AfterSaleApply {
  state: StateType
}

class AfterSaleApply extends BaseComponent {
  config = {
    navigationBarTitleText: '申请售后',
  };

  id: string
  isMount: boolean

  constructor() {
    super();
    this.state = {
      pageLoading: true,
      orderData: {
        orderItems: [],
      },
      // 已经申请过的商品项
      applyItems: [],
      // 是否可以进行售后
      canApply: true,
    };
    // 订单id
    this.id = '';
    this.isMount = false;
  }

  componentDidMount() {
    this.id = this.$router.params.id || '';
    this.onInitData();
  }

  componentDidShow() {
    if (!this.isMount) return;
    this.onInitData();
  }

  onInitData() {
    let promise1 = this.calculateFrozenQuantity();
    let promise2 = this.getOrderDetail();
    Promise.all([promise1, promise2]).then(res => {
      let applyItems: any = res[0];
      let orderData: any = res[1];
      let { orderItems } = orderData;
      // 可以进行售后的商品项的总个数
      let canApplyTotal = 0;
      for (let item of orderItems) {
        // 该商品已售后的数量
        let applyNum = applyItems[item.id];
        // 该商品可以售后的数量
        let canApplyNum = item.qty - applyNum;
        // 只有列表只有一个商品项的时候，并且可售后数量大于0，则默认选择
        if (orderItems.length === 1 && canApplyNum > 0) {
          item.isCheck = true;
        } else {
          item.isCheck = false;
        }
        item.selectQty = item.canApplyQty = canApplyNum;
        if (item.canApplyQty > 0) canApplyTotal++;
      }
      let canApply = canApplyTotal > 0;
      this.setState({
        applyItems,
        orderData,
        canApply,
      });
      this.isMount = true;
      this.setPageLoading(false)
    });
  }

  // 获取订单已冻结的售后数量
  calculateFrozenQuantity() {
    let params = {
      orderId: this.id,
    };
    return new Promise((resolve, reject) => {
      this.$api.mall.calculateFrozenQuantity(params).then((res: any) => {
        let data = res.data.data;
        resolve(data);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  // 获取订单详情
  getOrderDetail() {
    let params = {
      id: this.id,
    };
    return new Promise((resolve, reject) => {
      this.$api.mall.getOrderDetail(params).then((res: any) => {
        let data = res.data.data;
        resolve(data);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  // 选择商品
  onProductCheck(index: number, value: boolean) {
    let { orderData } = this.state;
    let item = orderData.orderItems[index];
    if (item.canApplyQty <= 0) {
      this.showToast('该商品已申请售后');
      return;
    }
    item.isCheck = value;
    this.setState({
      orderData,
    });
  }

  // 判断售后方式
  onApplyType(type: number) {
    const { orderData, canApply } = this.state;
    // 不能进行售后申请 或者 不是仅退款类型并且还没发货或收货
    if (!canApply || (type !== 3 && orderData.status !== 2 && orderData.status !== 3)) {
      return;
    }
    let checkData = orderData.orderItems.filter((item: any) => {
      return item.isCheck;
    });
    if (!checkData.length) {
      this.showToast('请先选择对应的商品');
      return;
    }
    Taro.setStorageSync('checkData', JSON.stringify(checkData));
    let url = `/pagesMine/mine/after-sale/action/index?id=${this.id}&type=${type}&status=${orderData.status}`;
    this.navigateTo(url);
  }

  // 选择售后商品的数量
  onChangeQty(index: number, value: number) {
    const { orderData } = this.state;
    orderData.orderItems[index].selectQty = value;
    this.setState({ orderData });
  }

  render() {
    const { orderData, canApply, pageLoading } = this.state;

    // 订单状态不是已发货或者已收货
    // 则不能申请退货和换货
    let disableApplyStatus: boolean = false;
    if (!canApply || (orderData.status !== 2 && orderData.status !== 3)) {
      disableApplyStatus = true;
    }

    return (
      <View className="page-apply-after-sale">
        <LoadingBox visible={pageLoading} />
        
        <View className="product-list">
          {orderData.orderItems.map((item: any, index: number) => {
            return (
              <View
                className={`product-list__item ${item.canApplyQty <= 0 ? 'disabled' : ''}`}
                key={item.id}
                onClick={this.onProductCheck.bind(this, index, true)}
              >
                <View className="cover">
                  <CheckBtn
                    disabled={item.canApplyQty <= 0}
                    value={item.isCheck}
                    onChange={this.onProductCheck.bind(this, index)}
                  />
                  <Image className="img" mode="aspectFill" src={this.imgHost + item.iconUrl} />
                </View>
                <View className="info">
                  <View className="name">{item.name}</View>
                  <View className="specs">{item.specs}</View>
                  <View className="price-qty">
                    <View className="price"> {util.filterPrice(item.price)}</View>
                    <View className="qty">x{item.canApplyQty}</View>
                  </View>
                  {item.canApplyQty > 1 && (
                    <InputNumber
                      className="qty-input"
                      min={1}
                      max={item.canApplyQty}
                      step={1}
                      value={item.selectQty}
                      onChange={this.onChangeQty.bind(this, index)}
                    />
                  )}
                </View>
              </View>
            );
          })}
        </View>
        <View className="action-list">
          <View className={`action-list__item ${!canApply ? 'disabled' : ''}`} onClick={this.onApplyType.bind(this, 3)}>
            <View className="content">
              <View className="title">仅退款</View>
              <View className="desc">未收到货（包含未签收），或卖家协商同意前提下</View>
            </View>
            {canApply && <View className="iconfont icon-arrow-right" />}
          </View>
          <View
            className={`action-list__item ${disableApplyStatus ? 'disabled' : ''}`}
            onClick={this.onApplyType.bind(this, 2)}
          >
            <View className="content">
              <View className="title">换货</View>
              <View className="desc">已收到货，需要更换已收到的货物</View>
            </View>
            {!disableApplyStatus && <View className="iconfont icon-arrow-right" />}
          </View>
          <View
            className={`action-list__item ${disableApplyStatus ? 'disabled' : ''}`}
            onClick={this.onApplyType.bind(this, 1)}
          >
            <View className="content">
              <View className="title">退货</View>
              <View className="desc">已收到货，需要退掉已收到的货物</View>
            </View>
            {!disableApplyStatus && <View className="iconfont icon-arrow-right" />}
          </View>
        </View>
      </View>
    );
  }
}

export default AfterSaleApply