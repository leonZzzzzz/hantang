import Taro, { useState, useEffect } from '@tarojs/taro'
import { Swiper, SwiperItem, Image, View } from '@tarojs/components'

import './index.scss'

import config from '@/config'



const { systemInfo } = config

function SwiperWrap(props: any): JSX.Element {
  let { swiperData, isDetail } = props

  const [ style ] = useState(() => {
    return {
      height: systemInfo.screenWidth + 'px',
      width: systemInfo.screenWidth + 'px'
    }
  })

  // 预览轮播列表的大图
  const previewImage = (index: number) => {
    if (!isDetail) return
    let current = swiperData[index]
    Taro.previewImage({
      current,
      urls: swiperData,
    });
  }

  return (
    <Swiper
      style={isDetail ? style : {}}
      className="swiper-data"
      indicatorActiveColor="#fff"
      circular
      indicatorDots
      autoplay>
      {swiperData.map((item: string, index: number) => {
        return (
          <SwiperItem key={item} className="item" onClick={() => previewImage(index)}>
            <Image src={item} mode="aspectFill" />
          </SwiperItem>
        )
      })}
    </Swiper>
  )
}

SwiperWrap.defaultProps = {
  swiperData: []
}

SwiperWrap.options = {
  addGlobalClass: true
}

export default SwiperWrap
