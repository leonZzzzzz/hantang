import Taro from '@tarojs/taro'

export default {
  // 腾讯云图片资源链接前缀
  imgHost: 'https://hantang-1259652816.cos.ap-beijing.myqcloud.com',
  // api接口前缀
  urlHost: 'https://ht.wego168.com/hantang_test/',
  // 是否输出请求打印的信息
  requestConsole: true,
  systemInfo: Taro.getSystemInfoSync(),
  filterApiUrl: [
    {
      url: 'api/v1/wechatMember/myBindInfo',
      code: '63021'
    }, 
    {
      url: 'api/v1/member/share/bind',
      code: '40001'
    }
  ]
}
