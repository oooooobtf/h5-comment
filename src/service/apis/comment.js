/*
 * @Description:
 * @Author: tj
 * @Date: 2021-09-13 13:52:33
 * @LastEditTime: 2021-09-14 15:35:18
 * @LastEditors: tj
 */
import http from '../index';
export default class Api {
  static GET_UPDATECOMMENT_URL = '/appraise/comment';
  static updateComment(params, options = {}) {
    return http.post(Api.GET_UPDATECOMMENT_URL, params, options);
  }

  static GET_COMMENT_LIST_URL = '/appraise/list';
  static getCommentList(params, options = {}) {
    return http.post(Api.GET_COMMENT_LIST_URL, params, options);
  }

  //点赞点踩
  static GET_UPDATE_ACTION_OPTION = '/appraise/positive';
  static updateAction(params, options = {}) {
    return http.post(Api.GET_UPDATE_ACTION_OPTION, params, options);
  }

  //取消点赞点踩
  static GET_CANCEL_ACTION_OPTION = '/appraise/cancelPositive';
  static cancelAction(params, options = {}) {
    return http.post(Api.GET_CANCEL_ACTION_OPTION, params, options);
  }

  //获得详情里的评论点赞点踩数量统计
  static GET_COMMENT_STATIC_OPTION = '/appraise/statisTarget';
  static getSingleStatis(params, options = {}) {
    return http.post(Api.GET_COMMENT_STATIC_OPTION, params, options);
  }
}
