'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _utils = require('@/utils/utils');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Nav = require('@/utils/Nav');

var _Nav2 = _interopRequireDefault(_Nav);

var _gjSsoSdk = require('gj-sso-sdk');

var _gjSsoSdk2 = _interopRequireDefault(_gjSsoSdk);

var _zarm = require('zarm');

var _toolkitsEz = require('toolkits-ez');

var tki = _interopRequireWildcard(_toolkitsEz);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
// import Taro, { setStorageSync } from '@tarojs/taro';
// import {
//   Toast.show,
//   showLoading,
//   hideLoading,
//   setNavigationBarTitle,
// } from '@/utils/ModalUtil';


var axiosInstance = _axios2.default.create({
  baseURL: _config2.default.baseURL,
  timeout: 1000 * 60
});

var CancelToken = _axios2.default.CancelToken;

var showError = function showError(text) {
  debounce(function () {
    _zarm.Toast.show('请求失败', text);
    // Message.error(text);
  }, 1000)();
};

// 拦截器，同样信息只弹出一次
function debounce(fn, wait) {
  var timerId = null;
  var flag = true;
  return function () {
    clearTimeout(timerId);
    if (flag) {
      fn.apply(this, arguments);
      flag = false;
    }
    timerId = setTimeout(function () {
      flag = true;
    }, wait);
  };
}

//  request拦截器
axiosInstance.interceptors.request.use(function (config) {
  _zarm.Loading.show();
  var token = _gjSsoSdk2.default.getToken();
  // console.log("accessTokenCookieKey:", SsoSDK.accessTokenCookieKey);

  // console.log("token:", token);
  var newConfig = _lodash2.default.cloneDeep(config);
  //  没有token时，登录页不进行重定向
  if (token) {
    // newConfig.headers[tokenHeaderMap.DDingAuthHeader] = token;
    newConfig.headers['Access-Token'] = token;
    newConfig.cancelToken = new CancelToken(function (c) {
      (0, _utils.entryUnique)(config, c);
    });
  }
  return newConfig;
}, function (error) {
  return Promise.reject(error);
});

// response 拦截器
axiosInstance.interceptors.response.use(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(response) {
    var res, cookieName;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // console.log("response:", response);
            _zarm.Loading.hide();
            res = response.data;
            // console.log("res:", res);

            if (!res.systemMaintenance) {
              _context.next = 6;
              break;
            }

            _Nav2.default.replacePage('/crm/fix');
            // setNavigationBarTitle(' ');
            _context.next = 18;
            break;

          case 6:
            if (!(res.code === 216 || res.code === 215)) {
              _context.next = 14;
              break;
            }

            cookieName = void 0;

            if (BUILD_ENV == 'prod') {
              cookieName = 'sso.login.account.operation.auth';
            } else {
              cookieName = (BUILD_ENV === 'development' ? 'dev' : BUILD_ENV) + '.sso.login.account.operation.auth';
            }
            if (tki.Cookie.get(cookieName)) {
              tki.Cookie.remove(cookieName, {
                domain: process.env.NODE_ENV === 'development' ? '.vaiwan.com' : '.gaojin.com.cn',
                path: '/'
              });
              // alert('cookie555'+tki.Cookie.get(cookieName))
            }
            tki.DB.local.setItem('token', '');
            _context.next = 13;
            return _gjSsoSdk2.default.config({
              env: BUILD_ENV === 'local' ? 'dev' : BUILD_ENV,
              domain: process.env.NODE_ENV === 'development' ? '.vaiwan.com' : undefined,
              jsApiList: ['biz.contact.complexPicker', 'biz.contact.departmentsPicker', 'device.geolocation.get', 'biz.util.chooseImage', 'biz.util.uploadImage', 'biz.util.uploadImageFromCamera', 'biz.telephone.showCallMenu'],
              url: _config2.default.pageUrl
            });

          case 13:
            // console.log("Token===>", SsoSDK.getToken());
            // Taro.setStorageSync('token', SsoSDK.getToken());
            _zarm.Toast.show('登录已过期，请手动刷新页面');
            // return false;

          case 14:
            if (!(res.code !== 200)) {
              _context.next = 17;
              break;
            }

            _zarm.Toast.show('' + (res.resultMsg || res.msg));
            // return res.data;
            return _context.abrupt('return', Promise.reject(res));

          case 17:
            return _context.abrupt('return', res.data);

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(), function (err) {
  console.log(err);
  showError(err.message || '网络异常，请重试！');
  return Promise.reject(err.response);
});

exports.default = axiosInstance;