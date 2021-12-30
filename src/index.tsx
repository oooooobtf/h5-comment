/*
 * @Description: 评价组件
 * @Author: tj
 * @Date: 2021-09-09 13:38:51
 * @LastEditTime: 2021-12-30 17:19:03
 * @LastEditors: tj
 * ios点击键盘收起会失焦
 * 安卓点击键盘收起不会失焦
 */
import {
  InfiniteScroll,
  List,
  Mask,
  TextArea,
  Toast,
  Image,
} from 'antd-mobile';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import * as dd from 'dingtalk-jsapi';
import { sleep } from 'antd-mobile/cjs/utils/sleep';
import './index.less';
import moment from 'moment';
import _ from 'lodash';
import atPng from './assets/at.svg';
import imgPng from './assets/img.svg';
import zanPng from './assets/dianzan.svg';
import zanActivePng from './assets/dianzan-active.svg';
import caiPng from './assets/diancai.svg';
import caiActivePng from './assets/diancai-active.svg';
import commentPng from './assets/comment.svg';
import tki from 'toolkits-ez';
import Api from './service/apis/comment.js';
import debounce from 'lodash/debounce';
//上传图片
export const ddUploadImage = async (count = 1, stickers = {}) => {
  if (dd.env.platform == 'notInDingTalk') {
  } else {
    //钉钉环境
    return new Promise((resolve, reject) => {
      dd.ready(() => {
        dd.biz.util
          .uploadImage({
            multiple: true,
            max: count,
            compression: true,
            stickers,
          })
          .then((res) => resolve(res))
          .catch((err) => {
            const errorMessages = [
              'onCancel',
              'cancel',
              'Cancel',
              '访问拍摄功能出错',
            ];
            if (errorMessages.includes(err.errorMessage)) {
              return;
            } else {
              Toast.show('错误信息' + err.errorMessage);
              reject(err);
            }
          });
      });
    });
  }
};
//预览图片
export const previewImage = (current: string, urls: string[]) => {
  if (dd.env.platform === 'notInDingTalk') {
    //   Taro.previewImage({ current, urls }).then();
  } else {
    dd.biz.util.previewImage({ current, urls });
  }
};
//选择人员
export const chooseContact = async (
  title = '通讯录',
  options = {},
  corpId = tki.DB.local.getItem('CORP_ID'),
): Promise<any> => {
  return new Promise((resolve, reject) => {
    dd.ready(() => {
      dd.biz.contact.complexPicker({
        title,
        corpId,
        // appId: config.dingTalk.agentId,
        multiple: true,
        limitTips: '超过最大可选人数',
        maxUsers: 1,
        responseUserOnly: true,
        ...options,
        // @ts-ignore
        onSuccess(res: any) {
          resolve(res);
        },
        onFail(err: any) {
          console.log(err);
          if (
            err.errorMessage === 'onCancel' ||
            err.errorMessage === 'Cancel'
          ) {
            return;
          } else {
            reject(err);
          }
        },
      });
    });
  });
};
//评论内容
export const CommentItem = ({ data }) => {
  /**
   * @description: 处理名字为头像
   * @param {string} name 头像
   * @return {*}
   */
  const handleName = (name: string) => {
    if (!name) return;
    name = name.replace(/[0-9]/gi, '');
    return name.substring(name.length - 2, name.length);
  };
  return (
    <div className="comment-item">
      <div className="item-header">
        {/* <img src={`/avatars/icon-test_${random(1, 8)}.png`} /> */}
        <div className={data.avatar ? 'user-avatar img' : 'user-avatar'}>
          {data.avatar ? (
            <img
              className="avatar"
              style={{ width: '100%', height: '100%' }}
              src={data.avatar}
            />
          ) : (
            <span className="avatar">{handleName(data.createPerson)}</span>
          )}
        </div>
        <span className="item-name">{data.createPerson}</span>
        <span className="item-time">
          {moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </div>
      <div className="item-content">{data.content}</div>
    </div>
  );
};
const GkComments = (props) => {
  let loopTimer:NodeJS.Timeout;
  let {
    url,
    allowImg = false,
    allowAt = false,
    imgMaxCount = 3,
    commentKey = '',
    target = {},
  } = props;
  let { targetId = '', targetPerson = '', targetPersonId = '' } = target;
  const commentRef = useRef<HTMLInputElement>(null);
  // const textAreaRef = useRef<any>(null);
  const [data, setData] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false); //是否继续加载
  const [visible, setVisible] = useState(false); //评论框展示
  const [comment, setComment] = useState(''); //评论
  const [imgList, setImgList] = useState<any>([]); //上传的图片
  const [atList, setAtList] = useState<any>([]); //选择过的at人员列表
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [singleStatic, setSingleStatic] = useState({
    comment: 0,
    negative: 0,
    positive: 0,
    positiveOpt: 0,
  });
  const [isFocusAfterUpdated, setIsFocusAfterUpdated] = useState(false);
  const [urlOption, setUrlOption] = useState({ baseURL: url }); //动态请求地址

  /**
   * @description: 加载更多
   * @param {*}
   * @return {*}
   */
  const loadMore = async () => {
    await sleep(2000);
    getComment(pageNum + 1, true);
  };

  /**
   * @description: 获取评论列表
   * @param {*}
   * @return {*}
   */
  const getComment = async (page = pageNum, isConcat = false) => {
    let params = {
      pageNum: page,
      pageSize,
      appBussKey: commentKey,
      targetId,
    };
    let res = await Api.getCommentList(params, urlOption);
    console.log(res, '评论列表数据');
    if (isConcat) {
      setData((val) => [...val, ...res.list]);
    } else {
      setData(res.list);
    }
    setHasMore(page * pageSize < res.total);
  };

  /**
   * @description: 获取评论区统计数据
   * @param {*}
   * @return {*}
   */
  const getCommentStatic = async () => {
    let params = {
      appBussKey: commentKey,
      targetId,
    };
    let res = await Api.getSingleStatis(params, urlOption);
    console.log(res, '评论区统计数据');
    setSingleStatic(res);
  };

  const initData = async () => {
    getComment();
    getCommentStatic();
    deviceType();
    console.log('安卓环境=>', deviceType('android'));
    //针对安卓环境判断
    if (deviceType('android')) {
      window.imgAtFlag = false;
      let originalHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      window.onresize = function () {
        // //键盘弹起与隐藏都会引起窗口的高度发生变化
        let resizeHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        if (resizeHeight - 0 < originalHeight - 0) {
          //当软键盘弹起，在此处操作
          console.log('弹起');
        } else {
          //当软键盘收起，在此处操作
          console.log('收起');
          console.log(window.imgAtFlag, 'imgflag');
          //通过判断是否有图片上传或者是at跳转页面等操作来手动打开评论面板
          if (window.imgAtFlag) {
            setVisible(true);
            window.imgAtFlag = false;
          } else {
            setVisible(false);
          }
        }
      };
    }
    document
      .getElementsByClassName('gk-foucs')[0]
      .addEventListener('click', () => {
        console.log('被动focus');
        setIsFocusAfterUpdated(true);
        // let el = document.getElementById('textArea');
        // //自动聚焦输入框调出键盘
        // el?.focus();
        // setTimeout(() => {
        //   el?.scrollIntoView(true);
        // }, 200);
      });
  };

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    if (isFocusAfterUpdated) {
      console.log('setIsFocusAfterUpdated=>true');
      let el = document.getElementById('textArea');
      //自动聚焦输入框调出键盘
      el?.focus();
      setTimeout(() => {
        el?.scrollIntoView(true);
      }, 200);
      setIsFocusAfterUpdated(false);
    }
  }, [isFocusAfterUpdated]);

  /**
   * @description: 打开评论弹框
   * @param {*}
   * @return {*}
   */
  const openComment = () => {
    setVisible(true);
    setIsFocusAfterUpdated(true);
    // let el = document.getElementById('textArea');
    // //自动聚焦输入框调出键盘
    // el?.focus();
  };

  /**
   * @description: 判断设备类型
   * @param {*} type
   * @return {*}
   */
  const deviceType = (type = '') => {
    let ua = window.navigator.userAgent.toLocaleLowerCase();
    let isIos = /iphone|ipad|ipod/.test(ua);
    let isAndroid = /android/.test(ua);
    let res = {
      ios: isIos,
      android: isAndroid,
    };
    return type ? res[type] : '';
  };

  /**
   * @description: 处理点击提交按钮
   * @param {*} e
   * @return {*}
   */
  const handleSubmitVisible = (e) => {
    // console.log('handleSubmitVisible', e.target);
    if (
      e.target.className === 'comment-submit disable' ||
      e.target.className === 'comment-submit'
    ) {
      if (!comment.trim()) {
        //没有输入内容禁止失去焦点
        e.preventDefault();
      } else {
        setVisible(true);
      }
    }

    if (
      // e.target.className === 'add-image' ||
      // e.target.className === 'add-at' ||
      e.target.className === 'gk-comment-image-item--remove'
    ) {
      //删除图片时禁止失去焦点导致评论面板关闭
      e.preventDefault();
    }
  };

  const loopNode = () => {
    if (document.getElementById('textArea')) {
      // alert('节点展示了');
      clearTimeout(loopTimer);
      let el = document.getElementById('textArea');
      // //自动聚焦输入框调出键盘
      // el?.focus();
      let focusBtn: HTMLElement = document.getElementsByClassName('gk-foucs')[0] as HTMLElement
      focusBtn.click()
      // document.getElementsByClassName('gk-foucs')[0].click();
      // textAreaRef.current.focus()
      // setTimeout(() => {
      //   el?.scrollIntoView(true);
      // }, 300);
      //监听点击发送按钮的逻辑 避免点击发送评论失焦键盘收起
      document.addEventListener(
        'mousedown',
        (e) => handleSubmitVisible(e),
        false,
      );
      //监听ios失焦（点击键盘的完成按钮） 关闭评论窗口
      el?.addEventListener(
        'blur',
        function (e) {
          // 键盘收起
          setVisible(false);
        },
        false,
      );
    } else {
      loopTimer = setTimeout(() => {
        loopNode();
      }, 200);
    }
  };

  useEffect(() => {
    if (visible) {
      console.log('聚焦了');
      // loopNode()
      let el = document.getElementById('textArea');
      // //自动聚焦输入框调出键盘
      // el?.focus();
      let focusBtn: HTMLElement = document.getElementsByClassName('gk-foucs')[0] as HTMLElement
      focusBtn.click()
      // setTimeout(() => {
      //   el?.scrollIntoView(true);
      // }, 200);
      //监听点击发送按钮的逻辑 避免点击发送评论失焦键盘收起
      document.addEventListener(
        'mousedown',
        (e) => handleSubmitVisible(e),
        false,
      );
      //监听ios失焦（点击键盘的完成按钮） 关闭评论窗口 不能删除
      el?.addEventListener(
        'blur',
        function (e) {
          // 键盘收起
          setVisible(false);
        },
        false,
      );
    } else {
      // let el = document.getElementById('textArea');
      // el?.blur();
      document.removeEventListener(
        'mousedown',
        (e) => handleSubmitVisible(e),
        false,
      );
      setIsFocusAfterUpdated(false);
    }
  }, [visible]);

  /**
   * @description: 提交评论
   * @param {*} e
   * @return {*}
   */
  const onSubmit = async (e) => {
    if (!comment.trim()) {
      return Toast.show({
        content: '评论不能为空',
        duration: 2000,
        position: 'bottom',
      });
      // return Toast.show('评论不能为空');
    }
    //请求接口
    let params = {
      content: comment,
      appBussKey: commentKey,
      targetId,
      positive: 0,
      targetPerson,
      targetPersonId,
    };
    //存在图片配置
    if (allowImg) {
      params['img'] = imgList;
    }
    //存在at配置
    if (allowAt) {
      let temp = atList.filter((item: any) => {
        console.log(new RegExp(`@${item?.name}`, 'g'), comment);
        console.log(new RegExp(`@${item?.name}`, 'g').test(comment));
        return new RegExp(`@${item?.name}`, 'g').test(comment);
      });
      console.log(temp);
      params['atList'] = temp;
    }

    console.log(params, 'params评论');
    console.log('submit');
    let res = await Api.updateComment(params, urlOption);
    Toast.show('评论成功！');
    setVisible(false);
    let el = document.getElementById('textArea');
    el?.blur();
    setComment('');
    getComment();
    getCommentStatic();
    return false;
  };

  /**
   * @description: 上传照片
   * @param {*}
   * @return {*}
   */
  const onHandleImage = () => {
    console.log('调用上传照片api');
    // setVisible(false);
    if (deviceType('android')) {
      window.imgAtFlag = true;
    } else {
      // let el = document.getElementById('textArea');
      // el?.focus();
    }
    ddUploadImage(imgMaxCount - imgList.length).then((res: any) => {
      const newValue = res?.map((url: any) => ({ url, showRemove: true }));
      console.log(newValue, 'ddUploadImage');
      setImgList([...imgList, ...newValue]);
      // if (deviceType('ios')) {
      setVisible(true);
      //   setTimeout(() => {
      //     setVisible(true);
      //     // let el = document.getElementById('textArea');
      //     // el?.focus();
      //   }, 200)
      // }
      // onChange({ detail: { value: [..._value, ...newValue] } });
    });
  };

  /**
   * @description: 选择图片预览
   * @param {*} url
   * @return {*}
   */
  const clickImage = (url) => {
    let urls = imgList.map((item: any) => item?.url);
    previewImage(url, urls);
  };

  /**
   * @description: 移除图片
   * @param {*} index
   * @return {*}
   */
  const removeImage = (index) => {
    let temp = _.cloneDeep(imgList);
    temp.splice(index, 1);
    setImgList(temp);
  };

  /**
   * @description: 选择at圈人
   * @param {*}
   * @return {*}
   */
  const onHandleAt = async () => {
    if (dd.env.platform === 'notInDingTalk') {
    } else {
      if (deviceType('android')) {
        window.imgAtFlag = true;
      }
      let { users } = await chooseContact('选择提醒的人');
      console.log(users, 'user');
      let atNameList = users || [];
      let atName = users?.map((item) => item?.name);
      setComment(comment + ' @' + atName[0] + ' ');
      setAtList([...atList, ...atNameList]);
      // setTimeout(() => {
      //   let el = document.getElementById('textArea');
      //   alert(el)
      //   el?.focus();
      setTimeout(() => {
        setVisible(true);
      }, 100);

      // }, 200)
    }
  };

  /**
   * @description: 输入框change
   * @param {*} v
   * @return {*}
   */
  const onTextChange = async (v) => {
    //通过最后一个字符是否是@来判断是否需要艾特
    if (v.substring(v.length - 1, v.length) == '@') {
      let { users } = await chooseContact('选择提醒的人');
      console.log(users, 'user');
      let atNameList = users || [];
      let atName = users.map((item) => item?.name);
      setComment(comment + ' @' + atName[0] + ' ');
      setAtList([...atList, ...atNameList]);
      setVisible(true);
    } else {
      setComment(v);
    }
  };

  /**
   * @description: 快速定位评论区
   * @param {*}
   * @return {*}
   */
  const getCommentAnchor = () => {
    commentRef?.current?.scrollIntoView();
  };

  /**
   * @description: 点赞点踩
   * @param {*} flag 1点赞 2点踩
   * @return {*}
   */
  const thumbUp = async (flag: number) => {
    let params = {
      appBussKey: commentKey,
      targetId,
      positive: flag,
      targetPerson,
      targetPersonId,
    };
    let cancelParams = {
      appBussKey: commentKey,
      targetId,
      positive: flag,
    };
    if (flag === 1) {
      //点赞
      if (singleStatic.positiveOpt === 1) {
        //1已经点赞过 需要取消
        let res = await Api.cancelAction(cancelParams, urlOption);
      } else {
        let res = await Api.updateAction(params, urlOption);
      }
    } else {
      //点踩
      if (singleStatic.positiveOpt === 2) {
        //2已经点踩过 需要取消
        let res = await Api.cancelAction(cancelParams, urlOption);
      } else {
        let res = await Api.updateAction(params, urlOption);
      }
    }
    getCommentStatic();
  };

  const debounceHandle = debounce(thumbUp, 1000);

  return (
    <div className="gk-comment" ref={commentRef}>
      <div className="gk-comment-header">
        <div className="comment">
          评论 <span className="count">{singleStatic.comment}</span>
        </div>
        <div className="judge">
          <div>
            点赞 <span className="count">{singleStatic.positive}</span>
          </div>
          <div>
            差评 <span className="count">{singleStatic.negative}</span>
          </div>
        </div>
      </div>
      <div className="gk-comment-content">
        {data.map((item, index) => {
          return <CommentItem key={index} data={item} />;
        })}
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      </div>
      <div className="gk-comment-footer">
        <div className="gk-comment-input" onClick={openComment}>
          <div>我来说几句...</div>
        </div>
        <div className="gk-comment-tools">
          <span onClick={() => getCommentAnchor()}>
            <Image src={commentPng} width={22} />
          </span>
          <span onClick={() => debounceHandle(1)}>
            <Image
              src={singleStatic.positiveOpt === 1 ? zanActivePng : zanPng}
              width={22}
            />
          </span>
          <span onClick={() => debounceHandle(2)}>
            <Image
              src={singleStatic.positiveOpt === 2 ? caiActivePng : caiPng}
              width={22}
            />
          </span>
        </div>
      </div>
      <Mask
        visible={visible}
        onMaskClick={() => {
          document.getElementById('tt')?.blur();
          setVisible(false);
          // textAreaRef.current.blur()
        }}
      >
        <div className="gk-comment-input-content">
          <div className="content">
            <div className="comment-block">
              <TextArea
                maxLength={500}
                value={comment}
                autoSize={{
                  minRows: 2,
                  maxRows: 3,
                }}
                // autoFocus={true}
                // rows={imgList || !comment ? 2 : 3}
                onChange={(v) => onTextChange(v)}
                id="textArea"
                // ref={textAreaRef}
                placeholder="我来说几句..."
              />
              <div className="gk-comment-image">
                {imgList.map((item: any, index) => {
                  return (
                    <div key={index} className="gk-comment-image-item">
                      <Image
                        src={item.url}
                        fit="cover"
                        width={65}
                        height={70}
                        onClick={() => clickImage(item?.url)}
                      />
                      {item?.showRemove ? (
                        <div
                          onClick={() => removeImage(index)}
                          className="gk-comment-image-item--remove"
                        >
                          ×
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
            <span
              className={comment ? 'comment-submit' : 'comment-submit disable'}
              onClick={(e) => onSubmit(e)}
            >
              发送
            </span>
          </div>
          <div className="gk-comment-extra">
            {allowImg ? (
              <div onClick={() => onHandleImage()}>
                <img className="add-image" src={imgPng} width={25} />
              </div>
            ) : null}
            {allowAt ? (
              <div onClick={() => onHandleAt()}>
                <img className="add-at" src={atPng} width={20} />
              </div>
            ) : null}
          </div>
        </div>
      </Mask>
      <div className="gk-foucs">
        {/* <label className='gk-foucs' htmlFor='textArea'></label> */}
      </div>
    </div>
  );
};

export default GkComments;