'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp; /*
                    * @Description:
                    * @Author: tj
                    * @Date: 2021-09-13 13:52:33
                    * @LastEditTime: 2021-09-14 15:35:18
                    * @LastEditors: tj
                    */


var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Api = (_temp = _class = function () {
  function Api() {
    _classCallCheck(this, Api);
  }

  _createClass(Api, null, [{
    key: 'updateComment',
    value: function updateComment(params) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _index2.default.post(Api.GET_UPDATECOMMENT_URL, params, options);
    }
  }, {
    key: 'getCommentList',
    value: function getCommentList(params) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _index2.default.post(Api.GET_COMMENT_LIST_URL, params, options);
    }

    //点赞点踩

  }, {
    key: 'updateAction',
    value: function updateAction(params) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _index2.default.post(Api.GET_UPDATE_ACTION_OPTION, params, options);
    }

    //取消点赞点踩

  }, {
    key: 'cancelAction',
    value: function cancelAction(params) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _index2.default.post(Api.GET_CANCEL_ACTION_OPTION, params, options);
    }

    //获得详情里的评论点赞点踩数量统计

  }, {
    key: 'getSingleStatis',
    value: function getSingleStatis(params) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _index2.default.post(Api.GET_COMMENT_STATIC_OPTION, params, options);
    }
  }]);

  return Api;
}(), _class.GET_UPDATECOMMENT_URL = '/appraise/comment', _class.GET_COMMENT_LIST_URL = '/appraise/list', _class.GET_UPDATE_ACTION_OPTION = '/appraise/positive', _class.GET_CANCEL_ACTION_OPTION = '/appraise/cancelPositive', _class.GET_COMMENT_STATIC_OPTION = '/appraise/statisTarget', _temp);
exports.default = Api;