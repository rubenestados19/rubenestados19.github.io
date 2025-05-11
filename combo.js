window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/get-env.js'] = window.SLM['theme-shared/utils/get-env.js'] || function () {
  const _exports = {};
  function getEnv(key) {
    const ENV = window.__ENV__ || {};
    if (key) return ENV[key];
    return ENV;
  }
  _exports.default = getEnv;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/parsePathToArray.js'] = window.SLM['theme-shared/utils/parsePathToArray.js'] || function () {
  const _exports = {};
  function parsePathToArray(path) {
    if (typeof path !== 'string') {
      throw new TypeError('path must be string');
    }
    return path.replace(/\]/, '').split(/[.[]/);
  }
  _exports.default = parsePathToArray;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/state-selector.js'] = window.SLM['theme-shared/utils/state-selector.js'] || function () {
  const _exports = {};
  const { SL_EventEmitter } = window['@yy/sl-theme-shared']['/utils/event-bus'];
  const parsePathToArray = window['SLM']['theme-shared/utils/parsePathToArray.js'].default;
  class SLState {
    constructor(state) {
      this.bus = new SL_EventEmitter();
      this.rootState = state;
    }
    get(path) {
      const keys = parsePathToArray(path);
      const value = keys.reduce((prev, current) => {
        if (!prev) return undefined;
        return prev[current];
      }, this.rootState);
      return value;
    }
    set(path, newValue) {
      if (typeof newValue === 'function') {
        throw TypeError('newValue must not be a function');
      }
      const keys = parsePathToArray(path);
      let oldValue;
      keys.reduce((prev, current, index) => {
        if (index === keys.length - 1) {
          const key = prev;
          oldValue = key[current];
          key[current] = newValue;
        }
        return prev[current];
      }, this.rootState);
      this.bus.emit(path, newValue, oldValue);
    }
    on(...args) {
      return this.bus.on(...args);
    }
    off(...args) {
      return this.bus.off(...args);
    }
  }
  const __PRELOAD_STATE__ = window.__PRELOAD_STATE__ || {};
  if (!window.SL_State) {
    window.SL_State = new SLState(__PRELOAD_STATE__);
  }
  const {
    SL_State
  } = window;
  _exports.SL_State = SL_State;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/report/const.js'] = window.SLM['theme-shared/utils/report/const.js'] || function () {
  const _exports = {};
  const getEnv = window['SLM']['theme-shared/utils/get-env.js'].default;
  const PageType = {
    Home: 0,
    ProductCategory: 1,
    ProductAll: 2,
    ProductDetail: 3,
    ProductSearch: 4,
    MiniCart: 5,
    Cart: 6,
    CheckoutProgress: 7,
    CheckoutConfirm: 8,
    OrderConfirm: 9,
    SignIn: 10,
    SignInSuccess: 11,
    SignUp: 12,
    SignUpSuccess: 13,
    ProductPage: 14,
    UserCenter: 15,
    SalesPromotion: 16,
    OrderDetail: 17,
    OneShop: 18
  };
  const ClickType = {
    SelectContent_Product: 0,
    AddToCart: 1,
    RemoveFromCart: 2,
    CheckoutToCart: 3,
    BeginCheckout: 4,
    CheckoutProgress: 5,
    PlaceOrder: 6,
    Login: 7,
    ViewCart: 8
  };
  const eventType = {
    SetCheckoutOption: 'set_checkout_option',
    SelectContent: 'select_content',
    AddToCart: 'add_to_cart',
    RemoveFromCart: 'remove_from_cart',
    ViewCart: 'view_cart'
  };
  const isProd = ['product', 'preview'].includes(getEnv().APP_ENV);
  const salvageURLMap = {
    stg: {
      single: 'https://websdkentmaster0923.myshoplinestg.com/action/event/salvage',
      batch: 'https://websdkentmaster0923.myshoplinestg.com/action/event/batchSalvage'
    },
    prd: {
      single: 'https://websdkentmaster0923.myshopline.com/action/event/salvage',
      batch: 'https://websdkentmaster0923.myshopline.com/action/event/batchSalvage'
    }
  };
  const salvageURL = isProd ? salvageURLMap.prd : salvageURLMap.stg;
  _exports.ClickType = ClickType;
  _exports.PageType = PageType;
  _exports.salvageURL = salvageURL;
  _exports.eventType = eventType;
  const CHECKOUT_PURCHASE_CHAIN_ALIAS = ['Checkout', 'Processing', 'Thankyou'];
  _exports.CHECKOUT_PURCHASE_CHAIN_ALIAS = CHECKOUT_PURCHASE_CHAIN_ALIAS;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/report/hdReport.js'] = window.SLM['theme-shared/utils/report/hdReport.js'] || function () {
  const _exports = {};
  const Cookies = window['js-cookie']['default'];
  const dayjs = window['dayjs']['default'];
  const utc = window['dayjs']['/plugin/utc'].default;
  const timezone = window['dayjs']['/plugin/timezone'].default;
  const { sessionId } = window['@sl/logger'];
  const geEnv = window['SLM']['theme-shared/utils/get-env.js'].default;
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { CHECKOUT_PURCHASE_CHAIN_ALIAS } = window['SLM']['theme-shared/utils/report/const.js'];
  dayjs.extend(utc);
  dayjs.extend(timezone);
  class HdReport {
    constructor() {
      this.deviceInfo = null;
      const {
        APP_ENV
      } = geEnv();
      const Shopline = window.Shopline || {};
      let env = APP_ENV !== 'develop' ? 'product' : '';
      if (APP_ENV === 'preview') {
        env = APP_ENV;
      }
      if (Shopline.designMode) {
        env = '';
      }
      const debugMode = Shopline.designMode ? false : APP_ENV === 'staging' || APP_ENV === 'develop';
      const pid = window.__PRELOAD_STATE__ ? window.__PRELOAD_STATE__.serverEventId : undefined;
      const timeOffset = Shopline.systemTimestamp ? +new Date() - Shopline.systemTimestamp : 0;
      const that = this;
      if (!window.HdSdk || !window.HdSdk.shopTracker) return;
      const isCheckoutPurchaseChainPage = CHECKOUT_PURCHASE_CHAIN_ALIAS.includes(Shopline.uri && Shopline.uri.alias);
      const {
        themeVersion
      } = Shopline;
      window.HdSdk.shopTracker.setOptions({
        env,
        timezoneOffset: SL_State.get('storeInfo.timezoneOffset') || 0,
        disableIframeId: true,
        timeOffset,
        beforeSend: async data => {
          if (!that.deviceInfo && window.__DF__) {
            that.deviceInfo = await window.__DF__.getDeviceInfo();
          }
          const warpData = {
            theme_id: SL_State.get('themeConfig.themeId'),
            store_region: SL_State.get('storeInfo.marketStorageRegion'),
            store_timezone: SL_State.get('storeInfo.timezone'),
            user_timezone: dayjs.tz.guess(),
            theme_name: Shopline.themeName,
            theme_version: themeVersion,
            is_admin: Cookies.get('r_b_ined') || '0',
            device_token: that.deviceInfo ? that.deviceInfo.token : undefined,
            ua_info: that.deviceInfo ? that.deviceInfo.deviceInfo : undefined,
            pid,
            update_mode: Shopline.updateMode ? Shopline.updateMode.toString() || '' : undefined,
            time_offset: timeOffset,
            trade_logger_id: sessionId.get(),
            ...data
          };
          if (isCheckoutPurchaseChainPage) {
            warpData.feature_flag = themeVersion;
          }
          if (!Object.prototype.hasOwnProperty.call(data, 'iframe_id') || Number(data.iframe_id) === 1) {
            warpData.iframe_id = Cookies.get('n_u') || Cookies.get('sl_iframe_id');
          }
          return warpData;
        }
      });
      window.HdSdk.shopTracker.setDebugMode(debugMode);
      window.HdSdk.shopTracker.use('url', (url, payload) => {
        const payloads = [].concat(payload);
        const enhancedUrl = `${url}${url.indexOf('?') === -1 ? `?` : '&'}_pid=${pid}`;
        const defaultEventId = -999;
        const obj = payloads.reduce((o, {
          source
        }) => {
          const result = o;
          const {
            act,
            eventid,
            event_id
          } = source;
          const item = eventid || event_id || defaultEventId;
          result[act] = result[act] ? [...result[act], item] : [item];
          return result;
        }, {});
        const joinStr = Object.keys(obj).reduce((str, act) => {
          return `${str}:${act}_${obj[act].join(',')}`;
        }, '').slice(1);
        const tempUrl = `${enhancedUrl}&_act=${joinStr}`;
        if (tempUrl.indexOf('n.gif') !== -1) {
          return tempUrl.replace('/eclytics/n.gif', '/eclytics/i');
        }
        if (tempUrl.indexOf('o.gif') !== -1) {
          return tempUrl.replace('/eclytics/o.gif', '/eclytics/c');
        }
        return tempUrl;
      });
    }
  }
  const hidooRp = window.SL_Report ? window.SL_Report.hdReportInstance || new HdReport() : undefined;
  if (!window.SL_Report || !window.SL_Report.hdReportInstance) {
    window.SL_Report = window.SL_Report || {};
    window.SL_Report.hdReportInstance = hidooRp;
  }
  _exports.hidooRp = hidooRp;
  _exports.HdReport = HdReport;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/report/@hiido.js'] = window.SLM['theme-shared/utils/report/@hiido.js'] || function () {
  const _exports = {};
  const Cookies = window['js-cookie']['default'];
  const ClickType = {
    AddPaymentInfo: 6,
    AddToCart: 1,
    InitiateCheckout: 4
  };
  _exports.ClickType = ClickType;
  class Hidoo {
    init() {
      return this;
    }
    load() {
      return this;
    }
    report() {}
  }
  Hidoo.FB_CHECKER_INFO = {
    lock: false,
    interval: 300,
    timmer: null
  };
  Hidoo.fbChecker = function () {};
  Hidoo.getFbParams = function () {
    const re = {
      iframe_id: 1
    };
    ['c_user', '_fbp', '_fbc'].forEach(key => {
      re[key] = Cookies.get(key) || '';
    });
    return re;
  };
  _exports.default = new Hidoo();
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/createLogger.js'] = window.SLM['theme-shared/utils/createLogger.js'] || function () {
  const _exports = {};
  const createDebug = window['debug']['default'];
  const getEnv = window['SLM']['theme-shared/utils/get-env.js'].default;
  const isFunction = fn => typeof fn === 'function';
  const createLogger = (name, description) => {
    const logger = {
      debug: window.console.debug,
      error: window.console.error,
      info: window.console.info,
      log: window.console.log
    };
    if (typeof window === 'undefined') {
      return logger;
    }
    if (['product'].includes(getEnv().APP_ENV)) {
      createDebug && createDebug.disable();
    }
    if (!isFunction(createDebug)) return;
    const desc = description ? ` - ${description}` : '';
    logger.error = createDebug(`${name}:error${desc}`).bind(console);
    logger.debug = createDebug(`${name}:debug${desc}`).bind(console);
    logger.info = createDebug(`${name}:info${desc}`).bind(console);
    logger.log = createDebug(`${name}:log${desc}`).bind(console);
    return logger;
  };
  _exports.default = createLogger;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/report/utils.js'] = window.SLM['theme-shared/utils/report/utils.js'] || function () {
  const _exports = {};
  const createLogger = window['SLM']['theme-shared/utils/createLogger.js'].default;
  function composedPath(event) {
    if (event.path) {
      return event.path;
    }
    if (typeof event.composedPath === 'function') {
      return event.composedPath();
    }
    const path = [];
    let {
      target
    } = event;
    while (target.parentNode !== null) {
      path.push(target);
      target = target.parentNode;
    }
    path.push(document, window);
    return path;
  }
  _exports.composedPath = composedPath;
  const storageName = `orderSignList`;
  const helpersConsole = createLogger('helpers', '[matchOrderSign]');
  function addOrderSign(seq) {
    if (typeof window !== 'undefined') {
      const signListJSON = window && window.localStorage && window.localStorage.getItem(storageName) || JSON.stringify([]);
      const signList = JSON.parse(signListJSON);
      signList.push(seq);
      window && window.localStorage && window.localStorage.setItem(storageName, JSON.stringify(signList));
      helpersConsole.log('signList', signList);
    }
  }
  _exports.addOrderSign = addOrderSign;
  function matchOrderSign(seq) {
    if (typeof window !== 'undefined') {
      const signListJSON = window && window.localStorage && window.localStorage.getItem(storageName) || JSON.stringify([]);
      const signList = JSON.parse(signListJSON);
      helpersConsole.log('match seq', seq);
      return signList.includes(seq);
    }
  }
  _exports.matchOrderSign = matchOrderSign;
  function removeOrderSign(seq, options = {}) {
    if (typeof window !== 'undefined') {
      const signListJSON = window && window.localStorage && window.localStorage.getItem(storageName) || JSON.stringify([]);
      const signList = JSON.parse(signListJSON);
      if (options && options.removeAll) {
        helpersConsole.log('remove all', storageName);
        window && window.localStorage && window.localStorage.removeItem(storageName);
        return;
      }
      const filterList = signList.filter(sign => sign !== seq);
      helpersConsole.log('filter', filterList);
      window && window.localStorage && window.localStorage.setItem(storageName, JSON.stringify(filterList));
    }
  }
  _exports.removeOrderSign = removeOrderSign;
  function onDomReady(fn) {
    document.removeEventListener('DOMContentLoaded', fn);
    if (document.readyState !== 'loading') {
      setTimeout(fn, 1);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(fn);
      });
    }
  }
  _exports.onDomReady = onDomReady;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/report/index.js'] = window.SLM['theme-shared/utils/report/index.js'] || function () {
  const _exports = {};
  const HiidoReport = window['SLM']['theme-shared/utils/report/@hiido.js'].default;
  const { composedPath } = window['SLM']['theme-shared/utils/report/utils.js'];
  const { CHECKOUT_PURCHASE_CHAIN_ALIAS } = window['SLM']['theme-shared/utils/report/const.js'];
  const CLICK_CLASSNAME = '__sl-track_click';
  const EXPOSE_CLASSNAME = '__sl-track_expose';
  const COLLECT_CLICK_CLASSNAME = '__sl-collect_click';
  const COLLECT_EXPOSE_CLASSNAME = '__sl-collect_expose';
  if (!window.SL_Report || !window.SL_Report.loaded) {
    window.SL_Report = window.SL_Report || {};
    initReportEvent();
  }
  if (!window.SL_Report.HdObserverSet) {
    window.SL_Report.HdObserverSet = new WeakSet();
  }
  if (!window.SL_Report.HdObserver) {
    window.SL_Report.HdObserver = new IntersectionObserver(entries => {
      entries.forEach(entrie => {
        if (entrie.isIntersecting) {
          const repeat = entrie.target ? entrie.target.dataset['track_repeat'] || entrie.target.dataset['collect_repeat'] : undefined;
          if (entrie.target.classList && (entrie.target.classList.contains(EXPOSE_CLASSNAME) || entrie.target.classList.contains(COLLECT_EXPOSE_CLASSNAME)) && (repeat === 'true' || repeat !== 'true' && !window.SL_Report.HdObserverSet.has(entrie.target))) {
            let collectObj = {};
            sendCollect(entrie.target, collectObj, () => {
              if (repeat !== 'true') {
                window.SL_Report.HdObserverSet.add(entrie.target);
              }
            });
          } else {
            if (!window.SL_Report.HdObserverSet.has(entrie.target)) {
              window.SL_EventBus.emit('global:hdReport:expose', entrie.target);
              window.SL_Report.HdObserverSet.add(entrie.target);
            }
          }
        }
      });
    }, {
      threshold: 0
    });
  }
  function initReportEvent() {
    window.SL_Report.loaded = true;
    window.SL_EventBus.on('global:thirdPartReport', data => {
      try {
        Object.keys(data).forEach(dataKey => {
          let eventKey = dataKey;
          if (dataKey === 'GAR') {
            eventKey = 'GARemarketing';
          }
          if (dataKey === 'GA4') {
            eventKey = 'GA';
          }
          if (window.__PRELOAD_STATE__.eventTrace && window.__PRELOAD_STATE__.eventTrace.enabled[eventKey]) {
            let configs = window.__PRELOAD_STATE__.eventTrace.enabled[eventKey];
            if (eventKey === 'GA') {
              const newConfigs = configs.reduce((list, config) => {
                const hasConfig = list.some(c => {
                  if (!c.version) return false;
                  if (c.version === config.version) return true;
                });
                return !hasConfig ? [...list, config] : list;
              }, []);
              configs = newConfigs;
            }
            let payloads = data[dataKey];
            switch (dataKey) {
              case 'GA':
              case 'GAAds':
              case 'GARemarketing':
              case 'GAR':
              case 'GA4':
                configs.forEach(config => {
                  if (dataKey === 'GA' && config.enableEnhancedEcom && data.GAE) {
                    payloads = data[dataKey].concat(data.GAE);
                  }
                  payloads.forEach(([track, event, data = {}, scope, ...rest]) => {
                    data = data || {};
                    const {
                      useLegacyCode,
                      traceType,
                      version
                    } = config;
                    if (parseInt(traceType, 10) === 0) return;
                    if (useLegacyCode === undefined && dataKey === 'GAR') return;
                    if (parseInt(useLegacyCode, 10) === 0 && dataKey === 'GARemarketing') return;
                    if (parseInt(useLegacyCode, 10) === 1 && dataKey === 'GAR') return;
                    if ((config.scope || scope) && scope !== config.scope) return;
                    if (!version) {
                      if (dataKey === 'GA4') return;
                    } else {
                      if (dataKey === 'GA' && version === 'GA4') return;
                      if (dataKey === 'GA4' && version === 'UA') return;
                    }
                    const isDataObj = Object.prototype.toString.call(data) === '[object Object]';
                    if (['GARemarketing', 'GAR'].indexOf(dataKey) !== -1 && isDataObj) {
                      data.send_to = `${config.id}`;
                    }
                    if ('GA' === dataKey) {
                      if (version) {
                        data.send_to = 'UA';
                      } else {
                        data.send_to = `${config.id}`;
                      }
                    }
                    if ('GA4' === dataKey) {
                      data.send_to = 'GA4';
                    }
                    if (dataKey === 'GAAds' && isDataObj) {
                      data.send_to = `${config.id}/${config.tag}`;
                    }
                    window.gtag(track, event, data, ...rest);
                  });
                });
                break;
              case 'FBPixel':
                payloads.forEach(payload => {
                  const [action, eventName, customData = {}, extData = {}, ...rest] = payload;
                  window.fbq(action, eventName, customData, extData, ...rest);
                });
                break;
              default:
                break;
            }
          }
        });
        if (data.FBPixel && data.FBPixel[0]) {
          HiidoReport.report(data.FBPixel[0][1], data.FBPixel[0][2], data.FBPixel[0][3], data.FBPixel[0][4]);
        }
      } catch (err) {
        console.error('global:thirdPartReport err:', err);
      }
    });
    let beforeunloadCallback;
    let getDestPathCallback;
    let sendLock = false;
    window.SL_EventBus.on('global:hdReport:exit', data => {
      if (beforeunloadCallback) {
        sendLock = false;
        window.removeEventListener('beforeunload', beforeunloadCallback);
        document.removeEventListener('click', getDestPathCallback);
      }
      function report(data, page_dest) {
        if (sendLock) return;
        sendLock = true;
        if (Object.prototype.toString.call(data) === '[object Object]') {
          window.HdSdk && window.HdSdk.shopTracker.collect({
            action_type: '999',
            page_dest_url: page_dest,
            ...data
          });
        }
      }
      beforeunloadCallback = () => {
        report(data, '');
      };
      getDestPathCallback = event => {
        const path = composedPath(event);
        for (let i = path.length; i--;) {
          const element = path[i];
          if (element && element.nodeType === 1 && element.nodeName.toLowerCase() === 'a') {
            if (/^https?:\/\//.test(element.href)) {
              report(data, element.href);
              break;
            }
          }
        }
      };
      window.addEventListener('beforeunload', beforeunloadCallback);
      document.addEventListener('click', getDestPathCallback);
    });
    window.SL_EventBus.on('global:hdReport:pageview', (...data) => {
      const [eventIdOrData, ...rest] = data;
      if (Object.prototype.toString.call(eventIdOrData) === '[object Object]') {
        window.HdSdk && window.HdSdk.shopTracker.collect(eventIdOrData);
      }
    });
    const excludeAds = CHECKOUT_PURCHASE_CHAIN_ALIAS.includes(window.Shopline && window.Shopline.uri && window.Shopline.uri.alias);
    window.SL_EventBus.emit('global:thirdPartReport', {
      FBPixel: [['track', 'PageView', {}, {
        eventID: window.__PRELOAD_STATE__ ? window.__PRELOAD_STATE__.serverEventId : undefined
      }]],
      GAAds: excludeAds ? [] : [['event', 'conversion', null]],
      GA: [['event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname + window.location.search
      }]],
      GA4: [['event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname + window.location.search
      }]]
    });
    startObserver();
    clickCollect();
  }
  function sendCollect(el, collectObj, callback) {
    while (el) {
      const {
        dataset
      } = el;
      collectReportProps(dataset, collectObj);
      el = el.parentNode;
    }
    if (!Object.keys(collectObj).length) return;
    const {
      collect
    } = collectObj;
    if (collect && Object.keys(collect).length) {
      window.HdSdk && window.HdSdk.shopTracker.collect(collect);
    }
    callback && callback();
  }
  function collectReportProps(dataset, collectObj = {}) {
    if (!dataset) return;
    Object.keys(dataset).forEach(sKey => {
      ['track', 'collect'].forEach(collectKey => {
        const value = dataset[sKey];
        if (sKey.indexOf(collectKey) === 0) {
          collectObj[collectKey] = collectObj[collectKey] || {};
          let key = sKey.replace(collectKey, '');
          if (key.startsWith('_')) return;
          key = key.replace(/[A-Z]/g, (letter, index) => {
            return `${index === 0 ? '' : '_'}${letter.toLowerCase()}`;
          });
          if (!collectObj[collectKey].hasOwnProperty(key)) {
            collectObj[collectKey][key] = value;
          }
        }
      });
    });
  }
  function collectObserver(options) {
    [].forEach.call(document.querySelectorAll(options.selector), el => {
      window.SL_Report && window.SL_Report.HdObserver && window.SL_Report.HdObserver.observe(el);
    });
  }
  _exports.collectObserver = collectObserver;
  function startObserver(options) {
    options = Object.assign({
      selector: `.${EXPOSE_CLASSNAME}, .${COLLECT_EXPOSE_CLASSNAME}`
    }, options);
    if (options.reset) {
      window.SL_Report.HdObserverSet = new WeakSet();
    }
    window.SL_Report && window.SL_Report.HdObserver && window.SL_Report.HdObserver.disconnect();
    if (document.readyState === 'complete') {
      collectObserver(options);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        collectObserver(options);
      });
    }
  }
  _exports.startObserver = startObserver;
  function clickCollect() {
    if (!window.SL_Report || !window.SL_Report.__clickCollectCallback) {
      window.SL_Report = window.SL_Report || {};
      window.SL_Report.__clickCollectCallback = ev => {
        if (ev.target.classList && (ev.target.classList.contains(CLICK_CLASSNAME) || ev.target.classList.contains(COLLECT_CLICK_CLASSNAME))) {
          let collectObj = {};
          sendCollect(ev.target, collectObj);
          window.SL_EventBus.emit('global:hdReport:click', ev.target);
        }
      };
    }
    const options = {
      capture: true
    };
    document.removeEventListener('click', window.SL_Report.__clickCollectCallback, options);
    document.addEventListener('click', window.SL_Report.__clickCollectCallback, options);
  }
  _exports.clickCollect = clickCollect;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/syntax-patch.js'] = window.SLM['theme-shared/utils/syntax-patch.js'] || function () {
  const _exports = {};
  const _get = window['lodash']['get'];
  const _toPath = window['lodash']['toPath'];
  function nullishCoalescingOperator(...args) {
    const val = args.find(item => {
      if (typeof item === 'function') {
        const result = item();
        return result !== null && result !== undefined;
      }
      return item !== null && item !== undefined;
    });
    if (val === null || val === undefined) {
      return args[args.length - 1];
    }
    return val;
  }
  _exports.nullishCoalescingOperator = nullishCoalescingOperator;
  function get(obj, ...args) {
    return _get(obj, ...args);
  }
  _exports.get = get;
  function get_func(obj, path) {
    const pathList = _toPath(path);
    const parentPath = pathList.splice(0, pathList.length - 1);
    const key = pathList[0];
    const parent = parentPath.length ? _get(obj, parentPath) : obj;
    const exec = (...args) => {
      if (parent && typeof parent[key] === 'function') {
        return parent[key](...args);
      }
      return undefined;
    };
    return {
      value: parent ? parent[key] : undefined,
      exec
    };
  }
  _exports.get_func = get_func;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/i18n.js'] = window.SLM['theme-shared/utils/i18n.js'] || function () {
  const _exports = {};
  const { get, get_func, nullishCoalescingOperator } = window['SLM']['theme-shared/utils/syntax-patch.js'];
  function parsePathToArray(path) {
    if (typeof path !== 'string') {
      throw new TypeError('path must be string');
    }
    return path.replace(/\]/, '').split(/[.[]/);
  }
  function t(path, hash) {
    const keys = parsePathToArray(path);
    const value = keys.reduce((prev, current) => {
      if (!prev) return undefined;
      return prev && prev.string ? prev.string[current] : prev[current];
    }, window.__I18N__);
    const regExp = /\{\{([^{}]+)\}\}/g;
    return nullishCoalescingOperator(get_func(value, 'replace').exec(regExp, (...args) => nullishCoalescingOperator(get(hash, args[1]), args[0])), path);
  }
  _exports.t = t;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/request.js'] = window.SLM['theme-shared/utils/request.js'] || function () {
  const _exports = {};
  const axios = window['axios']['default'];
  const qs = window['query-string']['default'];
  const baseAxiosConfig = {
    baseURL: '/leproxy/api',
    timeout: 30e3,
    withCredentials: true,
    paramsSerializer(params) {
      return qs.stringify(params);
    }
  };
  _exports.baseAxiosConfig = baseAxiosConfig;
  const instance = axios.create(baseAxiosConfig);
  const leproxyInterceptor = [res => {
    const {
      status,
      data,
      config
    } = res;
    switch (config.baseURL) {
      case '/leproxy':
        if (status !== 200 || data.rescode !== '0') {
          return Promise.reject({
            message: data.resmsg,
            ...data
          });
        }
        break;
      case '/leproxy/api':
      default:
        if (status !== 200 || !(data.success || data.code === 'SUCCESS')) {
          return Promise.reject(data);
        }
        break;
    }
    return data;
  }, error => {
    return Promise.reject(error);
  }];
  _exports.leproxyInterceptor = leproxyInterceptor;
  instance.interceptors.response.use(...leproxyInterceptor);
  _exports.default = instance;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/retryRequest.js'] = window.SLM['theme-shared/utils/retryRequest.js'] || function () {
  const _exports = {};
  const axios = window['axios']['default'];
  const { baseAxiosConfig, leproxyInterceptor } = window['SLM']['theme-shared/utils/request.js'];
  const instance = axios.create(baseAxiosConfig);
  instance.interceptors.response.use(...leproxyInterceptor);
  instance.defaults.retry = 2;
  const setupRetryInterceptor = retryUrls => {
    if (!retryUrls || !Array.isArray(retryUrls)) return;
    instance.interceptors.response.use(undefined, err => {
      const {
        config
      } = err;
      if (!config || !config.retry || !retryUrls.includes(config.url)) return Promise.reject(err);
      config.retryCount = config.retryCount || 0;
      if (config.retryCount >= config.retry) {
        return Promise.reject(err);
      }
      config.retryCount += 1;
      return instance({
        headers: {
          retryCount: config.retryCount,
          ...(config.headers || {})
        },
        ...config
      });
    });
  };
  _exports.setupRetryInterceptor = setupRetryInterceptor;
  _exports.default = instance;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/url-adaptor.js'] = window.SLM['theme-shared/utils/url-adaptor.js'] || function () {
  const _exports = {};
  const qs = window['query-string']['*'];
  const queryStringConfig = {
    options: {
      skipNull: true,
      skipEmptyString: true
    }
  };
  _exports.queryStringConfig = queryStringConfig;
  const adaptor = (url, {
    query,
    fragmentIdentifier,
    fullQuery = true
  } = {}) => {
    const currentUrl = qs.parseUrl(window.location.href, {
      ...queryStringConfig.options,
      parseFragmentIdentifier: true
    });
    const allQuery = fullQuery ? {
      ...(currentUrl.query || {}),
      ...(query || {})
    } : {
      ...query
    };
    const passUrl = qs.stringifyUrl({
      url,
      query: allQuery,
      fragmentIdentifier: fragmentIdentifier || currentUrl.fragmentIdentifier
    }, queryStringConfig.options);
    const wholeUrl = `${window.location.protocol}//${window.location.host}${passUrl}`;
    return {
      originUrl: url,
      ...currentUrl,
      query: allQuery,
      url: passUrl,
      wholeUrl
    };
  };
  _exports.adaptor = adaptor;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/newCurrency/CurrencyConvert.js'] = window.SLM['theme-shared/utils/newCurrency/CurrencyConvert.js'] || function () {
  const _exports = {};
  const { setCurrencyConfig, setStoreCurrency, setDefaultToCurrency, getConvertPrice: originGetConvertPrice, convertFormat: originConvertFormat, covertCalc, convertFormatWithoutCurrency: originConvertFormatWithoutCurrency } = window['@sl/currency-tools-core'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const storeCurrency = window.Shopline.currency;
  const toDefault = SL_State.get('currencyCode') || storeCurrency;
  const {
    currencyDetailList
  } = window.Shopline.currencyConfig;
  setCurrencyConfig(currencyDetailList);
  setStoreCurrency(storeCurrency);
  setDefaultToCurrency(toDefault);
  SL_State.on('currencyCode', code => {
    setDefaultToCurrency(code);
  });
  const setDefault = () => {
    const toDefault = SL_State.get('currencyCode') || SL_State.get('storeInfo.currency');
    setDefaultToCurrency(toDefault);
  };
  const convertFormat = (...args) => {
    setDefault();
    return originConvertFormat(...args);
  };
  const getConvertPrice = (...args) => {
    setDefault();
    return originGetConvertPrice(...args);
  };
  const convertFormatWithoutCurrency = (...args) => {
    setDefault();
    return originConvertFormatWithoutCurrency(...args);
  };
  _exports.convertFormat = convertFormat;
  _exports.convertFormatWithoutCurrency = convertFormatWithoutCurrency;
  _exports.covertCalc = covertCalc;
  _exports.getConvertPrice = getConvertPrice;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/newCurrency/index.js'] = window.SLM['theme-shared/utils/newCurrency/index.js'] || function () {
  const _exports = {};
  const { format, unformatNumber, formatNumber, unformatCurrency, unformatPercent, formatCurrency, formatPercent, getDigitsByCode, getSymbolByCode, getSymbolOrderByCode, getDecimalSymbolByCode, getGroupSymbolByCode, getFormatParts, covertCalc, formatWithoutCurrency, formatMoneyWithoutCurrency } = window['@sl/currency-tools-core'];
  const { convertFormat, convertFormatWithoutCurrency, getConvertPrice } = window['SLM']['theme-shared/utils/newCurrency/CurrencyConvert.js'];
  _exports.convertFormat = convertFormat;
  _exports.convertFormatWithoutCurrency = convertFormatWithoutCurrency;
  _exports.getConvertPrice = getConvertPrice;
  _exports.default = {
    format,
    unformatNumber,
    formatNumber,
    unformatCurrency,
    unformatPercent,
    formatCurrency,
    formatPercent,
    getDigitsByCode,
    getSymbolByCode,
    getSymbolOrderByCode,
    getDecimalSymbolByCode,
    getGroupSymbolByCode,
    getFormatParts,
    getConvertPrice,
    convertFormat,
    covertCalc,
    convertFormatWithoutCurrency,
    formatWithoutCurrency,
    formatMoneyWithoutCurrency
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/dataReport/tool.js'] = window.SLM['theme-shared/utils/dataReport/tool.js'] || function () {
  const _exports = {};
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const gmc_sku_feed_id = SL_State.get('variants.gmc_sku_feed_id');
  function getGmcArg(isMetafields) {
    const Trade_ReportArgsMap = window && window.Trade_ReportArgsMap;
    if (isMetafields && Trade_ReportArgsMap) {
      if (typeof Trade_ReportArgsMap === 'string') {
        return JSON.parse(window.Trade_ReportArgsMap);
      }
      return window.Trade_ReportArgsMap;
    }
    return gmc_sku_feed_id || {};
  }
  function realSku({
    skuId,
    isMetafields
  }) {
    const skuFeed = getGmcArg(isMetafields);
    return skuFeed[skuId] || skuId;
  }
  function getCurrencyCode() {
    return SL_State.get('currencyCode');
  }
  _exports.getCurrencyCode = getCurrencyCode;
  _exports.default = {
    getGmcArg,
    realSku,
    getCurrencyCode
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/dataReport/ga.js'] = window.SLM['theme-shared/utils/dataReport/ga.js'] || function () {
  const _exports = {};
  const { PageType, ClickType, eventType } = window['SLM']['theme-shared/utils/report/const.js'];
  const currencyUtil = window['SLM']['theme-shared/utils/newCurrency/index.js'].default;
  const { getCurrencyCode } = window['SLM']['theme-shared/utils/dataReport/tool.js'];
  class GoogleAnalysis {
    constructor(config) {
      this.config = config;
    }
    sendEventLog(eventType, data) {
      const params = {
        ...data
      };
      if (params && !params.currency) {
        params.currency = getCurrencyCode();
      }
      return ['event', eventType, params];
    }
    clickForEnhancedEcom(page, clickType, params) {
      let event;
      let value;
      let res = [];
      switch (clickType) {
        case PageType.CheckoutProgress:
        case PageType.PlaceOrder:
          event = eventType.SetCheckoutOption;
          value = {
            value: params.amount,
            checkout_step: params.step
          };
          break;
        default:
          return res;
      }
      res = this.sendEventLog(event, value);
      return res;
    }
    click(page, type, params) {
      let value;
      let event;
      const res = [];
      switch (type) {
        case ClickType.SelectContent:
          event = eventType.SelectContent;
          value = {
            content_type: 'product',
            items: [{
              id: params.skuId,
              name: params.name,
              price: params.price,
              variant: params.variant,
              category: params.customCategoryName
            }]
          };
          break;
        case ClickType.AddToCart:
          event = eventType.AddToCart;
          value = {
            items: [{
              id: params.skuId,
              name: params.name,
              price: params.price
            }]
          };
          break;
        case ClickType.RemoveFromCart:
          event = eventType.RemoveFromCart;
          value = {
            items: []
          };
          if (Array.isArray(params.productItems)) {
            params.productItems.forEach(({
              skuId,
              name,
              price,
              quantity,
              variant,
              customCategoryName
            }) => {
              value.items.push({
                id: skuId,
                name,
                price,
                quantity,
                variant: variant || '',
                category: customCategoryName
              });
            });
          }
          break;
        default:
          return [];
      }
      res.push(this.sendEventLog(event, value));
      if (this.config.enableEnhancedEcom) {
        res.push(this.clickForEnhancedEcom(page, type, params));
      }
      return res;
    }
    clickGa4({
      actionType,
      params
    }) {
      let value;
      let event;
      const res = [];
      switch (actionType) {
        case ClickType.SelectContent:
          event = eventType.SelectContent;
          value = {
            content_type: 'product',
            item_id: params.skuId,
            item_category: params.customCategoryName
          };
          break;
        case ClickType.AddToCart:
          event = eventType.AddToCart;
          value = {
            value: params.amount,
            items: [{
              item_id: params.itemNo || params.skuId,
              item_name: params.name,
              price: params.price,
              quantity: params.productNum,
              item_variant: (params.productSkuAttrList || []).join(',')
            }]
          };
          break;
        case ClickType.RemoveFromCart:
          event = eventType.RemoveFromCart;
          value = {
            value: params.value,
            items: []
          };
          if (Array.isArray(params.productItems)) {
            params.productItems.forEach(({
              skuId,
              name,
              price,
              quantity,
              variant,
              customCategoryName
            }) => {
              value.items.push({
                item_id: skuId,
                item_name: name,
                price,
                quantity,
                item_variant: variant || '',
                item_category: customCategoryName
              });
            });
          }
          break;
        case ClickType.ViewCart:
          event = eventType.ViewCart;
          value = {
            value: params.amount,
            items: params.items && params.items.map(item => {
              return {
                item_id: item.itemNo || item.productId,
                item_name: item.name,
                price: currencyUtil.formatCurrency(item.price),
                quantity: item.num,
                item_variant: (item.skuAttr || []).join(','),
                item_category: item.customCategoryName
              };
            })
          };
          break;
        default:
          return [];
      }
      res.push(this.sendEventLog(event, value));
      return res;
    }
  }
  const ga = new GoogleAnalysis({});
  _exports.default = ga;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/dataReport/gad.js'] = window.SLM['theme-shared/utils/dataReport/gad.js'] || function () {
  const _exports = {};
  const { PageType, ClickType } = window['SLM']['theme-shared/utils/report/const.js'];
  const { getCurrencyCode } = window['SLM']['theme-shared/utils/dataReport/tool.js'];
  const sendConversion = data => {
    const params = {
      ...data
    };
    if (params && !params.currency) {
      params.currency = getCurrencyCode();
    }
    return ['event', 'conversion', params];
  };
  const clickAdsData = (page, type) => {
    const res = [];
    switch (page) {
      case PageType.ProductDetail:
        switch (type) {
          case ClickType.AddToCart:
          case ClickType.BeginCheckout:
            break;
          default:
            return res;
        }
        break;
      case PageType.MiniCart:
      case PageType.Cart:
        switch (type) {
          case ClickType.BeginCheckout:
            break;
          default:
            return res;
        }
        break;
      case PageType.CheckoutProgress:
        switch (type) {
          case ClickType.CheckoutProgress:
            break;
          default:
            return res;
        }
        break;
      case PageType.CheckoutConfirm:
        switch (type) {
          case ClickType.PlaceOrder:
            break;
          default:
            return res;
        }
        break;
      case PageType.OneShop:
        switch (type) {
          case ClickType.BeginCheckout:
            break;
          default:
            return res;
        }
        break;
      default:
        return res;
    }
    res.push(sendConversion());
    return res;
  };
  const loadAdsData = (page, params) => {
    let value = null;
    const data = [];
    switch (page) {
      case PageType.Cart:
      case PageType.CheckoutProgress:
      case PageType.CheckoutConfirm:
      case PageType.SalesPromotion:
        break;
      case PageType.OrderConfirm:
        value = {
          value: params.price,
          currency: params.currency
        };
        break;
      default:
        return data;
    }
    data.push(sendConversion(value));
    return data;
  };
  _exports.clickAdsData = clickAdsData;
  _exports.loadAdsData = loadAdsData;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/dataReport/fb.js'] = window.SLM['theme-shared/utils/dataReport/fb.js'] || function () {
  const _exports = {};
  const { nullishCoalescingOperator } = window['SLM']['theme-shared/utils/syntax-patch.js'];
  const { PageType, ClickType } = window['SLM']['theme-shared/utils/report/const.js'];
  const { getCurrencyCode } = window['SLM']['theme-shared/utils/dataReport/tool.js'];
  const clickFbData = (type, params) => {
    let value = null;
    let event = null;
    let evid = null;
    let res = [];
    switch (type) {
      case ClickType.AddToCart:
        value = {
          content_type: 'product_group',
          content_category: params && params.category,
          content_ids: params && params.skuId,
          content_name: params && params.name,
          value: params && params.price,
          currency: nullishCoalescingOperator(params && params.currency, getCurrencyCode())
        };
        event = 'AddToCart';
        evid = {
          eventID: params && params.eventId
        };
        res.push(['track', event, value, evid]);
        break;
      default:
        res = [];
    }
    return res;
  };
  const loadFbData = (page, params) => {
    let res = [];
    switch (page) {
      case PageType.OrderConfirm:
        res.push(['track', 'Purchase', {
          content_type: 'product_group',
          content_ids: params && params.skuIds,
          value: params && params.amount,
          quantity: params && params.quantity,
          currency: nullishCoalescingOperator(params && params.currency, getCurrencyCode())
        }, {
          eventID: params && params.eventId
        }]);
        break;
      default:
        res = [];
        break;
    }
    return res;
  };
  _exports.clickFbData = clickFbData;
  _exports.loadFbData = loadFbData;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/report/tool.js'] = window.SLM['theme-shared/utils/report/tool.js'] || function () {
  const _exports = {};
  const { v4 } = window['uuid'];
  function getEventID() {
    return `${Date.now()}_${v4().replace(/-/g, '')}`;
  }
  function getFBEventID(event, eventId) {
    return `${event.slice(0, 1).toLowerCase()}${event.slice(1)}${eventId}`;
  }
  _exports.getEventID = getEventID;
  _exports.getFBEventID = getFBEventID;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/tradeReport/index.js'] = window.SLM['theme-shared/utils/tradeReport/index.js'] || function () {
  const _exports = {};
  const Cookies = window['js-cookie']['*'];
  const { SL_EventBus } = window['@yy/sl-theme-shared']['/utils/event-bus'];
  const ga = window['SLM']['theme-shared/utils/dataReport/ga.js'].default;
  const { clickAdsData } = window['SLM']['theme-shared/utils/dataReport/gad.js'];
  const { clickFbData } = window['SLM']['theme-shared/utils/dataReport/fb.js'];
  const { getEventID } = window['SLM']['theme-shared/utils/report/tool.js'];
  const { SL_State: store } = window['SLM']['theme-shared/utils/state-selector.js'];
  const REPORT_ADD_CART = Symbol('REPORT_ADD_CART');
  const PAYPAL_CLICK = Symbol('PAYPAL_CLICK');
  const paypalPage = {
    Cart: 'Cart',
    MiniCart: 'MiniCart',
    FilterModal: 'FilterModal'
  };
  const encode = str => {
    if (typeof window === 'undefined') return '';
    const ec = window && window.encodeURI(str);
    return window && window.btoa(ec);
  };
  _exports.encode = encode;
  const isFn = object => typeof object === 'function';
  class TradeReport {
    constructor() {
      this.eventBus = SL_EventBus;
      this.currency = store.get('currencyCode');
      this.hdPage = {
        Cart: 'cart',
        MiniCart: 'cart'
      };
    }
    touch(data) {
      const {
        pageType,
        actionType,
        value
      } = data;
      const val = {
        ...value,
        ...{
          currency: this.currency
        }
      };
      const gaParam = ga.click(pageType, actionType, val);
      const ga4Param = ga.clickGa4({
        pageType,
        actionType,
        params: val
      });
      const adsParams = clickAdsData(pageType, actionType, val);
      const fbParams = clickFbData(actionType, val);
      const params = {
        GAAds: adsParams,
        GA: gaParam,
        GA4: ga4Param,
        FBPixel: fbParams
      };
      this.eventBus && this.eventBus.emit('global:thirdPartReport', params);
    }
    reportViewCart(data) {
      const ga4Param = ga.clickGa4(data);
      const newParams = {
        GA4: ga4Param
      };
      this.eventBus && this.eventBus.emit('global:thirdPartReport', newParams);
    }
  }
  const setAddtoCart = (payAmount, currency, eid, extra = {}) => {
    const {
      eventID,
      ...ext
    } = extra;
    const params = {
      ...ext,
      payAmount,
      currency,
      eventId: eid || `addToCart${eventID}` || `addToCart${getEventID()}`,
      eventTime: Date.now()
    };
    return params;
  };
  const getNeedReportData = callback => {
    if (isFn(callback)) {
      const data = callback();
      if (typeof data === 'string') {
        return {
          eventID: data
        };
      }
      return data;
    }
    return {};
  };
  const setPayPalReportReq = ({
    needReport,
    products,
    currency,
    extra
  }) => {
    const resData = getNeedReportData(needReport);
    const {
      eventID,
      ...extData
    } = resData;
    let price = 0;
    products.forEach(item => {
      price += Number(item.productPrice);
    });
    const dataReportReq = setAddtoCart(price, currency, `addToCart${eventID}`, {
      ...extra,
      ...extData
    });
    return dataReportReq;
  };
  const setIniiateCheckout = (seq, currency, totalPrice, needReport) => {
    const resData = getNeedReportData(needReport);
    const {
      eventID
    } = resData;
    const cookieMap = Cookies.get();
    Object.keys(cookieMap).forEach(key => {
      if (/^\d+_fb_data$/.test(key)) {
        Cookies.remove(key);
      }
    });
    const data = {
      tp: 1,
      et: Date.now(),
      ed: eventID || getEventID()
    };
    if (totalPrice) {
      data.currency = currency;
      data.payAmount = totalPrice;
    }
    Cookies.set(`${seq}_fb_data`, data);
  };
  const reportCheckout = data => {
    const {
      report
    } = data;
    if (isFn(report)) {
      report();
    }
    sessionStorage.setItem(encode('checkout_track'), '[]');
  };
  const tradeReport = new TradeReport();
  _exports.tradeReport = tradeReport;
  _exports.TradeReport = TradeReport;
  _exports.REPORT_ADD_CART = REPORT_ADD_CART;
  _exports.PAYPAL_CLICK = PAYPAL_CLICK;
  _exports.paypalPage = paypalPage;
  _exports.reportCheckout = reportCheckout;
  _exports.setIniiateCheckout = setIniiateCheckout;
  _exports.setAddtoCart = setAddtoCart;
  _exports.getNeedReportData = getNeedReportData;
  _exports.setPayPalReportReq = setPayPalReportReq;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/constants.js'] = window.SLM['theme-shared/components/pay-button/constants.js'] || function () {
  const _exports = {};
  const ButtonLocation = {
    ProductDetail: 'productDetail',
    Cart: 'cart',
    Checkout: 'checkout'
  };
  _exports.ButtonLocation = ButtonLocation;
  const ButtonType = {
    Normal: 'normalButton',
    Express: 'expressCheckoutButton',
    Fast: 'fastCheckoutButton'
  };
  _exports.ButtonType = ButtonType;
  const ButtonName = {
    BUY_NOW: 'BUY_NOW',
    MORE_OPTIONS: 'MORE_OPTIONS',
    CHECKOUT: 'CHECKOUT',
    PAY_PAL: 'PAY_PAL',
    APPLE_PAY: 'APPLE_PAY',
    GOOGLE_PAY: 'GOOGLE_PAY',
    SHOP_BY_FAST_CHECKOUT: 'SHOP_BY_FAST_CHECKOUT'
  };
  _exports.ButtonName = ButtonName;
  const SAVE_ERROR_TYPE = {
    PRODUCT_VERIFY: 'product_verify',
    SAVE_ORDER: 'save_order'
  };
  _exports.SAVE_ERROR_TYPE = SAVE_ERROR_TYPE;
  const EPaymentUpdate = 'Payment::Update';
  _exports.EPaymentUpdate = EPaymentUpdate;
  const EPaymentUpdateType = {
    CartPayButton: 'cart-pay-button'
  };
  _exports.EPaymentUpdateType = EPaymentUpdateType;
  const ERROR_TYPE = {
    InitFail: 'initFail',
    UpdateFail: 'updateFail',
    NoShippingOption: 'noShippingOption',
    InvalidDiscountCode: 'invalidDiscountCode',
    DiscountCodeExists: 'discountCodeExists',
    CreateFail: 'createFail',
    CreateTimeout: 'createTimeout'
  };
  _exports.ERROR_TYPE = ERROR_TYPE;
  const I18N_KEY_MAP = {
    themes: {
      [ERROR_TYPE.InitFail]: 'cart.error.default',
      [ERROR_TYPE.UpdateFail]: 'cart.error.renew',
      [ERROR_TYPE.NoShippingOption]: 'cart.error.noshipping',
      [ERROR_TYPE.InvalidDiscountCode]: 'transaction.discount.code_error',
      [ERROR_TYPE.DiscountCodeExists]: 'cart.couponCode.existCode',
      [ERROR_TYPE.CreateFail]: 'cart.error.order',
      [ERROR_TYPE.CreateTimeout]: 'cart.error.order.overtime'
    },
    checkout: {
      [ERROR_TYPE.InitFail]: 'checkout&system.error.default',
      [ERROR_TYPE.UpdateFail]: 'checkout&system.error.renew',
      [ERROR_TYPE.NoShippingOption]: 'checkout&system.error.noshipping',
      [ERROR_TYPE.InvalidDiscountCode]: 'checkout&system.discount_code.error',
      [ERROR_TYPE.DiscountCodeExists]: 'checkout&system.discount_code.already_exist',
      [ERROR_TYPE.CreateFail]: 'checkout&system.error.order',
      [ERROR_TYPE.CreateTimeout]: 'checkout&system.error.order.overtime'
    }
  };
  _exports.I18N_KEY_MAP = I18N_KEY_MAP;
  const PageType = {
    ProductDetail: 'productDetail',
    Cart: 'cart',
    MiniCart: 'MiniCart',
    Checkout: 'checkout'
  };
  _exports.PageType = PageType;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/tradeReport/const.js'] = window.SLM['theme-shared/utils/tradeReport/const.js'] || function () {
  const _exports = {};
  const { PageType } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const MINI_CART = 60006262;
  _exports.MINI_CART = MINI_CART;
  const HD_EVENT_NAME = {
    GO_TO_CHECKOUT: 'trade:goToCheckout:report',
    PAYPAL_CHECKOUT: 'trade:spb:report',
    COUPON_INPUT: 'trade:coupon:input:report',
    COUPON_APPLY: 'trade:coupon:apply:report',
    COUPON_DELETE: 'trade:coupon:delete:report',
    PAYPAL_CHECKOUT_V2: 'trade:spb:report:hiidov2'
  };
  _exports.HD_EVENT_NAME = HD_EVENT_NAME;
  const pageMap = {
    Cart: 60006254,
    MiniCart: 60006262
  };
  _exports.pageMap = pageMap;
  const pageMapV2 = {
    Cart: 106,
    MiniCart: 108
  };
  _exports.pageMapV2 = pageMapV2;
  const cartPage = {
    Cart: 'Cart',
    MiniCart: 'MiniCart',
    FilterModal: 'FilterModal'
  };
  _exports.cartPage = cartPage;
  const hiidoEventStatus = {
    SUCCESS: 1,
    ERROR: 0
  };
  _exports.hiidoEventStatus = hiidoEventStatus;
  const HdModule = {
    checkout: 112,
    couponCode: 118,
    normal: -999,
    [PageType.ProductDetail]: 103,
    [PageType.Cart]: 104,
    [PageType.MiniCart]: 104,
    [PageType.Checkout]: 104
  };
  _exports.HdModule = HdModule;
  const ActionType = {
    click: 102,
    input: 103
  };
  _exports.ActionType = ActionType;
  const HdComponent = {
    couponCodeInput: 133,
    couponCodeUse: 134,
    checkout: 101,
    paypalBtn: 102,
    paylater: 129,
    continueShopping: 146,
    fcButton: 108
  };
  _exports.HdComponent = HdComponent;
  const HDPage = {
    [PageType.ProductDetail]: 101,
    [PageType.Cart]: 102,
    [PageType.MiniCart]: 103,
    [PageType.Checkout]: 108
  };
  _exports.HDPage = HDPage;
  const HDEventId = {
    [PageType.ProductDetail]: 7077,
    [PageType.Cart]: 7078,
    [PageType.MiniCart]: 7079,
    [PageType.Checkout]: 7161
  };
  _exports.HDEventId = HDEventId;
  const HDEventName = {
    [PageType.ProductDetail]: 'pdp_fc',
    [PageType.Cart]: 'cartPage_fc',
    [PageType.MiniCart]: 'miniCart_fc',
    [PageType.Checkout]: 'fc_checkout_fc'
  };
  _exports.HDEventName = HDEventName;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/dataAccessor.js'] = window.SLM['theme-shared/utils/dataAccessor.js'] || function () {
  const _exports = {};
  function getSyncData(key) {
    if (!window.__SL_BUSINESS_DATA__) return null;
    return window.__SL_BUSINESS_DATA__[key] || null;
  }
  function setSyncData(payload) {
    if (!window.__SL_BUSINESS_DATA__) window.__SL_BUSINESS_DATA__ = {};
    Object.keys(payload).forEach(key => {
      window.__SL_BUSINESS_DATA__[key] = payload[key];
    });
  }
  _exports.getSyncData = getSyncData;
  _exports.setSyncData = setSyncData;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/shared/components/toast/toast.js'] = window.SLM['theme-shared/components/hbs/shared/components/toast/toast.js'] || function () {
  const _exports = {};
  const LOADING = 'loading';
  _exports.LOADING = LOADING;
  function whichAnimationEndEvent() {
    let t,
      el = document.createElement('fakeelement');
    const animations = {
      animation: 'animationend',
      OAnimation: 'oAnimationEnd',
      MozAnimation: 'animationend',
      WebkitAnimation: 'webkitAnimationEnd'
    };
    for (t in animations) {
      if (el.style[t] !== undefined) {
        return animations[t];
      }
    }
  }
  const getTemplate = (options, type = 'default') => {
    const loadingColor = options.loadingColor || 'black';
    const templates = {
      [LOADING]: `
      <div class="mp-toast mp-toast--loading mp-toast--loading-style2 mp-toast__hidden ${options.fullscreen && 'mp-toast__fullscreen'} ${options.className || ''}">
        <div class="mp-loading mp-loading--circular mp-toast__loading">
          <span class="mp-loading__spinner mp-loading__spinner--circular">
            <svg class="mp-loading__circular" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.3333 9.99999C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39762 18.3333 1.66666 14.6024 1.66666 9.99999C1.66666 5.39762 5.39762 1.66666 10 1.66666" stroke="${loadingColor}" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </span>
        </div>
        <div class="mp-toast__content mp-toast__text">${options.content}</div>
      </div>
    `,
      showSuccess: `
      <div class="mp-toast mp-toast--loading mp-toast--success-container mp-toast--loading-style2 ${options.className || ''}">
        <div class="mp-loading mp-loading--circular mp-toast__loading">
          <div class="mp-loading__success-box">
            <svg class="arrow" width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8.75" fill="none" stroke="${loadingColor}" stroke-width="2.5" class="circle"></circle>
              <polyline points="4.5,10 9,14 14.5,6.5" fill="none" stroke="${loadingColor}" stroke-width="2.5" class="hookmark" stroke-linecap="round" stroke-linejoin="round"
              ></polyline>
            </svg>
          </div>
        </div>
      </div>
    `,
      default: `
      <div class="comment-toast mp-toast mp-toast__hidden ${options.fullscreen && 'mp-toast__fullscreen'} ${options.className || ''}">
        <div class="mp-toast__content mp-toast__inner">${options.content}</div>
      </div>
    `
    };
    return templates[type];
  };
  _exports.getTemplate = getTemplate;
  const OPTION_TARGET = 'body';
  const defaultOptions = {
    duration: 1500,
    content: '',
    target: OPTION_TARGET
  };
  const HIDDEN_CLASSNAME = 'mp-toast__hidden';
  _exports.HIDDEN_CLASSNAME = HIDDEN_CLASSNAME;
  const CONTENT_CLASSNAME = 'mp-toast__content';
  _exports.CONTENT_CLASSNAME = CONTENT_CLASSNAME;
  class Toast {
    constructor(options = {}) {
      this.options = {
        ...defaultOptions,
        fullscreen: !options.target || options.target === OPTION_TARGET,
        ...options
      };
      this.$toast = null;
      this.$target = null;
      this.timer = null;
      this.instance = null;
      this.render();
    }
    static init(options) {
      return this.getSingleton(options);
    }
    static loading(options) {
      return this.getSingleton(options, LOADING);
    }
    static getSingleton(options = {}, type) {
      let {
        instance
      } = this;
      if (!instance) {
        instance = new Toast(options);
        this.instance = instance;
      }
      if (instance.type !== type) {
        instance.type = type;
        if (instance.$toast) {
          instance.$toast.remove();
        }
        instance.render();
      }
      instance.open(options.content || '', options.duration);
      return instance;
    }
    render() {
      const templateType = this.type || this.options.type;
      const template = getTemplate(this.options, templateType);
      const $template = $(template);
      const templateClass = $template.attr('class');
      this.$target = $(this.options.target);
      const {
        $target
      } = this;
      if ($target.css('position') === 'static') {
        $target.css('position', 'relative');
      }
      $target.append($template);
      this.$toast = templateType === LOADING ? $target.find(`[class="${templateClass}"]`) : $template;
    }
    open(content = '', duration) {
      const {
        options,
        $target
      } = this;
      if ($target.css('position') === 'static') {
        $target.css('position', 'relative');
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      const {
        $toast
      } = this;
      const $text = $toast.find(`.${CONTENT_CLASSNAME}`);
      $text.html(content || this.options.content || '');
      $toast.removeClass(HIDDEN_CLASSNAME);
      const durationTime = typeof duration === 'number' ? duration : options.duration;
      if (durationTime !== 0) {
        this.timer = setTimeout(this.close.bind(this), durationTime);
      }
    }
    close() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.$toast.addClass(HIDDEN_CLASSNAME);
      if (typeof this.options.onClose === 'function') {
        this.options.onClose();
      }
      this.$target.css('position', '');
    }
    showSuccessAni(options = {}, callback) {
      const {
        $target
      } = this;
      this.close();
      const buttonTxt = $target.find('.pdp_button_text');
      buttonTxt.addClass('showSuccessAni');
      const successAniTemp = getTemplate(options, 'showSuccess');
      $target.append(successAniTemp);
      const hookWrapDom = $target.find('.mp-toast--success-container');
      const hookNode = $target.find('.hookmark');
      if (hookNode.length > 0) {
        const animationEnd = whichAnimationEndEvent();
        hookNode.one(animationEnd, function (event) {
          if (callback && typeof callback === 'function') {
            setTimeout(() => {
              hookWrapDom.remove();
              buttonTxt.removeClass('showSuccessAni');
              callback(event, $target);
            }, options.delay || 0);
          }
        });
      }
    }
  }
  Toast.type = null;
  _exports.default = Toast;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/shared/components/toast/loading.js'] = window.SLM['theme-shared/components/hbs/shared/components/toast/loading.js'] || function () {
  const _exports = {};
  const { LOADING, HIDDEN_CLASSNAME, getTemplate } = window['SLM']['theme-shared/components/hbs/shared/components/toast/toast.js'];
  const OPTION_TARGET = 'body';
  class Loading {
    constructor(options = {}) {
      this.options = {
        duration: 1500,
        fullscreen: !options.target || options.target === OPTION_TARGET,
        ...options
      };
      this.$loading = null;
      this.$target = null;
      this.timer = null;
      this.init();
    }
    init() {
      const template = getTemplate(this.options, LOADING);
      this.$target = $(this.options.target || document.body);
      this.$loading = $(template);
    }
    open() {
      const {
        $target
      } = this;
      const originPosition = $target.css('position');
      if (originPosition === 'static') {
        $target.css('position', 'relative');
      }
      this.$loading.appendTo($target).removeClass(HIDDEN_CLASSNAME);
      if (this.options.duration > 0) {
        this.timer = setTimeout(this.close.bind(this), this.options.duration);
      }
    }
    close() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.$loading.remove();
      this.$loading = null;
      this.$target.css('position', '');
    }
  }
  _exports.default = Loading;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/shared/components/toast/index.js'] = window.SLM['theme-shared/components/hbs/shared/components/toast/index.js'] || function () {
  const _exports = {};
  const { default: _default } = window['SLM']['theme-shared/components/hbs/shared/components/toast/toast.js'];
  _exports.default = _default;
  const { default: Loading } = window['SLM']['theme-shared/components/hbs/shared/components/toast/loading.js'];
  _exports.Loading = Loading;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/url.js'] = window.SLM['theme-shared/utils/url.js'] || function () {
  const _exports = {};
  const qs = window['query-string']['default'];
  const _isEmpty = window['lodash']['isEmpty'];
  const _omit = window['lodash']['omit'];
  function getQuery(url, key = '') {
    if (typeof window === 'undefined') return;
    const {
      query
    } = qs.parseUrl(url || window.location.href);
    if (key) {
      return query[key];
    }
    return {
      ...query
    };
  }
  _exports.getQuery = getQuery;
  function getLocationProps() {
    const {
      origin,
      pathname,
      hash,
      search
    } = window.location;
    return {
      origin,
      pathname,
      hash,
      search,
      url: origin + pathname
    };
  }
  _exports.getLocationProps = getLocationProps;
  function historyPushState({
    state = {},
    title = document.title,
    url
  }) {
    window.history.pushState(state, title, url);
  }
  _exports.historyPushState = historyPushState;
  function stringifyUrl(url, query, hash = '') {
    return qs.stringifyUrl({
      url,
      query
    }) + hash;
  }
  _exports.stringifyUrl = stringifyUrl;
  function addQueryToUrl(payload = {}) {
    if (typeof window === 'undefined') return;
    if (_isEmpty(payload)) return;
    const {
      url,
      hash,
      search
    } = getLocationProps();
    const oldSearch = qs.parse(search);
    const targetUrl = stringifyUrl(url, {
      ...oldSearch,
      ...payload
    }, hash);
    historyPushState({
      url: targetUrl
    });
  }
  _exports.addQueryToUrl = addQueryToUrl;
  function removeQueryByUrl(keys = []) {
    if (typeof window === 'undefined') return;
    if (_isEmpty(keys)) return;
    const {
      url,
      hash,
      search
    } = getLocationProps();
    const oldSearch = qs.parse(search);
    const targetUrl = stringifyUrl(url, _omit(oldSearch, keys), hash);
    historyPushState({
      url: targetUrl
    });
  }
  _exports.removeQueryByUrl = removeQueryByUrl;
  const redirectTo = url => {
    return window.Shopline && window.Shopline.redirectTo && window.Shopline.redirectTo(url) || url;
  };
  _exports.redirectTo = redirectTo;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/constant.js'] = window.SLM['theme-shared/utils/constant.js'] || function () {
  const _exports = {};
  const SettleActionsEnum = {
    CHANGE_EMAIL: 'change_email',
    CHANGE_DELIVERY_METHOD: 'change_delivery_method',
    CHANGE_ADDRESS: 'change_address',
    CHANGE_REMARK: 'change_remark',
    CHANGE_TAX_NUM: 'change_tax_num',
    CHANGE_PAYMENT_METHOD: 'change_payment_method',
    POLL_SHIPPING_METHOD: 'load_express',
    EDIT_PRODUCT: 'edit_product',
    USE_INTEGRAL: 'use_integral',
    ADD_TIPS: 'add_tips',
    APPLY_COUPON: 'use_discount_code',
    CHANGE_PO_NUMBER: 'change_po_number',
    NEXT_STEP: 'next_step',
    LAST_STEP: 'last_step',
    CREATE_ORDER: 'create_order_check',
    ORDINARY: 'ordinary'
  };
  _exports.SettleActionsEnum = SettleActionsEnum;
  const FILE_TYPE = {
    GIF: 'GIF',
    PNG: 'PNG',
    JPEG: 'JPEG',
    BMP: 'BMP',
    JPG: 'JPG',
    WEBP: 'WEBP',
    SVG: 'SVG',
    PDF: 'PDF',
    XLSX: 'XLSX'
  };
  _exports.FILE_TYPE = FILE_TYPE;
  const FILE_TYPE_MAP = {
    'image/gif': FILE_TYPE.GIF,
    'image/png': FILE_TYPE.PNG,
    'image/jpeg': FILE_TYPE.JPEG,
    'image/bmp': FILE_TYPE.BMP,
    'image/jpg': FILE_TYPE.JPG,
    'image/webp': FILE_TYPE.WEBP,
    'image/svg': FILE_TYPE.SVG,
    'application/pdf': FILE_TYPE.PDF,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FILE_TYPE.XLSX
  };
  _exports.FILE_TYPE_MAP = FILE_TYPE_MAP;
  const SERVER_ERROR_CODE = {
    AMOUNT_EXCEEDS_LIMIT: 'TCTDEXCEEDED_MAX_AMOUNT_LIMIT',
    ABANDONED_RISK_CONTROL: 'TRD_123768_B1409'
  };
  _exports.SERVER_ERROR_CODE = SERVER_ERROR_CODE;
  const SAVE_FROM = {
    EVENT: 'event',
    STATION: 'station',
    JUMP: 'jump',
    PPINVALIDATE: 'paypal-invalidate',
    CROSSFC: 'cross-fast-checkout',
    CROSSSMARTPAYMENT: 'cross-smart-payment'
  };
  _exports.SAVE_FROM = SAVE_FROM;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/checkout.js'] = window.SLM['theme-shared/utils/checkout.js'] || function () {
  const _exports = {};
  const loggerService = window['@yy/sl-theme-shared']['/utils/logger/sentry'].default;
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const Cookies = window['js-cookie']['*'];
  const createLogger = window['SLM']['theme-shared/utils/createLogger.js'].default;
  const request = window['SLM']['theme-shared/utils/retryRequest.js'].default;
  const { setupRetryInterceptor } = window['SLM']['theme-shared/utils/retryRequest.js'];
  const { SL_State: store } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { adaptor } = window['SLM']['theme-shared/utils/url-adaptor.js'];
  const { reportCheckout, setIniiateCheckout } = window['SLM']['theme-shared/utils/tradeReport/index.js'];
  const { hiidoEventStatus, HD_EVENT_NAME } = window['SLM']['theme-shared/utils/tradeReport/const.js'];
  const { SL_EventBus } = window['@yy/sl-theme-shared']['/utils/event-bus'];
  const { getSyncData } = window['SLM']['theme-shared/utils/dataAccessor.js'];
  const Toast = window['SLM']['theme-shared/components/hbs/shared/components/toast/index.js'].default;
  const { redirectTo } = window['SLM']['theme-shared/utils/url.js'];
  const { SAVE_FROM, SERVER_ERROR_CODE } = window['SLM']['theme-shared/utils/constant.js'];
  const { I18N_KEY_MAP, ERROR_TYPE } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  setupRetryInterceptor(['/trade/center/order/abandoned/save']);
  const {
    GO_TO_CHECKOUT
  } = HD_EVENT_NAME;
  function isJsonParse(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  const helperConsole = {
    checkout: createLogger('checkout')
  };
  const logger = loggerService.pipeOwner('checkout.js');
  const services = {
    save: async (products, {
      associateCart = false,
      useMemberPoint = null,
      discountCode = null,
      bundledActivitySeq = null,
      orderFrom = null,
      notSupportSubscriptionCheck = false
    } = {}) => {
      const msg = `The old Checkout.Save has been discontinued.
    Please contact "liminyi" to integrate the new Checkout.Save. `;
      console.warn(msg);
      logger.error(msg, {
        error: new Error(msg),
        data: {
          url: window.location.href,
          products
        }
      });
      const marketLanguage = window.Shopline.locale;
      const displayLanguage = Cookies.get('userSelectLocale') || store.get('request.cookie.userSelectLocale');
      return request.post('/trade/center/order/abandoned/save', {
        products,
        associateCart,
        discountCodes: Array.isArray(discountCode) ? discountCode : [discountCode],
        bundledActivitySeq,
        useMemberPoint,
        orderFrom,
        languageInfo: {
          marketLanguage,
          displayLanguage
        },
        notSupportSubscriptionCheck
      });
    }
  };
  const RouterPath = {
    SignIn: redirectTo('/user/signIn'),
    Checkout: '/trade/checkout',
    Checkouts: '/checkouts'
  };
  const ADD_TO_CART_EVENT_KEY = 'Symbol(ADD_TO_CART)';
  const getCheckoutUrl = (data, {
    query = {},
    associateCart,
    abandonedOrderMark = ''
  } = {}) => {
    const urlPrefix = `${window.location.protocol}//${window.location.host}`;
    const {
      storeId,
      checkoutToken,
      seq
    } = data;
    const {
      url
    } = adaptor(checkoutToken ? `${urlPrefix}/${storeId}${RouterPath.Checkouts}/${checkoutToken}` : `${urlPrefix}${RouterPath.Checkout}/${seq}`, {
      query: {
        buyScence: associateCart ? 'cart' : 'detail',
        ...query,
        mark: abandonedOrderMark
      },
      fullQuery: false
    });
    return url;
  };
  _exports.getCheckoutUrl = getCheckoutUrl;
  const save = async (products, extra = {}) => {
    const {
      stage,
      query = {},
      associateCart = false,
      abandonedOrderSeq,
      abandonedOrderMark,
      currency,
      totalPrice,
      from
    } = extra;
    try {
      const settleConfig = store.get('tradeSettleConfig');
      const isLogin = store.get('request.cookie.osudb_uid');
      const {
        onBeforeJump,
        report,
        needReport,
        abandonedOrderSeq,
        abandonedOrderMark
      } = extra;
      const needLogin = settleConfig && settleConfig.loginType === 'ONLY_LOGIN';
      const {
        discountCode,
        ...rest
      } = extra;
      let _discountCode = discountCode;
      if (!associateCart) {
        const tradeExtraInfoStr = sessionStorage.getItem('tradeExtraInfo');
        const tradeExtraInfo = isJsonParse(tradeExtraInfoStr) ? JSON.parse(tradeExtraInfoStr) : {};
        _discountCode = tradeExtraInfo && tradeExtraInfo.discountCode && tradeExtraInfo.discountCode.value;
      }
      const reqParams = {
        associateCart,
        discountCode: _discountCode,
        orderFrom: getSyncData('orderFrom'),
        ...rest
      };
      if (!abandonedOrderSeq) {
        const isDismissParams = ['orderFrom'].some(key => !reqParams[key] && reqParams[key] !== 0);
        if (isDismissParams) {
          logger.info('[成单请求参数缺失，请检查]', {
            data: {
              ...reqParams
            }
          });
        }
        logger.info('[成单请求参数初始化]', {
          data: {
            ...reqParams
          }
        });
      }
      const response = abandonedOrderSeq ? await Promise.resolve({
        data: {
          seq: abandonedOrderSeq,
          mark: abandonedOrderMark
        }
      }) : await services.save(products, reqParams);
      logger.info('[成单请求响应数据]', {
        data: {
          ...(response && response.data)
        }
      });
      helperConsole.checkout.info({
        ...(response && response.data)
      });
      const redirectToSignIn = !isLogin && needLogin;
      const querySpb = query ? query.spb : false;
      const checkoutUrl = getCheckoutUrl({
        storeId: store.get('storeInfo.storeId'),
        checkoutToken: response.data.checkoutToken,
        seq: response.data.seq
      }, {
        query: {
          ...query,
          spb: redirectToSignIn ? null : querySpb
        },
        abandonedOrderMark,
        associateCart
      });
      SL_EventBus.emit(GO_TO_CHECKOUT, {
        data: {
          event_status: response && response.data && response.data.seq ? hiidoEventStatus.SUCCESS : hiidoEventStatus.ERROR,
          stage,
          isCart: associateCart,
          products,
          spb: query && query.spb
        }
      });
      setIniiateCheckout(response.data.seq, currency, totalPrice, needReport);
      const urlPrefix = `${window.location.protocol}//${window.location.host}`;
      if (redirectToSignIn) {
        const {
          url
        } = adaptor(`${urlPrefix}${RouterPath.SignIn}`, {
          query: {
            redirectUrl: checkoutUrl
          },
          fullQuery: false
        });
        typeof onBeforeJump === 'function' && onBeforeJump();
        try {
          reportCheckout({
            report
          });
        } catch (e) {
          console.error(e);
        }
        return Promise.resolve({
          ...response.data,
          url,
          needLogin
        });
      }
      typeof onBeforeJump === 'function' && onBeforeJump();
      try {
        reportCheckout({
          report
        });
      } catch (e) {
        helperConsole.checkout.info(e);
      }
      return Promise.resolve({
        url: checkoutUrl,
        needLogin: false,
        abandonedInfo: response.data
      });
    } catch (error) {
      SL_EventBus.emit(GO_TO_CHECKOUT, {
        data: {
          event_status: 0,
          stage,
          isCart: associateCart,
          products,
          spb: query && query.spb
        }
      });
      const {
        code,
        message
      } = error || {};
      logger.error(`[成单请求报错]${code ? `[code: ${code}` : ''}${message ? `[msg: ${message}]` : ''}`, {
        error,
        abandonedOrderSeq,
        abandonedOrderMark,
        products,
        extra,
        from: from || SAVE_FROM.STATION
      });
      switch (code) {
        case SERVER_ERROR_CODE.AMOUNT_EXCEEDS_LIMIT:
          Toast.init({
            content: t('cart.checkout.max_amount_limit')
          });
          break;
        case SERVER_ERROR_CODE.ABANDONED_RISK_CONTROL:
          Toast.init({
            content: t('general.abandon.Order.risk')
          });
          break;
        default:
          Toast.init({
            content: t(I18N_KEY_MAP.themes[ERROR_TYPE.CreateFail])
          });
      }
      return Promise.reject(error);
    }
  };
  const jump = async (products, extra = {}) => {
    const {
      url
    } = await save(products, {
      ...extra,
      from: SAVE_FROM.JUMP
    });
    window.location.href = url;
  };
  let hasBoundAddToCartEvent = false;
  let addToCartEventName;
  const getAddToCartEventName = () => {
    if (addToCartEventName) {
      return addToCartEventName;
    }
    const eventNameList = window.SL_EventBus.eventNames() || [];
    return eventNameList.find(name => name.toString() === ADD_TO_CART_EVENT_KEY);
  };
  const addToCart = data => {
    return window.SL_EventBus.emit(getAddToCartEventName(), data);
  };
  if (!hasBoundAddToCartEvent) {
    hasBoundAddToCartEvent = true;
    window.__SL_TRADE_EVENT__ = window.__SL_TRADE_EVENT__ || {};
    window.__SL_TRADE_EVENT__.addToCart = window.__SL_TRADE_EVENT__.addToCart || addToCart;
  }
  _exports.default = {
    jump,
    save
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/utils/api-logger.js'] = window.SLM['theme-shared/events/utils/api-logger.js'] || function () {
  const _exports = {};
  const loggerService = window['@yy/sl-theme-shared']['/utils/logger/sentry'].default;
  _exports.default = apiName => loggerService.pipeOwner('developer-api').pipeOwner(apiName);
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/trade/developer-api/navigate-checkout/index.js'] = window.SLM['theme-shared/events/trade/developer-api/navigate-checkout/index.js'] || function () {
  const _exports = {};
  const checkout = window['SLM']['theme-shared/utils/checkout.js'].default;
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const { SAVE_FROM } = window['SLM']['theme-shared/utils/constant.js'];
  const EVENT_NAME = 'Checkout::NavigateCheckout';
  const logger = apiLogger(EVENT_NAME);
  const external = window && window.Shopline.event;
  const navigateCheckoutHandler = async arg => {
    const {
      data,
      onSuccess,
      onError
    } = arg;
    const {
      products,
      ...rest
    } = data;
    try {
      const result = await checkout.save(products, {
        ...rest,
        from: SAVE_FROM.EVENT
      });
      logger.info('onSuccess', {
        data: {
          result,
          products,
          rest
        }
      });
      onSuccess && onSuccess(result);
    } catch (error) {
      logger.info('error', {
        error
      });
      onError && onError(error);
    }
  };
  const navigateCheckout = () => external && external.on(EVENT_NAME, navigateCheckoutHandler);
  navigateCheckout.apiName = EVENT_NAME;
  _exports.default = navigateCheckout;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/trade/developer-api/get-cart-id/index.js'] = window.SLM['theme-shared/events/trade/developer-api/get-cart-id/index.js'] || function () {
  const _exports = {};
  const request = window['SLM']['theme-shared/utils/request.js'].default;
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const services = {
    getCartOwnerId: async () => request.get('/carts/cart/owner-id'),
    getCartId: async () => request.get('/carts/cart/cart-id')
  };
  const getNewCartId = async data => services.getCartId(data);
  const EVENT_NAME = 'Cart::GetCartId';
  const logger = apiLogger(EVENT_NAME);
  const interior = window && window.Shopline.event;
  const getCartId = () => interior && interior.on(EVENT_NAME, async argument => {
    const {
      data,
      onSuccess = () => {},
      onError = () => {}
    } = argument;
    try {
      const result = await getNewCartId(data);
      logger.info('onSuccess', {
        data: {
          result
        }
      });
      onSuccess && onSuccess(result);
    } catch (error) {
      logger.error('error', {
        error
      });
      onError && onError(error);
    }
  });
  getCartId.apiName = EVENT_NAME;
  _exports.default = getCartId;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/trade/interior-event/index.js'] = window.SLM['theme-shared/events/trade/interior-event/index.js'] || function () {
  const _exports = {};
  const OPEN_MINI_CART = Symbol('OPEN_MINI_CART');
  _exports.OPEN_MINI_CART = OPEN_MINI_CART;
  const ADD_TO_CART = Symbol('ADD_TO_CART');
  _exports.ADD_TO_CART = ADD_TO_CART;
  const CONTROL_CART_BASIS = Symbol('CONTROL_CART_BASIS');
  _exports.CONTROL_CART_BASIS = CONTROL_CART_BASIS;
  const INTERIOR_TRADE_UPDATE_DETAIL = 'Checkout::Interior::UpdateCheckoutDetail';
  _exports.INTERIOR_TRADE_UPDATE_DETAIL = INTERIOR_TRADE_UPDATE_DETAIL;
  const LINE_ITEM_UPDATE = Symbol('LINE_ITEM_UPDATE');
  _exports.LINE_ITEM_UPDATE = LINE_ITEM_UPDATE;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/trade/developer-api/navigate-cart/index.js'] = window.SLM['theme-shared/events/trade/developer-api/navigate-cart/index.js'] || function () {
  const _exports = {};
  const { OPEN_MINI_CART } = window['SLM']['theme-shared/events/trade/interior-event/index.js'];
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const EVENT_NAME = 'Cart::NavigateCart';
  const logger = apiLogger(EVENT_NAME);
  const interior = window && window.SL_EventBus;
  const external = window && window.Shopline.event;
  const navigateCartHandler = argument => {
    const noop = () => {};
    const data = argument && argument.data || {};
    const onSuccess = argument && argument.onSuccess || noop;
    const onError = argument && argument.onError || noop;
    try {
      interior.emit(OPEN_MINI_CART, {
        data,
        onSuccess
      });
      logger.log('onSuccess', {
        data
      });
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (error) {
      if (typeof onError === 'function') {
        onError(error);
      }
    }
  };
  const navigateCart = () => external && external.on(EVENT_NAME, navigateCartHandler);
  navigateCart.apiName = EVENT_NAME;
  _exports.default = navigateCart;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/trade/enum/index.js'] = window.SLM['theme-shared/events/trade/enum/index.js'] || function () {
  const _exports = {};
  const SIDEBAR_RENDER = 'Cart::SidebarRender';
  _exports.SIDEBAR_RENDER = SIDEBAR_RENDER;
  const ADD_TO_CART = 'Cart::AddToCart';
  _exports.ADD_TO_CART = ADD_TO_CART;
  const COMPLETE_ORDER = 'Checkout::CompleteOrder';
  _exports.COMPLETE_ORDER = COMPLETE_ORDER;
  const FINISHED_ORDER = 'Checkout::FinishedOrder';
  _exports.FINISHED_ORDER = FINISHED_ORDER;
  const CONTROL_CART_BASIS = 'Cart::ControlCartBasis';
  _exports.CONTROL_CART_BASIS = CONTROL_CART_BASIS;
  const UPDATE_CHECKOUT_DETAIL = 'Checkout::UpdateCheckoutDetail';
  _exports.UPDATE_CHECKOUT_DETAIL = UPDATE_CHECKOUT_DETAIL;
  const CHECKOUT_DETAIL_INIT = 'Checkout::CheckoutDetailInit';
  _exports.CHECKOUT_DETAIL_INIT = CHECKOUT_DETAIL_INIT;
  const CHECKOUT_DETAIL_UPDATE = 'Checkout::CheckoutDetailUpdate';
  _exports.CHECKOUT_DETAIL_UPDATE = CHECKOUT_DETAIL_UPDATE;
  const CART_DETAIL_UPDATE = 'Cart::CartDetailUpdate';
  _exports.CART_DETAIL_UPDATE = CART_DETAIL_UPDATE;
  const LINE_ITEM_UPDATE = 'Cart::LineItemUpdate';
  _exports.LINE_ITEM_UPDATE = LINE_ITEM_UPDATE;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/trade/developer-api/add-to-cart/index.js'] = window.SLM['theme-shared/events/trade/developer-api/add-to-cart/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const externalEvent = window['SLM']['theme-shared/events/trade/enum/index.js'];
  const interiorEvent = window['SLM']['theme-shared/events/trade/interior-event/index.js'];
  const logger = apiLogger(externalEvent.ADD_TO_CART);
  const interior = window && window.SL_EventBus;
  const external = window && window.Shopline.event;
  const addToCart = () => external && external.on(externalEvent.ADD_TO_CART, async argument => {
    const {
      data,
      onSuccess,
      onError
    } = argument;
    try {
      logger.info(`[emit]`, {
        data
      });
      interior.emit(interiorEvent.ADD_TO_CART, {
        ...data,
        success: onSuccess,
        error: onError
      });
    } catch (error) {
      onError(error);
    }
  });
  addToCart.apiName = externalEvent.ADD_TO_CART;
  _exports.default = addToCart;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/trade/developer-api/update-checkout-detail/index.js'] = window.SLM['theme-shared/events/trade/developer-api/update-checkout-detail/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const { UPDATE_CHECKOUT_DETAIL } = window['SLM']['theme-shared/events/trade/enum/index.js'];
  const { INTERIOR_TRADE_UPDATE_DETAIL } = window['SLM']['theme-shared/events/trade/interior-event/index.js'];
  const logger = apiLogger(UPDATE_CHECKOUT_DETAIL);
  const interior = window && window.SL_EventBus;
  const external = window && window.Shopline.event;
  const updateCheckoutDetailDebounceHandle = () => {
    let requesting = false;
    let emitDataList = [];
    let tempEmitDataList = [];
    function reset() {
      requesting = false;
      emitDataList = [...tempEmitDataList];
      tempEmitDataList = [];
      if (emitDataList.length) {
        emitFunc();
      }
    }
    function successFunc(res) {
      emitDataList.map(cb => cb && cb.onSuccess && cb.onSuccess(res));
      reset();
    }
    function errorFunc(e) {
      emitDataList.map(cb => cb && cb.onError && cb.onError(e));
      reset();
    }
    function emitFunc() {
      try {
        interior.emit(INTERIOR_TRADE_UPDATE_DETAIL, {
          onSuccess: successFunc,
          onError: errorFunc
        });
      } catch (e) {
        errorFunc(e);
      }
    }
    return function fn({
      data,
      onSuccess,
      onError
    } = {}) {
      logger.info('[emit]', {
        data
      });
      if (requesting) {
        tempEmitDataList.push({
          onSuccess,
          onError
        });
      } else {
        requesting = true;
        emitDataList.push({
          onSuccess,
          onError
        });
        emitFunc();
      }
    };
  };
  const updateCheckoutDetail = () => external && external.on(UPDATE_CHECKOUT_DETAIL, updateCheckoutDetailDebounceHandle());
  updateCheckoutDetail.apiName = UPDATE_CHECKOUT_DETAIL;
  _exports.default = updateCheckoutDetail;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/trade/developer-api/control-cart-basis/index.js'] = window.SLM['theme-shared/events/trade/developer-api/control-cart-basis/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const externalEvent = window['SLM']['theme-shared/events/trade/enum/index.js'];
  const interiorEvent = window['SLM']['theme-shared/events/trade/interior-event/index.js'];
  const logger = apiLogger(externalEvent.CONTROL_CART_BASIS);
  const interior = window && window.SL_EventBus;
  const external = window && window.Shopline.event;
  const controlCartBasis = () => external && external.on(externalEvent.CONTROL_CART_BASIS, async argument => {
    const options = argument && argument.data || null;
    const onSuccess = argument && argument.onSuccess || (() => {});
    const onError = argument && argument.onError || (() => {});
    try {
      logger.info(`[emit]`, {
        data: {
          argument
        }
      });
      interior.emit(interiorEvent.CONTROL_CART_BASIS, {
        options,
        success: onSuccess,
        error: onError
      });
    } catch (error) {
      onError(error);
    }
  });
  controlCartBasis.apiName = externalEvent.CONTROL_CART_BASIS;
  _exports.default = controlCartBasis;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/trade/developer-api/cart-line-item-update/index.js'] = window.SLM['theme-shared/events/trade/developer-api/cart-line-item-update/index.js'] || function () {
  const _exports = {};
  const { LINE_ITEM_UPDATE } = window['SLM']['theme-shared/events/trade/interior-event/index.js'];
  const externalEvent = window['SLM']['theme-shared/events/trade/enum/index.js'];
  const interior = window && window.SL_EventBus;
  const external = window && window.Shopline.event;
  const cartLineItemUpdateHandler = () => {
    interior.emit(LINE_ITEM_UPDATE);
  };
  const cartLineItemUpdate = () => external && external.on(externalEvent.LINE_ITEM_UPDATE, cartLineItemUpdateHandler);
  cartLineItemUpdate.apiName = externalEvent.LINE_ITEM_UPDATE;
  _exports.default = cartLineItemUpdate;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/trade/developer-api/cart-detail-update/index.js'] = window.SLM['theme-shared/events/trade/developer-api/cart-detail-update/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const externalEvent = window['SLM']['theme-shared/events/trade/enum/index.js'];
  const logger = apiLogger(`${externalEvent.CART_DETAIL_UPDATE} - EMIT`);
  const external = window && window.Shopline.event;
  const interior = window && window.SL_EventBus;
  const cartDetailUpdate = () => {
    interior && interior.on('cart:update', data => {
      logger.info('emit', {
        data
      });
      external.emit(externalEvent.CART_DETAIL_UPDATE, {
        ...data
      });
    });
  };
  cartDetailUpdate.apiName = externalEvent.CART_DETAIL_UPDATE;
  _exports.default = cartDetailUpdate;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/trade/developer-api/checkout-detail-init/index.js'] = window.SLM['theme-shared/events/trade/developer-api/checkout-detail-init/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const externalEvent = window['SLM']['theme-shared/events/trade/enum/index.js'];
  const logger = apiLogger(`${externalEvent.CHECKOUT_DETAIL_INIT} - EMIT`);
  const external = window && window.Shopline.event;
  const interior = window && window.SL_EventBus;
  const checkoutDetailInit = () => {
    interior && interior.on('trade:billingDetailInit', data => {
      logger.info('emit', {
        data
      });
      external.emit(externalEvent.CHECKOUT_DETAIL_INIT, {
        ...data
      });
    });
  };
  checkoutDetailInit.apiName = externalEvent.CHECKOUT_DETAIL_INIT;
  _exports.default = checkoutDetailInit;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/trade/developer-api/checkout-detail-update/index.js'] = window.SLM['theme-shared/events/trade/developer-api/checkout-detail-update/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const externalEvent = window['SLM']['theme-shared/events/trade/enum/index.js'];
  const logger = apiLogger(`${externalEvent.CHECKOUT_DETAIL_UPDATE} - EMIT`);
  const external = window && window.Shopline.event;
  const interior = window && window.SL_EventBus;
  const checkoutDetailUpdate = () => {
    interior && interior.on('trade:billingDetailUpdate', data => {
      logger.info('emit', {
        data
      });
      external.emit(externalEvent.CHECKOUT_DETAIL_UPDATE, {
        ...data
      });
    });
  };
  checkoutDetailUpdate.apiName = externalEvent.CHECKOUT_DETAIL_UPDATE;
  _exports.default = checkoutDetailUpdate;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/trade/developer-api/index.js'] = window.SLM['theme-shared/events/trade/developer-api/index.js'] || function () {
  const _exports = {};
  const navigateCheckout = window['SLM']['theme-shared/events/trade/developer-api/navigate-checkout/index.js'].default;
  const getCartId = window['SLM']['theme-shared/events/trade/developer-api/get-cart-id/index.js'].default;
  const navigateCart = window['SLM']['theme-shared/events/trade/developer-api/navigate-cart/index.js'].default;
  const addToCart = window['SLM']['theme-shared/events/trade/developer-api/add-to-cart/index.js'].default;
  const updateCheckoutDetail = window['SLM']['theme-shared/events/trade/developer-api/update-checkout-detail/index.js'].default;
  const controlCartBasis = window['SLM']['theme-shared/events/trade/developer-api/control-cart-basis/index.js'].default;
  const cartLineItemUpdate = window['SLM']['theme-shared/events/trade/developer-api/cart-line-item-update/index.js'].default;
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const cartDetailUpdate = window['SLM']['theme-shared/events/trade/developer-api/cart-detail-update/index.js'].default;
  const checkoutDetailInit = window['SLM']['theme-shared/events/trade/developer-api/checkout-detail-init/index.js'].default;
  const checkoutDetailUpdate = window['SLM']['theme-shared/events/trade/developer-api/checkout-detail-update/index.js'].default;
  const logger = apiLogger('register');
  const events = [navigateCheckout, getCartId, navigateCart, addToCart, controlCartBasis, updateCheckoutDetail, cartDetailUpdate, checkoutDetailInit, checkoutDetailUpdate, cartLineItemUpdate];
  _exports.default = (...activateApiNames) => {
    const executedEvents = [];
    activateApiNames.forEach(activateApiName => {
      events.forEach(event => {
        if (event && event.apiName === activateApiName) {
          executedEvents.push(activateApiName);
          event();
        }
      });
    });
    logger.info('executed events', {
      data: {
        executedEvents
      }
    });
    return executedEvents;
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/customer/enum/index.js'] = window.SLM['theme-shared/events/customer/enum/index.js'] || function () {
  const _exports = {};
  const LOGIN_MODAL = 'Customer::LoginModal';
  _exports.LOGIN_MODAL = LOGIN_MODAL;
  const LOGIN_MODAL_RENDER = 'Customer::LoginModalRender';
  _exports.LOGIN_MODAL_RENDER = LOGIN_MODAL_RENDER;
  const REGISTER = 'Customer::Register';
  _exports.REGISTER = REGISTER;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/customer/interior-event/index.js'] = window.SLM['theme-shared/events/customer/interior-event/index.js'] || function () {
  const _exports = {};
  const LOGIN_MODAL = Symbol('LOGIN_MODAL');
  _exports.LOGIN_MODAL = LOGIN_MODAL;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/shared/utils/bem.js'] = window.SLM['theme-shared/components/hbs/shared/utils/bem.js'] || function () {
  const _exports = {};
  function gen(name, mods) {
    if (!mods) {
      return '';
    }
    if (typeof mods === 'string') {
      return ` ${name}--${mods}`;
    }
    if (Array.isArray(mods)) {
      return mods.reduce((ret, item) => {
        return ret + gen(name, item);
      }, '');
    }
    return Object.keys(mods).reduce((ret, key) => ret + (mods[key] ? gen(name, key) : ''), '');
  }
  function createBEM(name) {
    return (el, mods) => {
      if (el && typeof el !== 'string') {
        mods = el;
        el = '';
      }
      el = el ? `${name}__${el}` : name;
      return `${el}${gen(el, mods)}`;
    };
  }
  function createNamespace(commonName, name) {
    name = `${commonName}-${name}`;
    return createBEM(name);
  }
  _exports.default = createNamespace;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/shared/components/modal/common.js'] = window.SLM['theme-shared/components/hbs/shared/components/modal/common.js'] || function () {
  const _exports = {};
  const createNamespace = window['SLM']['theme-shared/components/hbs/shared/utils/bem.js'].default;
  const { disablePageScroll, enablePageScroll, addLockableTarget } = window['scroll-lock'];
  _exports.disablePageScroll = disablePageScroll;
  _exports.enablePageScroll = enablePageScroll;
  _exports.addLockableTarget = addLockableTarget;
  const bem = createNamespace('mp', 'modal');
  _exports.bem = bem;
  const DEFAULT_MODAL_ID_PRE = 'MpModal';
  _exports.DEFAULT_MODAL_ID_PRE = DEFAULT_MODAL_ID_PRE;
  const VISIBLE = 'visible';
  _exports.VISIBLE = VISIBLE;
  const HIDDEN = 'hidden';
  _exports.HIDDEN = HIDDEN;
  const animationClassMap = {
    visible: bem('visibleAnimation'),
    hidden: bem('notVisibleAnimation')
  };
  _exports.animationClassMap = animationClassMap;
  const visibleClassName = bem('visible');
  _exports.visibleClassName = visibleClassName;
  const maskClosableClass = bem('closable');
  _exports.maskClosableClass = maskClosableClass;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/shared/components/modal/lite.js'] = window.SLM['theme-shared/components/hbs/shared/components/modal/lite.js'] || function () {
  const _exports = {};
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { bem, visibleClassName, animationClassMap, disablePageScroll, enablePageScroll, HIDDEN, VISIBLE, DEFAULT_MODAL_ID_PRE, maskClosableClass } = window['SLM']['theme-shared/components/hbs/shared/components/modal/common.js'];
  class Modal {
    constructor({
      modalId = ''
    } = {}) {
      this.modalId = `${DEFAULT_MODAL_ID_PRE}${modalId}`;
      this.$modal = $(`#${this.modalId}`);
      this.$modalBody = this.$modal.find(`.${bem('body')}`);
      this.$modalContainer = this.$modal.find(`.${bem('container')}`);
      this.isMobile = SL_State.get('request.is_mobile');
      this.maskClosable = this.$modal.data('maskclosable');
      this.visibleState = HIDDEN;
      this.eventsBinded = false;
      this.init();
    }
    init() {
      if (!this.eventsBinded) {
        this.bindEvents();
        this.eventsBinded = true;
      }
    }
    show() {
      this.visibleState = VISIBLE;
      disablePageScroll(this.$modalBody.get(0));
      this.$modal.addClass([visibleClassName, animationClassMap.visible]).removeClass(animationClassMap.hidden);
      this.toggleMaskClassName();
    }
    hide(force) {
      this.visibleState = HIDDEN;
      enablePageScroll(this.$modalBody.get(0));
      this.toggleMaskClassName();
      this.$modal.addClass(animationClassMap.hidden).removeClass(animationClassMap.visible);
      if (force) {
        this.afterAnimation();
      }
    }
    toggleMaskClassName() {
      if (this.maskClosable) {
        this.$modal.find(`.${bem('mask')}`).toggleClass(maskClosableClass, this.visibleState === VISIBLE);
      }
    }
    afterAnimation() {
      this.$modal.toggleClass(visibleClassName, this.visibleState === VISIBLE);
    }
    bindEvents() {
      this.$modal.on('click', `.${bem('close')}`, this.hide.bind(this, false));
      if (this.isMobile) {
        this.$modal.on('touchstart', `.${bem('close')}`, this.hide.bind(this, false));
      }
      if (this.maskClosable) {
        this.$modal.on('click', `.${bem('mask')}`, this.hide.bind(this, false));
      }
      this.$modalContainer.on('animationend', this.afterAnimation.bind(this));
    }
  }
  _exports.default = Modal;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/shared/base/BaseClass.js'] = window.SLM['theme-shared/components/hbs/shared/base/BaseClass.js'] || function () {
  const _exports = {};
  function isInvalid(param) {
    return !param || typeof param !== 'string';
  }
  function isJqueryInstance(dom) {
    return dom && dom instanceof $ && dom.length > 0;
  }
  function getEventHandlerName(event, selector, namepsace) {
    if (!selector) {
      return [event, namepsace].join('-');
    }
    if (isJqueryInstance(selector)) {
      return selector;
    }
    return [selector, event, namepsace].join('-');
  }
  function getNamespace(event, namespace) {
    if (isInvalid(event) && isInvalid(namespace)) {
      throw new Error('one of these two parameters must be provided!');
    }
    if (isInvalid(event)) {
      return `.${namespace}`;
    }
    return [event, namespace].join('.');
  }
  const eventInvalidErrorMessage = 'event param must be provided and it must be a string type';
  function on({
    eventName,
    handler,
    selector,
    scope
  } = {}) {
    if (isInvalid(eventName)) {
      throw new Error(eventInvalidErrorMessage);
    }
    if (!isJqueryInstance(scope)) {
      throw new Error('scope must be a jQuery Object');
    }
    if (typeof handler !== 'function') {
      throw new TypeError('handler must be a function');
    }
    if (selector) {
      if (isInvalid(selector)) {
        throw new TypeError('selector must be a string!');
      }
      scope.on(eventName, selector, handler);
    } else {
      scope.on(eventName, handler);
    }
  }
  function off({
    eventName,
    selector,
    handler,
    scope
  } = {}) {
    if (isInvalid(eventName)) {
      throw new Error(eventInvalidErrorMessage);
    }
    if (!isJqueryInstance(scope)) {
      throw new Error('scope must be a jQuery Object');
    }
    if (selector) {
      if (isInvalid(selector)) {
        throw new TypeError('selector must be a string!');
      }
      if (typeof handler === 'function') {
        scope.off(eventName, selector, handler);
      } else {
        scope.off(eventName, selector);
      }
    } else {
      scope.off(eventName);
    }
  }
  function onConsistent(event, selector, handler) {
    if (isInvalid(event)) {
      throw new Error(eventInvalidErrorMessage);
    }
    if (!handler) {
      handler = selector;
      selector = null;
    }
    const eventHandlerKey = this.getEventHandlerName(event, selector);
    const ns = this.getEventNamespace(event);
    this.$eventHandlers.set(eventHandlerKey, handler);
    return scope => {
      on({
        eventName: ns,
        selector,
        handler,
        scope
      });
    };
  }
  function offConsistent(event, selector) {
    if (isInvalid(event)) {
      throw new Error(eventInvalidErrorMessage);
    }
    const eventHandlerName = this.getEventHandlerName(event, selector);
    const handler = this.$eventHandlers.get(eventHandlerName);
    const ns = this.getEventNamespace(event);
    return scope => {
      off({
        eventName: ns,
        selector,
        handler,
        scope
      });
      if (handler) {
        this.$eventHandlers.delete(eventHandlerName);
      }
    };
  }
  class EventManager {
    constructor(namespace = '', portals) {
      this.$win = $(window);
      this.$doc = $(document);
      this.$portals = portals ? $(portals) : null;
      this.namespace = typeof namespace === 'string' ? namespace : '';
      this.$eventHandlers = new Map();
      this.$winEventHandlers = new Map();
    }
    getEventNamespace(event) {
      return getNamespace(event, this.namespace);
    }
    getEventHandlerName(event, selector) {
      return getEventHandlerName(event, selector, this.namespace);
    }
    getPortals() {
      return isJqueryInstance(this.$portals) ? this.$portals : this.$doc;
    }
    $setNamespace(namespace) {
      this.namespace = namespace;
    }
    $setPortals(portals) {
      this.$portals = portals ? $(portals) : null;
    }
    $on(event, selector, handler) {
      const onEvent = onConsistent.call(this, event, selector, handler);
      onEvent(this.$doc);
    }
    $onPortals(event, selector, handler) {
      const $dom = this.getPortals();
      const onEvent = onConsistent.call(this, event, selector, handler);
      onEvent($dom);
    }
    $onWin(event, handler) {
      this.$winEventHandlers.set(this.getEventHandlerName(event), handler);
      this.$win.on(this.getEventNamespace(event), handler);
    }
    $off(event, selector) {
      const offEvent = offConsistent.call(this, event, selector);
      offEvent(this.$doc);
    }
    $offPortals(event, selector) {
      const $dom = this.getPortals();
      const offEvent = offConsistent.call(this, event, selector);
      offEvent($dom);
    }
    $offWin(event) {
      const eventHandlerName = this.getEventHandlerName(event);
      const handler = this.$winEventHandlers.get(eventHandlerName);
      this.$win.off(this.getEventNamespace(event));
      if (handler) {
        this.$winEventHandlers.delete(eventHandlerName);
      }
    }
    $offAll() {
      const ns = this.getEventNamespace();
      this.$win.off(ns);
      this.$doc.off(ns);
      if (isJqueryInstance(this.$portals)) {
        this.$portals.off(ns);
      }
      this.$eventHandlers.clear();
      this.$winEventHandlers.clear();
    }
    prepareTransition($el, callback, endCallback) {
      function removeClass() {
        $el.removeClass('is-transitioning');
        $el.off('transitionend', removeClass);
        if (endCallback) {
          endCallback();
        }
      }
      $el.on('transitionend', removeClass);
      $el.addClass('is-transitioning');
      $el.width();
      if (typeof callback === 'function') {
        callback();
      }
    }
  }
  _exports.default = EventManager;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/shared/components/modal/full.js'] = window.SLM['theme-shared/components/hbs/shared/components/modal/full.js'] || function () {
  const _exports = {};
  const Base = window['SLM']['theme-shared/components/hbs/shared/base/BaseClass.js'].default;
  const { bem, visibleClassName, animationClassMap, disablePageScroll, enablePageScroll, HIDDEN, VISIBLE, DEFAULT_MODAL_ID_PRE, maskClosableClass } = window['SLM']['theme-shared/components/hbs/shared/components/modal/common.js'];
  let uuid = 0;
  class ModalWithHtml extends Base {
    constructor(options = {}) {
      super('mp:modal:full');
      const config = {
        zIndex: 1000,
        containerClassName: '',
        closable: true,
        maskClosable: true,
        bodyClassName: '',
        content: '',
        destroyedOnClosed: false,
        afterClose: () => {},
        closeCallback: () => {},
        ...options
      };
      this.modalId = config.id || `${DEFAULT_MODAL_ID_PRE}${++uuid}`;
      this.zIndex = config.zIndex;
      this.config = config;
      this.destroyed = false;
      this.init();
    }
    init() {
      const $modal = $(`#${this.modalId}`);
      if ($modal.length > 0) {
        this.$modal = $modal;
        this.$setPortals($modal);
        return;
      }
      this.$modal = this.buildModalHtml();
      this.$setPortals(this.$modal);
      this.bindEvents();
    }
    buildModalHtml() {
      const {
        zIndex,
        closable,
        containerClassName,
        bodyClassName,
        content,
        children
      } = this.config;
      const modalHtml = `
      <div id="${this.modalId}" class="${bem('wrapper')}">
        <div class="${bem('mask')}"></div>
        <div class="${bem('container')}">
          ${closable ? `<span class="${bem('close')}">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.1998 4.80005L4.7998 19.2" stroke="currentColor" stroke-width="2"/>
              <path d="M4.7998 4.79995L19.1998 19.2" stroke="currentColor" stroke-width="2"/>
            </svg>          
          </span>` : ''}
          <div class="${bem('body')} ${bodyClassName}">
            ${content}
          </div>
        </div>
      </div>
    `;
      const $modal = $(modalHtml);
      if (containerClassName) {
        $modal.find(`.${bem('container')}`).addClass(containerClassName);
      }
      if (bodyClassName) {
        $modal.find(`.${bem('body')}`).addClass(bodyClassName);
      }
      if (children) {
        $modal.find(`.${bem('body')}`).append(children);
      }
      if ((typeof zIndex === 'number' || typeof zIndex === 'string') && zIndex !== '') {
        $modal.css('z-index', zIndex);
      }
      return $modal;
    }
    setContent(content) {
      this.config.content = content;
      this.$modal.find(`.${bem('body')}`).html(content);
    }
    show() {
      if (this.destroyed) {
        this.destroyed = false;
        this.unBindEvents = this.bindEvents();
      }
      const $modalBody = this.$modal.find(`.${bem('body')}`);
      this.$modal.appendTo(document.body);
      disablePageScroll($modalBody.get(0));
      this.visibleState = VISIBLE;
      this.$modal.addClass([visibleClassName, animationClassMap.visible]).removeClass(animationClassMap.hidden);
      this.toggleMaskClassName();
    }
    hide(force) {
      const $modalBody = this.$modal.find(`.${bem('body')}`);
      this.visibleState = HIDDEN;
      enablePageScroll($modalBody.get(0));
      window.SL_EventBus.emit('global:popup:close');
      this.toggleMaskClassName();
      this.$modal.addClass(animationClassMap.hidden).removeClass(animationClassMap.visible);
      if (force) {
        this.afterAnimation();
      }
      if (typeof this.config.closeCallback === 'function') {
        this.config.closeCallback(this.$modal);
      }
    }
    toggleMaskClassName() {
      if (this.config.maskClosable) {
        this.$modal.find(`.${bem('mask')}`).toggleClass(maskClosableClass, this.visibleState === VISIBLE);
      }
    }
    afterAnimation() {
      this.$modal.toggleClass(visibleClassName, this.visibleState === VISIBLE);
      if (typeof this.config.afterClose === 'function') {
        this.config.afterClose(this.$modal);
      }
      this.destroy();
    }
    destroy() {
      if (this.config.destroyedOnClosed && this.visibleState === HIDDEN) {
        this.$modal.remove();
        this.detachEvents();
        this.destroyed = true;
      }
    }
    bindEvents() {
      this.$onPortals('click', `.${bem('close')}`, this.hide.bind(this, false));
      if (this.config.maskClosable) {
        this.$onPortals('click', `.${bem('mask')}`, this.hide.bind(this, false));
      }
      this.$onPortals('animationend', `.${bem('container')}`, this.afterAnimation.bind(this));
    }
    detachEvents() {
      this.$offAll();
    }
  }
  _exports.default = ModalWithHtml;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/shared/components/modal/index.js'] = window.SLM['theme-shared/components/hbs/shared/components/modal/index.js'] || function () {
  const _exports = {};
  const { default: _default } = window['SLM']['theme-shared/components/hbs/shared/components/modal/lite.js'];
  _exports.default = _default;
  const { default: ModalWithHtml } = window['SLM']['theme-shared/components/hbs/shared/components/modal/full.js'];
  _exports.ModalWithHtml = ModalWithHtml;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/customer/developer-api/login-modal/renderModal.js'] = window.SLM['theme-shared/events/customer/developer-api/login-modal/renderModal.js'] || function () {
  const _exports = {};
  const request = window['axios']['default'];
  const { ModalWithHtml } = window['SLM']['theme-shared/components/hbs/shared/components/modal/index.js'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  function baseGet(object, path) {
    path = path.split('.');
    let index = 0;
    const {
      length
    } = path;
    while (object != null && index < length) {
      object = object[path[index++]];
    }
    return index && index === length ? object : undefined;
  }
  const CONTAINER_CLASS = 'login-modal__container';
  const BODY_CLASS = 'login-modal__body';
  const loadingTemplate = `
  <div class="login-modal--loading">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.3333 9.99999C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39762 18.3333 1.66666 14.6024 1.66666 9.99999C1.66666 5.39762 5.39762 1.66666 10 1.66666" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  </div>
`;
  async function initLoginModalChunk(containerId) {
    return new Promise((resolve, reject) => {
      let container = document.getElementById('customerLoginModalScriptUrl');
      let jsUrls = [];
      if (container && container.tagName.toLocaleLowerCase() === 'script') {
        jsUrls.push(baseGet(container, 'attributes.src.nodeValue', ''));
      } else {
        container = document.getElementById(containerId);
        jsUrls = Array.from(container.querySelectorAll('script')).map(ele => baseGet(ele, 'attributes.src.nodeValue', '')).filter(url => !!url);
      }
      if (!jsUrls || !jsUrls.length) {
        reject(new Error(`failed to get login-modal js chunk url`));
        return;
      }
      const promiseList = jsUrls.map(url => {
        return new Promise((resolve, reject) => {
          const scriptEle = document.createElement('script');
          document.body.appendChild(scriptEle);
          scriptEle.onload = () => {
            resolve();
          };
          scriptEle.async = false;
          scriptEle.onerror = reject;
          scriptEle.src = url;
        });
      });
      Promise.all(promiseList).then(resolve).catch(reject);
    });
  }
  _exports.default = async (options = {}, lifeCycle = {}) => {
    const modal = new ModalWithHtml({
      id: 'loginModal',
      ...options,
      bodyClassName: BODY_CLASS,
      containerClassName: CONTAINER_CLASS
    });
    modal.setContent(loadingTemplate);
    modal.show();
    lifeCycle && lifeCycle.onShow && lifeCycle.onShow(modal);
    const path = `/user/signIn?view=ajax&fromTemplateAlias=${SL_State.get('templateAlias')}`;
    const requestUrl = window.Shopline && window.Shopline.redirectTo && window.Shopline.redirectTo(path) || path;
    const {
      data
    } = await request.get(requestUrl);
    modal.setContent(data || '');
    const sl_$ = window.__SL_$__;
    if (!sl_$ || !sl_$._evalUrl || !sl_$.ajaxSettings || !sl_$.ajaxSettings.xhr) {
      await initLoginModalChunk(modal.modalId);
    }
    if (!!Array.from(document.getElementById(modal.modalId).querySelectorAll('script')).find(item => item.type === 'text/sl-javascript') && SL_State.get('templateAlias') === 'Checkout') {
      await initLoginModalChunk(modal.modalId);
    }
    return modal;
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/customer/developer-api/login-modal/index.js'] = window.SLM['theme-shared/events/customer/developer-api/login-modal/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const externalEvent = window['SLM']['theme-shared/events/customer/enum/index.js'];
  const interiorEvent = window['SLM']['theme-shared/events/customer/interior-event/index.js'];
  const { redirectTo } = window['SLM']['theme-shared/utils/url.js'];
  const renderModal = window['SLM']['theme-shared/events/customer/developer-api/login-modal/renderModal.js'].default;
  const logger = apiLogger(externalEvent.LOGIN_MODAL);
  const interior = window && window.SL_EventBus;
  const external = window && window.Shopline.event;
  const isMobile = window && window.SL_State && window.SL_State.get('request.is_mobile');
  let modal;
  const bindResizeEvent = (() => {
    let hasBindEvent = false;
    return modal => {
      if (hasBindEvent) {
        return;
      }
      hasBindEvent = true;
      const container = document.querySelector(`#${modal.modalId} .login-modal__container`);
      const setHeight = () => {
        const vh = window.innerHeight * 0.01;
        container.style.maxHeight = `${90 * vh}px`;
      };
      setHeight();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          setHeight();
        }
      });
      window.addEventListener('resize', setHeight);
    };
  })();
  interior.on(interiorEvent.LOGIN_MODAL, async (options = {}) => {
    const {
      data = {},
      onSuccess,
      onError
    } = options;
    if (navigator.userAgent && navigator.userAgent.includes('SL2ShopperApp')) {
      window.location.href = redirectTo('/user/signIn');
      return;
    }
    const lifeCycle = {
      onShow: modal => {
        if (isMobile) {
          bindResizeEvent(modal);
        }
      }
    };
    try {
      if (modal) {
        if (modal.visibleState !== 'visible') {
          modal.show();
          lifeCycle && lifeCycle.onShow(modal);
        }
        external.emit(externalEvent.LOGIN_MODAL_RENDER);
        onSuccess && onSuccess(modal);
        return;
      }
      modal = await renderModal(data, lifeCycle);
      external.emit(externalEvent.LOGIN_MODAL_RENDER);
      onSuccess && onSuccess(modal);
    } catch (e) {
      onError && onError(e);
    }
  });
  const loginModal = () => external && external.on(externalEvent.LOGIN_MODAL, async (options = {}) => {
    const {
      onError,
      data
    } = options;
    try {
      logger.info(`[emit]`, data);
      interior.emit(interiorEvent.LOGIN_MODAL, options);
    } catch (error) {
      onError && onError(error);
    }
  });
  loginModal.apiName = externalEvent.LOGIN_MODAL;
  _exports.default = loginModal;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/customer/developer-api/register/index.js'] = window.SLM['theme-shared/events/customer/developer-api/register/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const externalEvent = window['SLM']['theme-shared/events/customer/enum/index.js'];
  const logger = apiLogger(`${externalEvent.REGISTER} - EMIT`);
  const interior = window.SL_EventBus;
  const external = window.Shopline.event;
  const register = () => interior.on('customer:register', (data = {}) => {
    logger.info(`${externalEvent.REGISTER} on`, {
      data
    });
    external.emit(externalEvent.REGISTER, {
      ...data
    });
  });
  register.apiName = externalEvent.REGISTER;
  _exports.default = register;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/customer/developer-api/index.js'] = window.SLM['theme-shared/events/customer/developer-api/index.js'] || function () {
  const _exports = {};
  const loginModal = window['SLM']['theme-shared/events/customer/developer-api/login-modal/index.js'].default;
  const register = window['SLM']['theme-shared/events/customer/developer-api/register/index.js'].default;
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const logger = apiLogger('register');
  const events = [loginModal, register];
  _exports.default = (...activateApiNames) => {
    const executedEvents = [];
    activateApiNames.forEach(activateApiName => {
      events.forEach(event => {
        if (event && event.apiName === activateApiName) {
          executedEvents.push(activateApiName);
          event && event();
        }
      });
    });
    logger.info('executed events', {
      data: {
        executedEvents
      }
    });
    return executedEvents;
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/dataReport/ads.js'] = window.SLM['theme-shared/utils/dataReport/ads.js'] || function () {
  const _exports = {};
  const { PageType, ClickType } = window['SLM']['theme-shared/utils/report/const.js'];
  const { getCurrencyCode } = window['SLM']['theme-shared/utils/dataReport/tool.js'];
  const sendConversion = data => {
    const params = {
      ...data
    };
    if (params && !params.currency) {
      params.currency = getCurrencyCode();
    }
    return ['event', 'conversion', params];
  };
  const clickAdsData = (page, type) => {
    const res = [];
    switch (page) {
      case PageType.ProductDetail:
        switch (type) {
          case ClickType.AddToCart:
          case ClickType.BeginCheckout:
            break;
          default:
            return res;
        }
        break;
      case PageType.MiniCart:
      case PageType.Cart:
        switch (type) {
          case ClickType.BeginCheckout:
            break;
          default:
            return res;
        }
        break;
      case PageType.CheckoutProgress:
        switch (type) {
          case ClickType.CheckoutProgress:
            break;
          default:
            return res;
        }
        break;
      case PageType.CheckoutConfirm:
        switch (type) {
          case ClickType.PlaceOrder:
            break;
          default:
            return res;
        }
        break;
      case PageType.OneShop:
        switch (type) {
          case ClickType.BeginCheckout:
            break;
          default:
            return res;
        }
        break;
      default:
        return res;
    }
    res.push(sendConversion());
    return res;
  };
  const loadAdsData = (page, params) => {
    let value = null;
    const data = [];
    switch (page) {
      case PageType.Cart:
      case PageType.CheckoutProgress:
      case PageType.CheckoutConfirm:
      case PageType.SalesPromotion:
        break;
      case PageType.OrderConfirm:
        value = {
          value: params.price,
          currency: params.currency
        };
        break;
      default:
        return data;
    }
    data.push(sendConversion(value));
    return data;
  };
  _exports.clickAdsData = clickAdsData;
  _exports.loadAdsData = loadAdsData;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/dataReport/hd.js'] = window.SLM['theme-shared/utils/dataReport/hd.js'] || function () {
  const _exports = {};
  const { ClickType, PageType } = window['SLM']['theme-shared/utils/report/const.js'];
  function addToCartHdReport({
    spuId,
    skuId,
    num,
    price,
    name,
    page,
    event_name,
    event_category,
    product_type,
    event_id
  }) {
    window.HdSdk && window.HdSdk.shopTracker.report(event_id, {
      page,
      event_name,
      event_category,
      product_type,
      product_id: spuId,
      variantion_id: skuId,
      quantity: `${num}`,
      price: `${price}`,
      product_name: name
    });
  }
  function reportHd(page, type, data) {
    switch (page) {
      case PageType.ProductDetail:
        switch (type) {
          case ClickType.AddToCart:
          case ClickType.BeginCheckout:
            addToCartHdReport(data);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }
  _exports.default = reportHd;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/dataReport/index.js'] = window.SLM['theme-shared/utils/dataReport/index.js'] || function () {
  const _exports = {};
  const Cookies = window['js-cookie']['*'];
  const ga = window['SLM']['theme-shared/utils/dataReport/ga.js'].default;
  const { clickAdsData, loadAdsData } = window['SLM']['theme-shared/utils/dataReport/ads.js'];
  const { clickFbData, loadFbData } = window['SLM']['theme-shared/utils/dataReport/fb.js'];
  const reportHd = window['SLM']['theme-shared/utils/dataReport/hd.js'].default;
  const { SL_EventBus } = window['@yy/sl-theme-shared']['/utils/event-bus'];
  const { ClickType, PageType } = window['SLM']['theme-shared/utils/report/const.js'];
  const { getEventID } = window['SLM']['theme-shared/utils/report/tool.js'];
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const externalDtaReportEvents = window['@yy/sl-theme-shared']['/events/data-report/enum']['*'];
  const dataReportAdapters = window['@yy/sl-theme-shared']['/events/data-report/adapters'].default;
  const { getCurrencyCode } = window['SLM']['theme-shared/utils/dataReport/tool.js'];
  const excludedDataReportEvents = new Set(Object.keys(externalDtaReportEvents).map(key => externalDtaReportEvents[key]));
  const logger = apiLogger('DataReport:Instance - ON');
  class DataReport {
    constructor() {
      this.eventBus = SL_EventBus;
      this.rpEvent = window.Shopline && window.Shopline.event;
      this.currency = getCurrencyCode();
    }
    load(data) {
      const {
        pageType,
        value
      } = data;
      const val = {
        ...value,
        ...{
          currency: this.currency
        }
      };
      const gaParam = ga.load(pageType, val);
      const adsParams = loadAdsData(pageType, val);
      const fbParams = loadFbData(pageType, val);
      const params = {
        GAAds: adsParams,
        GA: gaParam,
        FBPixel: fbParams
      };
      this.eventBus && this.eventBus.emit('global:thirdPartReport', params);
    }
    touch(data) {
      const {
        pageType,
        actionType,
        value
      } = data;
      const {
        content_spu_id,
        content_sku_id,
        content_category,
        content_name,
        currency,
        quantity,
        price,
        hdProducts,
        extra
      } = value || {};
      const spu_ids = [content_spu_id];
      if (Array.isArray(hdProducts)) {
        hdProducts.forEach(item => {
          if (item && item.spuId) {
            spu_ids.push(item && item.spuId);
          }
          reportHd(pageType, actionType, item);
        });
      }
      const eid = getEventID();
      const tpParams = {
        skuId: spu_ids,
        category: content_category,
        name: content_name,
        currency,
        quantity,
        price,
        eventId: `addToCart${eid}`
      };
      if (extra && extra.abandonedOrderSeq && extra.event_scenes === 'buy_now') {
        Cookies.set(`${extra.abandonedOrderSeq}_fb_data`, {
          tp: 1,
          et: Date.now(),
          ed: eid
        });
      }
      const hdParams = {
        spuId: content_spu_id,
        skuId: content_sku_id,
        name: content_name,
        num: quantity,
        price,
        ...extra
      };
      const gaParam = ga.click(pageType, actionType, tpParams);
      const adsParams = clickAdsData(pageType, actionType, tpParams);
      const fbParams = clickFbData(actionType, tpParams);
      const params = {
        GAAds: adsParams,
        GA: gaParam,
        FBPixel: fbParams
      };
      this.eventBus && this.eventBus.emit('global:thirdPartReport', params);
      if (extra && extra.event_name) {
        reportHd(pageType, actionType, hdParams);
      }
    }
    listen(eventName) {
      this.rpEvent && this.rpEvent.on(eventName, data => {
        logger.info('event on', {
          data
        });
        if (data.interior && excludedDataReportEvents.has(data.interior)) {
          logger.error('not in access events', {
            data: {
              interior: data.interior,
              excludedDataReportEvents
            }
          });
          return;
        }
        const params = {
          actionType: ClickType.AddToCart,
          pageType: PageType.ProductDetail,
          value: data && data.data
        };
        this.touch(params);
      });
    }
  }
  const dataReport = new DataReport();
  dataReportAdapters.on();
  _exports.default = dataReport;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/report/page.js'] = window.SLM['theme-shared/utils/report/page.js'] || function () {
  const _exports = {};
  _exports.default = {
    Home: 101,
    ProductsSearch: 102,
    Products: 103,
    ProductsDetail: 105,
    AllCollections: 174,
    Activity: 115,
    Page: {
      custom_page: 118,
      smart_landing_page: 147
    },
    BlogsList: 119,
    BlogsDetail: 120,
    404: 130,
    Center: 123,
    SignIn: 128,
    SignUp: 129,
    Cart: 106,
    Thankyou: 114
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/report/common/baseReport.js'] = window.SLM['theme-shared/report/common/baseReport.js'] || function () {
  const _exports = {};
  const pageMap = window['SLM']['theme-shared/utils/report/page.js'].default;
  const { getEventID } = window['SLM']['theme-shared/utils/report/tool.js'];
  function findSectionId(selector) {
    if (!selector || !$(selector)) {
      return;
    }
    const id = $(selector).closest('.shopline-section').attr('id');
    const trueId = id ? id.replace('shopline-section-', '') : '';
    return trueId;
  }
  _exports.findSectionId = findSectionId;
  class BaseReport {
    static getPage() {
      const alias = window.SL_State.get('templateAlias');
      const template = window.SL_State.get('template');
      if (alias !== 'Page') {
        return pageMap[alias] || alias;
      }
      const isCustomPage = template.toLowerCase() === alias.toLowerCase();
      return isCustomPage ? pageMap.Page.custom_page : pageMap.Page.smart_landing_page;
    }
    constructor(page) {
      this.page = page || BaseReport.getPage() || '';
    }
    static collect(params) {
      if (!window.HdSdk) {
        return;
      }
      window.HdSdk.shopTracker.collect(params);
    }
    static expose(params) {
      if (!window.HdSdk) {
        return;
      }
      window.HdSdk.shopTracker.expose(params);
    }
    click(customParams) {
      if (!window.HdSdk) {
        return;
      }
      const params = {
        page: this.page,
        action_type: 102,
        event_name: 'Click',
        ...customParams
      };
      window.HdSdk.shopTracker.collect(params);
    }
    handleView({
      selector,
      targetList,
      threshold,
      duration,
      reportOnce,
      customParams,
      viewType = 'view'
    }) {
      if (!window.HdSdk) {
        return;
      }
      const commonParams = {
        page: this.page
      };
      const objectParams = {
        ...commonParams,
        ...customParams
      };
      const funcParams = target => {
        const funcCustomParams = customParams(target);
        return {
          ...commonParams,
          ...funcCustomParams
        };
      };
      window.HdSdk.shopTracker.expose({
        selector,
        targetList,
        [viewType]: {
          reportOnce,
          threshold,
          duration,
          params: typeof customParams === 'function' ? funcParams : objectParams
        }
      });
    }
    view({
      selector,
      targetList,
      reportOnce = true,
      duration,
      threshold,
      customParams
    }) {
      this.handleView({
        selector,
        targetList,
        reportOnce,
        duration,
        threshold,
        customParams,
        viewType: 'view'
      });
    }
    viewSuccess({
      selector,
      targetList,
      threshold = 0.5,
      duration = 500,
      reportOnce = true,
      customParams
    }) {
      this.handleView({
        selector,
        targetList,
        reportOnce,
        duration,
        threshold,
        customParams,
        viewType: 'viewSuccess'
      });
    }
    viewContent({
      selector,
      targetList,
      reportOnce,
      threshold,
      customParams
    }) {
      const params = {
        component: -999,
        event_name: 'ViewContent',
        action_type: 'ViewContent',
        ...customParams
      };
      this.view({
        selector,
        targetList,
        reportOnce,
        threshold,
        customParams: params
      });
    }
    viewItemList({
      selector,
      customParams
    }) {
      const params = {
        page: this.page,
        module: -999,
        component: -999,
        action_type: '',
        event_name: 'ViewItemList',
        event_id: `ViewItemList${getEventID()}`,
        ...customParams
      };
      this.view({
        selector,
        customParams: params
      });
    }
    selectContent({
      baseParams,
      customParams
    }) {
      const pageItemMap = {
        101: {
          module: 900,
          component: 101
        },
        102: {
          module: 109,
          component: 101,
          action_type: ''
        },
        103: {
          module: 109,
          component: 101
        },
        105: {
          module: 108,
          component: 101
        }
      };
      const params = {
        page: this.page,
        event_name: 'SelectContent',
        current_source_page: BaseReport.getPage(),
        ...pageItemMap[this.page],
        ...baseParams,
        ...customParams
      };
      BaseReport.collect(params);
    }
    searchResults({
      baseParams,
      customParams
    }) {
      const params = {
        page: this.page,
        module: -999,
        component: -999,
        action_type: '',
        event_name: 'SearchResults',
        ...baseParams,
        ...customParams
      };
      BaseReport.collect(params);
    }
  }
  _exports.BaseReport = BaseReport;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/report/product/utils/index.js'] = window.SLM['theme-shared/report/product/utils/index.js'] || function () {
  const _exports = {};
  const pageMap = window['SLM']['theme-shared/utils/report/page.js'].default;
  const isObject = window['lodash']['isPlainObject'];
  function getCartId() {
    return new Promise((resolve, reject) => {
      if (window.Shopline && window.Shopline.event && window.Shopline.event.emit) {
        window.Shopline.event.emit('Cart::GetCartId', {
          onSuccess(res) {
            if (res && res.success) {
              const ownerId = res.data;
              resolve(ownerId);
            }
            reject(res);
          },
          onError(error) {
            reject(error);
          }
        });
      }
    });
  }
  _exports.getCartId = getCartId;
  function validParams(target) {
    try {
      if (!target || !isObject(target)) {
        throw new Error();
      }
    } catch (error) {
      throw new Error(`report function params must be object ${error}`);
    }
  }
  _exports.validParams = validParams;
  function getPage() {
    const alias = window.SL_State.get('templateAlias');
    return pageMap[alias];
  }
  _exports.getPage = getPage;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/currency/getCurrencyCode.js'] = window.SLM['theme-shared/utils/currency/getCurrencyCode.js'] || function () {
  const _exports = {};
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { getConvertPrice } = window['SLM']['theme-shared/utils/newCurrency/index.js'];
  const getCurrencyCode = () => {
    return SL_State.get('currencyCode');
  };
  _exports.getCurrencyCode = getCurrencyCode;
  const convertPrice = price => {
    const {
      integer,
      group,
      fraction
    } = getConvertPrice(price);
    const integerWithoutGroup = group ? integer.split(group).join('') : integer;
    return Number(integerWithoutGroup + (fraction ? `.${fraction}` : ''));
  };
  _exports.convertPrice = convertPrice;
  _exports.default = getCurrencyCode;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/report/product/product-quickAddCart.js'] = window.SLM['theme-shared/report/product/product-quickAddCart.js'] || function () {
  const _exports = {};
  const { BaseReport } = window['SLM']['theme-shared/report/common/baseReport.js'];
  const { getCartId, validParams } = window['SLM']['theme-shared/report/product/utils/index.js'];
  const getCurrencyCode = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'].default;
  const { convertPrice } = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'];
  const { nullishCoalescingOperator } = window['SLM']['theme-shared/utils/syntax-patch.js'];
  const pdpTypeMap = {
    101: 102,
    102: 103,
    103: 103,
    105: 101,
    115: 103
  };
  class ProductQuickAddCart extends BaseReport {
    quickAddCartView(reportData) {
      validParams(reportData);
      const {
        baseParams = {},
        productInfo
      } = reportData;
      const {
        spuSeq,
        skuSeq,
        price,
        productName
      } = productInfo;
      const productInfoParams = {
        content_ids: spuSeq,
        sku_id: skuSeq,
        content_name: productName,
        currency: getCurrencyCode(),
        value: convertPrice(price)
      };
      const params = {
        page: 108,
        module: -999,
        component: -999,
        action_type: 101,
        popup_page_base: this.page,
        pdp_type: nullishCoalescingOperator(pdpTypeMap[this.page], 103),
        ...baseParams,
        ...productInfoParams
      };
      super.view({
        selector: `.__sl-custom-track-quick-add-modal-${spuSeq}`,
        reportOnce: false,
        customParams: params
      });
    }
    async btnAddToCart(reportData) {
      validParams(reportData);
      const TypeMap = {
        101: 'addtocart',
        102: 'buynow',
        103: 'paypal'
      };
      const {
        baseParams
      } = reportData;
      const productInfoParams = {
        cart_id: await getCartId(),
        currency: getCurrencyCode()
      };
      const params = {
        page: 108,
        module: 106,
        event_name: 'AddToCart',
        addtocart_type: TypeMap[baseParams.component],
        ...baseParams,
        ...productInfoParams
      };
      super.collect(params);
    }
    itemAddToCart(reportData) {
      validParams(reportData);
      const {
        baseParams = {},
        productInfo
      } = reportData;
      const {
        spuSeq,
        itemIndex,
        status,
        price
      } = productInfo;
      const productInfoParams = {
        spu_id: spuSeq,
        price,
        position: itemIndex + 1,
        status: status ? 102 : 101
      };
      const params = {
        page: 108,
        module: 109,
        component: 101,
        event_name: 'AddToCart',
        ...baseParams,
        ...productInfoParams
      };
      super.collect(params);
    }
  }
  _exports.default = ProductQuickAddCart;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/product/sku-change/index.js'] = window.SLM['theme-shared/events/product/sku-change/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const EVENT_NAME = 'Product::SkuChange';
  const logger = apiLogger(EVENT_NAME);
  const external = window.Shopline && window.Shopline.event;
  const skuChange = data => {
    if (external) {
      logger.info(`[emit]`, {
        data
      });
      return external.emit(EVENT_NAME, {
        data,
        onSuccess: result => {
          logger.info('success', {
            data: {
              result
            }
          });
        },
        onError: error => {
          logger.error('error', {
            error
          });
        }
      });
    }
  };
  skuChange.apiName = EVENT_NAME;
  _exports.default = skuChange;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/product/quickView-click/index.js'] = window.SLM['theme-shared/events/product/quickView-click/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const EVENT_NAME = {
    OPEN_QUICKVIEW_EVENT: 'Product::OpenQuickView',
    CLOSE_QUICKVIEW_EVENT: 'Product::CloseQuickView',
    OPEN_QUICKVIEW_ADDTOCART: 'Product::OpenQuickView::AddToCart',
    CLOSE_QUICKVIEW_ADDTOCART: 'Product::CloseQuickView::AddToCart'
  };
  const external = window.Shopline && window.Shopline.event;
  const quickViewClick = data => {
    if (external) {
      const logger = apiLogger(EVENT_NAME[data.eventName]);
      quickViewClick.apiName = EVENT_NAME[data.eventName];
      logger.info(`[emit]`, {
        data
      });
      return external.emit(EVENT_NAME[data.eventName], {
        data,
        onSuccess: result => {
          logger.info('success', {
            data: {
              result
            }
          });
        },
        onError: error => {
          logger.error('error', {
            error
          });
        }
      });
    }
  };
  _exports.default = quickViewClick;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/product/preview-init/index.js'] = window.SLM['theme-shared/events/product/preview-init/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const EVENT_NAME = 'Product::productPreviewInit';
  const logger = apiLogger(EVENT_NAME);
  const external = window.Shopline && window.Shopline.event;
  const filterUpdateSection = data => {
    if (external) {
      logger.info(`[emit]`, {
        data
      });
      return external.emit(EVENT_NAME, {
        data,
        onSuccess: result => {
          logger.info('success', {
            data: {
              result
            }
          });
        },
        onError: error => {
          logger.error('error', {
            error
          });
        }
      });
    }
  };
  filterUpdateSection.apiName = EVENT_NAME;
  _exports.default = filterUpdateSection;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/report/pageMapping.js'] = window.SLM['theme-shared/utils/report/pageMapping.js'] || function () {
  const _exports = {};
  _exports.default = {
    Home: 'homepage',
    Products: 'product_list',
    ProductsDetail: 'pdp',
    ProductsSearch: 'product_search',
    OneShop: 'expresscheckout',
    Cart: 'cart',
    Checkout: 'order_check_out',
    Comfirm: 'transaction',
    Center: 'user_page',
    Activity: 'addon',
    Page: {
      custom_page: 124,
      smart_landing_page: 125
    }
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/components/modal/lite.js'] = window.SLM['commons/components/modal/lite.js'] || function () {
  const _exports = {};
  const lite = window['SLM']['theme-shared/components/hbs/shared/components/modal/lite.js'].default;
  _exports.default = lite;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/components/modal/full.js'] = window.SLM['commons/components/modal/full.js'] || function () {
  const _exports = {};
  const full = window['SLM']['theme-shared/components/hbs/shared/components/modal/full.js'].default;
  _exports.default = full;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/components/modal/index.js'] = window.SLM['commons/components/modal/index.js'] || function () {
  const _exports = {};
  const { default: _default } = window['SLM']['commons/components/modal/lite.js'];
  _exports.default = _default;
  const { default: ModalWithHtml } = window['SLM']['commons/components/modal/full.js'];
  _exports.ModalWithHtml = ModalWithHtml;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/components/toast/toast.js'] = window.SLM['commons/components/toast/toast.js'] || function () {
  const _exports = {};
  const toast = window['SLM']['theme-shared/components/hbs/shared/components/toast/toast.js'].default;
  _exports.default = toast;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/components/toast/loading.js'] = window.SLM['commons/components/toast/loading.js'] || function () {
  const _exports = {};
  const loading = window['SLM']['theme-shared/components/hbs/shared/components/toast/loading.js'].default;
  _exports.default = loading;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/components/toast/index.js'] = window.SLM['commons/components/toast/index.js'] || function () {
  const _exports = {};
  const { default: _default } = window['SLM']['commons/components/toast/toast.js'];
  _exports.default = _default;
  const { default: Loading } = window['SLM']['commons/components/toast/loading.js'];
  _exports.Loading = Loading;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/utils/url.js'] = window.SLM['commons/utils/url.js'] || function () {
  const _exports = {};
  const url = window['url']['default'];
  const querystring = window['querystring']['default'];
  function changeURLArg(urlStr, arg, argVal) {
    const durl = decodeURIComponent(urlStr);
    const pattern = `${arg}=([^&]*)`;
    const replaceText = `${arg}=${argVal}`;
    if (durl.match(pattern)) {
      let tmp = `/(${arg}=)([^&]*)/gi`;
      tmp = durl.replace(eval(tmp), replaceText);
      return tmp;
    }
    if (durl.match('[?]')) {
      return `${durl}&${replaceText}`;
    }
    return `${durl}?${replaceText}`;
  }
  _exports.changeURLArg = changeURLArg;
  function getUrlQuery(key) {
    if (typeof window !== 'undefined') {
      const locationHref = window.location.href;
      const {
        query: urlQuery
      } = url.parse(locationHref) || {};
      const urlQueryObj = querystring.parse(urlQuery);
      const hitUrlQuery = urlQueryObj[key];
      if (hitUrlQuery) {
        if (hitUrlQuery && hitUrlQuery.indexOf('?') !== -1) {
          window.history.replaceState({}, document.title, changeURLArg(locationHref, key, `${hitUrlQuery.replace('?', '&')}`));
          return hitUrlQuery.split('?')[0];
        }
        return hitUrlQuery;
      }
      return null;
    }
    return null;
  }
  _exports.getUrlQuery = getUrlQuery;
  function getUrlAllQuery(href) {
    const locationHref = href || window.location.href;
    const {
      query: urlQuery
    } = url.parse(locationHref) || {};
    const urlQueryObj = querystring.parse(urlQuery);
    return urlQueryObj;
  }
  _exports.getUrlAllQuery = getUrlAllQuery;
  function delParam(paramKey) {
    let {
      href
    } = window.location;
    const urlParam = window.location.search.substr(1);
    const beforeUrl = href.substr(0, href.indexOf('?'));
    let nextUrl = '';
    const arr = [];
    if (urlParam !== '') {
      const urlParamArr = urlParam.split('&');
      urlParamArr.forEach(segment => {
        const paramArr = segment.split('=');
        if (paramArr[0] !== paramKey) {
          arr.push(segment);
        }
      });
    }
    if (arr.length > 0) {
      nextUrl = `?${arr.join('&')}`;
    }
    href = beforeUrl + nextUrl;
    return href;
  }
  _exports.delParam = delParam;
  function getUrlPathId(u = window.location.href, index = -1) {
    const {
      pathname
    } = url.parse(u);
    const urlArr = pathname && pathname.replace(/^\//, '').split('/') || [];
    if (index < 0) {
      return urlArr[urlArr.length + index];
    }
    return urlArr[index];
  }
  _exports.getUrlPathId = getUrlPathId;
  function updateUrlQueryParam(urlStr, param, value) {
    const re = new RegExp(`([?&])${param}=.*?(&|$)`, 'i');
    const separator = urlStr.indexOf('?') !== -1 ? '&' : '?';
    if (urlStr.match(re)) {
      return urlStr.replace(re, `$1${param}=${value}$2`);
    }
    return `${urlStr}${separator}${param}=${value}`;
  }
  _exports.updateUrlQueryParam = updateUrlQueryParam;
  function stringifyUrl(originUrl, params, sign = '?') {
    const keys = Object.keys(params);
    if (!keys.length) return originUrl;
    return `${originUrl}${originUrl.includes(sign) ? '' : sign}${keys.map(key => {
      let value = params[key] !== null && params[key] !== undefined ? params[key] : '';
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      return `${key}=${window.encodeURIComponent(value)}`;
    }).join('&')}`;
  }
  _exports.stringifyUrl = stringifyUrl;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/utils.js'] = window.SLM['theme-shared/components/pay-button/utils.js'] || function () {
  const _exports = {};
  const { setIniiateCheckout, reportCheckout } = window['SLM']['theme-shared/utils/tradeReport/index.js'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { ButtonType } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const setInitialCheckoutData = abandonedSeq => {
    setIniiateCheckout(abandonedSeq);
    reportCheckout({});
  };
  _exports.setInitialCheckoutData = setInitialCheckoutData;
  const getExpressCheckoutDataList = paymentConfig => {
    if (paymentConfig && Array.isArray(paymentConfig.buttonTypeDataList)) {
      const buttonConfig = paymentConfig.buttonTypeDataList.find(item => item.buttonType === ButtonType.Express);
      if (buttonConfig) {
        return buttonConfig.buttonNameDataList;
      }
    }
    return [];
  };
  _exports.getExpressCheckoutDataList = getExpressCheckoutDataList;
  const emitExpressCheckoutData = (() => {
    const eventName = 'Checkout::AdditionalChargeUpdate';
    const getAdditionalChargeUpdateParams = (buttonName, dataList) => {
      let currentChannelInfo = null;
      let delayMillSeconds = 0;
      const payChannelInfo = {
        items: []
      };
      dataList.forEach(config => {
        if (!config) return;
        const {
          channelCode,
          methodCode,
          paymentId
        } = config.buttonConfigData || {};
        const channelInfo = {
          channelCode,
          methodCode,
          select: false
        };
        if (config.buttonName === buttonName) {
          currentChannelInfo = {
            channelCode,
            methodCode,
            paymentId
          };
          delayMillSeconds = config.delayMillSeconds;
          channelInfo.select = true;
        }
        payChannelInfo.items.push(channelInfo);
      });
      return [{
        ...currentChannelInfo,
        payChannelInfo
      }, delayMillSeconds];
    };
    const delayCallback = (handler, timeout, logger) => {
      if (!timeout || typeof timeout !== 'number') return handler;
      let once = true;
      const timestamp = Date.now();
      const invoke = () => {
        const spent = Date.now() - timestamp;
        logger.info(`${eventName} delay callback`, {
          data: {
            timestamp,
            timeout,
            spent,
            once,
            delay: spent > timeout
          }
        });
        if (once) {
          once = false;
          handler();
        }
      };
      const timer = setTimeout(invoke, timeout);
      return () => {
        clearTimeout(timer);
        invoke();
      };
    };
    const hasEventListeners = () => {
      const listeners = window.Shopline.event.listeners(eventName) || [];
      return listeners.length > 0;
    };
    return async ({
      buttonName,
      dataList,
      payload,
      logger
    }) => {
      const shouldEmit = hasEventListeners();
      if (!shouldEmit || !buttonName || !Array.isArray(dataList)) return;
      const [params, timeout] = getAdditionalChargeUpdateParams(buttonName, dataList);
      if (!params.channelCode) return;
      const data = {
        ...payload,
        ...params,
        buttonType: ButtonType.Express
      };
      return new Promise(resolve => {
        const cb = delayCallback(resolve, timeout, logger);
        window.Shopline.event.emit(eventName, data, cb);
      });
    };
  })();
  _exports.emitExpressCheckoutData = emitExpressCheckoutData;
  const getPaymentProps = () => {
    const pageData = SL_State.get('paymentButtonConfig') || {};
    return {
      expressOptimizationSwitch: pageData.expressOptimizationSwitch || false
    };
  };
  _exports.getPaymentProps = getPaymentProps;
  const { preProcessPaymentButtonConfig } = window['@sl/pay-button'];
  _exports.preProcessPaymentButtonConfig = preProcessPaymentButtonConfig;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/payment-button/utils.js'] = window.SLM['theme-shared/components/pay-button/payment-button/utils.js'] || function () {
  const _exports = {};
  const { preProcessPaymentButtonConfig } = window['@sl/pay-button'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { ButtonLocation } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const isStandard = () => {
    const pageData = SL_State.get('paymentButtonConfig');
    if (!pageData || !pageData.buttonLocationDataList) return true;
    if (!pageData.grayscaleButtonLocation) return false;
    return pageData.grayscaleButtonLocation.includes(ButtonLocation.ProductDetail);
  };
  _exports.isStandard = isStandard;
  const getConfig = () => {
    const pageData = preProcessPaymentButtonConfig(SL_State.get('paymentButtonConfig'));
    if (!pageData || !pageData.buttonLocationDataList) return null;
    const config = pageData.buttonLocationDataList.find(item => {
      return item.buttonLocation === ButtonLocation.ProductDetail;
    });
    if (!config) return null;
    return config;
  };
  _exports.getConfig = getConfig;
  const isSubscription = () => {
    return !!(SL_State.get('product.selling_plan_groups') || []).length;
  };
  _exports.isSubscription = isSubscription;
  const isPreview = () => {
    return SL_State.get('templateAlias') === 'PreviewProductsDetail';
  };
  _exports.isPreview = isPreview;
  const isValidateJson = str => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };
  _exports.isValidateJson = isValidateJson;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/payment-button/constants.js'] = window.SLM['theme-shared/components/pay-button/payment-button/constants.js'] || function () {
  const _exports = {};
  const { ButtonType } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const PageType = {
    ProductDetail: 'productDetail',
    Cart: 'cart',
    MiniCart: 'MiniCart',
    Checkout: 'checkout'
  };
  _exports.PageType = PageType;
  const DEFAULT_CONFIG = {
    buttonLocation: 'productDetail',
    isSystem: false,
    buttonTypeDataList: [{
      buttonType: ButtonType.Normal,
      buttonNameDataList: [{
        buttonName: 'BUY_NOW',
        buttonConfigData: null
      }]
    }]
  };
  _exports.DEFAULT_CONFIG = DEFAULT_CONFIG;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/payment-button/index.js'] = window.SLM['theme-shared/components/pay-button/payment-button/index.js'] || function () {
  const _exports = {};
  const Toast = window['SLM']['theme-shared/components/hbs/shared/components/toast/index.js'].default;
  const baseLogger = window['@yy/sl-theme-shared']['/utils/logger/sentry'].default;
  const PayButton = window['@sl/pay-button']['default'];
  const { save, checkoutHiidoReportV2 } = window['@sl/pay-button'];
  const { setInitialCheckoutData, getExpressCheckoutDataList, emitExpressCheckoutData, getPaymentProps } = window['SLM']['theme-shared/components/pay-button/utils.js'];
  const { SAVE_ERROR_TYPE, ButtonName, EPaymentUpdate } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const { getConfig, isPreview, isSubscription, isValidateJson } = window['SLM']['theme-shared/components/pay-button/payment-button/utils.js'];
  const { DEFAULT_CONFIG } = window['SLM']['theme-shared/components/pay-button/payment-button/constants.js'];
  const toast = message => Toast.init({
    content: message
  });
  const logger = baseLogger.pipeOwner('shared.payment-button');
  class PaymentButton {
    constructor(config) {
      logger.info('PaymentButton init constructor', {
        config
      });
      this.config = config;
      this.isSubscription = isSubscription();
      this.expressCheckoutDataList = null;
      let paymentConfig = getConfig();
      if (!paymentConfig) {
        paymentConfig = DEFAULT_CONFIG;
        logger.error('first load productDetailConfig data is null');
      }
      this.expressCheckoutDataList = getExpressCheckoutDataList(paymentConfig);
      const {
        products,
        props,
        ...rest
      } = config;
      const payButtonConfig = {
        ...rest,
        paymentConfig,
        saveAbandonedOrder: this.saveAbandonedOrder.bind(this),
        props: {
          ...props,
          ...getPaymentProps(),
          logger: baseLogger,
          toast,
          isSubscription: this.isSubscription,
          isPreview: isPreview()
        }
      };
      this.payButton = new PayButton(payButtonConfig);
    }
    async render() {
      await this.payButton.render();
      if (this.isSubscription) {
        this.addSubscriptionListener();
      }
    }
    async saveAbandonedOrder(buttonName) {
      const {
        products
      } = this.config;
      const restParams = {};
      const query = {};
      if (buttonName === ButtonName.PAY_PAL) {
        query.spb = true;
      }
      if (buttonName === ButtonName.SHOP_BY_FAST_CHECKOUT) {
        restParams.notSupportSubscriptionCheck = true;
      }
      const discountCodes = [];
      const tradeExtraInfoStr = sessionStorage.getItem('tradeExtraInfo');
      if (tradeExtraInfoStr) {
        const tradeExtraInfo = isValidateJson(tradeExtraInfoStr) ? JSON.parse(tradeExtraInfoStr) : {};
        const discountCode = tradeExtraInfo && tradeExtraInfo.discountCode && tradeExtraInfo.discountCode.value;
        if (discountCode) discountCodes.push(discountCode);
      }
      logger.info('save abandon order', {
        data: {
          products,
          query,
          discountCodes,
          restParams
        }
      });
      const {
        errorType,
        needLogin,
        abandonedInfo,
        url
      } = await save({
        products,
        query,
        discountCodes,
        toast,
        logger,
        ...restParams
      });
      if (errorType) {
        if (errorType === SAVE_ERROR_TYPE.SAVE_ORDER) {
          this.handleAfterSaveAbandonedOrder({
            status: false,
            buttonName
          });
        }
        return {
          canContinue: false
        };
      }
      await emitExpressCheckoutData({
        buttonName,
        dataList: this.expressCheckoutDataList,
        payload: {
          abandonedInfo
        },
        logger
      });
      this.handleAfterSaveAbandonedOrder({
        status: true,
        buttonName
      });
      if ([ButtonName.BUY_NOW, ButtonName.MORE_OPTIONS, ButtonName.PAY_PAL].includes(buttonName)) {
        setInitialCheckoutData(abandonedInfo.seq);
      }
      if (needLogin) {
        logger.info('save abandonOrder need login');
        setTimeout(() => {
          window.location.href = url;
        }, 0);
        return {
          canContinue: false
        };
      }
      return {
        canContinue: true,
        abandonedInfo,
        url
      };
    }
    handleAfterSaveAbandonedOrder(data) {
      logger.info('handleAfterSaveAbandonedOrder', {
        data
      });
      try {
        if (data.status) {
          checkoutHiidoReportV2.reportFastCheckout(data.buttonName);
        }
        this.config.afterSaveAbandonedOrder && this.config.afterSaveAbandonedOrder(data);
      } catch (error) {
        logger.warn('afterSaveAbandonedOrder error', {
          data: {
            error
          }
        });
      }
    }
    addSubscriptionListener() {
      let timer = setTimeout(async () => {
        this.payButton.setSubscription(false);
      }, 5000);
      window.Shopline.event.on(EPaymentUpdate, async ({
        isSubscription
      }) => {
        if (isSubscription === undefined) return;
        clearTimeout(timer);
        timer = null;
        this.payButton.setSubscription(isSubscription);
      });
    }
    setDisabled(value, options) {
      this.payButton.setDisabled(value, options);
    }
    setVisible(value, options) {
      this.payButton.setVisible(value, options);
    }
    customButtons(params) {
      this.payButton.customButtons(params);
    }
    getRenderedButtons() {
      return this.payButton.getRenderedButtons();
    }
  }
  _exports.default = PaymentButton;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/trade/developer-api/cart-sidebar-render/index.js'] = window.SLM['theme-shared/events/trade/developer-api/cart-sidebar-render/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const externalEvent = window['SLM']['theme-shared/events/trade/enum/index.js'];
  const logger = apiLogger(`${externalEvent.SIDEBAR_RENDER} - EMIT`);
  const external = window && window.Shopline.event;
  const sidebarRender = ({
    data,
    onSuccess,
    onError,
    ...rest
  }) => {
    logger.info('emit', {
      data
    });
    return external.emit(externalEvent.SIDEBAR_RENDER, {
      data,
      onSuccess,
      onError,
      ...rest
    });
  };
  sidebarRender.apiName = externalEvent.SIDEBAR_RENDER;
  _exports.default = sidebarRender;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/tradeReport/hdReportV2.js'] = window.SLM['theme-shared/utils/tradeReport/hdReportV2.js'] || function () {
  const _exports = {};
  const currencyUtil = window['SLM']['theme-shared/utils/newCurrency/index.js'].default;
  const { pageMapV2 } = window['SLM']['theme-shared/utils/tradeReport/const.js'];
  const reportEvent = data => {
    window.HdSdk && window.HdSdk.shopTracker.collect(data);
  };
  const setProduct = data => {
    const product_id = [];
    const variantion_id = [];
    const quantity = [];
    const price = [];
    const product_name = [];
    const isCheckoutPage = window.Shopline.uri.alias === 'Checkout';
    data && data.forEach(item => {
      const {
        productSeq,
        productSku,
        productNum,
        finalPrice,
        productPrice,
        productName
      } = item || {};
      product_id.push(productSeq);
      variantion_id.push(productSku);
      quantity.push(productNum);
      price.push(currencyUtil.formatNumber(Number(isCheckoutPage ? finalPrice : productPrice) || 0).toString());
      product_name.push(productName);
    });
    return {
      product_id: product_id.join(','),
      variantion_id: variantion_id.join(','),
      quantity: quantity.join(','),
      price: price.join(','),
      product_name: product_name.join(',')
    };
  };
  const reportCoupon = data => {
    reportEvent(data);
  };
  const reportV2Checkout = data => {
    const {
      products,
      ...ext
    } = data;
    const items = setProduct(products);
    reportEvent({
      ...ext,
      ...items
    });
  };
  const reportMiniCartView = () => {
    reportEvent({
      page: pageMapV2.MiniCart,
      module: -999,
      component: -999,
      action_type: 108
    });
  };
  _exports.setProduct = setProduct;
  _exports.reportV2Checkout = reportV2Checkout;
  _exports.reportCoupon = reportCoupon;
  _exports.reportEvent = reportEvent;
  _exports.reportMiniCartView = reportMiniCartView;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/tradeReport/eventListen.js'] = window.SLM['theme-shared/utils/tradeReport/eventListen.js'] || function () {
  const _exports = {};
  const { SL_EventBus } = window['@yy/sl-theme-shared']['/utils/event-bus'];
  const { cartPage, HdModule, HdComponent, pageMapV2, ActionType, HD_EVENT_NAME } = window['SLM']['theme-shared/utils/tradeReport/const.js'];
  const { reportV2Checkout, reportCoupon, reportEvent } = window['SLM']['theme-shared/utils/tradeReport/hdReportV2.js'];
  const {
    GO_TO_CHECKOUT,
    PAYPAL_CHECKOUT,
    COUPON_APPLY,
    COUPON_INPUT
  } = HD_EVENT_NAME;
  const getIsMiniCart = (node, ele) => {
    const dom = $(node);
    const closest = dom && dom.closest(ele || '.trade_coupon__wrapper');
    const isMiniCart = closest && closest.hasClass('sidebar');
    return isMiniCart;
  };
  const couponInput = () => {
    SL_EventBus.on(COUPON_INPUT, ({
      data
    }) => {
      const {
        node,
        ele
      } = data;
      const isMiniCart = getIsMiniCart(node, ele);
      reportCoupon({
        page: isMiniCart ? pageMapV2.MiniCart : pageMapV2.Cart,
        module: HdModule.couponCode,
        component: HdComponent.couponCodeInput,
        action_type: ActionType.input
      });
    });
  };
  const couponApply = () => {
    SL_EventBus.on(COUPON_APPLY, ({
      data
    }) => {
      const {
        discountCode,
        node,
        ele
      } = data;
      const isMiniCart = getIsMiniCart(node, ele);
      reportCoupon({
        page: isMiniCart ? pageMapV2.MiniCart : pageMapV2.Cart,
        module: HdModule.couponCode,
        component: HdComponent.couponCodeUse,
        action_type: ActionType.click,
        coupon_code: discountCode
      });
    });
  };
  const reportBuyNow = () => {
    SL_EventBus.on(GO_TO_CHECKOUT, ({
      data
    }) => {
      const {
        isCart,
        stage,
        products
      } = data;
      if (isCart) {
        const page = pageMapV2[stage];
        if (page) {
          reportV2Checkout({
            page: pageMapV2[stage],
            module: HdModule.checkout,
            component: HdComponent.checkout,
            action_type: ActionType.click,
            products
          });
        }
      }
    });
  };
  const quickPayment = () => {
    SL_EventBus.on(PAYPAL_CHECKOUT, ({
      data
    }) => {
      const {
        product,
        stage
      } = data;
      if (cartPage[stage]) {
        const page = pageMapV2[stage];
        if (page) {
          reportV2Checkout({
            page: pageMapV2[stage],
            module: HdModule.checkout,
            component: HdComponent.paypalBtn,
            action_type: ActionType.click,
            products: product
          });
        }
      }
    });
  };
  const clickCarContinue = key => {
    const dom = document.querySelector(key);
    dom && dom.addEventListener('click', () => {
      const isCartPage = window.Shopline.uri.alias === 'Cart';
      if (isCartPage) {
        reportEvent({
          page: pageMapV2.Cart,
          module: HdModule.normal,
          component: HdComponent.continueShopping,
          action_type: ActionType.click
        });
      }
    });
  };
  const listenCartReport = () => {
    reportBuyNow();
    quickPayment();
    couponInput();
    couponApply();
    clickCarContinue('.trade-cart-non-empty-continue-btn');
  };
  _exports.listenCartReport = listenCartReport;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/shared/components/topDrawer/const.js'] = window.SLM['theme-shared/components/hbs/shared/components/topDrawer/const.js'] || function () {
  const _exports = {};
  const DRAWER_EVENT_NAME = 'stage:topDrawer';
  _exports.DRAWER_EVENT_NAME = DRAWER_EVENT_NAME;
  const DRAWER_CALLBACK_EVENT_NAME = 'stage:topDrawer:callback';
  _exports.DRAWER_CALLBACK_EVENT_NAME = DRAWER_CALLBACK_EVENT_NAME;
  const DRAWER_OPERATORS = {
    OPEN: 'open',
    CLOSE: 'close'
  };
  _exports.DRAWER_OPERATORS = DRAWER_OPERATORS;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/shared/components/drawer/const.js'] = window.SLM['theme-shared/components/hbs/shared/components/drawer/const.js'] || function () {
  const _exports = {};
  const DRAWER_EVENT_NAME = 'stage:drawer';
  _exports.DRAWER_EVENT_NAME = DRAWER_EVENT_NAME;
  const DRAWER_CALLBACK_EVENT_NAME = 'stage:drawer:callback';
  _exports.DRAWER_CALLBACK_EVENT_NAME = DRAWER_CALLBACK_EVENT_NAME;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/logger/index.js'] = window.SLM['commons/logger/index.js'] || function () {
  const _exports = {};
  const logger = window['@yy/sl-theme-shared']['/utils/logger/sentry'].default;
  const { ErrorLevel, Status } = window['@yy/sl-theme-shared']['/utils/logger/sentry'];
  const newLogger = logger.pipeOwner('trade');
  _exports.ErrorLevel = ErrorLevel;
  _exports.Status = Status;
  _exports.default = newLogger;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/utils/isMobile.js'] = window.SLM['commons/utils/isMobile.js'] || function () {
  const _exports = {};
  let d = $('i[data-platform]');
  if (!d.get(0)) {
    d = $(`<i data-platform></i>`);
    $(document.body).append(d);
  }
  function isMobile() {
    let dom = $('i[data-platform]');
    if (!dom.get(0)) {
      dom = $(`<i data-platform></i>`);
      $(document.body).append(dom);
    }
    return dom.css('display') === 'block';
  }
  _exports.default = isMobile;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/utils/throttle.js'] = window.SLM['commons/utils/throttle.js'] || function () {
  const _exports = {};
  _exports.default = function (limit, callback) {
    let waiting = false;
    return function (...args) {
      if (!waiting) {
        callback.apply(this, args);
        waiting = true;
        setTimeout(function () {
          waiting = false;
        }, limit);
      }
    };
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/utils/main.js'] = window.SLM['commons/utils/main.js'] || function () {
  const _exports = {};
  const isPlainObject = window['lodash']['isPlainObject'];
  const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';
  function getStorage(storageName) {
    return {
      get(key) {
        if (!isBrowser) {
          return;
        }
        const storage = window[storageName];
        const numRe = /^\d+$/;
        const jsonRe = /(^\{.*\}$)|(^\[.*\]$)/;
        const boolRe = /^(true|false|null)$/;
        let val = storage.getItem(key);
        try {
          if (typeof val === 'string' && val && (numRe.test(val) || boolRe.test(val) || jsonRe.test(val))) {
            val = JSON.parse(val);
          }
        } catch (e) {
          console.warn('json.parse storage value err:', e);
          val = {};
        }
        return val;
      },
      set(key, val) {
        if (!isBrowser) {
          return;
        }
        let value = val;
        if (isPlainObject(value) || value instanceof Array) {
          value = JSON.stringify(value);
        }
        const storage = window[storageName];
        storage[key] = value;
      },
      del(key) {
        if (!isBrowser) {
          return;
        }
        const storage = window[storageName];
        storage.removeItem(key);
      }
    };
  }
  const [sessionStorage, localStorage] = ['sessionStorage', 'localStorage'].map(getStorage);
  const utils = {
    sessionStorage,
    localStorage
  };
  _exports.default = utils;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/utils/helper.js'] = window.SLM['commons/utils/helper.js'] || function () {
  const _exports = {};
  const { SL_EventBus } = window['@yy/sl-theme-shared']['/utils/event-bus'];
  const mainUtils = window['SLM']['commons/utils/main.js'].default;
  const platformType = {
    pc: 'pc',
    pad: 'pad',
    mobile: 'mobile'
  };
  const getPlatform = () => {
    const winWidth = Math.min(window.innerWidth, document.documentElement.clientWidth, document.body.clientWidth);
    let platform;
    if (winWidth > 960) {
      platform = 'pc';
    } else if (winWidth > 750) {
      platform = 'pad';
    } else {
      platform = 'mobile';
    }
    return platform;
  };
  function listenPlatform(callback) {
    SL_EventBus.on('global:platformChange', callback);
  }
  function init() {
    window.addEventListener('load', () => {
      let platform = getPlatform();
      window.addEventListener('resize', () => {
        const newPlatform = getPlatform();
        if (newPlatform !== platform) {
          SL_EventBus.emit('global:platformChange', newPlatform);
          platform = newPlatform;
        }
      });
    });
  }
  function isInViewport(el) {
    if (!el || !el.tagName) return console.warn(`${el} is not a element`);
    const rect = el.getBoundingClientRect();
    const vWidth = document.documentElement.clientWidth;
    const vHeight = document.documentElement.clientHeight;
    if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight) {
      return false;
    }
    return true;
  }
  function isUnderViewport(el) {
    if (!el || !el.tagName) return console.warn(`${el} is not a element`);
    const rect = el.getBoundingClientRect();
    const vWidth = document.documentElement.clientWidth;
    const vHeight = document.documentElement.clientHeight;
    if (rect.right < 0 || rect.left > vWidth || rect.top > vHeight) {
      return false;
    }
    return true;
  }
  init();
  function getAbOrderSeqInfoCache(buyScence = 'cart') {
    const seqInfo = mainUtils.localStorage.get(`${buyScence}AbOrderSeqInfo`);
    return seqInfo;
  }
  function setAbOrderSeqInfoCache(abandonedOrderSeqInfo, buyScence) {
    if (!buyScence) {
      console.warn('setAbOrderSeqInfoCache err miss buyScence');
      return;
    }
    mainUtils.localStorage.set(`${buyScence}AbOrderSeqInfo`, abandonedOrderSeqInfo);
  }
  _exports.default = {
    getPlatform,
    listenPlatform,
    platformType,
    getAbOrderSeqInfoCache,
    setAbOrderSeqInfoCache,
    isInViewport,
    isUnderViewport
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/utils/index.js'] = window.SLM['commons/utils/index.js'] || function () {
  const _exports = {};
  const helper = window['SLM']['commons/utils/helper.js'].default;
  const main = window['SLM']['commons/utils/main.js'].default;
  _exports.default = {
    ...main,
    helper
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/biz/sticky-cart/helper.js'] = window.SLM['cart/script/biz/sticky-cart/helper.js'] || function () {
  const _exports = {};
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const utils = window['SLM']['commons/utils/index.js'].default;
  const setStickyContAnimate = ({
    viewportSelector,
    containerSelector
  }) => {
    const inInput = SL_State.get('cartInInputMode');
    if (!utils.helper.isUnderViewport($(viewportSelector).get(0)) && !inInput) {
      $(containerSelector).slideDown(300).attr('isOpen', true);
    } else {
      $(containerSelector).slideUp(200).removeAttr('isOpen');
    }
  };
  _exports.setStickyContAnimate = setStickyContAnimate;
  const setStickyContainerHeight = selector => {
    if (!$(selector).length || $(selector).prop('hadSet') === true) return;
    const height = $(selector).innerHeight();
    if (height) {
      $(selector).height(height).prop('hadSet', true);
    }
  };
  _exports.setStickyContainerHeight = setStickyContainerHeight;
  const setFixedContentStyle = (contentSelector, height) => {
    const contentEl = $(contentSelector);
    if (!contentEl.length || contentEl.prop('hadSet')) return;
    if (contentEl) {
      contentEl.css('paddingBottom', height).prop('hadSet', true);
    }
  };
  _exports.setFixedContentStyle = setFixedContentStyle;
  const listenElementMutation = (target, callback, options = {
    childList: true
  }) => {
    const fixedObserver = new MutationObserver(callback);
    fixedObserver.observe(target, options);
    return fixedObserver;
  };
  _exports.listenElementMutation = listenElementMutation;
  const listenElementIntersection = (target, callback) => {
    const intersectionObserver = new IntersectionObserver(function (entries) {
      callback(entries[0].intersectionRatio > 0);
    });
    intersectionObserver.observe(target);
    return intersectionObserver;
  };
  _exports.listenElementIntersection = listenElementIntersection;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/report/cartReport.js'] = window.SLM['cart/script/report/cartReport.js'] || function () {
  const _exports = {};
  const Cookie = window['js-cookie']['default'];
  const { TradeReport } = window['SLM']['theme-shared/utils/tradeReport/index.js'];
  const { ClickType } = window['SLM']['theme-shared/utils/report/const.js'];
  const currencyUtil = window['SLM']['theme-shared/utils/newCurrency/index.js'].default;
  const { Owner, Action } = window['@yy/sl-theme-shared']['/utils/logger/sentryReport'];
  const { convertPrice } = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'];
  const LoggerService = window['SLM']['commons/logger/index.js'].default;
  const { Status: LoggerStatus } = window['SLM']['commons/logger/index.js'];
  const logger = LoggerService.pipeOwner(`${Owner.Cart} report/cartReport.js`);
  const cartToken = Cookie.get('t_cart');
  class CartReport extends TradeReport {
    setRemoveItemParams(params, extraItems) {
      logger.info(`normal 主站购物车 数据上报 设置移除商品 params setRemoveItemParams`, {
        data: {
          cartToken,
          params,
          extraItems
        },
        action: Action.EditCart,
        status: LoggerStatus.Start
      });
      const res = {
        productItems: [],
        value: 0
      };
      if (Array.isArray(params)) {
        params.forEach(({
          skuId,
          num,
          price,
          name,
          skuAttr,
          itemNo,
          customCategoryName
        }) => {
          res.value += currencyUtil.unformatCurrency(convertPrice(price)) * num;
          res.productItems.push({
            skuId: itemNo || skuId,
            quantity: num,
            price: convertPrice(price || 0).toString(),
            name,
            variant: (skuAttr || []).join(','),
            customCategoryName
          });
        });
      } else {
        const product = {
          skuId: (params && params.itemNo ? params.itemNo : undefined) || (params && params.skuId ? params.skuId : undefined),
          quantity: params && params.num ? params.num : undefined,
          price: convertPrice(params.price || 0).toString(),
          name: params && params.name ? params.name : undefined,
          variant: (params && params.skuAttr ? params.skuAttr : []).join(','),
          customCategoryName: params && params.customCategoryName ? params.customCategoryName : ''
        };
        res.value += currencyUtil.unformatCurrency(convertPrice(params.price)) * (params && params.num ? params.num : 0);
        res.productItems.push(product);
      }
      if (Array.isArray(extraItems)) {
        extraItems.forEach(({
          skuId,
          num,
          price,
          name,
          skuAttr,
          itemNo,
          customCategoryName
        }) => {
          res.value += currencyUtil.unformatCurrency(convertPrice(price)) * num;
          res.productItems.push({
            skuId: itemNo || skuId,
            quantity: num,
            price: convertPrice(price || 0).toString(),
            name,
            variant: (skuAttr || []).join(','),
            customCategoryName
          });
        });
      }
      res.value = currencyUtil.formatCurrency(res.value || 0).toString();
      logger.info(`normal 主站购物车 数据上报 设置移除商品 params setRemoveItemParams`, {
        data: {
          cartToken,
          params,
          extraItems,
          integratedParams: res
        },
        action: Action.EditCart,
        status: LoggerStatus.Success
      });
      return res;
    }
    selectContent({
      skuId,
      name,
      price,
      skuAttrs,
      itemNo,
      ...rest
    }) {
      const value = {
        ...rest,
        skuId: itemNo || skuId,
        name,
        price: convertPrice(price || 0).toString(),
        variant: skuAttrs,
        itemNo
      };
      const data = {
        actionType: ClickType.SelectContent,
        value
      };
      logger.info(`normal 主站购物车 数据上报 选中商品 selectContent`, {
        data: {
          cartToken,
          integratedParams: data
        },
        action: Action.EditCart,
        status: LoggerStatus.Start
      });
      this.touch(data);
    }
    removeItem(params, extraItems) {
      try {
        const data = {
          actionType: ClickType.RemoveFromCart,
          value: this.setRemoveItemParams(params, extraItems)
        };
        logger.info(`normal 主站购物车 数据上报 移除商品 removeItem`, {
          data: {
            cartToken,
            params,
            extraItems,
            integratedParams: data
          },
          action: Action.EditCart,
          status: LoggerStatus.Start
        });
        this.touch(data);
      } catch (e) {
        logger.error(`normal 主站购物车 数据上报 移除商品 上报报错 removeItem`, {
          data: {
            cartToken,
            params,
            extraItems
          },
          error: e,
          action: Action.EditCart,
          errorLevel: 'P0'
        });
      }
    }
    viewCart(cartInfo) {
      logger.info(`mini 主站购物车 数据上报 viewCart`, {
        data: {
          cartToken,
          cartInfo
        },
        action: Action.InitCart,
        status: LoggerStatus.Start
      });
      if (!cartInfo.activeItems) {
        return;
      }
      const params = {
        amount: convertPrice(cartInfo.realAmount || 0),
        items: []
      };
      const {
        activeItems
      } = cartInfo;
      activeItems.map(activeItem => {
        params.items = [...params.items, ...activeItem.itemList.map(item => {
          return {
            ...item,
            price: currencyUtil.unformatCurrency(convertPrice(item.price)).toString()
          };
        })];
        return activeItem;
      });
      logger.info(`mini 主站购物车 数据上报 viewCart`, {
        data: {
          cartToken,
          reportInfo: {
            ...params,
            actionType: ClickType.ViewCart
          }
        },
        action: Action.InitCart,
        status: LoggerStatus.Start
      });
      try {
        this.reportViewCart({
          params,
          actionType: ClickType.ViewCart
        });
      } catch (error) {
        logger.error(`mini 主站购物车 数据上报 viewCart 失败`, {
          data: {
            cartToken,
            reportInfo: {
              ...params,
              actionType: ClickType.ViewCart
            }
          },
          error,
          action: Action.ReportCart,
          status: LoggerStatus.Failure
        });
      }
    }
  }
  const cartReport = new CartReport();
  _exports.default = cartReport;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/biz/sticky-cart/index.js'] = window.SLM['cart/script/biz/sticky-cart/index.js'] || function () {
  const _exports = {};
  const Cookie = window['js-cookie']['default'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { Owner, Action } = window['@yy/sl-theme-shared']['/utils/logger/sentryReport'];
  const LoggerService = window['SLM']['commons/logger/index.js'].default;
  const { Status: LoggerStatus } = window['SLM']['commons/logger/index.js'];
  const isMobile = window['SLM']['commons/utils/isMobile.js'].default;
  const throttle = window['SLM']['commons/utils/throttle.js'].default;
  const { setFixedContentStyle, setStickyContAnimate, listenElementMutation, listenElementIntersection } = window['SLM']['cart/script/biz/sticky-cart/helper.js'];
  const cartReport = window['SLM']['cart/script/report/cartReport.js'].default;
  const logger = LoggerService.pipeOwner(`${Owner.Cart} biz/sticky-cart/index.js`);
  const cartToken = Cookie.get('t_cart');
  const initMainCartSticky = () => {
    if (isMobile()) {
      logger.info(`main 主站购物车 initMainCartSticky`, {
        data: {
          cartToken
        },
        action: Action.InitCart,
        status: LoggerStatus.Success
      });
      $(window).on('scroll', throttle(20, () => {
        setStickyContAnimate({
          viewportSelector: '.trade_cart .main_cart',
          containerSelector: '.cart__stick_container'
        });
      }));
      listenElementMutation($('.trade-cart-sku-list').get(0), () => {
        setTimeout(() => {
          setStickyContAnimate({
            viewportSelector: '.trade_cart .main_cart',
            containerSelector: '.cart__stick_container'
          });
        }, 300);
      });
      setTimeout(() => {
        setStickyContAnimate({
          viewportSelector: '.trade_cart .main_cart',
          containerSelector: '.cart__stick_container'
        });
      }, 300);
    }
  };
  _exports.initMainCartSticky = initMainCartSticky;
  let intersectionObserver;
  const handleHeaderVisibleToggle = isVisible => {
    if (!isVisible) {
      $('.mini-cart__drawer-slot').css('position', 'fixed').css('top', 0);
    } else {
      $('.mini-cart__drawer-slot').css('position', 'absolute').css('top', '');
    }
  };
  const listenHeaderIntersection = () => {
    const isHeaderSticky = $('#stage-header').attr('data-sticky');
    if (isHeaderSticky !== 'true') {
      intersectionObserver = listenElementIntersection($('.header__main').get(0), handleHeaderVisibleToggle);
    }
  };
  const listenEditorSectionChange = () => {
    $(document).on('shopline:section:load', () => {
      intersectionObserver && intersectionObserver.disconnect && intersectionObserver.disconnect();
      listenHeaderIntersection();
    });
  };
  const listenHeaderSectionChange = () => {
    setTimeout(() => {
      listenHeaderIntersection();
      listenEditorSectionChange();
    }, 0);
  };
  _exports.listenHeaderSectionChange = listenHeaderSectionChange;
  const initMiniCartSticky = () => {
    logger.info(`mini 主站购物车 initMiniCartSticky`, {
      data: {
        cartToken
      },
      action: Action.InitCart,
      status: LoggerStatus.Success
    });
    (() => {
      const height = $('.mini-cart__drawer-slot').position().top || 0;
      const positionTop = $('.header-sticky-wrapper').position().top || 0;
      const vh = document.documentElement.clientHeight;
      const mh = vh - height - positionTop;
      $('#cart-select .trade_cart_not_empty_wrapper').css('max-height', `${mh}px`);
    })();
  };
  _exports.initMiniCartSticky = initMiniCartSticky;
  const initMiniStyleWhenOpen = () => {
    logger.info(`mini 主站购物车 初始化 initMiniStyleWhenOpen`, {
      data: {
        cartToken
      },
      action: Action.InitCart,
      status: LoggerStatus.Success
    });
    setFixedContentStyle('#cart-drawer .trade_cart_not_empty_wrapper', $('#cart-drawer .miniCart__stick_container_fixed').outerHeight() + 20);
    const headerHeight = $('#cart-drawer .drawer__header--fixed').css('height');
    $('#cart-drawer .trade_mini_cart').css('--drawer-header-height', headerHeight);
    const cartInfo = SL_State.get('cartInfo');
    logger.info(`mini 主站购物车 数据上报 initMiniStyleWhenOpen`, {
      data: {
        cartToken,
        cartInfo
      },
      action: Action.InitCart,
      status: LoggerStatus.Start
    });
    cartReport.viewCart(cartInfo);
  };
  _exports.initMiniStyleWhenOpen = initMiniStyleWhenOpen;
  const toggleVisibility = (cartType, visibility) => {
    logger.info(`normal 主站购物车 切换展示 toggleVisibility`, {
      data: {
        cartToken
      },
      action: Action.openCart,
      status: LoggerStatus.Start
    });
    if (!isMobile()) return;
    const selector = cartType === 'main' ? '.cart__stick_container' : '.miniCart__stick_container';
    const isOpen = $(selector).attr('isOpen');
    if (!isOpen) return;
    const visible = typeof visibility === 'boolean' ? visibility : $(selector).css('display') !== 'block';
    $(selector)[visible ? 'show' : 'hide']();
    logger.info(`normal 主站购物车 切换展示 toggleVisibility`, {
      data: {
        cartToken,
        visible: visible ? 'show' : 'hide'
      },
      action: Action.openCart,
      status: LoggerStatus.Success
    });
  };
  _exports.toggleVisibility = toggleVisibility;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/adapter/svc/internal/config.js'] = window.SLM['cart/script/domain/adapter/svc/internal/config.js'] || function () {
  const _exports = {};
  const presetConfig = {
    ai: null,
    t(key) {
      return key;
    },
    lang: 'zh-hans-cn'
  };
  function getLangConfig(config) {
    return config && config.lang ? config.lang : presetConfig.lang;
  }
  function getRequest(config) {
    return config.ai;
  }
  _exports.default = {
    getLangConfig,
    getRequest
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/adapter/svc/internal/transport.js'] = window.SLM['cart/script/domain/adapter/svc/internal/transport.js'] || function () {
  const _exports = {};
  function catchBizErr(fn) {
    return async function (...args) {
      try {
        return await fn(...args);
      } catch (e) {
        if (Reflect.has(e, 'code') && Reflect.has(e, 'success')) {
          return e;
        }
        throw e;
      }
    };
  }
  const requestMethodsList = ['get', 'post', 'put', 'delete', 'head', 'options', 'patch'];
  function wrapAxios(axiosInstance) {
    const wrapped = catchBizErr(axiosInstance);
    requestMethodsList.forEach(method => {
      wrapped[method] = catchBizErr(axiosInstance[method].bind(axiosInstance));
    });
    return wrapped;
  }
  function newTransport(axiosInstance) {
    if (!axiosInstance) {
      throw new Error('failed to new transport without AxiosInstance');
    }
    return Object.freeze({
      request: wrapAxios(axiosInstance)
    });
  }
  _exports.default = {
    newTransport
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/adapter/svc/index.js'] = window.SLM['cart/script/domain/adapter/svc/index.js'] || function () {
  const _exports = {};
  const config = window['SLM']['cart/script/domain/adapter/svc/internal/config.js'].default;
  const transport = window['SLM']['cart/script/domain/adapter/svc/internal/transport.js'].default;
  class Svc {
    constructor(svcConfig) {
      this._config = svcConfig;
      this._transport = transport.newTransport(config.getRequest(svcConfig));
    }
    get transport() {
      return this._transport;
    }
    get lang() {
      return config.getLangConfig(this._config);
    }
    get request() {
      return this.transport.request;
    }
  }
  let globalSvc;
  function withSvc(svcConfig) {
    globalSvc = new Svc(svcConfig);
  }
  function takeSvc() {
    return globalSvc;
  }
  _exports.default = {
    withSvc,
    takeSvc
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/adapter/storage/constant.js'] = window.SLM['cart/script/domain/adapter/storage/constant.js'] || function () {
  const _exports = {};
  const KEY_PREFIX = 'sl.trade.cart';
  _exports.default = {
    KEY_PREFIX,
    KEY_CART_ABANDON_INFO: 'cartAbOrderSeqInfo'
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/adapter/storage/index.js'] = window.SLM['cart/script/domain/adapter/storage/index.js'] || function () {
  const _exports = {};
  const constant = window['SLM']['cart/script/domain/adapter/storage/constant.js'].default;
  class Storage {
    constructor(config) {
      this.prefix = constant.KEY_PREFIX;
      this.config = config;
    }
    setItem(key, value) {
      if (value == null) {
        localStorage.removeItem(this.withKey(key));
      } else {
        localStorage.setItem(this.withKey(key), value);
      }
    }
    getItem(key) {
      return localStorage.getItem(this.withKey(key));
    }
    withKey(key) {
      return `${this.prefix}.${key}`;
    }
  }
  let globalStorage = new Storage();
  function withStorage(config) {
    globalStorage = new Storage(config);
  }
  function takeStorage() {
    return globalStorage;
  }
  _exports.default = {
    withStorage,
    takeStorage
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/utils/event-bus/index.js'] = window.SLM['cart/script/utils/event-bus/index.js'] || function () {
  const _exports = {};
  const createLogger = window['SLM']['theme-shared/utils/createLogger.js'].default;
  const { SL_EventBus } = window['@yy/sl-theme-shared']['/utils/event-bus'];
  const emitLogger = createLogger('emit');
  const emitter = SL_EventBus;
  const oriEmit = emitter.emit;
  emitter.emit = function emit(event, data) {
    emitLogger.log(event, data);
    oriEmit.apply(emitter, arguments);
  };
  _exports.default = emitter;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/adapter/svc/internal/constant.js'] = window.SLM['cart/script/domain/adapter/svc/internal/constant.js'] || function () {
  const _exports = {};
  _exports.default = {
    endpointCart: '/carts/cart',
    endpointCartVerifyV2: '/carts/cart/check-v2',
    endpointCartItemNumReduce: '/carts/cart/items_num_reduce',
    endpointVoucher: '/carts/cart/shopping_money',
    memberPoint: '/carts/cart/member-point',
    endpointOrderSaveAbandonOrder: '/trade/center/order/abandoned/save'
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/adapter/svc/cart.js'] = window.SLM['cart/script/domain/adapter/svc/cart.js'] || function () {
  const _exports = {};
  const constant = window['SLM']['cart/script/domain/adapter/svc/internal/constant.js'].default;
  async function getCart(svc, abandonedOrderMark, abandonedOrderSeq) {
    return svc.request.get(constant.endpointCart, {
      params: {
        abandonedOrderMark,
        abandonedOrderSeq
      }
    });
  }
  async function deleteCartItemList(svc, skuList) {
    return svc.request.post(constant.endpointCartItemNumReduce, skuList || []);
  }
  async function putCartItem(svc, skuInfo) {
    return svc.request.put(constant.endpointCart, skuInfo);
  }
  async function addCartItem(svc, {
    spuId,
    skuId,
    num,
    orderFrom,
    dataReportReq,
    sellingPlanId
  }) {
    return svc.request.post(constant.endpointCart, {
      orderFrom,
      item: {
        spuId,
        skuId,
        num,
        sellingPlanId
      },
      dataReportReq
    });
  }
  async function verifyCartItemListV2(svc, {
    itemList,
    orderFrom
  }) {
    return svc.request.post(constant.endpointCartVerifyV2, {
      cartItemList: itemList || [],
      orderFrom
    });
  }
  async function memberPoint(svc, use) {
    return svc.request.get(constant.memberPoint, {
      params: {
        use
      }
    });
  }
  _exports.default = {
    getCart,
    deleteCartItemList,
    verifyCartItemListV2,
    putCartItem,
    addCartItem,
    memberPoint
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/adapter/svc/voucher.js'] = window.SLM['cart/script/domain/adapter/svc/voucher.js'] || function () {
  const _exports = {};
  const constant = window['SLM']['cart/script/domain/adapter/svc/internal/constant.js'].default;
  async function toggleVoucher(svc, used) {
    return svc.request.get(constant.endpointVoucher, {
      params: {
        selected: used
      }
    });
  }
  _exports.default = {
    toggleVoucher
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/adapter/svc/coupon.js'] = window.SLM['cart/script/domain/adapter/svc/coupon.js'] || function () {
  const _exports = {};
  const { servicesList } = window['@sl/cart']['/lib/config/reductionCode/service'];
  async function applyCoupon(svc, params) {
    return svc.request.post(servicesList.ONLINE_CART.endpointPromotionCode, {
      ...params
    });
  }
  async function withdrawCoupon(svc, req) {
    return svc.request.delete(servicesList.ONLINE_CART.endpointPromotionCodeDel, {
      data: req
    });
  }
  _exports.default = {
    applyCoupon,
    withdrawCoupon
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/model/helpers.js'] = window.SLM['cart/script/domain/model/helpers.js'] || function () {
  const _exports = {};
  function reducer(source) {
    function reduce(ctx) {
      const cal = () => {
        return ctx;
      };
      cal.next = (extractor, ...args) => {
        if (!extractor) {
          return reduce(ctx);
        }
        return reduce(extractor(ctx, ...args));
      };
      return cal;
    }
    return reduce(source);
  }
  function memo() {
    let deps;
    let result;
    return function memorized(getter, ...args) {
      if (deps == null || !compare(deps, args)) {
        result = getter(...args);
        deps = args;
      }
      return result;
    };
  }
  function merge(source, target) {
    if (!source) source = {};
    if (!target) return source;
    return {
      ...source,
      ...target
    };
  }
  _exports.default = {
    reducer,
    memo,
    merge
  };
  function compare(v1, v2) {
    if (v1 === v2) return true;
    if (v1 == null || v2 == null) return false;
    const t1 = typeof v1;
    const t2 = typeof v2;
    if (t1 !== t2) return false;
    if (t1 === 'function') return false;
    if (Array.isArray(v1) && Array.isArray(v2)) {
      const l1 = v1.length;
      const l2 = v2.length;
      if (l1 !== l2) return false;
      let i = 0;
      for (; i < l1; ++i) {
        const i1 = v1[i];
        const i2 = v2[i];
        if (!compare(i1, i2)) return false;
      }
      return i === l2;
    }
    return false;
  }
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/adapter/svc/order.js'] = window.SLM['cart/script/domain/adapter/svc/order.js'] || function () {
  const _exports = {};
  const constant = window['SLM']['cart/script/domain/adapter/svc/internal/constant.js'].default;
  const modelHelper = window['SLM']['cart/script/domain/model/helpers.js'].default;
  async function saveAbandonOrder(svc, config) {
    return svc.request.post(constant.endpointOrderSaveAbandonOrder, {
      associateCart: true,
      abandonedOrderSeqInfo: config.abandonedOrderSeqInfo || null,
      discountCodes: config.discountCode || null,
      products: config.products || []
    });
  }
  function withAbandonOrderInfo(config, seq, mark) {
    if (!seq) return config;
    return modelHelper.merge(config, {
      abandonedOrderSeqInfo: {
        seq,
        mark
      }
    });
  }
  function withAbandonOrderDiscountCode(config, discountCode) {
    if (!discountCode) return config;
    return modelHelper.merge(config, {
      discountCode
    });
  }
  function withAbandonOrderProductList(config, productList) {
    if (!productList) return config;
    return modelHelper.merge(config, {
      products: productList
    });
  }
  _exports.default = {
    saveAbandonOrder,
    withAbandonOrderInfo,
    withAbandonOrderDiscountCode,
    withAbandonOrderProductList
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/constant/responseCode.js'] = window.SLM['cart/script/constant/responseCode.js'] || function () {
  const _exports = {};
  _exports.default = {
    SUCCESS: 'SUCCESS',
    FA_INVALID_PARAMS: 'FA_INVALID_PARAMS',
    FA_COUPON_INVALID_CODE: 'FA_COUPON_INVALID_CODE',
    FA_PRODUCT_VALIDATE: 'FA_PRODUCT_VALIDATE',
    FA_PRODUCT_CHANGED: 'FA_PRODUCT_CHANGED',
    FA_PRODUCT_OVERFLOW: 'FA_PRODUCT_OVERFLOW',
    FA_PRODUCT_ACTIVE_EMPTY: 'FA_PRODUCT_ACTIVE_EMPTY',
    FA_PRODUCT_SOLD_OUT: 'FA_PRODUCT_SOLD_OUT',
    FA_PRODUCT_QUANTITY: 'FA_PRODUCT_QUANTITY',
    FA_CHECKOUT_CANCELED: 'FA_CHECKOUT_CANCELED'
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/constant/cartQuantity.js'] = window.SLM['cart/script/constant/cartQuantity.js'] || function () {
  const _exports = {};
  _exports.default = {
    MAX_CART_ITEM_LIST_QUANTITY: 99,
    MAX_CART_ITEM_QUANTITY: 999
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/model/cart.js'] = window.SLM['cart/script/domain/model/cart.js'] || function () {
  const _exports = {};
  const CartQuantityConst = window['SLM']['cart/script/constant/cartQuantity.js'].default;
  function getActiveCartItemList(model) {
    const activeItems = model.activeItems || [];
    return activeItems.reduce((list, item) => {
      return list.concat(item.itemList || []);
    }, []);
  }
  function getInactiveCartItemList(model) {
    return model.inactiveItems || [];
  }
  function getCartItemList(model) {
    return [...getActiveCartItemList(model), ...getInactiveCartItemList(model)];
  }
  function getActiveCartItemListQuantity(model) {
    return getActiveCartItemList(model).length;
  }
  function getInactiveCartItemListQuantity(model) {
    return getInactiveCartItemList(model).length;
  }
  function getCartItemListQuantity(model) {
    return getActiveCartItemListQuantity(model) + getInactiveCartItemListQuantity(model);
  }
  function isCartItemListQuantityOverflow(model) {
    return getCartItemListQuantity(model) > CartQuantityConst.MAX_CART_ITEM_LIST_QUANTITY;
  }
  function isActiveCartItemListQuantityOverflow(model) {
    return getActiveCartItemListQuantity(model) > CartQuantityConst.MAX_CART_ITEM_LIST_QUANTITY;
  }
  function getSkuQuantity(model) {
    if (!model) return 0;
    return model.count || 0;
  }
  function getPromotionInfo(model) {
    return model && model.promotionCodes ? model.promotionCodes : undefined;
  }
  function getVoucherInfo(model) {
    return model && model.shoppingMoneyDTO ? model.shoppingMoneyDTO : undefined;
  }
  _exports.default = {
    getActiveCartItemList,
    getInactiveCartItemList,
    getCartItemList,
    getActiveCartItemListQuantity,
    getInactiveCartItemListQuantity,
    getCartItemListQuantity,
    isCartItemListQuantityOverflow,
    isActiveCartItemListQuantityOverflow,
    getSkuQuantity,
    getPromotionInfo,
    getVoucherInfo
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/constant/stockType.js'] = window.SLM['cart/script/constant/stockType.js'] || function () {
  const _exports = {};
  _exports.default = {
    LIMITED: 0,
    UNLIMITED: 1,
    OVERSOLD: 2
  };
  const limitedActiveEnum = {
    LIMITED_ACTIVE_OVER: 1,
    LIMITED_ACTIVE_SKU_OVER: 2
  };
  _exports.limitedActiveEnum = limitedActiveEnum;
  const cartLimitedEnum = {
    NORMAL_ITEM_MAX_NUM: ['ITEM_MAX_NUM'],
    ACTIVE_LIMITED: ['LIMITED_ACTIVE_OVER', 'LIMITED_ACTIVE_SKU_OVER'],
    NORMAL_STOCK_OVER: ['STOCK_OVER'],
    ACTIVE_STOCK_OVER: ['LIMITED_ACTIVE_STOCK_OVER'],
    ACTIVE: ['LIMITED_ACTIVE_OVER', 'LIMITED_ACTIVE_SKU_OVER', 'LIMITED_ACTIVE_STOCK_OVER'],
    NORMAL: ['ITEM_MAX_NUM', 'STOCK_OVER'],
    B2B_PURCHASE: ['PURCHASE_LESS_MOQ', 'PURCHASE_MAX_MOQ', 'PURCHASE_NOT_MATCH_INCREMENT'],
    PURCHASE_MAX_MOQ: ['PURCHASE_MAX_MOQ']
  };
  _exports.cartLimitedEnum = cartLimitedEnum;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/vo/productStock.js'] = window.SLM['cart/script/domain/vo/productStock.js'] || function () {
  const _exports = {};
  const stockType = window['SLM']['cart/script/constant/stockType.js'].default;
  function isProductOnSale(vo) {
    if (!vo) return false;
    if (vo.stock > 0) return true;
    return vo.stockType === stockType.OVERSOLD || vo.stockType === stockType.UNLIMITED;
  }
  function isStockNotLimited(vo) {
    if (!vo) return false;
    return vo.stockType === stockType.OVERSOLD || vo.stockType === stockType.UNLIMITED;
  }
  _exports.default = {
    isProductOnSale,
    isStockNotLimited
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/constant/priceType.js'] = window.SLM['cart/script/constant/priceType.js'] || function () {
  const _exports = {};
  _exports.default = {
    NORMAL: 0,
    MEMBER: 1,
    SEC_KILL: 2,
    NTH_DISCOUNT: 3
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/vo/productPriceType.js'] = window.SLM['cart/script/domain/vo/productPriceType.js'] || function () {
  const _exports = {};
  const priceType = window['SLM']['cart/script/constant/priceType.js'].default;
  function isNthDiscount(vo) {
    if (!vo) return false;
    return vo.priceType === priceType.NTH_DISCOUNT;
  }
  _exports.default = {
    isNthDiscount
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/utils/object.js'] = window.SLM['cart/script/utils/object.js'] || function () {
  const _exports = {};
  function has(o, k) {
    if (!o || !k) return false;
    return Object.prototype.hasOwnProperty.call(o, k);
  }
  function isNilObject(o) {
    if (!o) return true;
    return Object.keys(o).length === 0;
  }
  _exports.default = {
    has,
    isNilObject
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/model/cartItem.js'] = window.SLM['cart/script/domain/model/cartItem.js'] || function () {
  const _exports = {};
  const productStockVO = window['SLM']['cart/script/domain/vo/productStock.js'].default;
  const productPriceTypeVO = window['SLM']['cart/script/domain/vo/productPriceType.js'].default;
  const priceType = window['SLM']['cart/script/constant/priceType.js'].default;
  const obj = window['SLM']['cart/script/utils/object.js'].default;
  const CartQuantityConst = window['SLM']['cart/script/constant/cartQuantity.js'].default;
  function getSpuId(model) {
    if (!model) return '';
    return model.spuId || '';
  }
  function getSkuId(model) {
    if (!model) return '';
    return model.skuId || '';
  }
  function getGroupId(model) {
    if (!model) return '';
    return model.groupId || '';
  }
  function getParentSkuId(model) {
    if (!model) return '';
    return model.parentSkuId || '';
  }
  function getProductSource(model) {
    if (!model) return '';
    return model.productSource || '';
  }
  function getQuantity(model) {
    if (!model) return 0;
    return model.num || 0;
  }
  function getStock(model) {
    if (!model) return 0;
    return model.stock || 0;
  }
  function getPriceType(model) {
    if (!model) return priceType.NORMAL;
    return model.priceType;
  }
  function isProductOnSale(model) {
    return productStockVO.isProductOnSale(model);
  }
  function isProductQuantityAvailable(model) {
    if (!model) return false;
    const quantity = getQuantity(model);
    if (quantity <= 0) return false;
    if (quantity > CartQuantityConst.MAX_CART_ITEM_QUANTITY) return false;
    const stock = getStock(model);
    if (quantity <= stock) return true;
    return productStockVO.isStockNotLimited(model);
  }
  function isProductQuantityOverflow(model) {
    return getQuantity(model) > CartQuantityConst.MAX_CART_ITEM_QUANTITY;
  }
  function getUniqueID(model) {
    if (!model) return '';
    return `${model.groupId}${model.spuId}.${model.skuId}`;
  }
  function filterOnSaleProduct(list) {
    return filter(list, productStockVO.isProductOnSale);
  }
  function mergeNthProduct(list) {
    if (!list) return [];
    const productIndexMap = {};
    const result = [];
    for (let i = 0; i < list.length; ++i) {
      const item = list[i];
      if (obj.has(productIndexMap, `${item.groupId}${item.skuId}`)) {
        const pushedItem = result[productIndexMap[`${item.groupId}${item.skuId}`]];
        if (productPriceTypeVO.isNthDiscount(item)) {
          item.num += pushedItem.num;
          result[productIndexMap[`${item.groupId}${item.skuId}`]] = item;
        } else {
          pushedItem.num += item.num;
        }
      } else {
        productIndexMap[`${item.groupId}${item.skuId}`] = result.length;
        result.push({
          ...item
        });
      }
    }
    return result;
  }
  function isCartItemListOverflow(list) {
    if (!list) return false;
    return list.length > CartQuantityConst.MAX_CART_ITEM_LIST_QUANTITY;
  }
  function filterProductInGroup(list, groupId) {
    if (!list || !groupId) return [];
    return filter(list, model => {
      return getGroupId(model) === groupId;
    });
  }
  function groupProductsWithSkuId(list, skuId) {
    if (!list || !skuId) return [];
    return filter(list, model => {
      if (getSkuId(model) === skuId) return true;
      return getParentSkuId(model) === skuId;
    });
  }
  function filterProductsWithParentSkuId(list, skuId) {
    if (!list || !skuId) return [];
    return filter(list, model => {
      if (getSkuId(model) === skuId) return false;
      return getParentSkuId(model) === skuId;
    });
  }
  function findProductWithGroupIdAndSkuId(list, groupId, skuId) {
    if (!list || !skuId) return [];
    if (!groupId) {
      groupId = '0';
    }
    return find(list, model => {
      if (getSkuId(model) !== skuId) return false;
      let targetGroupId = getGroupId(model);
      if (!targetGroupId) {
        targetGroupId = '0';
      }
      return targetGroupId === groupId;
    });
  }
  _exports.default = {
    getUniqueID,
    getPriceType,
    getSpuId,
    getSkuId,
    getGroupId,
    getProductSource,
    getQuantity,
    isProductOnSale,
    isProductQuantityAvailable,
    isProductQuantityOverflow,
    isCartItemListOverflow,
    mergeNthProduct,
    filterOnSaleProduct,
    filterProductInGroup,
    groupProductsWithSkuId,
    filterProductsWithParentSkuId,
    findProductWithGroupIdAndSkuId
  };
  function filter(list, filterFn) {
    if (!list || typeof filterFn !== 'function') return [];
    return list.filter(filterFn);
  }
  function find(list, filterFn) {
    if (!list || typeof filterFn !== 'function') return [];
    return list.find(filterFn);
  }
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/vo/responseCode.js'] = window.SLM['cart/script/domain/vo/responseCode.js'] || function () {
  const _exports = {};
  const responseCode = window['SLM']['cart/script/constant/responseCode.js'].default;
  function isOk(vo) {
    if (!vo) return false;
    return vo.code === responseCode.SUCCESS;
  }
  function is(vo, code) {
    if (!vo || !code) return false;
    return vo.code === code;
  }
  function batchIs(vo, code) {
    if (!vo || !code) return false;
    try {
      return code.split(',').includes(vo.code);
    } catch {
      return false;
    }
  }
  _exports.default = {
    is,
    isOk,
    batchIs
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/model/response.js'] = window.SLM['cart/script/domain/model/response.js'] || function () {
  const _exports = {};
  const responseCodeVO = window['SLM']['cart/script/domain/vo/responseCode.js'].default;
  const responseCode = window['SLM']['cart/script/constant/responseCode.js'].default;
  function getCode(model) {
    if (!model) return '';
    return model.code;
  }
  function getData(model) {
    if (!model) return null;
    return model.data;
  }
  function isResolved(model) {
    if (!model) return false;
    return model.success === true && responseCodeVO.isOk(model);
  }
  function rejectWithCode(code = '') {
    return {
      code,
      success: false
    };
  }
  function resolveWithData(data = undefined) {
    return {
      code: responseCode.SUCCESS,
      success: true,
      data
    };
  }
  _exports.default = {
    getCode,
    getData,
    isResolved,
    rejectWithCode,
    resolveWithData
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/model/promotionCode.js'] = window.SLM['cart/script/domain/model/promotionCode.js'] || function () {
  const _exports = {};
  function getCode(model) {
    if (!model) return undefined;
    return model.map(codeInfo => codeInfo.promotionCode) || '';
  }
  _exports.default = {
    getCode
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/trade/optimize-modal/constant.js'] = window.SLM['theme-shared/biz-com/trade/optimize-modal/constant.js'] || function () {
  const _exports = {};
  const verifyType = {
    NIL: 0,
    SOLD_OUT: 1,
    UNDER_STOCK: 2,
    OFF_SHELVED: 3,
    DELETED: 4,
    PRODUCT_LIMIT: 5,
    USER_LIMIT: 6,
    PRODUCT_UNDER_STOCK: 7
  };
  const limitType = {
    5: 'PRODUCT_LIMIT',
    6: 'USER_LIMIT',
    7: 'PRODUCT_UNDER_STOCK'
  };
  const StatusEnum = {
    normal: 1,
    offline: 2,
    lack: 3,
    over: 4,
    removed: 5,
    product_limit: 6,
    user_limit: 7,
    product_under_stock: 8
  };
  const btnEnum = {
    paypal: 1,
    empty: 2,
    limit: 3,
    checkout: 4
  };
  const sourceEnum = {
    CART: 1,
    MINI_CART: 2,
    CHECKOUT: 3
  };
  const ErrorTypeEnum = {
    SOLD_OUT: 'SOLD_OUT',
    STOCK_OVER: 'STOCK_OVER',
    SHELF_OFF: 'SHELF_OFF',
    DELETE: 'DELETE',
    LIMITED_ACTIVE_SKU_OVER: 'LIMITED_ACTIVE_SKU_OVER',
    LIMITED_ACTIVE_OVER: 'LIMITED_ACTIVE_OVER',
    LIMITED_ACTIVE_STOCK_OVER: 'LIMITED_ACTIVE_STOCK_OVER',
    MAIN_PRODUCT_ERROR: 'MAIN_PRODUCT_ERROR',
    PURCHASE_LESS_MOQ: 'PURCHASE_LESS_MOQ',
    GIFT_INVALID: 'GIFT_INVALID'
  };
  const PropertyTypeEnum = {
    picture: 'picture',
    text: 'text',
    link: 'link'
  };
  const productSignEid = {
    B2B: '103'
  };
  const productTypeMap = {
    1: 'product',
    2: 'addon',
    3: 'subscription'
  };
  _exports.verifyType = verifyType;
  _exports.StatusEnum = StatusEnum;
  _exports.btnEnum = btnEnum;
  _exports.sourceEnum = sourceEnum;
  _exports.limitType = limitType;
  _exports.ErrorTypeEnum = ErrorTypeEnum;
  _exports.PropertyTypeEnum = PropertyTypeEnum;
  _exports.productSignEid = productSignEid;
  _exports.productTypeMap = productTypeMap;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/trade/optimize-modal/cartChangeItem.js'] = window.SLM['theme-shared/biz-com/trade/optimize-modal/cartChangeItem.js'] || function () {
  const _exports = {};
  const { verifyType, ErrorTypeEnum } = window['SLM']['theme-shared/biz-com/trade/optimize-modal/constant.js'];
  function getSkuId(model) {
    if (!model) return '';
    return model.skuId || '';
  }
  function getGroupId(model) {
    if (!model) return '';
    return model.groupId || '';
  }
  function getStock(model) {
    if (!model) return 0;
    return model.stock || 0;
  }
  function getVerifyType(model) {
    if (!model) return verifyType.NIL;
    switch (model.errorInfo.errorType) {
      case ErrorTypeEnum.SOLD_OUT:
        return verifyType.SOLD_OUT;
      case ErrorTypeEnum.STOCK_OVER:
        return verifyType.UNDER_STOCK;
      case ErrorTypeEnum.SHELF_OFF:
      case ErrorTypeEnum.GIFT_INVALID:
        return verifyType.OFF_SHELVED;
      case ErrorTypeEnum.DELETE:
        return verifyType.DELETED;
      case ErrorTypeEnum.LIMITED_ACTIVE_SKU_OVER:
        return verifyType.PRODUCT_LIMIT;
      case ErrorTypeEnum.LIMITED_ACTIVE_OVER:
        return verifyType.USER_LIMIT;
      case ErrorTypeEnum.LIMITED_ACTIVE_STOCK_OVER:
        return verifyType.PRODUCT_UNDER_STOCK;
      default:
        return verifyType.NIL;
    }
  }
  _exports.default = {
    getSkuId,
    getStock,
    getVerifyType,
    getGroupId
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/vo/productVerifyType.js'] = window.SLM['cart/script/domain/vo/productVerifyType.js'] || function () {
  const _exports = {};
  const { verifyType } = window['SLM']['theme-shared/biz-com/trade/optimize-modal/constant.js'];
  function noError(vo) {
    return !vo || !vo.verifyType || vo.verifyType === verifyType.NIL;
  }
  function hasError(vo) {
    return !noError(vo);
  }
  function isUnderStock(vo) {
    return vo && vo.verifyType === verifyType.UNDER_STOCK;
  }
  _exports.default = {
    noError,
    hasError,
    isUnderStock
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/model/cartVerifyItem.js'] = window.SLM['cart/script/domain/model/cartVerifyItem.js'] || function () {
  const _exports = {};
  const cartChangeItemModel = window['SLM']['theme-shared/biz-com/trade/optimize-modal/cartChangeItem.js'].default;
  const cartItemModel = window['SLM']['cart/script/domain/model/cartItem.js'].default;
  const productVerifyTypeVO = window['SLM']['cart/script/domain/vo/productVerifyType.js'].default;
  function makeVerifyList(cartItemList, checkList) {
    const checkItemMap = (checkList || []).reduce((result, item) => {
      result[`${cartChangeItemModel.getGroupId(item)}-${cartChangeItemModel.getSkuId(item)}`] = item;
      return result;
    }, {});
    const results = [];
    (cartItemList || []).forEach(item => {
      if (item) {
        const changeItem = checkItemMap[`${cartItemModel.getGroupId(item)}-${cartItemModel.getSkuId(item)}`];
        results.push({
          verifyType: cartChangeItemModel.getVerifyType(changeItem),
          cartItem: item,
          cartChangeItem: changeItem
        });
      }
    });
    return results;
  }
  function isVerifyFailed(list) {
    if (!Array.isArray(list)) return false;
    if (list.length <= 0) return false;
    return list.find(item => {
      return productVerifyTypeVO.hasError(item);
    });
  }
  function filterFailedList(list) {
    if (!Array.isArray(list)) return [];
    if (list.length <= 0) return [];
    return list.filter(item => {
      return productVerifyTypeVO.hasError(item);
    });
  }
  function getVerifiedCartItemList(list) {
    if (!list || list.length <= 0) return [];
    return list.map(verifyItem => {
      const {
        cartItem,
        cartChangeItem
      } = verifyItem;
      const {
        errorInfo
      } = cartChangeItem || {};
      if (!errorInfo) {
        return {
          ...cartItem
        };
      }
      const {
        targetNum
      } = errorInfo;
      if (targetNum > 0) {
        return {
          ...cartItem,
          num: targetNum
        };
      }
      return null;
    }).filter(v => !!v);
  }
  _exports.default = {
    makeVerifyList,
    isVerifyFailed,
    filterFailedList,
    getVerifiedCartItemList
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/service/cart/hooks.js'] = window.SLM['cart/script/service/cart/hooks.js'] || function () {
  const _exports = {};
  const { AsyncSeriesBailHook } = window['@funnyecho/hamon'];
  const cartItemModel = window['SLM']['cart/script/domain/model/cartItem.js'].default;
  const verifyingProductOverflow = new AsyncSeriesBailHook();
  const verifyingActiveProductEmpty = new AsyncSeriesBailHook();
  const verifyingProductSoldOut = new AsyncSeriesBailHook(item => cartItemModel.getUniqueID(item));
  const verifyingProductQuantityInvalid = new AsyncSeriesBailHook(item => cartItemModel.getUniqueID(item));
  const productVerified = new AsyncSeriesBailHook();
  _exports.default = {
    verifyingProductOverflow,
    verifyingActiveProductEmpty,
    verifyingProductSoldOut,
    verifyingProductQuantityInvalid,
    productVerified
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/service/cart/service.js'] = window.SLM['cart/script/service/cart/service.js'] || function () {
  const _exports = {};
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { get } = window['SLM']['theme-shared/utils/syntax-patch.js'];
  const { getSyncData } = window['SLM']['theme-shared/utils/dataAccessor.js'];
  const store = window['@sl/cart']['/lib/utils/store'].default;
  const cartEventBus = window['SLM']['cart/script/utils/event-bus/index.js'].default;
  const cartSvc = window['SLM']['cart/script/domain/adapter/svc/cart.js'].default;
  const voucherSvc = window['SLM']['cart/script/domain/adapter/svc/voucher.js'].default;
  const couponSvc = window['SLM']['cart/script/domain/adapter/svc/coupon.js'].default;
  const orderSvc = window['SLM']['cart/script/domain/adapter/svc/order.js'].default;
  const storageConstants = window['SLM']['cart/script/domain/adapter/storage/constant.js'].default;
  const responseCode = window['SLM']['cart/script/constant/responseCode.js'].default;
  const cartModel = window['SLM']['cart/script/domain/model/cart.js'].default;
  const cartItemModel = window['SLM']['cart/script/domain/model/cartItem.js'].default;
  const responseModel = window['SLM']['cart/script/domain/model/response.js'].default;
  const promotionCodeModel = window['SLM']['cart/script/domain/model/promotionCode.js'].default;
  const cartVerifyItemModel = window['SLM']['cart/script/domain/model/cartVerifyItem.js'].default;
  const modelHelper = window['SLM']['cart/script/domain/model/helpers.js'].default;
  const hooks = window['SLM']['cart/script/service/cart/hooks.js'].default;
  const CartEventBusEnum = {
    UPDATE: 'cart:update'
  };
  const CartInfoKey = 'cartInfo';
  class CartService {
    constructor(svcAdapter, storageAdapter) {
      this._svc = svcAdapter;
      this._storage = storageAdapter;
      this._cartDetail = SL_State.get(CartInfoKey) || null;
      this._inactiveCartItemListMemo = modelHelper.memo();
      this._activeCartItemListMemo = modelHelper.memo();
      this._cartItemListMemo = modelHelper.memo();
      cartEventBus.on(CartEventBusEnum.UPDATE, data => {
        this._cartDetail = data;
      });
    }
    get inactiveCartItemList() {
      return this._inactiveCartItemListMemo(cartDetail => {
        return modelHelper.reducer(cartDetail).next(cartModel.getInactiveCartItemList).next(cartItemModel.mergeNthProduct)();
      }, this.cartDetail);
    }
    get activeCartItemList() {
      return this._activeCartItemListMemo(cartDetail => {
        return modelHelper.reducer(cartDetail).next(cartModel.getActiveCartItemList).next(cartItemModel.mergeNthProduct)();
      }, this.cartDetail);
    }
    get cartItemList() {
      return this._cartItemListMemo(cartDetail => {
        return modelHelper.reducer(cartDetail).next(cartModel.getCartItemList).next(cartItemModel.mergeNthProduct)();
      }, this.cartDetail);
    }
    get cartDetail() {
      return this._cartDetail;
    }
    async getCartDetail() {
      const res = await cartSvc.getCart(this._svc);
      if (responseModel.isResolved(res)) {
        const {
          data
        } = res;
        this._cartDetail = data;
        store.add({
          cartInfo: data
        });
        SL_State.set(CartInfoKey, data);
        cartEventBus.emit(CartEventBusEnum.UPDATE, data);
      }
      return res;
    }
    async updateCartState() {
      const res = await cartSvc.getCart(this._svc);
      if (responseModel.isResolved(res)) {
        const {
          data
        } = res;
        this._cartDetail = data;
        store.add({
          cartInfo: data
        });
        SL_State.set(CartInfoKey, data);
      }
      return res;
    }
    async rerenderCartDom() {
      await cartEventBus.emit(CartEventBusEnum.UPDATE, this._cartDetail);
    }
    async addSku({
      spuId,
      skuId,
      num,
      orderFrom,
      dataReportReq,
      sellingPlanId
    }) {
      if (!spuId || !skuId || num < 0) {
        return responseModel.rejectWithCode(responseCode.FA_INVALID_PARAMS);
      }
      const res = await cartSvc.addCartItem(this._svc, {
        spuId,
        skuId,
        num,
        orderFrom,
        dataReportReq,
        sellingPlanId
      });
      if (responseModel.isResolved(res)) {
        await this.getCartDetail();
      }
      return res;
    }
    async editSku({
      spuId,
      skuId,
      num,
      groupId,
      productSource
    }) {
      if (!spuId || !skuId || num < 0) {
        return responseModel.rejectWithCode(responseCode.FA_INVALID_PARAMS);
      }
      const skuInfo = {
        spuId,
        skuId,
        num,
        groupId,
        productSource
      };
      const res = await cartSvc.putCartItem(this._svc, skuInfo);
      if (responseModel.isResolved(res)) {
        await this.getCartDetail();
      }
      return res;
    }
    async removeSkuList(skuInfoList) {
      if (Array.isArray(skuInfoList) && skuInfoList.length) {
        const res = await cartSvc.deleteCartItemList(this._svc, skuInfoList || []);
        if (responseModel.isResolved(res)) {
          await this.getCartDetail();
        }
        return res;
      }
      return responseModel.resolveWithData();
    }
    getCheckoutParams(itemList) {
      const discountCode = modelHelper.reducer(this.cartDetail).next(cartModel.getPromotionInfo).next(promotionCodeModel.getCode)();
      const useMemberPoint = get(this.cartDetail, 'memberPointInfo.use', undefined);
      let abandonSeq = null;
      let abandonMark = null;
      const rawAbandonInfoFromCache = this._storage.getItem(storageConstants.KEY_CART_ABANDON_INFO);
      if (rawAbandonInfoFromCache) {
        ({
          mark: abandonMark,
          seq: abandonSeq
        } = JSON.parse(rawAbandonInfoFromCache));
      }
      return modelHelper.reducer({
        associateCart: true,
        useMemberPoint
      }).next(discountCode ? orderSvc.withAbandonOrderDiscountCode : null, discountCode).next(abandonSeq ? orderSvc.withAbandonOrderInfo : null, abandonSeq, abandonMark).next(orderSvc.withAbandonOrderProductList, (itemList || []).map(item => ({
        productSku: item.skuId,
        productSeq: item.spuId,
        productNum: item.num,
        productPrice: item.price,
        productName: item.name,
        groupId: item.groupId,
        productSource: item.productSource,
        sellingPlanId: item.subscriptionInfo ? item.subscriptionInfo.sellingPlanId : undefined
      })))();
    }
    async toggleVoucher(used) {
      const res = await voucherSvc.toggleVoucher(this._svc, !!used);
      if (responseModel.isResolved(res)) {
        await this.getCartDetail();
      }
      return res;
    }
    async applyCoupon(info) {
      const res = await couponSvc.applyCoupon(this._svc, info);
      if (responseModel.isResolved(res)) {
        await this.getCartDetail();
      }
      return res;
    }
    async withdrawCoupon(req) {
      const couponCode = modelHelper.reducer(this._cartDetail).next(cartModel.getPromotionInfo).next(promotionCodeModel.getCode)();
      if (!couponCode) {
        return responseModel.rejectWithCode(responseCode.FA_COUPON_INVALID_CODE);
      }
      const res = await couponSvc.withdrawCoupon(this._svc, req);
      if (responseModel.isResolved(res)) {
        await this.getCartDetail();
      }
      return res;
    }
    async verifyCartItemList(cartItemList) {
      if (!cartItemList) {
        cartItemList = this.cartItemList;
      }
      return this._verifyCartItemList(cartItemList);
    }
    async _verifyCartItemList(cartItemList) {
      if (!Array.isArray(cartItemList)) {
        return responseModel.rejectWithCode(responseCode.FA_INVALID_PARAMS);
      }
      if (cartItemList.length <= 0) {
        if ((await hooks.verifyingActiveProductEmpty.callPromise()) !== false) {
          return responseModel.rejectWithCode(responseCode.FA_PRODUCT_ACTIVE_EMPTY);
        }
      }
      const checkRes = await cartSvc.verifyCartItemListV2(this._svc, {
        orderFrom: getSyncData('orderFrom') || 'web',
        itemList: cartItemList.map(item => {
          return {
            spuId: cartItemModel.getSpuId(item),
            skuId: cartItemModel.getSkuId(item),
            num: cartItemModel.getQuantity(item),
            groupId: cartItemModel.getGroupId(item),
            productSource: cartItemModel.getProductSource(item)
          };
        }).filter(i => !!i.spuId && !!i.skuId)
      });
      if (!responseModel.isResolved(checkRes)) {
        return checkRes;
      }
      return responseModel.resolveWithData(cartVerifyItemModel.makeVerifyList(cartItemList, responseModel.getData(checkRes).checkItemList));
    }
    async getMemberPoint(use) {
      const res = await cartSvc.memberPoint(this._svc, use);
      return res;
    }
    getCardItemList() {
      return this.cartItemList;
    }
  }
  _exports.default = {
    CartService,
    CartEventBusEnum,
    cartEventBus
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/service/cart/index.js'] = window.SLM['cart/script/service/cart/index.js'] || function () {
  const _exports = {};
  const service = window['SLM']['cart/script/service/cart/service.js'].default;
  function withCartService(svcAdapter, storageAdapter) {
    window._sl_cart__cart_service__ = new service.CartService(svcAdapter, storageAdapter);
  }
  function takeCartService() {
    return window._sl_cart__cart_service__;
  }
  _exports.default = {
    withCartService,
    takeCartService,
    eventBusEnum: service.CartEventBusEnum,
    eventBus: service.cartEventBus
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/service/index.js'] = window.SLM['cart/script/service/index.js'] || function () {
  const _exports = {};
  const Cookie = window['js-cookie']['default'];
  const http = window['SLM']['theme-shared/utils/request.js'].default;
  const { Owner, Action } = window['@yy/sl-theme-shared']['/utils/logger/sentryReport'];
  const SvcAdapter = window['SLM']['cart/script/domain/adapter/svc/index.js'].default;
  const StorageAdapter = window['SLM']['cart/script/domain/adapter/storage/index.js'].default;
  const CartService = window['SLM']['cart/script/service/cart/index.js'].default;
  const LoggerService = window['SLM']['commons/logger/index.js'].default;
  const { Status: LoggerStatus } = window['SLM']['commons/logger/index.js'];
  const logger = LoggerService.pipeOwner(`${Owner.Cart} cart/script/service/index.js`);
  const cartToken = Cookie.get('t_cart');
  let initialized = false;
  function init() {
    if (initialized) return;
    initialized = true;
    SvcAdapter.withSvc({
      ai: http
    });
    CartService.withCartService(SvcAdapter.takeSvc(), StorageAdapter.takeStorage());
    logger.info(`normal 主站购物车 全局化 cart service _init`, {
      data: {
        cartToken
      },
      action: Action.InitCart,
      status: LoggerStatus.Success
    });
  }
  _exports.default = {
    init
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/utils/dynamicImportMiniCart.js'] = window.SLM['commons/utils/dynamicImportMiniCart.js'] || function () {
  const _exports = {};
  const request = window['axios']['default'];
  const get = window['lodash']['get'];
  const ID__MINI_CART_CONTAINER = 'trade_mini_cart_ajax';
  let miniCartScriptPromise;
  _exports.default = async () => {
    if (miniCartScriptPromise) return miniCartScriptPromise;
    miniCartScriptPromise = (async () => {
      await renderMiniCart();
      await initMiniCartChunk();
      window.lozadObserver && window.lozadObserver.observe && window.lozadObserver.observe();
    })();
    return miniCartScriptPromise;
  };
  async function renderMiniCart() {
    const res = await request.get(window.Shopline.redirectTo('/cart?view=ajax'));
    const {
      data
    } = res;
    const $container = document.getElementById(ID__MINI_CART_CONTAINER);
    if (!$container) {
      throw new Error(`failed to get mini-cart container with id: ${ID__MINI_CART_CONTAINER}`);
    }
    $container.innerHTML = data || '';
  }
  _exports.renderMiniCart = renderMiniCart;
  async function initMiniCartChunk() {
    return new Promise((resolve, reject) => {
      const $container = document.getElementById(ID__MINI_CART_CONTAINER);
      const jsUrls = Array.from($container.querySelectorAll('script')).map(ele => get(ele, 'attributes.src.nodeValue', ''));
      if (!jsUrls || !jsUrls.length) {
        reject(new Error(`failed to get mini-cart js chunk url`));
        return;
      }
      const promiseList = jsUrls.map(url => {
        return new Promise((re, rj) => {
          const scriptEle = document.createElement('script');
          document.body.appendChild(scriptEle);
          scriptEle.onload = () => {
            re();
          };
          scriptEle.async = false;
          scriptEle.onerror = rj;
          scriptEle.src = url;
        });
      });
      Promise.all(promiseList).then(resolve).catch(reject);
    });
  }
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/cart/errorCode.js'] = window.SLM['commons/cart/errorCode.js'] || function () {
  const _exports = {};
  const ErrorCode = {
    TCAT0109: 'TCAT0109',
    TCAT0107: 'TCAT0107',
    TCAT0112: 'TCAT0112',
    TCAT0111: 'TCAT0111',
    TCAT0101: 'TCAT0101',
    TCAT0103: 'TCAT0103',
    TCAT0119: 'TCAT0119',
    TCAT0120: 'TCAT0120',
    TRD_128188_B1102: 'TRD_128188_B1102',
    TRD_128188_B1025: 'TRD_128188_B1025',
    TRD_128188_B1027: 'TRD_128188_B1027'
  };
  _exports.ErrorCode = ErrorCode;
  const ErrorCode2I18nKey = {
    [ErrorCode.TCAT0109]: 'cart.notices.product_amount_limit',
    [ErrorCode.TCAT0107]: 'cart.discount_price.buy_limit3',
    [ErrorCode.TCAT0112]: 'cart.discount_price.buy_limit3',
    [ErrorCode.TCAT0111]: 'cart.discount_price.buy_limit2',
    [ErrorCode.TCAT0101]: 'cart.item.none_existent',
    [ErrorCode.TCAT0103]: 'products.product_list.product_has_been_removed',
    [ErrorCode.TCAT0119]: 'cart.general.support_oneTime_purchase_only',
    [ErrorCode.TCAT0120]: 'cart.general.support_subscription_only',
    [ErrorCode.TRD_128188_B1102]: 'cart.item.market.illegal.excludedState',
    [ErrorCode.TRD_128188_B1025]: 'cart.b2b.amount.most.desc',
    [ErrorCode.TRD_128188_B1027]: 'cart.product.unavailable_sale'
  };
  _exports.ErrorCode2I18nKey = ErrorCode2I18nKey;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/cart/handleAddToCartErrorCodeToast.js'] = window.SLM['commons/cart/handleAddToCartErrorCodeToast.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const responseCodeVO = window['SLM']['cart/script/domain/vo/responseCode.js'].default;
  const Toast = window['SLM']['commons/components/toast/index.js'].default;
  const { ErrorCode, ErrorCode2I18nKey } = window['SLM']['commons/cart/errorCode.js'];
  function handleAddToCartErrorCodeToast(res) {
    let errMsg = res.msg;
    if (responseCodeVO.is(res, ErrorCode.TCAT0109)) {
      errMsg = t(ErrorCode2I18nKey[res.code]);
    }
    if (responseCodeVO.batchIs(res, [ErrorCode.TCAT0107, ErrorCode.TCAT0112].join(','))) {
      errMsg = t(ErrorCode2I18nKey[res.code], {
        stock: res.data.maxPurchaseTotalNum > 0 ? res.data.maxPurchaseTotalNum : '0'
      });
    }
    if (responseCodeVO.is(res, ErrorCode.TCAT0111)) {
      errMsg = t(ErrorCode2I18nKey[res.code], {
        stock: res.data.maxPurchaseTotalNum > 0 ? res.data.maxPurchaseTotalNum : '0'
      });
    }
    if (responseCodeVO.is(res, ErrorCode.TCAT0101)) {
      errMsg = t(ErrorCode2I18nKey[res.code]);
    }
    if (responseCodeVO.is(res, ErrorCode.TCAT0103)) {
      errMsg = t(ErrorCode2I18nKey[res.code]);
    }
    if (responseCodeVO.is(res, ErrorCode.TCAT0119)) {
      errMsg = t(ErrorCode2I18nKey[res.code]);
    }
    if (responseCodeVO.is(res, ErrorCode.TCAT0120)) {
      errMsg = t(ErrorCode2I18nKey[res.code]);
    }
    if (responseCodeVO.is(res, ErrorCode.TRD_128188_B1102)) {
      errMsg = t(ErrorCode2I18nKey[res.code]);
    }
    if (responseCodeVO.is(res, ErrorCode.TRD_128188_B0126)) {
      errMsg = t(ErrorCode2I18nKey[res.code], {
        num: res.data.maxPurchaseNum
      });
    }
    if (responseCodeVO.is(res, ErrorCode.TRD_128188_B1027)) {
      errMsg = t(ErrorCode2I18nKey[res.code]);
    }
    new Toast().open(errMsg, 1500);
  }
  _exports.default = handleAddToCartErrorCodeToast;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/cart/globalEvent.js'] = window.SLM['commons/cart/globalEvent.js'] || function () {
  const _exports = {};
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const loggerService = window['@yy/sl-theme-shared']['/utils/logger'].default;
  const { getSyncData } = window['SLM']['theme-shared/utils/dataAccessor.js'];
  const { setAddtoCart } = window['SLM']['theme-shared/utils/tradeReport/index.js'];
  const { OPEN_MINI_CART, ADD_TO_CART, CONTROL_CART_BASIS } = window['SLM']['theme-shared/events/trade/interior-event/index.js'];
  const CartSidebarRender = window['SLM']['theme-shared/events/trade/developer-api/cart-sidebar-render/index.js'].default;
  const { listenCartReport } = window['SLM']['theme-shared/utils/tradeReport/eventListen.js'];
  const { reportMiniCartView } = window['SLM']['theme-shared/utils/tradeReport/hdReportV2.js'];
  const { DRAWER_EVENT_NAME: TOP_DRAWER_EVENT_NAME, DRAWER_OPERATORS } = window['SLM']['theme-shared/components/hbs/shared/components/topDrawer/const.js'];
  const { DRAWER_EVENT_NAME } = window['SLM']['theme-shared/components/hbs/shared/components/drawer/const.js'];
  const { initMiniStyleWhenOpen } = window['SLM']['cart/script/biz/sticky-cart/index.js'];
  const { setFixedContentStyle, listenElementMutation } = window['SLM']['cart/script/biz/sticky-cart/helper.js'];
  const Service = window['SLM']['cart/script/service/index.js'].default;
  const CartService = window['SLM']['cart/script/service/cart/index.js'].default;
  const responseCodeVO = window['SLM']['cart/script/domain/vo/responseCode.js'].default;
  const dynamicImportMiniCart = window['SLM']['commons/utils/dynamicImportMiniCart.js'].default;
  const handleAddToCartErrorCodeToast = window['SLM']['commons/cart/handleAddToCartErrorCodeToast.js'].default;
  const logger = loggerService.pipeOwner({
    owner: 'Cart',
    onTag: key => {
      switch (key) {
        case 'eventId':
          return true;
        default:
          return false;
      }
    }
  });
  _exports.OPEN_MINI_CART = OPEN_MINI_CART;
  _exports.ADD_TO_CART = ADD_TO_CART;
  const CLOSE_MINI_CART = Symbol('CLOSE_MINI_CART');
  _exports.CLOSE_MINI_CART = CLOSE_MINI_CART;
  const OPEN_TOP_CART = Symbol('OPEN_TOP_CART');
  _exports.OPEN_TOP_CART = OPEN_TOP_CART;
  const OPEN_CART_BANNER = 'NEED_OPEN_TOP_CART';
  _exports.OPEN_CART_BANNER = OPEN_CART_BANNER;
  const cartOpenType = SL_State.get('theme.settings.cart_open_type');
  Service.init();
  if (window.location.pathname.includes('/cart')) {
    dynamicImportMiniCart();
  } else if (cartOpenType !== 'newpage' && cartOpenType !== 'cartremain') {
    setTimeout(dynamicImportMiniCart, 6000);
  }
  const interior = window.SL_EventBus;
  const noop = () => {};
  listenCartReport();
  let miniCartContainerFixedObserver = null;
  function listenMiniCartStickContainerChange() {
    if (miniCartContainerFixedObserver) {
      miniCartContainerFixedObserver.disconnect();
      miniCartContainerFixedObserver = null;
    }
    if ($(`.miniCart__stick_container_fixed_observer`).length > 0) {
      miniCartContainerFixedObserver = listenElementMutation($(`.miniCart__stick_container_fixed_observer`).get(0), () => {
        $('#cart-drawer .trade_cart_not_empty_wrapper').prop('hadSet', false);
        setTimeout(() => {
          setFixedContentStyle('#cart-drawer .trade_cart_not_empty_wrapper', $('#cart-drawer .miniCart__stick_container_fixed_observer').outerHeight() + 20);
        }, 0);
      }, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }
  }
  interior.on(OPEN_MINI_CART, async ({
    data = {},
    onSuccess = noop
  } = {}) => {
    const cartId = 'cart-drawer';
    const {
      needToFetch = true
    } = data;
    if (cartOpenType === 'newpage' || cartOpenType === 'minicart' || cartOpenType === 'cartremain') {
      onSuccess(data);
      window.location.href = window.Shopline.redirectTo('/cart');
    } else {
      await dynamicImportMiniCart();
      if (needToFetch) {
        await CartService.takeCartService().getCartDetail();
      }
      interior.emit(DRAWER_EVENT_NAME, {
        id: cartId,
        status: 'open',
        onOpen: onSuccess
      });
      initMiniStyleWhenOpen();
      reportMiniCartView();
      listenMiniCartStickContainerChange();
      CartSidebarRender({
        data: {
          dom: {
            id: cartId
          }
        }
      });
    }
  });
  window.SL_EventBus.on(OPEN_TOP_CART, async () => {
    await dynamicImportMiniCart();
    window.SL_EventBus.emit(cartOpenType === 'minicart' ? TOP_DRAWER_EVENT_NAME : DRAWER_EVENT_NAME, {
      id: cartOpenType === 'minicart' ? 'cart-select' : 'cart-drawer',
      operator: DRAWER_OPERATORS.OPEN,
      status: 'open'
    });
  });
  const closeMiniCart = () => {
    window.SL_EventBus.emit(cartOpenType === 'minicart' ? TOP_DRAWER_EVENT_NAME : DRAWER_EVENT_NAME, {
      id: cartOpenType === 'minicart' ? 'cart-select' : 'cart-drawer',
      operator: DRAWER_OPERATORS.CLOSE
    });
  };
  window.SL_EventBus.on(CLOSE_MINI_CART, closeMiniCart);
  interior.on('REFRESH_CART', async () => {
    await CartService.takeCartService().getCartDetail();
  });
  window.SL_EventBus.on(ADD_TO_CART, async ({
    spuId,
    skuId,
    num,
    price,
    currency,
    success,
    error,
    complete,
    eventID,
    reportParamsExt,
    sellingPlanId
  }) => {
    const dataReportReq = setAddtoCart(price, currency, eventID, reportParamsExt);
    const skuParams = {
      spuId,
      skuId,
      num,
      orderFrom: getSyncData('orderFrom'),
      dataReportReq,
      sellingPlanId
    };
    try {
      if (cartOpenType !== 'newpage') {
        closeMiniCart();
        await dynamicImportMiniCart();
      }
      const isDismissParams = ['orderFrom'].some(key => !skuParams[key] && skuParams[key] !== 0);
      if (isDismissParams) {
        logger.info('[加购请求参数缺失，请检查]', {
          ...skuParams
        });
      }
      logger.debug('[加购请求参数初始化]', {
        ...skuParams
      });
      const res = await CartService.takeCartService().addSku(skuParams);
      logger.debug('[加购请求响应数据]', {
        res,
        eventId: dataReportReq.eventId
      });
      if (!responseCodeVO.isOk(res)) {
        handleAddToCartErrorCodeToast(res);
        if (typeof error === 'function') {
          error();
        }
      } else {
        if (typeof success === 'function') {
          try {
            success();
          } catch (e) {
            console.error(e);
          }
        }
        if (cartOpenType === 'cartremain') {
          return;
        }
        if (cartOpenType === 'minicart') {
          window.SL_EventBus.emit(OPEN_CART_BANNER, {
            data: {
              ...res.data.itemDetail
            },
            onSuccess: () => {
              window.SL_EventBus.emit(OPEN_TOP_CART);
            }
          });
        } else {
          interior.emit(OPEN_MINI_CART, {
            data: {
              needToFetch: false
            }
          });
        }
      }
    } catch (e) {
      console.warn('add to cart fail:', e);
      logger.error(`[加购失败]`, {
        e,
        eventId: dataReportReq.eventId
      });
    } finally {
      if (typeof complete === 'function') {
        complete();
      }
    }
  });
  window.SL_EventBus.on(CONTROL_CART_BASIS, async ({
    options,
    success,
    error
  }) => {
    const paramsEnum = {
      switchSideBar: 'switchSideBar',
      updateState: 'updateState',
      rerenderDom: 'rerenderDom',
      cartDetail: 'cartDetail'
    };
    const sideBarStatusEnum = {
      open: 'open',
      close: 'close'
    };
    const paramsFilter = () => {
      const eventName = 'Cart::ControlCartBasis Event: ';
      if (!options || !Object.keys(options).length) {
        console.warn(eventName, 'params missing');
        return false;
      }
      if (!!Object.hasOwnProperty.call(options, paramsEnum.switchSideBar) && !Object.values(sideBarStatusEnum).includes(options.switchSideBar)) {
        console.warn(eventName, `【switchSideBar: ${options.switchSideBar}】 is invalid`);
        return false;
      }
      if (!!Object.hasOwnProperty.call(options, paramsEnum.updateState) && typeof options.updateState !== 'boolean') {
        console.warn(eventName, `【updateState: ${options.updateState}】 is invalid`);
        return false;
      }
      if (!!Object.hasOwnProperty.call(options, paramsEnum.rerenderDom) && typeof options.rerenderDom !== 'boolean') {
        console.warn(eventName, `【rerenderDom: ${options.rerenderDom}】 is invalid`);
        return false;
      }
      if (!!Object.hasOwnProperty.call(options, paramsEnum.cartDetail) && typeof options.cartDetail !== 'boolean') {
        console.warn(eventName, `【cartDetail: ${options.cartDetail}】 is invalid`);
        return false;
      }
      if (Object.keys(options).some(item => !Object.hasOwnProperty.call(paramsEnum, item))) {
        console.warn(eventName, 'params has invalid key');
        return false;
      }
      return true;
    };
    try {
      if (paramsFilter()) {
        const {
          switchSideBar,
          updateState,
          rerenderDom,
          cartDetail
        } = options;
        let cartInfo;
        if (switchSideBar) {
          if (switchSideBar === sideBarStatusEnum.open) {
            interior.emit(OPEN_MINI_CART, {
              data: {
                needToFetch: false
              }
            });
          } else {
            const cartId = 'cart-drawer';
            interior.emit(DRAWER_EVENT_NAME, {
              id: cartId,
              status: sideBarStatusEnum.close
            });
          }
        }
        if (updateState) {
          await CartService.takeCartService().updateCartState();
        }
        if (rerenderDom) {
          await CartService.takeCartService().rerenderCartDom();
        }
        if (cartDetail) {
          const CartInfoKey = 'cartInfo';
          cartInfo = SL_State.get(CartInfoKey) || null;
          success(cartInfo);
          return;
        }
        success();
        return;
      }
    } catch (e) {
      error();
      console.warn(`${CONTROL_CART_BASIS} FAIL:`, e);
    }
  });
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/utils/debounce.js'] = window.SLM['commons/utils/debounce.js'] || function () {
  const _exports = {};
  _exports.default = function (wait, callback, immediate) {
    let timeout;
    return function (...args) {
      const context = this;
      const later = function () {
        timeout = null;
        if (!immediate) callback.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) callback.apply(context, args);
    };
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/report/product/add-to-cart.js'] = window.SLM['theme-shared/report/product/add-to-cart.js'] || function () {
  const _exports = {};
  const getCurrencyCode = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'].default;
  const { convertPrice } = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { nullishCoalescingOperator } = window['SLM']['theme-shared/utils/syntax-patch.js'];
  const componentMap = {
    addtocart: 101,
    buynow: 102,
    paypal: 103,
    morePay: 104
  };
  const pageMap = {
    Home: {
      page: 101,
      module: 900
    },
    ProductsDetail: {
      page: 105,
      module: 106
    },
    QuickView: {
      page: 107,
      module: 106
    },
    QuickAdd: {
      page: 108,
      module: 106
    },
    SingleQuickAdd: {
      page: 108,
      module: 109,
      component: 101
    }
  };
  const pageId = {
    Home: 101,
    ProductsSearch: 102,
    Products: 103,
    ProductsDetail: 105,
    Activity: 115
  };
  function findSectionId(selector) {
    const id = $(selector).closest('.shopline-section').attr('id');
    const trueId = id && id.replace('shopline-section-', '');
    return trueId;
  }
  function newHdReportData({
    addtocartType,
    price,
    skuId,
    spuId,
    num,
    modalType,
    variant,
    collectionId,
    collectionName,
    position,
    dataId,
    eventID,
    cartId,
    moreInfo = {},
    singleItem = {}
  }) {
    let config = {};
    if (modalType) {
      config = pageMap[modalType];
      config.page_id = pageId[SL_State.get('templateAlias')];
    } else {
      config = nullishCoalescingOperator(pageMap[SL_State.get('templateAlias')], {});
      if (SL_State.get('templateAlias') === 'Home') {
        config.module_type = '单个商品';
        config.component_ID = findSectionId('[data-ssr-plugin-product-detail-container]');
      }
    }
    const index = nullishCoalescingOperator(position, '') === '' ? '' : Number(position) + 1;
    const data = {
      component: componentMap[addtocartType],
      ...config,
      event_name: 'AddToCart',
      data_id: dataId,
      addtocart_type: addtocartType === 'morePay' ? 'buynow' : addtocartType,
      action_type: -999,
      event_id: `addToCart${eventID}`,
      currency: getCurrencyCode(),
      value: convertPrice(price) * num,
      cart_id: cartId,
      ...moreInfo,
      items: [{
        sku_id: skuId,
        spu_id: spuId,
        index,
        collection_id: nullishCoalescingOperator(collectionId, ''),
        collection_name: nullishCoalescingOperator(collectionName, ''),
        variant: nullishCoalescingOperator(variant, ''),
        currency: getCurrencyCode(),
        price: convertPrice(price),
        quantity: num,
        ...singleItem
      }]
    };
    window.HdSdk && window.HdSdk.shopTracker && window.HdSdk.shopTracker.collect(data);
  }
  _exports.newHdReportData = newHdReportData;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/detail/js/product-button-report.js'] = window.SLM['product/detail/js/product-button-report.js'] || function () {
  const _exports = {};
  const { getEventID } = window['SLM']['theme-shared/utils/report/tool.js'];
  const { newHdReportData } = window['SLM']['theme-shared/report/product/add-to-cart.js'];
  const getCurrencyCode = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'].default;
  const { convertPrice } = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'];
  const dataReportAddToCart = window['@yy/sl-theme-shared']['/events/data-report/add-to-cart'].default;
  function reportAddToCartEvent(data) {
    try {
      dataReportAddToCart(data);
    } catch (e) {
      console.error(e);
    }
  }
  _exports.reportAddToCartEvent = reportAddToCartEvent;
  function addToCartThirdReport({
    spuId,
    name,
    price,
    skuId,
    num,
    eventID = getEventID(),
    variant,
    spu
  }) {
    const totalPrice = convertPrice(price) * (num || 1);
    const {
      customCategoryName
    } = spu || {};
    window.SL_EventBus.emit('global:thirdPartReport', {
      GA: [['event', 'add_to_cart', {
        currency: getCurrencyCode(),
        items: [{
          id: skuId,
          name,
          currency: getCurrencyCode(),
          price: convertPrice(price),
          quantity: num,
          variant,
          category: customCategoryName
        }]
      }]],
      GA4: [['event', 'add_to_cart', {
        currency: getCurrencyCode(),
        value: totalPrice,
        items: [{
          item_id: skuId,
          item_name: name,
          currency: getCurrencyCode(),
          price: convertPrice(price),
          quantity: num,
          item_variant: variant,
          item_category: customCategoryName
        }]
      }]],
      GAAds: [['event', 'conversion', {
        value: totalPrice,
        currency: getCurrencyCode()
      }, 'ADD-TO-CART']],
      FBPixel: [['track', 'AddToCart', {
        content_ids: spuId,
        content_name: name || '',
        content_category: '',
        content_type: 'product_group',
        currency: getCurrencyCode(),
        value: convertPrice(price)
      }, {
        eventID: `addToCart${eventID}`
      }]],
      GAR: [['event', 'add_to_cart', {
        currency: getCurrencyCode(),
        value: totalPrice,
        items: [{
          id: window.SL_GetReportArg && window.SL_GetReportArg('GAR', 'sku_id', skuId),
          google_business_vertical: 'retail'
        }]
      }]],
      GARemarketing: [['event', 'add_to_cart', {
        ecomm_prodid: window.SL_GetReportArg && window.SL_GetReportArg('GAR', 'sku_id', skuId),
        ecomm_pagetype: 'cart',
        currency: getCurrencyCode(),
        ecomm_totalvalue: totalPrice
      }]]
    });
    reportAddToCartEvent({
      content_spu_id: spuId,
      content_sku_id: skuId,
      content_category: '',
      content_name: name,
      currency: getCurrencyCode(),
      price: convertPrice(price || 0),
      value: convertPrice(price || 0),
      quantity: num
    });
    return eventID;
  }
  _exports.addToCartThirdReport = addToCartThirdReport;
  function report(eventId, data) {
    if (window.HdSdk && window.HdSdk.shopTracker && window.HdSdk.shopTracker.report) {
      window.HdSdk.shopTracker.report(eventId, data);
    }
  }
  function addToCartHdReport({
    spuId,
    skuId,
    num,
    price,
    name,
    page,
    event_status,
    modalType,
    variant,
    collectionId,
    collectionName,
    position,
    dataId,
    eventID,
    cartId
  }) {
    report('60006263', {
      page,
      event_name: 'additem',
      event_category: 'cart',
      product_type: 'product',
      product_id: spuId,
      variantion_id: skuId,
      quantity: num,
      currency: getCurrencyCode(),
      price: convertPrice(price),
      product_name: name,
      event_status,
      cart_id: cartId
    });
    newHdReportData({
      addtocartType: 'addtocart',
      currency: getCurrencyCode(),
      price,
      page,
      skuId,
      spuId,
      num,
      modalType,
      variant,
      collectionId,
      collectionName,
      position,
      dataId,
      eventID,
      cartId,
      moreInfo: {
        event_status
      }
    });
  }
  _exports.addToCartHdReport = addToCartHdReport;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/detail/js/float-button.js'] = window.SLM['product/detail/js/float-button.js'] || function () {
  const _exports = {};
  const PaymentButton = window['SLM']['theme-shared/components/pay-button/payment-button/index.js'].default;
  const isMobile = window['SLM']['commons/utils/isMobile.js'].default;
  class FloatButton {
    constructor({
      id
    }) {
      this.id = id;
      this.floatButton = $('.JProductButton_float');
      this.embedButton = $('.JProductButton_embed');
      this.buttonLayout = 'embed';
      this.triggerScrollHeight = 0;
      this.initFloatButton();
      this.setFloatButtonPosition();
      this.setFloatButtonPlaceholder();
      this.bindFloatButtonEvent();
    }
    initFloatButton() {
      this.buttonLayout = $(`#product-button-list_${this.id}`).data('buy-button-layout');
      $(window).on('resize', () => {
        this.setFloatButtonPosition();
        this.setFloatButtonPlaceholder();
      });
    }
    extraHandleFloatButtonStyle(id, config) {
      if (isMobile()) {
        config.displayButtonCount = 1;
        config.props.layout = 'buyNowRow';
        config.props.extraBuyNowDomId = `pay-button-theme-buy-now-float-${id}`;
      }
    }
    async initPayButton(mainPayButtonConfig) {
      const domId = `payment_button_${this.id}--float`;
      const shouldInit = $(`#${domId}`).length > 0;
      if (!shouldInit) {
        return;
      }
      const height = this.floatButton.find('.add-to-cart').outerHeight();
      const floatPayButtonConfig = {
        ...mainPayButtonConfig,
        domId
      };
      floatPayButtonConfig.props.style.height = height;
      this.extraHandleFloatButtonStyle(this.id, floatPayButtonConfig);
      this.payButton = new PaymentButton(floatPayButtonConfig);
      await this.payButton.render();
      this.payButton.customButtons({
        BUY_NOW: {
          className: 'btn-lg buy-now-auto-height'
        },
        MORE_OPTIONS: {
          className: 'payment-button-options__btn'
        }
      });
    }
    setDisabled(flag) {
      if (this.payButton) {
        this.payButton.setDisabled(flag);
      }
    }
    setVisible(flag) {
      if (this.payButton) {
        this.payButton.setVisible(flag);
      }
    }
    setFloatButtonPosition() {
      const footerNav = $('#shopline-section-footer-tab .footer-tab');
      const offsetBottom = footerNav.length ? footerNav.height() : 0;
      this.floatButton.css('bottom', offsetBottom);
    }
    setFloatButtonPlaceholder() {
      const floatBtnHeight = this.floatButton.outerHeight();
      const floatButtonPlaceholder = $('#product-float-button-placehloder');
      if (floatButtonPlaceholder.length > 0) {
        floatButtonPlaceholder.css('height', `${floatBtnHeight}px`);
      } else {
        $('body').append(`<div id="product-float-button-placehloder" class="d-md-none" style="height: ${floatBtnHeight}px"></div>`);
      }
    }
    bindFloatButtonEvent() {
      if (this.buttonLayout === 'float') {
        this.floatButton.addClass('show');
      } else if (this.buttonLayout === 'both') {
        $(window).on('scroll', this.scrollWorker.bind(this));
      }
    }
    scrollWorker() {
      requestAnimationFrame(() => {
        this.triggerScrollHeight = this.embedButton.length ? this.embedButton.offset().top : 0;
        const buffer = 30;
        if (window.scrollY > this.triggerScrollHeight + buffer) {
          this.floatButton.addClass('show');
        } else {
          this.floatButton.removeClass('show');
        }
      });
    }
    destory() {
      $(window).off('resize', this.setFloatButtonPosition.bind(this));
      $(window).off('scroll', this.scrollWorker.bind(this));
    }
    inFloatButton($btn) {
      return $btn.hasClass('JFloatButton_AddToCart');
    }
  }
  _exports.default = FloatButton;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/detail/js/product-button.js'] = window.SLM['product/detail/js/product-button.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const pageMapping = window['SLM']['theme-shared/utils/report/pageMapping.js'].default;
  const { getEventID } = window['SLM']['theme-shared/utils/report/tool.js'];
  const { setSyncData } = window['SLM']['theme-shared/utils/dataAccessor.js'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const get = window['lodash']['get'];
  const { getCartId } = window['SLM']['theme-shared/report/product/utils/index.js'];
  const getCurrencyCode = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'].default;
  const { convertPrice } = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'];
  const newCurrency = window['SLM']['theme-shared/utils/newCurrency/index.js'].default;
  const PaymentButton = window['SLM']['theme-shared/components/pay-button/payment-button/index.js'].default;
  const { ADD_TO_CART } = window['SLM']['commons/cart/globalEvent.js'];
  const Toast = window['SLM']['commons/components/toast/index.js'].default;
  const debounce = window['SLM']['commons/utils/debounce.js'].default;
  const { addToCartThirdReport, addToCartHdReport } = window['SLM']['product/detail/js/product-button-report.js'];
  const FloatButton = window['SLM']['product/detail/js/float-button.js'].default;
  const isMobile = window['SLM']['commons/utils/isMobile.js'].default;
  function getHdSdkDateId() {
    return window.HdSdk && window.HdSdk.shopTracker && window.HdSdk.shopTracker.getDataId && window.HdSdk.shopTracker.getDataId();
  }
  const getVariant = (skuAttributeIds, skuAttributeMap) => {
    if (Array.isArray(skuAttributeIds)) {
      const ids = skuAttributeIds.map(item => {
        if (item && skuAttributeMap) {
          return get(skuAttributeMap[item.id], `skuAttributeValueMap[${item.valueId}].defaultValue`);
        }
        return undefined;
      });
      return ids.toString();
    }
  };
  _exports.getVariant = getVariant;
  const setChannel = () => {
    setSyncData({
      orderFrom: 'web'
    });
  };
  class ButtonEvent {
    constructor(props) {
      this.init(props);
      this.initPayButton(props);
    }
    getButtonStyleBySetting(id) {
      const {
        btn_border_thickness,
        btn_border_radius
      } = window.Shopline.theme.settings;
      const borderRadius = btn_border_thickness + btn_border_radius;
      return {
        height: $(`#pay-button-theme-add-to-cart-${id} button`).outerHeight(),
        borderRadius
      };
    }
    extraHandleQuickAddModalButtonStyle(id, config) {
      if (id && id.includes('product_quick_add_') && isMobile()) {
        config.displayButtonCount = 1;
        config.props.layout = 'buyNowRow';
        config.props.extraBuyNowDomId = `pay-button-theme-buy-now-${id}`;
      }
    }
    init(props) {
      const {
        id,
        cartRoot,
        soldOutRoot,
        spu,
        onAddSuccess,
        onAddError,
        sku,
        modalType,
        position
      } = props;
      this.getReportCartId();
      this.addButton = cartRoot;
      this.addLoadingStatus = false;
      this.soldOutRoot = soldOutRoot;
      this.onAddSuccess = onAddSuccess;
      this.onAddError = onAddError;
      this.spu = spu;
      this.sku = sku;
      this.id = id;
      this.floatButton = new FloatButton({
        id
      });
      this.initEvent();
      this.toast = new Toast();
      this.initLoading();
      this.num = 1;
      this.page = String(id).startsWith('productRecommendModal') ? '123' : pageMapping[SL_State.get('templateAlias')];
      this.modalType = modalType;
      this.position = position;
    }
    async initPayButton(props) {
      const payButtonContainerId = `payment_button_${props.id}`;
      const payButtonContainer = document.getElementById(payButtonContainerId);
      if (!payButtonContainer) return;
      const getPurchaseSDKAction = (key, FnName) => {
        const action = get(window, `productPurchaseSDK.channel.${FnName}.${key}`);
        return action;
      };
      const buttonStyle = this.getButtonStyleBySetting(props.id);
      const config = {
        domId: payButtonContainerId,
        props: {
          isVisible: payButtonContainer.dataset.isSoldOut === 'false',
          style: {
            height: buttonStyle.height,
            'border-radius': buttonStyle.borderRadius
          }
        },
        products: async () => {
          let defaultProductData = this.transProducts(this.products);
          const purchaseProductDataAction = getPurchaseSDKAction(this.id, 'getCheckoutDataMap');
          if (purchaseProductDataAction) {
            defaultProductData = (await purchaseProductDataAction()).products;
          }
          return defaultProductData;
        },
        afterSaveAbandonedOrder: resp => {
          const action = getPurchaseSDKAction(this.id, 'onCheckoutSuccessMap');
          if (action) {
            action(resp);
          }
        }
      };
      this.extraHandleQuickAddModalButtonStyle(props.id, config);
      this.payButton = new PaymentButton(config);
      await this.payButton.render();
      this.payButton.customButtons({
        BUY_NOW: {
          className: 'btn-lg buy-now-auto-height'
        },
        MORE_OPTIONS: {
          className: 'payment-button-options__btn'
        }
      });
      await this.floatButton.initPayButton(config);
      if (!this.activeSku) {
        this.payButton.setDisabled(true);
        this.floatButton.setDisabled(true);
      }
    }
    async getReportCartId() {
      this.cartId = await getCartId();
    }
    initLoading() {
      this.addLoading = new Toast({
        duration: 0,
        target: this.addButton,
        type: 'loading',
        className: 'product_add_loading'
      });
      this.addLoading.close();
    }
    transProducts(products = []) {
      return products.map(item => ({
        productNum: item.num,
        productSeq: item.spuId,
        productSku: item.skuId,
        productPrice: item.price
      }));
    }
    setLoading(button, loading) {
      const dom = this.addButton;
      const loadingName = `${button}Loading`;
      if (loading) {
        $(dom).find('.pdp_button_text').addClass('loading');
        this[loadingName].open();
        $(`.product_${button}_loading`).find('.mp-loading__circular path').css({
          stroke: $(dom).css('color')
        });
      } else {
        this[loadingName].close();
        $(dom).find('.pdp_button_text').removeClass('loading');
      }
      this[`${loadingName}Status`] = loading;
    }
    handleATCSuccess() {
      const cartOpenType = window.SL_State.get('theme.settings.cart_open_type');
      const addBtnColor = $(this.addButton).css('color');
      if (cartOpenType === 'cartremain') {
        const addLoadingInstance = this.addLoading;
        if (addLoadingInstance && addLoadingInstance.showSuccessAni) {
          addLoadingInstance.showSuccessAni({
            loadingColor: addBtnColor
          }, () => {
            this.onAddSuccess && this.onAddSuccess();
          });
        } else {
          console.error(`judgeCartOpenTypeByATCStatus: add loading instance ${addLoadingInstance}`);
        }
      } else {
        this.onAddSuccess && this.onAddSuccess();
      }
    }
    initEvent() {
      const $this = this;
      $(this.addButton).on('click', debounce(300, () => {
        if ($this.isPreview()) {
          this.toast.open(t('products.product_details.link_preview_does_not_support'));
          return;
        }
        if (!this.activeSku) {
          this.toast.open(t('products.product_list.select_product_all_options'));
          return;
        }
        if (this.addLoadingStatus) {
          return;
        }
        this.setLoading('add', true);
        const {
          spuSeq: spuId,
          skuSeq: skuId,
          name,
          price
        } = this.activeSku;
        const {
          num,
          spu
        } = this;
        const dataId = getHdSdkDateId();
        const eventID = getEventID();
        const hdReportData = {
          page: this.page,
          spuId,
          skuId,
          num,
          price,
          name,
          modalType: this.modalType,
          variant: getVariant(get(this, 'activeSku.skuAttributeIds'), get(this, 'sku.skuAttributeMap')),
          collectionId: get(this, 'spu.sortationList[0].sortationId'),
          collectionName: get(this, 'spu.sortationList[0].sortationName'),
          position: this.position,
          dataId,
          eventID,
          cartId: this.cartId
        };
        window.SL_EventBus.emit(ADD_TO_CART, {
          spuId,
          skuId,
          num,
          currency: getCurrencyCode(),
          price: newCurrency.unformatCurrency(convertPrice(price)),
          name,
          eventID: `addToCart${eventID}`,
          reportParamsExt: {
            dataId,
            eventName: 'AddToCart'
          },
          error: (...e) => {
            addToCartHdReport({
              ...hdReportData,
              event_status: 0
            });
            this.onAddError(...e);
          },
          success: () => {
            setChannel();
            addToCartHdReport({
              ...hdReportData,
              event_status: 1
            });
            addToCartThirdReport({
              spuId,
              name,
              price,
              skuId,
              num,
              eventID,
              variant: getVariant(get(this, 'activeSku.skuAttributeIds'), get(this, 'sku.skuAttributeMap')),
              spu
            });
            this.handleATCSuccess();
          },
          complete: () => {
            this.setLoading('add', false);
          }
        });
      }));
    }
    setActiveSku(sku) {
      this.activeSku = sku ? {
        ...sku,
        name: this.spu.title
      } : null;
      this.setPayButtonDisabled();
      if (sku) {
        this.setTradeButtonHide(sku.soldOut);
        if (this.payButton) {
          this.payButton.setVisible(!sku.soldOut);
          this.floatButton.setVisible(!sku.soldOut);
        }
      }
    }
    setActiveSkuNum(num) {
      this.num = num;
    }
    setPayButtonDisabled() {
      if (!this.activeSku) {
        if (this.payButton) {
          this.payButton.setDisabled(true);
          this.floatButton.setDisabled(true);
        }
        return;
      }
      if (this.payButton) {
        this.payButton.setDisabled(false);
        this.floatButton.setDisabled(false);
      }
    }
    get products() {
      return [{
        spuId: get(this, 'activeSku.spuSeq'),
        skuId: get(this, 'activeSku.skuSeq'),
        num: this.num,
        name: get(this, 'spu.title'),
        price: get(this, 'activeSku.price')
      }];
    }
    setTradeButtonHide(show) {
      if (!show) {
        $(this.addButton).removeClass('hide');
        $(this.soldOutRoot).addClass('hide');
        return;
      }
      $(this.addButton).addClass('hide');
      $(this.soldOutRoot).removeClass('hide');
    }
    isPreview() {
      return window.SL_State && window.SL_State.get('templateAlias') === 'PreviewProductsDetail';
    }
    destroy() {
      this.floatButton.destory();
    }
  }
  _exports.default = ButtonEvent;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/sku/DataWatcher.js'] = window.SLM['theme-shared/utils/sku/DataWatcher.js'] || function () {
  const _exports = {};
  class DataWatcher {
    constructor() {
      Object.defineProperty(this, '$watcher', {
        value: {}
      });
      Object.defineProperty(this, '$afterWatcher', {
        value: {}
      });
      Object.defineProperty(this, '$data', {
        value: {}
      });
      const bindWatcher = type => (keys, callback) => {
        const props = {};
        keys.forEach(key => {
          if (!this.$watcher[key]) {
            this.$watcher[key] = [];
          }
          if (!this.$afterWatcher[key]) {
            this.$afterWatcher[key] = [];
          }
          if (type === 'watch') {
            this.$watcher[key].push(callback);
          } else if (type === 'watchAfter') {
            this.$afterWatcher[key].push(callback);
          }
          if (Object.prototype.hasOwnProperty.call(this.$data, key)) {
            return;
          }
          this.$data[key] = this[key];
          delete this[key];
          props[key] = {
            set: value => {
              this.$data[key] = value;
              this.$watcher[key].forEach(w => {
                try {
                  w && w(value, key);
                } catch (e) {
                  console.error(e);
                }
              });
              this.$afterWatcher[key].forEach(w => {
                try {
                  w && w(value, key);
                } catch (e) {
                  console.error(e);
                }
              });
            },
            get: () => this.$data[key]
          };
        });
        Object.defineProperties(this, props);
      };
      Object.defineProperty(this, 'watch', {
        value: bindWatcher('watch')
      });
      Object.defineProperty(this, 'watchAfter', {
        value: bindWatcher('watchAfter')
      });
    }
  }
  _exports.default = DataWatcher;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/flashSale/index.js'] = window.SLM['theme-shared/components/hbs/flashSale/index.js'] || function () {
  const _exports = {};
  const get = window['lodash']['get'];
  const Toast = window['SLM']['theme-shared/components/hbs/shared/components/toast/index.js'].default;
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const EVENT_BUS = {
    QUANTITY_ADD_EVENT: 'product:quantity:add',
    QUANTITY_MINUS_EVENT: 'product:quantity:minus',
    QUANTITY_MODIFY_EVENT: 'product:quantity:modify',
    SKU_INIT_EVENT: 'product:sku:init',
    SKU_CHANGE_EVENT: 'product:sku:change',
    SKU_UPDATE_EVENT: 'Product::SkuUpdate'
  };
  const TOAST_TYPE = {
    ACTIVE_PURCHASE_LIMIITED: 1,
    PRODUCT_PURCHASE_LIMIITED: 2,
    ACTIVE_NOSTOCK: -1
  };
  const template = saleBuyLimitConfig => {
    const {
      userLimitedType,
      acquirePerUserLimit
    } = saleBuyLimitConfig || {};
    switch (userLimitedType) {
      case TOAST_TYPE.ACTIVE_PURCHASE_LIMIITED:
        return t('products.product_details.activity_toast_product__limit', {
          stock: acquirePerUserLimit > 0 ? acquirePerUserLimit : '0'
        });
      case TOAST_TYPE.PRODUCT_PURCHASE_LIMIITED:
        return t('products.product_details.activity_toast_price_limit', {
          num: acquirePerUserLimit > 0 ? acquirePerUserLimit : '0'
        });
      case TOAST_TYPE.ACTIVE_NOSTOCK:
        return t('products.product_details.activity_toast_title__limit');
      default:
        return '';
    }
  };
  const defaultOption = {
    id: '',
    productInfo: {}
  };
  class FlashSale {
    constructor(option = {}) {
      this.option = {
        ...defaultOption,
        ...option
      };
      this.option.productInfo[this.option.id] = {};
      this.init();
    }
    init() {
      this.toast = new Toast();
      this.bindEventListener();
    }
    bindEventListener() {
      window.SL_EventBus.on(EVENT_BUS.QUANTITY_ADD_EVENT, ([value, selector]) => {
        if (this.checkData({
          selector
        })) {
          this.getProductNum(value);
          this.showTips(value);
        }
      });
      window.SL_EventBus.on(EVENT_BUS.QUANTITY_MINUS_EVENT, ([value, selector]) => {
        if (this.checkData({
          selector
        })) {
          this.getProductNum(value);
          this.showTips(value);
        }
      });
      window.SL_EventBus.on(EVENT_BUS.QUANTITY_MODIFY_EVENT, ([value, overStockLimit, selector]) => {
        if (this.checkData({
          selector
        })) {
          this.getProductNum(value);
          if (!overStockLimit) {
            this.showTips(value);
          }
        }
      });
      window.SL_EventBus.on(EVENT_BUS.SKU_INIT_EVENT, ([sku, id]) => {
        if (this.checkData({
          id
        })) {
          this.dataProcess(sku);
        }
      });
      window.SL_EventBus.on(EVENT_BUS.SKU_CHANGE_EVENT, ([sku, id]) => {
        if (this.checkData({
          id
        })) {
          this.dataProcess(sku);
          this.showTips(this.option.productInfo[this.option.id].productNum);
          this.compareStock(sku);
        }
      });
      window.Shopline.event.on(EVENT_BUS.SKU_UPDATE_EVENT, ({
        activeSku,
        id
      }) => {
        if (this.checkData({
          id
        })) {
          this.dataProcess(activeSku);
          this.showTips(this.option.productInfo[this.option.id].productNum);
          this.compareStock(activeSku);
        }
      });
    }
    compareStock(sku) {
      const {
        stock
      } = sku || {};
      if (stock <= this.option.productInfo[this.option.id].productNum) {
        this.option.productInfo[this.option.id].productNum = stock;
      }
    }
    checkData(data) {
      const {
        id,
        selector
      } = data || {};
      if (id === this.option.id || selector && selector.attr('id') && selector.attr('id').indexOf(this.option.id) > -1) {
        return true;
      }
      return false;
    }
    getProductNum(value) {
      this.option.productInfo[this.option.id].productNum = value;
    }
    dataProcess(sku) {
      const prdInfo = this.option.productInfo[this.option.id];
      const {
        saleActivityResponseList,
        stock
      } = sku || {};
      if (!saleActivityResponseList) {
        this.option.productInfo[this.option.id] = {};
        return;
      }
      Array.isArray(saleActivityResponseList) && saleActivityResponseList.forEach(item => {
        const {
          promotionType,
          promotionSubType,
          saleBuyLimitConfig
        } = item || {};
        if (promotionType === 1 && promotionSubType === 1) {
          this.option.productInfo[this.option.id].activeTip = !get(item, 'saleBuyLimitConfig.allowBuyOverLimit') ? template(saleBuyLimitConfig) : '';
          prdInfo.promotionRemainStock = get(item, 'skuPromotionProduct.promotionRemainStock');
          prdInfo.userRemainBuyCount = get(item, 'skuPromotionProduct.userRemainBuyCount');
        }
      });
      prdInfo.stock = stock;
    }
    showTips(value) {
      const prdInfo = this.option.productInfo[this.option.id] || {};
      if (prdInfo.activeTip && prdInfo.promotionRemainStock !== -1 && prdInfo.promotionRemainStock < value) {
        this.toast.open(template({
          userLimitedType: -1
        }));
      } else if (prdInfo.activeTip && prdInfo.userRemainBuyCount < value) {
        this.toast.open(prdInfo.activeTip);
      }
    }
  }
  _exports.default = FlashSale;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/commons/js/sku-stepper.js'] = window.SLM['product/commons/js/sku-stepper.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const Toast = window['SLM']['commons/components/toast/index.js'].default;
  class SkuStepper {
    constructor({
      root,
      value,
      min,
      max,
      domReady,
      disabled,
      onChange,
      step = 1,
      showOverStockToast = true,
      showMoqToast = false
    }) {
      this.root = root;
      this.data = {
        min,
        max,
        step,
        disabled,
        value,
        showOverStockToast,
        showMoqToast
      };
      this.onChange = onChange;
      this.init(domReady);
    }
    init(domReady) {
      if (domReady) {
        this.$stepper = $(this.root);
        this.initEvent();
      } else {
        this.createAndInitDom();
      }
      this.toast = new Toast();
    }
    initEvent() {
      if (this.data.disabled) return;
      this.$stepper.children('.stepper-before').on('click', () => {
        if (this.data.min < this.data.value) {
          this.data.value -= this.data.step;
          if (this.data.value < this.data.min) {
            this.data.value = this.data.min;
          }
          this.render();
          window.SL_EventBus.emit('product:quantity:minus', [this.data.value, this.root]);
        }
      });
      this.$stepper.children('.stepper-after').on('click', () => {
        if (this.data.value < this.data.max) {
          this.data.value += this.data.step;
          if (this.data.value > this.data.max) {
            this.data.value = this.data.max;
          }
          this.render();
          window.SL_EventBus.emit('product:quantity:add', [this.data.value, this.root]);
        }
      });
      this.$stepper.children('.stepper-input').on('input', e => {
        const filerValue = e.target.value.replace(/[^\d]/g, '');
        const value = filerValue ? Number(filerValue) : filerValue;
        this.data.value = value;
        this.render();
      });
      this.$stepper.children('.stepper-input').on('blur', e => {
        const value = Number(e.target.value);
        this.processNewInputValue(value);
      });
    }
    processNewInputValue(value) {
      let overStockLimit = 0;
      let isReset = 1;
      if (value > this.data.max) {
        this.data.value = this.data.max;
        if (!this.data.disabled) {
          overStockLimit = 1;
          if (this.data.showOverStockToast) {
            this.toast.open(t('cart.stock.limit', {
              stock: this.data.max
            }), 1000);
          }
        }
        if (this.data.showMoqToast && this.$stepper[0]) {
          this.toast.open(t('products.product_details.moq_max_tips', {
            num: this.data.max
          }), 2500);
        }
      } else if (this.data.min > value) {
        this.data.value = this.data.min;
        if (this.data.showMoqToast && this.$stepper[0]) {
          this.toast.open(t('products.product_details.moq_min_tips', {
            num: this.data.min
          }), 2500);
        }
      } else if (value % this.data.step !== 0 && this.data.showMoqToast) {
        this.data.value = value - value % this.data.step;
        if (this.data.showMoqToast && this.$stepper[0]) {
          this.toast.open(t('products.product_details.moq_increment_tips', {
            num: this.data.step
          }), 2500);
        }
      } else {
        isReset = 0;
      }
      window.SL_EventBus.emit('product:quantity:modify', [this.data.value, overStockLimit, this.root]);
      if (isReset) {
        this.render();
      }
    }
    createAndInitDom() {
      $(this.root).html(`<div>stepper</div>`);
    }
    setSingleDisabled(position, disabled) {
      if (disabled) {
        this.$stepper.children(`.stepper-${position}`).addClass('disabled');
      } else {
        this.$stepper.children(`.stepper-${position}`).removeClass('disabled');
      }
    }
    setStepperDisabled() {
      if (this.data.disabled) {
        this.$stepper.addClass('disabled');
      } else {
        this.$stepper.removeClass('disabled');
      }
    }
    setStepperData(obj) {
      this.data = {
        ...this.data,
        ...obj
      };
      this.render();
    }
    render() {
      if (this.data.value) {
        this.setSingleDisabled('before', this.data.min >= this.data.value);
        this.setSingleDisabled('after', this.data.max <= this.data.value);
      }
      this.$stepper.children('.stepper-input').val(this.data.value);
      this.onChange(this.data.value);
    }
  }
  _exports.default = SkuStepper;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/utils/convertPrice.js'] = window.SLM['commons/utils/convertPrice.js'] || function () {
  const _exports = {};
  const currency = window['SLM']['theme-shared/utils/newCurrency/index.js'].default;
  const {
    convertFormat,
    getConvertPrice
  } = currency;
  function convertPrice(price, {
    code,
    lang
  }) {
    const formattedPrice = convertFormat(price);
    if (code === null || code === undefined) {
      code = window.SL_State.get('currencyCode');
    }
    if (lang === null || lang === undefined) {
      lang = window.SL_State.get('request.locale');
    }
    const {
      symbolOrder,
      currencySymbol,
      integer,
      decimal,
      fraction
    } = getConvertPrice(price, {
      code,
      lang
    });
    return {
      symbolIsPrefix: symbolOrder === 'prefix',
      symbol: currencySymbol,
      integer,
      decimal,
      fraction,
      origin: formattedPrice
    };
  }
  _exports.convertPrice = convertPrice;
  function processPrice($el, price, {
    isSavePrice,
    code,
    lang
  } = {}) {
    const {
      origin
    } = convertPrice(price, {
      code,
      lang
    });
    let content = '';
    const renderSavePrice = () => {
      return `<span class="notranslate">${origin}</span>`;
    };
    content = `<span class="notranslate">${origin}</span>`;
    if (isSavePrice) {
      content = renderSavePrice();
    }
    return {
      render: () => {
        $el.html(content);
      },
      get: () => content
    };
  }
  _exports.processPrice = processPrice;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/detail/js/product-quantity.js'] = window.SLM['product/detail/js/product-quantity.js'] || function () {
  const _exports = {};
  const DataWatcher = window['SLM']['theme-shared/utils/sku/DataWatcher.js'].default;
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const FlashSale = window['SLM']['theme-shared/components/hbs/flashSale/index.js'].default;
  const get = window['lodash']['get'];
  const SkuStepper = window['SLM']['product/commons/js/sku-stepper.js'].default;
  const { processPrice, convertPrice } = window['SLM']['commons/utils/convertPrice.js'];
  const initValue = 1;
  _exports.initValue = initValue;
  class SkuQuality {
    constructor({
      sku,
      spu,
      activeSku,
      id,
      onChange,
      dataPool,
      isCheckStock = true,
      isOpenFlashSale,
      fixedMax = 0,
      isShowTips = true
    }) {
      this.activeSku = activeSku;
      this.sku = sku;
      this.spu = spu;
      this.id = id;
      this.root = `#product-detail-sku-quantity_${id}`;
      this.isOpenFlashSale = isOpenFlashSale || $(`#has-b2b-plugin-${id}`).length <= 0;
      this.dataPool = dataPool || new DataWatcher();
      this.onChange = onChange;
      this.isCheckStock = isCheckStock;
      this.fixedMax = fixedMax;
      this.isShowTips = isShowTips;
      this.productHasQuantityRule = get(this.sku, 'skuList.length') ? this.sku.skuList.some(skuItem => {
        return skuItem.quantity_rule && (skuItem.quantity_rule.min > 1 || skuItem.quantity_rule.increment > 1 || skuItem.quantity_rule.max);
      }) : false;
      this.init();
    }
    getMax(hasQuantityRule = false) {
      if (this.fixedMax) {
        return this.fixedMax;
      }
      if (!this.activeSku) {
        return 99999;
      }
      if (hasQuantityRule) {
        return 99999 - 99999 % (this.activeSku.quantity_rule.increment || 1);
      }
      if (this.isTrackStock() && this.isCheckStock) {
        return this.activeSku.stock > 0 ? Math.min(99999, this.activeSku.stock) : 1;
      }
      return 99999;
    }
    isTrackStock() {
      return !get(this.activeSku, 'infiniteStock') && !get(this.activeSku, 'allowOversold');
    }
    init() {
      const $quantityInput = document.querySelector(`${this.root} input`);
      this.skuStepper = new SkuStepper({
        domReady: true,
        root: $(`#product-detail-sku-stepper_${this.id}`),
        max: this.getMax(),
        value: $quantityInput ? +$quantityInput.value : initValue,
        min: 1,
        disabled: get(this.spu, 'soldOut') || this.isTrackStock() && this.activeSku && this.activeSku.stock < 1,
        showOverStockToast: this.isShowTips,
        onChange: num => {
          if (num !== this.dataPool.quantity) {
            this.dataPool.quantity = num;
          }
          this.onChange && this.onChange(num);
        }
      });
      if (this.isOpenFlashSale) {
        new FlashSale({
          id: `${this.id}`
        }).init();
      }
      this.dataPool.quantity = $quantityInput ? $quantityInput.value : initValue;
      this.dataPool.watch(['quantity'], () => {
        this.setCurrentNum(this.dataPool.quantity);
        this.renderHitPrice();
      });
    }
    render() {
      if (this.isShowTips) {
        const showTips = this.isTrackStock() && this.activeSku && this.activeSku.stock < 10 && this.activeSku.stock > 0;
        if (showTips) {
          const content = t(`cart.stock.limit`, {
            stock: this.activeSku.stock
          });
          this.setErrorTips(showTips, content);
        } else {
          this.setErrorTips(showTips);
        }
      } else {
        let content = '';
        if (!this.activeSku) {
          content = '0';
          $(`#product-in-stock_${this.id} .stock-num`).html(content);
          $(`#product-in-stock_${this.id}`).addClass('stock-hide');
        } else {
          if (this.activeSku.infiniteStock) {
            content = t('products.product_details.in_stock');
          } else if (!this.activeSku.infiniteStock && !this.activeSku.allowOversold) {
            if (this.activeSku.stock >= 0) {
              content = this.activeSku.stock > 99999 ? 99999 : this.activeSku.stock;
            } else {
              content = 0;
            }
          } else if (!this.activeSku.infiniteStock && this.activeSku.allowOversold) {
            content = t('products.product_details.in_stock');
          }
          $(`#product-in-stock_${this.id} .stock-num`).html(content);
          $(`#product-in-stock_${this.id}`).removeClass('stock-hide');
        }
      }
      this.renderGradsPrice();
      this.renderQuantityRule();
      this.renderHitPrice();
    }
    setErrorTips(show, content) {
      if (show) {
        $(this.root).parent('.product-sku-quantity__container').children('.stepper-tip').html(content).removeClass('d-none');
      } else {
        $(this.root).parent('.product-sku-quantity__container').children('.stepper-tip').addClass('d-none');
      }
    }
    setCurrentNum(num) {
      const data = {
        ...this.skuStepper.data,
        value: num
      };
      this.skuStepper.setStepperData(data);
    }
    setActiveSku(sku) {
      let current = this.skuStepper.data.value < 0 ? 1 : this.skuStepper.data.value;
      if (!sku) {
        this.activeSku = null;
        const stepperData = this.productHasQuantityRule ? {
          value: current,
          max: this.fixedMax || 99999,
          disabled: false,
          step: 1,
          showOverStockToast: true,
          showMoqToast: false,
          min: 1
        } : {
          value: current,
          max: this.fixedMax || 99999,
          disabled: false
        };
        this.skuStepper.setStepperData(stepperData);
        this.render();
        return;
      }
      this.activeSku = sku;
      const hasQuantityRule = this.activeSku.quantity_rule && (this.activeSku.quantity_rule.min > 1 || this.activeSku.quantity_rule.increment > 1 || this.activeSku.quantity_rule.max);
      if (current > this.getMax() && !hasQuantityRule) {
        current = this.getMax();
        if (!sku.soldOut && this.isShowTips) {
          this.skuStepper.toast.open(t(`cart.stock.limit`, {
            stock: current
          }), 1000);
        }
      }
      if (!document.querySelector(this.root) && this.productHasQuantityRule) {
        current = get(this.activeSku, 'quantity_rule.min') || 1;
      }
      const stepperData = this.productHasQuantityRule ? {
        value: current,
        max: get(this.activeSku, 'quantity_rule.max') ? get(this.activeSku, 'quantity_rule.max') : this.getMax(hasQuantityRule),
        disabled: !this.activeSku.quantity_rule && (this.spu.soldOut || this.isTrackStock() && this.activeSku.stock < 1),
        step: this.activeSku.quantity_rule ? this.activeSku.quantity_rule.increment : 1,
        min: get(this.activeSku, 'quantity_rule.min') ? get(this.activeSku, 'quantity_rule.min') : 1,
        showOverStockToast: !hasQuantityRule,
        showMoqToast: hasQuantityRule
      } : {
        value: current,
        max: this.getMax(),
        disabled: this.spu.soldOut || this.isTrackStock() && this.activeSku && this.activeSku.stock < 1
      };
      this.skuStepper.setStepperData(stepperData);
      if (hasQuantityRule) {
        this.skuStepper.processNewInputValue(current);
      }
      this.render();
    }
    renderGradsPrice() {
      const $gradsContainer = $(this.root).parent('.product-sku-quantity__container').children(' .product-moq-grads-price')[0];
      if (!$gradsContainer) return;
      if (!this.activeSku || !get(this.activeSku, 'quantity_price_breaks.length')) {
        $gradsContainer.classList.add('hide');
        return;
      }
      let gradsContentStr = `
    <div class="product-moq-grads-price-row">
      <div class="product-moq-grads-price-content">${t(`products.product_details.amount`)}</div>
      <div class="product-moq-grads-price-content">${t(`products.product_details.price`)}</div>
    </div>
    <div class="product-moq-grads-price-row">
        <div class="product-moq-grads-price-content">${get(this.activeSku, 'quantity_rule.min') || 1}+</div>
        <div class="product-moq-grads-price-content">
          ${t(`products.product_details.table_each_price`, {
        price: ` <span class="body1">${processPrice(null, this.activeSku.price).get()}</span>`
      })}
        </div>
    </div>`;
      this.activeSku.quantity_price_breaks.forEach(breakItem => {
        gradsContentStr += `
      <div class="product-moq-grads-price-row">
        <div class="product-moq-grads-price-content">${breakItem.minimum_quantity}+</div>
        <div class="product-moq-grads-price-content">
            ${t(`products.product_details.table_each_price`, {
          price: ` <span class="body1">${processPrice(null, breakItem.price).get()}</span>`
        })}
        </div>
    </div>`;
      });
      $gradsContainer.querySelector('.product-moq-grads-price-table').innerHTML = gradsContentStr;
      $gradsContainer.classList.remove('hide');
    }
    renderQuantityRule() {
      const $ruleContainer = $(this.root).parent('.product-sku-quantity__container').children(' .product-moq-quantity-rule')[0];
      const hasQuantityRule = get(this.activeSku, 'quantity_rule') && (this.activeSku.quantity_rule.min > 1 || this.activeSku.quantity_rule.increment > 1 || this.activeSku.quantity_rule.max);
      if (!$ruleContainer) return;
      if (!hasQuantityRule) {
        $ruleContainer.classList.add('hide');
        return;
      }
      let ruleStr = '';
      if (this.activeSku.quantity_rule.increment > 1) ruleStr += `${t(`products.product_details.moq_increment`, {
        num: this.activeSku.quantity_rule.increment
      })}`;
      if (this.activeSku.quantity_rule.min > 1) ruleStr += ` • ${t(`products.product_details.moq_minimum`, {
        num: this.activeSku.quantity_rule.min
      })}`;
      if (this.activeSku.quantity_rule.max > 1) ruleStr += ` • ${t(`products.product_details.moq_maximum`, {
        num: this.activeSku.quantity_rule.max
      })}`;
      $ruleContainer.innerHTML = ruleStr;
      $ruleContainer.classList.remove('hide');
    }
    renderHitPrice() {
      const $priceContainer = $(this.root).parent('.product-sku-quantity__container').children(` .product-sku-moq-price`)[0];
      if (!$priceContainer) return;
      if (!get(this.activeSku, 'quantity_price_breaks.length')) {
        $priceContainer.classList.add('hide');
        return;
      }
      let hitPrice = this.activeSku.price;
      if (this.dataPool.quantity >= this.activeSku.quantity_price_breaks[0].minimum_quantity) {
        const hitBreak = [...this.activeSku.quantity_price_breaks].reverse().find(breakItem => {
          return breakItem.minimum_quantity <= this.dataPool.quantity;
        });
        hitPrice = hitBreak.price;
      }
      $priceContainer.innerHTML = `${t(`products.product_details.each_price`, {
        price: convertPrice(hitPrice, {}).origin
      })}`;
      $priceContainer.classList.remove('hide');
    }
  }
  _exports.default = SkuQuality;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/utils/sku/skuUtil.js'] = window.SLM['product/utils/sku/skuUtil.js'] || function () {
  const _exports = {};
  class SkuUtil {
    constructor() {
      this.skuResult = {};
    }
    initSku(data) {
      if (!data) return {};
      const skuKeys = Object.keys(data);
      skuKeys.forEach(skuKey => {
        const sku = data[skuKey];
        const skuKeyAttrs = skuKey.split(';');
        const combArr = SkuUtil.combInFlags(skuKeyAttrs);
        combArr.forEach(item => {
          this.skuOptionAttrResult(item, sku);
        });
      });
      return this.skuResult;
    }
    static combInFlags(skuKeyAttrs) {
      if (!skuKeyAttrs || skuKeyAttrs.length <= 0) return [];
      const len = skuKeyAttrs.length;
      const result = [];
      for (let n = 1; n <= len; n++) {
        const flags = SkuUtil.getCombFlags(len, n);
        flags.forEach(flag => {
          const comb = [];
          flag.forEach((item, index) => {
            if (item === 1) {
              comb.push(skuKeyAttrs[index]);
            }
          });
          result.push(comb);
        });
      }
      return result;
    }
    static getCombFlags(m, n) {
      const flagArrs = [];
      const flagArr = [];
      let isEnd = false;
      for (let i = 0; i < m; i += 1) {
        flagArr[i] = i < n ? 1 : 0;
      }
      flagArrs.push(flagArr.concat());
      if (n && m > n) {
        while (!isEnd) {
          let leftCnt = 0;
          for (let i = 0; i < m - 1; i++) {
            if (flagArr[i] === 1 && flagArr[i + 1] === 0) {
              for (let j = 0; j < i; j++) {
                flagArr[j] = j < leftCnt ? 1 : 0;
              }
              flagArr[i] = 0;
              flagArr[i + 1] = 1;
              const aTmp = flagArr.concat();
              flagArrs.push(aTmp);
              if (aTmp.slice(-n).join('').indexOf('0') === -1) {
                isEnd = true;
              }
              break;
            }
            flagArr[i] === 1 && leftCnt++;
          }
        }
      }
      return flagArrs;
    }
    skuOptionAttrResult(combArrItem, sku) {
      const key = combArrItem.join(';');
      if (this.skuResult[key]) {
        const prevPrice = this.skuResult[key].price;
        const curPrice = [sku.price];
        this.skuResult[key] = {
          ...sku,
          price: prevPrice.concat(curPrice).sort(),
          stock: this.skuResult[key].stock + sku.stock
        };
      } else {
        this.skuResult[key] = {
          ...sku,
          price: [sku.price]
        };
      }
    }
    static filterValidArr(arr) {
      return arr.filter(item => item).map(item => item.id);
    }
    checkSpecAttrDisabled(selectSpecList, id, index) {
      if (!this.skuResult[id]) return true;
      const newSelectList = selectSpecList.map(item => item && {
        id: item
      });
      newSelectList[index] = {
        id: '',
        ...newSelectList[index]
      };
      if (Number(newSelectList[index].id) !== Number(id)) {
        newSelectList[index].id = id;
        const hitAttrKey = SkuUtil.filterValidArr(newSelectList).join(';');
        return !this.skuResult[hitAttrKey];
      }
    }
    checkSpecAttrActive(selectSpecList, name) {
      const newSelectList = selectSpecList.map(item => ({
        id: item
      }));
      return SkuUtil.filterValidArr(newSelectList).indexOf(name) !== -1 || SkuUtil.filterValidArr(newSelectList).indexOf(Number(name)) !== -1;
    }
    getActionSpecList(selectSpecList, item, index) {
      if (selectSpecList[index] && selectSpecList[index] === item.id) {
        selectSpecList[index] = null;
      } else {
        selectSpecList[index] = item.id;
      }
      if (selectSpecList.length) {
        return selectSpecList.slice();
      }
      return [];
    }
    getPrice(selectSpecList) {
      const skukey = SkuUtil.filterValidArr(selectSpecList).join(';');
      const hitSpecObj = this.skuResult[skukey];
      if (!hitSpecObj) return null;
      const priceArr = hitSpecObj.price;
      const maxPrice = Math.max(...priceArr);
      const minPrice = Math.min(...priceArr);
      return {
        minPrice,
        maxPrice
      };
    }
    getStock(selectSpecList) {
      const skukey = SkuUtil.filterValidArr(selectSpecList).join(';');
      const hitSpecObj = this.skuResult[skukey];
      if (!hitSpecObj) return null;
      return hitSpecObj.stock;
    }
  }
  _exports.default = SkuUtil;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/utils/sku/skuFilter.js'] = window.SLM['product/utils/sku/skuFilter.js'] || function () {
  const _exports = {};
  const get = window['lodash']['get'];
  function getSkuComMap(skuList) {
    const validSkuMap = {};
    const invalidSkuMap = {};
    if (!skuList) {
      return {
        validSkuMap,
        invalidSkuMap
      };
    }
    skuList.forEach((sku) => {
      if (sku.skuAttributeIds) {
        const skuKey = sku.skuAttributeIds.sort((a, b) => (a.attributeWeight || 0) - (b.attributeWeight || 0)).map(item => `${item.id}:${item.valueId}`).join(';');
        if (!sku.available) {
          invalidSkuMap[skuKey] = {
            ...sku
          };
        } else {
          validSkuMap[skuKey] = {
            price: sku.price,
            stock: sku.stock,
            skuSeq: sku.skuSeq,
            spuSeq: sku.spuSeq
          };
        }
      }
    });
    return {
      validSkuMap,
      invalidSkuMap
    };
  }
  _exports.getSkuComMap = getSkuComMap;
  function getSku(selectSkuArr, skuList, sourceSkuList) {
    const skuKey = selectSkuArr.map(item => item).join(';');
    if (!skuKey) return null;
    const hitSku = sourceSkuList.find(item => item.skuSeq === get(skuList[skuKey], 'skuSeq'));
    return hitSku || null;
  }
  _exports.getSku = getSku;
  function transSkuSpecList(skuAttributeMap) {
    const resultArr = [];
    if (!skuAttributeMap) {
      return resultArr;
    }
    Object.entries(skuAttributeMap).sort(([, a], [, b]) => (a.attributeWeight || 0) - (b.attributeWeight || 0)).forEach(([nameId, item]) => {
      const specAttrListResult = [];
      Object.entries(item.skuAttributeValueMap).sort(([, a], [, b]) => (a.attributeValueWeight || 0) - (b.attributeValueWeight || 0)).forEach(([attrId, attr]) => {
        const id = `${nameId}:${attrId}`;
        const name = attr.defaultValue;
        const imgUrl = attr.imgUrl || '';
        specAttrListResult.push({
          id,
          name,
          imgUrl
        });
      });
      const skuSpecObj = {
        hidden: item.hidden,
        nameId,
        specName: item.defaultName,
        specAttrList: specAttrListResult,
        onlyShowAttrImg: specAttrListResult.every(item => item.imgUrl)
      };
      resultArr.push(skuSpecObj);
    });
    return resultArr;
  }
  _exports.transSkuSpecList = transSkuSpecList;
  function getAttrValue(specList, currentAttrId, index) {
    if (!Array.isArray(specList)) return '';
    if (specList[index] && Array.isArray(specList[index].specAttrList)) {
      return specList[index].specAttrList.find(item => item.id === currentAttrId) || null;
    }
    return null;
  }
  _exports.getAttrValue = getAttrValue;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/commons/js/sku-trade/base-sku-trade.js'] = window.SLM['product/commons/js/sku-trade/base-sku-trade.js'] || function () {
  const _exports = {};
  const DataWatcher = window['SLM']['theme-shared/utils/sku/DataWatcher.js'].default;
  const get = window['lodash']['get'];
  const SkuUtil = window['SLM']['product/utils/sku/skuUtil.js'].default;
  const { getSku, getSkuComMap, transSkuSpecList, getAttrValue } = window['SLM']['product/utils/sku/skuFilter.js'];
  class BaseSkuTrade {
    constructor({
      sku,
      spu,
      initialSkuSeq,
      dataPool,
      modalContainer,
      root,
      domReady,
      onInit,
      onChange,
      onDestory,
      mixins
    }) {
      this.mixins = mixins;
      this.root = $(root);
      this.id = root.replace('#product-detail-sku-trade_', '');
      const quickViewModal = modalContainer ? modalContainer.find('.product-preview-modal-content') : null;
      const quickAddModal = modalContainer ? modalContainer.find('.quick-add-modal__container .mp-modal__body') : null;
      const isExistQuickViewModal = quickViewModal && quickViewModal.length > 0;
      this.targetContainer = isExistQuickViewModal ? quickViewModal : quickAddModal;
      if (dataPool) {
        this.dataPool = dataPool;
      } else {
        this.dataPool = new DataWatcher();
      }
      if (!this.dataPool.inited) {
        this.dataPool.sku = sku || {};
        this.dataPool.spu = spu || {};
        this.dataPool.attrArray = [];
        this.dataPool.currentSpecList = [];
        this.dataPool.skuType = '';
        this.dataPool.validSkuMap = {};
        this.dataPool.invalidSkuMap = {};
        this.dataPool.activeSku = null;
        this.dataPool.initialSkuSeq = initialSkuSeq;
      }
      this.onInit = onInit;
      this.onChange = onChange;
      this.onDestory = onDestory;
      this.init(domReady);
    }
    beforeInitDom() {
      if (Array.isArray(this.mixins)) {
        this.mixins.forEach(item => {
          if (item && item.beforeInitDom) {
            item.beforeInitDom.call(this, this);
          }
        });
      }
    }
    afterInitDom() {
      if (Array.isArray(this.mixins)) {
        this.mixins.forEach(item => {
          if (item && item.afterInitDom) {
            item.afterInitDom.call(this, this);
          }
        });
      }
    }
    beforeUpdate() {
      if (Array.isArray(this.mixins)) {
        this.mixins.forEach(item => {
          if (item && item.beforeUpdate) {
            item.beforeUpdate.call(this, this);
          }
        });
      }
    }
    afterUpdate() {
      if (Array.isArray(this.mixins)) {
        this.mixins.forEach(item => {
          if (item && item.afterUpdate) {
            item.afterUpdate.call(this, this);
          }
        });
      }
    }
    init(domReady) {
      if (!this.dataPool.inited) {
        this.dataPool.skuUtil = new SkuUtil();
        this.initAttrArray();
        this.initSkuComMap();
        this.initFirstChecked();
      }
      this.dataPool.watch(['currentSpecList'], () => {
        this.render();
      });
      this.beforeInitDom();
      if (domReady) {
        this.initDom();
      } else {
        this.createAndInitDom();
      }
      this.afterInitDom();
      this.render();
      this.dataPool.inited = true;
      window.Shopline.event.on('global:rerenderSku', ({
        sku,
        id
      }) => {
        if (id !== this.id) return;
        for (const skuItem of sku.skuList) {
          const hitIndex = this.dataPool.sku.skuList.findIndex(item => item.skuSeq === skuItem.skuSeq);
          if (hitIndex > -1) {
            this.dataPool.sku.skuList[hitIndex] = skuItem;
          }
        }
        this.dataPool.skuUtil.skuResult = {};
        this.initSkuComMap();
        this.render();
        if (this.dataPool.activeSku) {
          this.dataPool.activeSku = sku.skuList.find(item => {
            return item.skuSeq === this.dataPool.activeSku.skuSeq;
          });
        }
        window.Shopline.event.emit('Product::SkuUpdate', {
          activeSku: this.dataPool.activeSku,
          id,
          SkuTradeDataPool: this.dataPool
        });
      });
      try {
        this.onInit && this.onInit(this, this.dataPool.activeSku, this.root);
      } catch (e) {
        setTimeout(() => {
          throw e;
        });
      }
    }
    initSkuComMap() {
      const {
        validSkuMap,
        invalidSkuMap
      } = getSkuComMap(this.dataPool.sku.skuList);
      this.dataPool.validSkuMap = this.dataPool.skuUtil.initSku(validSkuMap);
      this.dataPool.invalidSkuMap = invalidSkuMap;
    }
    initAttrArray() {
      this.dataPool.attrArray = transSkuSpecList(this.dataPool.sku.skuAttributeMap);
      if (this.dataPool.attrArray.length) {
        this.dataPool.skuType = 'multi';
      } else {
        this.dataPool.skuType = 'single';
      }
    }
    isPreview() {
      return window.SL_State && window.SL_State.get('templateAlias') === 'PreviewProductsDetail';
    }
    initFirstChecked(allowNotAvailable) {
      if (this.dataPool.skuType === 'single') {
        [this.dataPool.activeSku] = this.dataPool.sku.skuList;
      } else {
        const {
          initialSkuSeq
        } = this.dataPool;
        if (initialSkuSeq) {
          const filterSkuList = this.dataPool.sku.skuList;
          const validSkuList = allowNotAvailable ? this.dataPool.sku.skuList : filterSkuList;
          if (validSkuList) {
            const hitSku = validSkuList.find(item => item.skuSeq === initialSkuSeq);
            if (hitSku) {
              this.dataPool.activeSku = hitSku;
              if (Array.isArray(hitSku.skuAttributeIds)) {
                this.dataPool.currentSpecList = hitSku.skuAttributeIds.map(item => `${item.id}:${item.valueId}`);
              }
            }
          }
        }
        this.dataPool.attrArray.forEach((spec, index) => {
          if (spec.hidden) {
            this.dataPool.currentSpecList[index] = spec.specAttrList[0].id;
          }
        });
      }
    }
    clearRoot() {
      if (this.root) {
        this.root.empty();
      }
    }
    getActiveSku() {
      if (this.dataPool.skuType === 'single') {
        return get(this, 'dataPool.sku.skuList[0]') || null;
      }
      if (this.dataPool.skuType === 'multi') {
        if (this.dataPool.currentSpecList.filter(Boolean).length === this.dataPool.attrArray.length) {
          return getSku(this.dataPool.currentSpecList, this.dataPool.validSkuMap, this.dataPool.sku.skuList) || getSku(this.dataPool.currentSpecList, this.dataPool.invalidSkuMap, this.dataPool.sku.skuList) || null;
        }
      }
      return null;
    }
    clickAttr(specIndex, attrIndex) {
      const item = get(this, `dataPool.attrArray[${specIndex}].specAttrList[${attrIndex}]`);
      this.dataPool.currentSpecList = this.dataPool.skuUtil.getActionSpecList(this.dataPool.currentSpecList, item, specIndex);
      const activeSku = this.getActiveSku();
      if (activeSku !== this.dataPool.activeSku) {
        this.dataPool.activeSku = activeSku;
      }
      try {
        this.onChange && this.onChange(activeSku);
      } catch (e) {
        setTimeout(() => {
          throw e;
        });
      }
    }
    getAttrValue(index) {
      return getAttrValue(this.dataPool.attrArray, this.dataPool.currentSpecList[index], index);
    }
    destory() {
      this.clearRoot();
      this.dataPool = null;
      this.root = null;
      this.onInit = null;
      this.onChange = null;
      this.onDestory && this.onDestory();
      this.onDestory = null;
    }
  }
  _exports.default = BaseSkuTrade;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/commons/js/sku-trade/sku-trade-flatten.js'] = window.SLM['product/commons/js/sku-trade/sku-trade-flatten.js'] || function () {
  const _exports = {};
  const get = window['lodash']['get'];
  const BaseSkuTrade = window['SLM']['product/commons/js/sku-trade/base-sku-trade.js'].default;
  const isMobile = window['SLM']['commons/utils/isMobile.js'].default;
  class SkuTrade extends BaseSkuTrade {
    getAttrValueName(index) {
      return get(this.getAttrValue(index), 'name');
    }
    initDom() {
      const isInMobile = isMobile();
      this.root.children('.spec-box').each((_, el) => {
        const box = $(el);
        const index = box.data('index');
        box.children('.attr-box').children('.attr-value').each((__, valueEl) => {
          const valueJQ = $(valueEl);
          const i = valueJQ.data('index');
          valueJQ.on('click', () => {
            this.clickAttr(index, i);
          });
          const specItem = this.dataPool.attrArray[index];
          if (!isInMobile && specItem && specItem.onlyShowAttrImg) {
            valueJQ.tooltip({
              targetContainer: this.targetContainer,
              title: get(specItem, `specAttrList[${i}].name`)
            });
          }
        });
      });
    }
    createAndInitDom() {
      this.clearRoot();
      const isInMobile = isMobile();
      const root = this.root.addClass('product-sku-trade');
      this.dataPool.attrArray.forEach((spec, index) => {
        if (!spec.hidden) {
          const specBox = $('<div class="spec-box"></div>');
          specBox.data('index', index);
          specBox.append(`<div class="spec-name body6 ls-30p text-uppercase">${spec.specName}</div>`);
          const attrBox = $('<div class="attr-box body3"></div>');
          specBox.append(attrBox);
          spec.specAttrList.forEach((value, i) => {
            const {
              imgUrl
            } = value;
            let valueJQ;
            if (imgUrl) {
              valueJQ = $(`<div class="attr-value with-img"><img${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  class="value-img" src="${imgUrl}"></div>`);
              if (!isInMobile && spec.onlyShowAttrImg) {
                valueJQ.tooltip({
                  targetContainer: this.targetContainer,
                  title: value.name
                });
              } else {
                valueJQ.append(`<span class="value-text">${value.name}</span>`);
              }
            } else {
              valueJQ = $(`<div class="attr-value"><span>${value.name}</span></div>`);
            }
            valueJQ.data('index', i);
            attrBox.append(valueJQ);
            valueJQ.on('click', () => {
              this.clickAttr(index, i);
            });
          });
          root.append(specBox);
        }
      });
    }
    isPreview() {
      return window.SL_State && window.SL_State.get('templateAlias') === 'PreviewProductsDetail';
    }
    render() {
      super.beforeUpdate();
      this.root.children('.spec-box').each((_, el) => {
        const boxEl = $(el);
        const valueEls = boxEl.children('.attr-box').children('.attr-value');
        const index = boxEl.data('index');
        const nameItem = this.dataPool.attrArray[index];
        if (nameItem.onlyShowAttrImg) {
          const attrValue = this.getAttrValueName(index);
          if (attrValue) {
            boxEl.find('.spec-name').text(`${nameItem.specName}：${attrValue}`);
          } else {
            boxEl.find('.spec-name').text(nameItem.specName);
          }
        }
        valueEls.each((__, el_) => {
          const valueEl = $(el_);
          const i = valueEl.data('index');
          const valueItem = nameItem.specAttrList[i];
          const disabled = !this.isPreview() ? this.dataPool.skuUtil.checkSpecAttrDisabled(this.dataPool.currentSpecList, valueItem.id, index) : false;
          const active = this.dataPool.skuUtil.checkSpecAttrActive(this.dataPool.currentSpecList, valueItem.id);
          if (disabled) {
            valueEl.addClass('disabled').prop('disabled', true);
          } else {
            valueEl.removeClass('disabled').prop('disabled', false);
          }
          if (active) {
            valueEl.addClass('active');
          } else {
            valueEl.removeClass('active');
          }
        });
      });
      super.afterUpdate();
    }
  }
  _exports.default = SkuTrade;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/shared/utils/imgUrl.js'] = window.SLM['theme-shared/components/hbs/shared/utils/imgUrl.js'] || function () {
  const _exports = {};
  function isS3FileUrl(url) {
    return /\.cloudfront\./.test(url) || /img\.myshopline\.com/.test(url) || /img-.*\.myshopline\.com/.test(url);
  }
  function imgUrl(url, options) {
    const {
      width,
      scale,
      quality
    } = options;
    if (!isS3FileUrl(url)) {
      return url;
    }
    const uri = new URL(url);
    if (quality) {
      uri.searchParams.set('q', quality);
    }
    const rUrl = uri.toString();
    if (!width) {
      return rUrl;
    }
    let paramWidth = width;
    if (typeof scale === 'number' && scale > 1) {
      paramWidth = width * scale;
    }
    const clipper = `_${paramWidth || ''}x`;
    const slice = rUrl.split('/');
    const filename = slice.pop() || '';
    const dirname = slice.join('/');
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return `${dirname}/${filename}${clipper}`;
    }
    return `${dirname}/${filename.slice(0, lastDotIndex)}${clipper}${filename.slice(lastDotIndex)}`;
  }
  _exports.default = imgUrl;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/productImages/js/product-photoSwipeHtml.js'] = window.SLM['theme-shared/components/hbs/productImages/js/product-photoSwipeHtml.js'] || function () {
  const _exports = {};
  _exports.default = `
  <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="pswp__bg"></div>
    <div class="pswp__scroll-wrap">
      <div class="pswp__container">
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
      </div>
      <div class="pswp__ui pswp__ui--hidden">
        <button class="pswp__button pswp__button--arrow--left" title="Previous">
          <svg class="icon directional" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1L3 6L8 11" stroke-width="1.5" stroke-linecap="round"/>
          </svg>        
        </button>
        <button class="pswp__button pswp__button--close" title="Close (Esc)">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.8002 1.19999L1.2002 10.8" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M1.1998 1.19999L10.7998 10.8" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="pswp__button pswp__button--arrow--right" title="Next">
          <svg class="icon directional" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 11L9 6L4 1" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
  </div>
`;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/productImages/js/modal.js'] = window.SLM['theme-shared/components/hbs/productImages/js/modal.js'] || function () {
  const _exports = {};
  const PhotoSwipe = window['photoswipe']['/dist/photoswipe.min'].default;
  const photoSwipeUiDefault = window['photoswipe']['/dist/photoswipe-ui-default.min'].default;
  const photoSwipeHtmlString = window['SLM']['theme-shared/components/hbs/productImages/js/product-photoSwipeHtml.js'].default;
  class ImagesModal {
    static openModal(items, index, cacheNaturalSize) {
      let pswpElement = document.querySelectorAll('.pswp')[0];
      if (!pswpElement) {
        $('body').append(photoSwipeHtmlString);
        pswpElement = document.querySelectorAll('.pswp')[0];
      }
      this.openPhotoSwipe(pswpElement, items, index, cacheNaturalSize);
    }
    static openPhotoSwipe(pswpElement, items, index = 0) {
      if (items && items.length > 1) {
        $('.pswp__button--arrow--left, .pswp__button--arrow--right').show();
      } else {
        $('.pswp__button--arrow--left, .pswp__button--arrow--right').hide();
      }
      $('.pswp__button--arrow--left, .pswp__button--arrow--right, .pswp__button--close').on('click', function (e) {
        e.stopPropagation();
      });
      const photoSwipeOptions = {
        allowPanToNext: false,
        captionEl: false,
        closeOnScroll: false,
        counterEl: false,
        history: false,
        index,
        pinchToClose: false,
        preloaderEl: false,
        shareEl: false,
        tapToToggleControls: false,
        barsSize: {
          top: 20,
          bottom: 20
        }
      };
      const gallery = new PhotoSwipe(pswpElement, photoSwipeUiDefault, items, photoSwipeOptions);
      gallery.listen('gettingData', function (_index, item) {
        const img = new Image();
        if (window.__PRELOAD_STATE__.imgNoReferrerSwitch) {
          img.setAttribute('referrerpolicy', 'same-origin');
        }
        img.src = item.src;
        img.onload = () => {
          item.w = img.naturalWidth;
          item.h = img.naturalHeight;
          gallery.updateSize(true);
        };
      });
      gallery.listen('');
      gallery.init();
    }
  }
  _exports.default = ImagesModal;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/components/modal/common.js'] = window.SLM['commons/components/modal/common.js'] || function () {
  const _exports = {};
  const { disablePageScroll, enablePageScroll, addLockableTarget } = window['SLM']['theme-shared/components/hbs/shared/components/modal/common.js'];
  _exports.disablePageScroll = disablePageScroll;
  _exports.enablePageScroll = enablePageScroll;
  _exports.addLockableTarget = addLockableTarget;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/commons/js/sku-trade/sku-trade-select.js'] = window.SLM['product/commons/js/sku-trade/sku-trade-select.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const imgUrlUtil = window['SLM']['theme-shared/components/hbs/shared/utils/imgUrl.js'].default;
  const ImagesModal = window['SLM']['theme-shared/components/hbs/productImages/js/modal.js'].default;
  const { disablePageScroll, enablePageScroll } = window['SLM']['commons/components/modal/common.js'];
  const BaseSkuTrade = window['SLM']['product/commons/js/sku-trade/base-sku-trade.js'].default;
  const isMobile = window['SLM']['commons/utils/isMobile.js'].default;
  class SkuTradeSelect extends BaseSkuTrade {
    constructor(...args) {
      super(...args);
      this.currentIndex = null;
      this.currentEntry = null;
      this.currentDropdown = null;
      this.closeItem = () => {
        this.currentEntry && this.currentEntry.removeClass && this.currentEntry.removeClass('open');
        this.currentDropdown && this.currentDropdown.fadeOut && this.currentDropdown.fadeOut(200);
        this.hidePopup();
        this.currentEntry = null;
        this.currentDropdown = null;
        this.currentIndex = null;
        $(window).off('click', this.closeItem);
      };
      this.openItem = (entry, dropdown) => {
        const currentIndex = entry.data('index');
        if (this.currentIndex !== null) {
          if (this.currentIndex !== currentIndex) {
            this.closeItem();
          } else if (this.currentIndex === currentIndex) {
            this.closeItem();
            return;
          }
        }
        this.currentEntry = entry.addClass('open');
        this.currentIndex = currentIndex;
        this.currentDropdown = dropdown;
        dropdown.fadeIn(200);
        this.showPopup();
        $(window).on('click', this.closeItem);
      };
    }
    initFirstChecked() {
      super.initFirstChecked(true);
    }
    createPopupDom() {
      const that = this;
      const popupId = `skutradeselectpopup_${Date.now()}`;
      this.popup = $(`<div id="${popupId}" class="product-sku-trade-select-popup"><div class="select-options body-font select-popup"><div><div>`).on('click', e => {
        if (e.target.classList.contains('product-sku-trade-select-popup')) {
          this.closeItem();
        }
        e.stopPropagation();
      });
      const dropdown = this.popup.children('.select-popup');
      dropdown.on('click', '.select-item .select-img', function (e) {
        e.stopPropagation();
        const items = [{
          src: $(this).attr('src'),
          w: 0,
          h: 0
        }];
        ImagesModal.openModal(items, 0, false);
      });
      dropdown.on('click', '.select-item', function (e) {
        e.stopPropagation();
        const i = $(this).data('index');
        const active = $(this).prop('active');
        if (!active) {
          that.clickAttr(that.currentIndex, i);
        }
        that.closeItem();
      });
      $(document.body).append(this.popup);
    }
    showPopup() {
      if (!this.popup) {
        this.createPopupDom();
      }
      const index = this.currentIndex;
      const popupBody = this.popup.show().animate({
        opacity: 1
      }, 200).children('.select-popup').addClass('open');
      if (isMobile()) {
        disablePageScroll(popupBody.get(0));
      }
      if (this.dataPool.attrArray[index] && Array.isArray(this.dataPool.attrArray[index].specAttrList)) {
        this.dataPool.attrArray[index].specAttrList.forEach((valueItem, i) => {
          const disabled = this.dataPool.skuUtil.checkSpecAttrDisabled(this.dataPool.currentSpecList, valueItem.id, index);
          const active = this.dataPool.skuUtil.checkSpecAttrActive(this.dataPool.currentSpecList, valueItem.id);
          const valueEl = $(`<div class="select-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}">${valueItem.imgUrl ? `<img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  class="select-img" src="${imgUrlUtil(valueItem.imgUrl, {
            width: 32,
            scale: 4
          })}" />` : ''}<span class="select-text">${valueItem.name}</span><span class="select-checked"></span></div>`);
          valueEl.data('index', i);
          valueEl.prop('active', active);
          popupBody.append(valueEl);
        });
      }
    }
    hidePopup() {
      if (!this.popup) return;
      if (isMobile()) {
        enablePageScroll(this.popup.children('.select-popup').get(0));
      }
      this.popup.animate({
        opacity: 0
      }, 200, function () {
        $(this).hide().children('.select-popup').empty();
      }).children('.select-popup').removeClass('open');
    }
    initDom() {
      const that = this;
      this.root.children('.spec-box').each((_, el) => {
        const box = $(el);
        const index = box.data('index');
        const selectBox = box.children('.select-box');
        const entry = selectBox.children('.select-entry');
        const dropdown = selectBox.children('.select-dropdown');
        entry.on('click', e => {
          e.stopPropagation();
          this.openItem(entry, dropdown);
        });
        dropdown.on('click', '.select-item', function () {
          const i = $(this).data('index');
          const active = $(this).prop('active');
          that.closeItem();
          if (!active) {
            that.clickAttr(index, i);
          }
        });
      });
    }
    createAndInitDom() {
      this.clearRoot();
      const that = this;
      this.root.addClass('product-sku-trade-select');
      this.dataPool.attrArray.forEach((spec, index) => {
        if (!spec.hidden) {
          const specBox = $('<div class="spec-box"></div>').data('index', index);
          this.root.append(specBox);
          const selectBox = $(`<div class="select-box"></div>`);
          specBox.append(`<div class="spec-name body6 ls-30p text-uppercase">${spec.specName}</div>`, selectBox);
          const entry = $(`<div class="select-entry"><img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  style="display: none" class="entry-img" src=""><span class="entry-text body3"></span><span class="entry-arrow"></span></div>`).data('index', index);
          const dropdown = $('<div class="select-options body-font select-dropdown"></div>');
          selectBox.append(entry, dropdown);
          spec.specAttrList.forEach((value, i) => {
            const {
              imgUrl,
              name
            } = value;
            dropdown.append($(`<div class="select-item">${imgUrl ? `<img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  class="select-img" src="${imgUrl}" >` : ''}<span class="select-text">${name}</span><span class="select-checked"></span></div>
              `).data('index', i));
          });
          entry.on('click', e => {
            e.stopPropagation();
            this.openItem(entry, dropdown);
          });
          dropdown.on('click', '.select-item', function () {
            const i = $(this).data('index');
            const active = $(this).prop('active');
            that.closeItem();
            if (!active) {
              that.clickAttr(index, i);
            }
          });
        }
      });
    }
    render() {
      super.beforeUpdate();
      this.root.children('.spec-box').each((_, el) => {
        const boxEl = $(el);
        const index = boxEl.data('index');
        const currentValue = this.getAttrValue(index);
        const seletBox = boxEl.children('.select-box').children('.select-entry');
        const {
          name,
          imgUrl
        } = currentValue || {};
        const img = seletBox.children('.entry-img');
        const text = seletBox.children('.entry-text');
        if (imgUrl) {
          img.show().prop('src', imgUrlUtil(imgUrl, {
            width: 32,
            scale: 4
          }));
        } else {
          img.hide().prop('src', '');
        }
        if (name) {
          text.text(name);
        } else if (currentValue) {
          text.text('');
        } else {
          text.text(t('products.product_details.default_placeholder', {
            attrName: this.dataPool.attrArray[index].specName
          }));
        }
        boxEl.children('.select-box').children('.select-options').children('.select-item').each((__, el_) => {
          const valueEl = $(el_);
          const i = valueEl.data('index');
          const valueItem = this.dataPool.attrArray[index].specAttrList[i];
          const disabled = this.dataPool.skuUtil.checkSpecAttrDisabled(this.dataPool.currentSpecList, valueItem.id, index);
          const active = this.dataPool.skuUtil.checkSpecAttrActive(this.dataPool.currentSpecList, valueItem.id);
          if (disabled) {
            valueEl.addClass('disabled');
          } else {
            valueEl.removeClass('disabled');
          }
          if (active) {
            valueEl.addClass('active').prop('active', true);
          } else {
            valueEl.removeClass('active').prop('active', false);
          }
        });
      });
      super.afterUpdate();
    }
    destory() {
      super.destory();
      this.closeItem();
      if (this.popup) {
        this.popup.remove();
      }
      this.popup = null;
    }
  }
  _exports.default = SkuTradeSelect;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/detail/js/sku-trade.js'] = window.SLM['product/detail/js/sku-trade.js'] || function () {
  const _exports = {};
  const SkuTradeFlatten = window['SLM']['product/commons/js/sku-trade/sku-trade-flatten.js'].default;
  const SkuTradeSelect = window['SLM']['product/commons/js/sku-trade/sku-trade-select.js'].default;
  function initSku({
    id,
    sku,
    spu,
    mixins,
    onInit,
    onChange,
    dataPool,
    modalContainer
  }) {
    const dataDom = $(`#product-sku-trade-data_${id}`);
    const skuStyle = dataDom.data('skustyle');
    const selectSku = dataDom.data('selectsku');
    const SkuClass = skuStyle === 'flatten' ? SkuTradeFlatten : SkuTradeSelect;
    const trade = new SkuClass({
      domReady: true,
      root: `#product-detail-sku-trade_${id}`,
      sku,
      spu,
      dataPool,
      mixins,
      initialSkuSeq: selectSku,
      modalContainer,
      onInit: (tradeData, activeSku, root) => {
        onInit && onInit(tradeData, activeSku, root);
        window.SL_EventBus.emit('product:sku:init', [activeSku, id]);
      },
      onChange: activeSku => {
        window.SL_EventBus.emit('product:sku:change', [activeSku, id, dataPool]);
        onChange && onChange(activeSku);
      }
    });
    return trade;
  }
  _exports.default = initSku;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/commons/js/product-info.js'] = window.SLM['product/commons/js/product-info.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const { processPrice } = window['SLM']['commons/utils/convertPrice.js'];
  let uniqueId = '';
  const priceWrap = '.product-info-price_';
  const priceSellWrap = '.product-price-sales_';
  const priceOriginWrap = '.product-price-origin_';
  const priceVipWrap = '.product-price-vip_';
  const priceDiscountWrap = '.product-price-discount_';
  function getDiscount(showDiscount, sku) {
    const $el = $(`${priceDiscountWrap}${uniqueId}`);
    const discountSettingStyle = $el.attr('product_discount_style');
    const ratioCalc = Math.round(100 * (1 - sku.price / sku.originPrice));
    const discountText = discountSettingStyle === 'number' ? sku.originPrice - sku.price : ratioCalc;
    let isHidden = true;
    if (showDiscount && discountText > 0) {
      if (discountSettingStyle === 'number') {
        const discount = sku.originPrice - sku.price;
        if (discount > 0) {
          const {
            get: getPriceContent
          } = processPrice($el, discount, {
            isSavePrice: true
          });
          isHidden = false;
          $el.html(t('products.product_list.save_byjs', {
            priceDom: getPriceContent()
          }));
        } else {
          isHidden = true;
        }
      } else {
        isHidden = false;
        $el.html(t('products.product_list.save_ratio', {
          price: ratioCalc
        }));
      }
    } else {
      isHidden = true;
    }
    $el.toggleClass('hide', isHidden);
  }
  const setSkuPrice = (spuSoldout, activeSku = {}) => {
    const discountSetting = $(`${priceWrap}${uniqueId}`).attr('product_discount');
    const {
      originPrice: oriPrice,
      price,
      showMemberMark
    } = activeSku;
    const originPrice = oriPrice > price ? oriPrice : '';
    const showDiscount = discountSetting && !spuSoldout;
    const $priceWrapperEl = $(`.price.product-info-price_${uniqueId}`);
    if (oriPrice > price) {
      if (!$priceWrapperEl.hasClass('product-info-price_hasDiscount')) {
        $priceWrapperEl.addClass('product-info-price_hasDiscount');
      }
    } else {
      $priceWrapperEl.removeClass('product-info-price_hasDiscount');
    }
    processPrice($(`${priceSellWrap}${uniqueId}`), price).render();
    if (showMemberMark) {
      $(`${priceVipWrap}${uniqueId}`).removeClass('hide');
    } else {
      $(`${priceVipWrap}${uniqueId}`).addClass('hide');
    }
    if (originPrice) {
      processPrice($(`${priceOriginWrap}${uniqueId}`), originPrice).render();
      $(`${priceOriginWrap}${uniqueId}`).removeClass('hide');
    } else {
      $(`${priceOriginWrap}${uniqueId}`).addClass('hide');
    }
    getDiscount(showDiscount, activeSku);
  };
  const getHighOriginPrice = (min, item) => {
    if (min.price === item.price) {
      return min.originPrice > item.originPrice ? min : item;
    }
    return min.price > item.price ? item : min;
  };
  const checkActive = item => {
    if (item && Array.isArray(item.saleActivityResponseList)) {
      item.saleActivityResponseList.some(activity => activity.promotionType === 1 && activity.promotionSubType === 1);
    } else {
      return undefined;
    }
  };
  const getMinPrice = (soldOut, skuList) => {
    if (!Array.isArray(skuList)) return undefined;
    return skuList.reduce((min, item) => {
      if (min === null) {
        return item;
      }
      if (checkActive(min)) {
        if (checkActive(item)) {
          return getHighOriginPrice(min, item);
        }
        return min;
      }
      if (checkActive(item)) {
        return item;
      }
      if (min && min.showMemberMark) {
        if (item && item.showMemberMark) {
          return getHighOriginPrice(min, item);
        }
        return min;
      }
      if (item && item.showMemberMark) {
        return item;
      }
      return getHighOriginPrice(min, item);
    }, null);
  };
  const setMinPrice = (soldOut, skuList) => {
    const minSku = getMinPrice(soldOut, skuList);
    setSkuPrice(soldOut, minSku);
  };
  const setGradsPrice = activeSku => {
    const max = activeSku.price;
    const min = activeSku.quantity_price_breaks[activeSku.quantity_price_breaks.length - 1].price;
    const maxStr = processPrice($(`${priceSellWrap}${uniqueId}`), max).get();
    const minStr = processPrice($(`${priceSellWrap}${uniqueId}`), min).get();
    $(`${priceSellWrap}${uniqueId}`).html(`${minStr} - ${maxStr}`);
    $(`${priceVipWrap}${uniqueId}`).addClass('hide');
    $(`${priceOriginWrap}${uniqueId}`).addClass('hide');
    $(`${priceDiscountWrap}${uniqueId}`).addClass('hide');
    $(`.price.product-info-price_${uniqueId}`).removeClass('product-info-price_hasDiscount');
  };
  const setProductPrice = (id, statePath, activeSku) => {
    uniqueId = id;
    const {
      skuList
    } = window.SL_State.get(`${statePath}.sku`);
    const {
      soldOut
    } = window.SL_State.get(`${statePath}.spu`);
    if (activeSku) {
      if (activeSku.quantity_price_breaks && activeSku.quantity_price_breaks.length) {
        setGradsPrice(activeSku);
      } else {
        setSkuPrice(soldOut, activeSku);
      }
    } else {
      setMinPrice(soldOut, skuList);
    }
  };
  _exports.default = setProductPrice;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/utils/nullishCoalescingOperator.js'] = window.SLM['product/utils/nullishCoalescingOperator.js'] || function () {
  const _exports = {};
  function nullishCoalescingOperator(...args) {
    return args.find(item => {
      if (typeof item === 'function') {
        const result = item();
        return result !== null && result !== undefined;
      }
      return item !== null && item !== undefined;
    });
  }
  _exports.default = nullishCoalescingOperator;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/commons/js/quick-add-modal.js'] = window.SLM['product/commons/js/quick-add-modal.js'] || function () {
  const _exports = {};
  const axios = window['axios']['default'];
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const http = window['SLM']['theme-shared/utils/request.js'].default;
  const { getEventID } = window['SLM']['theme-shared/utils/report/tool.js'];
  const dataReportViewContent = window['@yy/sl-theme-shared']['/events/data-report/view-content'].default;
  const ProductQuickAddCart = window['SLM']['theme-shared/report/product/product-quickAddCart.js'].default;
  const productSkuChange = window['SLM']['theme-shared/events/product/sku-change/index.js'].default;
  const quickViewClick = window['SLM']['theme-shared/events/product/quickView-click/index.js'].default;
  const productPreviewInit = window['SLM']['theme-shared/events/product/preview-init/index.js'].default;
  const pageMapping = window['SLM']['theme-shared/utils/report/pageMapping.js'].default;
  const { getCartId } = window['SLM']['theme-shared/report/product/utils/index.js'];
  const getCurrencyCode = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'].default;
  const { convertPrice } = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const get = window['lodash']['get'];
  const newCurrency = window['SLM']['theme-shared/utils/newCurrency/index.js'].default;
  const { ModalWithHtml } = window['SLM']['commons/components/modal/index.js'];
  const Toast = window['SLM']['commons/components/toast/index.js'].default;
  const { Loading } = window['SLM']['commons/components/toast/index.js'];
  const { getUrlQuery } = window['SLM']['commons/utils/url.js'];
  const ButtonEvent = window['SLM']['product/detail/js/product-button.js'].default;
  const { getVariant } = window['SLM']['product/detail/js/product-button.js'];
  const { addToCartThirdReport, addToCartHdReport } = window['SLM']['product/detail/js/product-button-report.js'];
  const SkuQuality = window['SLM']['product/detail/js/product-quantity.js'].default;
  const initSku = window['SLM']['product/detail/js/sku-trade.js'].default;
  const setProductPrice = window['SLM']['product/commons/js/product-info.js'].default;
  const { ADD_TO_CART } = window['SLM']['commons/cart/globalEvent.js'];
  const nullishCoalescingOperator = window['SLM']['product/utils/nullishCoalescingOperator.js'].default;
  const emitProductSkuChange = data => {
    try {
      productSkuChange({
        currency: window.Shopline.currency,
        ...data
      });
    } catch (e) {
      console.error(e);
    }
  };
  const hdReport = new ProductQuickAddCart();
  const emitViewContent = data => {
    try {
      dataReportViewContent(data);
      hdReport.quickAddCartView({
        productInfo: {
          spuSeq: data.content_spu_id,
          skuSeq: data.content_sku_id,
          currency: getCurrencyCode(),
          price: data.originPrice,
          productName: data.productName
        }
      });
    } catch (e) {
      console.error(e);
    }
  };
  const getSortationIds = spu => {
    if (spu && spu.sortationList && Array.isArray(spu.sortationList)) {
      return spu.sortationList.map(s => s.sortationId).join(',');
    }
    return '';
  };
  const modalInstanceMap = new Map();
  const previewInstanceMap = new Map();
  const quickAddLoadingClassName = 'product-item__btn--loading';
  function modalExpose(page) {
    if (window.HdSdk && window.HdSdk.shopTracker && window.HdSdk.shopTracker.report) {
      window.HdSdk.shopTracker.report('60006263', {
        event_name: 'view',
        page
      });
    }
  }
  const getSkuChangeData = (skuInfo = {}) => {
    const {
      spuSeq,
      discount,
      skuSeq,
      price,
      originPrice,
      stock,
      weight,
      weightUnit,
      available,
      shelves,
      skuAttributeIds,
      imageList,
      soldOut,
      allowOversold,
      imageBeanList
    } = skuInfo;
    return {
      spuSeq,
      discount,
      skuSeq,
      price: newCurrency.formatCurrency(price || 0),
      originPrice: newCurrency.formatCurrency(originPrice || 0),
      stock,
      weight,
      weightUnit,
      available,
      shelves,
      skuAttributeIds,
      imageList,
      soldOut,
      allowOversold,
      imageBeanList
    };
  };
  const getReportCartId = async () => {
    return await getCartId();
  };
  async function quickAddModal(data) {
    const {
      spuSeq,
      uniqueKey,
      $button,
      buttonLoadingCls
    } = data;
    let modalPrefix = 'product_quick_add_';
    let queryObj = {};
    const query = $button.data('query');
    let cartId = '';
    getReportCartId().then(id => {
      cartId = id;
    });
    try {
      queryObj = {
        ...query
      };
      modalPrefix = queryObj.modalPrefix ? `${queryObj.modalPrefix}_product_quick_add_` : 'product_quick_add_';
    } catch (e) {}
    const page = modalPrefix.startsWith('productRecommendModal') ? '123' : pageMapping[SL_State.get('templateAlias')];
    function toggleAddLoading(isLoading) {
      $button.toggleClass(buttonLoadingCls || quickAddLoadingClassName, isLoading);
    }
    if ($button.hasClass(buttonLoadingCls || quickAddLoadingClassName)) {
      return;
    }
    try {
      toggleAddLoading(true);
      const res = await getProductDetail(spuSeq);
      if (res.code === 'SUCCESS') {
        const productInfo = res.data;
        const skuList = nullishCoalescingOperator(get(res, 'data.sku.skuList'), []);
        const skuAttributeMap = nullishCoalescingOperator(get(res, 'data.sku.skuAttributeMap'), {});
        const isSoldOut = get(res, 'data.spu.soldOut');
        const isSingleSku = Array.isArray(skuList) && skuList.length === 1;
        if (isSoldOut) {
          new Toast().open(t('products.general.sold_out'), 3e3);
          return;
        }
        modalExpose(page);
        if (isSingleSku) {
          const skuInfo = skuList[0];
          addToCart({
            sku: skuInfo,
            spu: get(productInfo, 'spu'),
            toggleAddLoading,
            hdReportPage: page,
            skuAttributeMap,
            cartId,
            ...data
          });
          emitProductSkuChange({
            type: 'init',
            quantity: 1,
            ...getSkuChangeData(skuInfo)
          });
          emitViewContent({
            content_spu_id: get(productInfo, 'spu.spuSeq'),
            content_sku_id: get(skuInfo, 'skuSeq'),
            content_category: getSortationIds(get(productInfo, 'spu')),
            currency: getCurrencyCode(),
            value: convertPrice(get(skuInfo, 'price') || 0),
            quantity: 1,
            price: convertPrice(get(skuInfo, 'price') || 0),
            productName: get(res, 'data.spu.title'),
            originPrice: get(skuInfo, 'price') || 0
          });
        } else {
          showModal({
            spuSeq,
            uniqueKey,
            modalPrefix,
            ...data
          });
        }
      } else {
        new Toast().open(t('products.general.no_product_data_found'), 3e3);
      }
    } catch (err) {
      new Toast().open(t('products.general.no_product_data_found'), 3e3);
    } finally {
      toggleAddLoading(false);
    }
  }
  _exports.default = quickAddModal;
  async function showModal({
    spuSeq,
    uniqueKey,
    modalPrefix,
    ...data
  }) {
    if (modalInstanceMap.has(spuSeq)) {
      const previewSep = previewInstanceMap.get(spuSeq);
      modalInstanceMap.get(spuSeq).show();
      previewSep && previewSep.emitEvent();
      quickViewClick({
        type: 'change',
        eventName: 'OPEN_QUICKVIEW_ADDTOCART',
        prefix: modalPrefix,
        spuSeq,
        modal: modalInstanceMap.get(spuSeq),
        preview: {
          skuTrade: previewInstanceMap.get(spuSeq).skuTrade,
          quantityStepper: previewInstanceMap.get(spuSeq).quantityStepper
        },
        $el: document.getElementById(modalInstanceMap.get(spuSeq) && modalInstanceMap.get(spuSeq).modalId)
      });
    } else {
      const children = $('<div class="quick-add-modal__outerWrapper flex-layout"></div>');
      const modal = new ModalWithHtml({
        children,
        containerClassName: `quick-add-modal__container __sl-custom-track-quick-add-modal-${spuSeq}`,
        zIndex: 128,
        closeCallback: () => {
          const modalInstance = modalInstanceMap.get(spuSeq);
          quickViewClick({
            eventName: 'CLOSE_QUICKVIEW_ADDTOCART',
            spuSeq,
            $el: document.getElementById(modalInstance && modalInstance.modalId)
          });
        }
      });
      modal.show();
      const loading = new Loading({
        target: modal.$modal.find('.mp-modal__body'),
        loadingColor: 'currentColor',
        duration: -1
      });
      loading.open();
      try {
        const res = await fetchModalContent(uniqueKey, modalPrefix, data.selectedSku);
        children.empty().append(res.data);
        initQuickAddModal(`${modalPrefix}${spuSeq}`, children, modal, spuSeq, get(data, 'position'), modal.$modal);
        modalInstanceMap.set(spuSeq, modal);
        quickViewClick({
          type: 'init',
          eventName: 'OPEN_QUICKVIEW_ADDTOCART',
          prefix: modalPrefix,
          spuSeq,
          modal: modalInstanceMap.get(spuSeq),
          preview: {
            skuTrade: previewInstanceMap.get(spuSeq).skuTrade,
            quantityStepper: previewInstanceMap.get(spuSeq).quantityStepper
          },
          $el: document.getElementById(modalInstanceMap.get(spuSeq) && modalInstanceMap.get(spuSeq).modalId)
        });
      } catch (err) {
        new Toast().open(t('products.general.no_product_data_found'), 3e3);
        modal.hide();
      } finally {
        loading.close();
        window.SL_EventBus.emit('global.activeIcon.show', {
          type: 'vip'
        });
      }
    }
  }
  function initQuickAddModal(id, el, modal, spuSeq, position, modalContainer) {
    const sku = SL_State.get(`${id}.sku`);
    const spu = SL_State.get(`${id}.spu`);
    initWidgets({
      id,
      sku,
      spu
    }, el, modal, spuSeq, position, modalContainer);
  }
  function initWidgets({
    id,
    sku,
    spu
  }, el, modal, spuSeq, position, modalContainer) {
    let activeSkuCache = {};
    const ButtonGroup = new ButtonEvent({
      id,
      cartRoot: `.pdp_add_to_cart_${id}`,
      soldOutRoot: `.pdp_sold_out_${id}`,
      spu,
      sku,
      modalType: 'QuickAdd',
      position,
      onAddSuccess: () => {
        modal.hide();
      }
    });
    const quantityStepper = new SkuQuality({
      id,
      sku,
      spu,
      onChange: num => {
        ButtonGroup.setActiveSkuNum(num);
        window.SL_EventBus.emit('product:count:change', [num, id]);
      }
    });
    const skuTrade = initSku({
      id,
      sku,
      spu,
      mixins: window.skuMixins,
      modalContainer,
      onInit: (trade, activeSku) => {
        activeSkuCache = activeSku;
        let content_sku_id = '';
        let price = null;
        if (activeSku) {
          changeActiveSku(activeSku);
          content_sku_id = activeSku.skuSeq;
          price = convertPrice(activeSkuCache.price || 0);
          emitProductSkuChange({
            type: 'init',
            quantity: get(quantityStepper, 'skuStepper.data.value') || 1,
            ...getSkuChangeData(activeSku)
          });
        }
        emitViewContent({
          content_spu_id: spu.spuSeq,
          content_sku_id,
          content_category: getSortationIds(spu),
          currency: getCurrencyCode(),
          value: price,
          quantity: 1,
          price,
          productName: get(spu, 'title'),
          originPrice: get(activeSku, 'price') || 0
        });
      },
      onChange: activeSku => {
        activeSkuCache = activeSku;
        if (activeSku) {
          emitProductSkuChange({
            type: 'change',
            quantity: get(quantityStepper, 'skuStepper.data.value') || 1,
            ...getSkuChangeData(activeSku)
          });
        }
        if (!activeSku && !quantityStepper.activeSku) return;
        setProductPrice(id, id, activeSku);
        changeActiveSku(activeSku);
      }
    });
    try {
      const _modalContainer = modal.$modal;
      productPreviewInit({
        id,
        position,
        modalType: 'quickAddToCart',
        module: 'quickAddToCartModal',
        product: window.SL_State.get(id),
        modalContainer: modal.$modal,
        modalContainerElement: _modalContainer && _modalContainer[0],
        instances: {
          buttonGroup: ButtonGroup,
          quantityStepper,
          skuTrade
        }
      });
    } catch (e) {
      console.error(e);
    }
    previewInstanceMap.set(spuSeq, {
      skuTrade,
      quantityStepper,
      emitEvent: () => {
        let content_sku_id = '';
        let price = null;
        if (activeSkuCache) {
          content_sku_id = activeSkuCache.skuSeq;
          price = convertPrice(activeSkuCache.price || 0);
          emitProductSkuChange({
            type: 'init',
            quantity: get(quantityStepper, 'skuStepper.data.value') || 1,
            ...getSkuChangeData(activeSkuCache)
          });
        }
        emitViewContent({
          content_spu_id: spu.spuSeq,
          content_sku_id,
          content_category: getSortationIds(spu),
          currency: getCurrencyCode(),
          value: price,
          quantity: 1,
          price,
          productName: get(spu, 'title'),
          originPrice: get(activeSkuCache, 'price') || 0
        });
      }
    });
    function changeActiveSku(activeSku) {
      ButtonGroup.setActiveSku(activeSku);
      quantityStepper.setActiveSku(activeSku);
    }
  }
  function addToCart({
    sku,
    spu,
    toggleAddLoading,
    hdReportPage,
    skuAttributeMap,
    position,
    cartId
  }) {
    const activeSku = sku ? {
      ...sku,
      num: 1,
      name: spu.title
    } : null;
    if (isPreview()) {
      new Toast().open(t('products.product_details.link_preview_does_not_support'));
      return;
    }
    if (!activeSku) {
      new Toast().open(t('products.product_list.select_product_all_options'));
      return;
    }
    toggleAddLoading(true);
    const {
      spuSeq: spuId,
      skuSeq: skuId,
      num,
      name,
      price
    } = activeSku;
    const eventID = getEventID();
    const getDataId = get(window, 'HdSdk.shopTracker.getDataId');
    const dataId = getDataId ? getDataId() : undefined;
    const hdReportData = {
      page: hdReportPage,
      spuId,
      skuId,
      name,
      price,
      num,
      modalType: 'SingleQuickAdd',
      variant: getVariant(get(activeSku, 'skuAttributeIds'), skuAttributeMap),
      collectionId: get(spu, 'sortationList[0].sortationId'),
      collectionName: get(spu, 'sortationList[0].sortationName'),
      position,
      dataId,
      eventID,
      cartId
    };
    window.SL_EventBus.emit(ADD_TO_CART, {
      spuId,
      skuId,
      num,
      currency: getCurrencyCode(),
      price: newCurrency.unformatCurrency(convertPrice(price)),
      name,
      eventID: `addToCart${eventID}`,
      reportParamsExt: {
        dataId,
        eventId: `addToCart${eventID}`,
        eventName: 'AddToCart'
      },
      error: () => {
        addToCartHdReport({
          ...hdReportData,
          event_status: 0
        });
      },
      success: () => {
        addToCartHdReport({
          ...hdReportData,
          event_status: 1
        });
        addToCartThirdReport({
          spu,
          variant: getVariant(sku && sku.skuAttributeIds, skuAttributeMap),
          spuId,
          name,
          price,
          skuId,
          num,
          eventID
        });
        const cartOpenType = window.SL_State.get('theme.settings.cart_open_type');
        if (cartOpenType === 'cartremain') {
          new Toast().open(t('products.general.added_to_cart_successfully'), 1500);
        }
      },
      complete: () => {
        toggleAddLoading(false);
      }
    });
  }
  function isPreview() {
    return window.SL_State && window.SL_State.get('templateAlias') === 'PreviewProductsDetail';
  }
  function fetchModalContent(uniqueKey, modalPrefix, sku) {
    let recommendQuery = {};
    if (modalPrefix.startsWith('productRecommendModal')) {
      recommendQuery = {
        modalPrefix: 'productRecommendModal'
      };
    }
    const queryUrl = window.Shopline.redirectTo(`/products/${uniqueKey}`);
    return axios.get(queryUrl, {
      params: {
        view: 'quick-add-modal',
        preview: getUrlQuery('preview'),
        themeId: getUrlQuery('themeId'),
        ignoreRedirect: getUrlQuery('ignoreRedirect'),
        sourcePage: SL_State.get('templateAlias'),
        sku,
        ...recommendQuery
      }
    });
  }
  function getProductDetail(spuSeq) {
    return http.get(`/product/detail/query`, {
      params: {
        spuSeq
      }
    });
  }
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/product/openQuickViewATC.js'] = window.SLM['commons/product/openQuickViewATC.js'] || function () {
  const _exports = {};
  const quickAddModal = window['SLM']['product/commons/js/quick-add-modal.js'].default;
  function addListenerQuickViewATC() {
    if (window.Shopline && window.Shopline.event) {
      window.Shopline.event.on('Product::ShowQuickView::AddToCart', data => {
        const {
          productId,
          handle,
          buttonTarget = {},
          buttonLoadingCls
        } = data || {};
        if (productId && handle) {
          quickAddModal({
            spuSeq: productId,
            uniqueKey: handle,
            $button: $(buttonTarget),
            buttonLoadingCls
          });
        } else {
          console.error(`addListenerQuickViewATC parameter missing productId: ${productId}, handle: ${handle}`);
        }
      });
    }
  }
  addListenerQuickViewATC();
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/components/breadcrumb/index.js'] = window.SLM['commons/components/breadcrumb/index.js'] || function () {
  const _exports = {};
  const PLPReg = /\/collections\/[^/]+$/;
  const PDPReg = /(\/collections\/[^/]+)?\/products\/[^/]/;
  if (PLPReg.test(window.location.pathname)) {
    const name = window.SL_State.get('sortation.sortation.title');
    if (name) {
      sessionStorage.setItem('breadcrumb', JSON.stringify({
        name,
        link: window.location.pathname + window.location.search
      }));
    }
  } else if (PDPReg.test(window.location.pathname) && window.SL_State.get('templateAlias') !== 'ProductsSearch') {
    makeProductBreadCrumb();
  } else {
    sessionStorage.removeItem('breadcrumb');
  }
  function makeProductBreadCrumb() {
    const breadCrumbTarget = $('body .product-crumbs');
    const breadCrumbCache = JSON.parse(window.sessionStorage.getItem('breadcrumb') ? window.sessionStorage.getItem('breadcrumb') : '""');
    if (breadCrumbTarget.find('.product-crumbs-cateName').length) {
      return true;
    }
    if (breadCrumbCache) {
      breadCrumbTarget.find('.product-crumbs-productName').before(`
      <a class="body4" href="${breadCrumbCache.link}">${breadCrumbCache.name}</a> / 
    `);
    }
  }
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/report/stage/const.js'] = window.SLM['theme-shared/report/stage/const.js'] || function () {
  const _exports = {};
  const sectionTypeEnum = {
    header: '页头',
    footer: '页脚',
    'collection-list': '商品分类',
    'custom-html': '自定义HTML',
    faqs: '常见问题',
    'featured-collection': '精选商品',
    'image-with-text': '图文模块',
    'large-image-with-text-box': '单图',
    'logo-list': '图标申明',
    slideshow: '轮播图',
    'text-columns-with-images': '图文列表',
    video: '视频',
    'footer-promotion': '页脚推广',
    'featured-product': '单个商品',
    'rich-text': '富文本',
    'sign-up-and-save': '邮箱订阅',
    'icon-list': '商标列表',
    'promotion-grid': '活动推广',
    'split-slideshow': '特色轮播图',
    grid: '图文网格',
    mosaic: '特色推荐',
    'multilevel-filter': '多级筛选',
    'shoppable-image': '购物图片',
    testimonials: '评论模块',
    timeline: '时间线',
    blog: '博客',
    'contact-form': '联系我们表单',
    'image-banner': '图片横幅',
    'multi-media-splicing': '媒体拼接',
    'custom-page': '自定义页面',
    map: '地图',
    'carousel-collection-list': '轮播商品分类',
    'carousel-images-with-text': '图文轮播',
    'featured-logo-list': '特色图标申明',
    'collection-with-image': '带封面的精选商品',
    offers: '优惠横幅',
    'product-list': '商品列表'
  };
  _exports.sectionTypeEnum = sectionTypeEnum;
  const virtualComponentEnum = {
    user: 101,
    cart: 102,
    search: 103,
    localeItem: 104,
    locale: 105,
    currencyItem: 106,
    currency: 107,
    navItem: 108,
    announcement: 109,
    socialItem: 110,
    newsletter: 111,
    searchSuggest: 112
  };
  _exports.virtualComponentEnum = virtualComponentEnum;
  const virtualPageEnum = {
    fixedSction: 132,
    dynamicSection: 145
  };
  _exports.virtualPageEnum = virtualPageEnum;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/report/product/product-item.js'] = window.SLM['theme-shared/report/product/product-item.js'] || function () {
  const _exports = {};
  const { BaseReport, findSectionId } = window['SLM']['theme-shared/report/common/baseReport.js'];
  const { validParams } = window['SLM']['theme-shared/report/product/utils/index.js'];
  const get = window['lodash']['get'];
  const getCurrencyCode = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'].default;
  const { convertPrice } = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'];
  const { sectionTypeEnum } = window['SLM']['theme-shared/report/stage/const.js'];
  const { nullishCoalescingOperator } = window['SLM']['theme-shared/utils/syntax-patch.js'];
  function tryDecodeURIComponent(str) {
    try {
      return decodeURIComponent(str);
    } catch (e) {
      return str;
    }
  }
  const getTagBrandTypeReportCollectionName = title => {
    let {
      pathname
    } = window.location;
    const {
      search
    } = window.location;
    let collectionName = title;
    if (window.Shopline.routes && window.Shopline.routes.root && window.Shopline.routes.root !== '/') {
      const root = `/${window.Shopline.routes.root.replace(/\//g, '')}`;
      pathname = pathname.replace(root, '');
    }
    if (pathname === '/collections/types' || pathname === '/collections/brands') {
      collectionName = tryDecodeURIComponent(pathname.replace('/collections/', '') + search);
    } else {
      const pathnameArr = pathname.split('/');
      if (pathnameArr[pathnameArr.length - 1] === '') {
        pathnameArr.pop();
      }
      if (pathnameArr[1] === 'collections' && pathnameArr.length === 4) {
        collectionName += tryDecodeURIComponent(pathname.replace('/collections/', '') + search);
      }
    }
    return collectionName;
  };
  const pageItemMap = {
    101: {
      module: 900,
      component: 101,
      component_ID: findSectionId('[data-plugin-product-item-a]')
    },
    102: {
      module: 109,
      component: 101,
      action_type: ''
    },
    103: {
      module: 109,
      component: 101
    },
    105: {
      module: 108,
      component: 101
    }
  };
  class ProductItemReport extends BaseReport {
    itemListView(reportData) {
      validParams(reportData);
      const {
        baseParams = {},
        productsInfo
      } = reportData;
      const {
        productSortation,
        productList
      } = productsInfo;
      const productsInfoParams = {
        list_name: productSortation.id ? productSortation.sortation.sortation.title : 'All Products',
        collection_id: nullishCoalescingOperator(get(productSortation, 'sortation.sortation.sortationId'), ''),
        collection_name: nullishCoalescingOperator(get(productSortation, 'sortation.sortation.title'), ''),
        items: productList.map(({
          reportSkuId,
          spuSeq,
          productMinPrice
        }, index) => ({
          sku_id: reportSkuId,
          spu_id: spuSeq,
          position: index + 1,
          collection_id: nullishCoalescingOperator(get(productSortation, 'sortation.sortation.sortationId'), ''),
          collection_name: getTagBrandTypeReportCollectionName(nullishCoalescingOperator(get(productSortation, 'sortation.sortation.title'), '')),
          currency: getCurrencyCode(),
          price: convertPrice(productMinPrice),
          quantity: 1
        }))
      };
      const customParams = {
        ...productsInfoParams
      };
      super.viewItemList({
        selector: `.__sl-custom-track-${productSortation.id ? productSortation.id : 'all-products'}`,
        ...baseParams,
        customParams
      });
    }
    itemView(reportData) {
      validParams(reportData);
      const {
        baseParams = {},
        productInfo = {},
        extInfo = {}
      } = reportData;
      const {
        reportSkuId,
        spuSeq,
        productMinPrice,
        index,
        soldOut
      } = productInfo;
      const productInfoParams = {
        sku_id: reportSkuId,
        spu_id: spuSeq,
        currency: getCurrencyCode(),
        price: convertPrice(productMinPrice),
        position: index + 1,
        status: soldOut ? 102 : 101
      };
      const params = {
        page: this.page,
        ...baseParams,
        ...productInfoParams,
        ...extInfo
      };
      super.view({
        selector: `.__sl-custom-track-product-item-${spuSeq}`,
        customParams: params
      });
    }
    itemSelect(reportData) {
      validParams(reportData);
      const {
        baseParams = {},
        productInfo
      } = reportData;
      const {
        id,
        skuId,
        price,
        index,
        name,
        moduleType
      } = productInfo;
      const productInfoParams = {
        content_ids: id,
        sku_id: skuId,
        content_name: name,
        currency: getCurrencyCode(),
        value: convertPrice(price),
        position: index + 1
      };
      const params = {
        ...baseParams,
        ...productInfoParams
      };
      if (this.page === 101) {
        Object.assign(params, {
          ...pageItemMap[101],
          module_type: nullishCoalescingOperator(sectionTypeEnum[moduleType], moduleType)
        });
      }
      super.selectContent({
        customParams: params
      });
    }
  }
  _exports.default = ProductItemReport;
  function hdProductItemSelect(reportData) {
    const hdReport = new ProductItemReport();
    const {
      baseParams = {},
      productInfo
    } = reportData;
    hdReport.itemSelect({
      baseParams: {
        component_ID: findSectionId('[data-plugin-product-item-a]'),
        ...baseParams
      },
      productInfo
    });
  }
  _exports.hdProductItemSelect = hdProductItemSelect;
  function hdProductItemView(params) {
    const hdReport = new ProductItemReport();
    const {
      sectionClass,
      moreInfo
    } = params;
    hdReport.view({
      selector: `${sectionClass} .product-item`,
      customParams: {
        ...pageItemMap[hdReport.page],
        ...moreInfo
      }
    });
  }
  _exports.hdProductItemView = hdProductItemView;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/img-size.js'] = window.SLM['theme-shared/utils/img-size.js'] || function () {
  const _exports = {};
  const urls = window['url']['default'];
  const qs = window['query-string']['default'];
  function img_size(url) {
    const urlParse = urls.parse(url);
    const urlQuery = qs.parse(urlParse && urlParse.query) || {};
    const radix = 10;
    const fixed = 2;
    const width = Number.parseInt(urlQuery.w, radix);
    const height = Number.parseInt(urlQuery.h, radix);
    let ratio = null;
    if (Number.isInteger(width) && Number.isInteger(height) && width !== 0) {
      ratio = `${Number(Number.parseFloat(height / width * 100).toFixed(fixed))}%`;
    }
    return {
      width: Number.isInteger(width) ? width : null,
      height: Number.isInteger(height) ? height : null,
      ratio
    };
  }
  _exports.default = img_size;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/shared/utils/getYouTubeCover.js'] = window.SLM['theme-shared/components/hbs/shared/utils/getYouTubeCover.js'] || function () {
  const _exports = {};
  const getYouTubeCover = videoResource => {
    if (typeof videoResource !== 'string') {
      return null;
    }
    const youTubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const getYouTubeIdByVideoUrl = url => {
      const matches = url && url.match(youTubeRegex) || [];
      return matches[1];
    };
    const getVideoCover = videoId => {
      const coverUrlPrefix = `https://i.ytimg.com/vi/${videoId}`;
      return {
        maxQuality: `${coverUrlPrefix}/maxresdefault.jpg`,
        aboveMiddle: `${coverUrlPrefix}/sddefault.jpg`,
        middle: `${coverUrlPrefix}/mqdefault.jpg`,
        lowerMiddle: `${coverUrlPrefix}/hqdefault.jpg`,
        minQuality: `${coverUrlPrefix}/default.jpg`,
        videoId
      };
    };
    if (videoResource.indexOf('www.youtube.com') !== -1) {
      const videoId = getYouTubeIdByVideoUrl(videoResource);
      return getVideoCover(videoId);
    }
    return getVideoCover(videoResource);
  };
  _exports.default = getYouTubeCover;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/lozad/util.js'] = window.SLM['theme-shared/utils/lozad/util.js'] || function () {
  const _exports = {};
  const isIE = typeof document !== 'undefined' && document.documentMode;
  _exports.isIE = isIE;
  const support = type => window && window[type];
  _exports.support = support;
  const isElementType = (element, type) => element.nodeName.toLowerCase() === type;
  _exports.isElementType = isElementType;
  function isSupportWebp() {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const result = img.width > 0 && img.height > 0;
        resolve(result);
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = `data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA`;
    });
  }
  _exports.isSupportWebp = isSupportWebp;
  const isGif = url => /^.+\.gif(\?.*){0,1}$/.test(url);
  _exports.isGif = isGif;
  const isS3FileUrl = url => /\.cloudfront\./.test(url) || /img\.myshopline\.com/.test(url) || /img-.*\.myshopline\.com/.test(url);
  _exports.isS3FileUrl = isS3FileUrl;
  const isLoaded = element => element.getAttribute('data-loaded') === 'true';
  _exports.isLoaded = isLoaded;
  const makeIsLoaded = element => element.setAttribute('data-loaded', true);
  _exports.makeIsLoaded = makeIsLoaded;
  const concatStr = (strs, symbol) => strs.filter(Boolean).join(symbol);
  _exports.concatStr = concatStr;
  const transformSrcset = (srcset, transformer) => srcset.split(',').filter(str => str !== '').map(str => concatStr(transformer(...str.trim().split(' ')), ' ')).join(',');
  _exports.transformSrcset = transformSrcset;
  const getElements = (selector, root = document) => {
    if (selector instanceof Element) {
      return [selector];
    }
    if (selector instanceof NodeList) {
      return selector;
    }
    return root.querySelectorAll(selector);
  };
  _exports.getElements = getElements;
  class SLFile {
    constructor(url, base) {
      const uri = new URL(url, base);
      const paths = uri.pathname.split('/');
      const filename = paths[paths.length - 1];
      const [name, suffix] = filename.split('.');
      const [originName, ...modifiers] = name.split('_');
      this.uri = uri;
      this.paths = paths;
      this.name = originName;
      this.suffix = suffix;
      this.querys = this.uri.searchParams;
      this.modifiers = modifiers;
    }
    toString() {
      this.uri.pathname = concatStr([...this.paths.slice(0, -1), concatStr([[this.name, ...this.modifiers].join('_'), this.suffix], '.')], '/');
      return this.uri.toString();
    }
  }
  _exports.SLFile = SLFile;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/lozad/plugins/normal.js'] = window.SLM['theme-shared/utils/lozad/plugins/normal.js'] || function () {
  const _exports = {};
  const { isIE, makeIsLoaded } = window['SLM']['theme-shared/utils/lozad/util.js'];
  const EnumAttributes = {
    Iesrc: 'data-iesrc',
    Alt: 'data-alt',
    Src: 'data-src',
    Srcset: 'data-srcset',
    Poster: 'data-poster',
    ToggleClass: 'data-toggle-class',
    BackgroundImage: 'data-background-image',
    BackgroundImageSet: 'data-background-image-set',
    PlaceholderBackground: 'data-placeholder-background'
  };
  _exports.EnumAttributes = EnumAttributes;
  _exports.default = {
    attributes: [EnumAttributes.Alt, EnumAttributes.Src, EnumAttributes.Iesrc, EnumAttributes.Srcset, EnumAttributes.Poster, EnumAttributes.ToggleClass, EnumAttributes.BackgroundImage, EnumAttributes.BackgroundImageSet],
    prepare(element) {
      const plBg = element.getAttribute(EnumAttributes.PlaceholderBackground);
      if (plBg) element.style.background = plBg;
    },
    beforeLoad() {},
    load(element) {
      if (element.nodeName.toLowerCase() === 'picture') {
        let img = element.querySelector('img');
        let append = false;
        if (img === null) {
          img = document.createElement('img');
          append = true;
        }
        if (img.nodeName.toLowerCase() === 'img' && !img.hasAttribute('decoding')) {
          img.decoding = 'async';
        }
        if (isIE && element.getAttribute(EnumAttributes.Iesrc)) {
          img.src = element.getAttribute(EnumAttributes.Iesrc);
        }
        if (element.getAttribute(EnumAttributes.Alt)) {
          img.alt = element.getAttribute(EnumAttributes.Alt);
        }
        if (append) {
          element.append(img);
        }
      }
      if (element.nodeName.toLowerCase() === 'video' && !element.getAttribute(EnumAttributes.Src)) {
        if (element.children) {
          const childs = element.children;
          let childSrc;
          for (let i = 0; i <= childs.length - 1; i++) {
            childSrc = childs[i].getAttribute(EnumAttributes.Src);
            if (childSrc) {
              childs[i].src = childSrc;
            }
          }
          element.load();
        }
      }
      if (element.nodeName.toLowerCase() === 'img' && !element.hasAttribute('decoding')) {
        element.decoding = 'async';
      }
      if (element.getAttribute(EnumAttributes.Poster)) {
        element.poster = element.getAttribute(EnumAttributes.Poster);
      }
      if (element.getAttribute(EnumAttributes.Srcset)) {
        element.setAttribute('srcset', element.getAttribute(EnumAttributes.Srcset));
      }
      if (element.getAttribute(EnumAttributes.Src)) {
        element.src = element.getAttribute(EnumAttributes.Src);
      }
      let backgroundImageDelimiter = ',';
      if (element.getAttribute('data-background-delimiter')) {
        backgroundImageDelimiter = element.getAttribute('data-background-delimiter');
      }
      if (element.getAttribute(EnumAttributes.BackgroundImage)) {
        element.style.backgroundImage = `url('${element.getAttribute(EnumAttributes.BackgroundImage).split(backgroundImageDelimiter).join("'),url('")}')`;
      } else if (element.getAttribute(EnumAttributes.BackgroundImageSet)) {
        const imageSetLinks = element.getAttribute(EnumAttributes.BackgroundImageSet).split(backgroundImageDelimiter);
        let firstUrlLink = imageSetLinks[0].substr(0, imageSetLinks[0].indexOf(' ')) || imageSetLinks[0];
        firstUrlLink = firstUrlLink.indexOf('url(') === -1 ? `url(${firstUrlLink})` : firstUrlLink;
        if (imageSetLinks.length === 1) {
          element.style.backgroundImage = firstUrlLink;
        } else {
          element.setAttribute('style', `${element.getAttribute('style') || ''}background-image: ${firstUrlLink}; background-image: -webkit-image-set(${imageSetLinks}); background-image: image-set(${imageSetLinks})`);
        }
      }
      if (element.getAttribute(EnumAttributes.ToggleClass)) {
        element.classList.toggle(element.getAttribute(EnumAttributes.ToggleClass));
      }
    },
    loaded(element) {
      makeIsLoaded(element);
    }
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/lozad/plugins/image-gif-poster.js'] = window.SLM['theme-shared/utils/lozad/plugins/image-gif-poster.js'] || function () {
  const _exports = {};
  const { EnumAttributes } = window['SLM']['theme-shared/utils/lozad/plugins/normal.js'];
  const { isElementType, isGif, isS3FileUrl, SLFile, transformSrcset } = window['SLM']['theme-shared/utils/lozad/util.js'];
  function getPosterUrl(url) {
    if (!isGif(url) || !isS3FileUrl(url)) return;
    const file = new SLFile(url, window.location.href);
    if (file.querys.get('_f') !== '1') return;
    if (file.modifiers[0] === 'poster') return;
    file.modifiers.unshift('poster');
    file.suffix = 'png';
    return file.toString();
  }
  function getPosterData({
    src,
    srcset
  }) {
    const data = {};
    if (src) {
      data.src = getPosterUrl(src);
    }
    if (srcset) {
      let srcsetHasPoster = false;
      data.srcset = transformSrcset(srcset, (url, breakpoint) => {
        const posterUrl = getPosterUrl(url);
        if (posterUrl) {
          srcsetHasPoster = true;
          return [posterUrl, breakpoint];
        }
        return [url, breakpoint];
      });
      if (!srcsetHasPoster) delete data.srcset;
    }
    if (data.src || data.srcset) return data;
  }
  _exports.default = {
    attributes: [],
    load(element) {
      if (isElementType(element, 'img')) {
        const src = element.getAttribute(EnumAttributes.Src);
        const srcset = element.getAttribute(EnumAttributes.Srcset);
        const sizes = element.getAttribute('sizes');
        let isSeted = false;
        const setImageData = ({
          src,
          srcset
        }, img = new Image()) => {
          if (sizes) img.sizes = sizes;
          if (srcset) img.srcset = srcset;
          if (window.__PRELOAD_STATE__.imgNoReferrerSwitch) img.setAttribute('referrerpolicy', 'same-origin');
          if (src) img.src = src;
          return img;
        };
        const setImageSrc = () => {
          if (isSeted) return;
          setImageData({
            src,
            srcset
          }, element);
          isSeted = true;
        };
        const posterData = getPosterData({
          src,
          srcset
        });
        if (posterData) {
          const bgImg = setImageData({
            src,
            srcset
          });
          const posterBgImage = setImageData(posterData);
          bgImg.onload = setImageSrc;
          posterBgImage.onerror = setImageSrc;
          setImageData(posterData, element);
        } else {
          setImageSrc();
        }
      }
    }
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/productImages/js/multi-video.js'] = window.SLM['theme-shared/components/hbs/productImages/js/multi-video.js'] || function () {
  const _exports = {};
  const Swiper = window['swiper']['default'];
  const { EffectFade, Lazy, Thumbs, Navigation } = window['swiper'];
  const url = window['url']['default'];
  const get = window['lodash']['get'];
  const PhotoSwipe = window['photoswipe']['/dist/photoswipe.min'].default;
  const photoSwipeUiDefault = window['photoswipe']['/dist/photoswipe-ui-default.min'].default;
  const YTPlayer = window['yt-player']['default'];
  const imgSize = window['SLM']['theme-shared/utils/img-size.js'].default;
  const photoSwipeHtmlString = window['SLM']['theme-shared/components/hbs/productImages/js/product-photoSwipeHtml.js'].default;
  const imgUrl = window['SLM']['theme-shared/components/hbs/shared/utils/imgUrl.js'].default;
  const getYouTubeCover = window['SLM']['theme-shared/components/hbs/shared/utils/getYouTubeCover.js'].default;
  const GifLozyloadPlugin = window['SLM']['theme-shared/utils/lozad/plugins/image-gif-poster.js'].default;
  Swiper.use([EffectFade, Lazy, Thumbs, Navigation]);
  const COLUMN = 'column';
  const ROW = 'row';
  const WRAP_PC_ID = '.product_pc_productImageContainer';
  const WRAP_M_ID = '.product_mobile_productImageContainer';
  function imgOnload(src, cb, failCb) {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      cb(img);
    };
    img.onerror = () => {
      console.warn('imgOnError...', img);
      failCb(img);
    };
    img.src = src;
  }
  function isYoutube(_url) {
    const urlParse = url.parse(_url);
    return urlParse.hostname === 'www.youtube.com';
  }
  _exports.isYoutube = isYoutube;
  class ProductImages {
    constructor(options) {
      const {
        selectorId,
        heightOnChange,
        swiperConfig,
        mediaList,
        beforeInit,
        skuList,
        imageQuality
      } = options || {};
      this.quality = imageQuality;
      this.mediaList = mediaList || [];
      this._allMediaList = mediaList;
      this.config = {};
      this.skuList = skuList || [];
      this.swiperConfig = swiperConfig || {};
      this.heightChangedCount = 0;
      this.heightOnChange = heightOnChange || null;
      this.slideItems = [];
      if (!selectorId) {
        console.error(`Initialization of the productImages component failed. The selectorId is empty. Please provide a unique ID.`);
        $(WRAP_PC_ID).hide();
        $(WRAP_M_ID).hide();
        return;
      }
      const pcWrapperSelector = `.${ProductImages.pcSelectorPrefix}_${selectorId}`;
      const mobileWrapperSelector = `.${ProductImages.mobileSelectorPrefix}_${selectorId}`;
      if ($(`${pcWrapperSelector}`).length === 0 || $(`${mobileWrapperSelector}`).length === 0) {
        console.error(`Initialization of the productImages component failed. 
        Please check if the selectorId is entered correctly and exists in the HTML.`);
        $(pcWrapperSelector).hide();
        $(mobileWrapperSelector).hide();
        return;
      }
      const pcWrapper = $(`${pcWrapperSelector}`);
      this.thumbsDirection = pcWrapper.data('thumbs-direction') === 'aside' ? COLUMN : ROW;
      this.showThumbsArrow = String(pcWrapper.data('show-thumbnail-arrow')) === 'true';
      this.productImageScale = String($(`.product_productImageScale_${selectorId}`).val()) === 'true';
      this.productVideoMute = String($(`.product_productVideoMute_${selectorId}`).val()) === 'true';
      this.productVideoLoop = String($(`.product_productVideoLoop_${selectorId}`).val()) === 'true';
      this.productVideoAutoplay = String($(`.product_productVideoAutoplay_${selectorId}`).val()) === 'true';
      this.productImageShowSkuImg = String($(`.product_productImageShowSkuImg_${selectorId}`).val()) === 'true';
      this.productShowSwiperArrow = String($(`.product_productImageShowSwiperArrow_${selectorId}`).val()) === 'true';
      this.productShowSkuCover = String($(`.product_productImageNeedSkuCover_${selectorId}`).val()) === 'true';
      this.mobileWidthRatio = $(mobileWrapperSelector).hasClass('middleWidth') ? 0.75 : 1;
      this.productMobilePictureMode = $(`.product_productMobilePictureMode_${selectorId}`).val();
      this.picIsOneHalfOrTwoHalf = this.productMobilePictureMode && (this.productMobilePictureMode.includes('oneHalf') || this.productMobilePictureMode.includes('twoHalf'));
      this.productImageLength = $('.product_productImageLength').val();
      this.id = pcWrapperSelector;
      this.selectorId = selectorId;
      this.mobileId = mobileWrapperSelector;
      if (!this.productImageShowSkuImg) {
        this.mediaList = this.findMainMediaList();
      }
      this.showMagnifier = String($(`.product_productImageMagnifierType_${selectorId}`).val()) === 'hover';
      beforeInit && beforeInit({
        pcWrapperSelector
      });
      this.mobileSwiper = this.initMobileProductImages(true);
      this.swiper = this.initPcProductImages(true);
      this.swiper && this.swiper.init();
      this.pcVideos = this.initPcVideo();
      this.mobileVideos = this.initMobileVideo();
      this.photoSwipeVideos = [];
      if (this.showMagnifier && this.productImageScale) {
        this.handleImageHover();
      }
    }
    setConfig(config) {
      if (!this.config.app) {
        this.config.app = [];
      }
      this.config.app.push(config.app);
    }
    verifySource(app) {
      if (!get(this, 'config.app.length') || this.config.app.includes(app)) {
        return true;
      }
      return false;
    }
    handleVideoPlayPause(player, type) {
      if (type === 'play' && player) {
        player.play();
      }
      if (type === 'pause' && player) {
        player.pause();
      }
    }
    handleUnifyVideoStatus(videos, device, status) {
      videos && videos.forEach(video => {
        this.handleVideoPlayPause(video.player, status);
        if (device === 'mobile') {
          video.playerStatus = status;
        }
      });
    }
    floatVideoDiff(video, autoMute = true) {
      const {
        player,
        platform
      } = video;
      if (platform === 'youtube') {
        player.on('playing', () => {
          window.SL_EventBus.emit('product:product-play-video');
        });
        if (autoMute && (this.productVideoMute || this.productVideoAutoplay)) {
          player.mute();
        }
        player.on('cued', () => {
          this.handleVideoAutoPlay();
        });
        if (this.productVideoLoop) {
          player.on('ended', () => {
            player.play();
          });
        }
      } else if (platform === 'sl') {
        player.addEventListener('playing', () => {
          window.SL_EventBus.emit('product:product-play-video');
        });
        if (this.productVideoMute || this.productVideoAutoplay) {
          player.muted = true;
        }
        player.addEventListener('canplay', () => {
          this.handleVideoAutoPlay();
        });
        if (this.productVideoLoop) {
          player.addEventListener('ended', () => {
            player.play();
          });
        }
      }
      window.SL_EventBus.on('global:popup:close', () => {
        this.handleVideoPlayPause(player, 'pause');
      });
    }
    initVideoCoverDom(video) {
      const parentDom = video.dom.closest('[data-video-platform]');
      const coverDom = parentDom ? parentDom.querySelector('.product_photoSwipe_image') : undefined;
      if (!coverDom) return;
      coverDom.addEventListener('click', () => {
        const shouldExecutePlayStatus = video.playerStatus === 'pause' ? 'play' : 'pause';
        this.handleVideoPlayPause(video.player, shouldExecutePlayStatus);
        video.playerStatus = shouldExecutePlayStatus;
      });
      return coverDom;
    }
    initYoutubeVideo(doms, options = {}, autoMute = true) {
      return Array.from(doms).map(dom => {
        const {
          videoId
        } = dom.dataset;
        if (!videoId) return;
        const video = {
          dom,
          mediaIndex: Number(dom.closest('[data-index]').dataset.index),
          platform: 'youtube',
          player: new YTPlayer(dom, {
            modestBranding: true,
            controls: true,
            ...options
          })
        };
        video.player.load(videoId);
        this.initVideoCoverDom(video);
        this.floatVideoDiff(video, autoMute);
        return video;
      });
    }
    initSlVideo(doms, autoMute = true) {
      return Array.from(doms).map(dom => {
        const video = {
          dom,
          mediaIndex: Number(dom.closest('[data-index]').dataset.index),
          platform: 'sl',
          player: dom
        };
        this.initVideoCoverDom(video);
        this.floatVideoDiff(video, autoMute);
        return video;
      });
    }
    initPcVideo() {
      const ytbVideoPcSelector = `${this.id} .product_youTubeVideoBox`;
      const ytbVideoDom = $(ytbVideoPcSelector);
      const slVideoDom = $(`${this.id} .product_slVideoContainer`);
      const videos = [...this.initYoutubeVideo(ytbVideoDom, {
        modestBranding: true,
        controls: true
      }), ...this.initSlVideo(slVideoDom)].filter(Boolean).sort((first, next) => first.mediaIndex - next.mediaIndex);
      this.handleVideoAutoPlay(videos);
      return videos;
    }
    initMobileVideo() {
      const ytbVideoMDom = $(`${this.mobileId} .swiper-slide`).not('.swiper-slide-duplicate').find('.product_youTubeVideoBox').addClass('product_youTubeMobileVideoBox');
      const slVideoMDom = $(`${this.mobileId} .swiper-slide`).not('.swiper-slide-duplicate').find('.product_slVideoContainer');
      const videos = [...this.initYoutubeVideo(ytbVideoMDom, {
        modestBranding: true,
        controls: false
      }), ...this.initSlVideo(slVideoMDom)].filter(Boolean);
      this.handleVideoAutoPlay(videos);
      return videos;
    }
    initPhotoSwipe(slidesWrapID, platform) {
      if (Number(this.productImageLength) === 0) return;
      const slidesSelector = `${slidesWrapID} .product_productImages`;
      const triggerDom = $(slidesSelector);
      const eventDom = platform === 'mobile' ? '.scaleImageIcon' : '.swiper-slide';
      const self = this;
      self.updatePhotoSwipeItems(slidesWrapID);
      triggerDom.on('click', eventDom, function () {
        if ($(this).hasClass('swiper-slide-duplicate') || !get(self, 'slideItems.length') || $(this).hasClass('imageItem--hover')) {
          return;
        }
        const triggerThis = platform === 'mobile' ? $(this).closest('.imageItem') : $(this);
        const isMobileHasActiveSkuImage = triggerThis.find('.product_m_skuImage').length > 0;
        const isVideoSlide = triggerThis.hasClass('videoItem');
        if (isMobileHasActiveSkuImage || isVideoSlide) return;
        const {
          activeIndex
        } = platform === 'mobile' ? self.mobileSwiper : self.swiper;
        const mobileIndex = self.picIsOneHalfOrTwoHalf ? triggerThis.data('index') : activeIndex;
        const mobileIndexByLoop = self.getSwiperIsLoop() ? triggerThis.data('swiper-slide-index') : mobileIndex;
        const index = platform === 'mobile' ? mobileIndexByLoop : activeIndex;
        self.handlePhotoSwiper(self.slideItems, index);
      });
    }
    initPcSkuPhotoSwiper() {
      const self = this;
      $(`${this.id} .product_pc_skuImage`).on('click', function () {
        const items = [{
          src: $(this).find('.product_photoSwipe_image').attr('data-photoswipe-src'),
          w: 0,
          h: 0,
          el: $(this)[0]
        }];
        self.handlePhotoSwiper(items, 0, false);
      });
    }
    handlePhotoSwiper(items, index, cacheNaturalSize) {
      let pswpElement = document.querySelectorAll('.pswp')[0];
      if (!pswpElement) {
        $('body').append(photoSwipeHtmlString);
        pswpElement = document.querySelectorAll('.pswp')[0];
      }
      this.openPhotoSwipe(pswpElement, items, index, cacheNaturalSize);
    }
    initMobileSkuPhotoSwiper() {
      const self = this;
      $(`${this.mobileId} .product_m_skuImageBox .scaleSkuImageIcon`).on('click', function () {
        const items = [{
          src: $(this).parent().find('.product_photoSwipe_image').attr('data-photoswipe-src'),
          w: 0,
          h: 0,
          el: $(this).parent()[0]
        }];
        self.handlePhotoSwiper(items, 0, false);
      });
    }
    updatePhotoSwipeItems(slidesWrapID) {
      const slidesDom = $(`${slidesWrapID} .product_productImages`).find('.swiper-slide').not('.swiper-slide-duplicate').filter(function () {
        return !$(this).children('.product-detail-empty-image').length;
      });
      const items = [];
      slidesDom.each((index, item) => {
        const imgEl = $(item).find('.product_photoSwipe_image');
        const size = $(item).attr('data-natural-size');
        const transSize = size ? size.split('x') : null;
        items.push({
          src: imgEl.attr('data-photoswipe-src'),
          w: transSize ? parseInt(transSize[0], 10) : imgEl.innerWidth(),
          h: transSize ? parseInt(transSize[1], 10) : imgEl.innerHeight(),
          el: item
        });
      });
      this.slideItems = items;
    }
    openPhotoSwipe(pswpElement, items, index = 0, cacheNaturalSize = true) {
      const self = this;
      if (items && items.length > 1) {
        $('.pswp__button--arrow--left, .pswp__button--arrow--right').show();
      } else {
        $('.pswp__button--arrow--left, .pswp__button--arrow--right').hide();
      }
      const renderItems = items.map(item => {
        const isVideo = item.el.classList.contains('videoItem');
        if (isVideo) {
          const currentVideo = self.pcVideos.find(video => String(video.mediaIndex) === item.el.dataset.index);
          if (currentVideo) {
            const videoDom = currentVideo.dom.cloneNode(true);
            videoDom.removeAttribute('id');
            videoDom.classList.add('phone-swipe-video');
            videoDom.dataset.platform = currentVideo.platform;
            videoDom.dataset.mediaIndex = item.el.dataset.index;
            if (videoDom.tagName.toLowerCase() === 'video') {
              const controlsList = videoDom.getAttribute('controlslist') || '';
              videoDom.setAttribute('controlslist', controlsList.replace('nofullscreen', ''));
            }
            const aspectRatio = item.w / item.h;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight - 130;
            const height = screenWidth / aspectRatio;
            const heightRatio = screenHeight / height;
            const scale = Math.min(1, heightRatio);
            return {
              el: item.el,
              html: `
              <div class="phone-swipe-media-wrapper">
                <div class="phone-swipe-video-wrapper" data-index="${item.el.dataset.index}" style="width: ${scale * 100}%; --padding-top: ${item.h / item.w * 100}%;">${videoDom.outerHTML}</div>
              </div>
            `
            };
          }
        }
        return item;
      });
      const photoSwipeOptions = {
        allowPanToNext: false,
        captionEl: false,
        closeOnScroll: false,
        counterEl: false,
        history: false,
        index,
        pinchToClose: false,
        preloaderEl: false,
        shareEl: false,
        tapToToggleControls: false,
        barsSize: {
          top: 20,
          bottom: 20
        },
        getThumbBoundsFn(_index) {
          let thumbnailParent;
          if (renderItems[_index].el && renderItems[_index].el.className.indexOf('swiper-slide-duplicate') !== -1) {
            thumbnailParent = $(`${self.mobileId} .swiper-slide`).eq(self.mobileSwiper.activeIndex).get(0);
          } else {
            thumbnailParent = renderItems[_index].el;
          }
          const thumbnail = thumbnailParent.getElementsByClassName('product_photoSwipe_image')[0];
          const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          const rect = thumbnail.getBoundingClientRect();
          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width
          };
        }
      };
      const gallery = new PhotoSwipe(pswpElement, photoSwipeUiDefault, renderItems, photoSwipeOptions);
      gallery.listen('gettingData', function (_index, item) {
        const imgWrapEl = item.el;
        const img = new Image();
        if (!imgWrapEl.getAttribute('data-natural-size')) {
          if (!window.__PRELOAD_STATE__.imgNoReferrerSwitch) {
            img.src = item.src;
          }
          img.onload = () => {
            const _img = imgSize(img.src);
            const hasWH = _img && _img.ratio;
            if (cacheNaturalSize) {
              const naturalSize = hasWH ? `${img.naturalWidth}x${img.naturalHeight}` : `100x100`;
              imgWrapEl.setAttribute('data-natural-size', naturalSize);
            }
            item.w = img.naturalWidth;
            item.h = img.naturalHeight;
            gallery.updateSize(true);
          };
        }
        if (window.__PRELOAD_STATE__.imgNoReferrerSwitch) {
          img.setAttribute('referrerpolicy', 'same-origin');
          img.src = item.src;
        }
      });
      gallery.init();
      this.initGalleryVideo(gallery);
      gallery.listen('afterChange', () => {
        this.galleryAfterChange(gallery);
      });
    }
    initGalleryVideo(gallery) {
      this.photoSwipeVideos = [];
      const initVideo = () => {
        const swipeVideoDoms = gallery.container.querySelectorAll('.phone-swipe-video');
        const uninitializedSwipeVideoDoms = Array.from(swipeVideoDoms).filter(videoDom => videoDom.dataset.slInit !== 'true' && videoDom.tagName.toLowerCase() !== 'iframe');
        uninitializedSwipeVideoDoms.forEach(videoDom => {
          videoDom.dataset.slInit = 'true';
          const doms = [videoDom];
          const [video] = videoDom.dataset.platform === 'youtube' ? this.initYoutubeVideo(doms, {
            modestBranding: true,
            controls: true
          }, false) : this.initSlVideo(doms, false);
          this.photoSwipeVideos.push(video);
          const renderItem = gallery.items.find(item => item.el.dataset.index === videoDom.dataset.mediaIndex);
          if (renderItem && renderItem.container) {
            renderItem.html = renderItem.container.querySelector('.phone-swipe-media-wrapper');
          }
        });
      };
      const autoPlayCurrentVideo = () => {
        if (!this.productVideoAutoplay) return;
        const currentIndex = gallery.getCurrentIndex();
        const currentVideo = this.photoSwipeVideos.find(video => video.mediaIndex === currentIndex);
        if (!currentVideo) return;
        setTimeout(() => {
          const nowIndex = gallery.getCurrentIndex();
          if (nowIndex !== currentIndex) return;
          this.handleVideoPlayPause(currentVideo.player, 'play');
        }, 1000);
      };
      gallery.listen('beforeChange', () => {
        this.handleUnifyVideoStatus(this.photoSwipeVideos, 'mobile', 'pause');
        initVideo();
        autoPlayCurrentVideo();
      });
      gallery.listen('initialZoomInEnd', () => {
        initVideo();
        autoPlayCurrentVideo();
      });
      gallery.listen('close', () => {
        this.handleUnifyVideoStatus(this.photoSwipeVideos, 'mobile', 'pause');
        this.photoSwipeVideos = [];
      });
    }
    galleryAfterChange(gallery) {
      const currentIndex = gallery.getCurrentIndex();
      this.swiper && this.swiper.slideTo(currentIndex);
      this.mobileSwiper && this.mobileSwiper.slideToLoop(currentIndex);
    }
    heightOnChangeCb(height) {
      setTimeout(() => {
        this.heightOnChange && this.heightOnChange(height);
      }, 200);
    }
    handleProductImagesHeight(swiperSelector, activeIndex, ratio = 1, targetImgSrc) {
      const self = this;
      const selector = swiperSelector;
      this.heightChangedCount++;
      const count = this.heightChangedCount;
      const promise = new Promise((resolve, reject) => {
        if (count !== this.heightChangedCount) {
          resolve();
          return;
        }
        if (activeIndex !== undefined) {
          const currentSlide = $(`${selector} .swiper-slide`).eq(activeIndex);
          if (!targetImgSrc && currentSlide.find('.product-detail-empty-image').length > 0) {
            const mobileWidthRatio = $(`${self.mobileId}`).css('display') === 'block' ? self.mobileWidthRatio : 1;
            const boxWidth = parseInt($(`${selector}`).width() * mobileWidthRatio, 10);
            $(`${selector}`).css('height', boxWidth);
            self.heightOnChangeCb(boxWidth);
            resolve(boxWidth);
            return;
          }
          if (currentSlide.hasClass('videoItem') && !targetImgSrc) {
            const videoBoxHeight = parseInt(currentSlide.children().innerHeight(), 10);
            $(`${selector}`).css('height', videoBoxHeight);
            self.heightOnChangeCb(videoBoxHeight);
            window.SL_EventBus.emit('product:expose-product-video', currentSlide);
            resolve(videoBoxHeight);
          } else if (currentSlide.hasClass('imageItem') || targetImgSrc) {
            const currentSlideImgNaturalSize = currentSlide.attr('data-natural-size');
            if (currentSlideImgNaturalSize && !targetImgSrc) {
              const [imgNaturalWidth, imgNaturalHeight] = currentSlideImgNaturalSize.split('x');
              const wrapperHeight = parseInt(String($(`${selector}`)[0].offsetWidth * ratio * imgNaturalHeight / imgNaturalWidth), 10);
              $(`${selector}`).css('height', wrapperHeight);
              self.heightOnChangeCb(wrapperHeight);
              resolve(wrapperHeight);
              return;
            }
            const currentSlideImg = currentSlide.find('img');
            const imgSrc = targetImgSrc || currentSlideImg.attr('src') || currentSlideImg.attr('data-src');
            if (!targetImgSrc && $(`${self.id}`).css('display') !== 'none') {
              const slideHeight = parseInt(currentSlide.innerHeight(), 10);
              $(`${selector}`).css('height', slideHeight);
              self.heightOnChangeCb(slideHeight);
              resolve(slideHeight);
              return;
            }
            imgOnload(imgSrc, img => {
              if (count !== this.heightChangedCount) {
                resolve();
                return;
              }
              if (!img) {
                reject(new Error('Not an img object'));
                return;
              }
              const height = parseInt(String($(`${selector}`)[0].offsetWidth * ratio * img.height / img.width), 10);
              $(`${selector}`).css('height', height);
              self.heightOnChangeCb(height);
              resolve(height);
            }, () => {
              if (count !== this.heightChangedCount) {
                resolve();
                return;
              }
              const mobileWidthRatio = $(`${self.mobileId}`).css('display') === 'block' ? self.mobileWidthRatio : 1;
              const boxWidth = parseInt($(`${selector}`).width() * mobileWidthRatio, 10);
              $(`${selector}`).css('height', boxWidth);
              if (targetImgSrc && selector.indexOf(ProductImages.pcSelectorPrefix) !== -1) {
                $(`${this.id} .product_pc_skuImage`).addClass('imageItemError');
              } else if (targetImgSrc && selector.indexOf(ProductImages.mobileSelectorPrefix) !== -1) {
                const currentSlideDom = self.getMobileCurrentSlideDom();
                currentSlideDom.find('.product_m_skuImageBox').addClass('imageItemError');
              } else {
                currentSlide.addClass('imageItemError');
              }
              self.heightOnChangeCb(boxWidth);
              resolve(boxWidth);
            });
          } else {
            reject(new Error(`Current slide sub-node content is abnormal,currentSlide:${currentSlide},activeIndex:${activeIndex}`));
          }
        } else {
          reject(new Error(`The activeIndex is abnormal: ${activeIndex}`));
        }
      });
      return promise;
    }
    setColumnThumbsSwiperHeight(height) {
      $(`${this.id} .product_thumbsColumnContainer .productImageThumbs`).css({
        maxHeight: `${height}px`
      });
    }
    handleThumbsArrow(activeIndex, slideLen, wrapperHeight) {
      const selectorPrefix = this.id;
      const {
        thumbsDirection: direction,
        showThumbsArrow
      } = this;
      if (!showThumbsArrow) {
        this.setColumnThumbsSwiperHeight(wrapperHeight);
        return;
      }
      $(`${selectorPrefix} .thumbsArrowTop,${selectorPrefix} .thumbsArrowBottom`).show();
      if (activeIndex === 0) {
        $(`${selectorPrefix} .thumbsArrowTop`).hide();
        if (direction === COLUMN) {
          this.setColumnThumbsSwiperHeight(`${wrapperHeight - 25}`);
        }
      }
      if (activeIndex + 1 === slideLen) {
        $(`${selectorPrefix} .thumbsArrowBottom`).hide();
        if (direction === COLUMN) {
          this.setColumnThumbsSwiperHeight(`${wrapperHeight - 25}`);
        }
      } else {
        if (direction === COLUMN) {
          this.setColumnThumbsSwiperHeight(`${wrapperHeight - 50}`);
        }
      }
    }
    async handleEffectSwiperHeight(targetImageUrl) {
      const {
        swiper
      } = this;
      const {
        slides,
        activeIndex
      } = swiper || {};
      const height = await this.handleProductImagesHeight(`${this.id} .product_productImages`, activeIndex, 1, targetImageUrl);
      if (height) {
        this.handleThumbsArrow(activeIndex, slides.length, height);
      }
    }
    togglePcSkuImage(isShow, skuImageUrl) {
      const skuImageDom = $(`${this.id} .product_pc_skuImage`);
      const currentIndex = $(`${this.id}`).attr('data-index') || 0;
      if (skuImageDom.hasClass('imageItemError')) {
        skuImageDom.removeClass('imageItemError');
      }
      if (isShow && skuImageUrl) {
        const width = get(imgSize(skuImageUrl), 'width');
        const height = get(imgSize(skuImageUrl), 'height');
        skuImageDom.show().html(`<img class="product_photoSwipe_image" ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''} data-photoswipe-src=${imgUrl(skuImageUrl, {
          width: 1800
        })} src=${skuImageUrl} />${this.showMagnifier ? `<img data-height="${height}" data-width="${width}" class="imageItem--hover" ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''} data-photoswipe-src=${imgUrl(skuImageUrl, {
          width: 1800
        })} src=${skuImageUrl} />` : ''}`);
        $(`${this.id} .productImageThumbsWrapper .thumbsImageItem`).eq(currentIndex).removeClass('active');
        this.productShowSkuCover = true;
      } else if (!isShow) {
        skuImageDom.hide().empty();
        $(`${this.id} .productImageThumbsWrapper .thumbsImageItem`).eq(currentIndex).addClass('active');
        this.productShowSkuCover = false;
      }
    }
    handlePcSkuImage(isShow, skuImage) {
      if (!this.swiper) return;
      if (isShow) {
        this.handleEffectSwiperHeight(skuImage);
        this.togglePcSkuImage(true, skuImage);
      } else {
        this.togglePcSkuImage(false);
        this.handleEffectSwiperHeight();
      }
    }
    handleThumbsScroll(type, distance, smooth = true, timeout = 200) {
      if (type === 'scrollTop') {
        setTimeout(() => {
          const productImageThumbs = $(`${this.id} .product_thumbsColumnContainer .productImageThumbs`);
          if (smooth) {
            productImageThumbs.addClass('smooth-animate');
          } else {
            productImageThumbs.removeClass('smooth-animate');
          }
          productImageThumbs.scrollTop(distance);
        }, timeout);
      } else if (type === 'scrollLeft') {
        setTimeout(() => {
          const productImageThumbs = $(`${this.id} .product_thumbsRowContainer .productImageThumbs`);
          if (smooth) {
            productImageThumbs.addClass('smooth-animate');
          } else {
            productImageThumbs.removeClass('smooth-animate');
          }
          productImageThumbs.scrollLeft(distance);
        }, timeout);
      }
    }
    getThumbsPosition(type, index) {
      const columnThumbsListDom = $(`${this.id} .product_thumbsColumnContainer .thumbsImageItem`);
      const rowThumbsListDom = $(`${this.id} .product_thumbsRowContainer .thumbsImageItem`);
      if (type === 'top') {
        if (!columnThumbsListDom.length) {
          return 0;
        }
        const prevThumbsItem = columnThumbsListDom.eq(index > 0 ? index - 1 : 0);
        const prevThumbsItemHalfHeight = parseInt(prevThumbsItem.innerHeight() / 2, 10);
        return columnThumbsListDom.eq(index).position().top - prevThumbsItemHalfHeight - 20;
      }
      if (type === 'left') {
        if (!rowThumbsListDom.length) {
          return 0;
        }
        const prevThumbsItem = rowThumbsListDom.eq(index > 0 ? index - 1 : 0);
        const prevThumbsItemHalfWidth = parseInt(prevThumbsItem.innerWidth() / 2, 10);
        return rowThumbsListDom.eq(index).position().left - prevThumbsItemHalfWidth - 20;
      }
    }
    initHandleProductImagesArrow() {
      if (!this.showThumbsArrow) return;
      const {
        thumbsDirection: direction
      } = this;
      $(`${this.id} .arrowTop`).on('click', () => {
        const {
          activeIndex
        } = this.swiper;
        this.swiper.slidePrev();
        if (direction === COLUMN) {
          const scrollTopDistance = this.getThumbsPosition('top', activeIndex - 1);
          this.handleThumbsScroll('scrollTop', scrollTopDistance);
        } else if (direction === ROW) {
          const scrollLeftDistance = this.getThumbsPosition('left', activeIndex - 1);
          this.handleThumbsScroll('scrollLeft', scrollLeftDistance);
        }
      });
      $(`${this.id} .arrowBottom`).on('click', () => {
        const {
          activeIndex
        } = this.swiper;
        this.swiper.slideNext();
        if (direction === COLUMN) {
          const scrollTopDistance = this.getThumbsPosition('top', activeIndex + 1);
          this.handleThumbsScroll('scrollTop', scrollTopDistance);
        } else if (direction === ROW) {
          const scrollLeftDistance = this.getThumbsPosition('left', activeIndex + 1);
          this.handleThumbsScroll('scrollLeft', scrollLeftDistance);
        }
      });
    }
    handlePcThumbsActive(index) {
      $(`${this.id} .productImageThumbsWrapper .thumbsImageItem`).removeClass('active').eq(index).addClass('active');
      $(`${this.id}`).attr('data-index', index);
    }
    async initThumbsSwiper(firstInit) {
      const {
        thumbsDirection
      } = this;
      const self = this;
      const bindClickDom = $(`${this.id} .product_thumbs${thumbsDirection === COLUMN ? 'Column' : 'Row'}Container `);
      bindClickDom.on('click', '.thumbsImageItem', function () {
        const index = $(this).index();
        self.swiper.slideTo(index);
        if ($(`${self.id} .product_pc_skuImage`).css('display') === 'block') {
          self.handlePcSkuImage(false);
          $(this).addClass('active');
        }
      });
      const skuImageDom = $(`${this.id} .product_pc_skuImage`).find('img');
      const skuImage = skuImageDom.attr('data-src') || skuImageDom.attr('src');
      if (!skuImage) {
        this.handlePcThumbsActive(self.swiper.activeIndex);
      }
      await this.handleEffectSwiperHeight(skuImage ? skuImage : null);
      if (skuImage && firstInit) {
        const firstActiveImg = $(`${this.id}`).find('.swiper-slide-active img');
        if (firstActiveImg.length > 0) {
          const src = firstActiveImg.attr('src') || firstActiveImg.attr('data-src');
          const _img = imgSize(src);
          const ratio = _img && _img.ratio || '100%';
          firstActiveImg.parent().css('paddingBottom', ratio);
        }
        const emptyDom = $(`${this.id}`).find('.product-detail-empty-image');
        if (emptyDom.length > 0) {
          emptyDom.css('paddingBottom', '100%');
        }
      }
      if (firstInit) {
        $(`${this.id}`).find('.swiper-slide').removeClass('firstInit');
      }
      $(`${this.id} .product_thumbsColumnContainer`).height('auto');
      $(`${this.id} .product_thumbsRowContainer`).height('auto');
      this.initHandleProductImagesArrow();
    }
    initPcProductImages(firstInit) {
      const pcProductImagesDom = $(`${this.id}`);
      if (pcProductImagesDom.find('.product_productImages').length == 0 || pcProductImagesDom.css('display') === 'none') return null;
      const mainSwiper = new Swiper(`${this.id} .product_productImages`, {
        initialSlide: $(`${this.id}`).data('initial-slide') || 0,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        navigation: {
          nextEl: `${this.id} .swiper-button-next_pc_${this.selectorId}`,
          prevEl: `${this.id} .swiper-button-prev_pc_${this.selectorId}`,
          enabled: this.mediaList && this.mediaList.length > 1 && this.productShowSwiperArrow
        },
        init: firstInit ? false : true,
        lazy: {
          loadOnTransitionStart: true
        },
        allowTouchMove: false,
        on: {
          init: () => {
            if (firstInit) {
              this.initThumbsSwiper(firstInit);
              if (this.productImageScale && !this.showMagnifier) {
                this.initPhotoSwipe(this.id, 'pc');
                this.initPcSkuPhotoSwiper();
              }
            }
            if (this.mediaList && this.mediaList.length > 1 && this.productShowSwiperArrow) {
              $(`${this.id} .swiper-button-next_pc_${this.selectorId}`).show();
              $(`${this.id} .swiper-button-prev_pc_${this.selectorId}`).show();
            } else {
              $(`${this.id} .swiper-button-next_pc_${this.selectorId}`).hide();
              $(`${this.id} .swiper-button-prev_pc_${this.selectorId}`).hide();
            }
          },
          slideChange: () => {
            this.handleUnifyVideoStatus(this.pcVideos, 'pc', 'pause');
            if (this.swiper.destroyed) return;
            const {
              activeIndex,
              previousIndex
            } = this.swiper;
            this.handlePcThumbsActive(activeIndex);
            this.handlePcSkuImage(false);
            if (this.thumbsDirection === COLUMN) {
              const scrollTopDistance = this.getThumbsPosition('top', activeIndex);
              this.handleThumbsScroll('scrollTop', scrollTopDistance, Math.abs(activeIndex - previousIndex) < 10);
            } else {
              const scrollLeftDistance = this.getThumbsPosition('left', activeIndex);
              this.handleThumbsScroll('scrollLeft', scrollLeftDistance, Math.abs(activeIndex - previousIndex) < 10);
            }
            this.handleVideoAutoPlay();
          },
          lazyImageLoad: (_swiper, _slideEl, imageEl) => {
            GifLozyloadPlugin.load(imageEl);
          }
        }
      });
      return mainSwiper;
    }
    getActivePaginationList(activeIndex, activePointer) {
      const list = [];
      for (let i = 0; i < 5; i++) {
        const offset = i - activePointer;
        list.push(activeIndex + offset);
      }
      return list;
    }
    handleMActivePagination(activeIndex) {
      const previousIndex = this.mobileRealPreviewIndex || 0;
      this.mobileRealPreviewIndex = activeIndex;
      const listContainer = $(`${this.mobileId} .paginationList`);
      const scrollWrapper = listContainer.children('.paginationListWrapper');
      const bullets = scrollWrapper.children('span');
      const length = bullets.length;
      if (bullets.length < 6) {
        scrollWrapper.addClass('noTransition');
        scrollWrapper.css('transform', '');
        bullets.removeClass('active');
        bullets.eq(activeIndex).addClass('active');
        return;
      }
      if (!this.mobilePaginationList) {
        this.mobilePaginationList = [0, 1, 2, 3, 4];
      }
      let resultMobilePaginationList = this.mobilePaginationList;
      const previousPointer = this.mobilePaginationList.indexOf(previousIndex);
      const offsetIndex = previousIndex - activeIndex;
      if (offsetIndex < 0) {
        let activePointer = Math.min(3, previousPointer - offsetIndex);
        if (activeIndex === length - 1) {
          activePointer = 4;
        }
        resultMobilePaginationList = this.getActivePaginationList(activeIndex, activePointer);
      } else {
        let activePointer = Math.max(1, previousPointer - offsetIndex);
        if (activeIndex === 0) {
          activePointer = 0;
        }
        resultMobilePaginationList = this.getActivePaginationList(activeIndex, activePointer);
      }
      if (Math.abs(offsetIndex) > 1) {
        scrollWrapper.addClass('noTransition');
      } else {
        scrollWrapper.removeClass('noTransition');
      }
      if (this.mobilePaginationList[0] - 1 > -1) {
        bullets.eq(this.mobilePaginationList[0] - 1).removeClass(['active', 'next']);
      }
      if (this.mobilePaginationList[this.mobilePaginationList.length - 1] + 1 < length) {
        bullets.eq(this.mobilePaginationList[this.mobilePaginationList.length - 1] + 1).removeClass(['active', 'next']);
      }
      this.mobilePaginationList.forEach((index, i) => {
        bullets.eq(index).removeClass(['active', 'next']);
      });
      bullets.eq(activeIndex).addClass('active');
      if (resultMobilePaginationList[0] - 1 > 0) {
        bullets.eq(resultMobilePaginationList[0] - 1).addClass('next');
        bullets.eq(resultMobilePaginationList[0]).addClass('next');
      } else if (resultMobilePaginationList[0] > 0) {
        bullets.eq(resultMobilePaginationList[0]).addClass('next');
      }
      if (resultMobilePaginationList[resultMobilePaginationList.length - 1] + 1 < length - 1) {
        bullets.eq(resultMobilePaginationList[resultMobilePaginationList.length - 1] + 1).addClass('next');
        bullets.eq(resultMobilePaginationList[resultMobilePaginationList.length - 1]).addClass('next');
      } else if (resultMobilePaginationList[resultMobilePaginationList.length - 1] < length - 1) {
        bullets.eq(resultMobilePaginationList[resultMobilePaginationList.length - 1]).addClass('next');
      }
      if (resultMobilePaginationList[0] !== this.mobilePaginationList[0]) {
        scrollWrapper.css('transform', `translate3d(-${resultMobilePaginationList[0] / length * 100}%, 0, 0)`);
      }
      this.mobilePaginationList = resultMobilePaginationList;
    }
    handleMobileSkuImage(isShow, skuImageUrl) {
      const selector = `${this.mobileId} .product_productImages`;
      const mainSwiperDom = $(selector);
      if (!this.mobileSwiper) return;
      if (mainSwiperDom.length === 0) {
        console.error('Switching SKU images on the mobile end failed. Please check if the selectorId is entered correctly and exists in the HTML.');
        return;
      }
      const {
        realIndex
      } = this.mobileSwiper;
      if (isShow) {
        this.toggleMSkuImage(realIndex, true, skuImageUrl);
      } else {
        this.toggleMSkuImage(realIndex, false);
      }
    }
    getSwiperIsLoop() {
      return $(`${this.mobileId} .product_productImages .swiper-slide-duplicate`).length > 0;
    }
    bindMobileSkuImageScaleDom() {
      const self = this;
      $('.product_m_skuImageBox .scaleSkuImageIcon').on('click', function () {
        const items = [{
          src: $(this).parent().find('.product_photoSwipe_image').attr('data-photoswipe-src'),
          w: 0,
          h: 0,
          el: $(this).parent()[0]
        }];
        self.handlePhotoSwiper(items, 0, false);
      });
    }
    getMobileCurrentSlideDom(index) {
      const {
        realIndex
      } = this.mobileSwiper || {};
      const _index = index || realIndex;
      const swiperIsLoop = this.getSwiperIsLoop();
      const currentSlideDom = swiperIsLoop ? $(`${this.mobileId} .product_productImages .swiper-slide[data-swiper-slide-index="${_index}"]`) : $(`${this.mobileId} .product_productImages .swiper-slide`).eq(_index);
      return currentSlideDom;
    }
    setCurrentSlidePB($dom, imageUrl) {
      const ratio = imgSize(imageUrl).ratio || '100%';
      $dom.css('paddingBottom', ratio).attr('data-sku-image-ratio', ratio);
    }
    toggleMSkuImage(index, isShow, skuImageUrl) {
      const self = this;
      if (index === undefined || index === null) {
        console.error(`toggleMSkuImage: Index is abnormal ${index}`);
        return;
      }
      const currentSlideDom = self.getMobileCurrentSlideDom(index);
      const currentSkuImageBox = currentSlideDom.find('.product_m_skuImageBox');
      const currentSlideBox = currentSlideDom.find('.swiper-slide-box');
      const currentSkuImageIsError = currentSkuImageBox.hasClass('imageItemError');
      if (currentSkuImageIsError) {
        currentSkuImageBox.removeClass('imageItemError');
      }
      const skuImageDom = `
    <div class="product_m_skuImageBox">
      <img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''} onerror="this.onerror=null;this.parentElement.className+=' imageItemError';" class="product_m_skuImage product_photoSwipe_image" data-photoswipe-src=${imgUrl(skuImageUrl, {
        width: 1800
      })} src=${skuImageUrl} />
      ${self.productImageScale ? `<div class="scaleSkuImageIcon">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13" cy="12" r="7.5" stroke="black"/>
      <path d="M18.5 17.5L23 22.5" stroke="black" stroke-linecap="round"/>
      </svg>
      </div>` : ''}
    </div>`;
      if (isShow && index !== undefined && skuImageUrl) {
        currentSlideDom.find('img').hide();
        if (currentSkuImageBox.length === 0) {
          currentSlideDom.append(skuImageDom);
          self.setCurrentSlidePB(currentSlideBox, skuImageUrl);
          self.bindMobileSkuImageScaleDom();
        } else {
          currentSkuImageBox.find('.product_m_skuImage').removeAttr('srcset data-srcset').attr({
            src: skuImageUrl,
            'data-photoswipe-src': imgUrl(skuImageUrl, {
              width: 1800
            }),
            onerror: "this.onerror=null;this.parentElement.className+=' imageItemError';"
          }).show();
          self.setCurrentSlidePB(currentSlideBox, skuImageUrl);
        }
        this.mobileSwiper.updateAutoHeight();
        $(`${this.mobileId} .product_productImages`).attr('sku-image-index', index);
        this.productShowSkuCover = true;
      } else if (!isShow && index !== undefined && currentSkuImageBox.length > 0) {
        const slideImg = currentSlideDom.find('img');
        if (currentSlideBox.attr('data-image-ratio')) {
          currentSlideBox.css('paddingBottom', currentSlideBox.attr('data-image-ratio')).removeAttr('data-sku-image-ratio');
        }
        currentSkuImageBox.remove();
        slideImg.show();
        this.mobileSwiper.updateAutoHeight();
        $(`${this.mobileId} .product_productImages`).attr('sku-image-index', null);
        this.productShowSkuCover = false;
      }
    }
    handleMobileScaleImage() {
      $(`${this.mobileId} .paginationList div`).removeClass('active').eq(activeIndex).addClass('active');
    }
    initMobileProductImages(firstInit) {
      const mobileProductImagesDom = $(`${this.mobileId}`);
      const selector = `${this.mobileId} .product_productImages`;
      const mainSwiperDom = $(selector);
      const slidesLength = mainSwiperDom.find('.swiper-slide').length;
      const videoDom = mainSwiperDom.find('.videoItem');
      const videoIndex = videoDom.data('index');
      const videoIsStartOrEndPos = videoIndex === 0 || videoIndex === videoDom.data('length') - 1 || slidesLength === 1;
      if (mainSwiperDom.length === 0 || mobileProductImagesDom.css('display') === 'none') return null;
      const mainSwiper = new Swiper(selector, {
        loop: videoIsStartOrEndPos ? false : true,
        initialSlide: $(`${this.mobileId}`).data('initial-slide') || 0,
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 5,
        autoHeight: true,
        lazy: {
          loadOnTransitionStart: true,
          loadPrevNext: this.mobileWidthRatio === 0.75 ? true : false
        },
        on: {
          init: swiper => {
            if (firstInit) {
              if (this.productImageScale) {
                this.initPhotoSwipe(this.mobileId, 'mobile');
                this.initMobileSkuPhotoSwiper();
              }
              this.handleMActivePagination(swiper.realIndex);
              $(`${this.mobileId} .product_productImages`).attr('sku-image-index', swiper.realIndex);
              if (videoIsStartOrEndPos) {
                const skuImageDom = $(`${this.mobileId} .product_productImages .swiper-slide`).eq(swiper.realIndex).find('.product_m_skuImage');
                const skuImage = skuImageDom.attr('src') || skuImageDom.attr('data-src');
              }
              $(`${this.mobileId} .product_productImages .swiper-slide`).css('height', 'auto');
              swiper.updateAutoHeight();
              window.lozadObserver && window.lozadObserver.observe();
            }
          },
          slideChange: swiper => {
            this.handleUnifyVideoStatus(this.mobileVideos, 'mobile', 'pause');
            this.handleMActivePagination(swiper.realIndex);
            const skuImageDom = $(`${this.mobileId} .product_productImages .swiper-slide`).eq(swiper.realIndex).find('.product_m_skuImage');
            const skuImage = skuImageDom.attr('src') || skuImageDom.attr('data-src');
          },
          slideChangeTransitionEnd: () => {
            const skuImageIndex = $(`${this.mobileId} .product_productImages`).attr('sku-image-index');
            if (skuImageIndex !== undefined) {
              this.toggleMSkuImage(skuImageIndex, false);
            }
            this.handleVideoAutoPlay();
          }
        },
        ...this.swiperConfig.mobile
      });
      return mainSwiper;
    }
    renderVideoItem(item, index) {
      const {
        middle: cover,
        videoId
      } = getYouTubeCover(item.resource);
      const isYoutubeVideo = isYoutube(item.resource);
      const photoswipeCoverSrc = isYoutubeVideo ? cover : imgUrl(item.cover, {
        width: 1800
      });
      return `${isYoutubeVideo ? `<div class="product_youTubeVideoContainer">
        <div class="product_youTubeVideoBox" data-video-id="${videoId}"></div>
      </div>` : `<video class="product_slVideoContainer" disablepictureinpicture controls webkit-playsinline playsinline controlslist="nodownload nofullscreen" poster="${item.cover}">
        <source src="${item.resource}" type="video/mp4">
      </video>`}
    <img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''} onerror="this.onerror=null;this.parentElement.className+=' videoCoverError';" 
    class="product_photoSwipe_image swiper-lazy"
    data-photoswipe-src="${photoswipeCoverSrc}" ${index !== 0 ? 'data-' : ''}src="${photoswipeCoverSrc}" alt="">`;
    }
    updateSlides(list) {
      $(`${this.id} .product_productImages`).children('.swiper-wrapper').empty().append(Array.isArray(list) ? list.map((item, index) => {
        const imgRatio = imgSize(item.resource).ratio || '100%';
        const width = get(imgSize(item.resource), 'width');
        const height = get(imgSize(item.resource), 'height');
        const isYoutubeVideo = isYoutube(item.resource);
        if (item.type === 'VIDEO') {
          return `<div class="swiper-slide videoItem" data-video-platform="${isYoutubeVideo ? 'youtube' : 'sl'}" style="padding-bottom: ${isYoutubeVideo ? '56.25%' : imgSize(item.cover).ratio || '56.25%'}">${this.renderVideoItem(item, index)};</div>`;
        }
        return `<div class="swiper-slide imageItem imageItem--${this.showMagnifier ? 'hover' : 'pointer'}" style="height: 0; padding-bottom:${imgRatio}"><img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''} onerror="this.onerror=null;this.parentElement.className+=' imageItemError';" data-photoswipe-src="${item.resource}" ${index !== 0 ? 'data-' : ''}src="${item.resource}" alt="" class="swiper-lazy product_photoSwipe_image">${this.showMagnifier ? `<img data-width="${width}" data-height="${height}" ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''} onerror="this.onerror=null;this.parentElement.className+=' imageItemError';" data-photoswipe-src="${item.resource}" src="${item.resource}" alt="" class="swiper-lazy imageItem--hover">` : ''}</div>`;
      }) : `<div class="swiper-slide"><div class="product-detail-empty-image"></div></div>`);
      const slidesLength = list.length;
      const mobileWrapper = $(`${this.mobileId} .product_productImages`).children('.swiper-wrapper');
      if (get(list, 'length') === 1 || get(list, '[0].type') === 'VIDEO' || get(list, `[${get(list, 'length') - 1}].type`) === 'VIDEO') {
        mobileWrapper.addClass('hasVideoFl');
      } else {
        mobileWrapper.removeClass('hasVideoFl');
      }
      mobileWrapper.empty().append(Array.isArray(list) ? list.map((item, index) => {
        if (item.type === 'VIDEO') {
          const isYoutubeVideo = isYoutube(item.resource);
          const ratio = isYoutubeVideo ? '56.25%' : imgSize(item.cover).ratio || '56.25%';
          return `<div class="swiper-slide videoItem" data-video-platform="${isYoutubeVideo ? 'youtube' : 'sl'}" style="height: auto" data-index="${index}" data-length="${slidesLength}">
                <div class="swiper-slide-box" data-image-ratio="${ratio}" style="padding-bottom: ${ratio}">
                  ${this.renderVideoItem(item, index)}
                </div>
              </div>`;
        }
        const ratio = imgSize(item.resource).ratio || '100%';
        return `<div class="swiper-slide imageItem" data-index="${index}" style="height: auto">
<div class="swiper-slide-box" data-image-ratio="${ratio}" data-sku-image-ratio="100%" style="padding-bottom: ${ratio}">
<img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  onerror="this.onerror=null;this.parentElement.className+=' imageItemError';" data-photoswipe-src="${item.resource}" ${index !== 0 ? 'data-' : ''}src="${item.resource}" alt="" class="swiper-lazy product_photoSwipe_image">${this.productImageScale ? `<div class="scaleImageIcon"><div class="scaleImageIconSvg"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="12" r="7.5" /><path d="M18.5 17.5L23 22.5" stroke-linecap="round" /></svg></div></div>` : ''}</div>
</div>`;
      }) : `<div class="swiper-slide"><div class="swiper-slide-box" data-image-ratio="100%" style="padding-bottom: 100%"><div class="product-detail-empty-image product-noImages"></div></div></div>`);
    }
    updateImageList(list, activeIndex, source) {
      if (!this.verifySource(source && source.app)) {
        return;
      }
      this.mediaList = list;
      this.handleUnifyVideoStatus(this.pcVideos, 'pc', 'pause');
      this.handleUnifyVideoStatus(this.mobileVideos, 'mobile', 'pause');
      this.replaceThubsSwiper(list, activeIndex);
      this.swiper && this.swiper.destroy();
      this.mobileSwiper && this.mobileSwiper.destroy();
      this.updateSlides(list);
      if (this.swiper) {
        $(`${this.id}`).data('initial-slide', activeIndex);
        this.swiper = this.initPcProductImages();
        this.updatePhotoSwipeItems(this.id);
        this.handleEffectSwiperHeight();
        if (this.thumbsDirection === COLUMN) {
          const scrollTopDistance = this.getThumbsPosition('top', activeIndex);
          this.handleThumbsScroll('scrollTop', scrollTopDistance, false, 0);
        } else {
          const scrollLeftDistance = this.getThumbsPosition('left', activeIndex);
          this.handleThumbsScroll('scrollLeft', scrollLeftDistance, false, 0);
        }
      }
      if (this.mobileSwiper) {
        $(`${this.mobileId}`).data('initial-slide', activeIndex);
        this.mobileSwiper = this.initMobileProductImages();
        this.updatePhotoSwipeItems(this.mobileId);
      }
      this.pcVideos = this.initPcVideo();
      this.mobileVideos = this.initMobileVideo();
      $(`${this.id}`).attr('data-index', activeIndex || 0);
      if (this.showMagnifier && this.productImageScale) {
        this.handleImageHover();
      }
    }
    replaceThubsSwiper(list, activeIndex) {
      const wrapper = $(`${this.id} .product_thumbs${this.thumbsDirection === COLUMN ? 'Column' : 'Row'}Container .productImageThumbsWrapper`);
      const mBox = $(`${this.mobileId} .paginationBox`);
      const mWrapper = mBox.find('.paginationListWrapper');
      const thumbImageRatio = wrapper.data('thumb_image_ratio');
      wrapper.empty();
      mWrapper.empty();
      if (!get(list, 'length') || list.length <= 1) {
        $(`${this.id} .product_thumbs${this.thumbsDirection === COLUMN ? 'Column' : 'Row'}Container`).hide();
        mBox.hide();
      } else {
        $(`${this.id} .product_thumbs${this.thumbsDirection === COLUMN ? 'Column' : 'Row'}Container`).show();
        mBox.show();
        list.forEach((item, index) => {
          const ratio = thumbImageRatio || imgSize(item.resource).ratio || '100%';
          const customThumbImageClass = thumbImageRatio ? 'customImageRatio' : '';
          if (item.type === 'VIDEO') {
            const isYoutubeVideo = isYoutube(item.resource);
            wrapper.append(`<div class="swiper-slide thumbsImageItem ${customThumbImageClass} ${activeIndex === index ? 'active' : ''}"><figure style="padding-bottom: ${ratio}"><img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''} onerror="this.onerror=null;this.parentElement.className+=' videoCoverError';" src="${isYoutubeVideo ? getYouTubeCover(item.resource).middle : item.cover}" alt=""><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="10" fill="black" fill-opacity="0.6"/>
          <path d="M13.6256 10.2496L8.46641 13.6891C8.26704 13.822 8 13.6791 8 13.4394V6.56056C8 6.32095 8.26704 6.17803 8.46641 6.31094L13.6256 9.75039C13.8037 9.86913 13.8037 10.1309 13.6256 10.2496Z" fill="white"/>
          </svg></figure>
          </div>`);
          } else {
            wrapper.append($(`<div class="swiper-slide thumbsImageItem ${customThumbImageClass} ${activeIndex === index ? 'active' : ''}"><figure style="padding-bottom: ${ratio}"><img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''} onerror="this.onerror=null;this.parentElement.className+=' imageItemError';" src="${imgUrl(item.resource, {
              width: 152
            })}" alt=""></figure></div>`));
          }
          mWrapper.append(`<span class="${activeIndex === index ? 'active' : ''}" />`);
        });
      }
    }
    skuImageChange(img, source) {
      if (!this.verifySource(source && source.app)) {
        return;
      }
      const {
        url
      } = img || {};
      if (url) {
        this.handleUnifyVideoStatus(this.pcVideos, 'pc', 'pause');
        this.handleUnifyVideoStatus(this.mobileVideos, 'mobile', 'pause');
        const index = this.mediaList.findIndex(item => item.resource === url);
        const showUrl = imgUrl(url, {
          quality: this.quality
        });
        if (index > -1) {
          this.swiper && this.swiper.slideTo(index);
          this.mobileSwiper && this.mobileSwiper.slideToLoop(index, 0);
          this.handlePcSkuImage(false);
          this.handleMobileSkuImage(false);
        } else {
          this.handlePcSkuImage(true, showUrl);
          this.handleMobileSkuImage(true, showUrl);
        }
      } else {
        this.handlePcSkuImage(false);
        this.handleMobileSkuImage(false);
        this.handleVideoAutoPlay();
      }
      if (this.showMagnifier && this.productImageScale) {
        this.handleImageHover();
      }
    }
    handleVideoAutoPlay(videos) {
      if (this.productShowSkuCover) return;
      if (Array.isArray(this.mediaList)) {
        if (this.mobileSwiper) {
          const media = this.mediaList[this.mobileSwiper.realIndex] || {};
          if (media.type === 'VIDEO') {
            if (this.productVideoAutoplay) {
              const currentVideos = (videos || this.mobileVideos || []).filter(video => video.mediaIndex === this.mobileSwiper.realIndex);
              currentVideos && this.handleUnifyVideoStatus(currentVideos, 'mobile', 'play');
            }
          }
        } else if (this.swiper) {
          const media = this.mediaList[this.swiper.realIndex] || {};
          if (media.type === 'VIDEO') {
            if (this.productVideoAutoplay) {
              const currentVideos = (videos || this.pcVideos || []).filter(video => video.mediaIndex === this.swiper.realIndex);
              currentVideos && this.handleUnifyVideoStatus(currentVideos, 'mobile', 'play');
            }
          }
        }
      }
    }
    findMainMediaList() {
      const skuImageList = {};
      if (Array.isArray(this.skuList)) {
        this.skuList.forEach(item => {
          if (Array.isArray(item.imageList)) {
            item.imageList.forEach(img => {
              skuImageList[img] = true;
            });
          }
        });
      }
      const mainImageList = [];
      if (Array.isArray(this._allMediaList)) {
        this._allMediaList.forEach(item => {
          if (item && !skuImageList[item.resource]) {
            mainImageList.push(item);
          }
        });
      }
      return mainImageList;
    }
    handleImageHover() {
      const imageItems = $(this.id).find('.imageItem');
      const skuImage = $(this.id).find('.product_pc_skuImage');
      const skuImageFlatten = $(this.id).find('.product_pc_skuImage_flatten');
      function handleMouseMove(item) {
        const hoverDom = item.find('.imageItem--hover');
        const orgImg = item.find('img:not(.imageItem--hover)');
        const zoom = 1.5;
        const dheight = hoverDom.data('height');
        const dwidth = hoverDom.data('width');
        hoverDom.css('opacity', 0);
        item.on('mousemove', function (e) {
          const rect = item[0].getBoundingClientRect();
          const height = Math.max(dheight, rect.height) * zoom;
          const width = Math.max(dwidth, rect.width) * zoom;
          hoverDom.css('width', width);
          hoverDom.css('height', height);
          const mx = e.clientX - rect.x;
          const my = e.clientY - rect.y;
          hoverDom.css('opacity', 1);
          orgImg.css('opacity', 0);
          hoverDom.css('left', -width * (mx / rect.width) + mx);
          hoverDom.css('top', -height * (my / rect.height) + my);
        });
        item.on('mouseleave', function () {
          hoverDom.css('opacity', 0);
          orgImg.css('opacity', 1);
        });
      }
      if (skuImageFlatten.hasClass('product_pc_skuImage_flatten--hover')) {
        handleMouseMove(skuImageFlatten);
      }
      if (skuImage.hasClass('product_pc_skuImage--hover')) {
        handleMouseMove(skuImage);
      }
      imageItems.each(function (_, item) {
        item = $(item);
        if (item.hasClass('imageItem--hover')) {
          handleMouseMove(item);
        }
      });
    }
  }
  ProductImages.pcSelectorPrefix = 'execute_productImages_pc';
  ProductImages.mobileSelectorPrefix = 'execute_productImages_mobile';
  _exports.default = ProductImages;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/product/sku-changed/index.js'] = window.SLM['theme-shared/events/product/sku-changed/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const EVENT_NAME = 'Product::SkuChanged';
  const logger = apiLogger(EVENT_NAME);
  const external = window.Shopline && window.Shopline.event;
  const skuChanged = data => {
    if (external) {
      logger.info(`[emit]`, {
        data
      });
      return external.emit(EVENT_NAME, {
        data,
        onSuccess: result => {
          logger.info('success', {
            data: {
              result
            }
          });
        },
        onError: error => {
          logger.error('error', {
            error
          });
        }
      });
    }
  };
  skuChanged.apiName = EVENT_NAME;
  _exports.default = skuChanged;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/detail/js/product-swiper.js'] = window.SLM['product/detail/js/product-swiper.js'] || function () {
  const _exports = {};
  const ProductImages = window['SLM']['theme-shared/components/hbs/productImages/js/multi-video.js'].default;
  const { isYoutube } = window['SLM']['theme-shared/components/hbs/productImages/js/multi-video.js'];
  const getYouTubeCover = window['SLM']['theme-shared/components/hbs/shared/utils/getYouTubeCover.js'].default;
  const imgSize = window['SLM']['theme-shared/utils/img-size.js'].default;
  const imgUrl = window['SLM']['theme-shared/components/hbs/shared/utils/imgUrl.js'].default;
  const get = window['lodash']['get'];
  const throttle = window['SLM']['commons/utils/throttle.js'].default;
  class ProductImagesWithFlattenAndMobileThumb extends ProductImages {
    constructor(...args) {
      const {
        selectorId
      } = args[0] || {};
      const productMobileHideThumbnailImage = $(`.product_productMobileThumbnailImageHide_${selectorId}`).val() === 'hide';
      const productMobilePictureMode = $(`.product_productMobilePictureMode_${selectorId}`).val();
      let productMobilePictureModeConfig = {};
      if (productMobilePictureMode.includes('oneHalf') || productMobilePictureMode.includes('twoHalf')) {
        productMobilePictureModeConfig = {
          slidesPerView: productMobilePictureMode.includes('twoHalf') ? 2.5 : 1.5,
          watchSlidesVisibility: true,
          slidesPerGroup: 1,
          centeredSlides: false
        };
      }
      const productImageConfig = {
        ...args[0],
        swiperConfig: {
          mobile: {
            loop: false,
            ...productMobilePictureModeConfig
          }
        }
      };
      if (!productMobileHideThumbnailImage) {
        productImageConfig.swiperConfig = {
          mobile: {
            loop: false,
            ...productMobilePictureModeConfig,
            thumbs: {
              swiper: {
                el: `${`.execute_productImages_mobile_${selectorId}`} .product_mobile_thumbnail_container .swiper-container`,
                spaceBetween: 10,
                slidesPerView: 3.5,
                watchSlidesVisibility: true,
                slidesPerGroup: 1,
                navigation: false
              },
              multipleActiveThumbs: false
            }
          }
        };
      }
      super(productImageConfig);
      this.productImageShowType = $(`.product_productImageShowStyle_${selectorId}`).val();
      if (this.productImageShowType === 'one_column' || this.productImageShowType === 'two_column') {
        this.initColumnLayout(...args);
      }
      if (this.productImageShowType === 'flatten') {
        this.productImageIsFlatten = $(`.product_productImageShowStyle_${selectorId}`).val() === 'flatten';
        this.productPcSkuImageFlatten = $(this.id).find('.product_pc_skuImage_flatten');
        this.productPcNormalItemFlatten = $(this.id).find('.normalItem');
        if (!this.mobileSwiper && this.productImageScale) {
          this.initPcPhotoSwipe();
          this.initFlattenPcSkuPhotoSwiper();
        }
        if (!this.mobileSwiper) {
          this.handleVideoAutoPlay();
        }
      }
      this.pictureMode = productMobilePictureMode;
      this.productMobileHideThumbnailImage = productMobileHideThumbnailImage;
      if (this.productMobileHideThumbnailImage && this.mobileSwiper) {
        const index = $(`${this.mobileId}`).data('initial-slide') || 0;
        const total = get(this.mobileSwiper, 'slidesGrid.length');
        this.updatePagination(index, total);
        this.initMobileNormalPagination();
      }
      if (!this.productMobileHideThumbnailImage && this.mobileSwiper) {
        this.handleInitThumbnailImageBySkuImage();
      }
    }
    findSkuImage(src) {
      return this._allMediaList.find(item => item.resource === src);
    }
    loadMoreFlattenPhoto() {
      const newAddPicNum = this.listLength - this.lastShowIndex >= 6 ? 6 : this.listLength - this.lastShowIndex;
      this.ToIndexFlattenPhoto(this.lastShowIndex + newAddPicNum, false);
    }
    ToIndexFlattenPhoto(toIndex, isAnchor, anchorIndex) {
      const colDom = $(`${this.id}.product_productImages_tile`);
      const itemDom = this.productImageIsOneColumn ? $(`${this.id} .flatten_ImageItem`) : $(`${this.id} .imageItem, ${this.id} .videoItem`);
      if (toIndex > this.lastShowIndex && itemDom.length >= 40) {
        const newAddList = this.spuImgList.slice(this.lastShowIndex + 1, toIndex + 1);
        if (this.productImageIsTwoColumn) {
          const evenColDom = $(`${this.id}.product_productImages_tile`).find('.product_images_firstCol');
          const oddColDom = $(`${this.id}.product_productImages_tile`).find('.product_images_secondCol');
          this.addPicToTwoCol(newAddList, evenColDom, oddColDom);
        }
        if (this.productImageIsOneColumn) {
          this.addPicToOneCol(newAddList, colDom);
        }
        window.lozadObserver.observe();
        if (!this.mobileSwiper && this.productImageScale) {
          this.updateFlattenPhotoSwipeItems();
        }
        this.lastShowIndex = toIndex;
        if (this.lastShowIndex >= this.listLength - 1) $(`${this.id}`).find('.more-pic-btn').hide();
      }
      if (!isAnchor) return;
      const imgAnchor = $(`${this.id}`).find(`span[data-index="${anchorIndex}"]`);
      if (!imgAnchor.length) return;
      if (!colDom.find('.placeHolderDiv').length) {
        this.placeHolderHeight = $(`[data-product-spu-id="${this.spuSeq}"]  .product-detail-sticky`).height() - $(`[data-product-spu-id="${this.spuSeq}"]  .product-detail-sticky .sticky-main-view`).height();
        colDom.find('.more-pic-btn').after(`<div class="placeHolderDiv" style="height:${this.placeHolderHeight}px"></div>`);
      } else {
        colDom.find('.placeHolderDiv').height(this.placeHolderHeight);
      }
      const imgDomTop = $(`[data-product-spu-id="${this.spuSeq}"] .product-detail-col-img`)[0].offsetTop;
      const cunrrentScrollTop = document.documentElement.scrollTop;
      let imgAnchorTop = imgDomTop > cunrrentScrollTop ? 0 : cunrrentScrollTop - imgDomTop;
      const isHeaderSticky = $('.header-sticky-wrapper').hasClass('is-sticky');
      if (isHeaderSticky) {
        const headerBottom = $('.header-sticky-wrapper #stage-header')[0].scrollTop + $('.header-sticky-wrapper #stage-header').outerHeight();
        imgAnchorTop += headerBottom;
      }
      if (this.isDetail) imgAnchor.css('top', `-${imgAnchorTop}px`);
      imgAnchor && imgAnchor[0].scrollIntoView();
      if (this.isDetail) window.scrollTo(0, cunrrentScrollTop);
    }
    addPicToOneCol(list, colDom) {
      let imgDomStr = '';
      list.forEach(item => {
        const {
          index
        } = item;
        if (item.type === 'VIDEO') {
          const {
            middle: cover,
            videoId
          } = getYouTubeCover(item.resource);
          const isYoutubeVideo = isYoutube(item.resource);
          const photoswipeCoverSrc = isYoutubeVideo ? cover : item.cover;
          imgDomStr += `<div class="flatten_ImageItem"><figure class="videoItem" data-index="${index}" style="padding-bottom: ${isYoutubeVideo ? '56.25%' : imgSize(item.cover) && imgSize(item.cover).ratio || '56.25%'}">
            ${isYoutubeVideo ? `<div class="product_youTubeVideoBox" data-video-id="${videoId}"></div>` : `<video class="product_slVideoContainer" disablepictureinpicture controls webkit-playsinline playsinline controlslist="nodownload nofullscreen" poster="${item.cover}">
                    <source src="${item.resource}" type="video/mp4">
                  </video>`}
            <img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  onerror="this.onerror=null;this.parentElement.className+=' imageItemError';"  class="product_photoSwipe_image lozad" data-photoswipe-src="${photoswipeCoverSrc}" data-src="${photoswipeCoverSrc}" alt="">
          </figure></div>`;
          return;
        }
        const {
          ratio = '100%',
          height,
          width
        } = imgSize(item.resource);
        imgDomStr += `<div class="flatten_ImageItem"><span data-spu-col-img="${item.resource}" data-index="${index}"></span><figure data-index="${index}" class="imageItem imageItem--${this.showMagnifier ? 'hover' : 'pointer'}" style="padding-bottom: ${ratio}">
<img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  onerror="this.onerror=null;this.parentElement.className+=' imageItemError';" class="product_photoSwipe_image lozad" data-src="${item.resource}" data-photoswipe-src="${item.resource}" alt="">${this.showMagnifier ? `<img data-width="${width}" data-height="${height}" ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  onerror="this.onerror=null;this.parentElement.className+=' imageItemError';" class="product_photoSwipe_image lozad imageItem--hover" data-src="${item.resource}" alt="" />` : ''}
</figure></div>`;
      });
      const parentDom = colDom.find('.more-pic-btn');
      if (parentDom.length) {
        parentDom.before(imgDomStr);
      } else {
        colDom.empty().append(imgDomStr);
      }
      window.lozadObserver.observe();
      if (this.showMagnifier && this.productImageScale) {
        this.handleImageHover();
      }
    }
    addPicToTwoCol(list, evenColDom, oddColDom) {
      let evenDom = '';
      let oddDom = '';
      list.forEach(item => {
        let dom;
        const {
          index
        } = item;
        if (item.type === 'VIDEO') {
          const {
            middle: cover,
            videoId
          } = getYouTubeCover(item.resource);
          const isYoutubeVideo = isYoutube(item.resource);
          const photoswipeCoverSrc = isYoutubeVideo ? cover : item.cover;
          if (isYoutubeVideo) {
            dom = `<div class="videoItem" data-index="${index}" style="padding-bottom: ${isYoutubeVideo ? '56.25%' : imgSize(item.cover) && imgSize(item.cover).ratio || '56.25%'}">
                  <div class="product_youTubeVideoBox" data-video-id="${videoId}"></div>
                  <img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  class="product_photoSwipe_image lozad" data-src="${photoswipeCoverSrc}"  data-photoswipe-src="${photoswipeCoverSrc}"  alt="">
                </div>`;
          } else {
            dom = `<div class="videoItem" data-index="${index}" style="padding-bottom: ${isYoutubeVideo ? '56.25%' : imgSize(item.cover) && imgSize(item.cover).ratio || '56.25%'}">
                  <video class="product_slVideoContainer" disablepictureinpicture controls webkit-playsinline playsinline controlslist="nodownload nofullscreen" poster="${item.cover}">
                    <source src="${item.resource}" type="video/mp4">
                  </video>
                  <img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  class="product_photoSwipe_image lozad" data-src="${photoswipeCoverSrc}"  data-photoswipe-src="${photoswipeCoverSrc}"  alt="">
                </div>`;
          }
        } else {
          const {
            ratio = '100%',
            height,
            width
          } = imgSize(item.resource);
          dom = `<div class="imageItem imageItem--${this.showMagnifier ? 'hover' : 'pointer'}" style="padding-bottom: ${ratio}" data-index="${index}"><span data-spu-col-img="${item.resource}" data-index="${index}"></span><img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  onerror="this.onerror=null;this.parentElement.className+=' imageItemError';" data-photoswipe-src="${item.resource}" class="product_photoSwipe_image lozad" data-src="${item.resource}" alt="">${this.showMagnifier ? `<img data-width="${width}" data-height="${height}" ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  onerror="this.onerror=null;this.parentElement.className+=' imageItemError';" class="product_photoSwipe_image lozad imageItem--hover" data-src="${item.resource}" alt="">` : ''}</div>`;
        }
        if (index % 2) {
          oddDom += dom;
        } else {
          evenDom += dom;
        }
      });
      evenColDom.append(evenDom);
      oddColDom.append(oddDom);
      if (this.showMagnifier && this.productImageScale) {
        this.handleImageHover();
      }
    }
    updateOneColumnImageList(list, activeIndex) {
      this.spuImgList = list.map((item, index) => {
        item.index = index;
        return item;
      });
      const cunrrentScrollTop = document.documentElement.scrollTop;
      this.listLength = list.length;
      const colDom = $(`${this.id}.product_productImages_tile`);
      colDom.find(`.flatten_ImageItem`).remove();
      if (this.isDetail) window.scrollTo(0, cunrrentScrollTop);
      if (this.spuImgList.length) {
        const showlistLength = this.spuImgList.length < 40 ? this.listLength : 40;
        const showlist = this.spuImgList.slice(0, showlistLength);
        if (this.listLength < 40) {
          colDom.find('.more-pic-btn').hide();
        } else {
          colDom.find('.more-pic-btn').show();
        }
        this.addPicToOneCol(showlist, colDom);
        if (!this.mobileSwiper && this.productImageScale) {
          this.updateFlattenPhotoSwipeItems();
        }
        const imgAnchor = $(`${this.id}`).find(`span[data-index="${activeIndex}"]`);
        if (!imgAnchor.length) return;
        const imgDomTop = $(`[data-product-spu-id="${this.spuSeq}"] .product-detail-col-img`)[0].offsetTop;
        let imgAnchorTop = imgDomTop > cunrrentScrollTop ? 0 : cunrrentScrollTop - imgDomTop;
        const isHeaderSticky = $('.header-sticky-wrapper').hasClass('is-sticky');
        if (isHeaderSticky) {
          const headerBottom = $('.header-sticky-wrapper #stage-header')[0].scrollTop + $('.header-sticky-wrapper #stage-header').outerHeight();
          imgAnchorTop += headerBottom;
        }
        if (this.isDetail) imgAnchor.css('top', `-${imgAnchorTop}px`);
        imgAnchor && imgAnchor[0].scrollIntoView();
        if (this.isDetail) window.scrollTo(0, cunrrentScrollTop);
        this.lastShowIndex = showlistLength - 1;
      } else {
        colDom.empty().append(`<div class="product-detail-empty-image"></div>`);
      }
    }
    updateTwoColumnImageList(list, activeIndex) {
      const container = $(`${this.id}.product_productImages_tile`);
      const cunrrentScrollTop = document.documentElement.scrollTop;
      let firstCol = container.find('.product_images_firstCol').empty();
      let secondCol = container.find('.product_images_secondCol').empty();
      if (!firstCol.length) {
        firstCol = $(`<div class='product_images_firstCol'></div>`);
        container.append(firstCol);
      }
      if (!secondCol.length) {
        secondCol = $(`<div class='product_images_secondCol'></div>`);
        container.append(secondCol);
      }
      if (this.isDetail) window.scrollTo(0, cunrrentScrollTop);
      this.spuImgList = list.map((item, index) => {
        item.index = index;
        return item;
      });
      this.listLength = this.spuImgList.length;
      if (this.spuImgList.length) {
        container.removeClass('product-detail-empty-image');
        container.addClass('row gx-md-4');
        const showlistLength = this.listLength < 40 ? this.listLength : 40;
        const showlist = this.spuImgList.slice(0, showlistLength + 1);
        if (this.listLength <= showlistLength) {
          $(`${this.id}`).find('.more-pic-btn').hide();
        } else {
          $(`${this.id}`).find('.more-pic-btn').show();
        }
        this.addPicToTwoCol(showlist, firstCol, secondCol);
        window.lozadObserver.observe();
        if (list.length > 1) {
          container.addClass('row-cols-md-2');
        } else {
          container.removeClass('row-cols-md-2');
        }
        if (!this.mobileSwiper && this.productImageScale) {
          this.updateFlattenPhotoSwipeItems();
        }
        const imgAnchor = $(`${this.id}`).find(`span[data-index="${activeIndex}"]`);
        if (!imgAnchor.length) return;
        const imgDomTop = $(`[data-product-spu-id="${this.spuSeq}"] .product-detail-col-img`)[0].offsetTop;
        let imgAnchorTop = imgDomTop > cunrrentScrollTop ? 0 : cunrrentScrollTop - imgDomTop;
        const isHeaderSticky = $('.header-sticky-wrapper').hasClass('is-sticky');
        if (isHeaderSticky) {
          const headerBottom = $('.header-sticky-wrapper #stage-header')[0].scrollTop + $('.header-sticky-wrapper #stage-header').outerHeight();
          imgAnchorTop += headerBottom;
        }
        if (this.isDetail) imgAnchor.css('top', `-${imgAnchorTop}px`);
        imgAnchor && imgAnchor[0].scrollIntoView();
        if (this.isDetail) window.scrollTo(0, cunrrentScrollTop);
        this.lastShowIndex = showlistLength - 1;
      } else {
        container.addClass('product-detail-empty-image');
      }
    }
    initColumnLayout(args) {
      const {
        selectorId,
        mediaList,
        spuSeq,
        skuList
      } = args || {};
      this.skuList = skuList;
      this._allMediaList = mediaList;
      this.productImageIsColumnLayout = this.productImageShowType === 'two_column' || this.productImageShowType === 'one_column';
      this.productImageIsOneColumn = this.productImageShowType === 'one_column';
      this.productImageIsTwoColumn = this.productImageShowType === 'two_column';
      this.productImagesNeedAppendTopImage = this.productImageIsColumnLayout;
      this.productImageActiveSkuImage = $(`.product_productImageActiveSkuImage_${selectorId}`).val();
      this.spuSeq = spuSeq;
      this.isDetail = selectorId.indexOf('productDetail') > -1;
      this.isUserScrolled = localStorage.getItem('isUserScrolled') || false;
      this.initImgDomHeight = false;
      this.headerOffset = $('#stage-header').data('sticky') ? $('.header__layout-background').height() : 0;
      let _mediaList = mediaList;
      console.warn('this.productImageShowSkuImg', this.productImageShowSkuImg, this.productImageActiveSkuImage);
      if (!this.productImageShowSkuImg) {
        _mediaList = this.findMainMediaList();
        const skuImage = this.findSkuImage(this.productImageActiveSkuImage);
        if (skuImage) {
          _mediaList = [{
            ...skuImage,
            isSkuImage: true
          }, ..._mediaList];
        }
      }
      this.spuImgList = _mediaList.map((item, index) => {
        item.index = index;
        return item;
      });
      const itemDom = this.productImageIsOneColumn ? $(`${this.id} .flatten_ImageItem`) : $(`${this.id} .imageItem, ${this.id} .videoItem`);
      this.listLength = this.spuImgList.length;
      if (this.listLength < 40 || itemDom.length < 40) $(`${this.id}`).find('.more-pic-btn').hide();
      this.lastShowIndex = this.listLength > 40 ? 39 : this.listLength;
      this.initIndex = $(`${this.id}`).data('init-index');
      const minimumIndex = this.productImageIsOneColumn ? 0 : 1;
      if (this.initIndex > minimumIndex) {
        $(`${this.id}`).css('opacity', 0);
        setTimeout(() => {
          this.ToIndexFlattenPhoto(this.initIndex + 6, true, this.initIndex);
          $(`${this.id}`).css('opacity', 1);
        }, 200);
      }
      if (this.productImageIsColumnLayout && !this.mobileSwiper) {
        const infoDom = $(`[data-product-spu-id="${this.spuSeq}"]  .product-detail-sticky`);
        const imgDom = $(`[data-product-spu-id="${this.spuSeq}"] .product_productImages_tile`);
        let skuTradeDom = $(`[data-product-spu-id="${this.spuSeq}"] .product-sku-trade-flatten`);
        if (!skuTradeDom.length) skuTradeDom = $(`[data-product-spu-id="${this.spuSeq}"] .product-sku-trade-select`);
        const skuTradeDomOffsetTop = skuTradeDom[0] ? skuTradeDom[0].offsetTop : 0;
        const viewHeight = this.isDetail ? window.innerHeight - skuTradeDomOffsetTop : $(`[data-product-spu-id="${this.spuSeq}"]`).height();
        let infoDomHeight = infoDom.height();
        const imgDomHieght = imgDom.height();
        if (imgDomHieght > infoDomHeight) {
          if (infoDomHeight <= viewHeight) {
            if (imgDomHieght >= viewHeight) {
              imgDom.height(viewHeight);
            }
          } else {
            imgDom.height(infoDomHeight);
          }
        }
        if ($(`${this.id}`).height() <= imgDom.height()) {
          imgDom.find('.col-img-tips svg').hide();
        } else if (!this.isUserScrolled) imgDom.find('.col-img-tips svg').show();
        if (this.isDetail) {
          const skuTradeheight = skuTradeDom.height();
          const infoTop = infoDom[0].offsetTop;
          const skuTradeTop = skuTradeDomOffsetTop;
          this.placeHolderHeight = infoDomHeight - (skuTradeTop - infoTop) - skuTradeheight - 80;
        } else {
          this.placeHolderHeight = infoDomHeight - $(`[data-product-spu-id="${this.spuSeq}"]  .product-detail-sticky .sticky-main-view`).height();
        }
        const scrollCheckFunc = throttle(200, () => {
          if (infoDomHeight === infoDom.height() && this.initImgDomHeight) return;
          this.initImgDomHeight = true;
          infoDomHeight = infoDom.height();
          const skuTradeheight = skuTradeDom.height();
          const infoTop = infoDom[0].offsetTop;
          const skuTradeTop = skuTradeDomOffsetTop;
          this.placeHolderHeight = infoDomHeight - (skuTradeTop - infoTop) - skuTradeheight - 80;
          $(`${this.id}`).find('.placeHolderDiv').height(this.placeHolderHeight);
          imgDom.css('max-height', `${infoDom.height()}px`);
          imgDom.height(infoDom.height());
          if ($(`${this.id}`).height() <= imgDom.height()) {
            imgDom.find('.col-img-tips svg').hide();
          } else if (!this.isUserScrolled) imgDom.find('.col-img-tips svg').show();
        });
        if (this.isDetail) {
          window.addEventListener('scroll', scrollCheckFunc);
        }
        setTimeout(() => {
          imgDom[0].onscroll = () => {
            imgDom.find('.col-img-tips svg').hide();
            localStorage.setItem('isUserScrolled', true);
          };
        }, 300);
        const self = this;
        $(`${this.id}`).on('click', '.more-pic-btn', function () {
          self.loadMoreFlattenPhoto();
        });
        this.handleVideoAutoPlay();
      }
      if (this.productImageIsColumnLayout && !this.mobileSwiper && this.productImageScale) {
        this.initPcPhotoSwipe();
      }
    }
    handleInitThumbnailImageBySkuImage() {
      const index = get(this.mobileSwiper, 'activeIndex');
      const firstThumbnail = $(`${this.mobileId} .product_mobile_thumbnail_container`).find('.swiper-slide').eq(index);
      const activeCls = 'noShowActive';
      if ($(`${this.mobileId}`).find('.product_m_skuImageBox').length > 0) {
        firstThumbnail.addClass(activeCls);
        firstThumbnail.one('click', () => {
          firstThumbnail.removeClass(activeCls);
          super.handleMobileSkuImage(false);
        });
      } else {
        firstThumbnail.removeClass(activeCls);
      }
    }
    updatePagination(currentIndex, total) {
      const _total = this.pictureMode.includes('twoHalf') ? total - 1 : total;
      const {
        mobileId
      } = this;
      const prevDom = $(`${mobileId} .normal-thumbnail-button-prev`);
      const nextDom = $(`${mobileId} .normal-thumbnail-button-next`);
      const content = $(`${mobileId} .pagination-content`);
      const paginationContainer = $(`${this.mobileId} .product_mobile_thumbnail_pagination`);
      const paginationType = paginationContainer.data('pagination-type');
      if (paginationType === 'number') {
        content.html(`${currentIndex + 1}/${_total}`);
        prevDom.removeClass('disabled');
        nextDom.removeClass('disabled');
        if (currentIndex === 0) {
          prevDom.addClass('disabled');
          return;
        }
        if (currentIndex === _total - 1) {
          nextDom.addClass('disabled');
        }
      } else if (paginationType === 'progress') {
        const progress = paginationContainer.find('.product-pagination__progress-inner-bg');
        const widthPercent = ((currentIndex + 1) / _total * 100).toFixed(3);
        progress.css('width', `${widthPercent}%`);
      } else if (paginationType === 'dot') {
        const dotEls = paginationContainer.find('.tap-area');
        const currentDotEl = dotEls.eq(currentIndex);
        dotEls.removeClass('current');
        currentDotEl.addClass('current');
      }
    }
    initMobileNormalPagination() {
      const {
        mobileId,
        mobileSwiper
      } = this;
      mobileSwiper && mobileSwiper.on('slideChange', swiper => {
        const index = get(swiper, 'realIndex');
        const total = get(swiper, 'slidesGrid.length');
        this.updatePagination(index, total);
      });
      $(`${mobileId}`).on('click', '.normal-thumbnail-button-prev', () => {
        mobileSwiper.slidePrev(200);
      }).on('click', '.normal-thumbnail-button-next', () => {
        mobileSwiper.slideNext(200);
      });
    }
    initPcPhotoSwipe() {
      const self = this;
      this.updateFlattenPhotoSwipeItems();
      if (this.showMagnifier) {
        return;
      }
      $(`${this.id}`).on('click', '.imageItem', function () {
        const realIndex = $(this).data('index');
        self.handlePhotoSwiper(self.slideItems, realIndex);
      });
    }
    initFlattenPcSkuPhotoSwiper() {
      const self = this;
      if (this.showMagnifier) {
        return;
      }
      $(`${this.id}`).on('click', '.product_pc_skuImage_flatten', function () {
        const items = [{
          src: $(this).find('.product_photoSwipe_image').attr('data-photoswipe-src'),
          w: 0,
          h: 0,
          el: $(this)[0]
        }];
        self.handlePhotoSwiper(items, 0, false);
      });
    }
    toggleFlattenPcSkuImage(isShow, skuImageUrl) {
      const skuImageDom = this.productPcSkuImageFlatten;
      const parentShowEmptyImageEle = skuImageDom.parent('.product-detail-empty-image');
      if (skuImageDom.hasClass('imageItemError')) {
        skuImageDom.removeClass('imageItemError');
      }
      if (isShow && skuImageUrl) {
        this.handleVideoPause(skuImageUrl);
        const ratio = get(imgSize(skuImageUrl), 'ratio') || '100%';
        const width = get(imgSize(skuImageUrl), 'width');
        const height = get(imgSize(skuImageUrl), 'height');
        const imgDom = skuImageDom.find('img');
        if (imgDom.length > 0) {
          imgDom.remove();
        }
        skuImageDom.css('paddingBottom', `${ratio}`).html(`<img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  onerror="this.onerror=null;this.parentElement.className+=' imageItemError';" class="product_photoSwipe_image" data-photoswipe-src=${imgUrl(skuImageUrl, {
          width: 1800
        })} src=${skuImageUrl} />${this.showMagnifier ? `<img data-width="${width}" data-height="${height}" class="imageItem--hover" ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  onerror="this.onerror=null;this.parentElement.className+=' imageItemError';" class="product_photoSwipe_image" data-photoswipe-src=${imgUrl(skuImageUrl, {
          width: 1800
        })} src=${skuImageUrl} />` : ''}`);
        if (parentShowEmptyImageEle.length) {
          parentShowEmptyImageEle.css({
            paddingBottom: ratio
          });
        }
        skuImageDom.show();
        this.productPcNormalItemFlatten.hide();
        this.productShowSkuCover = true;
        this.handleVideoAutoPlay();
      } else if (!isShow) {
        if (parentShowEmptyImageEle.length) {
          parentShowEmptyImageEle.css({
            paddingBottom: ''
          });
        }
        this.productShowSkuCover = false;
        this.handleVideoAutoPlay();
        skuImageDom.hide().empty();
        this.productPcNormalItemFlatten.show();
      }
    }
    skuImageChange(img, source) {
      if (!this.verifySource(source && source.app)) {
        return;
      }
      const {
        url
      } = img || {};
      if (this.productImageIsColumnLayout) {
        super.skuImageChange(img, source);
        if (!this.mobileSwiper && !this.productImageShowSkuImg) {
          let isNeedUpdate = false;
          let list = this.spuImgList;
          if (this.spuImgList && this.spuImgList[0] && this.spuImgList[0].isSkuImage) {
            const [_, ...e] = list;
            list = e;
            isNeedUpdate = true;
          }
          if (!this.mobileSwiper) {
            const skuImage = this.findSkuImage(url);
            if (skuImage) {
              list = [{
                ...skuImage,
                isSkuImage: true
              }, ...list];
              isNeedUpdate = true;
            }
          }
          if (isNeedUpdate) this.updateImageList(list, 0);
        }
        if (url) {
          if (!this.mobileSwiper) {
            this.handleVideoAutoPlay();
          }
          const index = this.spuImgList.findIndex(item => item.resource === url);
          if (index < 0) return;
          this.ToIndexFlattenPhoto(index + 6, true, index);
        }
        return;
      }
      if (this.productImageIsFlatten && !this.mobileSwiper) {
        if (url) {
          this.toggleFlattenPcSkuImage(true, imgUrl(url, {
            quality: this.quality
          }));
        } else {
          this.toggleFlattenPcSkuImage(false);
        }
        return;
      }
      super.skuImageChange(img, source);
      if (this.mobileSwiper) {
        this.handleInitThumbnailImageBySkuImage();
      }
    }
    handleMobileThumbArrow(thumbnailContainer, list) {
      if (list.length > 3) {
        thumbnailContainer.find('.thumbnail-button-prev').css('visibility', 'visible');
        thumbnailContainer.find('.thumbnail-button-next').css('visibility', 'visible');
      } else {
        thumbnailContainer.find('.thumbnail-button-prev').css('visibility', 'hidden');
        thumbnailContainer.find('.thumbnail-button-next').css('visibility', 'hidden');
      }
    }
    updateMobileThumbsImage(list) {
      const thumbnailContainer = $(`${this.mobileId} .product_mobile_thumbnail_container`);
      const thumbImageRatio = thumbnailContainer.data('thumb_image_ratio');
      if (!get(list, 'length') || list.length <= 1) {
        thumbnailContainer.hide();
        return;
      }
      thumbnailContainer.show();
      thumbnailContainer.find('.swiper-wrapper').empty().append(list.map(item => {
        const ratio = thumbImageRatio || get(imgSize(item.resource), 'ratio') || '100%';
        const customThumbImageClass = thumbImageRatio ? 'customImageRatio' : '';
        let videoCover;
        let videoRatio;
        if (item.type === 'VIDEO') {
          const isYoutubeVideo = isYoutube(item.resource);
          const {
            middle: cover
          } = getYouTubeCover(item.resource);
          videoRatio = isYoutubeVideo ? '56.25%' : get(imgSize(item.cover), 'ratio') || '56.25%';
          videoRatio = thumbImageRatio || videoRatio;
          videoCover = isYoutubeVideo ? cover : item.cover;
        }
        const boxPb = item.type === 'VIDEO' ? videoRatio : ratio;
        const domItem = item.type === 'VIDEO' ? `<img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  class="lozad" data-sizes="auto" data-src="${videoCover}" alt="">` : `<img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  class="lozad" data-sizes="auto" data-src="${item.resource}" alt="">`;
        return `
          <div class="swiper-slide">
            <div class="swiper-slide-item ${customThumbImageClass}" style="padding-bottom:${boxPb}">${domItem}</div>
          </div>`;
      }));
      this.handleMobileThumbArrow(thumbnailContainer, list);
    }
    updateMobileThumbArrow(list) {
      const paginationContainer = $(`${this.mobileId} .product_mobile_thumbnail_pagination`);
      if (list.length > 1) {
        paginationContainer.show();
      } else {
        paginationContainer.hide();
      }
    }
    updateImageList(list, activeIndex, source) {
      if (!this.verifySource(source && source.app)) {
        return;
      }
      if (this.productImageIsFlatten) {
        this.updateFlattenImageList(list);
        if (!this.mobileSwiper) {
          this.updateFlattenPhotoSwipeItems();
        }
      }
      if (this.productImageIsOneColumn) {
        this.updateOneColumnImageList(list, activeIndex);
      }
      if (this.productImageIsTwoColumn) {
        this.updateTwoColumnImageList(list, activeIndex);
      }
      if (!this.productMobileHideThumbnailImage && this.mobileSwiper) {
        this.updateMobileThumbsImage(list);
      }
      super.updateImageList(list, activeIndex, source);
      if (this.productMobileHideThumbnailImage && this.mobileSwiper) {
        this.updateMobileThumbArrow(list);
        this.updatePagination(0, list && list.length);
        this.initMobileNormalPagination();
      }
    }
    updateFlattenPhotoSwipeItems() {
      const items = [];
      $(`${this.id}`).find('.imageItem,.videoItem').each((index, item) => {
        const realIndex = $(item).data('index');
        const imgEl = $(item).find('.product_photoSwipe_image');
        const size = $(item).attr('data-natural-size');
        const transSize = size ? size.split('x') : null;
        items[realIndex] = {
          src: imgEl.attr('data-photoswipe-src'),
          w: transSize ? parseInt(transSize[0], 10) : imgEl.innerWidth(),
          h: transSize ? parseInt(transSize[1], 10) : imgEl.innerHeight(),
          el: item
        };
      });
      this.slideItems = items;
    }
    galleryAfterChange(...args) {
      if (this.productImageIsFlatten && !this.mobileSwiper) {
        const {
          currItem,
          getCurrentIndex
        } = args[0];
        const currentIndex = getCurrentIndex();
        if (currentIndex === 0 && this.productPcNormalItemFlatten.css('display') === 'none') {
          this.productPcNormalItemFlatten.show();
          this.productPcSkuImageFlatten.hide();
        }
        currItem.el.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
      if (this.productImageIsColumnLayout && !this.mobileSwiper) {
        const {
          currItem
        } = args[0];
        currItem.el.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
      super.galleryAfterChange(...args);
    }
    updateFlattenDom() {
      this.productPcSkuImageFlatten = $(this.id).find('.product_pc_skuImage_flatten');
      this.productPcNormalItemFlatten = $(this.id).find('.normalItem');
    }
    updateFlattenImageList(list) {
      const container = $(`${this.id}.product_productImages_tile`).empty();
      if (list && list.length) {
        container.removeClass('product-detail-empty-image');
        const flattenFirstItem = $(`<div class="row row-cols-md-1 gx-md-4 flattenFirstItem">
          <div class="flattenFirstItemWrapper">
            <div class="normalItem"></div>
            <div class="product_pc_skuImage_flatten"></div>
          </div>
        </div>`);
        const exceptFlattenItemList = $(`<div class="exceptFirstMediaList row row-cols-md-2 gx-md-4"></div>`);
        const firstCol = $(`<div class="product_images_firstCol"></div>`);
        const secondCol = $(`<div class="product_images_secondCol"></div>`);
        list.forEach((item, index) => {
          let dom;
          if (item.type === 'VIDEO') {
            const {
              middle: cover,
              videoId
            } = getYouTubeCover(item.resource);
            const isYoutubeVideo = isYoutube(item.resource);
            const photoswipeCoverSrc = isYoutubeVideo ? cover : item.cover;
            dom = `<div class="videoItem" data-index="${index}" style="padding-bottom: ${isYoutubeVideo ? '56.25%' : get(imgSize(item.cover), 'ratio') || '56.25%'}">
          ${isYoutubeVideo ? `<div class="product_youTubeVideoBox" data-video-id="${videoId}"></div>` : `<video class="product_slVideoContainer" disablepictureinpicture controls webkit-playsinline playsinline controlslist="nodownload nofullscreen" poster="${item.cover}">
                  <source src="${item.resource}" type="video/mp4">
                </video>`}
          <img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  class="product_photoSwipe_image" data-photoswipe-src="${photoswipeCoverSrc}" src="${photoswipeCoverSrc}" alt="">
          </div>`;
          } else {
            const {
              ratio,
              width,
              height
            } = imgSize(item.resource);
            dom = `<div class="imageItem imageItem--${this.showMagnifier ? 'hover' : 'pointer'}" style="padding-bottom: ${ratio}" data-index="${index}"><img ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  onerror="this.onerror=null;this.parentElement.className+=' imageItemError';" data-photoswipe-src="${item.resource}" class="product_photoSwipe_image" src="${item.resource}" alt="">${this.showMagnifier ? `<img data-width="${width}" data-height="${height}" ${window.__PRELOAD_STATE__.imgNoReferrerSwitch ? 'referrerpolicy="same-origin"' : ''}  onerror="this.onerror=null;this.parentElement.className+=' imageItemError';" data-photoswipe-src="${item.resource}" class="imageItem--hover" src="${item.resource}" alt="">` : ''}</div>`;
          }
          if (index === 0) {
            flattenFirstItem.find('.normalItem').append(dom);
            return;
          }
          if ((index - 1) % 2) {
            secondCol.append(dom);
          } else {
            firstCol.append(dom);
          }
        });
        exceptFlattenItemList.append(firstCol, secondCol);
        container.append(flattenFirstItem, exceptFlattenItemList);
      } else {
        container.addClass('product-detail-empty-image');
        container.append(`<div class="product_pc_skuImage_flatten" style="width: 100%; position:absolute;"></div>`);
      }
      this.updateFlattenDom();
    }
    handleVideoPause() {
      this.handleUnifyVideoStatus(this.pcVideos, 'pc', 'pause');
      this.handleUnifyVideoStatus(this.mobileVideos, 'mobile', 'pause');
    }
    handleVideoAutoPlay(video) {
      if (this.mobileSwiper || !this.productImageIsFlatten && !this.productImageIsColumnLayout) {
        super.handleVideoAutoPlay(video);
        return;
      }
      if (Array.isArray(this.mediaList) && this.productVideoAutoplay) {
        this.pcVideos && this.pcVideos.length && this.handleUnifyVideoStatus(this.pcVideos.slice(0, 1), 'pc', 'play');
      }
    }
  }
  _exports.default = ProductImagesWithFlattenAndMobileThumb;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/detail/js/layout.js'] = window.SLM['product/detail/js/layout.js'] || function () {
  const _exports = {};
  const debounce = window['SLM']['commons/utils/debounce.js'].default;
  const isMobile = window['SLM']['commons/utils/isMobile.js'].default;
  function setPosition({
    id,
    container = window,
    offsetTop = 0
  }) {
    const box = $(`#product-detail-sticky_${id}`);
    if (!box.get(0)) {
      return;
    }
    let mainView = box.children('.sticky-main-view');
    mainView = mainView.length ? mainView : box;
    const height = mainView.height();
    const wHeight = $(container).outerHeight();
    if (height + offsetTop > wHeight) {
      box.css('top', -(height - wHeight));
    } else {
      box.css('top', offsetTop);
    }
  }
  function listenPosition({
    id,
    container = window,
    offsetTop = 0
  }) {
    setPosition({
      id,
      container,
      offsetTop
    });
    const setPositionDebounce = debounce(300, () => {
      setPosition({
        id,
        container,
        offsetTop
      });
    });
    $(window).on('resize', setPositionDebounce);
    if (!isMobile()) {
      $(container).one('scroll', setPositionDebounce);
    }
    return function removePostionListener() {
      $(window).off('resize', setPositionDebounce);
      $(container).off('scroll', setPositionDebounce);
    };
  }
  _exports.listenPosition = listenPosition;
  _exports.default = setPosition;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/form/form.js'] = window.SLM['theme-shared/utils/form/form.js'] || function () {
  const _exports = {};
  const { SL_EventEmitter } = window['@yy/sl-theme-shared']['/utils/event-bus'];
  const ValidateTrigger = {
    ONCHANGE: 'onChange',
    MANUAL: 'manual',
    ONBLUR: 'manual',
    ONNATIVECHANGE: 'onNativeChange'
  };
  _exports.ValidateTrigger = ValidateTrigger;
  const isPromiseFulfilledResult = result => {
    return result.status === 'fulfilled';
  };
  const formItemName = 'sl-form-item-name';
  const REQUIRED_SYMBOL = Symbol('required');
  class CustomForm {
    constructor(fid = '', {
      onDestory
    } = {
      onDestory: () => {}
    }) {
      this.fid = fid;
      this.onDestory = onDestory;
      this.formEntity = null;
      this.validateRecord = {};
      this.config = {
        validateTrigger: ValidateTrigger.MANUAL,
        requiredErrMsg: `This is a required field!`,
        defaultErrMsg: 'Please enter a valid value',
        errContainerClss: 'errClass',
        validateWhenInit: false,
        emitChangeWhenInit: false
      };
      this.canValidate = false;
      this.canEmitChange = true;
      this.hadInit = false;
      this.el = document.querySelector(`#${fid}`);
      const eventBus = new SL_EventEmitter();
      this.eventBus = eventBus;
      this.on = this.eventBus.on.bind(eventBus);
      this.emit = this.eventBus.emit.bind(eventBus);
    }
    init(config) {
      if (this.hadInit) return false;
      try {
        this.initFormConfig(config);
        const formItems = this.el.querySelectorAll(`[${formItemName}]`);
        const {
          initialData,
          childrenProps
        } = this.calculatePropsAndInitialData(formItems);
        this.formEntity = {
          data: initialData,
          childrenProps,
          el: this.el
        };
        this.initEventListener(this.el);
        this.hadInit = true;
      } catch (e) {
        console.warn(`${this.fid} is not found, ${e}`);
      }
    }
    initFormConfig(config) {
      if (config) {
        Object.assign(this.config, config);
        if (config && config.validateWhenInit) this.canValidate = true;
        if (config && config.emitChangeWhenInit) this.canEmitChange = true;
      }
    }
    initEventListener(el) {
      el.addEventListener('input', e => this.handleFormInputEvent(e));
      const formItems = el.querySelectorAll(`[${formItemName}]`);
      formItems.forEach(el => {
        const inp = el.querySelector('input,textarea');
        if (inp) {
          inp.addEventListener('change', e => {
            if (this.config.validateTrigger === ValidateTrigger.ONNATIVECHANGE) {
              const target = e.target;
              const parentNode = this.recursionFindParent(target, formItemName);
              if (!parentNode) return;
              const targetName = parentNode.getAttribute(formItemName);
              this.validateFields([targetName]);
            }
          });
          inp.addEventListener('blur', e => {
            const target = e.target;
            const parentNode = this.recursionFindParent(target, formItemName);
            if (!parentNode) return;
            const targetName = parentNode.getAttribute(formItemName);
            if (this.config.validateTrigger === ValidateTrigger.ONBLUR) {
              this.validateFields([targetName]);
            }
            if (this.config.blurSucHandler || this.config.blurErrHandler) {
              this.validateFields([targetName], false).then(res => {
                if (!res) return;
                if (res.pass) {
                  this.config && this.config.blurSucHandler && this.config.blurSucHandler(targetName, target.value, this.formEntity.data);
                } else {
                  this.config && this.config.blurErrHandler && this.config.blurErrHandler(res);
                }
              });
            }
          });
        }
      });
    }
    handleFormInputEvent(e) {
      if (!this.fid) return;
      const target = e.target;
      const parentNode = this.recursionFindParent(target, formItemName);
      if (!parentNode) return;
      const targetName = parentNode.getAttribute(formItemName);
      if (targetName) {
        this.canValidate = true;
        if (this.isRadioOrCheckbox(target, ['checkbox'])) {
          this.setLocalsValue(targetName, target.checked);
        } else {
          this.setLocalsValue(targetName, target.value);
        }
      }
    }
    recursionFindParent(el, attr) {
      const parent = el.parentElement;
      if (!parent) return null;
      const val = parent.getAttribute(attr);
      if (val) return parent;
      return this.recursionFindParent(parent, attr);
    }
    calculatePropsAndInitialData(nodeList) {
      if (nodeList.length === 0) return {
        initialData: {},
        childrenProps: []
      };
      let childrenProps = [];
      const initialData = {};
      try {
        childrenProps = Array.from(nodeList).map(formItem => {
          const name = formItem.getAttribute(formItemName);
          const child = formItem.querySelector('input,select,textarea');
          const attrs = child.getAttributeNames();
          const childAttrs = attrs.reduce((acc, curAttr) => {
            if (curAttr === 'value') {
              initialData[name] = child.getAttribute(curAttr) || child.value;
            }
            return {
              ...acc,
              [curAttr]: child.getAttribute(curAttr)
            };
          }, {});
          return Object.assign(childAttrs, {
            name
          });
        });
      } catch (e) {
        console.error(`${this.fid} calculate form item error: `, e);
      }
      return {
        initialData,
        childrenProps
      };
    }
    setValues(fields) {
      fields.forEach(({
        name,
        value,
        rules
      }) => {
        this.setDomValue(this.el, name, value);
        this.setRule(rules, name);
        this.setLocalsValue(name, value);
      });
    }
    setRule(rules, name) {
      const target = this.formEntity.childrenProps.find(prop => prop.name === name);
      if (target) target.rules = rules || [];
    }
    isRadioOrCheckbox(target, nodeTypeList = ['radio', 'checkbox']) {
      const nodeType = target && target.getAttribute('type');
      if (!nodeType) return false;
      return target.nodeName.toLocaleLowerCase() === 'input' && nodeTypeList.includes(nodeType);
    }
    setDomValue(parent, name, value) {
      const targets = parent.querySelectorAll(`[${formItemName}=${name}] input,[${formItemName}=${name}] select,[${formItemName}=${name}] textarea`);
      if (targets.length) {
        targets.forEach(target => {
          if (this.isRadioOrCheckbox(target)) {
            if (target.value === value) {
              target.click();
            }
          } else if (!target.name || target.name === name) {
            target.value = value !== null && value !== undefined ? value : '';
          }
        });
      }
    }
    setLocalsValue(name, value) {
      const changedValue = {
        [name]: value
      };
      const allValues = Object.assign(this.formEntity && this.formEntity.data, changedValue);
      let validateResultPro = null;
      if (this.canValidate && this.config.validateTrigger === ValidateTrigger.ONCHANGE) {
        validateResultPro = this.validateFields([name]);
      }
      if (this.canEmitChange) {
        this.eventBus.emit('valuesChange', {
          changedValue,
          allValues,
          validateResult: validateResultPro
        });
      }
    }
    flattenRulesList(list) {
      return list.reduce((acc, field) => {
        const subRules = field && field.rules.map(rule => ({
          ...rule,
          name: field.name
        })) || [];
        return [...acc, ...subRules];
      }, []);
    }
    getErrTmpStr(messages, className = '') {
      return messages.reduce((acc, message) => acc += `<div class="${className}" style="margin-top: 6px;color: #f04949;font-size: 12px;line-height: 1.4;">${message}</div>`, '');
    }
    getErrListContainer(id, formItemContainer) {
      const target = this.el.querySelector(`[${id}]`);
      if (target) return target;
      const div = document.createElement('div');
      div.setAttribute(id, '1');
      formItemContainer.appendChild(div);
      return div;
    }
    setErrMsgIntoDom(errFields) {
      errFields.forEach(({
        name,
        messages
      }) => {
        const errTmp = this.getErrTmpStr(messages, this.config.errContainerClss);
        const id = `cf-${this.fid}-${name}`;
        const target = this.el.querySelector(`[${formItemName}=${name}]`);
        if (!Array.from(target.classList).includes(this.config.errContainerClss)) {
          target.classList.add(this.config.errContainerClss);
        }
        const container = this.getErrListContainer(id, target);
        container.innerHTML = errTmp;
      });
    }
    removeErrList(fields) {
      fields.forEach(name => {
        const target = this.el.querySelector(`[cf-${this.fid}-${name}]`);
        if (target) target.remove();
        if (this.config.errContainerClss) {
          const formItemWrapper = this.el.querySelector(`[${formItemName}=${name}]`);
          formItemWrapper && formItemWrapper.classList && formItemWrapper.classList.remove && formItemWrapper.classList.remove(this.config.errContainerClss);
        }
      });
    }
    setErrFields(target, errFields, name, errMsg) {
      if (!target) {
        errFields.push({
          name,
          messages: [errMsg]
        });
      } else {
        target.messages.push(errMsg);
      }
    }
    setFields(fields, callback, needEmit = true, needValidate = false) {
      try {
        this.canValidate = needValidate;
        this.canEmitChange = needEmit;
        this.setValues(fields);
        callback && callback();
      } catch (e) {
        console.warn(`${this.fid} set fields fail,`, e);
      } finally {
        this.canEmitChange = true;
      }
    }
    setRules(rulesField) {
      rulesField.forEach(({
        name,
        rules
      }) => {
        this.setRule(rules, name);
      });
    }
    getFieldValue(fieldName) {
      this.init();
      return this.formEntity.data[fieldName];
    }
    getFieldsValue() {
      this.init();
      return this.formEntity && this.formEntity.data;
    }
    async getLegalFieldsValue() {
      const result = await this.validateFields([], false);
      if (result && result.pass) return this.formEntity && this.formEntity.data;
      const unPassFields = result && result.errFields && result.errFields.map(field => field.name);
      return Object.entries(this.formEntity.data).reduce((acc, [k, v]) => {
        if (unPassFields.includes(k)) return acc;
        return {
          ...acc,
          [k]: v
        };
      }, {});
    }
    async validateFields(fields, handleError = true) {
      if (!this.formEntity) return null;
      const {
        childrenProps
      } = this.formEntity;
      const data = JSON.parse(JSON.stringify(this.formEntity.data));
      const needValidateFieldsName = fields && fields.length ? fields : Object.keys(this.formEntity.data);
      const needValidatefields = childrenProps.filter(prop => prop.rules && prop.rules.length > 0 && needValidateFieldsName && needValidateFieldsName.includes(prop.name));
      const validateList = [];
      const needValidateRules = this.flattenRulesList(needValidatefields);
      try {
        needValidateRules.forEach(rule => {
          const {
            required,
            validator,
            pattern,
            name
          } = rule || {};
          const value = data[name];
          this.validateRecord[name] = value;
          if (value) {
            if (validator) {
              validateList.push(validator(value, data));
            } else if (pattern) {
              validateList.push(new RegExp(pattern).test(value));
            } else {
              validateList.push(true);
            }
          } else if (validator && required) {
            validateList.push(validator(value, data));
          } else {
            validateList.push(required ? REQUIRED_SYMBOL : true);
          }
        });
      } catch (e) {
        console.warn(`${this.fid} calculate validator list fail:`, e);
      }
      const validateResult = await Promise.allSettled(validateList);
      const errFields = [];
      const successFields = new Set();
      for (let i = 0; i < validateResult.length; i++) {
        const {
          name,
          message
        } = needValidateRules[i];
        if (this.validateRecord[name] !== data[name]) return null;
        const result = validateResult[i];
        const target = errFields.find(err => err.name === name);
        if (isPromiseFulfilledResult(result)) {
          if (result.value === REQUIRED_SYMBOL) {
            const requiredErrMsg = needValidateRules[i] && needValidateRules[i].message || this.config.requiredErrMsg;
            if (!target) {
              errFields.push({
                name,
                messages: [requiredErrMsg]
              });
            }
          } else if (result.value === false) {
            const errMsg = message || this.config.defaultErrMsg;
            this.setErrFields(target, errFields, name, errMsg);
          } else {
            successFields.add(name);
          }
        } else {
          const errMsg = message || result.reason || this.config.defaultErrMsg;
          this.setErrFields(target, errFields, name, errMsg);
        }
      }
      if (handleError) {
        this.removeErrList(successFields);
        this.setErrMsgIntoDom(errFields);
        if (errFields.length) {
          this.config.validateTrigger = this.config.validateTriggerAfterValidationFailed || ValidateTrigger.ONCHANGE;
        }
      }
      return errFields.length ? {
        pass: false,
        errFields
      } : {
        pass: true
      };
    }
    resetErrStatus(fields = Object.keys(this.formEntity.data)) {
      this.removeErrList(fields);
    }
    destroy() {
      this.el.removeEventListener('input', this.handleFormInputEvent);
      this.hadInit = false;
      this.el = null;
      this.eventBus = null;
      this.formEntity = null;
      this.onDestory && this.onDestory(this.fid);
      this.fid = null;
    }
  }
  _exports.default = CustomForm;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/form/index.js'] = window.SLM['theme-shared/utils/form/index.js'] || function () {
  const _exports = {};
  const CustomForm = window['SLM']['theme-shared/utils/form/form.js'].default;
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  class Form {
    static takeForm(fid) {
      if (this.formInstanceList[fid]) return this.formInstanceList[fid];
      this.formInstanceList[fid] = new CustomForm(fid, {
        onDestory: fid => {
          Reflect.deleteProperty(this.formInstanceList, fid);
        }
      });
      return this.formInstanceList[fid];
    }
  }
  _defineProperty(Form, 'formInstanceList', {});
  _exports.default = Form;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/sku/firstAvailableSku.js'] = window.SLM['theme-shared/utils/sku/firstAvailableSku.js'] || function () {
  const _exports = {};
  function firstAvailableSku(spu, skuList) {
    if (spu && spu.soldOut) {
      return skuList && skuList[0] || null;
    }
    return skuList.find(sku => sku.available) || skuList && skuList[0] || null;
  }
  _exports.default = firstAvailableSku;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/report/customArgs/index.js'] = window.SLM['theme-shared/report/customArgs/index.js'] || function () {
  const _exports = {};
  const { nullishCoalescingOperator } = window['SLM']['theme-shared/utils/syntax-patch.js'];
  function getValue(keysMap, name) {
    return nullishCoalescingOperator(keysMap && keysMap[name], name);
  }
  function getValuesByKey(channelArgs, key) {
    return name => {
      return getValue(channelArgs && channelArgs[key], name);
    };
  }
  function getByChannel(channel) {
    return key => {
      return getValuesByKey(window.SL_ReportArgsMap && window.SL_ReportArgsMap[channel], key);
    };
  }
  if (!window.SL_GetReportArg) {
    window.SL_GetReportArg = function getReportArg(...args) {
      if (args.length === 1) {
        return getByChannel(args[0]);
      }
      if (args.length === 2) {
        return getByChannel(args[0])(args[1]);
      }
      if (args.length === 3) {
        return getByChannel(args[0])(args[1])(args[2]);
      }
    };
  }
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/report/product/detail/inquiry-modal-report.js'] = window.SLM['theme-shared/report/product/detail/inquiry-modal-report.js'] || function () {
  const _exports = {};
  const debounce = window['lodash']['debounce'];
  const get = window['lodash']['get'];
  const pageMapping = window['SLM']['theme-shared/utils/report/pageMapping.js'].default;
  const pageMap = window['SLM']['theme-shared/utils/report/page.js'].default;
  const getCurrencyCode = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'].default;
  const { convertPrice } = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'];
  const alias = window.SL_State.get('templateAlias');
  const eventIdMap = {
    ProductsDetail: '60006253',
    Home: '60006252'
  };
  const unsafeInputMap = {
    email: 101,
    mobile: 110,
    message: 115,
    name: 102,
    region: 104
  };
  const inputMap = {
    email: 102,
    mobile: 105,
    message: 103,
    name: 104,
    region: 106
  };
  const unsafePage = pageMapping[alias];
  const page = pageMap[alias];
  const eventId = eventIdMap[alias];
  function hdReport(options) {
    window.HdSdk && window.HdSdk.shopTracker.collect({
      page,
      module: 119,
      ...options
    });
  }
  function unsafeHdReport(options) {
    window.HdSdk && window.HdSdk.shopTracker.report(eventId, {
      page: unsafePage,
      custom_component: '167',
      ...options
    });
  }
  function concatVal(obj) {
    return Object.entries(obj || {}).reduce((prev, cur) => {
      if (cur[1]) {
        return `${prev}${cur[0]}:${cur[1]}\n`;
      }
      return prev;
    }, '');
  }
  function leadReport({
    spu,
    sku,
    email,
    phone,
    message,
    name,
    region
  }) {
    const {
      title,
      spuSeq: spuId,
      sortationList
    } = spu || {};
    const {
      price,
      skuSeq: skuId
    } = sku || {};
    const currency = getCurrencyCode();
    const value = convertPrice(price);
    window.SL_EventBus.emit('global:thirdPartReport', {
      FBPixel: [['track', 'Lead', {
        content_name: title,
        content_ids: spuId,
        content_type: 'product_group',
        currency,
        value
      }]],
      GAAds: [['event', 'conversion', {
        value,
        currency
      }, 'SUBMIT-LEAD-FORM']],
      GARemarketing: [['event', 'generate_lead', {
        ecomm_prodid: window.SL_GetReportArg('GAR', 'sku_id', skuId),
        ecomm_pagetype: 'product',
        ecomm_totalvalue: value,
        currency,
        ecomm_category: get(sortationList, '[0].sortationId'),
        ecomm_pcat: get(sortationList, '[0].sortationName')
      }]],
      GAR: [['event', 'generate_lead', {
        currency,
        value,
        items: [{
          id: window.SL_GetReportArg('GAR', 'sku_id', skuId),
          google_business_vertical: 'retail'
        }]
      }]],
      GA: [['event', 'generate_lead', {
        value,
        currency
      }]],
      GA4: [['event', 'generate_lead', {
        value,
        currency
      }]]
    });
    const inputBoxVal = concatVal({
      Message: message,
      Name: name,
      'Country/Region': region
    });
    hdReport({
      component: 101,
      event_name: 'Lead',
      content_name: title,
      content_id: spuId,
      currency,
      value,
      input_box_val: inputBoxVal,
      user_data: {
        em: email,
        ph: phone
      }
    });
    unsafeHdReport({
      event_name: '145',
      product_id: spuId,
      product_name: title,
      currency,
      product_price: value,
      variantion_id: skuId,
      phone,
      email,
      input_box_val: inputBoxVal
    });
  }
  _exports.leadReport = leadReport;
  function cancelReport({
    spu,
    sku,
    email,
    phone,
    name,
    message,
    region
  }) {
    const {
      title,
      spuSeq: spuId
    } = spu || {};
    const {
      price,
      skuSeq: skuId
    } = sku || {};
    const value = convertPrice(price);
    const currency = getCurrencyCode();
    const inputBoxVal = concatVal({
      Message: message,
      Name: name,
      'Country/Region': region
    });
    hdReport({
      component: 107,
      action_type: 102,
      content_name: title,
      content_id: spuId,
      currency,
      value,
      input_box_val: inputBoxVal,
      user_data: {
        em: email,
        ph: phone
      }
    });
    unsafeHdReport({
      event_name: '146',
      product_id: spuId,
      product_name: title,
      currency,
      product_price: value,
      variantion_id: skuId,
      phone,
      email,
      input_box_val: inputBoxVal
    });
  }
  _exports.cancelReport = cancelReport;
  function viewReport() {
    hdReport({
      component: -999,
      action_type: 108
    });
    unsafeHdReport({
      event_name: '109'
    });
    unsafeHdReport({
      event_name: '120'
    });
  }
  _exports.viewReport = viewReport;
  function inputReport({
    name,
    value
  }) {
    hdReport({
      action_type: 103,
      component: inputMap[name],
      input_box_val: value
    });
    unsafeHdReport({
      event_name: '133',
      input_box: unsafeInputMap[name],
      input_box_val: value
    });
  }
  _exports.inputReport = inputReport;
  const debounceInput = {
    email: debounce(value => inputReport({
      value,
      name: 'email'
    }), 1000),
    mobile: debounce(value => inputReport({
      value,
      name: 'mobile'
    }), 1000),
    message: debounce(value => inputReport({
      value,
      name: 'message'
    }), 1000),
    name: debounce(value => inputReport({
      value,
      name: 'name'
    }), 1000),
    region: debounce(value => inputReport({
      value,
      name: 'region'
    }), 1000)
  };
  function listenInputChange({
    area
  }) {
    $(area).find('[sl-form-item-name]').on('input', 'input,textarea', function oninput() {
      const input = $(this);
      const formItem = input.parents('[sl-form-item-name]');
      const name = formItem.attr('sl-form-item-name');
      const value = input.val();
      debounceInput[name] && debounceInput[name](value);
    });
  }
  _exports.listenInputChange = listenInputChange;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/base/BaseClass.js'] = window.SLM['commons/base/BaseClass.js'] || function () {
  const _exports = {};
  function isInvalid(param) {
    return !param || typeof param !== 'string';
  }
  function isJqueryInstance(dom) {
    return dom && dom instanceof $ && dom.length > 0;
  }
  function getEventHandlerName(event, selector, namepsace) {
    if (!selector) {
      return [event, namepsace].join('-');
    }
    if (isJqueryInstance(selector)) {
      return selector;
    }
    return [selector, event, namepsace].join('-');
  }
  function getNamespace(event, namespace) {
    if (isInvalid(event) && isInvalid(namespace)) {
      throw new Error('one of these two parameters must be provided!');
    }
    if (isInvalid(event)) {
      return `.${namespace}`;
    }
    return [event, namespace].join('.');
  }
  const eventInvalidErrorMessage = 'event param must be provided and it must be a string type';
  function on({
    eventName,
    handler,
    selector,
    scope
  } = {}) {
    if (isInvalid(eventName)) {
      throw new Error(eventInvalidErrorMessage);
    }
    if (!isJqueryInstance(scope)) {
      throw new Error('scope must be a jQuery Object');
    }
    if (typeof handler !== 'function') {
      throw new TypeError('handler must be a function');
    }
    if (selector) {
      if (isInvalid(selector)) {
        throw new TypeError('selector must be a string!');
      }
      scope.on(eventName, selector, handler);
    } else {
      scope.on(eventName, handler);
    }
  }
  function off({
    eventName,
    selector,
    handler,
    scope
  } = {}) {
    if (isInvalid(eventName)) {
      throw new Error(eventInvalidErrorMessage);
    }
    if (!isJqueryInstance(scope)) {
      throw new Error('scope must be a jQuery Object');
    }
    if (selector) {
      if (isInvalid(selector)) {
        throw new TypeError('selector must be a string!');
      }
      if (typeof handler === 'function') {
        scope.off(eventName, selector, handler);
      } else {
        scope.off(eventName, selector);
      }
    } else {
      scope.off(eventName);
    }
  }
  function onConsistent(event, selector, handler) {
    if (isInvalid(event)) {
      throw new Error(eventInvalidErrorMessage);
    }
    if (!handler) {
      handler = selector;
      selector = null;
    }
    const eventHandlerKey = this.getEventHandlerName(event, selector);
    const ns = this.getEventNamespace(event);
    this.$eventHandlers.set(eventHandlerKey, handler);
    return scope => {
      on({
        eventName: ns,
        selector,
        handler,
        scope
      });
    };
  }
  function offConsistent(event, selector) {
    if (isInvalid(event)) {
      throw new Error(eventInvalidErrorMessage);
    }
    const eventHandlerName = this.getEventHandlerName(event, selector);
    const handler = this.$eventHandlers.get(eventHandlerName);
    const ns = this.getEventNamespace(event);
    return scope => {
      off({
        eventName: ns,
        selector,
        handler,
        scope
      });
      if (handler) {
        this.$eventHandlers.delete(eventHandlerName);
      }
    };
  }
  class EventManager {
    constructor(namespace = '', portals) {
      this.$win = $(window);
      this.$doc = $(document);
      this.$portals = portals ? $(portals) : null;
      this.namespace = typeof namespace === 'string' ? namespace : '';
      this.$eventHandlers = new Map();
      this.$winEventHandlers = new Map();
    }
    getEventNamespace(event) {
      return getNamespace(event, this.namespace);
    }
    getEventHandlerName(event, selector) {
      return getEventHandlerName(event, selector, this.namespace);
    }
    getPortals() {
      return isJqueryInstance(this.$portals) ? this.$portals : this.$doc;
    }
    $setNamespace(namespace) {
      this.namespace = namespace;
    }
    $setPortals(portals) {
      this.$portals = portals ? $(portals) : null;
    }
    $on(event, selector, handler) {
      const onEvent = onConsistent.call(this, event, selector, handler);
      onEvent(this.$doc);
    }
    $onPortals(event, selector, handler) {
      const $dom = this.getPortals();
      const onEvent = onConsistent.call(this, event, selector, handler);
      onEvent($dom);
    }
    $onWin(event, handler) {
      this.$winEventHandlers.set(this.getEventHandlerName(event), handler);
      this.$win.on(this.getEventNamespace(event), handler);
    }
    $off(event, selector) {
      const offEvent = offConsistent.call(this, event, selector);
      offEvent(this.$doc);
    }
    $offPortals(event, selector) {
      const $dom = this.getPortals();
      const offEvent = offConsistent.call(this, event, selector);
      offEvent($dom);
    }
    $offWin(event) {
      const eventHandlerName = this.getEventHandlerName(event);
      const handler = this.$winEventHandlers.get(eventHandlerName);
      this.$win.off(this.getEventNamespace(event));
      if (handler) {
        this.$winEventHandlers.delete(eventHandlerName);
      }
    }
    $offAll() {
      const ns = this.getEventNamespace();
      this.$win.off(ns);
      this.$doc.off(ns);
      if (isJqueryInstance(this.$portals)) {
        this.$portals.off(ns);
      }
      this.$eventHandlers.clear();
      this.$winEventHandlers.clear();
    }
    prepareTransition($el, callback, endCallback) {
      function removeClass() {
        $el.removeClass('is-transitioning');
        $el.off('transitionend', removeClass);
        if (endCallback) {
          endCallback();
        }
      }
      $el.on('transitionend', removeClass);
      $el.addClass('is-transitioning');
      $el.width();
      if (typeof callback === 'function') {
        callback();
      }
    }
  }
  _exports.default = EventManager;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/detail/inquiry-price-modal.js'] = window.SLM['product/detail/inquiry-price-modal.js'] || function () {
  const _exports = {};
  const Form = window['SLM']['theme-shared/utils/form/index.js'].default;
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const { mcUtil } = window['@yy/sl-mc'];
  const get = window['lodash']['get'];
  const firstAvailableSku = window['SLM']['theme-shared/utils/sku/firstAvailableSku.js'].default;
  const { leadReport, cancelReport, viewReport, listenInputChange } = window['SLM']['theme-shared/report/product/detail/inquiry-modal-report.js'];
  const Base = window['SLM']['commons/base/BaseClass.js'].default;
  const BaseModal = window['SLM']['commons/components/modal/index.js'].default;
  const Toast = window['SLM']['commons/components/toast/index.js'].default;
  const Loading = window['SLM']['commons/components/toast/loading.js'].default;
  const emailRE = /^[A-Za-z0-9_./;+]+([A-Za-z0-9_./;+]+)*@([A-Za-z0-9]+\.)+[A-Za-z]{2,6}$/;
  const toast = new Toast();
  class InquiryPriceModal extends Base {
    constructor({
      id,
      spu,
      sku
    }) {
      super('product:inquiry:price:modal');
      this.$root = $(`#JS-inquiry-price-modal_${id}`);
      this.$setPortals(this.$root);
      this.buttonSelector = `#JS-inquiry-price-button_${id}`;
      this.spu = spu;
      this.activeSku = null;
      this.formInstance = null;
      this.modalInstance = null;
      this.firstSku = firstAvailableSku(spu, sku.skuList);
      this.init(id);
      listenInputChange({
        area: this.$root
      });
    }
    init(id) {
      if (this.spu && this.spu.inquiry) {
        this.initModal(id);
        this.initForm(id);
        this.bindEvents();
      }
    }
    initModal(id) {
      this.modalInstance = new BaseModal({
        modalId: `inquiry-price_${id}`
      });
      this.modalInstance.init();
    }
    initForm(id) {
      this.formInstance = Form.takeForm(`JS-inquiry-modal-form_${id}`);
      this.formInstance.init();
      this.formInstance.setFields(InquiryPriceModal.getFieldsConfig());
    }
    setActiveSku(activeSku) {
      this.activeSku = activeSku;
    }
    cancelReport() {
      cancelReport({
        spu: this.spu,
        sku: this.activeSku || this.firstSku,
        num: 1,
        email: this.formInstance.getFieldValue('email'),
        phone: this.formInstance.getFieldValue('mobile'),
        name: this.formInstance.getFieldValue('name'),
        message: this.formInstance.getFieldValue('message'),
        region: this.formInstance.getFieldValue('region')
      });
    }
    bindEvents() {
      const eventHandlers = {
        submitClickHandler: async e => {
          try {
            if (this.isPreview()) {
              toast.open(t('products.product_details.link_preview_does_not_support'));
              return;
            }
            $(e.target).addClass('disabled');
            await this.validateForm();
            await this.postForm();
          } catch (err) {} finally {
            $(e.target).removeClass('disabled');
          }
        },
        cancelClickHandler: () => {
          this.cancelReport();
          this.hideModal();
        },
        buttonClickHandler: () => {
          this.showModal();
          viewReport();
        }
      };
      this.$onPortals('click', '.JS-inquiry-modal-submit', eventHandlers.submitClickHandler);
      this.$onPortals('click', '.JS-inquiry-modal-cancel', eventHandlers.cancelClickHandler);
      this.$root.parents('.mp-modal__wrapper').on('click', '.mp-modal__mask.mp-modal__closable,.mp-modal__close', () => this.cancelReport());
      $(this.buttonSelector).on('click', eventHandlers.buttonClickHandler);
    }
    unbindEvents() {
      this.$offAll();
      $(this.buttonSelector).off('click');
    }
    async postForm() {
      const inquiryInfo = this.formInstance.getFieldsValue();
      const {
        activeSku
      } = this;
      const spuInfo = this.spu;
      const url = `/products/${spuInfo.spuSeq}${activeSku ? `?sku=${activeSku.skuSeq}` : ''}`;
      const finalInquiryInfo = {
        Email: inquiryInfo.email,
        Message: inquiryInfo.message,
        Name: inquiryInfo.name,
        Mobile: inquiryInfo.mobile,
        'Country/Region': inquiryInfo.region,
        Product: spuInfo && spuInfo.title,
        ProductUrl: window.location.origin + (window.Shopline.redirectTo(url) || url)
      };
      const sendContentStr = Object.keys(finalInquiryInfo).reduce((str, key) => {
        str += `${key}：${finalInquiryInfo[key]}\n`;
        return str;
      }, '');
      const sendInfo = {
        email: inquiryInfo.email,
        content: sendContentStr,
        attachmentUrl: get(activeSku, 'imageList[0]') || get(activeSku, 'image') || get(spuInfo, 'images[0]')
      };
      const loading = new Loading({
        duration: 0
      });
      loading.open();
      await this.sendInquiryInfoRun(sendInfo, loading, {
        phone: inquiryInfo.mobile,
        message: inquiryInfo.message,
        name: inquiryInfo.name,
        region: inquiryInfo.region
      });
    }
    async sendInquiryInfoRun(info, loading, extraData) {
      const response = await mcUtil.sendToMerchant(info);
      loading.close();
      if (response.code === 'SUCCESS') {
        leadReport({
          spu: this.spu,
          sku: this.activeSku || this.firstSku,
          num: 1,
          email: info.email,
          ...extraData
        });
        this.hideModal();
        toast.open(t('products.product_details.submission_successfully'));
      } else {
        toast.open(t('products.product_details.submission_failed'));
      }
    }
    showModal() {
      this.modalInstance.show();
    }
    hideModal() {
      this.modalInstance.hide();
    }
    static getFieldsConfig() {
      const fields = [{
        name: 'email',
        value: '',
        rules: [{
          message: t('products.product_details.enter_email_address'),
          required: true
        }, {
          message: t('products.product_details.enter_valid_email_address'),
          pattern: emailRE
        }]
      }, {
        name: 'message',
        value: '',
        rules: [{
          message: t('products.product_details.leave_us_message'),
          required: true
        }, {
          message: t('products.product_details.maximum_length_of_message'),
          validator(val) {
            return val.length <= 1500;
          }
        }]
      }, {
        name: 'name',
        value: ''
      }, {
        name: 'mobile',
        value: ''
      }, {
        name: 'region',
        value: ''
      }];
      return fields;
    }
    validateForm() {
      return new Promise((resolve, reject) => {
        this.formInstance.validateFields().then(res => {
          if (res.pass) {
            resolve();
          } else {
            reject(res);
          }
        });
      });
    }
    isPreview() {
      return window.SL_State && window.SL_State.get('templateAlias') === 'PreviewProductsDetail';
    }
  }
  _exports.default = InquiryPriceModal;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/commons/js/createShadowDom.js'] = window.SLM['product/commons/js/createShadowDom.js'] || function () {
  const _exports = {};
  const shadowDomStyle = $('<style></style>').attr({
    type: 'text/css'
  }).append(`table{border-collapse:collapse}table:not([cellpadding]) td,table:not([cellpadding]) th{padding:.4rem}table:not([border="0"]):not([style*=border-width]) td,table:not([border="0"]):not([style*=border-width]) th{border-width:1px}table:not([border="0"]):not([style*=border-style]) td,table:not([border="0"]):not([style*=border-style]) th{border-style:solid}table:not([border="0"]):not([style*=border-color]) td,table:not([border="0"]):not([style*=border-color]) th{border-color:#ccc}iframe,video{max-width:100%;outline:none}img{height:auto;max-width:100%}figure{display:table;margin:1rem auto}figure figcaption{color:#999;display:block;margin-top:.25rem;text-align:center}hr{border-color:#ccc;border-style:solid;border-width:1px 0 0 0}code{background-color:#e8e8e8;border-radius:3px;padding:.1rem .2rem}.mce-content-body:not([dir=rtl]) blockquote{border-left:2px solid #ccc;margin-left:1.5rem;padding-left:1rem}.mce-content-body[dir=rtl] blockquote{border-right:2px solid #ccc;margin-right:1.5rem;padding-right:1rem}@media screen and (max-width: 750px){table{width: 100%!important}}`);
  _exports.shadowDomStyle = shadowDomStyle;
  const createShadowDom = () => {
    const shadowDoms = document.querySelectorAll('[data-node=shadow-dom]');
    if (!shadowDoms.length) return;
    shadowDoms.forEach(el => {
      const shadowContent = $(el).prev('[data-node=shadow-content]');
      $(el).attr('class', 'shadow-dom');
      if (shadowContent.get(0)) {
        shadowContent.children('.mce-content-body').css('word-break', 'break-word');
        shadowContent.prepend($('<style></style>').attr({
          type: 'text/css'
        }).append(`body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;line-height:1.4;margin:1rem}table{border-collapse:collapse}table:not([cellpadding]) td,table:not([cellpadding]) th{padding:.4rem}table:not([border="0"]):not([style*=border-width]) td,table:not([border="0"]):not([style*=border-width]) th{border-width:1px}table:not([border="0"]):not([style*=border-style]) td,table:not([border="0"]):not([style*=border-style]) th{border-style:solid}table:not([border="0"]):not([style*=border-color]) td,table:not([border="0"]):not([style*=border-color]) th{border-color:#ccc}iframe,video{max-width:100%;outline:none}img{height:auto;max-width:100%}figure{display:table;margin:1rem auto}figure figcaption{color:#999;display:block;margin-top:.25rem;text-align:center}hr{border-color:#ccc;border-style:solid;border-width:1px 0 0 0}code{background-color:#e8e8e8;border-radius:3px;padding:.1rem .2rem}.mce-content-body:not([dir=rtl]) blockquote{border-left:2px solid #ccc;margin-left:1.5rem;padding-left:1rem}.mce-content-body[dir=rtl] blockquote{border-right:2px solid #ccc;margin-right:1.5rem;padding-right:1rem}@media screen and (max-width: 750px){table{width: 100%}} .mce-content-body p:first-child { margin-top: 0 } .mce-content-body p:last-child { margin-bottom: 0 }`));
        const shadowRoot = el.attachShadow({
          mode: 'open'
        });
        shadowRoot.append(shadowContent.get(0));
        $(el).removeAttr('data-node');
        shadowContent.removeAttr('data-node');
      }
      el.__updateLazyExtraElements__();
    });
  };
  _exports.default = createShadowDom;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/detail/js/tabs.js'] = window.SLM['product/detail/js/tabs.js'] || function () {
  const _exports = {};
  const request = window['SLM']['theme-shared/utils/request.js'].default;
  const { shadowDomStyle } = window['SLM']['product/commons/js/createShadowDom.js'];
  const CUSTOM_PAGE_TYPE = 3;
  class Tabs {
    constructor({
      root
    }) {
      this.root = $(root);
      this.lang = 'default';
      this.showKey = 'tab0';
      this.init();
      this.requestCollapseTitle(this.ids);
      this.bindEvent();
      if (!this.tabs.hasClass('active')) {
        this.openTab(this.tabs.eq(0));
      }
    }
    init() {
      const tabs = this.root.find('.product-tabs-nav').find('.product-tabs-tab');
      this.tabs = tabs;
      this.contents = this.root.children('.product-tabs-content').children('.product-tabs-item');
      this.ids = [];
      tabs.each((_, el) => {
        const $el = $(el);
        const id = $el.data('id');
        if (id) {
          this.ids.push(id);
        }
        if ($el.hasClass('active')) {
          this.showKey = $el.data('key');
        }
      });
    }
    requestCollapseTitle(ids) {
      if (!ids || !ids.length) {
        return Promise.resolve();
      }
      const {
        lang
      } = this;
      return request({
        url: 'site/render/page/basic/infos',
        method: 'GET',
        params: {
          pageIds: ids.join(',')
        }
      }).then(res => {
        if (res && Array.isArray(res.data)) {
          const data = res.data.reduce((fin, item) => {
            const name = item.name ? item.name[lang] : '';
            return {
              ...fin,
              [item.id]: name
            };
          }, {});
          this.setCollapseTitle(data);
        }
      });
    }
    setCollapseTitle(data) {
      this.tabs.each((_, el) => {
        const title = data[$(el).data('id')];
        if (title) {
          $(el).text(title);
        }
      });
    }
    requestCollapseContent(id, content) {
      if (this.cacheRequest && this.cacheData[id]) {
        return Promise.resolve(this.cacheData[id]);
      }
      return request({
        url: `site/render/page/${CUSTOM_PAGE_TYPE}/${id}`,
        method: 'GET'
      }).then(res => {
        if (res && res.data) {
          this.setCollapseContent(res && res.data, content);
        }
      });
    }
    setCollapseContent(data, content) {
      const html = this.getCustomPageContent(data && data.htmlConfig);
      const shadow = $(content).children('.product-tabs-shadow');
      const shadowDom = shadow.get(0);
      const shadowRoot = shadowDom && shadowDom.attachShadow && shadowDom.attachShadow({
        mode: 'open'
      });
      $(shadowRoot).append(shadowDomStyle.clone());
      $(shadowRoot).append(html);
    }
    getCustomPageContent(pageConfig) {
      return `<div class="custom-page-render-container">${pageConfig}</div>`;
    }
    openTab(tab) {
      const key = tab.data('key');
      const id = tab.data('id');
      const {
        contents,
        tabs
      } = this;
      tabs.removeClass('active');
      tab.addClass('active');
      contents.hide();
      let content;
      contents.each((_, el) => {
        if ($(el).data('key') === key) {
          $(el).show();
          content = el;
          return true;
        }
      });
      if (!tab.prop('loaded')) {
        tab.prop('loaded', true);
        if (id) {
          this.requestCollapseContent(id, content);
        }
      }
      this.showKey = key;
    }
    bindEvent() {
      const that = this;
      const {
        tabs
      } = this;
      tabs.on('click', function () {
        const tab = $(this);
        const key = tab.data('key');
        if (that.showKey === key) {
          return;
        }
        tab.get(0).scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
          inline: 'center'
        });
        that.openTab(tab);
      });
    }
  }
  _exports.default = Tabs;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/detail/js/product-collapse.js'] = window.SLM['product/detail/js/product-collapse.js'] || function () {
  const _exports = {};
  const request = window['SLM']['theme-shared/utils/request.js'].default;
  const createShadowDom = window['SLM']['product/commons/js/createShadowDom.js'].default;
  function whichTransitionEvent() {
    let t;
    const el = document.createElement('fakeElement');
    const transitions = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd',
      MsTransition: 'msTransitionEnd'
    };
    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }
  function openCollapseByHeight(element) {
    const initHeight = $(element).innerHeight();
    element.style.height = 'auto';
    const targetHeight = $(element).innerHeight();
    element.style.height = `${initHeight}px`;
    $(element).css('color');
    element.style.height = `${targetHeight}px`;
  }
  function closeCollapseByHeight(element) {
    const initHeight = $(element).innerHeight();
    $(element).css('height', `${initHeight}px`);
    $(element).css('color');
    element.style.height = `0px`;
  }
  const PAGE_ID = 'pageid';
  const CUSTOM_PAGE_TYPE = 'customize';
  const isReJsonSdkData = originData => {
    try {
      return JSON.parse(originData);
    } catch (error) {
      return false;
    }
  };
  _exports.isReJsonSdkData = isReJsonSdkData;
  class Collapse {
    constructor({
      lang = 'default',
      selector,
      cacheRequest = true
    }) {
      this.$container = $(selector);
      this.$collapseAsyncItems = this.$container.find('.base-collapse-item-async');
      this.$collapseSyncItems = this.$container.find('.base-collapse-item-sync');
      this.lang = lang;
      this.cacheRequest = cacheRequest;
      this.cacheData = {};
      this.$activeItem = null;
      this.transitionEvent = whichTransitionEvent();
      this.init();
    }
    init() {
      const self = this;
      const ids = Array.from(this.$collapseAsyncItems).map(item => $(item).data(PAGE_ID)).filter(id => !!id);
      this.$collapseAsyncItems.each((index, item) => {
        const $item = $(item);
        $item.find('.base-collapse-item__wrap').on(self.transitionEvent, function () {
          if ($(this).parent().hasClass('active')) {
            $(this).css('height', 'auto');
          }
        });
        if ($item.hasClass('active') && $item.data(PAGE_ID)) {
          this.requestCollapseContent($item.data(PAGE_ID)).then(res => {
            this.setCollapseContent(res && res.data, $item);
          });
        }
      });
      this.$collapseSyncItems.each((index, item) => {
        const $item = $(item);
        $item.find('.base-collapse-item__wrap').on(self.transitionEvent, function () {
          if ($(this).parent().hasClass('active')) {
            $(this).css('height', 'auto');
          }
        });
        if (!$item.data('isinitshadowdom')) {
          const html = $item.find('.base-collapse-item__content').html();
          self.transContentByShadowDom($item, html);
          $item.data('isinitshadowdom', true);
        }
      });
      this.requestCollapseTitle(ids);
      this.bindEvent();
    }
    requestCollapseTitle(ids) {
      if (!ids || !ids.length) {
        return Promise.resolve();
      }
      const {
        lang
      } = this;
      return request({
        url: 'site/render/page/basic/infos',
        method: 'GET',
        params: {
          pageIds: ids.join(',')
        }
      }).then(res => {
        if (res && Array.isArray(res.data)) {
          const data = res.data.reduce((fin, item) => {
            const name = item && item.name ? item.name[lang] : '';
            return {
              ...fin,
              [item && item.id]: name
            };
          }, {});
          this.setCollapseTitle(data);
        }
      });
    }
    setCollapseTitle(titleMap) {
      this.$collapseAsyncItems.each((index, item) => {
        const $item = $(item);
        const title = titleMap[$item.data(PAGE_ID)];
        if (title) {
          $item.find('.base-collapse-item__title').text(title);
        }
      });
    }
    bindEvent() {
      const self = this;
      this.$collapseAsyncItems.on('click', '.base-collapse-item__header', function () {
        const $item = $(this).closest('.base-collapse-item');
        const id = $item.data(PAGE_ID);
        const isOpen = $item.hasClass('active');
        if (isOpen) {
          self.close($item);
          return;
        }
        self.requestCollapseContent(id).then(res => {
          self.setCollapseContent(res && res.data, $item);
          self.$activeItem = $item;
          self.open($item);
        });
      });
      this.$collapseSyncItems.on('click', '.base-collapse-item__header', function () {
        const $item = $(this).closest('.base-collapse-item');
        const isOpen = $item.hasClass('active');
        if (isOpen) {
          self.close($item);
          return;
        }
        self.open($item);
      });
      window.SL_EventBus.on('stage:locale:change', () => {
        if (this.$activeItem) {
          this.calcCollapseContentHeight(this.$activeItem);
        } else {
          this.$collapseAsyncItems.each((index, item) => {
            const $item = $(item);
            if ($item.hasClass('active') && $item.data(PAGE_ID)) {
              this.calcCollapseContentHeight($item);
            }
          });
        }
      });
    }
    requestCollapseContent(id) {
      if (this.cacheRequest && this.cacheData[id]) {
        return Promise.resolve(this.cacheData[id]);
      }
      return request({
        url: `site/render/page/${CUSTOM_PAGE_TYPE}/${id}`,
        method: 'GET'
      }).then(res => {
        if (this.cacheRequest) {
          this.cacheData[id] = res;
        }
        return res;
      }).catch(() => {
        if (this.cacheRequest) {
          this.cacheData[id] = {};
        }
        return {};
      });
    }
    getCustomPageContent(pageConfig) {
      return `<div class="custom-page-render-container">${pageConfig}</div>`;
    }
    transContentByShadowDom($item, content) {
      const $content = $item.find('.base-collapse-item__content');
      $content.html(`
      <div style="overflow: hidden;" data-node="shadow-content">
        <div class="mce-content-body">
          ${content}
        </div>
      </div>
      <div data-node="shadow-dom"></div>
    `);
      createShadowDom();
    }
    setCollapseContent(data, $item) {
      const content = this.getCustomPageContent(data && data.htmlConfig);
      this.transContentByShadowDom($item, content);
    }
    calcCollapseContentHeight($item) {
      const $content = $item.find('.base-collapse-item__content');
      const images = Array.from($content.find('img')).map(item => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.src = item.src;
          image.onload = () => {
            resolve(image);
          };
          image.onerror = () => {
            reject(image);
          };
        });
      });
      Promise.allSettled(images).then(() => {
        setTimeout(() => {
          const height = $content.outerHeight();
          $content.parent().css({
            height
          });
        }, 0);
      }).catch(() => {
        $content.parent().css({
          height: 'auto'
        });
      });
    }
    open($item) {
      const template = $item.find('template');
      if (template) {
        $item.find('.base-collapse-item__wrap').append(template.prop('content'));
        template.remove();
      }
      if (!$item.data('isinitshadowdom')) {
        const html = $item.find('.base-collapse-item__content').html();
        this.transContentByShadowDom($item, html);
        $item.data('isinitshadowdom', true);
      }
      openCollapseByHeight($item.find('.base-collapse-item__wrap').get(0));
      $item.addClass('active');
    }
    close($item) {
      this.$activeItem = null;
      closeCollapseByHeight($item.find('.base-collapse-item__wrap').get(0));
      $item.removeClass('active');
    }
  }
  _exports.default = Collapse;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/thirdPartyShare/js/index.js'] = window.SLM['theme-shared/components/hbs/thirdPartyShare/js/index.js'] || function () {
  const _exports = {};
  const ACTIVE_CLASS = 'third-party-more-active';
  $(document).on('click', function (e) {
    const $more = $(`.third-party-share .third-party-more`);
    const $target = $(e.target).closest('.third-party-more');
    if ($target.length > 0) {
      if (!$target.hasClass(ACTIVE_CLASS)) {
        const $list = $target.find('.third-party-more-list');
        if ($list.length) {
          const scrollParentNode = findParentWithScroll($target[0]);
          const btnRect = $target[0].getBoundingClientRect();
          $list[0].dataset.top = String(btnRect.bottom + $list[0].scrollHeight + 6 >= (scrollParentNode ? scrollParentNode.getBoundingClientRect().bottom : window.innerHeight));
        }
      }
      $target.toggleClass(ACTIVE_CLASS);
    } else if ($more.hasClass(ACTIVE_CLASS)) {
      $more.removeClass(ACTIVE_CLASS);
    }
  });
  function findParentWithScroll(element) {
    let {
      parentNode
    } = element;
    while (parentNode !== document.body) {
      const computedStyle = getComputedStyle(parentNode);
      const {
        overflow
      } = computedStyle;
      if (overflow === 'scroll' || overflow === 'auto') {
        return parentNode;
      }
      parentNode = parentNode.parentNode;
    }
    return null;
  }
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/thirdPartyShare/index.js'] = window.SLM['commons/thirdPartyShare/index.js'] || function () {
  const _exports = {};
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/report/product/product-preview.js'] = window.SLM['theme-shared/report/product/product-preview.js'] || function () {
  const _exports = {};
  const getCurrencyCode = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'].default;
  const { BaseReport, findSectionId } = window['SLM']['theme-shared/report/common/baseReport.js'];
  const { sectionTypeEnum } = window['SLM']['theme-shared/report/stage/const.js'];
  class ProductPreviewReport extends BaseReport {
    constructor() {
      super();
      this.map = {
        pdp: {
          pdpType: 101,
          module: -999
        },
        featuredProduct: {
          pdpType: 102,
          module: 900
        },
        quickViewModal: {
          pdpType: 103,
          module: -999
        }
      };
    }
    viewContent(params) {
      const {
        selector,
        content_spu_id,
        content_sku_id,
        title,
        currency,
        price
      } = params;
      if (!selector) {
        console.warn('viewContent The selector parameter is missing.', params);
        return;
      }
      const _params = {
        content_ids: content_spu_id,
        sku_id: content_sku_id,
        content_name: title,
        currency: getCurrencyCode() || currency,
        value: price,
        pdp_type: this.map[params.module] && this.map[params.module].pdpType,
        module: this.map[params.module] && this.map[params.module].module,
        component: params.module === 'featuredProduct' ? 900 : -999,
        popup_page_base: this.page,
        page: params.module !== 'quickViewModal' ? this.page : 107
      };
      if (params.module === 'featuredProduct') {
        _params.module_type = sectionTypeEnum['featured-product'];
        _params.component_ID = findSectionId('[data-ssr-plugin-product-detail-container]');
      }
      super.viewContent({
        selector,
        reportOnce: params.module !== 'quickViewModal',
        customParams: _params
      });
    }
  }
  _exports.ProductPreviewReport = ProductPreviewReport;
  function hdProductViewContent(params) {
    const report = new ProductPreviewReport();
    report.viewContent(params);
  }
  _exports.default = hdProductViewContent;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/detail/js/product-preview.js'] = window.SLM['product/detail/js/product-preview.js'] || function () {
  const _exports = {};
  const DataWatcher = window['SLM']['theme-shared/utils/sku/DataWatcher.js'].default;
  const productSkuChange = window['SLM']['theme-shared/events/product/sku-change/index.js'].default;
  const productSkuChanged = window['SLM']['theme-shared/events/product/sku-changed/index.js'].default;
  const productPreviewInit = window['SLM']['theme-shared/events/product/preview-init/index.js'].default;
  const dataReportViewContent = window['@yy/sl-theme-shared']['/events/data-report/view-content'].default;
  const currency = window['SLM']['theme-shared/utils/newCurrency/index.js'].default;
  const SkuQuality = window['SLM']['product/detail/js/product-quantity.js'].default;
  const ButtonEvent = window['SLM']['product/detail/js/product-button.js'].default;
  const { getVariant } = window['SLM']['product/detail/js/product-button.js'];
  const setProductPrice = window['SLM']['product/commons/js/product-info.js'].default;
  const ProductImages = window['SLM']['product/detail/js/product-swiper.js'].default;
  const setPosition = window['SLM']['product/detail/js/layout.js'].default;
  const { listenPosition } = window['SLM']['product/detail/js/layout.js'];
  const initSku = window['SLM']['product/detail/js/sku-trade.js'].default;
  const InquiryPriceModal = window['SLM']['product/detail/inquiry-price-modal.js'].default;
  const createShadowDom = window['SLM']['product/commons/js/createShadowDom.js'].default;
  const Tabs = window['SLM']['product/detail/js/tabs.js'].default;
  const { ModalWithHtml } = window['SLM']['commons/components/modal/index.js'];
  const ProductCollapse = window['SLM']['product/detail/js/product-collapse.js'].default;
  const get = window['lodash']['get'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { changeURLArg, delParam } = window['SLM']['commons/utils/url.js'];
  const hdProductViewContent = window['SLM']['theme-shared/report/product/product-preview.js'].default;
  const getCurrencyCode = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'].default;
  const { convertPrice } = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'];
  const nullishCoalescingOperator = window['SLM']['product/utils/nullishCoalescingOperator.js'].default;
  const newCurrency = window['SLM']['theme-shared/utils/newCurrency/index.js'].default;
  const trackProductDetailPageView = ({
    sku_id,
    spu_id
  }) => {
    try {
      window.HdSdk && window.HdSdk.shopTracker.collect({
        page: 105,
        module: -999,
        component: -999,
        action_type: 101,
        sku_id,
        spu_id
      });
    } catch (e) {}
  };
  const emitProductSkuChange = data => {
    try {
      productSkuChange({
        ...data,
        currency: window.Shopline.currency
      });
    } catch (e) {
      console.error(e);
    }
  };
  const emitProductSkuChanged = data => {
    try {
      productSkuChanged({
        ...data,
        currency: window.Shopline.currency
      });
    } catch (e) {
      console.error(e);
    }
  };
  const emitViewContent = data => {
    try {
      dataReportViewContent(data);
      hdProductViewContent({
        ...data,
        content_sku_id: data.curSkuId,
        price: data.curSkuPrice
      });
    } catch (e) {
      console.error(e);
    }
  };
  const getSortationIds = spu => {
    if (spu && spu.sortationList && Array.isArray(spu.sortationList)) {
      return spu.sortationList.map(s => s.sortationId).join(',');
    }
    return '';
  };
  function thirdPartReport({
    activeSku,
    spu,
    sku
  }) {
    const newActiveSku = activeSku || get(sku, 'skuList[0]');
    window.SL_EventBus.emit('global:thirdPartReport', {
      GA: [['event', 'view_item', {
        currency: getCurrencyCode(),
        items: [{
          id: newActiveSku && newActiveSku.skuSeq,
          name: spu && spu.title,
          currency: getCurrencyCode(),
          price: convertPrice(newActiveSku && newActiveSku.price),
          variant: getVariant(newActiveSku && newActiveSku.skuAttributeIds, sku && sku.skuAttributeMap),
          category: spu && spu.customCategoryName || ''
        }]
      }]],
      GA4: [['event', 'view_item', {
        currency: getCurrencyCode(),
        value: convertPrice(newActiveSku && newActiveSku.price),
        items: [{
          item_id: newActiveSku && newActiveSku.skuSeq,
          item_name: spu && spu.title,
          currency: getCurrencyCode(),
          item_price: convertPrice(newActiveSku && newActiveSku.price),
          item_variant: getVariant(newActiveSku && newActiveSku.skuAttributeIds, sku && sku.skuAttributeMap),
          item_category: spu && spu.customCategoryName || ''
        }]
      }]],
      GAR: [['event', 'view_item', {
        currency: getCurrencyCode(),
        value: convertPrice(newActiveSku && newActiveSku.price),
        items: [{
          id: window.SL_GetReportArg && window.SL_GetReportArg('GAR', 'sku_id', newActiveSku && newActiveSku.skuSeq),
          google_business_vertical: 'retail'
        }]
      }]],
      GARemarketing: [['event', 'view_item', {
        ecomm_prodid: window.SL_GetReportArg && window.SL_GetReportArg('GAR', 'sku_id', newActiveSku && newActiveSku.skuSeq),
        ecomm_pagetype: 'product',
        ecomm_category: get(spu, 'sortationList[0].sortationId'),
        ecomm_pcat: get(spu, 'sortationList[0].sortationName'),
        currency: getCurrencyCode(),
        ecomm_totalvalue: convertPrice(newActiveSku && newActiveSku.price)
      }]]
    });
  }
  function handleProductDescFold(id) {
    const descContainer = document.querySelector(`.product-description-limit-max-height-${id}`);
    if (!descContainer) return;
    const descHeight = descContainer.children[0].offsetHeight;
    const viewMoreBox = descContainer.nextElementSibling;
    const viewMoreBtn = viewMoreBox.querySelector('.product-description-view-more-btn');
    const viewLessBtn = viewMoreBox.querySelector('.product-description-view-less-btn');
    viewMoreBtn.addEventListener('click', () => {
      viewMoreBox.setAttribute('open', true);
      descContainer.classList.remove('limit-max-height');
    });
    viewLessBtn.addEventListener('click', () => {
      viewMoreBox.removeAttribute('open');
      descContainer.classList.add('limit-max-height');
    });
    const MAX_CONTENT_HEIGHT = 150;
    if (descHeight > MAX_CONTENT_HEIGHT) {
      viewMoreBox.style.display = 'block';
    } else {
      descContainer.classList.remove('limit-max-height');
    }
  }
  function initPreview({
    id,
    statePath,
    filterShelves,
    offsetTop,
    container,
    onAddSuccess,
    modalType,
    position,
    module,
    modalContainer,
    imageQuality
  }) {
    const sku = SL_State.get(`${statePath}.sku`);
    const spu = SL_State.get(`${statePath}.spu`);
    const plugin = SL_State.get(`${statePath}.plugin`);
    const viewContentSelector = `.__sl-custom-track-${id}`;
    if (filterShelves && !get(spu, 'shelves')) {
      console.error('no spu data or not shelves, init break');
      return () => undefined;
    }
    const productPopup = () => {
      const eventBindCallback = evt => {
        const dom = evt.currentTarget;
        const {
          displayProductDesc,
          page: pageId
        } = dom.dataset;
        const $content = dom.querySelector('.js-product-content');
        const $description = dom.querySelector('.js-product-description');
        const content = $content ? $content.textContent : '';
        const description = $description ? $description.textContent : '';
        const pages = SL_State.get('pages');
        const selectedPage = pages[pageId];
        let finalHtml = '';
        if (displayProductDesc === 'true') {
          finalHtml = description;
        } else if (typeof content === 'string' && content.trim()) {
          finalHtml = content;
        } else if (selectedPage && selectedPage.htmlConfig) {
          finalHtml = selectedPage.htmlConfig;
        }
        const modal = new ModalWithHtml({
          children: finalHtml,
          bodyClassName: 'sl-richtext product-popup__container',
          destroyedOnClosed: true,
          zIndex: 128
        });
        modal.show();
      };
      $(document.body).on('click', '.js-product-popup', eventBindCallback);
      return () => {
        $(document.body).off('click', '.js-product-popup', eventBindCallback);
      };
    };
    let unbindProductPopup;
    if (id === 'productDetail') {
      unbindProductPopup = productPopup();
    }
    const removePositionListener = listenPosition({
      id,
      offsetTop,
      container
    });
    createShadowDom();
    handleProductDescFold(id);
    let productImagesInstance;
    try {
      productImagesInstance = new ProductImages({
        spuSeq: spu.spuSeq,
        mediaList: spu.mediaList,
        selectorId: id,
        skuList: sku && sku.skuList,
        imageQuality,
        heightOnChange: () => {
          setPosition({
            id,
            offsetTop,
            container
          });
        },
        beforeInit: ({
          pcWrapperSelector
        }) => {
          const $dom = document.querySelector(`${pcWrapperSelector} .swiper-container`);
          if (!$dom) return;
          const childHtml = $dom.outerHTML;
          $(`${pcWrapperSelector} .swiper-container`).remove();
          $(`${pcWrapperSelector}`).prepend(`<div class="swiper-border-shadow-container">${childHtml}</div>`);
        }
      });
    } catch (e) {
      setTimeout(() => {
        throw e;
      });
    }
    const inquiryPriceModal = new InquiryPriceModal({
      id,
      spu,
      sku
    });
    const ButtonGroup = new ButtonEvent({
      id,
      cartRoot: `.pdp_add_to_cart_${id}`,
      soldOutRoot: `.pdp_sold_out_${id}`,
      spu,
      sku,
      modalType,
      position,
      onAddSuccess: () => {
        if (typeof onAddSuccess === 'function') {
          onAddSuccess();
        }
      }
    });
    const attr = $(`#product-in-stock_${id}`).attr('stock-number');
    const isShowTips = attr === 'false' || attr === undefined ? true : false;
    const quantityStepper = new SkuQuality({
      id,
      sku,
      spu,
      dataPool: new DataWatcher(),
      isShowTips: isShowTips
    });
    quantityStepper.dataPool.watch(['quantity'], num => {
      ButtonGroup.setActiveSkuNum(num);
      if (id === 'productDetail') {
        window.productDetailDataBus.set('num', num);
        window.productDetailDataBus.emit('after:countChange', num);
      }
      window.SL_EventBus.emit('product:count:change', [num, id]);
    });
    new ProductCollapse({
      selector: `.product-detail-collapse_${id}`
    });
    new Tabs({
      root: '.product-tabs-container'
    });
    const getSkuChangeData = (skuInfo = {}) => {
      const {
        spuSeq,
        discount,
        skuSeq,
        price,
        originPrice,
        stock,
        weight,
        weightUnit,
        available,
        shelves,
        skuAttributeIds,
        imageList,
        soldOut,
        allowOversold,
        imageBeanList
      } = skuInfo || {};
      return {
        spuSeq,
        discount,
        skuSeq,
        price: newCurrency.formatCurrency(price || 0),
        originPrice: newCurrency.formatCurrency(originPrice || 0),
        stock,
        weight,
        weightUnit,
        available,
        shelves,
        skuAttributeIds,
        imageList,
        soldOut,
        allowOversold,
        imageBeanList
      };
    };
    let activeSkuCache = {};
    const getHdReportViewCurSku = activeSku => {
      let sku_id = 'null';
      let price = 'null';
      const b2bData = nullishCoalescingOperator(get(plugin, 'bizData.b2b'), {});
      const isBatchBuy = get(b2bData, 'moqPlan.batchBuy') && b2bData.moqPlan.applyType === 2;
      const isSoldOut = get(spu, 'soldOut') || get(activeSku, 'soldOut');
      const isSigleSku = get(sku, 'skuList.length') < 2;
      if (isBatchBuy) {
        sku_id = 'null';
        price = 'null';
      } else if (isSigleSku) {
        sku_id = get(sku, 'skuList[0].skuSeq');
        price = convertPrice(get(sku, 'skuList[0].skuPrice') || 0);
      } else if (activeSku && activeSku.skuSeq) {
        sku_id = activeSku.skuSeq;
        price = convertPrice(activeSku.price || 0);
      }
      return {
        curSkuId: sku_id,
        curSkuPrice: price
      };
    };
    function handleChangeSkuItemNo(activeSku, id) {
      const {
        itemNo
      } = activeSku || {};
      if (activeSku) {
        $(`.product-info-skuItemNo_${id}`).text(itemNo);
      } else {
        $(`.product-info-skuItemNo_${id}`).text('');
      }
    }
    let unmountedDiscountCoupon = null;
    let unmountPromotionTags = null;
    const skuDataPool = new DataWatcher();
    const skuTrade = initSku({
      id,
      sku,
      spu,
      mixins: window.skuMixins,
      dataPool: skuDataPool,
      modalContainer,
      onInit: (trade, activeSku) => {
        thirdPartReport({
          activeSku,
          spu,
          sku
        });
        activeSkuCache = activeSku;
        let content_sku_id = '';
        let price = null;
        inquiryPriceModal.setActiveSku(activeSku);
        const hdReportViewCurSku = getHdReportViewCurSku(activeSkuCache);
        if (id === 'productDetail') {
          window.productDetailDataBus.set('activeSku', activeSku);
          window.productDetailDataBus.emit('init:sku', activeSku);
          trackProductDetailPageView({
            sku_id: hdReportViewCurSku.curSkuId,
            spu_id: spu.spuSeq
          });
        }
        if (activeSku) {
          quantityStepper.setActiveSku(activeSku);
          ButtonGroup.setActiveSku(activeSku);
          content_sku_id = activeSku.skuSeq;
          price = convertPrice(activeSku.price || 0);
          emitProductSkuChange({
            type: 'init',
            quantity: get(quantityStepper, 'skuStepper.data.value') || 1,
            ...getSkuChangeData(activeSku)
          });
        }
        emitViewContent({
          content_spu_id: spu.spuSeq,
          content_sku_id,
          content_category: getSortationIds(spu),
          currency: getCurrencyCode(),
          value: price,
          quantity: 1,
          price,
          title: spu.title,
          module,
          selector: viewContentSelector,
          ...hdReportViewCurSku
        });
        emitProductSkuChanged({
          type: 'init',
          id,
          productId: spu.spuSeq,
          instances: {
            productImages: productImagesInstance,
            buttonGroup: ButtonGroup,
            skuDataPool,
            quantityStepper
          },
          quantity: get(quantityStepper, 'skuStepper.data.value') || 1,
          ...getSkuChangeData(activeSku)
        });
        trade.dataPool.watch(['activeSku'], activeSku => {
          if (id === 'productDetail') {
            window.productDetailDataBus.set('activeSku', activeSku);
            window.productDetailDataBus.emit('after:skuChange', activeSku);
            if (activeSku) {
              if (activeSku.skuSeq !== (activeSkuCache ? activeSkuCache.skuSeq : '')) {
                window.history.replaceState({}, document.title, changeURLArg(window.location.href, 'sku', activeSku.skuSeq));
              }
            } else {
              window.history.replaceState({}, document.title, delParam('sku'));
            }
          }
          handleChangeSkuItemNo(activeSku, id);
          activeSkuCache = activeSku;
          inquiryPriceModal.setActiveSku(activeSku);
          productImagesInstance && productImagesInstance.skuImageChange && productImagesInstance.skuImageChange(get(activeSku, 'imageBeanList[0]'));
          if (activeSku || quantityStepper.activeSku) {
            setProductPrice(id, statePath, activeSku);
            quantityStepper.setActiveSku(activeSku);
            ButtonGroup.setActiveSku(activeSku);
          }
        });
      },
      onChange: activeSku => {
        if (activeSku) {
          thirdPartReport({
            activeSku,
            spu,
            sku
          });
          emitProductSkuChange({
            type: 'change',
            quantity: get(quantityStepper, 'skuStepper.data.value') || 1,
            ...getSkuChangeData(activeSku)
          });
        }
        emitProductSkuChanged({
          type: 'change',
          id,
          productId: spu.spuSeq,
          instances: {
            productImages: productImagesInstance,
            buttonGroup: ButtonGroup,
            quantityStepper
          },
          quantity: get(quantityStepper, 'skuStepper.data.value') || 1,
          ...getSkuChangeData(activeSku)
        });
      }
    });
    try {
      productPreviewInit({
        id,
        position,
        modalType,
        module,
        product: window.SL_State.get(`${statePath}`),
        modalContainer,
        modalContainerElement: modalContainer && modalContainer[0],
        instances: {
          productImages: productImagesInstance,
          buttonGroup: ButtonGroup,
          skuDataPool,
          quantityStepper,
          skuTrade
        }
      });
    } catch (e) {
      console.error(e);
    }
    return {
      skuTrade,
      quantityStepper,
      productEventRepeat: () => {
        let content_sku_id = '';
        let price = null;
        if (activeSkuCache) {
          content_sku_id = activeSkuCache.skuSeq;
          price = convertPrice(activeSkuCache.price || 0);
          emitProductSkuChange({
            type: 'init',
            quantity: get(quantityStepper, 'skuStepper.data.value') || 1,
            ...getSkuChangeData(activeSkuCache)
          });
        }
        thirdPartReport({
          activeSku: activeSkuCache,
          spu,
          sku
        });
        emitViewContent({
          content_spu_id: spu.spuSeq,
          content_sku_id,
          content_category: getSortationIds(spu),
          currency: getCurrencyCode(),
          value: price,
          quantity: 1,
          price,
          title: spu.title,
          module,
          selector: viewContentSelector,
          ...getHdReportViewCurSku(activeSkuCache)
        });
      },
      destroy: () => {
        if (typeof unbindProductPopup === 'function') {
          unbindProductPopup();
        }
        inquiryPriceModal.unbindEvents();
        if (typeof unmountedDiscountCoupon === 'function') {
          unmountedDiscountCoupon();
        }
        if (typeof unmountPromotionTags === 'function') {
          unmountPromotionTags();
        }
        removePositionListener();
        skuTrade.destory();
      }
    };
  }
  _exports.default = initPreview;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/commons/js/preview-modal/preview-modal.js'] = window.SLM['product/commons/js/preview-modal/preview-modal.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const pageMapping = window['SLM']['theme-shared/utils/report/pageMapping.js'].default;
  const axios = window['axios']['default'];
  const quickViewClick = window['SLM']['theme-shared/events/product/quickView-click/index.js'].default;
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { isYoutube } = window['SLM']['theme-shared/components/hbs/productImages/js/multi-video.js'];
  const { ModalWithHtml } = window['SLM']['commons/components/modal/index.js'];
  const Toast = window['SLM']['commons/components/toast/index.js'].default;
  const { Loading } = window['SLM']['commons/components/toast/index.js'];
  const initPreview = window['SLM']['product/detail/js/product-preview.js'].default;
  const { getUrlQuery } = window['SLM']['commons/utils/url.js'];
  function modalExpose(modalPrefix) {
    if (window.HdSdk && window.HdSdk.shopTracker && window.HdSdk.shopTracker.report) {
      window.HdSdk.shopTracker.report('60006263', {
        event_name: 'view',
        page: modalPrefix === 'productRecommendModal' ? '123' : pageMapping[SL_State.get('templateAlias')]
      });
    }
  }
  function fetchDetail(uniqueKey, params, selectedSku) {
    const queryUrl = window.Shopline.redirectTo(`/products/${uniqueKey}`);
    return axios.get(queryUrl, {
      params: {
        ...params,
        sku: selectedSku || undefined,
        view: 'modal',
        preview: getUrlQuery('preview'),
        themeId: getUrlQuery('themeId'),
        ignoreRedirect: getUrlQuery('ignoreRedirect'),
        sourcePage: SL_State.get('templateAlias'),
        isJsonSettings: true
      }
    });
  }
  function createContent() {
    return $('<div class="product-preview-modal-content" data-scroll-lock-scrollable></div>');
  }
  const previewProductDescVideoMap = {};
  function collectProductDescVideo(children, id) {
    const productDescDom = children.find('[data-ssr-plugin-detail-description]');
    const video = productDescDom.find('video');
    const youtubeIframe = productDescDom.find('iframe').filter((index, item) => {
      const src = $(item).attr('src');
      return src && isYoutube(src);
    });
    previewProductDescVideoMap[id] = {};
    if (video.length > 0) {
      previewProductDescVideoMap[id].videoList = video;
    }
    if (youtubeIframe.length > 0) {
      previewProductDescVideoMap[id].youtubeIframeList = youtubeIframe;
    }
  }
  function handleProductDescVideoByCloseModal(id) {
    const videoMap = previewProductDescVideoMap[id] || {};
    const {
      videoList,
      youtubeIframeList
    } = videoMap;
    if (videoList && videoList.each) {
      videoList.each((index, item) => {
        if (item.pause) {
          item.pause();
        }
      });
    }
    if (youtubeIframeList && youtubeIframeList.each) {
      youtubeIframeList.each((index, item) => {
        const src = $(item).attr('src');
        $(item).attr('data-resource-url', src);
        $(item).attr('src', '');
      });
    }
  }
  function handleProductDescVideoByOpenModal(id) {
    const videoMap = previewProductDescVideoMap[id] || {};
    const {
      youtubeIframeList
    } = videoMap;
    if (youtubeIframeList && youtubeIframeList.each) {
      youtubeIframeList.each((index, item) => {
        const src = $(item).attr('data-resource-url');
        if (src) {
          $(item).attr('src', src);
        }
      });
    }
  }
  const modalMap = {};
  const previewMap = {};
  function previewModal({
    spuSeq,
    uniqueKey,
    query,
    position,
    selectedSku
  }) {
    let modalPrefix = 'productModal_';
    let queryObj = {};
    try {
      queryObj = {
        ...query
      };
      modalPrefix = queryObj.modalPrefix || 'productModal_';
    } catch (e) {}
    if (modalMap[spuSeq]) {
      handleProductDescVideoByOpenModal(spuSeq);
      modalMap[spuSeq].show && modalMap[spuSeq].show();
      previewMap[spuSeq] && previewMap[spuSeq].productEventRepeat();
      modalExpose(modalPrefix);
      quickViewClick({
        type: 'change',
        eventName: 'OPEN_QUICKVIEW_EVENT',
        prefix: modalPrefix,
        spuSeq,
        modal: modalMap[spuSeq],
        preview: {
          skuTrade: previewMap[spuSeq].skuTrade,
          quantityStepper: previewMap[spuSeq].quantityStepper
        },
        $el: document.getElementById(modalMap[spuSeq].modalId)
      });
    } else {
      const children = createContent();
      const modal = new ModalWithHtml({
        children,
        containerClassName: 'product-preview-modal-container',
        bodyClassName: 'product-preview-modal-body',
        zIndex: 128,
        closeCallback: () => {
          handleProductDescVideoByCloseModal(spuSeq);
          quickViewClick({
            eventName: 'CLOSE_QUICKVIEW_EVENT',
            spuSeq,
            $el: document.getElementById(modalMap[spuSeq].modalId)
          });
        }
      });
      modal.show();
      new Loading({
        target: children,
        loadingColor: 'currentColor',
        duration: -1
      }).open();
      fetchDetail(uniqueKey, queryObj, selectedSku).then(res => {
        children.html('<div class="product-preview-modal-top-space"></div>').append(res.data);
        collectProductDescVideo(children, spuSeq);
        modalExpose(modalPrefix);
        window.SL_EventBus.emit('global.activeIcon.show', {
          type: 'vip'
        });
        try {
          const preview = initPreview({
            module: 'quickViewModal',
            id: `${modalPrefix}${spuSeq}`,
            statePath: `${modalPrefix}${spuSeq}`,
            offsetTop: 48,
            container: modal.$modal.find('.product-preview-modal-body'),
            modalType: 'QuickView',
            position,
            modalContainer: modal.$modal,
            onAddSuccess: () => {
              modal.hide();
            }
          });
          modalMap[spuSeq] = modal;
          previewMap[spuSeq] = preview;
          quickViewClick({
            type: 'init',
            eventName: 'OPEN_QUICKVIEW_EVENT',
            prefix: modalPrefix,
            spuSeq,
            preview: {
              skuTrade: preview.skuTrade,
              quantityStepper: preview.quantityStepper
            },
            modal,
            $el: document.getElementById(modalMap[spuSeq].modalId)
          });
        } catch (e) {
          setTimeout(() => {
            throw e;
          });
        }
      }).catch(() => {
        new Toast().open(t('products.general.no_product_data_found'), 3000);
        modal.hide();
        modal.destroy();
      });
    }
    return modalMap[spuSeq];
  }
  _exports.default = previewModal;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/commons/js/preview-modal/index.js'] = window.SLM['product/commons/js/preview-modal/index.js'] || function () {
  const _exports = {};
  const { default: _default } = window['SLM']['product/commons/js/preview-modal/preview-modal.js'];
  _exports.default = _default;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/commons/js/product-item.js'] = window.SLM['product/commons/js/product-item.js'] || function () {
  const _exports = {};
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const ProductItemReport = window['SLM']['theme-shared/report/product/product-item.js'].default;
  const getCurrencyCode = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'].default;
  const { convertPrice } = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'];
  const previewModal = window['SLM']['product/commons/js/preview-modal/index.js'].default;
  const quickAddModal = window['SLM']['product/commons/js/quick-add-modal.js'].default;
  const isMobile = window['SLM']['commons/utils/isMobile.js'].default;
  const hdReport = new ProductItemReport();
  const isPad = SL_State.get('request.is_mobile') || document.ontouchmove !== undefined;
  $('body').delegate('.js-product-item-quick-view', 'click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const $current = $(e.currentTarget);
    if ($current.hasClass('disabled')) return;
    const spuSeq = $(this).data('spu-seq');
    const uniqueKey = $(this).data('unique-key');
    const query = $(this).data('query');
    const position = $(this).data('index');
    const selectedSku = $(this).data('selected-sku');
    previewModal({
      spuSeq,
      uniqueKey,
      query,
      position,
      selectedSku
    });
  });
  $('body').on('click', '.js-product-item-quick-add', e => {
    e.preventDefault();
    e.stopPropagation();
    const $current = $(e.currentTarget);
    if ($current.hasClass('disabled')) return;
    const itemIndex = $current.data('index');
    const spuSeq = $current.data('spu-seq');
    const uniqueKey = $current.data('unique-key');
    const status = $current.data('status');
    const position = $current.data('index');
    const selectedSku = $current.data('selected-sku');
    quickAddModal({
      spuSeq,
      uniqueKey,
      $button: $current,
      position,
      itemIndex,
      status,
      selectedSku
    });
  });
  if (isPad) {
    $('.product-item__inner-wrap .product-item__actions').css({
      display: 'block'
    });
    $('.product-item__inner-wrap .js-product-item__actions').css({
      display: ''
    });
    $('.product-item__inner-wrap').removeClass('js-product-inner-wrap');
    $('#collectionsAjaxInner').addClass('pad');
    $('.product-item__wrapper').addClass('pad');
  }
  $('body').on('mouseenter', '.js-product-inner-wrap', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile()) return;
    const $item = $(this);
    const $parent = $item.parent();
    const $btns = $item.find('.js-product-item__actions');
    const noHoverAnimation = $item.data('no-hover-ani-effect');
    if ($btns.hasClass('show-middle-btn') || noHoverAnimation) return;
    window.clearTimeout(+$item.attr('data-timer'));
    if ($parent.children('.js-bg').length) {
      $item.css('height', `${$item.find('.js-product-item').outerHeight()}px`);
    } else {
      const $bg = $('<div class="js-bg" style="width: 100%;"></div>');
      $bg.css('height', `${$item.outerHeight()}px`).appendTo($parent);
      $item.css('position', 'absolute').css('top', '0').css('left', '0').css('width', '100%').css('z-index', $item.attr('data-hover-z-index'));
      $btns.css('display', 'block');
      $item.css('height', `${$bg.outerHeight(true)}px`);
      $item.css('height', `${$item.find('.js-product-item').outerHeight()}px`);
    }
  });
  $('body').on('mouseleave', '.js-product-inner-wrap', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile()) return;
    const $item = $(this);
    const $parent = $item.parent();
    const $btns = $item.find('.js-product-item__actions');
    if ($btns.hasClass('show-middle-btn')) return;
    const $bg = $parent.children('.js-bg');
    window.clearTimeout(+$item.attr('data-timer'));
    $item.css('height', `${$bg.outerHeight()}px`);
    $item.attr('data-timer', setTimeout(function () {
      $item.removeAttr('style');
      $bg.remove();
      $btns.removeAttr('style');
    }, 3e2));
  });
  const tryDecodeURIComponent = str => {
    try {
      return decodeURIComponent(str);
    } catch (e) {
      return str;
    }
  };
  const judgePageType = () => {
    const pageType = window.SL_State.get('templateAlias');
    const title = window.SL_State.get('sortation.sortation.title');
    if (pageType === 'Products') {
      let {
        pathname
      } = window.location;
      const {
        search
      } = window.location;
      let collectionName = '';
      if (title) {
        collectionName = title;
      } else {
        collectionName = 'All Products';
      }
      if (window.Shopline.routes && window.Shopline.routes.root && window.Shopline.routes.root !== '/') {
        const root = `/${window.Shopline.routes.root.replace(/\//g, '')}`;
        pathname = pathname.replace(root, '');
      }
      if (pathname === '/collections/types' || pathname === '/collections/brands') {
        collectionName = tryDecodeURIComponent(pathname.replace('/collections/', '') + search);
      } else {
        const pathnameArr = pathname.split('/');
        if (pathnameArr[pathnameArr.length - 1] === '') {
          pathnameArr.pop();
        }
        if (pathnameArr[1] === 'collections' && pathnameArr.length === 4) {
          collectionName += tryDecodeURIComponent(pathname.replace('/collections/', '') + search);
        }
      }
      return collectionName;
    }
    if (pageType === 'ProductsSearch') {
      return 'Search Result';
    }
  };
  function thirdPartReport({
    id,
    name,
    price,
    index,
    customCategoryName
  }) {
    const listName = judgePageType();
    window.SL_EventBus.emit('global:thirdPartReport', {
      GA: [['event', 'select_content', {
        content_type: 'product',
        currency: getCurrencyCode(),
        items: [{
          id,
          name,
          currency: getCurrencyCode(),
          price: convertPrice(price),
          list_name: listName,
          list_position: index,
          category: customCategoryName
        }]
      }]],
      GA4: [['event', 'select_content', {
        content_type: 'product',
        item_id: id
      }], ['event', 'select_item', {
        currency: getCurrencyCode(),
        items: [{
          item_id: id,
          item_name: name,
          price: convertPrice(price),
          currency: getCurrencyCode(),
          item_list_name: listName,
          index,
          item_category: customCategoryName
        }]
      }]]
    });
  }
  function reportClickProduct(id) {
    const pageType = window.SL_State.get('template');
    if (pageType === 'collection') {
      window.HdSdk && window.HdSdk.shopTracker.report('60006260', {
        event_name: '130',
        product_id: id
      });
    }
  }
  $(document.body).on('click', '.product-item', function () {
    const item = $(this);
    const isRecentlyProduct = item.hasClass('__sl-custom-track-product-recently-viewed-item');
    const isSearchProduct = item.hasClass('__sl-custom-track-product-item-search');
    const isRecommendProduct = item.hasClass('__sl-custom-track-product-recommend-item');
    if (!isSearchProduct && !isRecentlyProduct && !isRecommendProduct) {
      hdReport.itemSelect({
        productInfo: item.data()
      });
    }
    thirdPartReport({
      id: $(this).data('skuId'),
      name: $(this).data('name'),
      price: $(this).data('price'),
      index: $(this).data('index') + 1,
      customCategoryName: $(this).data('custom-category-name')
    });
    reportClickProduct(item.data('id'));
  });
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/pre-bundle.js'] = window.SLM['commons/pre-bundle.js'] || function () {
  const _exports = {};
  const register = window['SLM']['theme-shared/events/trade/developer-api/index.js'].default;
  const registerCustomerEvents = window['SLM']['theme-shared/events/customer/developer-api/index.js'].default;
  const dataReport = window['SLM']['theme-shared/utils/dataReport/index.js'].default;
  const { setSyncData } = window['SLM']['theme-shared/utils/dataAccessor.js'];
  const { ApiCart } = window['@sl/cart']['/lib/api-cart'];
  register('Cart::GetCartId', 'Cart::NavigateCart', 'Checkout::NavigateCheckout', 'Cart::AddToCart', 'Cart::ControlCartBasis', 'Cart::CartDetailUpdate', 'Cart::LineItemUpdate');
  registerCustomerEvents('Customer::LoginModal', 'Customer::Register');
  dataReport && dataReport.listen && dataReport.listen('DataReport::AddToCart');
  setSyncData({
    orderFrom: 'web'
  });
  window.ApiCartAddV2 = ApiCart.ApiCartAddV2;
  ApiCart.initInterceptorAjaxAddToCart();
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/sectionsLoad/index.js'] = window.SLM['theme-shared/utils/sectionsLoad/index.js'] || function () {
  const _exports = {};
  class SectionsLoad {
    constructor() {
      this.sectionInstances = new Map();
      this.constructorMap = new Map();
      window.document.addEventListener('shopline:section:load', this._onSectionLoad.bind(this));
      window.document.addEventListener('shopline:section:unload', this._onSectionUnload.bind(this));
      window.document.addEventListener('shopline:section:select', this._onSectionSelect.bind(this));
      window.document.addEventListener('shopline:section:deselect', this._onSectionDeselect.bind(this));
      window.document.addEventListener('shopline:block:select', this._onBlockSelect.bind(this));
      window.document.addEventListener('shopline:block:deselect', this._onBlockDeselect.bind(this));
    }
    _createInstace(container, constructorParam) {
      const id = container.data('section-id');
      if (!id) return;
      const constructor = constructorParam || this.constructorMap.get(container.data('section-type'));
      if (typeof constructor !== 'function') return;
      this.sectionInstances.set(id, new constructor(container));
    }
    _onSectionLoad(e) {
      const {
        sectionId
      } = e.detail;
      if (this.sectionInstances.has(sectionId)) {
        const instance = this.sectionInstances.get(sectionId);
        if (typeof instance.onUnload === 'function') {
          instance.onUnload.call(instance);
        }
      }
      const $container = $(`[data-section-id='${sectionId}']`);
      if ($container.length) {
        this._createInstace($container);
      }
    }
    _onSectionUnload(e) {
      const {
        sectionId
      } = e.detail;
      if (this.sectionInstances.has(sectionId)) {
        const instance = this.sectionInstances.get(sectionId);
        if (typeof instance.onUnload === 'function') {
          instance.onUnload.call(instance);
          this.sectionInstances.delete(sectionId);
        }
      }
    }
    _onSectionSelect(e) {
      const {
        sectionId
      } = e.detail;
      if (this.sectionInstances.has(sectionId)) {
        const instance = this.sectionInstances.get(sectionId);
        if (typeof instance.onSectionSelect === 'function') {
          instance.onSectionSelect(e);
        }
      }
    }
    _onSectionDeselect(e) {
      const {
        sectionId
      } = e.detail;
      if (this.sectionInstances.has(sectionId)) {
        const instance = this.sectionInstances.get(sectionId);
        if (typeof instance.onSectionDeselect === 'function') {
          instance.onSectionDeselect(e);
        }
      }
    }
    _onBlockSelect(e) {
      const {
        sectionId
      } = e.detail;
      if (this.sectionInstances.has(sectionId)) {
        const instance = this.sectionInstances.get(sectionId);
        if (typeof instance.onBlockSelect === 'function') {
          instance.onBlockSelect(e);
        }
      }
    }
    _onBlockDeselect(e) {
      const {
        sectionId
      } = e.detail;
      if (this.sectionInstances.has(sectionId)) {
        const instance = this.sectionInstances.get(sectionId);
        if (typeof instance.onBlockDeselect === 'function') {
          instance.onBlockDeselect(e);
        }
      }
    }
  }
  window.__section_load__ = new SectionsLoad();
  const registrySectionConstructor = (type, constructor) => {
    if (window.__section_load__.constructorMap.get(type)) return;
    window.__section_load__.constructorMap.set(type, constructor);
    const $sections = $(`[data-section-type='${type}']`);
    $sections.each(function () {
      const $container = $(this);
      window.__section_load__._createInstace($container, constructor);
    });
  };
  _exports.registrySectionConstructor = registrySectionConstructor;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/layout/theme/mod/parallax.js'] = window.SLM['commons/layout/theme/mod/parallax.js'] || function () {
  const _exports = {};
  let parallaxContainers = $('.parallax-container');
  let parallaxListener;
  function onScroll() {
    requestAnimationFrame(scrollHandler.bind(this));
  }
  function scrollHandler() {
    const viewPortHeight = $(window).height();
    parallaxContainers.each((index, el) => {
      const parallaxImage = $(el).find('.parallax');
      const hasClass = $(el).hasClass('large-image-with-text-box--loaded');
      const isLargeImageText = $(el).hasClass('large-image-with-text-box');
      if (parallaxImage.length === 0) {
        if (!isLargeImageText) return;
        if (!hasClass) $(el).addClass('large-image-with-text-box--loaded');
        return;
      }
      const {
        top,
        height
      } = el.getBoundingClientRect();
      if (top > viewPortHeight || top <= -height) return;
      const speed = 2;
      const movableDistance = viewPortHeight + height;
      const currentDistance = viewPortHeight - top;
      const percent = (currentDistance / movableDistance * speed * 38).toFixed(2);
      const num = 38 - Number(percent);
      $(parallaxImage).css('transform', `translate3d(0 , ${-num}% , 0)`);
      if (!isLargeImageText) return;
      if (!hasClass) {
        $(el).addClass('large-image-with-text-box--loaded');
      }
    });
  }
  function init() {
    parallaxContainers = $('.parallax-container');
    if (!parallaxListener) {
      parallaxListener = $(window).on('scroll', onScroll);
    }
    scrollHandler();
  }
  window.SL_EventBus.on('parallax', () => {
    init();
  });
  window.document.addEventListener('shopline:section:load', () => {
    init();
  });
  window.document.addEventListener('shopline:section:reorder', () => {
    init();
  });
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/report/common/inputReport.js'] = window.SLM['theme-shared/report/common/inputReport.js'] || function () {
  const _exports = {};
  const { findSectionId } = window['SLM']['theme-shared/report/common/baseReport.js'];
  class InputReport {
    constructor({
      selector,
      params
    }) {
      this.$el = $(selector);
      this.params = params;
      this.changed = false;
      this.init();
    }
    init() {
      this.bindInput();
      this.bindBlur();
    }
    bindInput() {
      this.$el.on('input', () => {
        this.changed = true;
      });
    }
    bindBlur() {
      this.$el.on('blur', e => {
        if (!this.changed || !window.HdSdk) {
          return;
        }
        const params = {
          ...this.params,
          component_ID: findSectionId(e.target)
        };
        window.HdSdk.shopTracker.collect(params);
        this.changed = false;
      });
    }
  }
  _exports.InputReport = InputReport;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/report/common/hoverReport.js'] = window.SLM['theme-shared/report/common/hoverReport.js'] || function () {
  const _exports = {};
  const { findSectionId } = window['SLM']['theme-shared/report/common/baseReport.js'];
  class HoverReport {
    constructor({
      selector,
      params
    }) {
      this.$el = $(selector);
      this.params = params;
      this.init();
    }
    init() {
      this.bindMouseenter();
    }
    bindMouseenter() {
      this.$el.on('mouseenter', e => {
        const $target = $(e.target);
        const isTarget = $target.attr('class') === this.$el.attr('class');
        if (!isTarget) {
          return;
        }
        const params = {
          ...this.params,
          component_ID: findSectionId(e.target)
        };
        window.HdSdk && window.HdSdk.shopTracker.collect(params);
        this.changed = false;
      });
    }
  }
  _exports.HoverReport = HoverReport;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/report/stage/index.js'] = window.SLM['theme-shared/report/stage/index.js'] || function () {
  const _exports = {};
  const { BaseReport, findSectionId } = window['SLM']['theme-shared/report/common/baseReport.js'];
  const { InputReport } = window['SLM']['theme-shared/report/common/inputReport.js'];
  const { HoverReport } = window['SLM']['theme-shared/report/common/hoverReport.js'];
  const { sectionTypeEnum } = window['SLM']['theme-shared/report/stage/const.js'];
  class StageReport extends BaseReport {
    constructor() {
      super();
      this.defaultParams = {
        current_source_page: BaseReport.getPage()
      };
      this.inputReportMap = {};
      this.hoverReportMap = {};
    }
    click(params) {
      super.click({
        ...this.defaultParams,
        ...params
      });
    }
    expose({
      selector,
      moreInfo
    }) {
      const $els = $(selector);
      if (!$els.length) {
        return;
      }
      const paramsFn = target => {
        const id = findSectionId(target);
        const params = {
          component_ID: id,
          ...this.defaultParams,
          ...moreInfo
        };
        return params;
      };
      const view = {
        reportOnce: true,
        threshold: 0,
        params: paramsFn
      };
      const viewSuccess = {
        reportOnce: true,
        threshold: 0.5,
        duration: 500,
        params: paramsFn
      };
      BaseReport.expose({
        targetList: document.querySelectorAll(selector),
        view,
        viewSuccess
      });
    }
    bindFallbackClick({
      wrapperSel,
      targetSel,
      fallbackSel,
      moreInfo
    }) {
      $(wrapperSel).on('click', e => {
        const id = findSectionId(e.target);
        const params = {
          component_ID: id,
          ...this.defaultParams,
          ...moreInfo
        };
        const $target = $(e.target);
        const $wrapper = $target.closest(wrapperSel);
        const hasTarget = $wrapper.find(targetSel).length > 0;
        const clickOnTarget = $target.closest(targetSel).length > 0;
        const clickOnFallback = $target.closest(fallbackSel).length > 0;
        if (hasTarget && !clickOnTarget) {
          return;
        }
        if (!hasTarget && clickOnFallback) {
          this.click(params);
          return;
        }
        if (clickOnTarget) {
          this.click(params);
        }
      });
    }
    bindClick({
      selector,
      moreInfo,
      customHandler
    }) {
      if (!selector) {
        return;
      }
      $(document.body).on('click', selector, e => {
        const id = findSectionId(e.target);
        const params = {
          component_ID: id,
          ...this.defaultParams,
          ...moreInfo
        };
        if (customHandler) {
          customHandler(e, params);
        } else {
          this.click(params);
        }
      });
    }
    bindInput({
      selector,
      type = '',
      moreInfo
    }) {
      const params = {
        ...this.defaultParams,
        module_type: sectionTypeEnum[type] || type,
        action_type: 103,
        event_name: 'Input',
        ...moreInfo
      };
      const instance = new InputReport({
        selector,
        params
      });
      this.inputReportMap[selector] = instance;
    }
    bindHover({
      selector,
      type = ''
    }) {
      const params = {
        ...this.defaultParams,
        module_type: sectionTypeEnum[type] || type,
        action_type: 109,
        event_name: 'Hover'
      };
      const instance = new HoverReport({
        selector,
        params
      });
      this.hoverReportMap[selector] = instance;
    }
    collect(params) {
      window.HdSdk && window.HdSdk.shopTracker.collect({
        ...this.defaultParams,
        ...params
      });
    }
  }
  _exports.StageReport = StageReport;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/report/stage/virtualReport.js'] = window.SLM['theme-shared/report/stage/virtualReport.js'] || function () {
  const _exports = {};
  const { StageReport } = window['SLM']['theme-shared/report/stage/index.js'];
  const { virtualComponentEnum, sectionTypeEnum, virtualPageEnum } = window['SLM']['theme-shared/report/stage/const.js'];
  class VirtualReport extends StageReport {
    constructor() {
      super();
      this.defaultParams = {
        ...this.defaultParams,
        module: -999,
        component: -999,
        page: virtualPageEnum.fixedSction
      };
      this.headerElementSelector = {
        header: '.__sl-custom-track-stage-header',
        btnUser: '.__sl-custom-track-stage-header-user',
        btnCart: '.__sl-custom-track-stage-header-cart',
        btnSearch: '.__sl-custom-track-stage-header-search',
        announcementItem: '.__sl-custom-track-stage-header-announcementItem',
        newsletter: '.__sl-custom-track-stage-header-newsletter',
        btnNewsletter: '.__sl-custom-track-stage-header-newsletter-button',
        inputNewsletter: '.__sl-custom-track-stage-header-newsletter-input',
        searchSuggest: '.__sl-custom-track-stage-header-suggest-list',
        searchSuggestItem: '.__sl-custom-track-stage-header-suggest-list li'
      };
      this.footerElementSelector = {
        footer: '.__sl-custom-track-stage-footer',
        newsletter: '.__sl-custom-track-stage-footer-newsletter',
        btnNewsletter: '.__sl-custom-track-stage-footer-newsletter-button',
        inputNewsletter: '.__sl-custom-track-stage-footer-newsletter-input'
      };
      this.footerPromotionSelector = {
        footerPromotion: '.__sl-custom-track-stage-footerPromotion'
      };
      this.socialElementSelectorPrefix = '__sl-custom-track-stage-social-';
      this.commonElementSelector = {
        navItem: '.__sl-custom-track-stage-navItem',
        locale: '.__sl-custom-track-stage-locale',
        currency: '.__sl-custom-track-stage-currency'
      };
      this.suggestListShow = false;
    }
    inFooter(e) {
      const $target = $(e.target);
      const $footer = $target.closest(this.footerElementSelector.footer);
      const flag = $footer.length > 0;
      return flag;
    }
    bindHeaderReport() {
      const selMap = this.headerElementSelector;
      this.expose({
        selector: selMap.header,
        moreInfo: {
          module_type: sectionTypeEnum.header
        }
      });
      this.bindClick({
        selector: selMap.btnSearch,
        moreInfo: {
          component: virtualComponentEnum.search
        }
      });
      this.bindClick({
        selector: selMap.btnUser,
        moreInfo: {
          component: virtualComponentEnum.user
        }
      });
      this.bindClick({
        selector: selMap.btnCart,
        moreInfo: {
          component: virtualComponentEnum.cart
        }
      });
      this.bindClick({
        selector: selMap.announcementItem,
        moreInfo: {
          component: virtualComponentEnum.announcement
        }
      });
      this.bindSearchSuggestReport();
    }
    bindSocialReport() {
      const prefix = this.socialElementSelectorPrefix;
      this.bindClick({
        selector: 'a[href]',
        customHandler: (e, params) => {
          const $socialItem = $(e.currentTarget);
          const cls = $socialItem && $socialItem.attr('class') || '';
          const hasClass = cls.indexOf(prefix) >= 0;
          if (!$socialItem.length || !hasClass) {
            return;
          }
          const {
            classList
          } = $socialItem[0];
          const sel = Array.prototype.find.call(classList, cls => cls.startsWith(prefix));
          const social_media_type = sel.replace(prefix, '');
          const data = {
            ...params,
            social_media_type,
            component: virtualComponentEnum.socialItem,
            module_type: this.inFooter(e) ? sectionTypeEnum.footer : sectionTypeEnum.header
          };
          this.click(data);
        }
      });
    }
    bindNavReport() {
      this.bindClick({
        selector: this.commonElementSelector.navItem,
        customHandler: (e, params) => {
          const data = {
            ...params,
            component: virtualComponentEnum.navItem,
            module_type: this.inFooter(e) ? sectionTypeEnum.footer : sectionTypeEnum.header
          };
          this.click(data);
        }
      });
    }
    bindLocaleCurrencyReport() {
      this.bindClick({
        selector: this.commonElementSelector.locale,
        customHandler: (e, params) => {
          const data = {
            ...params,
            component: virtualComponentEnum.locale,
            module_type: this.inFooter(e) ? sectionTypeEnum.footer : sectionTypeEnum.header
          };
          this.click(data);
        }
      });
      this.bindClick({
        selector: this.commonElementSelector.currency,
        customHandler: (e, params) => {
          const data = {
            ...params,
            component: virtualComponentEnum.currency,
            module_type: this.inFooter(e) ? sectionTypeEnum.footer : sectionTypeEnum.header
          };
          this.click(data);
        }
      });
    }
    bindFooterReport() {
      this.expose({
        selector: this.footerElementSelector.footer,
        moreInfo: {
          module_type: sectionTypeEnum.footer
        }
      });
      this.bindFooterNewsLetter();
    }
    bindFooterPromotionReport() {
      this.expose({
        selector: this.footerPromotionSelector.footerPromotion,
        moreInfo: {
          module_type: sectionTypeEnum['footer-promotion']
        }
      });
    }
    bindFooterNewsLetter() {
      const component = virtualComponentEnum.newsletter;
      this.expose({
        selector: this.footerElementSelector.newsletter,
        moreInfo: {
          component
        }
      });
      this.bindClick({
        selector: this.footerElementSelector.btnNewsletter,
        moreInfo: {
          component
        }
      });
      this.bindInput({
        selector: this.footerElementSelector.inputNewsletter,
        moreInfo: {
          component
        }
      });
    }
    bindHeaderNewsLetter() {
      const component = virtualComponentEnum.newsletter;
      this.expose({
        selector: this.headerElementSelector.newsletter,
        moreInfo: {
          component
        }
      });
      this.bindClick({
        selector: this.headerElementSelector.btnNewsletter,
        moreInfo: {
          component
        }
      });
      this.bindInput({
        selector: this.headerElementSelector.inputNewsletter,
        moreInfo: {
          component
        }
      });
    }
    reportSelectLang(e, lang) {
      const params = {
        module_type: this.inFooter(e) ? sectionTypeEnum.footer : sectionTypeEnum.header,
        component: virtualComponentEnum.localeItem,
        language_type: lang
      };
      this.click(params);
    }
    reportSelectCurrency(e, currency) {
      const params = {
        module_type: this.inFooter(e) ? sectionTypeEnum.footer : sectionTypeEnum.header,
        component: virtualComponentEnum.currencyItem,
        currency_type: currency
      };
      this.click(params);
    }
    reportSearch(searchWord) {
      this.collect({
        component: virtualComponentEnum.search,
        event_name: 'Search',
        search_term: searchWord
      });
    }
    reportSearchSuggestItem(show) {
      const shouldView = !this.suggestListShow && show;
      if (shouldView) {
        this.collect({
          component: virtualComponentEnum.searchSuggest,
          event_name: 'View',
          action_type: 101
        });
      }
      this.suggestListShow = show;
    }
    bindSearchSuggestReport() {
      this.bindClick({
        selector: this.headerElementSelector.searchSuggestItem,
        moreInfo: {
          component: virtualComponentEnum.searchSuggest
        }
      });
    }
  }
  _exports.VirtualReport = VirtualReport;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/report/virtualReport.js'] = window.SLM['commons/report/virtualReport.js'] || function () {
  const _exports = {};
  const { VirtualReport } = window['SLM']['theme-shared/report/stage/virtualReport.js'];
  const virtualReport = new VirtualReport();
  function initVirtualReport() {
    $(() => {
      virtualReport.bindHeaderReport();
      virtualReport.bindFooterReport();
      virtualReport.bindFooterPromotionReport();
      virtualReport.bindSocialReport();
      virtualReport.bindNavReport();
      virtualReport.bindLocaleCurrencyReport();
    });
  }
  _exports.initVirtualReport = initVirtualReport;
  _exports.default = virtualReport;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/layout/theme/index.js'] = window.SLM['commons/layout/theme/index.js'] || function () {
  const _exports = {};
  const { initVirtualReport } = window['SLM']['commons/report/virtualReport.js'];
  initVirtualReport();
  return _exports;
}();