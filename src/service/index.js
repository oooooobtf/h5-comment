import axios from 'axios';
import config from './config';
// import { entryUnique } from '@/utils/utils';
import _ from 'lodash';
// import Nav from '@/utils/Nav';
import SsoSDK from 'gj-sso-sdk';
import { Loading, Toast } from 'zarm';
// import Taro, { setStorageSync } from '@tarojs/taro';
// import {
//   Toast.show,
//   showLoading,
//   hideLoading,
//   setNavigationBarTitle,
// } from '@/utils/ModalUtil';
import * as tki from 'toolkits-ez';

const axiosInstance = axios.create({
  baseURL: config.baseURL,
  timeout: 1000 * 60,
});

const CancelToken = axios.CancelToken;

const showError = (text) => {
  debounce(() => {
    Toast.show('请求失败', text);
    // Message.error(text);
  }, 1000)();
};

// 拦截器，同样信息只弹出一次
function debounce(fn, wait) {
  let timerId = null;
  let flag = true;
  return function () {
    clearTimeout(timerId);
    if (flag) {
      fn.apply(this, arguments);
      flag = false;
    }
    timerId = setTimeout(() => {
      flag = true;
    }, wait);
  };
}

//  request拦截器
axiosInstance.interceptors.request.use(
  function (config) {
    Loading.show();
    const token = SsoSDK.getToken();
    // console.log("accessTokenCookieKey:", SsoSDK.accessTokenCookieKey);

    // console.log("token:", token);
    const newConfig = _.cloneDeep(config);
    //  没有token时，登录页不进行重定向
    if (token) {
      // newConfig.headers[tokenHeaderMap.DDingAuthHeader] = token;
      newConfig.headers['Access-Token'] = token;
      newConfig.cancelToken = new CancelToken((c) => {
        // entryUnique(config, c);
      });
    }
    return newConfig;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// response 拦截器
axiosInstance.interceptors.response.use(
  async (response) => {
    // console.log("response:", response);
    Loading.hide();
    const res = response.data;
    // console.log("res:", res);
    if (res.systemMaintenance) {
      // Nav.replacePage('/crm/fix');
      // setNavigationBarTitle(' ');
    } else {
      if (res.code === 216 || res.code === 215) {
        let cookieName;
        if (BUILD_ENV == 'prod') {
          cookieName = 'sso.login.account.operation.auth';
        } else {
          cookieName = `${
            BUILD_ENV === 'development' ? 'dev' : BUILD_ENV
          }.sso.login.account.operation.auth`;
        }
        if (tki.Cookie.get(cookieName)) {
          tki.Cookie.remove(cookieName, {
            domain:
              process.env.NODE_ENV === 'development'
                ? '.vaiwan.com'
                : '.gaojin.com.cn',
            path: '/',
          });
          // alert('cookie555'+tki.Cookie.get(cookieName))
        }
        tki.DB.local.setItem('token', '');
        await SsoSDK.config({
          env: BUILD_ENV === 'local' ? 'dev' : BUILD_ENV,
          domain:
            process.env.NODE_ENV === 'development' ? '.vaiwan.com' : undefined,
          jsApiList: [
            'biz.contact.complexPicker',
            'biz.contact.departmentsPicker',
            'device.geolocation.get',
            'biz.util.chooseImage',
            'biz.util.uploadImage',
            'biz.util.uploadImageFromCamera',
            'biz.telephone.showCallMenu',
          ],
          url: config.pageUrl,
        });
        // console.log("Token===>", SsoSDK.getToken());
        // Taro.setStorageSync('token', SsoSDK.getToken());
        Toast.show('登录已过期，请手动刷新页面');
        // return false;
      }
      if (res.code !== 200) {
        Toast.show(`${res.resultMsg || res.msg}`);
        // return res.data;
        return Promise.reject(res);
      }

      return res.data;
    }
  },
  (err) => {
    console.log(err);
    showError(err.message || '网络异常，请重试！');
    return Promise.reject(err.response);
  },
);

export default axiosInstance;
