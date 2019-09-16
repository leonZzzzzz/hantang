import Taro from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtRate, AtTextarea } from 'taro-ui';

import './index.scss';

import BaseComponent from '@/utils/components'
import { LoadingBox } from '@/components/index'

type StateType = {
  pageLoading: boolean
  rate: number
  orderItems: any[]
}

interface EvaluatePost {
  state: StateType
}

class EvaluatePost extends BaseComponent {
  config = {
    navigationBarTitleText: '商品评价',
  };

  id: string;
  btnLoading: boolean;

  constructor() {
    super();
    this.state = {
      pageLoading: true,
      rate: 0,
      orderItems: [],
    };
    // 订单id
    this.id = '';
    this.btnLoading = false;
  }

  componentDidMount() {
    const { id } = this.$router.params;
    this.id = id;
    this.getListForEvaluation();
  }

  async getListForEvaluation() {
    const res = await this.$api.mall.getListForEvaluation({orderId: this.id})
    let orderItems = res.data.data;
    orderItems.forEach((item: any) => {
      item.score = 0;
      item.content = '';
    });
    this.setState({
      orderItems,
    });
    this.setPageLoading(false)
  }

  handleRateChange(index: number, score: number) {
    let { orderItems } = this.state;
    orderItems[index].score = score;
    this.setState({ orderItems });
  }

  onTextAreaInput(index: number, e: any) {
    let value = e.target.value;
    let { orderItems } = this.state;
    orderItems[index].content = value;
    this.setState({ orderItems });
  }

  submit() {
    if (this.btnLoading) return;
    this.btnLoading = true;
    const { orderItems } = this.state;
    let length = 0;
    let promiseArray: any = [];
    for (let item of orderItems) {
      if (!item.score || !item.content) {
        length++;
        continue;
      }
      let params = {
        orderItemId: item.id,
        score: item.score,
        content: item.content,
        imageList: [
          {
            imageUrl: '',
          },
        ],
      };
      let promise = this.$api.mall.insertProductEvaluate(params);
      promiseArray.push(promise);
    }
    if (length === orderItems.length) {
      this.showToast('至少评价一件商品哦！');
      this.btnLoading = false;
      return;
    }
    Promise.all(promiseArray).then(() => {
      this.showToast('评价成功', 'success').then(() => {
        this.btnLoading = false;
        Taro.navigateBack();
      });
    }).catch(() => {
      this.btnLoading = false;
    });
  }

  render() {
    const { orderItems, pageLoading } = this.state;
    return (
      <View className="page-evaluate-post">
        <LoadingBox visible={pageLoading} />

        {orderItems.map((item, index) => {
          return (
            <View className="evaluate-item" key={item.id}>
              <View className="product-info">
                <Image className="cover" src={this.imgHost + item.iconUrl} />
                <View className="info">
                  <View className="name">{item.name}</View>
                  <View className="specs">{item.specs}</View>
                </View>
              </View>
              <View className="rate">
                <Text className="m-r-2">商品评价：</Text>
                <AtRate value={item.score} onChange={this.handleRateChange.bind(this, index)} />
              </View>
              <View className="evaluate-textarea">
                <AtTextarea
                  value={item.content}
                  placeholder="分享一下你的体验吧(不超过140字)"
                  maxLength={140}
                  onChange={this.onTextAreaInput.bind(this, index)}
                />
              </View>
            </View>
          );
        })}
        <View className="button-wrapper">
          <Button className="primary-btn" onClick={this.submit.bind(this)}>
            发布
          </Button>
        </View>
      </View>
    );
  }
}

export default EvaluatePost