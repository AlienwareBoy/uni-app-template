import subPackagesRoutes from './subPackages/index.js'
/**  
*  模拟页面基础信息，协助路由记录信息
* 
* @access public 
* @param isCheck 检测是否登录
* @param isNeedSaveImage 检测当前路由是否需要缓存图片
* @param imageUrl 需要缓存的图片数组
* @param isNeedImConnect 当前页面是否要连接云信
*/
export const routes = [
  ...subPackagesRoutes,
  {
    "path": "pages/index/index",
    "meta": {
      "isNeedImConnect":true,
      "isCheck": true,
      "isNeedSaveImage": false,
    }
  }
]
/**
 * 获取指定路由信息
 */
export function getCurrPageRoute(route) {
  return routes.find(item => item.path === route)
}
/**
 * 获取当前路由信息
 */
export function getPageRoute() {
  const page = getCurrentPages();
  return routes.find(item => item.path === page[0].route)
}
