import Request from './request'

export default class Travels extends Request {
  _request: Request;
  
  constructor() {
    super();
    this._request = new Request()
  }

  // 广场新增
  travelsInsert(params?: any) {
    return this._request.$postJson('api/v1/travels/insert', params)
  }
  // 广场列表
  travelsPage(params?: any) {
    return this._request.$get('api/v1/travels/page', params)
  }
  // 广场详情
  travelsGet(params?: any) {
    return this._request.$get('api/v1/travels/get', params)
  }

  // 查看评论
  commentPage(params?: any) {
    return this._request.$get('api/v1/comment/page', params)
  }
  // 新增评论
  commentInsert(params?: any) {
    return this._request.$post('api/v1/comment/insert', params)
  }
  // 点赞
  praiseInsert(params?: any) {
    return this._request.$post('api/v1/praise/insert', params)
  }
  // 取消赞
  praiseDelete(params?: any) {
    return this._request.$post('api/v1/praise/delete', params)
  }
  // 转发

}