import {
  Storage,
  $nav,
  pageLocal,
  isBlankObject,
} from '@/utils/utils.js'
import {
  getUserInfo
} from '@/servers/user.js'
import {
  getCurrPageRoute
} from './routes.js';
import store from '@/store/index.js'
const SUCCESS_CODE = 200;
const FAILE_CODE = 500;
const check_login_page = [
  "pages/login/index"
]; //不需要检测登录的页面,并记录传入的query或者param    "pages/index/index",
export function parseParams(uri, params) {
  const paramsArray = [];
  if (JSON.stringify(params) == '{}') {

    return uri
  }
  Object.keys(params).forEach(key => params[key] && paramsArray.push(`${key}=${params[key]}`))
  if (uri.search(/\?/) === -1) {
    uri += `?${paramsArray.join('&')}`
  } else {
    uri += `&${paramsArray.join('&')}`
  }
  return uri
}

function init(that) {
  const page = getCurrentPages();
  // const route = that.__route__;
  const route = getCurrPageRoute(that.__route__);
  console.log(route)
  return new Promise(async (resolve, reject) => {
    if (!route) {
      /**
       * 检查mini-admin/routes文件
       */
      reject('请检查路由是否配置')
      $nav.reLaunch("pages/login/index")
      return
    }
    // 记录进入页面，登录失效，重新登陆后进入此页面
    Storage.set('entryPage', {
      key: that.$options,
      url: parseParams(route.path, page[0].options)
    })
    if (route.meta && route.meta.isNeedSaveImage) {
      try {
        await pageLocal.getPageLocal(route.meta.imageUrl);
        console.info('用户已授权')
      } catch (e) {
        console.log(e, '---图片上传失败')
      }
    }
    if (route.meta && route.meta.isCheck) {

      getUserInfo().then(async res => {
        console.log('系统登录成功')
        store.commit("userInfo/SET_LOGIN_STATUS", true);
        store.commit("userInfo/SAVE_USER_INFO", res.data.data);
        /**
         * 登录完成初始化Im,如果已经初始化了一个IM实例，但是断联了,则只需要启动IM的重连机制，不需要每进页面都要连接
         * */
        if (route.meta.isNeedImConnect) {
          console.log('当前页面需要连接云信')
          store.dispatch("im/connectNim", res.data.data).then(res => {
            console.info('页面信息确认完毕')
            resolve('success')
          });
        } else {
          resolve('success')
        }

      }).catch(err => {
        console.log('获取用户信息接口报错', err.data);

        store.commit("userInfo/SET_LOGIN_STATUS", false);
        console.error('登录失败，请寻找原因', err);
        // 记录检测登录页面的路由参数，登录成功后可返回该页面

        uni.showToast({
          title: '登录过期',
          icon: 'error'
        });
        setTimeout(() => {
          $nav.reLaunch("pages/login/index")
        }, 1000)

      })

    } else {
      if (route.meta && route.meta.isNeedSaveImage) {
        try {
          await pageLocal.getPageLocal(route.meta.imageUrl);
        } catch (e) { }
      }
      store.commit("userInfo/SET_LOGIN_STATUS", false)
      console.info(`${route.path}允许游客模式`)
      resolve('success')
    }
  })
}
export {
  init
}
