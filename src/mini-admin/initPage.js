import {
  init
} from "./init.js";
import { uninstall } from './uninstall.js'

function MyPage(config) {
  let _this = this;
  this.lifetimeBackup = {};
  const LIFETIME_EVENTS = ["onLoad", "onShow", "mounted", "onHide"];
  LIFETIME_EVENTS.forEach((event) => {
    _this.lifetimeBackup[event] = config[event] || function () { };
    config[event] = function () { };
  });
  config.onLoad = function (options) {
    let that = this;
    let LIFETIME_EVENTS_COPY = ['onLoad', 'mounted'];
    init(that).then((res) => {
      LIFETIME_EVENTS_COPY.forEach(event => {
        _this.lifetimeBackup[event].call(that, options);
        config[event] = _this.lifetimeBackup[event];
      })

    }).catch(err => {
      console.error(err)
    });
  };
  config.onShow = function (options) {
    let that = this;
    _this.lifetimeBackup['onShow'].call(that, options);
    config['onShow'] = _this.lifetimeBackup['onShow'];
  };
  config.onHide = function (options) {
    let that = this;
    _this.lifetimeBackup['onHide'].call(that, options);
    config['onHide'] = _this.lifetimeBackup['onHide'];

  };
  return config;
}
const miniPage = function (config) {
  return new MyPage(config);
};
export {
  miniPage
};
