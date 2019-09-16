import { View, Button } from '@tarojs/components'

import './index.scss'

function PosterWrap(props: any): JSX.Element {

  const { onHandleSave, imgUrl } = props


  const savePoster = (): void => {
    console.log('savePoster')
    onHandleSave && onHandleSave()
  }

  return (
    <View className="poster-dialog">
      <View className="poster-wrap">

      </View>
      <Button 
        type="primary"
        onClick={savePoster}
      >保存到手机</Button>
    </View>
  )

}

export default PosterWrap