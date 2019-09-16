import Taro, { Config } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, AddressItem, LoadingBox } from '@/components';

type StateType = {
  pageLoading: boolean
  list: any[]
}

interface Address {
  state: StateType
}


class Address extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '我的地址',
  }

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      list: []
    }
  }

  componentDidShow() {
    this.addressList()
  }

  /**
   * 获取地址列表
   */
  async addressList(): Promise<any> {
    const res = await this.$api.mine.addressList()
    this.setState({
      list: res.data.data
    })
    this.setPageLoading(false)
  }

  handleDelete(id: string): void {
    Taro.showModal({
      title: '删除提示',
      content: '是否删除该地址？'
    }).then((res) => {
      console.log(res.confirm)
      if (res.confirm) this.addressDelete(id)
    })
  }

  async addressDelete(id: string): Promise<any> {
    await this.$api.mine.addressDelete({ id })
    this.showToast('删除成功')
    this.addressList()
  }

  handleSelect(item: any) {
    console.log(item)
    const { action } = this.$router.params
    if (action) {
      // let address = JSON.stringify(item);
      Taro.setStorageSync('address', item);
      Taro.navigateBack();
    }
  }

  render() {
    const { list, pageLoading } = this.state

    return (
      <View>
        <LoadingBox visible={pageLoading} />
        
        <View className="list">
          {list.map((item: any) => {
            return <AddressItem item={item} key={item.id} onDelete={this.handleDelete.bind(this)} onSelect={this.handleSelect.bind(this)} />
          })}
        </View>

        <View className="add-btn">
          <Button 
            className="add"
            onClick={this.navigateTo.bind(this, '/pagesMine/mine/address/edit/index')}
          >新增地址</Button>
        </View>

        <LogoWrap />
      </View>
    )
  }
}

export default Address