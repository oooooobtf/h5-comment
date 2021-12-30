export const NODE_ENV = process.env.NODE_ENV;

const ENV = BUILD_ENV ? BUILD_ENV : 'local';

//  域名配置
export const domainMap = {
  local: 'http://center-dev.gaojin.com.cn/api/appraise',
  dev: 'http://center-dev.gaojin.com.cn/api/appraise',
  test: 'http://center-test.gaojin.com.cn/api/appraise',
  uat: 'http://center-uat.gaojin.com.cn/api/appraise',
  prod: 'http://center.gaojin.com.cn/api/appraise',
};

//  域名
export const domain = domainMap[ENV];

//  请求basePath
export const basePath = ``;

//  请求完整baseUrl
// export const baseURL = `${domain}${basePath}`;
export const baseURL = '';
export default { baseURL };

//  token名和cookie名
export const tokenHeaderMap = {
  DDingAuthHeader: 'auth',
  SSOAuthHeader: 'Access-Token',
};

//  路径白名单，不校验登录
export const whiteList = [/login/g, /waiting/g, /sso/g];

//  sso名单，需要使用中台token
export const ssoList = [/sso/g];
