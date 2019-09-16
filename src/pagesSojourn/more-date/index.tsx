import Taro, { Component, Config, useState, useEffect } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

import './index.scss'

import { DividingLine } from '@/components/index'

type StateType = {
  weekData: object[];
  monthGroup: object[];
}

interface MoreDate {
  state: StateType
}

class MoreDate extends Component {

  config: Config = {
    navigationBarTitleText: '更多日期'
  }
  maxMonthCount: number;

  constructor() {
    super(...arguments)
    this.state = {
      weekData: [
        {
          id: 0,
          name: '日',
        },
        {
          id: 1,
          name: '一',
        },
        {
          id: 2,
          name: '二',
        },
        {
          id: 3,
          name: '三',
        },
        {
          id: 4,
          name: '四',
        },
        {
          id: 5,
          name: '五',
        },
        {
          id: 6,
          name: '六',
        },
      ],
      monthGroup: [],
      // maxMonthCount: 3,
    }
    this.maxMonthCount = 3
  }

  componentWillMount() {
    this.getMonthGroup()
  }

  getMonthGroup(): void {
    let date: any = new Date()
    let year: number = date.getFullYear()
    let month: number = date.getMonth() + 1
    let group: object[] = []
    for (let i: number = 0; i < this.maxMonthCount; i++) {
      group.push(this.getGroup(year, month + i))
    }
    this.setState({
      monthGroup: group
    })
  }

  getGroup(year: number, month: number): object {
    let yearCurrent: any
    let monthCurrent: any
    if (month > 12) {
      let count = parseInt(month / 12 + '')
      yearCurrent = count + year
      monthCurrent = month % 12 < 10 ? '0' + month % 12 : month % 12
    } else {
      yearCurrent = year
      monthCurrent = month
    }
    return {
      year: yearCurrent,
      month: monthCurrent,
      dayGroup: this.getMonthDay(yearCurrent, Number(monthCurrent))
    }
  }

  // 获取月份天数
  getMonthDay(year: number, month: number): object[] {
    // 每月第一天星期几 (0-6，周日-周一)
    let weekCount: number = new Date(year, month - 1, 1).getDay()
    console.log(month, weekCount)
    // 月天数
    let daySum: number = new Date(year, month, 0).getDate()
    // 月份行数
    let rows: number = Math.ceil((weekCount + daySum) / 7)

    let group: object[] = []

    for (let i: number = 0; i < rows * 7; i++) {
      group.push({
        day: i >= weekCount && i + 1 - weekCount <= daySum ? i + 1 - weekCount : '',
        price: i >= weekCount && i + 1 - weekCount <= daySum ? 1899 : '',
        // isNot: true,
      })
    }
    return group
  }

  onSelectedDay(dayData: object, item: object): void {
    console.log(dayData, item)
  }

  confirm(): void {
    console.log('确认')
  }

  render() {
    const { weekData, monthGroup } = this.state

    return (
      <View>
        {monthGroup.map((item: any) => {
          return (
            <View className="group" key={item.month}>
              <View className="month">{item.year}年{item.month}月</View>
              <View className="week-wrap">
                {weekData.map((item: any) => {
                  return <View className="item" key={item.id}>{item.name}</View>
                })}
              </View>
              <View className="day-wrap">
                {item.dayGroup.map((dayData: any, index: number) => {
                  return (
                    <View 
                      className={`item ${index % 7 === 0 ? 'left' : ''} ${index === 14 ? 'active' : ''}`} 
                      key={dayData.day}
                      onClick={this.onSelectedDay.bind(this, dayData, item)}
                    >
                      <View className="day">{dayData.day}</View>
                      {dayData.price && <View className="price">￥{dayData.price}</View>}
                      {dayData.isNot && <View className="not">售罄</View>}
                    </View>
                  )
                })}
              </View>
            </View>
          )
        })}

        <DividingLine height={150} />
        <View className="btn-wrap">
          <Button onClick={this.confirm}>确定</Button>
        </View>
      </View>
    )
  }
}


export default MoreDate