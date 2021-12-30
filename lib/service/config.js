'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var NODE_ENV = exports.NODE_ENV = process.env.NODE_ENV;

var ENV = BUILD_ENV ? BUILD_ENV : 'local';

//  域名配置
var domainMap = exports.domainMap = {
  local: 'http://center-dev.gaojin.com.cn/api/appraise',
  dev: 'http://center-dev.gaojin.com.cn/api/appraise',
  test: 'http://center-test.gaojin.com.cn/api/appraise',
  uat: 'http://center-uat.gaojin.com.cn/api/appraise',
  prod: 'http://center.gaojin.com.cn/api/appraise'
};

//  域名
var domain = exports.domain = domainMap[ENV];

//  请求basePath
var basePath = exports.basePath = '';

//  请求完整baseUrl
// export const baseURL = `${domain}${basePath}`;
var baseURL = exports.baseURL = '';
exports.default = { baseURL: baseURL };

//  token名和cookie名

var tokenHeaderMap = exports.tokenHeaderMap = {
  DDingAuthHeader: 'auth',
  SSOAuthHeader: 'Access-Token'
};

//  路径白名单，不校验登录
var whiteList = exports.whiteList = [/login/g, /waiting/g, /sso/g];

//  sso名单，需要使用中台token
var ssoList = exports.ssoList = [/sso/g];