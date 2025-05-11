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
window.SLM['theme-shared/biz-com/sales/cart-slot/helpers/getCartItemId.js'] = window.SLM['theme-shared/biz-com/sales/cart-slot/helpers/getCartItemId.js'] || function () {
  const _exports = {};
  const getCartItemId = (item = {}, isMiniCart = false) => {
    const {
      groupId,
      spuId,
      skuId,
      uniqueSeq
    } = item;
    return `${isMiniCart ? 'sidebar' : 'main'}-card-sku-item-${groupId}-${spuId}-${skuId}-${uniqueSeq}`;
  };
  _exports.default = getCartItemId;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/sales/cart-slot/free-shipping/index.js'] = window.SLM['theme-shared/biz-com/sales/cart-slot/free-shipping/index.js'] || function () {
  const _exports = {};
  const render = (cartBannerStyle = {}) => {
    const run = () => {};
    return {
      html: `<span class="discount-sale__free-shipping notranslate" style="color: ${cartBannerStyle.discountTextColor}; background-color: ${cartBannerStyle.bannerBgColor};">
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.39267 5.35679C1.39267 5.1201 1.58455 4.92822 1.82125 4.92822H3.74982C3.98651 4.92822 4.17839 5.1201 4.17839 5.35679C4.17839 5.59349 3.98651 5.78537 3.74982 5.78537H1.82125C1.58455 5.78537 1.39267 5.59349 1.39267 5.35679Z" fill="currentColor"/>
      <path d="M0.749817 7.07108C0.749817 6.83439 0.941695 6.64251 1.17839 6.64251H3.74982C3.98651 6.64251 4.17839 6.83439 4.17839 7.07108C4.17839 7.30777 3.98651 7.49965 3.74982 7.49965H1.17839C0.941695 7.49965 0.749817 7.30777 0.749817 7.07108Z" fill="currentColor"/>
      <path d="M8.46379 2.78571C8.46379 2.54902 8.65567 2.35714 8.89236 2.35714H11.9281C12.1082 2.35714 12.269 2.46972 12.3307 2.63892L13.5807 6.06749C13.6618 6.28986 13.5472 6.53586 13.3249 6.61693C13.1025 6.69801 12.8565 6.58346 12.7754 6.36108L11.6282 3.21429H8.89236C8.65567 3.21429 8.46379 3.02241 8.46379 2.78571Z" fill="currentColor"/>
      <path d="M2.03522 1.92857C2.03522 1.69188 2.2271 1.5 2.46379 1.5H8.58984C8.82653 1.5 9.01841 1.69188 9.01841 1.92857V6.02663H14.0352C14.2719 6.02663 14.4638 6.21851 14.4638 6.4552V10.9286C14.4638 11.1653 14.2719 11.3571 14.0352 11.3571H2.46379C2.2271 11.3571 2.03522 11.1653 2.03522 10.9286V9.27768C2.03522 9.04099 2.2271 8.84911 2.46379 8.84911C2.70048 8.84911 2.89236 9.04099 2.89236 9.27768V10.5H13.6066V6.88377H8.58984C8.35315 6.88377 8.16127 6.69189 8.16127 6.4552V2.35714H2.89236V3.15342C2.89236 3.39012 2.70048 3.582 2.46379 3.582C2.2271 3.582 2.03522 3.39012 2.03522 3.15342V1.92857Z" fill="currentColor"/>
      <path d="M5.2495 11.3571C4.89446 11.3571 4.60665 11.645 4.60665 12C4.60665 12.355 4.89446 12.6429 5.2495 12.6429C5.60454 12.6429 5.89236 12.355 5.89236 12C5.89236 11.645 5.60454 11.3571 5.2495 11.3571ZM3.7495 12C3.7495 11.1716 4.42108 10.5 5.2495 10.5C6.07793 10.5 6.7495 11.1716 6.7495 12C6.7495 12.8284 6.07793 13.5 5.2495 13.5C4.42108 13.5 3.7495 12.8284 3.7495 12Z" fill="currentColor"/>
      <path d="M11.2495 11.3571C10.8945 11.3571 10.6066 11.645 10.6066 12C10.6066 12.355 10.8945 12.6429 11.2495 12.6429C11.6045 12.6429 11.8924 12.355 11.8924 12C11.8924 11.645 11.6045 11.3571 11.2495 11.3571ZM9.7495 12C9.7495 11.1716 10.4211 10.5 11.2495 10.5C12.0779 10.5 12.7495 11.1716 12.7495 12C12.7495 12.8284 12.0779 13.5 11.2495 13.5C10.4211 13.5 9.7495 12.8284 9.7495 12Z" fill="currentColor"/>
      </svg>
      Free Shipping
    </span>
  `,
      run
    };
  };
  _exports.default = render;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/sales/cart-slot/index.js'] = window.SLM['theme-shared/biz-com/sales/cart-slot/index.js'] || function () {
  const _exports = {};
  const getCartItemId = window['SLM']['theme-shared/biz-com/sales/cart-slot/helpers/getCartItemId.js'].default;
  const freeShippingRender = window['SLM']['theme-shared/biz-com/sales/cart-slot/free-shipping/index.js'].default;
  const SlotCartSaleClass = 'slot-cart-sale';
  const SlotAttr = `[data-slot-cart-item-info]`;
  const MiniSlotAttr = `[data-slot-mini-cart-item-info]`;
  const FREE_SHIPPING_TYPE = 'FREE_SHIPPING';
  const getCartItem = (item = {}, isMiniCart = undefined) => {
    return document.getElementById(getCartItemId(item, isMiniCart));
  };
  const getSaleSlot = (item = {}, isMiniCart = undefined) => {
    const itemEle = getCartItem(item, isMiniCart);
    if (!itemEle) return;
    const slotEle = itemEle.querySelector(isMiniCart ? MiniSlotAttr : SlotAttr);
    if (!slotEle) return;
    let salesEle = slotEle.querySelector(`.${SlotCartSaleClass}`);
    if (!salesEle) {
      salesEle = document.createElement('span');
      salesEle.className = SlotCartSaleClass;
      slotEle.prepend(salesEle);
    }
    return salesEle;
  };
  const render = (cartInfo = {}, callback = undefined) => {
    if (cartInfo.activeItems && cartInfo.activeItems.length) {
      cartInfo.activeItems.forEach(({
        itemList,
        promotion
      }) => {
        const newPromotion = promotion;
        if (newPromotion) {
          try {
            if (typeof promotion.saleExtInfo === 'string') {
              newPromotion.saleExtInfo = JSON.parse(promotion.saleExtInfo);
            }
          } catch (e) {
            console.warn('json.parse saleExtInfo value err:', e);
          }
        }
        itemList.forEach(item => {
          const main = getSaleSlot(item, false);
          if (callback && main) {
            const html = callback(item, main, newPromotion, false);
            if (typeof html === 'string') {
              main.innerHTML = html;
            }
          }
          const mini = getSaleSlot(item, true);
          if (callback && mini) {
            const html = callback(item, mini, newPromotion, true);
            if (typeof html === 'string') {
              mini.innerHTML = html;
            }
          }
        });
      });
    }
  };
  _exports.default = cartInfo => {
    render(cartInfo, (item, ele, promotion) => {
      if (item.salesInfoToShow instanceof Array) {
        let completeHTML = '';
        const {
          saleExtInfo
        } = promotion || {};
        const {
          cartBannerStyle
        } = saleExtInfo || {};
        item.salesInfoToShow.forEach(info => {
          let result = info;
          try {
            result = JSON.parse(info);
          } catch (err) {
            console.error(err);
          }
          if (result && result.tagType === FREE_SHIPPING_TYPE) {
            const freeShipping = freeShippingRender(cartBannerStyle || {});
            completeHTML += freeShipping.html;
          }
        });
        ele.innerHTML = completeHTML;
      }
    });
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/biz/sales/index.js'] = window.SLM['cart/script/biz/sales/index.js'] || function () {
  const _exports = {};
  const slotRender = window['SLM']['theme-shared/biz-com/sales/cart-slot/index.js'].default;
  const CartControlCartBasis = 'Cart::ControlCartBasis';
  const CartCartDetailUpdate = 'Cart::CartDetailUpdate';
  const init = function () {
    try {
      const handleCartUpdate = data => {
        if (data) {
          setTimeout(() => {
            slotRender(data);
          });
        }
      };
      window.Shopline.event.emit(CartControlCartBasis, {
        data: {
          cartDetail: true
        },
        onSuccess: handleCartUpdate
      });
      window.Shopline.event.on(CartCartDetailUpdate, handleCartUpdate);
      return true;
    } catch (err) {
      console.error(err);
    }
  };
  window.__CART_SALE_JS_LOADED = window.__CART_SALE_JS_LOADED || init();
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
window.SLM['theme-shared/components/hbs/shared/components/topDrawer/index.js'] = window.SLM['theme-shared/components/hbs/shared/components/topDrawer/index.js'] || function () {
  const _exports = {};
  const Base = window['SLM']['theme-shared/components/hbs/shared/base/BaseClass.js'].default;
  const { DRAWER_EVENT_NAME, DRAWER_CALLBACK_EVENT_NAME, DRAWER_OPERATORS } = window['SLM']['theme-shared/components/hbs/shared/components/topDrawer/const.js'];
  const animationTime = 300;
  class TopDrawer extends Base {
    constructor(id, options = {}) {
      super();
      const {
        closeBtnSelector = '.j-top-drawer-close'
      } = options;
      this.config = {
        namespace: `stage:global-top-drawer_id:${id}`
      };
      this.classes = {
        active: 'top-drawer--open',
        fullscreen: 'top-drawer--full'
      };
      this.selector = {
        drawerContainer: '.stage-top-drawer',
        drawerContent: '.top-drawer__container',
        closeButton: closeBtnSelector
      };
      this.attr = {
        openDrawer: 'data-open_topDrawer'
      };
      this.id = id;
      this.options = options;
      this.closeFlag = true;
      this.$setNamespace(this.config.namespace);
      this.init();
    }
    init() {
      this.openTimer = null;
      this.closeTimer = null;
      this.bindClickMask();
      this.listenEvent();
      this.bindClickClose();
      this.bindClickOutside();
      this.setupFullScreen();
      this.stopPropagation();
    }
    get isOpen() {
      return this.$root.hasClass(this.classes.active);
    }
    get $body() {
      return $('body');
    }
    get $root() {
      return $(`#${this.id}`);
    }
    setupFullScreen() {
      if (this.options.fullScreen) {
        this.$root.addClass(this.classes.fullscreen);
      }
    }
    open({
      disablePageScroll = false
    } = {}) {
      if (this.isOpen) {
        return;
      }
      this.ignoreClickOutside();
      clearTimeout(this.closeTimer);
      this.$root.css('display', 'block');
      this.openTimer = setTimeout(() => {
        if (!this.options.fullScreen) {
          this.$root.find('.top-drawer__mask').hide();
        }
        this.$root.addClass(this.classes.active);
        if (this.options.fullScreen || disablePageScroll) {
          this.disablePageScroll();
        }
      }, 0);
    }
    close() {
      this.$root.removeClass(this.classes.active);
      this.enablePageScroll();
      this.closeTimer = setTimeout(() => {
        this.$root.css('display', 'none');
      }, animationTime);
    }
    ignoreClickOutside() {
      this.closeFlag = false;
      setTimeout(() => {
        this.closeFlag = true;
      }, 0);
    }
    bindClickOutside() {
      this.$on('click', e => {
        if (!this.closeFlag) {
          return;
        }
        const $container = $(e.target).closest(`#${this.id}`);
        const isOutside = $container.length === 0;
        if (this.isOpen && isOutside) {
          window.SL_EventBus.emit(DRAWER_EVENT_NAME, {
            operator: DRAWER_OPERATORS.CLOSE,
            id: this.id
          });
        }
      });
    }
    stopPropagation() {
      this.$on('click', `#${this.id}`, e => {
        e.stopPropagation();
      });
    }
    bindClickClose() {
      this.$on('click', `#${this.id} ${this.selector.closeButton}`, () => {
        this.close();
      });
    }
    bindClickMask() {
      this.$on('click', `#${this.id} .top-drawer__mask`, () => {
        this.close();
      });
    }
    listenEvent() {
      window.SL_EventBus.on(DRAWER_EVENT_NAME, res => {
        const {
          id,
          operator,
          option = {}
        } = res;
        if (id !== this.id) {
          return;
        }
        if (operator === DRAWER_OPERATORS.OPEN) {
          this.open(option);
        }
        if (operator === DRAWER_OPERATORS.CLOSE) {
          this.close();
        }
        window.SL_EventBus.emit(DRAWER_CALLBACK_EVENT_NAME, {
          status: operator,
          id
        });
      });
    }
    disablePageScroll() {
      const openDrawers = this.$body.attr(this.attr.openDrawer);
      const list = openDrawers ? openDrawers.split(' ') : [];
      if (!list.includes(this.id)) {
        list.push(this.id);
      }
      this.$body.attr(this.attr.openDrawer, list.join(' '));
    }
    enablePageScroll() {
      const openDrawers = this.$body.attr(this.attr.openDrawer);
      const list = openDrawers ? openDrawers.split(' ') : [];
      const index = list.indexOf(this.id);
      if (index >= 0) {
        list.splice(index, 1);
      }
      if (list.length) {
        this.$body.attr(this.attr.openDrawer, list.join(' '));
      } else {
        this.$body.removeAttr(this.attr.openDrawer);
      }
    }
    setMaxHeight(height) {
      this.$root.find(this.selector.drawerContent).css('max-height', height);
    }
    setWidth(width) {
      this.$root.find(this.selector.drawerContent).css('width', width);
    }
  }
  _exports.default = TopDrawer;
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
window.SLM['theme-shared/components/pay-button/additional-button/constants.js'] = window.SLM['theme-shared/components/pay-button/additional-button/constants.js'] || function () {
  const _exports = {};
  const CHECKOUT_CLASS_NAME = 'pay-button-checkout';
  _exports.CHECKOUT_CLASS_NAME = CHECKOUT_CLASS_NAME;
  const ECartUpdate = 'Cart::CartDetailUpdate';
  _exports.ECartUpdate = ECartUpdate;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/additional-button/utils.js'] = window.SLM['theme-shared/components/pay-button/additional-button/utils.js'] || function () {
  const _exports = {};
  const { checkoutHiidoReportV2, preProcessPaymentButtonConfig } = window['@sl/pay-button'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { ButtonLocation, ButtonType } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const isStandard = () => {
    const pageData = SL_State.get('paymentButtonConfig');
    if (!pageData || !pageData.buttonLocationDataList) return true;
    if (!pageData.grayscaleButtonLocation) return false;
    return pageData.grayscaleButtonLocation.includes(ButtonLocation.Cart);
  };
  _exports.isStandard = isStandard;
  const getPaymentConfig = () => {
    const pageData = preProcessPaymentButtonConfig(SL_State.get('paymentButtonConfig'));
    if (!pageData || !pageData.buttonLocationDataList) return null;
    const config = pageData.buttonLocationDataList.find(item => {
      return item.buttonLocation === ButtonLocation.Cart;
    });
    if (!config) return null;
    const newConfig = {
      ...config
    };
    newConfig.buttonTypeDataList = newConfig.buttonTypeDataList.filter(item => item.buttonType !== ButtonType.Normal);
    newConfig.buttonTraceId = pageData.buttonTraceId;
    return newConfig;
  };
  _exports.getPaymentConfig = getPaymentConfig;
  const isSubscription = () => {
    const cartInfoSubscriptionInfo = SL_State.get('cartInfo.subscriptionInfo') || {};
    if (cartInfoSubscriptionInfo.existSubscription) return true;
    return false;
  };
  _exports.isSubscription = isSubscription;
  const reportFastCheckout = buttonName => {
    try {
      checkoutHiidoReportV2.reportFastCheckout(buttonName);
    } catch (error) {
      console.error('reportFastCheckout error: ', error);
    }
  };
  _exports.reportFastCheckout = reportFastCheckout;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/additional-button/index.js'] = window.SLM['theme-shared/components/pay-button/additional-button/index.js'] || function () {
  const _exports = {};
  const Toast = window['SLM']['theme-shared/components/hbs/shared/components/toast/index.js'].default;
  const baseLogger = window['@yy/sl-theme-shared']['/utils/logger/sentry'].default;
  const PayButton = window['@sl/pay-button']['default'];
  const { save } = window['@sl/pay-button'];
  const { ButtonName } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const { setInitialCheckoutData, getExpressCheckoutDataList, emitExpressCheckoutData, getPaymentProps } = window['SLM']['theme-shared/components/pay-button/utils.js'];
  const { CHECKOUT_CLASS_NAME, ECartUpdate } = window['SLM']['theme-shared/components/pay-button/additional-button/constants.js'];
  const { getPaymentConfig, isSubscription, reportFastCheckout } = window['SLM']['theme-shared/components/pay-button/additional-button/utils.js'];
  const toast = message => Toast.init({
    content: message
  });
  const logger = baseLogger.pipeOwner('shared.additional-button');
  class AdditionalButton {
    constructor(config) {
      logger.info('AdditionalButton init constructor', {
        config
      });
      this.config = config;
      this.isSubscription = isSubscription();
      this.cartType = config.props.cartType;
      this.expressCheckoutDataList = null;
      const {
        domId
      } = config;
      const checkoutELem = document.querySelector(`#${domId} .${CHECKOUT_CLASS_NAME}`);
      if (checkoutELem) {
        checkoutELem.addEventListener('click', this.onCheckoutClick.bind(this));
      }
      const paymentConfig = getPaymentConfig();
      if (!paymentConfig) {
        logger.error('first load paymentButtonConfig data is null');
        throw new Error('first load paymentButtonConfig data is null');
      }
      this.expressCheckoutDataList = getExpressCheckoutDataList(paymentConfig);
      const {
        getSaveAbandonOrderParams,
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
          isSubscription: this.isSubscription
        }
      };
      this.payButton = new PayButton(payButtonConfig);
    }
    async render() {
      await this.payButton.render();
      this.addSubscriptionListener();
    }
    async onCheckoutClick() {
      const {
        canContinue,
        url
      } = await this.saveAbandonedOrder(ButtonName.CHECKOUT);
      if (!canContinue) {
        return;
      }
      if (url) {
        logger.info('jump to checkout', {
          data: url
        });
        window.location.href = url;
      }
    }
    async saveAbandonedOrder(buttonName) {
      const {
        getSaveAbandonOrderParams
      } = this.config;
      const {
        products,
        discountCodes,
        useMemberPoint
      } = getSaveAbandonOrderParams();
      const restParams = {};
      const query = {};
      if (buttonName === ButtonName.PAY_PAL) {
        query.spb = true;
      }
      if (buttonName === ButtonName.SHOP_BY_FAST_CHECKOUT) {
        restParams.notSupportSubscriptionCheck = true;
      }
      logger.info('save abandon order', {
        data: {
          products,
          query,
          discountCodes,
          restParams,
          useMemberPoint,
          associateCart: true
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
        useMemberPoint,
        associateCart: true,
        toast,
        logger,
        ...restParams
      });
      if (errorType) {
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
      reportFastCheckout(buttonName);
      if ([ButtonName.PAY_PAL, ButtonName.CHECKOUT].includes(buttonName)) {
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
    addSubscriptionListener() {
      window.Shopline.event.on(ECartUpdate, async data => {
        if (data.subscriptionInfo) {
          this.payButton.setSubscription(Boolean(data.subscriptionInfo.existSubscription));
        }
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
    getButtonElement(params) {
      return this.payButton.getButtonElement(params);
    }
  }
  _exports.default = AdditionalButton;
  const { isStandard } = window['SLM']['theme-shared/components/pay-button/additional-button/utils.js'];
  _exports.isStandard = isStandard;
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
window.SLM['theme-shared/utils/template.js'] = window.SLM['theme-shared/utils/template.js'] || function () {
  const _exports = {};
  const get = window['lodash']['get'];
  const regStrFormat = regStr => {
    return regStr.replace(/([\^\$\{\}\[\]\.\?\+\*\(\)\\])/g, '\\$1');
  };
  _exports.regStrFormat = regStrFormat;
  const template = (text, data, options = {}) => {
    const {
      prefix = '${',
      suffix = '}',
      replaceAll
    } = options || {};
    const reg = new RegExp(`${regStrFormat(prefix)}\\s*(\\w+)\\s*${regStrFormat(suffix)}`, 'g');
    if (typeof text === 'string') {
      if (data && Object.keys(data).length) {
        return text.replace(reg, (o, p) => {
          const val = get(data, p);
          return !replaceAll && (typeof val === 'string' || typeof val === 'number') ? val : o;
        });
      }
      return text;
    }
    return '';
  };
  _exports.default = template;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/sales/shoppingPromotionReminder/index.js'] = window.SLM['theme-shared/components/hbs/sales/shoppingPromotionReminder/index.js'] || function () {
  const _exports = {};
  const { nullishCoalescingOperator, get } = window['SLM']['theme-shared/utils/syntax-patch.js'];
  const nc = nullishCoalescingOperator;
  const BenefitTypeEnum = {
    PRICE: 1,
    DISCOUNT: 2,
    BUY_X_GET_Y: 12,
    NTH_PRICE: 11,
    FREELOWESTPRICE: 9,
    FREESHOPPING: 3,
    NTH_FIXED_PRICE: 14
  };
  const ThresholdTypeEnum = {
    PRICE: 0,
    NUMBER: 1
  };
  const BenefitValueTypeEnum = {
    AMOUNT: '1',
    DISCOUNT: '2'
  };
  function defaultSafeString(str) {
    return str;
  }
  function getBenefitValue(benefitType, current, isNext = false, benefitValueType = null) {
    if ((benefitType === BenefitTypeEnum.PRICE || benefitValueType === BenefitValueTypeEnum.AMOUNT) && !isNext) {
      return get(current, 'amount');
    }
    if (benefitType === BenefitTypeEnum.FREELOWESTPRICE) {
      return get(current, 'benefitCount');
    }
    if (benefitType === BenefitTypeEnum.NTH_FIXED_PRICE) {
      const extMap = get(current, 'extMap');
      return isNext ? get(extMap, 'nextFixedPrice') : get(extMap, 'fixedPrice');
    }
    return get(current, 'benefit');
  }
  function shoppingPromotionReminder(currency, safeString = defaultSafeString) {
    function setWrapper(value, warper) {
      return safeString(warper ? `<span class="notranslate ${warper.class} sales__discount-follow-theme" style="font-size: 14px; font-weight: bold;${nc(warper.style, '')}"> ${value} </span>` : value);
    }
    function formatThreshold(str, types, options = {}) {
      if (str === undefined) {
        return '';
      }
      let num = Number(str) || 0;
      const thresholdType = get(types, 'thresholdType');
      const benefitType = get(types, 'benefitType');
      if (benefitType === BenefitTypeEnum.BUY_X_GET_Y && num < 0) {
        const minThreshold = get(types, 'minThreshold');
        const distance = Math.abs(num) % minThreshold;
        if (distance === 0) {
          num = Number(minThreshold);
        }
        num = distance;
      }
      if (thresholdType === ThresholdTypeEnum.NUMBER) {
        return num;
      }
      if (thresholdType === ThresholdTypeEnum.PRICE) {
        return `<span data-amount="${num}">${currency ? currency(num, options) : ''}</span>`;
      }
      return '';
    }
    function formatBenefitNum(str, props, options = {}) {
      if (str === undefined) {
        return '';
      }
      const num = Number(str) || 0;
      const benefitType = get(props, 'benefitType');
      const benefitValueType = get(props, 'benefitValueType');
      if (benefitValueType === BenefitValueTypeEnum.AMOUNT || benefitType === BenefitTypeEnum.NTH_FIXED_PRICE || benefitType === BenefitTypeEnum.PRICE) {
        return `<span data-amount="${num}">${currency ? currency(num, options) : ''}</span>`;
      }
      if (benefitValueType === BenefitValueTypeEnum.DISCOUNT || benefitType === BenefitTypeEnum.DISCOUNT || benefitType === BenefitTypeEnum.BUY_X_GET_Y || benefitType === BenefitTypeEnum.NTH_PRICE) {
        return `${100 - num}%`;
      }
      if (benefitType === BenefitTypeEnum.FREELOWESTPRICE) {
        return num;
      }
      return '';
    }
    function getShoppingReminderConfig(promotion, configs = {}, options = {}) {
      const {
        lineBreak = false,
        warper
      } = configs;
      const {
        benefitType,
        promotionBenefitList = []
      } = nc(promotion, {});
      if (promotionBenefitList.length) {
        let current;
        let next;
        let step;
        if (!get(promotionBenefitList, [1])) {
          if (promotionBenefitList[0].hit) {
            step = 3;
            current = get(promotionBenefitList, [0]);
          } else {
            step = 1;
            next = get(promotionBenefitList, [0]);
          }
        } else if (promotionBenefitList[1].hit) {
          step = 3;
          current = get(promotionBenefitList, [1]);
        } else {
          step = 2;
          current = get(promotionBenefitList, [0]);
          next = get(promotionBenefitList, [1]);
        }
        const {
          extMap = {},
          type: thresholdType
        } = current || next;
        const basePath = `sales.promotion.cart_reminder.b${benefitType}_t${thresholdType}_s${step}`;
        let completePath = basePath;
        const {
          meetThreshold,
          benefitValueType
        } = extMap;
        let extra = '';
        if (benefitType === BenefitTypeEnum.BUY_X_GET_Y) {
          if (step === 1 && meetThreshold === 'true') {
            if (Number(get(next, 'benefit')) === 0) {
              completePath = `${basePath}_achieve_free`;
              extra = '_achieve_free';
            } else {
              completePath = `${basePath}_achieve_normal`;
              extra = '_achieve_normal';
            }
          } else if (Number(get(current, 'benefit')) === 0 || Number(get(next, 'benefit')) === 0) {
            completePath = `${basePath}_free`;
            extra = '_free';
          } else {
            completePath = `${basePath}_normal`;
            extra = '_normal';
          }
        }
        if (benefitType === BenefitTypeEnum.NTH_PRICE) {
          if (Number(get(current, 'benefit')) === 0) {
            completePath = `${basePath}_free`;
            extra = '_free';
          } else if (Number(get(next, 'benefit')) === 0) {
            completePath = `${basePath}_next_free`;
            extra = '_next_free';
          } else {
            completePath = `${basePath}_normal`;
            extra = '_normal';
          }
        }
        const {
          prerequisiteShippingPriceRange
        } = extMap;
        if (benefitType === BenefitTypeEnum.FREESHOPPING) {
          if (prerequisiteShippingPriceRange) {
            completePath = `${basePath}_upper_limit`;
            extra = '_upper_limit';
          } else {
            completePath = `${basePath}_unlimited`;
            extra = '_unlimited';
          }
        }
        const saved = formatBenefitNum(getBenefitValue(benefitType, current, false, benefitValueType), {
          benefitType,
          benefitValueType
        }, options);
        const willSave = formatBenefitNum(getBenefitValue(benefitType, next, true, benefitValueType), {
          benefitType,
          benefitValueType
        }, options);
        const threshold = formatThreshold(get(next, 'amount'), {
          thresholdType,
          benefitType,
          minThreshold: Number(get(next, 'minThreshold'))
        }, options);
        let savedCount = Number(get(current, 'benefitCount'));
        let willSaveCount = Number(get(next, 'benefitCount'));
        let fixedAmount;
        let nextFixedAmount;
        if (benefitType === BenefitTypeEnum.BUY_X_GET_Y) {
          if (current) {
            savedCount = Number(nc(get(current, 'extMap.realBenefitValue'), savedCount));
          }
          if (next) {
            willSaveCount = Number(nc(get(next, 'extMap.realBenefitValue'), willSaveCount));
          }
        }
        if (benefitType === BenefitTypeEnum.NTH_FIXED_PRICE) {
          savedCount = Number(get(current, 'minThreshold'));
          willSaveCount = Number(get(next, 'minThreshold'));
          const benefit = current || next;
          fixedAmount = formatBenefitNum(Number(get(benefit, 'extMap.fixedPrice')), {
            benefitType
          }, options);
          nextFixedAmount = formatBenefitNum(Number(get(benefit, 'extMap.nextFixedPrice')), {
            benefitType
          }, options);
        }
        const benefitCount = Number(nc(savedCount, willSaveCount));
        return {
          path: thresholdType > -1 ? completePath : ' ',
          params: {
            saved: setWrapper(saved, {
              ...warper,
              class: `sales__promotionReminder-saved custom-sale-color ${nc(get(warper, 'class'), '')}`
            }),
            willSave: setWrapper(willSave, {
              ...warper,
              class: `sales__promotionReminder-willSave custom-sale-color ${nc(get(warper, 'class'), '')}`
            }),
            threshold: setWrapper(threshold, {
              ...warper,
              class: `sales__promotionReminder-threshold custom-sale-color ${nc(get(warper, 'class'), '')}`
            }),
            savedCount: setWrapper(savedCount, {
              ...warper,
              class: `sales__promotionReminder--benefitCount custom-sale-color ${nc(get(warper, 'class'), '')}`
            }),
            willSaveCount: setWrapper(willSaveCount, {
              ...warper,
              class: `sales__promotionReminder--benefitCount custom-sale-color ${nc(get(warper, 'class'), '')}`
            }),
            fixedAmount: setWrapper(fixedAmount, {
              ...warper,
              class: `sales__promotionReminder--benefitCount custom-sale-color ${nc(get(warper, 'class'), '')}`
            }),
            nextFixedAmount: setWrapper(nextFixedAmount, {
              ...warper,
              class: `sales__promotionReminder--benefitCount custom-sale-color ${nc(get(warper, 'class'), '')}`
            }),
            upperLimit: benefitType === BenefitTypeEnum.FREESHOPPING && prerequisiteShippingPriceRange ? currency && currency(prerequisiteShippingPriceRange, options) : undefined,
            extMap,
            br: lineBreak ? setWrapper('<br/>') : setWrapper('<i></i>'),
            benefitCount: benefitCount >= 0 ? setWrapper(benefitCount, {
              ...warper,
              class: `sales__promotionReminder--benefitCount custom-sale-color ${nc(get(warper, 'class'), '')}`
            }) : '',
            currentMinThreshold: setWrapper(savedCount, {
              ...warper,
              class: `sales__promotionReminder-threshold custom-sale-color ${nc(get(warper, 'class'), '')}`
            }),
            nextMinThreshold: setWrapper(willSaveCount, {
              ...warper,
              class: `sales__promotionReminder-threshold custom-sale-color ${nc(get(warper, 'class'), '')}`
            })
          },
          benefitType,
          thresholdType,
          step,
          extra
        };
      }
      return {
        path: '',
        params: {},
        step: 0
      };
    }
    return getShoppingReminderConfig;
  }
  _exports.default = shoppingPromotionReminder;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/cartSalesPromotion/js/content/reminder/getPromotionReminder.js'] = window.SLM['theme-shared/components/hbs/cartSalesPromotion/js/content/reminder/getPromotionReminder.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const { convertFormat } = window['SLM']['theme-shared/utils/newCurrency/CurrencyConvert.js'];
  const shoppingPromotionReminder = window['SLM']['theme-shared/components/hbs/sales/shoppingPromotionReminder/index.js'].default;
  const getPromotionReminder = shoppingPromotionReminder(convertFormat);
  const getShoppingReminderTranslate = (promotion, configs, options) => {
    const config = shoppingPromotionReminder(convertFormat)(promotion, configs, options);
    return t(config.path, config.params);
  };
  _exports.getShoppingReminderTranslate = getShoppingReminderTranslate;
  _exports.default = getPromotionReminder;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/cartSalesPromotion/js/content/helpers/format.js'] = window.SLM['theme-shared/components/hbs/cartSalesPromotion/js/content/helpers/format.js'] || function () {
  const _exports = {};
  const redirectTo = url => {
    return window.Shopline && window.Shopline.redirectTo && window.Shopline.redirectTo(url) || url;
  };
  _exports.redirectTo = redirectTo;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/colorExtract.js'] = window.SLM['theme-shared/utils/colorExtract.js'] || function () {
  const _exports = {};
  const tinycolor = window['tinycolor2']['default'];
  function colorExtract(hex, type, light = '#FFF', dark = '#000', opacity = 1, background = 'transparent') {
    const color = tinycolor(hex);
    let val;
    switch (type) {
      case 'alpha':
        val = color.getAlpha();
        break;
      case 'lightness':
        val = Math.round(color.toHsl().l * 100);
        break;
      case 'contarst':
        val = tinycolor.readability(hex, '#FFF') > tinycolor.readability(hex, '#000') ? light : dark;
        break;
      case 'contrast':
        val = tinycolor.readability(hex, '#FFF') > tinycolor.readability(hex, '#000') ? light : dark;
        val = tinycolor(val).setAlpha(Number(opacity)).toRgbString();
        break;
      case 'contrast_mix':
        let mixBg = background;
        if (background === 'transparent') {
          mixBg = hex;
        }
        val = tinycolor.readability(mixBg, '#FFF') > tinycolor.readability(mixBg, '#000') ? light : dark;
        val = tinycolor.mix(mixBg, val, Number(opacity)).toHexString();
        break;
      default:
        break;
    }
    return val;
  }
  _exports.colorExtract = colorExtract;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/cartSalesPromotion/js/content/reminder/index.js'] = window.SLM['theme-shared/components/hbs/cartSalesPromotion/js/content/reminder/index.js'] || function () {
  const _exports = {};
  const template = window['SLM']['theme-shared/utils/template.js'].default;
  const tinycolor = window['tinycolor2']['default'];
  const getShoppingReminderConfig = window['SLM']['theme-shared/components/hbs/cartSalesPromotion/js/content/reminder/getPromotionReminder.js'].default;
  const { get } = window['SLM']['theme-shared/utils/syntax-patch.js'];
  const { redirectTo } = window['SLM']['theme-shared/components/hbs/cartSalesPromotion/js/content/helpers/format.js'];
  const { colorExtract } = window['SLM']['theme-shared/utils/colorExtract.js'];
  const getPromotionBarContent = (promotion, rootWrapper) => {
    const isPCMainCart = rootWrapper.hasClass('main') && rootWrapper.hasClass('is-pc');
    let saleExtInfo = {};
    try {
      if (typeof promotion.saleExtInfo === 'string') {
        saleExtInfo = JSON.parse(promotion.saleExtInfo);
      }
    } catch (e) {
      console.warn('json.parse saleExtInfo value err:', e);
      saleExtInfo = {};
    }
    const {
      color_page_background,
      color_btn_background
    } = window.SL_State.get('theme.settings') || {};
    const lightness = colorExtract(color_page_background, 'lightness');
    let bannerBgColor = get(saleExtInfo, 'cartBannerStyle.bannerBgColor');
    if (!bannerBgColor && lightness < 75) {
      const color = tinycolor(color_btn_background);
      if (color.isValid()) {
        color.setAlpha(0.24);
        bannerBgColor = color.toRgbString();
      }
    }
    const bannerTextColor = get(saleExtInfo, 'cartBannerStyle.bannerTextColor');
    const discountTextColor = get(saleExtInfo, 'cartBannerStyle.discountTextColor');
    const config = getShoppingReminderConfig(promotion, {
      lineBreak: !isPCMainCart,
      warper: {
        style: `color: ${discountTextColor}`
      }
    });
    const needJump = get(config, 'step') !== 3;
    const bannerText = get(promotion, 'promotionBenefitList[0].extMap.bannerText');
    const promotionTemplate = bannerText ? template(bannerText, config.params, {
      prefix: '{'
    }) : '';
    const {
      extMap = {}
    } = config.params;
    if (needJump) {
      return `
      <div class="cart-sku-list-promotion-module-can-jump notranslate" style="background: ${bannerBgColor}">
        <a href="${redirectTo(`/activity/${promotion.activitySeq}?type=pool${extMap.meetThreshold === 'true' ? '&query_product_type=2' : ''}`)}" class="cart-sku-list-promotion-module-can-jump-wrapper">
          <div style="color: ${bannerTextColor}">
            ${promotionTemplate}
          </div>
          <div class="cart-sku-list-promotion-module-can-jump-arrow" style="font-size:0;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 11L9 6L4 1" stroke-width="1.5" stroke-linecap="round" style="stroke:${bannerTextColor};"/>
            </svg>
          </div>
        </a>
      </div>
    `;
    }
    return `
    <div class="cart-sku-list-promotion-module notranslate" style="background: ${bannerBgColor}">
      <span style="color: ${bannerTextColor}">
        ${promotionTemplate}
      </span>
    </div>
  `;
  };
  _exports.default = getPromotionBarContent;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/cartSalesPromotion/js/content/index.js'] = window.SLM['theme-shared/components/hbs/cartSalesPromotion/js/content/index.js'] || function () {
  const _exports = {};
  const getPromotionBarContent = window['SLM']['theme-shared/components/hbs/cartSalesPromotion/js/content/reminder/index.js'].default;
  const getContent = (promotion, rootWrapper) => {
    let saleExtInfo = {};
    try {
      if (promotion && typeof promotion.saleExtInfo === 'string') {
        saleExtInfo = JSON.parse(promotion.saleExtInfo);
      } else if (promotion && typeof promotion.saleExtInfo === 'object') {
        saleExtInfo = promotion.saleExtInfo;
      }
    } catch (e) {
      console.warn('json.parse saleExtInfo value err:', e);
    }
    if (promotion.benefitType === 7 || saleExtInfo.activityType === 8) {
      return '';
    }
    if (saleExtInfo.showAutoCartBanner) {
      return getPromotionBarContent(promotion, rootWrapper);
    }
    return '';
  };
  _exports.getContent = getContent;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/cartSalesPromotion/js/index.js'] = window.SLM['theme-shared/components/hbs/cartSalesPromotion/js/index.js'] || function () {
  const _exports = {};
  const { getContent } = window['SLM']['theme-shared/components/hbs/cartSalesPromotion/js/content/index.js'];
  _exports.default = (...args) => {
    const content = getContent(...args);
    return `
    <div class="cart-sku-list-promotion">
      ${content}
    </div>
  `;
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/trade/discount-code.js'] = window.SLM['theme-shared/utils/trade/discount-code.js'] || function () {
  const _exports = {};
  const getDiscountCodeName = (entity = {}) => {
    const {
      discountApplication
    } = entity;
    if (!discountApplication) return '';
    const {
      displayLabel,
      title
    } = discountApplication || {};
    return displayLabel || title || '';
  };
  _exports.getDiscountCodeName = getDiscountCodeName;
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
window.SLM['commons/utils/imgUrl.js'] = window.SLM['commons/utils/imgUrl.js'] || function () {
  const _exports = {};
  function isS3FileUrl(url) {
    return /\.cloudfront\./.test(url) || /https:\/\/img.myshopline.com/.test(url) || /https:\/\/img-preview.myshopline.com/.test(url);
  }
  function imgUrl(url, options) {
    const {
      width,
      scale
    } = options;
    if (!width) {
      return url;
    }
    if (!isS3FileUrl(url)) {
      return url;
    }
    let paramWidth = width;
    if (typeof scale === 'number' && scale > 1) {
      paramWidth = width * scale;
    }
    const clipper = `_${paramWidth || ''}x`;
    const slice = url.split('/');
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
window.SLM['cart/script/utils/cart-util/index.js'] = window.SLM['cart/script/utils/cart-util/index.js'] || function () {
  const _exports = {};
  const CartService = window['SLM']['cart/script/service/cart/index.js'].default;
  class CartUtil {
    static removeItem(skuList) {
      return CartUtil.getCartService().removeSkuList(skuList);
    }
    static changeItemNum(spuId, skuId, num, groupId, productSource) {
      return CartUtil.getCartService().editSku({
        spuId,
        skuId,
        num,
        groupId,
        productSource
      });
    }
    static getCartService() {
      if (!CartUtil.service) {
        CartUtil.service = CartService.takeCartService();
      }
      return CartUtil.service;
    }
  }
  _exports.default = CartUtil;
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
window.SLM['cart/script/domain/model/observer.js'] = window.SLM['cart/script/domain/model/observer.js'] || function () {
  const _exports = {};
  function observer(data, action = {}) {
    return new Proxy(data, {
      get(target, property) {
        if (typeof action.get === 'function') {
          action.get(property, target[property]);
        }
        return target[property];
      },
      set(target, property, value) {
        target[property] = value;
        if (typeof action.set === 'function') {
          const proxyValue = action.set(property, value);
          target[property] = proxyValue;
        }
        return true;
      }
    });
  }
  _exports.default = observer;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/domain/model/skuPromotionVerify.js'] = window.SLM['cart/script/domain/model/skuPromotionVerify.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const { cartLimitedEnum } = window['SLM']['cart/script/constant/stockType.js'];
  const toastTypeEnum = {
    stockLimit: 'item.item_left',
    activeStockLimit: 'discount_price.buy_limit'
  };
  _exports.toastTypeEnum = toastTypeEnum;
  function tActiveStockLimitWithMaxPurchaseReasonCode(code, stock) {
    const tParams = {
      stock
    };
    switch (code) {
      case 'LIMITED_ACTIVE_OVER':
        return t('cart.discount_price.buy_limit2', tParams);
      case 'LIMITED_ACTIVE_SKU_OVER':
        return t('cart.discount_price.buy_limit3', tParams);
      default:
        return t('cart.discount_price.buy_limit1', tParams);
    }
  }
  _exports.tActiveStockLimitWithMaxPurchaseReasonCode = tActiveStockLimitWithMaxPurchaseReasonCode;
  function skuPromotionVerify(key, nextValue) {
    const ctx = this.stepper;
    if (!ctx) {
      return nextValue;
    }
    if (ctx.limitedType === 0 || !cartLimitedEnum.ACTIVE.includes(ctx.maxPurchaseReasonCode)) {
      return nextValue;
    }
    const getMaxStock = () => {
      return ctx.maxPurchaseNum > 0 ? ctx.maxPurchaseNum : 1;
    };
    if (key === 'max') {
      return getMaxStock();
    }
    return nextValue;
  }
  _exports.default = skuPromotionVerify;
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
window.SLM['cart/script/components/sku-stepper.js'] = window.SLM['cart/script/components/sku-stepper.js'] || function () {
  const _exports = {};
  const Cookie = window['js-cookie']['default'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { get_func, get } = window['SLM']['theme-shared/utils/syntax-patch.js'];
  const { t: I18n } = window['SLM']['theme-shared/utils/i18n.js'];
  const { Owner, Action } = window['@yy/sl-theme-shared']['/utils/logger/sentryReport'];
  const LoggerService = window['SLM']['commons/logger/index.js'].default;
  const { Status: LoggerStatus } = window['SLM']['commons/logger/index.js'];
  const Toast = window['SLM']['commons/components/toast/index.js'].default;
  const CartUtil = window['SLM']['cart/script/utils/cart-util/index.js'].default;
  const cartReport = window['SLM']['cart/script/report/cartReport.js'].default;
  const { toggleVisibility } = window['SLM']['cart/script/biz/sticky-cart/index.js'];
  const observer = window['SLM']['cart/script/domain/model/observer.js'].default;
  const skuPromotionVerify = window['SLM']['cart/script/domain/model/skuPromotionVerify.js'].default;
  const { tActiveStockLimitWithMaxPurchaseReasonCode, toastTypeEnum } = window['SLM']['cart/script/domain/model/skuPromotionVerify.js'];
  const { cartLimitedEnum } = window['SLM']['cart/script/constant/stockType.js'];
  const modelHelper = window['SLM']['cart/script/domain/model/helpers.js'].default;
  const CartService = window['SLM']['cart/script/service/cart/index.js'].default;
  const CartItemModel = window['SLM']['cart/script/domain/model/cartItem.js'].default;
  const responseCodeVO = window['SLM']['cart/script/domain/vo/responseCode.js'].default;
  const handleAddToCartErrorCodeToast = window['SLM']['commons/cart/handleAddToCartErrorCodeToast.js'].default;
  const logger = LoggerService.pipeOwner(`${Owner.Cart} components/sku-stepper`);
  const cartToken = Cookie.get('t_cart');
  const getCursorPosition = function (element) {
    let cursorPos = 0;
    if (document.selection) {
      const selectRange = document.selection.createRange();
      selectRange.moveStart('character', -element.value.length);
      cursorPos = selectRange.text.length;
    } else if (element.selectionStart || parseInt(element.selectionStart, 10) === 0) {
      cursorPos = element.selectionStart;
    }
    return cursorPos;
  };
  const getParentId = function (ele) {
    let t = ele;
    while (t && t.length) {
      if (t.hasClass('trade-cart-sku-item')) {
        return t.attr('id');
      }
      t = t.parent();
    }
  };
  const toast = new Toast({
    content: 'content',
    className: 'test'
  });
  class SkuStepper {
    constructor({
      root,
      name,
      price,
      normalSkuNum,
      totalSkuNum,
      disabled,
      spuId,
      skuId,
      priceType,
      stockType,
      skuAttr,
      setRendering,
      isRendering,
      cartType,
      setPreFocusedInputEle,
      setNeedForceFocus,
      groupId,
      productSource,
      maxPurchaseNum,
      maxPurchaseTotalNum,
      maxPurchaseReasonCode,
      indexStr,
      activeItems,
      itemNo,
      minPurchaseNum,
      purchaseIncrementNum
    }) {
      this.root = root;
      this.cartType = cartType;
      this.setPreFocusedInputEle = setPreFocusedInputEle;
      this.setNeedForceFocus = setNeedForceFocus;
      const stepperValue = {
        normalSkuNum,
        name,
        price,
        value: totalSkuNum,
        disabled,
        spuId,
        skuId,
        priceType,
        stockType,
        skuAttr,
        setRendering,
        isRendering,
        groupId,
        productSource,
        maxPurchaseNum,
        maxPurchaseTotalNum,
        maxPurchaseReasonCode,
        indexStr,
        itemNo,
        minPurchaseNum,
        purchaseIncrementNum
      };
      this.activeItems = activeItems;
      this.stepper = observer(stepperValue, {
        set: skuPromotionVerify.bind(this)
      });
      this.beforeValue = totalSkuNum;
    }
    init() {
      logger.info(`normal 主站购物车 skuStepper init`, {
        data: {
          cartToken,
          stepperInfo: this.stepper
        },
        action: Action.InitCart,
        status: LoggerStatus.Start
      });
      this.$stepper = this.root.find('.cart-stepper');
      this.$minusButton = this.$stepper.find('.cart-stepper-minus');
      this.$plusButton = this.$stepper.find('.cart-stepper-plus');
      this.$input = this.$stepper.find('.cart-stepper-input');
      this.initEventListener();
      this.render();
      $(window).on('unload', () => {
        this.unbind();
      });
      logger.info(`normal 主站购物车 skuStepper init`, {
        data: {
          cartToken,
          stepperInfo: this.stepper
        },
        action: Action.InitCart,
        status: LoggerStatus.Success
      });
    }
    unbind() {
      this.$minusButton && this.$minusButton.off && this.$minusButton.off();
      this.$plusButton && this.$plusButton.off && this.$plusButton.off();
      this.$input && this.$input.off && this.$input.off();
    }
    changeItemNumReport() {
      try {
        logger.info(`normal 主站购物车 skuStepper changeItemNumReport`, {
          data: {
            cartToken,
            stepperInfo: this.stepper
          },
          action: Action.EditCart,
          status: LoggerStatus.Start
        });
        if (this.stepper.value === 0) {
          const params = {
            spuId: this.stepper.spuId,
            skuId: this.stepper.skuId,
            quantity: this.beforeValue,
            num: this.beforeValue,
            name: this.stepper.name,
            price: this.stepper.price,
            skuAttr: this.stepper.skuAttr,
            itemNo: this.stepper.itemNo,
            groupId: this.stepper.groupId
          };
          const products = modelHelper.reducer(CartService.takeCartService().cartItemList).next(CartItemModel.findProductWithGroupIdAndSkuId, CartItemModel.getGroupId(params), CartItemModel.getSkuId(params))() || params;
          const subProducts = modelHelper.reducer(CartService.takeCartService().cartItemList).next(CartItemModel.filterProductInGroup, CartItemModel.getGroupId(products)).next(CartItemModel.filterProductsWithParentSkuId, CartItemModel.getSkuId(products))() || [];
          cartReport.removeItem(products, subProducts);
        }
        this.beforeValue = this.stepper.value;
        logger.info(`normal 主站购物车 skuStepper changeItemNumReport`, {
          data: {
            cartToken,
            stepperInfo: this.stepper
          },
          action: Action.EditCart,
          status: LoggerStatus.Success
        });
      } catch (e) {
        this.beforeValue = this.stepper.value;
        logger.info(`normal 主站购物车 skuStepper changeItemNumReport`, {
          data: {
            cartToken,
            stepperInfo: this.stepper
          },
          action: Action.EditCart,
          error: e
        });
        console.error(e);
      }
    }
    async changeItemNum() {
      logger.info(`normal 主站购物车 skuStepper changeItemNum`, {
        data: {
          cartToken,
          stepperInfo: this.stepper
        },
        action: Action.EditCart,
        status: LoggerStatus.Start
      });
      this.stepper.setRendering(true);
      this.changeItemNumReport();
      const res = await CartUtil.changeItemNum(this.stepper.spuId, this.stepper.skuId, this.stepper.value, this.stepper.groupId, this.stepper.productSource);
      if (!responseCodeVO.isOk(res)) {
        this.restorePreValue();
        this.stepper.setRendering(false);
        handleAddToCartErrorCodeToast(res);
      }
      logger.info(`normal 主站购物车 skuStepper changeItemNum`, {
        data: {
          cartToken,
          stepperInfo: this.stepper
        },
        action: Action.EditCart,
        status: LoggerStatus.Success
      });
    }
    limitToastNum(num) {
      if (num > 0) {
        return num;
      }
      return '0';
    }
    toastLimit() {
      const {
        maxPurchaseReasonCode,
        maxPurchaseTotalNum
      } = this.stepper;
      if (cartLimitedEnum.NORMAL_ITEM_MAX_NUM.includes(maxPurchaseReasonCode)) {
        toast.open(I18n(`cart.item.add_limit2`));
        this.render();
      } else if (cartLimitedEnum.ACTIVE_LIMITED.includes(maxPurchaseReasonCode)) {
        toast.open(tActiveStockLimitWithMaxPurchaseReasonCode(maxPurchaseReasonCode, this.limitToastNum(maxPurchaseTotalNum)));
      } else if (cartLimitedEnum.NORMAL_STOCK_OVER.includes(maxPurchaseReasonCode)) {
        toast.open(I18n(`cart.${toastTypeEnum.stockLimit}`, {
          stock: this.limitToastNum(maxPurchaseTotalNum)
        }));
      } else if (cartLimitedEnum.ACTIVE_STOCK_OVER.includes(maxPurchaseReasonCode)) {
        toast.open(I18n(`cart.${toastTypeEnum.stockLimit}`, {
          stock: this.limitToastNum(maxPurchaseTotalNum)
        }));
      }
    }
    storePreValue() {
      this.stepper.preValue = this.stepper.value;
    }
    restorePreValue() {
      this.stepper.value = this.stepper.preValue;
      this.setValue(this.stepper.value - this.groupTotalDiscountValue);
      this.render();
    }
    initEventListener() {
      this.$minusButton && this.$minusButton.on && this.$minusButton.on('click', () => {
        logger.info(`normal 主站购物车 skuStepper minusBtnClick`, {
          data: {
            cartToken,
            stepperInfo: this.stepper
          },
          action: Action.EditCart,
          status: LoggerStatus.Start
        });
        this.setNeedForceFocus(false);
        const {
          stepper,
          groupTotalDiscountValue
        } = this;
        if (stepper.isRendering()) return;
        const {
          maxPurchaseReasonCode,
          maxPurchaseTotalNum,
          maxPurchaseNum,
          value,
          minPurchaseNum,
          purchaseIncrementNum
        } = stepper;
        if (value <= minPurchaseNum) return;
        const stepValue = Math.max(value - groupTotalDiscountValue, minPurchaseNum);
        if (stepValue > 0) {
          this.storePreValue();
          if (stepValue > maxPurchaseNum) {
            if (cartLimitedEnum.ACTIVE.includes(maxPurchaseReasonCode)) {
              toast.open(tActiveStockLimitWithMaxPurchaseReasonCode(undefined, this.limitToastNum(maxPurchaseTotalNum)));
            } else {
              toast.open(I18n(`cart.${toastTypeEnum.stockLimit}`, {
                stock: this.limitToastNum(maxPurchaseTotalNum)
              }));
            }
            if (value === minPurchaseNum) {
              this.stepper.value = 0;
            } else if (maxPurchaseNum > 0) {
              this.stepper.value = maxPurchaseNum;
            } else {
              this.stepper.value = minPurchaseNum;
            }
            this.render();
          } else if (purchaseIncrementNum < value) {
            this.stepper.value -= purchaseIncrementNum;
          } else {
            this.stepper.value = 0;
          }
          this.changeItemNum();
          logger.info(`normal 主站购物车 skuStepper minusBtnClick`, {
            data: {
              cartToken,
              stepperInfo: this.stepper
            },
            action: Action.EditCart,
            status: LoggerStatus.Success
          });
        }
      });
      this.$plusButton.on('click', () => {
        logger.info(`normal 主站购物车 skuStepper plusBtnClick`, {
          data: {
            cartToken,
            stepperInfo: this.stepper
          },
          action: Action.EditCart,
          status: LoggerStatus.Start
        });
        this.setNeedForceFocus(false);
        if (this.stepper.isRendering()) return;
        const {
          groupTotalDiscountValue,
          stepper
        } = this;
        const {
          value,
          maxPurchaseNum,
          minPurchaseNum,
          purchaseIncrementNum
        } = stepper;
        const stepValue = Math.max(value - groupTotalDiscountValue, 1);
        if (stepValue < maxPurchaseNum) {
          this.storePreValue();
          this.stepper.value += purchaseIncrementNum;
          this.changeItemNum();
        } else if (stepValue === maxPurchaseNum) {
          this.toastLimit();
        } else {
          this.toastLimit();
          if (stepValue > maxPurchaseNum) {
            this.storePreValue();
            this.stepper.value = maxPurchaseNum > 0 ? maxPurchaseNum + groupTotalDiscountValue : minPurchaseNum;
            this.render();
            this.changeItemNum();
          } else {
            this.render();
          }
        }
        logger.info(`normal 主站购物车 skuStepper plusBtnClick`, {
          data: {
            cartToken,
            stepperInfo: this.stepper
          },
          action: Action.EditCart,
          status: LoggerStatus.Success
        });
      });
      this.$input.on('input', e => {
        logger.info(`normal 主站购物车 skuStepper input`, {
          data: {
            cartToken,
            stepperInfo: this.stepper
          },
          action: Action.EditCart,
          status: LoggerStatus.Start
        });
        const regExp = new RegExp(/^\d*/);
        const input = get_func(e, 'target.value.match').exec(regExp);
        let inputVal = '';
        if (get(input, '0') !== '') {
          const value = e.target.value ? Number(input[0].slice(0, Math.min(input[0].length, 5))) : e.target.value;
          this.stepper.value = value;
          inputVal = value;
        }
        this.setValue(inputVal);
        logger.info(`normal 主站购物车 skuStepper input`, {
          data: {
            cartToken,
            stepperInfo: this.stepper,
            inputVal
          },
          action: Action.EditCart,
          status: LoggerStatus.Success
        });
      });
      this.$input.on('focus', () => {
        this.setNeedForceFocus(true);
        this.storePreValue();
        toggleVisibility(this.cartType, false);
        SL_State.set('cartInInputMode', true);
        this.setPreFocusedInputEle({
          id: getParentId(this.$input)
        });
      });
      this.$input.on('click', () => {
        this.setPreFocusedInputEle({
          pos: getCursorPosition(this.$input.get(0))
        });
      });
      this.$input.on('blur', e => {
        logger.info(`normal 主站购物车 skuStepper inputBlur`, {
          data: {
            cartToken,
            stepperInfo: this.stepper,
            currentStepper: e
          },
          action: Action.EditCart,
          status: LoggerStatus.Start
        });
        this.setNeedForceFocus(true);
        toggleVisibility(this.cartType, true);
        SL_State.set('cartInInputMode', false);
        const value = Number(e.target.value);
        if (!value) {
          this.stepper.value = this.stepper.minPurchaseNum + this.groupTotalDiscountValue;
          this.setValue(this.stepper.minPurchaseNum);
          this.render();
          this.changeItemNum();
        } else {
          this.stepper.value = value;
          const {
            maxPurchaseTotalNum,
            maxPurchaseNum,
            maxPurchaseReasonCode,
            minPurchaseNum
          } = this.stepper;
          let totalValue = value + this.groupTotalDiscountValue;
          const overFlag = totalValue > maxPurchaseNum;
          if (overFlag) {
            if (cartLimitedEnum.NORMAL_ITEM_MAX_NUM.includes(maxPurchaseReasonCode)) {
              toast.open(I18n(`cart.item.add_limit2`));
            } else if (cartLimitedEnum.ACTIVE_LIMITED.includes(maxPurchaseReasonCode)) {
              toast.open(tActiveStockLimitWithMaxPurchaseReasonCode(maxPurchaseReasonCode, this.limitToastNum(maxPurchaseTotalNum)));
            } else if (cartLimitedEnum.NORMAL_STOCK_OVER.includes(maxPurchaseReasonCode)) {
              toast.open(I18n(`cart.${toastTypeEnum.stockLimit}`, {
                stock: this.limitToastNum(maxPurchaseTotalNum)
              }));
            } else if (cartLimitedEnum.ACTIVE_STOCK_OVER.includes(maxPurchaseReasonCode)) {
              toast.open(I18n(`cart.${toastTypeEnum.stockLimit}`, {
                stock: this.limitToastNum(maxPurchaseTotalNum)
              }));
            } else if (cartLimitedEnum.PURCHASE_MAX_MOQ.includes(maxPurchaseReasonCode)) {
              toast.open(I18n(`cart.b2b.amount.most.desc`, {
                num: this.limitToastNum(maxPurchaseNum)
              }));
            } else {
              toast.open(tActiveStockLimitWithMaxPurchaseReasonCode(maxPurchaseReasonCode, this.limitToastNum(maxPurchaseTotalNum)));
            }
          }
          if (this.stepper.preValue !== this.stepper.value || overFlag) {
            if (overFlag) {
              totalValue = maxPurchaseNum > 0 ? maxPurchaseNum + this.groupTotalDiscountValue : minPurchaseNum;
            }
            this.stepper.value = totalValue;
            this.render();
            this.changeItemNum();
          } else {
            this.setValue(this.stepper.preValue);
          }
        }
        logger.info(`normal 主站购物车 skuStepper inputBlur`, {
          data: {
            cartToken,
            stepperInfo: this.stepper,
            currentStepper: e
          },
          action: Action.EditCart,
          status: LoggerStatus.Success
        });
      });
    }
    getDiscountValue(groupById = true) {
      let discountValue = 0;
      const [findex, index] = this.stepper.indexStr.split('-');
      const otherSameSkuNum = [];
      let currentIndex = 0;
      this.activeItems.forEach((active, activeIndex) => {
        otherSameSkuNum.push(...active.itemList);
        if (activeIndex < Number(findex)) {
          const {
            length
          } = active.itemList;
          if (activeIndex === 0) {
            currentIndex += length - 1;
          } else {
            currentIndex += length;
          }
        } else if (activeIndex === Number(findex)) {
          if (activeIndex === 0) {
            currentIndex += Number(index);
          } else {
            currentIndex += Number(index) + 1;
          }
        }
      });
      const {
        skuId: stepperSkuId,
        spuId: stepperSpuId,
        groupId: stepperGroupId
      } = this.stepper;
      otherSameSkuNum.forEach((sku, skuIndex) => {
        if (skuIndex !== currentIndex) {
          const {
            skuId,
            spuId,
            groupId,
            num,
            parentSkuId
          } = sku;
          let sameItem = String(skuId) === String(stepperSkuId) && String(spuId) === String(stepperSpuId) && !parentSkuId;
          if (groupById) {
            sameItem = sameItem && String(groupId) === String(stepperGroupId);
          }
          if (sameItem) {
            discountValue += num;
          }
        }
      });
      return {
        discountValue
      };
    }
    get groupTotalDiscountValue() {
      return this.getDiscountValue().discountValue;
    }
    setSingleDisabled(position, disabled) {
      const prefix = '.cart-stepper-';
      if (disabled) {
        this.$stepper.find(`${prefix}${position}`).addClass('disabled');
      } else {
        this.$stepper.find(`${prefix}${position}`).removeClass('disabled');
      }
    }
    setStepperDisabled() {
      if (this.stepper.disabled) {
        this.$stepper.addClass('disabled');
      } else {
        this.$stepper.removeClass('disabled');
      }
    }
    setStepperData(obj) {
      this.stepper = {
        ...this.stepper,
        ...obj
      };
      this.render();
    }
    setValue(value) {
      this.$stepper.find('.cart-stepper-input').val(value);
    }
    render() {
      const {
        groupTotalDiscountValue,
        stepper
      } = this;
      const {
        value,
        maxPurchaseNum,
        minPurchaseNum
      } = stepper;
      const stepValue = Math.max(value - groupTotalDiscountValue, 1);
      this.setSingleDisabled('plus', maxPurchaseNum <= stepValue);
      this.setSingleDisabled('minus', stepValue <= minPurchaseNum);
      this.setStepperDisabled();
    }
  }
  _exports.default = SkuStepper;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/components/remove-button.js'] = window.SLM['cart/script/components/remove-button.js'] || function () {
  const _exports = {};
  const CartUtil = window['SLM']['cart/script/utils/cart-util/index.js'].default;
  const CartService = window['SLM']['cart/script/service/cart/index.js'].default;
  const CartItemModel = window['SLM']['cart/script/domain/model/cartItem.js'].default;
  const response = window['SLM']['cart/script/domain/model/response.js'].default;
  const cartReport = window['SLM']['cart/script/report/cartReport.js'].default;
  const modelHelper = window['SLM']['cart/script/domain/model/helpers.js'].default;
  class RemoveButton {
    constructor({
      root,
      itemInfo,
      cartActionHooks
    }) {
      this.root = root;
      this.itemInfo = itemInfo;
      this.cartActionHooks = cartActionHooks;
    }
    init() {
      this.$removeButton = this.root.find('.trade-cart-sku-item-remove-button');
      this.initEventListener();
      $(window).on('unload', () => {
        this.unbind();
      });
    }
    unbind() {
      this.$removeButton && this.$removeButton.off && this.$removeButton.off();
    }
    removeItem() {
      try {
        const products = modelHelper.reducer(CartService.takeCartService().cartItemList).next(CartItemModel.findProductWithGroupIdAndSkuId, CartItemModel.getGroupId(this.itemInfo), CartItemModel.getSkuId(this.itemInfo))() || this.itemInfo;
        const subProducts = modelHelper.reducer(CartService.takeCartService().cartItemList).next(CartItemModel.filterProductInGroup, CartItemModel.getGroupId(products)).next(CartItemModel.filterProductsWithParentSkuId, CartItemModel.getSkuId(products))() || [];
        cartReport.removeItem(products, subProducts);
        const {
          skuId,
          spuId,
          groupId,
          productSource,
          num
        } = products || {};
        const skuInfo = {
          skuId,
          spuId,
          groupId,
          productSource,
          num
        };
        CartUtil.removeItem([skuInfo]).then(res => {
          if (response.isResolved(res)) {
            this.cartActionHooks.skuRemoved.call([skuId]);
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
    initEventListener() {
      this.$removeButton && this.$removeButton.on && this.$removeButton.on('click', () => {
        this.removeItem();
      });
    }
  }
  _exports.default = RemoveButton;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/components/remove-all-button.js'] = window.SLM['cart/script/components/remove-all-button.js'] || function () {
  const _exports = {};
  const CartUtil = window['SLM']['cart/script/utils/cart-util/index.js'].default;
  const response = window['SLM']['cart/script/domain/model/response.js'].default;
  const cartReport = window['SLM']['cart/script/report/cartReport.js'].default;
  class RemoveAllButton {
    constructor(rootId, inactiveItems, cartActionHooks) {
      this.rootId = rootId;
      this.inactiveItems = inactiveItems;
      this.cartActionHooks = cartActionHooks;
    }
    init() {
      this.$removeAllButton = $(this.rootId);
      this.initEventListener();
      $(window).on('unload', () => {
        this.unbind();
      });
    }
    unbind() {
      this.$removeAllButton && this.$removeAllButton.off && this.$removeAllButton.off();
    }
    removeItem() {
      try {
        cartReport.removeItem(this.inactiveItems);
      } catch (e) {
        console.error(e);
      }
      const skuList = this.inactiveItems.map(item => {
        const {
          skuId,
          spuId,
          groupId,
          productSource,
          num
        } = item || {};
        return {
          skuId,
          spuId,
          groupId,
          productSource,
          num
        };
      });
      CartUtil.removeItem(skuList).then(res => {
        if (response.isResolved(res)) {
          this.cartActionHooks.skuRemoved.call(skuList);
        }
      });
    }
    initEventListener() {
      this.$removeAllButton && this.$removeAllButton.on && this.$removeAllButton.on('click', () => {
        this.removeItem();
      });
    }
  }
  _exports.default = RemoveAllButton;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/utils/context/constant.js'] = window.SLM['cart/script/utils/context/constant.js'] || function () {
  const _exports = {};
  const errCanceled = 'context done with cancellation';
  const errTimeout = 'context done with timeout';
  const errDeadline = 'context done with deadline';
  const errNotNullableValuer = 'valuer is not nullable';
  _exports.default = {
    errCanceled,
    errTimeout,
    errDeadline,
    errNotNullableValuer
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/utils/context/valuer.js'] = window.SLM['cart/script/utils/context/valuer.js'] || function () {
  const _exports = {};
  const constant = window['SLM']['cart/script/utils/context/constant.js'].default;
  function newValuer(value) {
    let getter;
    if (arguments.length === 0) {
      getter = () => {
        throw new Error(constant.errNotNullableValuer);
      };
    } else {
      getter = () => {
        return value;
      };
    }
    return createValuer(getter);
  }
  function newValuerWithGetter(getter) {
    if (arguments.length === 0) {
      getter = () => {
        throw new Error(constant.errNotNullableValuer);
      };
    }
    return createValuer(getter);
  }
  _exports.default = {
    newValuer,
    newValuerWithGetter
  };
  function createValuer(getter) {
    return Object.defineProperty({}, 'defaultGetter', {
      value: getter,
      writable: false,
      configurable: false
    });
  }
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/valuer/cartItemList.js'] = window.SLM['cart/script/valuer/cartItemList.js'] || function () {
  const _exports = {};
  const Valuer = window['SLM']['cart/script/utils/context/valuer.js'].default;
  const valuer = Valuer.newValuerWithGetter(() => {
    return null;
  });
  function withCartItemList(ctx) {
    return ctx.value(valuer);
  }
  _exports.default = {
    valuer,
    withCartItemList
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/valuer/cartService.js'] = window.SLM['cart/script/valuer/cartService.js'] || function () {
  const _exports = {};
  const Valuer = window['SLM']['cart/script/utils/context/valuer.js'].default;
  const CartService = window['SLM']['cart/script/service/cart/index.js'].default;
  const valuer = Valuer.newValuerWithGetter(() => {
    return CartService.takeCartService();
  });
  function withCartService(ctx) {
    return ctx.value(valuer);
  }
  _exports.default = {
    valuer,
    withCartService
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/utils/promise.js'] = window.SLM['cart/script/utils/promise.js'] || function () {
  const _exports = {};
  async function resolveAfterDuration(dur) {
    if (dur <= 0) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, dur);
    });
  }
  _exports.resolveAfterDuration = resolveAfterDuration;
  async function resolveAfterSeconds(s) {
    if (s <= 0) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, s * 1000);
    });
  }
  _exports.resolveAfterSeconds = resolveAfterSeconds;
  async function resolveAfterEventBubbled($ele, eventName) {
    return new Promise(resolve => {
      const listener = e => {
        $ele.removeEventListener(eventName, listener);
        resolve(e);
      };
      $ele.addEventListener(eventName, listener);
    });
  }
  _exports.resolveAfterEventBubbled = resolveAfterEventBubbled;
  const zombie = new Promise(() => {});
  async function zombiePromise() {
    return zombie;
  }
  _exports.zombiePromise = zombiePromise;
  function promiseResolvable() {
    let resolver;
    let resolved = false;
    const promise = new Promise(res => {
      if (resolved) {
        res();
      } else {
        resolver = res;
      }
    });
    const resolveFunc = () => {
      resolved = true;
      if (typeof resolver === 'function') {
        resolver();
      }
    };
    return [promise, resolveFunc];
  }
  _exports.promiseResolvable = promiseResolvable;
  _exports.default = {
    zombie,
    resolvable: promiseResolvable,
    resolveAfterEventBubbled,
    resolveAfterSeconds,
    resolveAfterDuration
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/utils/time.js'] = window.SLM['cart/script/utils/time.js'] || function () {
  const _exports = {};
  const Millisecond = 1;
  _exports.Millisecond = Millisecond;
  const Second = Millisecond * 1000;
  _exports.Second = Second;
  const Minute = Second * 60;
  _exports.Minute = Minute;
  const Hour = Minute * 60;
  _exports.Hour = Hour;
  const Day = Hour * 24;
  _exports.Day = Day;
  const Week = Day * 7;
  _exports.Week = Week;
  class Time {
    constructor(v) {
      this.v = v;
    }
    get timestamp() {
      return this.v;
    }
    add(d) {
      return new Time(this.v + d);
    }
    sub(d) {
      return new Time(this.v - d);
    }
    duration(t) {
      return this.v - t.timestamp;
    }
  }
  function time(v) {
    return new Time(v);
  }
  function now() {
    return time(Date.now());
  }
  function later(dur) {
    return now().add(dur);
  }
  function former(dur) {
    return now().sub(dur);
  }
  _exports.default = {
    time,
    now,
    later,
    former,
    Millisecond,
    Second,
    Minute,
    Hour,
    Day,
    Week
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/utils/context/index.js'] = window.SLM['cart/script/utils/context/index.js'] || function () {
  const _exports = {};
  const { promiseResolvable, resolveAfterDuration, zombiePromise } = window['SLM']['cart/script/utils/promise.js'];
  const time = window['SLM']['cart/script/utils/time.js'].default;
  const constant = window['SLM']['cart/script/utils/context/constant.js'].default;
  const _background = newEmptyCtx();
  const _todo = newEmptyCtx();
  function background() {
    return forkParentCtx(_background);
  }
  function todo() {
    return forkParentCtx(_todo);
  }
  function withValue(parent, valuer, value) {
    return newValueCtx(parent, valuer, value);
  }
  function withCancel(parent) {
    return newCancelCtx(parent);
  }
  function withTimeout(parent, timeout) {
    return newCancelCtx(newTimeoutCtx(parent, timeout));
  }
  function withDeadline(parent, deadline) {
    return newCancelCtx(newDeadlineCtx(parent, deadline));
  }
  _exports.default = {
    background,
    todo,
    withValue,
    withCancel,
    withTimeout,
    withDeadline,
    ...constant
  };
  function newEmptyCtx() {
    return {
      deadline() {
        return null;
      },
      done() {
        return zombiePromise();
      },
      err() {
        return null;
      },
      value(cv) {
        return cv ? cv.defaultGetter() : null;
      }
    };
  }
  function newValueCtx(parent, valuer, value) {
    return {
      deadline() {
        return parent.deadline();
      },
      done() {
        return parent.done();
      },
      err() {
        return parent.err();
      },
      value(cv) {
        if (valuer === cv) {
          return value;
        }
        return parent.value(cv);
      }
    };
  }
  function forkParentCtx(parent) {
    if (!parent) parent = _background;
    return {
      deadline() {
        return parent.deadline();
      },
      done() {
        return parent.done();
      },
      err() {
        return parent.err();
      },
      value(cv) {
        return parent.value(cv);
      }
    };
  }
  function createCancellablePromise() {
    return promiseResolvable();
  }
  function newTimeoutCtx(parent, dur) {
    let error = null;
    const deadline = time.later(dur);
    const timeoutPromise = resolveAfterDuration(dur);
    return {
      deadline() {
        return deadline;
      },
      done() {
        return Promise.race([parent.done().then(() => parent.err()), timeoutPromise.then(() => new Error(constant.errTimeout))]).then(err => {
          error = err;
        });
      },
      err() {
        return error;
      },
      value(cv) {
        return parent.value(cv);
      }
    };
  }
  function newDeadlineCtx(parent, deadline) {
    let error = null;
    const deadlinePromise = resolveAfterDuration(deadline.duration(time.now()));
    return {
      deadline() {
        return deadline;
      },
      done() {
        return Promise.race([parent.done().then(() => parent.err()), deadlinePromise.then(() => {
          return new Error(constant.errDeadline);
        })]).then(err => {
          error = err;
        });
      },
      err() {
        return error;
      },
      value(cv) {
        return parent.value(cv);
      }
    };
  }
  function newCancelCtx(parent) {
    const [cancelPromise, cancelFunc] = createCancellablePromise();
    let error = null;
    return [{
      deadline() {
        return parent.deadline();
      },
      done() {
        return Promise.race([parent.done().then(() => {
          return parent.err();
        }), cancelPromise.then(() => {
          return new Error(constant.errCanceled);
        })]).then(err => {
          error = err;
        });
      },
      err() {
        return error;
      },
      value(cv) {
        return parent.value(cv);
      }
    }, cancelFunc];
  }
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/valuer/checkoutHooks.js'] = window.SLM['cart/script/valuer/checkoutHooks.js'] || function () {
  const _exports = {};
  const { SyncHook } = window['@funnyecho/hamon'];
  const Valuer = window['SLM']['cart/script/utils/context/valuer.js'].default;
  const context = window['SLM']['cart/script/utils/context/index.js'].default;
  const valuer = Valuer.newValuer();
  function takeCheckoutHooks(ctx) {
    return ctx.value(valuer);
  }
  function withCheckoutHooks(ctx, v) {
    return context.withValue(ctx, valuer, v || newHooks());
  }
  function newHooks() {
    return {
      checkoutFailed: new SyncHook()
    };
  }
  _exports.default = {
    valuer,
    withCheckoutHooks,
    takeCheckoutHooks,
    newHooks
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/valuer/cartActionHooks.js'] = window.SLM['cart/script/valuer/cartActionHooks.js'] || function () {
  const _exports = {};
  const { SyncHook } = window['@funnyecho/hamon'];
  const Valuer = window['SLM']['cart/script/utils/context/valuer.js'].default;
  const context = window['SLM']['cart/script/utils/context/index.js'].default;
  const valuer = Valuer.newValuer();
  function takeCartActionHooks(ctx) {
    return ctx.value(valuer);
  }
  function withCartActionHooks(ctx, hooks) {
    return context.withValue(ctx, valuer, hooks || newHooks());
  }
  function newHooks() {
    return {
      skuRemoved: new SyncHook()
    };
  }
  _exports.default = {
    valuer,
    withCartActionHooks,
    takeCartActionHooks,
    newHooks
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/valuer/index.js'] = window.SLM['cart/script/valuer/index.js'] || function () {
  const _exports = {};
  const cartItemList = window['SLM']['cart/script/valuer/cartItemList.js'].default;
  const cartService = window['SLM']['cart/script/valuer/cartService.js'].default;
  const checkoutHooks = window['SLM']['cart/script/valuer/checkoutHooks.js'].default;
  const cartActionHooks = window['SLM']['cart/script/valuer/cartActionHooks.js'].default;
  _exports.default = {
    cartItemListValuer: cartItemList,
    cartServiceValuer: cartService,
    checkoutHooksValuer: checkoutHooks,
    cartActionHooksValuer: cartActionHooks
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/components/promotion-limited/index.js'] = window.SLM['cart/script/components/promotion-limited/index.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const { toastTypeEnum } = window['SLM']['cart/script/domain/model/skuPromotionVerify.js'];
  const { cartLimitedEnum } = window['SLM']['cart/script/constant/stockType.js'];
  const newErrorTextKeyMap = [{
    errorCode: '0111',
    errorText: num => {
      return t(`cart.${toastTypeEnum.activeStockLimit}1`, {
        stock: num > 0 ? num : '0'
      });
    },
    errorTextNumkey: 'maxPurchaseTotalNum'
  }, {
    errorCode: '0112',
    errorText: num => {
      return t(`cart.${toastTypeEnum.activeStockLimit}2`, {
        stock: num > 0 ? num : '0'
      });
    },
    errorTextNumkey: 'maxPurchaseTotalNum'
  }, {
    errorCode: '0107',
    errorText: num => {
      return t(`cart.${toastTypeEnum.activeStockLimit}3`, {
        stock: num > 0 ? num : '0'
      });
    },
    errorTextNumkey: 'maxPurchaseTotalNum'
  }, {
    errorCode: '0113',
    errorText: num => {
      return t(`cart.b2b.amount.increase.desc`, {
        num
      });
    },
    errorTextNumkey: 'minPurchaseNum'
  }, {
    errorCode: '0125',
    errorText: num => {
      return t(`cart.b2b.amount.most.desc`, {
        num
      });
    },
    errorTextNumkey: 'maxPurchaseNum'
  }, {
    errorCode: '0126',
    errorText: num => {
      return t(`cart.b2b.amount.noIncrement.desc`, {
        num
      });
    },
    errorTextNumkey: 'purchaseIncrementNum'
  }];
  class PromotionLimited {
    constructor(props) {
      this.state = {
        ...props
      };
    }
    shouldRender() {
      const {
        errorList
      } = this.state;
      return errorList.length && newErrorTextKeyMap.map(item => item.errorCode).includes(errorList[0]);
    }
    getComponent() {
      if (![...cartLimitedEnum.ACTIVE, ...cartLimitedEnum.B2B_PURCHASE].includes(this.state.maxPurchaseReasonCode) || !this.shouldRender()) {
        return '';
      }
      const errorConfig = newErrorTextKeyMap.find(item => item.errorCode === this.state.errorList[0]);
      return `<div>${errorConfig.errorText(this.state[errorConfig.errorTextNumkey] || '')}</div>`;
    }
    render() {
      this.component = this.getComponent();
      return this.component;
    }
  }
  _exports.default = PromotionLimited;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/components/promotion-limited/render.js'] = window.SLM['cart/script/components/promotion-limited/render.js'] || function () {
  const _exports = {};
  const PromotionLimited = window['SLM']['cart/script/components/promotion-limited/index.js'].default;
  class FlashSaleModel {
    renderPromotionLimited(id, data) {
      const html = new PromotionLimited(data).render(id);
      return html;
    }
    initPromotionLimited() {
      const allFlashSaleEle = $('[data-promotion-limited-item-id]');
      if (!allFlashSaleEle.length) {
        return;
      }
      allFlashSaleEle.map((_, ele) => {
        const curEle = $(ele);
        const data = curEle.data('promotion-limited-data');
        return curEle.html(this.renderPromotionLimited(curEle.attr('data-promotion-limited-item-id'), data));
      });
    }
  }
  const model = new FlashSaleModel();
  _exports.default = {
    staticRender: (id, data) => model.renderPromotionLimited(id, data),
    initialModel: () => model.initPromotionLimited()
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/active/js/index.js'] = window.SLM['theme-shared/components/hbs/active/js/index.js'] || function () {
  const _exports = {};
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/components/sku-card.js'] = window.SLM['cart/script/components/sku-card.js'] || function () {
  const _exports = {};
  const Cookie = window['js-cookie']['default'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { nullishCoalescingOperator, get_func } = window['SLM']['theme-shared/utils/syntax-patch.js'];
  const { t: I18n } = window['SLM']['theme-shared/utils/i18n.js'];
  const previewImage = window['@yy/sl-pod-preview-image']['default'];
  const { convertFormat: format } = window['SLM']['theme-shared/utils/newCurrency/CurrencyConvert.js'];
  const { escape } = window['lodash'];
  const get = window['lodash']['get'];
  const getCartPromotionBarContent = window['SLM']['theme-shared/components/hbs/cartSalesPromotion/js/index.js'].default;
  const { Owner, Action } = window['@yy/sl-theme-shared']['/utils/logger/sentryReport'];
  const { getDiscountCodeName } = window['SLM']['theme-shared/utils/trade/discount-code.js'];
  const LoggerService = window['SLM']['commons/logger/index.js'].default;
  const { Status: LoggerStatus } = window['SLM']['commons/logger/index.js'];
  const utils = window['SLM']['commons/utils/index.js'].default;
  const imgUrl = window['SLM']['commons/utils/imgUrl.js'].default;
  const CartService = window['SLM']['cart/script/service/cart/service.js'].default;
  const SkuStepper = window['SLM']['cart/script/components/sku-stepper.js'].default;
  const RemoveButton = window['SLM']['cart/script/components/remove-button.js'].default;
  const RemoveAllButton = window['SLM']['cart/script/components/remove-all-button.js'].default;
  const cartReport = window['SLM']['cart/script/report/cartReport.js'].default;
  const valuer = window['SLM']['cart/script/valuer/index.js'].default;
  const promotionLimited = window['SLM']['cart/script/components/promotion-limited/render.js'].default;
  const { cartLimitedEnum } = window['SLM']['cart/script/constant/stockType.js'];
  const logger = LoggerService.pipeOwner(`${Owner.Cart} components/sku-card`);
  const cartToken = Cookie.get('t_cart');
  const setCursorPosition = (originDomEle, pos) => {
    if (document.selection) {
      const sel = originDomEle.createTextRange();
      sel.moveStart('character', pos);
      sel.collapse();
      sel.select();
    } else if (originDomEle) {
      if (originDomEle.selectionStart) originDomEle.selectionStart = pos;
      if (originDomEle.selectionEnd) originDomEle.selectionEnd = pos;
    }
  };
  const encodeHTML = function (str) {
    if (typeof str === 'string') {
      return str.replace(/<|&|>/g, function (matches) {
        return {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;'
        }[matches];
      });
    }
    return '';
  };
  class SkuCard {
    constructor(ctx, tradeCartType) {
      this.ctx = ctx;
      this.tradeCartType = tradeCartType;
      if (tradeCartType === 'main') {
        this.scrollContent = document.documentElement;
      } else {
        this.scrollContent = $('.trade_mini_cart .trade_cart_not_empty_wrapper').get(0);
      }
      this.rootWrapper = $(`#${tradeCartType}-trade-cart-sku-list`);
      this.cartData = SL_State.get('cartInfo');
      this.loadFailedImgSet = new Set();
      this.preFocusedInputEle = null;
      this.needForceFocus = false;
    }
    init() {
      const {
        cartData
      } = this;
      logger.info(`normal 主站购物车 SkuCard init`, {
        data: {
          cartToken,
          cartData
        },
        action: Action.InitCart,
        status: LoggerStatus.Start
      });
      try {
        this.activeItems = cartData ? cartData.activeItems || [] : [];
        this.inactiveItems = cartData ? cartData.inactiveItems || [] : [];
        this.preprocessDiscountData();
        this.reset();
        this.listenPlatformChange();
        this.listenCartDataUpdate();
        this.listenCartSkuInfoPreview();
        this.listenSelectContentReport();
        promotionLimited.initialModel();
      } catch (error) {
        logger.error(`normal 主站购物车 SkuCard init 失败`, {
          data: {
            cartToken,
            cartData
          },
          error,
          action: Action.InitCart,
          errorLevel: 'P0'
        });
      }
      logger.info(`normal 主站购物车 SkuCard init`, {
        data: {
          cartToken,
          cartData
        },
        action: Action.InitCart,
        status: LoggerStatus.Success
      });
    }
    setPreFocusedInputEle(info) {
      this.preFocusedInputEle = this.preFocusedInputEle || {};
      this.preFocusedInputEle = {
        ...this.preFocusedInputEle,
        ...info
      };
    }
    setNeedForceFocus(status) {
      this.needForceFocus = status;
    }
    forceInputFocusIfNecessary() {
      const _that = this;
      if (this.needForceFocus && this.preFocusedInputEle) {
        const {
          id,
          pos
        } = _that.preFocusedInputEle;
        const inputEle = $(`#${id}`).find('.cart-stepper-input');
        const originDomEle = inputEle.get(0);
        inputEle.trigger('focus');
        setCursorPosition(originDomEle, pos);
        _that.setNeedForceFocus(false);
        _that.preFocusedInputEle = null;
      }
    }
    reset(isRerender) {
      try {
        const {
          activeItems,
          inactiveItems
        } = this;
        logger.info(`normal 主站购物车 SkuCard reset`, {
          data: {
            cartToken,
            activeItems,
            inactiveItems
          },
          action: Action.EditCart,
          status: LoggerStatus.Start
        });
        this.needUnbindEleList = [];
        this.listenImageLoadEvent();
        this.activeItems.forEach && this.activeItems.forEach((activeItem, findex) => {
          activeItem.itemList && activeItem.itemList.forEach && activeItem.itemList.forEach((item, index) => {
            const {
              skuId,
              spuId,
              groupId,
              uniqueSeq,
              businessFlag = {}
            } = item;
            const {
              singleAdjustNum,
              singleDelete
            } = businessFlag || {};
            const rootId = `${this.tradeCartType}-card-sku-item-${nullishCoalescingOperator(groupId, '')}-${spuId}-${skuId}-${uniqueSeq}`;
            const root = $(`#${rootId}`);
            const renderEditBtn = () => {
              logger.info(`normal 主站购物车 SkuCard reset activeItems initStepper/removeBtn`, {
                data: {
                  cartToken,
                  isRerender,
                  root,
                  item,
                  id: `${findex}-${index}`
                },
                action: Action.EditCart,
                status: LoggerStatus.Start
              });
              if (singleAdjustNum) {
                this.initStepper(root, item, `${findex}-${index}`);
              }
              if (singleDelete) {
                this.initRemoveButton(root, item);
              }
              logger.info(`normal 主站购物车 SkuCard reset initStepper/removeBtn`, {
                data: {
                  cartToken,
                  isRerender,
                  root,
                  item,
                  id: `${findex}-${index}`
                },
                action: Action.EditCart,
                status: LoggerStatus.Success
              });
            };
            if (!isRerender) {
              jQuery(renderEditBtn);
            } else {
              renderEditBtn();
            }
          });
        });
        this.inactiveItems.forEach && this.inactiveItems.forEach(item => {
          const {
            skuId,
            spuId,
            groupId,
            uniqueSeq
          } = item;
          const rootId = `${this.tradeCartType}-card-sku-item-${nullishCoalescingOperator(groupId, '')}-${spuId}-${skuId}-${uniqueSeq}`;
          const root = $(`#${rootId}`);
          const renderRemoveBtn = () => {
            logger.info(`normal 主站购物车 SkuCard reset inactiveItems initRemoveBtn`, {
              data: {
                cartToken,
                activeItems,
                inactiveItems
              },
              action: Action.EditCart,
              status: LoggerStatus.Start
            });
            this.initRemoveButton(root, item);
            logger.info(`normal 主站购物车 SkuCard reset inactiveItems initRemoveBtn`, {
              data: {
                cartToken,
                activeItems,
                inactiveItems
              },
              action: Action.EditCart,
              status: LoggerStatus.Success
            });
          };
          if (!isRerender) {
            jQuery(renderRemoveBtn);
          } else {
            renderRemoveBtn();
          }
        });
        const renderClearBtn = () => {
          logger.info(`normal 主站购物车 SkuCard reset inactiveItems initClearBtn`, {
            data: {
              cartToken,
              inactiveItems
            },
            action: Action.EditCart,
            status: LoggerStatus.Start
          });
          this.getDeviceInfo();
          this.initRemoveAllButton(this.inactiveItems);
          logger.info(`normal 主站购物车 SkuCard reset inactiveItems initClearBtn`, {
            data: {
              cartToken,
              inactiveItems
            },
            action: Action.EditCart,
            status: LoggerStatus.Success
          });
        };
        if (!isRerender) {
          jQuery(renderClearBtn);
        } else {
          renderClearBtn();
        }
        logger.info(`normal 主站购物车 SkuCard reset`, {
          data: {
            cartToken,
            activeItems,
            inactiveItems
          },
          action: Action.EditCart,
          status: LoggerStatus.Success
        });
      } catch (error) {
        logger.error(`normal 主站购物车 SkuCard reset`, {
          data: {
            cartToken
          },
          error,
          action: Action.EditCart,
          errorLevel: 'P0'
        });
      }
    }
    getRendering() {
      return this.rendering;
    }
    setRendering(rendering) {
      this.rendering = rendering;
    }
    listenImageLoadEvent() {
      const _that = this;
      this.rootWrapper.find('.trade-cart-sku-item-image-wrapper').each((index, img) => {
        this.needUnbindEleList.push($(img));
        $(img).on('error', function () {
          $(img).parent().children('.trade-cart-sku-item-image-fallback').removeClass('hide');
          $(img).addClass('hide');
          _that.loadFailedImgSet.add($(img).attr('origin-src'));
        });
      });
    }
    listenCartDataUpdate() {
      logger.info(`normal 主站购物车 SkuCard CartDataUpdate`, {
        data: {
          cartToken
        },
        action: Action.EditCart,
        status: LoggerStatus.Start
      });
      CartService.cartEventBus.on(CartService.CartEventBusEnum.UPDATE, data => {
        logger.info(`normal 主站购物车 SkuCard CartDataUpdateListener`, {
          data: {
            cartToken,
            cartInfo: data
          },
          action: Action.EditCart,
          status: LoggerStatus.Start
        });
        const {
          scrollTop
        } = this.scrollContent;
        this.reRender(data);
        this.setRendering(false);
        setTimeout(() => {
          this.scrollContent.scrollTop = scrollTop;
        }, 0);
        logger.info(`normal 主站购物车 SkuCard CartDataUpdate`, {
          data: {
            cartToken
          },
          action: Action.EditCart,
          status: LoggerStatus.Success
        });
      });
    }
    listenPlatformChange() {
      utils.helper.listenPlatform(platform => {
        const cartSkuWrapper = this.rootWrapper;
        this.preImageWidth = this.imageWidth;
        if (['pc', 'pad'].includes(platform)) {
          cartSkuWrapper.removeClass('is-mobile');
          cartSkuWrapper.addClass('is-pc');
        } else {
          cartSkuWrapper.removeClass('is-pc');
          cartSkuWrapper.addClass('is-mobile');
        }
        this.getDeviceInfo();
        if (this.preImageWidth !== this.imageWidth) {
          cartSkuWrapper.find('.trade-cart-sku-item-image-wrapper').each((index, img) => {
            $(img).prop('src', this.getImageUrl($(img).attr('origin-src')));
          });
        }
      });
    }
    listenSelectContentReport() {
      this.rootWrapper.on('click', '.trade-cart-sku-item-image', function () {
        const {
          productSource,
          skuId,
          name,
          skuAttrs,
          price,
          salePrice,
          itemNo,
          quantity,
          customCategoryName
        } = $(this).data();
        if (productSource === 1) {
          cartReport.selectContent({
            skuId,
            name,
            quantity,
            price: parseInt(salePrice, 10) > parseInt(price, 10) ? salePrice : price,
            skuAttrs,
            itemNo,
            customCategoryName
          });
        }
      });
    }
    searchParentNode(curNode, count) {
      count += 1;
      const parentNode = curNode ? curNode.parentElement : null;
      if (Array.from(parentNode ? parentNode.classList : []).includes('trade-cart-sku-item-customization-preview-btn')) {
        return parentNode;
      }
      if (count > 10) {
        return null;
      }
      return this.searchParentNode(parentNode, count);
    }
    listenCartSkuInfoPreview() {
      this.rootWrapper.on('click', e => {
        const findCount = 0;
        if (Array.from(e.target ? e.target.classList : []).includes('trade-cart-sku-item-customization-preview-btn')) {
          const urls = JSON.parse(get(e, 'target.dataset.previewList', '[]'));
          if (urls.length) previewImage({
            urls
          });
        } else {
          const parentNode = this.searchParentNode(e.target, findCount);
          if (parentNode) {
            const urls = JSON.parse(get(parentNode, 'dataset.previewList', '[]'));
            if (urls.length) previewImage({
              urls
            });
          }
        }
      });
    }
    preprocessDiscountData() {
      this.skuNumMap = {};
      this.activeItems.forEach && this.activeItems.forEach(activeItems => {
        activeItems.itemList && activeItems.itemList.forEach && activeItems.itemList.forEach(item => {
          const {
            spuId,
            skuId,
            groupId,
            num
          } = item;
          const key = `${groupId}_${spuId}_${skuId}`;
          this.skuNumMap[key] = this.skuNumMap[key] || 0;
          this.skuNumMap[key] += num;
        });
      });
    }
    getDeviceInfo() {
      const skuCardListEle = this.rootWrapper;
      const className = [];
      className.push(skuCardListEle.hasClass('main') ? 'main' : 'sidebar');
      className.push(skuCardListEle.hasClass('is-pc') ? 'is-pc' : 'is-mobile');
      this.wrapperBaseClassName = className;
      this.updateImageWidth();
    }
    updateImageWidth() {
      if (this.wrapperBaseClassName.includes('main') && this.wrapperBaseClassName.includes('is-pc')) {
        this.imageWidth = 150;
      } else {
        this.imageWidth = 100;
      }
    }
    getImageWidth() {
      return this.imageWidth;
    }
    getImageUrl(src) {
      return imgUrl(src, {
        width: this.getImageWidth(),
        scale: 2
      });
    }
    getCardItemAttrs(item) {
      let str = '';
      const properties = (item.properties || []).filter(i => {
        if (['customer', 'all'].includes(i.roleVisibility)) {
          return true;
        }
        if (['merchant', 'none'].includes(i.roleVisibility)) {
          return false;
        }
        return i.show;
      }) || [];
      str = `<div class="trade-cart-sku-item-info-wrapper">
    ${this.getItemSkuAttr(item.skuAttributes)}
    ${properties.length ? this.getItemSkuProperties(item.properties) : ''}
    ${this.getItemSubscriptionInfo(item.subscriptionInfo)}${this.getItemSkuCustomTips(item.customProductTips)}<div class="slot-cart slot-cart-item-info" data-slot-cart-item-info></div>${this.getPromotionAmountInfo(item)}</div>`;
      return str;
    }
    getItemSkuAttr(skuAttr) {
      const skuContent = [];
      if (skuAttr && skuAttr.length) {
        skuAttr.forEach(data => {
          skuContent.push(`
        <div class="trade-cart-sku-item-info-spec body4">
        <div class="trade-cart-sku-item-info-spec-key">${encodeHTML(data.attributeName)}:</div>
        <div class="trade-cart-sku-item-info-spec-value">${encodeHTML(data.attributeValue)}</div>
        </div>`);
        });
      }
      return skuContent.join('\n');
    }
    getItemSkuProperties(skuProperties) {
      const skuContent = [];
      if (skuProperties.length) {
        skuProperties.forEach(data => {
          const addonBefore = `<div class="trade-cart-sku-item-info-spec body3" translate="no">
        <div class="trade-cart-sku-item-info-spec-key">${encodeHTML(data.name)}:</div>
        `;
          let content = ``;
          if (data.type === 'text') {
            content = `<div class="trade-cart-sku-item-info-spec-value">${data.value}</div>`;
          } else if (data.type === 'picture') {
            content = `<div class="trade-cart-sku-item-info-spec-value trade-cart-sku-item-customization trade-cart-sku-item-customization-preview-btn" data-preview-list=${JSON.stringify(data.urls)}>${I18n('cart.item.custom_preview')}</div>`;
          } else if (data.type === 'link') {
            content = `<div class="trade-cart-sku-item-info-spec-value trade-cart-sku-item-customization trade-cart-sku-item-customization-look-btn">
                        <a class="body3" href='${data.urls ? data.urls[0] : ''}' target="_blank">${I18n('cart.item.click_to_view')}</a></div>`;
          }
          const addonAfter = `
        </div>`;
          skuContent.push(`${addonBefore}${content}${addonAfter}`);
        });
      }
      return skuContent.join('\n');
    }
    getItemSkuCustomTips(customProductTips) {
      const tipsContent = [];
      if (customProductTips && customProductTips.length) {
        customProductTips.forEach(data => {
          tipsContent.push(`
        <div class="trade-cart-sku-item-info-customTip notranslate">${encodeHTML(data)}</div>`);
        });
      }
      return tipsContent.join('\n');
    }
    getItemSubscriptionInfo(subscriptionInfo) {
      let subscriptionInfoName = '';
      if (subscriptionInfo && subscriptionInfo.sellingPlanName) {
        subscriptionInfoName = `
        <div class="trade-cart-sku-item-info-spec body3">
              <div class="trade-cart-sku-item-info-spec-key">${I18n('cart.subscription.information')}:</div>
              <div class="trade-cart-sku-item-info-spec-value">${subscriptionInfo.sellingPlanName}</div>
            </div>
      `;
      }
      return subscriptionInfoName;
    }
    getStepper(count, indexStr, isError) {
      return `
      <span class="cart-stepper ${isError ? 'cart-stepper_error' : ''}">
          <span class="cart-stepper-minus">
              <span class="cart-stepper-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M9 5H1" stroke-linecap="round" />
                </svg>
              </span>
          </span>
          <input class="cart-stepper-input body4 ${indexStr}" type="text" value=${count}>
          <span class="cart-stepper-plus">
              <span class="cart-stepper-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M9 5H1" stroke-linecap="round" />
                  <path d="M5 1L5 9" stroke-linecap="round" />
                </svg>
              </span>
          </span>
      </span>
    `;
    }
    getInfoLeft(data, isInactive, indexStr) {
      if (data.businessFlag && data.businessFlag.singleAdjustNum === false || data.maxPurchaseTotalNum === 0 && cartLimitedEnum.NORMAL_STOCK_OVER.includes(data.maxPurchaseReasonCode) || isInactive) {
        return `<div class="trade-cart-sku-item-info-sku-number body3">x<span>${data.num}</span></div>`;
      }
      return `<div class="trade-cart-sku-item-info-left-stepper">${this.getStepper(data.num, indexStr, data.errorList.length && data.errorList[0] !== '0105')}</div>`;
    }
    getRemoveButton(data) {
      return !data.businessFlag || data.businessFlag && data.businessFlag.singleDelete ? `<div class="trade-cart-sku-item-remove"><button class="trade-cart-sku-item-remove-button body3 btn-link">${I18n('cart.checkout_proceeding.remove')}</button></div>` : '';
    }
    getPriceInfo(data) {
      const isShowScribingPrice = parseInt(data.lineLevelTotalDiscount, 10) > 0 && parseInt(data.originalLinePrice, 10) > parseInt(data.finalLinePrice, 10);
      if (isShowScribingPrice) {
        return `<span class="trade-cart-sku-item-info-amount-through isolate notranslate" data-amount=${data.originalLinePrice}>${format(data.originalLinePrice)}</span><span class="trade-cart-sku-item-real-price isolate notranslate trade-cart-sku-item-info-amount-sale-price" data-amount=${data.finalLinePrice}>${format(data.finalLinePrice)}${this.getVipTag(data)}<span class="slot-cart slot-cart-price-end" data-slot-cart-price-end></span>`;
      }
      return `<span class="trade-cart-sku-item-real-price isolate notranslate" data-amount=${data.finalLinePrice}>${format(data.finalLinePrice)}${this.getVipTag(data)}<span class="slot-cart slot-cart-price-end" data-slot-cart-price-end></span>`;
    }
    getVipTag(data) {
      return parseInt(data.priceType, 10) === 1 ? `<span class="trade-cart-sku-item-info-tag" data-vip-tag="small"></span>` : '';
    }
    getPromotionAmountInfo(data) {
      const hasPromotionInfo = parseInt(data.lineLevelTotalDiscount, 10) > 0 && data.lineLevelDiscountAllocations;
      if (hasPromotionInfo) {
        const html = data.lineLevelDiscountAllocations.reduce((str, item) => {
          str += `
        <div class="trade-cart-sku-item-info-discount body4">
          <div class="trade-cart-sku-item-info-discount-icon">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M1.0288 5.44651C1.01062 5.59875 1.0633 5.75092 1.17172 5.85934L6.1054 10.793C6.49593 11.1835 7.12909 11.1835 7.51962 10.793L10.7929 7.51974C11.1834 7.12921 11.1834 6.49605 10.7929 6.10552L5.85922 1.17184C5.7508 1.06342 5.59863 1.01074 5.44639 1.02892L1.89057 1.4535C1.6614 1.48086 1.48074 1.66152 1.45337 1.89069L1.0288 5.44651ZM4.00001 3.00013C4.55229 3.00013 5.00001 3.44785 5.00001 4.00013C5.00001 4.55241 4.55229 5.00013 4.00001 5.00013C3.44772 5.00013 3.00001 4.55241 3.00001 4.00013C3.00001 3.44785 3.44772 3.00013 4.00001 3.00013Z" fill="#C20000"/>
          </svg>
          ${getDiscountCodeName(item) ? `<span>&nbsp;${getDiscountCodeName(item)}</span>` : ''}
          </div>
          <div class="trade-cart-sku-item-info-discount-number"><span>&nbsp;(-</span><span class="isolate notranslate is-promotion" data-amount=${item.amount}>${format(item.amount)}</span><span>)</span></div>
        </div>`;
          return str;
        }, '');
        return html;
      }
      if (data && data.businessFlag && !data.businessFlag.discountable) {
        return `<div class="trade-cart-sku-item-info-discount sale-color body4">${I18n('cart.promotion.no_promotion')}</div>`;
      }
      return '';
    }
    getImageFallbackIfNecessary(data) {
      const url = this.getImageUrl(data.image);
      if (!url || this.loadFailedImgSet.has(data.image)) {
        return `<div class="trade-cart-sku-item-image-fallback"></div>`;
      }
      return `
    <div class="hide trade-cart-sku-item-image-fallback"></div>
    <img class="trade-cart-sku-item-image-wrapper" src="${url}" origin-src="${data.image}">
    `;
    }
    getImageAccessorial(data) {
      if (data && data.length) {
        const addonBefore = `<ul class="trade-cart-sku-item-image-wrapper__accessorial__list">`;
        const content = data.map(item => ` <li style='background: url("${item}")center center;'></li>`);
        const addonAfter = `</ul>`;
        return `${addonBefore}${content}${addonAfter}`;
      }
      return ``;
    }
    getCardItemContent(data, isInactive, indexStr = '') {
      const wrapperClassName = ['shopline-element-cart-sku-item', 'trade-cart-sku-item'];
      if (data.maxPurchaseTotalNum <= 0 && cartLimitedEnum.NORMAL_STOCK_OVER.includes(data.maxPurchaseReasonCode)) {
        wrapperClassName.push('sold-out');
      }
      if (isInactive) {
        wrapperClassName.push('inactive');
      }
      const {
        groupId,
        spuId,
        handle,
        skuId,
        uniqueSeq,
        productSource,
        name,
        skuAttr,
        price,
        salePrice,
        itemNo,
        bindProductImages,
        errorList,
        customCategoryName,
        lineLevelTotalDiscount,
        originalLinePrice,
        finalLinePrice
      } = data || {};
      const id = `${this.tradeCartType}-card-sku-item-${nullishCoalescingOperator(groupId, '')}-${spuId}-${skuId}-${uniqueSeq}`;
      const hasDiscount = parseInt(lineLevelTotalDiscount, 10) > 0 && parseInt(originalLinePrice, 10) > parseInt(finalLinePrice, 10);
      const content = `
    <div class="${wrapperClassName.join(' ')}" id="${id}">
      <a class="trade-cart-sku-item-image"
         href="${productSource === 1 ? window.Shopline.redirectTo(`/products/${handle || spuId}`) : `javascript:;`}"
         data-product-source="${productSource}"
         data-group-id="${nullishCoalescingOperator(groupId, '')}"
         data-name="${escape(name)}"
         data-sku-id="${skuId}"
         data-spu-id="${spuId}"
         data-sku-attrs="${escape((skuAttr || []).join(','))}"
         data-price="${price}"
         data-sale-price="${salePrice}"
         data-item-no="${itemNo}"
         data-custom-category-name="${customCategoryName}"
       >
          ${this.getImageFallbackIfNecessary(data)}
          ${this.getImageAccessorial(bindProductImages)}
          <div class="trade-cart-sku-item-image-sold-out body6">${I18n('products.product_list.product_sold_out')}</div>
      </a>
      <div class="trade-cart-sku-item-info">
          <div class="trade-cart-sku-item-info-title body3">${encodeHTML(name)}</div>
          ${this.getCardItemAttrs(data)}
          <div class="trade-cart-sku-item-info-number">
              <div class="trade-cart-sku-item-info-left">
                  ${this.getInfoLeft(data, isInactive, indexStr)}
                  ${Array.isArray(errorList) && errorList.length ? `<span class="promotion-limited">${promotionLimited.staticRender(id, data)}</span>` : ''}
              </div>
              <div class="trade-cart-sku-item-info-amount-and-discount">
                  <div class="trade-cart-sku-item-info-amount body3 ${hasDiscount ? 'has-discount' : ''}">
                    ${this.getPriceInfo(data)}
                  </div>
              </div>
          </div>
          <div class="slot-cart slot-cart-num-editor-end" data-slot-cart-num-editor-end></div>
          ${this.getRemoveButton(data)}
      </div>
      <div class="trade-cart-sku-item-mask"></div>
    </div>
    <div class="slot-cart slot-cart-item-end" data-slot-cart-item-end></div>
    `;
      this.templateContent.push(content);
    }
    generateActiveItemTemplate(activeItemData, findex) {
      if (activeItemData && activeItemData.promotion) {
        this.templateContent.push(getCartPromotionBarContent(activeItemData.promotion, this.rootWrapper, activeItemData));
      }
      activeItemData.itemList.forEach((data, index) => {
        this.getCardItemContent(data, false, `${findex}-${index}`);
      });
    }
    generateInactiveItemTemplate(inactiveItems) {
      this.templateContent.push(`<div class="trade-cart-sku-list-inactive-wrapper">
      <div class="trade-cart-sku-list-inactive-wrapper-title body3">${I18n('transaction.item.invalid_product')}</div>
      <button class="trade-cart-sku-list-inactive-wrapper-remove-all body3 btn-link" id="${this.tradeCartType}-trade-cart-sku-list-inactive-wrapper-remove-all">${I18n('transaction.item.remove_invalid_product')}</button>
    </div>`);
      inactiveItems.forEach(data => {
        this.getCardItemContent(data, true);
      });
    }
    showEmptyCart(show) {
      if (show) {
        $('.trade_cart_empty_wrapper').removeClass('hide');
        $('.trade_cart_not_empty_wrapper').addClass('hide');
      } else {
        $('.trade_cart_empty_wrapper').addClass('hide');
        $('.trade_cart_not_empty_wrapper').removeClass('hide');
      }
    }
    reRender(data) {
      logger.info(`normal 主站购物车 SkuCard reRender`, {
        data: {
          cartToken,
          cartInfo: data
        },
        action: Action.EditCart,
        status: LoggerStatus.Start
      });
      if (data.count === 0) {
        this.showEmptyCart(true);
        return;
      }
      this.showEmptyCart(false);
      this.cartData = data;
      this.showEmptyCart(false);
      this.activeItems = data.activeItems;
      this.inactiveItems = data.inactiveItems;
      this.preprocessDiscountData();
      this.templateContent = [];
      this.needUnbindEleList.forEach(ele => {
        ele && ele.unbind && ele.unbind();
      });
      try {
        data.activeItems.forEach((activeItem, findex) => {
          this.templateContent.push(`<div class="trade-cart-sku-list-module${activeItem.promotion ? ' has-promotion' : ''}">`);
          this.generateActiveItemTemplate(activeItem, findex);
          this.templateContent.push('</div>');
        });
        if (data.inactiveItems.length) {
          this.templateContent.push('<div class="trade-cart-sku-list-module inactive">');
          this.generateInactiveItemTemplate(data.inactiveItems);
          this.templateContent.push('</div>');
        }
        const finalHtml = this.templateContent.join('\n');
        this.rootWrapper.html(finalHtml);
        window.SL_EventBus.emit('global.activeIcon.show', {
          type: 'vip'
        });
        get_func(window, 'Shopline.event.emit').exec('Cart::LineItemUpdate');
        this.reset(true);
        this.forceInputFocusIfNecessary();
        logger.info(`normal 主站购物车 SkuCard reRender`, {
          data: {
            cartToken,
            cartInfo: data
          },
          action: Action.EditCart,
          status: LoggerStatus.Success
        });
      } catch (e) {
        logger.error(`normal 主站购物车 SkuCard reRender`, {
          data: {
            cartToken,
            cartInfo: data
          },
          action: Action.EditCart,
          error: e
        });
      }
    }
    initStepper(root, itemInfo, indexStr) {
      if (root.find('.cart-stepper').length > 0) {
        const {
          activeItems
        } = this;
        const {
          spuId,
          skuId,
          priceType,
          num,
          skuAttr,
          stockType,
          name,
          price,
          groupId,
          productSource,
          maxPurchaseNum,
          maxPurchaseTotalNum,
          maxPurchaseReasonCode,
          itemNo,
          minPurchaseNum,
          purchaseIncrementNum
        } = itemInfo;
        const stepper = new SkuStepper({
          root,
          name,
          price,
          normalSkuNum: num,
          totalSkuNum: this.skuNumMap[`${groupId}_${spuId}_${skuId}`] || num,
          disabled: false,
          spuId,
          skuId,
          priceType,
          stockType,
          skuAttr,
          setRendering: this.setRendering.bind(this),
          isRendering: this.getRendering.bind(this),
          cartType: this.tradeCartType,
          setPreFocusedInputEle: this.setPreFocusedInputEle.bind(this),
          setNeedForceFocus: this.setNeedForceFocus.bind(this),
          groupId,
          productSource,
          maxPurchaseNum,
          maxPurchaseTotalNum,
          maxPurchaseReasonCode,
          indexStr,
          activeItems,
          itemNo,
          minPurchaseNum,
          purchaseIncrementNum
        });
        try {
          stepper.init();
        } catch (error) {
          logger.error(`normal 主站购物车 SkuCard initStepper`, {
            data: {
              cartToken
            },
            action: Action.EditCart,
            error
          });
        }
        this.needUnbindEleList.push(stepper);
      }
    }
    initRemoveButton(root, itemInfo) {
      if (root.find('.trade-cart-sku-item-remove-button').length > 0) {
        const removeButton = new RemoveButton({
          root,
          itemInfo,
          cartActionHooks: this.cardActionHooks
        });
        removeButton.init();
        this.needUnbindEleList.push(removeButton);
      }
    }
    initRemoveAllButton(inactiveItems) {
      const removeAllButton = new RemoveAllButton(`#${this.tradeCartType}-trade-cart-sku-list-inactive-wrapper-remove-all`, inactiveItems, this.cardActionHooks);
      removeAllButton.init();
      this.needUnbindEleList.push(removeAllButton);
    }
    get cardActionHooks() {
      return valuer.cartActionHooksValuer.takeCartActionHooks(this.ctx);
    }
  }
  _exports.default = SkuCard;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/shared/components/tooltip/index.js'] = window.SLM['theme-shared/components/hbs/shared/components/tooltip/index.js'] || function () {
  const _exports = {};
  const throttle = window['lodash']['throttle'];
  const getTemplate = options => {
    return `
    <div class="mp-tooltip mp-tooltip--placement-top mp-tooltip--hidden ${options.mobileHide ? 'mp-tooltip-mobile--hidden' : ''} " style="z-index: ${options.zIndex}">
      <div class="mp-tooltip__content">
        <div class="mp-tooltip__arrow">
          <span class="mp-tooltip__arrow-content" style="background: ${options.color}"></span>
        </div>
        <div class="mp-tooltip__inner" style="background: ${options.color}">
          ${options.title}
        </div>
      </div>
    </div>
  `;
  };
  const defaultOptions = {
    color: '#000',
    trigger: 'hover',
    mobileHide: false
  };
  const HIDDEN_CLASSNAME = 'mp-tooltip--hidden';
  const CONTENT_CLASSNAME = 'mp-tooltip__inner';
  const ARROW_CLASSNAME = 'mp-tooltip__arrow';
  const calculationPosition = ($target, $tooltip) => {
    const offset = $target.offset();
    const width = $target.outerWidth();
    const $doc = $(document);
    const scrollTop = $doc.scrollTop();
    const scrollLeft = $doc.scrollLeft();
    let left;
    let x;
    const screenWidth = $(window).width();
    const offsetLeft = offset.left + width / 2 - scrollLeft;
    const tooltipWidth = $tooltip.outerWidth();
    if (offsetLeft <= tooltipWidth / 2) {
      left = tooltipWidth / 2 + 10;
      x = offsetLeft - 10;
    } else if (offsetLeft + tooltipWidth / 2 >= screenWidth) {
      left = screenWidth - tooltipWidth / 2 - 10;
      x = tooltipWidth - screenWidth + offsetLeft + 10;
    } else {
      left = offsetLeft;
      x = tooltipWidth / 2;
    }
    return {
      left,
      top: offset.top - scrollTop,
      x
    };
  };
  class Tooltip {
    constructor(options) {
      this.options = {
        ...defaultOptions,
        ...options
      };
      this.$target = $(this.options.selector);
      this.clickEventId = Math.random().toString(32).slice(-8);
      this.$tooltips = [];
      this.isShow = false;
      this.init();
    }
    static install($ = window.jQuery) {
      if (!$.fn.tooltip) {
        $.fn.extend({
          tooltip(options) {
            new Tooltip({
              ...options,
              selector: this
            });
            return this;
          }
        });
      }
      return this;
    }
    init() {
      this.walk();
      const calc = throttle(() => {
        this.$tooltips.forEach(tooltip => this.setPosition($(tooltip), this.$target));
      });
      const targetContainer = this.options.targetContainer;
      const bindScrollTarget = targetContainer ? targetContainer : document;
      $(bindScrollTarget).scroll(() => {
        if (this.isShow) {
          calc();
        }
      });
      $(window).resize(() => {
        if (this.isShow) {
          calc();
        }
      });
    }
    walk() {
      const template = getTemplate(this.options);
      this.$target.each((index, item) => {
        const $item = $(item);
        const $tooltip = $(template);
        this.$tooltips.push($tooltip);
        $('body').append($tooltip);
        this.bindEvents($tooltip, $item);
      });
    }
    bindEvents($tooltip, $target) {
      const events = {
        hover: () => {
          $(document).off(`.${this.clickEventId}`);
          $target.hover(() => {
            this.setPosition($tooltip, $target);
            $tooltip.removeClass(HIDDEN_CLASSNAME);
            this.isShow = true;
          }, () => {
            $tooltip.addClass(HIDDEN_CLASSNAME);
            this.isShow = false;
          });
        },
        click: () => {
          $target.off('mouseenter mouseleave');
          $(document).on(`click.${this.clickEventId}`, event => {
            const $tar = $(event.target);
            if (!$tar.closest($target).length && !$target.hasClass(HIDDEN_CLASSNAME)) {
              $tooltip.addClass(HIDDEN_CLASSNAME);
              this.isShow = false;
            } else {
              this.setPosition($tooltip, $target);
              $tooltip.removeClass(HIDDEN_CLASSNAME);
              this.isShow = true;
            }
          });
        }
      };
      if (typeof events[this.options.trigger] === 'function') {
        events[this.options.trigger]();
      }
    }
    toggle({
      title,
      trigger
    }) {
      if (title !== undefined || title !== null) {
        this.options.title = title;
        this.$tooltips.forEach(item => {
          $(item).find(`.${CONTENT_CLASSNAME}`).html(title);
        });
      }
      if (trigger) {
        this.options.trigger = trigger;
        this.$target.each((index, item) => {
          const $item = $(item);
          const $tooltip = this.$tooltips[index];
          this.bindEvents($tooltip, $item);
        });
      }
    }
    setPosition($tooltip, $target) {
      const offset = calculationPosition($target, $tooltip);
      $tooltip.css({
        left: offset.left,
        top: offset.top
      });
      $tooltip.find(`.${ARROW_CLASSNAME}`).css({
        left: offset.x
      });
    }
    show(title) {
      this.$tooltips.forEach(item => {
        $(item).removeClass(HIDDEN_CLASSNAME).find(`.${CONTENT_CLASSNAME}`).html(title);
      });
      this.isShow = true;
    }
    hide() {
      this.$tooltips.forEach(item => {
        $(item).addClass(HIDDEN_CLASSNAME);
      });
      this.isShow = false;
    }
    destroy() {
      this.isShow = false;
      this.$tooltips.forEach(item => {
        $(item).remove();
      });
    }
  }
  _exports.default = Tooltip;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/components/tooltip/index.js'] = window.SLM['commons/components/tooltip/index.js'] || function () {
  const _exports = {};
  const tooltip = window['SLM']['theme-shared/components/hbs/shared/components/tooltip/index.js'].default;
  _exports.default = tooltip;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/components/trade-checkbox/index.js'] = window.SLM['cart/script/components/trade-checkbox/index.js'] || function () {
  const _exports = {};
  const { get_func } = window['SLM']['theme-shared/utils/syntax-patch.js'];
  const TradeEventBus = window['SLM']['cart/script/utils/event-bus/index.js'].default;
  const changeStyleByCheckBoxStatus = (status, parentEle) => {
    if (status) {
      get_func(parentEle, 'classList.add').exec('trade_checkout_checkbox-checked');
    } else {
      get_func(parentEle, 'classList.remove').exec('trade_checkout_checkbox-checked');
    }
  };
  const changeStyleByCheckBoxDisbaledStatus = (status, parentEle) => {
    if (status) {
      get_func(parentEle, 'classList.add').exec('trade_checkout_checkbox-disabled');
    } else {
      get_func(parentEle, 'classList.remove').exec('trade_checkout_checkbox-disabled');
    }
  };
  const handleShowTipCheckboxClick = (event, parentEle, ele) => {
    const isChecked = ele.checked;
    const eleId = ele.getAttribute('id');
    changeStyleByCheckBoxStatus(isChecked, parentEle);
    if (eleId) {
      TradeEventBus.emit(`trade:checkbox-${eleId}`, isChecked);
    }
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('input', true, true);
    const target = document.getElementById(eleId);
    if (event.target === target) return;
    if (target) {
      target.checked = ele.checked;
      target.dispatchEvent(evt);
    }
  };
  const handleWrapperClick = (event, parentEle, inputEle) => {
    if (inputEle.disabled) return;
    if (event.target !== inputEle) {
      inputEle.checked = !inputEle.checked;
    }
    handleShowTipCheckboxClick(event, parentEle, inputEle);
  };
  const bindListenerToWrapper = (wrapper, parentEle, inputEle) => {
    wrapper.addEventListener('click', event => {
      handleWrapperClick(event, parentEle, inputEle);
    });
  };
  const bindListener = ele => {
    const wrapperEle = ele.parentElement;
    const hasWrapper = get_func(wrapperEle, 'classList.contains').exec('trade_checkout_checkbox_wrapper');
    const inputEle = get_func(ele, 'getElementsByClassName').exec('trade_checkout_checkbox-input')[0];
    if (hasWrapper) {
      bindListenerToWrapper(wrapperEle, ele, inputEle);
    } else {
      inputEle.addEventListener('click', event => {
        handleShowTipCheckboxClick(event, ele, inputEle);
      });
    }
  };
  const updateCheckBoxStatus = (status, parentEle) => {
    Array.from(parentEle).forEach(ele => {
      changeStyleByCheckBoxStatus(status, ele);
      const inputEle = get_func(ele, 'getElementsByClassName').exec('trade_checkout_checkbox-input')[0];
      inputEle.checked = status;
    });
  };
  _exports.updateCheckBoxStatus = updateCheckBoxStatus;
  const updateCheckBoxDisabledStatus = (status, parentEle) => {
    Array.from(parentEle).forEach(ele => {
      changeStyleByCheckBoxDisbaledStatus(status, ele);
      const inputEle = get_func(ele, 'getElementsByClassName').exec('trade_checkout_checkbox-input')[0];
      inputEle.disabled = status;
    });
  };
  _exports.updateCheckBoxDisabledStatus = updateCheckBoxDisabledStatus;
  const initTradeCheckbox = () => {
    const eleList = document.getElementsByClassName('trade_checkout_checkbox');
    Array.from(eleList).forEach(ele => {
      bindListener(ele);
    });
  };
  _exports.default = initTradeCheckbox;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/biz/trade-summations/index.js'] = window.SLM['cart/script/biz/trade-summations/index.js'] || function () {
  const _exports = {};
  const Cookie = window['js-cookie']['default'];
  const throttle = window['lodash']['throttle'];
  const { convertFormat } = window['SLM']['theme-shared/utils/newCurrency/CurrencyConvert.js'];
  const { nullishCoalescingOperator, get } = window['SLM']['theme-shared/utils/syntax-patch.js'];
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const { Owner, Action } = window['@yy/sl-theme-shared']['/utils/logger/sentryReport'];
  const { initDetailModal, updateDetailModal } = window['@sl/cart']['/lib/summations/detailModal'];
  const store = window['@sl/cart']['/lib/utils/store'].default;
  const utils = window['SLM']['commons/utils/index.js'].default;
  const LoggerService = window['SLM']['commons/logger/index.js'].default;
  const { Status: LoggerStatus } = window['SLM']['commons/logger/index.js'];
  const Tooltip = window['SLM']['commons/components/tooltip/index.js'].default;
  const CartService = window['SLM']['cart/script/service/cart/index.js'].default;
  const TradeEventBus = window['SLM']['cart/script/utils/event-bus/index.js'].default;
  const { updateCheckBoxStatus, updateCheckBoxDisabledStatus } = window['SLM']['cart/script/components/trade-checkbox/index.js'];
  const logger = LoggerService.pipeOwner(`${Owner.Cart} biz/trade-summations/index.js`);
  const cartToken = Cookie.get('t_cart');
  let tooltip;
  const info_tips_icon = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="cursor: pointer; {{style}}">
<circle cx="6" cy="6" r="5.5" stroke="currentColor"/>
<path d="M6 3V6.5" stroke="currentColor" stroke-linecap="round"/>
<circle cx="6" cy="8.75" r="0.75" fill="currentColor"/>
</svg>
`;
  const coupon_icon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.3">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M1.71487 9.07739C1.68457 9.33113 1.77237 9.58475 1.95307 9.76545L10.1759 17.9883C10.8267 18.6391 11.882 18.6391 12.5329 17.9883L17.9884 12.5328C18.6392 11.8819 18.6392 10.8266 17.9884 10.1758L9.76557 1.95295C9.58487 1.77225 9.33126 1.68445 9.07751 1.71475L3.15115 2.42237C2.7692 2.46798 2.4681 2.76908 2.42249 3.15103L1.71487 9.07739ZM6.66688 5.00009C7.58736 5.00009 8.33355 5.74629 8.33355 6.66676C8.33355 7.58724 7.58736 8.33343 6.66688 8.33343C5.74641 8.33343 5.00022 7.58724 5.00022 6.66676C5.00022 5.74629 5.74641 5.00009 6.66688 5.00009Z"
                      fill="currentColor" />
                  </g>
                </svg>

`;
  const MAX_AMOUNT = 999999999999999;
  class Summations {
    constructor() {
      this._data = {};
      this._cartType = '';
      this.getTriggerType = platform => platform === 'pc' ? 'hover' : 'click';
      this.getEles = key => $(`.trade_summations_fee[data-key="${key}"]`);
      this._renderTooltip = isMutra => {
        if (tooltip) {
          tooltip.destroy();
        }
        const platform = utils.helper.getPlatform();
        let selector = '.trade_summations_fee__tips[data-show-tips="true"]';
        if (isMutra) {
          selector = '.trade_summations_fee__tips[data-has-tips="true"]';
        }
        tooltip = new Tooltip({
          selector,
          trigger: this.getTriggerType(platform),
          title: t('transaction.discount.use_coupon_alone')
        });
        $(selector).html(info_tips_icon);
      };
      this._keyList = [];
      this.getInitData = () => {
        const summationsFeeEles = document.querySelectorAll('.trade_summations_fee');
        const data = store.get() ? store.get().cartInfo || {} : {};
        const dataFromEle = Array.from(summationsFeeEles).reduce((obj, ele) => {
          const newObj = {
            ...obj
          };
          const {
            dataset,
            classList
          } = nullishCoalescingOperator(ele, {});
          const {
            key,
            showDetail
          } = nullishCoalescingOperator(dataset, {});
          initDetailModal({
            ele,
            key,
            data,
            showDetail
          });
          this._keyList = [...this._keyList, key];
          if (!newObj[key]) {
            newObj[key] = {
              isHidden: Array.from(classList || []).includes('hide'),
              ...dataset
            };
          }
          return newObj;
        }, {});
        this._data = {
          ...this._data,
          ...dataFromEle
        };
      };
      this._toggleVisiable = (key, hidden) => {
        const matchedObj = this._data[key];
        const $matchedEles = this.getEles(key);
        $matchedEles[hidden ? 'addClass' : 'removeClass']('hide');
        matchedObj.isHidden = hidden;
      };
      this.updateMutraTip = promotionCodeDTO => {
        const discountCodeTipsParantEle = this.getEles('codePromotionAmount').find('.trade_summations_fee__tips');
        if (promotionCodeDTO && promotionCodeDTO.discountCodePromotionExclusion) {
          this._renderTooltip(true);
        } else {
          tooltip && tooltip.destroy && tooltip.destroy();
          discountCodeTipsParantEle.html('');
        }
      };
      this.updateMemberPoint = memberPointInfo => {
        const {
          use,
          enable,
          deductMemberPointNum,
          deductMemberPointAmount,
          notAvailableReason,
          grayButton
        } = memberPointInfo || {};
        const deductMemberPointAmountEles = this.getEles('deductMemberPointAmount');
        updateCheckBoxStatus(use, deductMemberPointAmountEles.find('.trade_checkout_checkbox'));
        updateCheckBoxDisabledStatus(grayButton, deductMemberPointAmountEles.find('.trade_checkout_checkbox'));
        const descBox = $('.pointAmount_remark');
        const descEl = deductMemberPointAmountEles.find('.trade_summations_fee__desc');
        const pointAmountEl = deductMemberPointAmountEles.find('.pointAmount');
        const pointRemarkEl = deductMemberPointAmountEles.find('.trade_summations_remark');
        const pointNotAvailableEl = $('.pointAmount_remark_notAvailable');
        if (enable) {
          deductMemberPointAmountEles.removeClass('hide');
        } else {
          deductMemberPointAmountEles.addClass('hide');
        }
        if (!use) {
          descBox.removeClass('pointAmount_use');
          descEl.removeClass('hide');
          pointAmountEl.addClass('hide');
          pointRemarkEl.addClass('hide');
        } else {
          descBox.addClass('pointAmount_use');
          descEl.addClass('hide');
          pointAmountEl.removeClass('hide');
          pointRemarkEl.removeClass('hide');
        }
        let formattedValue = deductMemberPointAmount;
        if (typeof deductMemberPointAmount === 'number' || !deductMemberPointAmount) {
          formattedValue = convertFormat(deductMemberPointAmount);
        }
        descEl.html(t('transaction.refund.deduct_point', {
          deductMemberPointNum: `${nullishCoalescingOperator(deductMemberPointNum, 0)}`,
          deductMemberPointAmount: `<span class="deductMemberPointAmount">${formattedValue}</span>`
        }));
        pointRemarkEl.html(t('transaction.refund.cost_points', {
          value: `${nullishCoalescingOperator(deductMemberPointNum, 0)}`
        }));
        if (grayButton) {
          pointNotAvailableEl.html(notAvailableReason);
          pointNotAvailableEl.removeClass('hide');
          descBox.removeClass('pointAmount_use');
          descEl.addClass('hide');
          pointAmountEl.addClass('hide');
          pointRemarkEl.addClass('hide');
        } else {
          pointNotAvailableEl.addClass('hide');
        }
      };
      this.toggleMemberPoint = checked => {
        const descBox = $('.pointAmount_remark');
        const pointsAmountDescEle = $('.trade_summations_fee__desc');
        const pointsAmountValueEle = $('.pointAmount');
        const pointsAmountRemarkEle = $('.trade_summations_remark');
        if (!checked) {
          descBox.removeClass('pointAmount_use');
          pointsAmountValueEle.addClass('hide');
          pointsAmountDescEle.removeClass('hide');
          pointsAmountRemarkEle.addClass('hide');
        } else {
          descBox.addClass('pointAmount_use');
          pointsAmountDescEle.addClass('hide');
          pointsAmountValueEle.removeClass('hide');
          pointsAmountRemarkEle.removeClass('hide');
        }
        CartService.takeCartService().getMemberPoint(checked).then(res => {
          if (res.success) {
            CartService.takeCartService().getCartDetail();
          }
        });
      };
      this.toggleAmountErrorAlert = totalAmount => {
        const tradeAmountErrorAlertEle = $('.cart-amount-error-alert');
        if (totalAmount / 100 <= MAX_AMOUNT) {
          tradeAmountErrorAlertEle.addClass('hide');
        } else {
          tradeAmountErrorAlertEle.removeClass('hide');
        }
      };
      this._updatePrivateData = (key, value, isSameAsOldValue) => {
        const matchedObj = this._data[key];
        const $matchedEles = this.getEles(key);
        if (!isSameAsOldValue) {
          if (!value) {
            if (!matchedObj.showWithZeroValue) {
              this._toggleVisiable(key, true);
            }
          } else if (matchedObj.isHidden) {
            this._toggleVisiable(key, false);
          }
          matchedObj.value = value;
          $matchedEles.attr('data-value', value);
        }
        if (key === 'codePromotionAmount' && typeof value === 'string') {
          $matchedEles.find(`.trade_summations__amount-box`).text(value);
        } else {
          let formattedValue = value;
          if (typeof value === 'number') {
            formattedValue = convertFormat(value);
          }
          $matchedEles.find(`.trade_summations__amount-box`).html(formattedValue);
          if (typeof value === 'number') {
            $matchedEles.find(`.trade_summations__amount-box`).attr('data-amount', value);
          } else {
            $matchedEles.find(`.trade_summations__amount-box`).removeAttr('data-amount');
          }
        }
      };
      this.updateAmount = data => {
        const {
          promotionCodeDTO: promotionCodeInfo,
          memberPointInfo,
          promotionAmount,
          discountBenefitType,
          discountCodeTotalAmount,
          totalAmount,
          cartTotalDiscount,
          realAmount,
          carLevelDiscountApplications
        } = data;
        this.updateMutraTip(promotionCodeInfo);
        let promotionAvailable = false;
        if (discountBenefitType === 2) {
          promotionAvailable = true;
        } else if (discountBenefitType == null || discountBenefitType === 1) {
          promotionAvailable = promotionAmount > 0;
        }
        this._keyList.forEach(key => {
          let newAmount = +data[key];
          updateDetailModal({
            key,
            data,
            ele: '.trade_summations__amount'
          });
          if (key === 'freeShipping') {
            newAmount = newAmount ? t('cart.payment.free') : 0;
          } else if (key === 'deductMemberPointAmount') {
            newAmount = nullishCoalescingOperator(get(memberPointInfo, 'deductMemberPointAmount', 0), 0);
          } else if (key === 'totalAmount') {
            const totalAmountEles = this.getEles('totalAmount');
            const codePromotionAmountValue = Number(discountCodeTotalAmount);
            const showTotalAmount = promotionAvailable || codePromotionAmountValue > 0 || +data.freeShipping > 0 || memberPointInfo && memberPointInfo.enable && memberPointInfo.use;
            const realShowTotalAmount = showTotalAmount || carLevelDiscountApplications && carLevelDiscountApplications.length > 0;
            if (realShowTotalAmount) {
              totalAmountEles && totalAmountEles.removeClass && totalAmountEles.removeClass('hide');
              this.setCartFlodDom(true);
            } else {
              totalAmountEles && totalAmountEles.addClass && totalAmountEles.addClass('hide');
              this.handleCartFoldDown();
              this.setCartFlodDom(false);
            }
          } else if (key === 'orderDiscountList') {
            this.updateOrderDiscountList(carLevelDiscountApplications);
            return;
          }
          const isSameAsOldValue = newAmount === +this._data[key].value;
          this._updatePrivateData(key, newAmount, isSameAsOldValue);
        });
        this.updateMemberPoint(memberPointInfo);
        this.toggleAmountErrorAlert(totalAmount);
        this.updateCartFoldAmount(Number(cartTotalDiscount || '0'), realAmount);
      };
      this.updateOrderDiscountList = carLevelDiscountApplications => {
        const hide = !carLevelDiscountApplications || carLevelDiscountApplications.length === 0;
        const container = this.getEles('orderDiscountList');
        const freeShippingText = t('transaction.general.free_shipping');
        if (hide) {
          container && container.addClass('hide');
        } else {
          const itemsHtml = carLevelDiscountApplications.map(item => {
            const isFreeShipping = item.targetType === 'shipping_line';
            const couponLabel = item.displayLabel || item.title;
            const couponValue = isFreeShipping ? freeShippingText : `- ${convertFormat(item.totalAllocatedAmount)}`;
            return `
          <div class="total_amounts_discount_item">
            <div class="total_amounts_discount_item_title">
              ${coupon_icon}
              ${couponLabel}
            </div>
            <div class="total_amounts_discount_item_amount">${couponValue}</div>
          </div>
        `;
          }).join('');
          container && container.html(itemsHtml);
          container && container.removeClass('hide');
        }
      };
      this.initEventListener = () => {
        const {
          eventBus,
          eventBusEnum
        } = CartService;
        eventBus.on(eventBusEnum.UPDATE, this.updateAmount);
        this.initModalEventListener();
      };
      this.scrollHideTips = throttle(() => {
        tooltip.hide();
      }, 50);
      this.initModalEventListener = () => {
        $('.trade_summations .trade_summations__amount').off('mouseenter click').on('mouseenter click', function () {
          const $this = $(this);
          const $feeDetailModal = $this.parent('.trade_summations_fee').next('.summations_detail_modal');
          if ($feeDetailModal.length === 0) {
            return;
          }
          $feeDetailModal.removeClass('hide').find('.summations_detail_modal__wrapper').css({
            top: +(($this.offset() || {}).top || 0) + $this.height() - $(document).scrollTop()
          });
        });
        $('.trade_summations .trade_summations__amount').off('mouseleave').on('mouseleave', function () {
          const $feeDetailModal = $(this).parent('.trade_summations_fee').next('.summations_detail_modal');
          if ($feeDetailModal.length === 0) {
            return;
          }
          $feeDetailModal.addClass('hide');
        });
        $(window).off('touchmove').on('touchmove', throttle(() => {
          $('.summations_detail_modal').each(function () {
            const $curModalEle = $(this);
            if ($curModalEle.hasClass('hide') === false) {
              $curModalEle.addClass('hide');
            }
          });
        }, 30));
      };
      this.initCartFoldEvent = () => {
        const container = `.${this._cartType}__stick_container${this._cartType === 'miniCart' ? '_fixed' : ''}`;
        const cartFold = $(`${container} .cart-fold`);
        const cartFoldUp = $(`${container} .cart-fold-up`);
        const realAmount = $(`${container} .settleSumAmount__realAmount`);
        const trade_summations_fold = $(`${container} .trade_summations_fold`);
        const desc = $(`${container} .trade_summations_settleSumAmount .trade_money_desc_fold`);
        const rotateClass = 'cart-fold-up_rotate';
        const cartFoldOpenClass = 'cart-fold-open';
        const summationFoldShowClass = 'trade_summations_fold-show';
        const handleCartFoldDown = () => {
          cartFold.removeClass(cartFoldOpenClass);
          trade_summations_fold.removeClass(summationFoldShowClass);
          cartFoldUp.removeClass(rotateClass);
        };
        const handleCartFoldUp = () => {
          cartFoldUp.addClass(rotateClass);
          cartFold.addClass(cartFoldOpenClass);
          trade_summations_fold.addClass(summationFoldShowClass);
        };
        const handleCartFold = () => {
          if (!cartFoldUp.hasClass(rotateClass)) {
            handleCartFoldUp();
          } else {
            handleCartFoldDown();
          }
        };
        realAmount.on('click', function () {
          if (this.dataset.hideTotal === 'false') {
            handleCartFold();
          }
        });
        const setCartFlodDom = status => {
          cartFoldUp[status ? 'removeClass' : 'addClass']('hide');
          realAmount.attr('data-hide-total', !status);
          desc[status ? 'addClass' : 'removeClass']('hide');
        };
        cartFoldUp.on('click', handleCartFold);
        cartFold.on('click', handleCartFoldDown);
        return {
          handleCartFoldDown,
          setCartFlodDom
        };
      };
      this.updateCartFoldAmount = (cartTotalDiscount, realAmount) => {
        const cartTotalDiscountDom = $('.settleSumAmount__cartTotalDiscount');
        const cartRealAmountDom = $('.settleSumAmount__realAmount');
        const hideCartTotalDiscount = cartTotalDiscount === 0;
        const saleColorDom = $('.settleSumAmount__cartTotalDiscount').parent();
        if (hideCartTotalDiscount) {
          saleColorDom.addClass('hide');
        } else {
          saleColorDom.removeClass('hide');
        }
        cartTotalDiscountDom.html(convertFormat(cartTotalDiscount));
        cartRealAmountDom.html(convertFormat(realAmount));
      };
      this.handleCartFoldDown = () => {};
      this.setCartFlodDom = () => {};
      this.init = cartType => {
        this._cartType = cartType;
        logger.info(`normal 主站购物车 SummationModule 初始化 init`, {
          data: {
            cartToken
          },
          action: Action.InitCart,
          status: LoggerStatus.Start
        });
        this.initEventListener();
        this.getInitData();
        this._renderTooltip();
        utils.helper.listenPlatform(platform => {
          if (!tooltip) {
            return;
          }
          tooltip.toggle({
            trigger: this.getTriggerType(platform)
          });
        });
        $('.trade_mini_cart').parent().on('scroll', this.scrollHideTips);
        $('.trade_cart').parent().on('scroll', this.scrollHideTips);
        $('.trade_cart_not_empty_wrapper').on('scroll', this.scrollHideTips);
        $(document).on('scroll', this.scrollHideTips);
        TradeEventBus.on('trade:checkbox-trade_checkout_point_checkbox', this.toggleMemberPoint);
        const {
          handleCartFoldDown,
          setCartFlodDom
        } = this.initCartFoldEvent();
        this.handleCartFoldDown = handleCartFoldDown;
        this.setCartFlodDom = setCartFlodDom;
      };
    }
  }
  const summationBus = new Summations();
  _exports.default = summationBus;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/biz/trade-coupon/index.js'] = window.SLM['cart/script/biz/trade-coupon/index.js'] || function () {
  const _exports = {};
  const { initReductionCodeComponent } = window['@sl/cart']['/lib/ReductionCode/index'];
  const { createCartPageReductionCodeFactory, ReductionCodeService } = window['@sl/cart']['/lib/ReductionCode/services/index'];
  const store = window['@sl/cart']['/lib/utils/store'].default;
  function initCoupon(cartType) {
    store.add({
      currentCart: 'ONLINE_CART'
    });
    initReductionCodeComponent(new ReductionCodeService(createCartPageReductionCodeFactory()), 'ONLINE_CART', cartType);
  }
  _exports.default = initCoupon;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/biz/checkout-error/index.js'] = window.SLM['cart/script/biz/checkout-error/index.js'] || function () {
  const _exports = {};
  const valuer = window['SLM']['cart/script/valuer/index.js'].default;
  class CheckoutErrorModule {
    constructor(ctx, {
      $root,
      checkoutHooks,
      cartActionHooks
    }) {
      this.ctx = ctx;
      this.$root = $root;
      this.checkoutHooks = checkoutHooks;
      this.cartActionHooks = cartActionHooks;
      this._init();
    }
    _init() {
      this.checkoutHooks.checkoutFailed.tap(err => {
        if (err) {
          if (err instanceof Error) {
            this._setError(err.message);
          } else {
            this._setError(err.msg || err.code);
          }
        } else {
          this._setError('');
        }
      });
      this.cartActionHooks.skuRemoved.tap(skuList => {
        if (Array.isArray(skuList) && skuList.length > 0) {
          this._setError('');
        }
      });
    }
    _setError(msg) {
      if (msg) {
        this.$root.classList.add('trade-cart-checkout-error');
      } else {
        this.$root.classList.remove('trade-cart-checkout-error');
      }
      this.$root.textContent = msg;
    }
  }
  function newCheckoutErrorModule(ctx, $root) {
    const checkoutHooks = valuer.checkoutHooksValuer.takeCheckoutHooks(ctx);
    const cartActionHooks = valuer.cartActionHooksValuer.takeCartActionHooks(ctx);
    return new CheckoutErrorModule(ctx, {
      $root,
      cartActionHooks,
      checkoutHooks
    });
  }
  _exports.default = {
    CheckoutErrorModule,
    newCheckoutErrorModule
  };
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
window.SLM['theme-shared/events/utils/api-logger.js'] = window.SLM['theme-shared/events/utils/api-logger.js'] || function () {
  const _exports = {};
  const loggerService = window['@yy/sl-theme-shared']['/utils/logger/sentry'].default;
  _exports.default = apiName => loggerService.pipeOwner('developer-api').pipeOwner(apiName);
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
window.SLM['theme-shared/components/hbs/shared/components/drawer/const.js'] = window.SLM['theme-shared/components/hbs/shared/components/drawer/const.js'] || function () {
  const _exports = {};
  const DRAWER_EVENT_NAME = 'stage:drawer';
  _exports.DRAWER_EVENT_NAME = DRAWER_EVENT_NAME;
  const DRAWER_CALLBACK_EVENT_NAME = 'stage:drawer:callback';
  _exports.DRAWER_CALLBACK_EVENT_NAME = DRAWER_CALLBACK_EVENT_NAME;
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
window.SLM['cart/script/components/banner.js'] = window.SLM['cart/script/components/banner.js'] || function () {
  const _exports = {};
  const { nullishCoalescingOperator } = window['SLM']['theme-shared/utils/syntax-patch.js'];
  const { convertFormat: format } = window['SLM']['theme-shared/utils/newCurrency/CurrencyConvert.js'];
  const { escape } = window['lodash'];
  const imgUrl = window['SLM']['commons/utils/imgUrl.js'].default;
  const CartService = window['SLM']['cart/script/service/cart/service.js'].default;
  const cartReport = window['SLM']['cart/script/report/cartReport.js'].default;
  const { OPEN_CART_BANNER } = window['SLM']['commons/cart/globalEvent.js'];
  const encodeHTML = function (str) {
    if (typeof str === 'string') {
      return str.replace(/<|&|>/g, function (matches) {
        return {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;'
        }[matches];
      });
    }
    return '';
  };
  class CartBanner {
    constructor() {
      this.loadFailedImgSet = new Set();
      this.needUnbindEleList = [];
      this.bannerCartSummationInfo = {};
    }
    init() {
      this.listenNeedOpenBannerEvent();
      this.listenCartDataUpdate();
      this.listenSelectContentReport();
    }
    listenNeedOpenBannerEvent() {
      window.SL_EventBus.on(OPEN_CART_BANNER, ({
        data,
        onSuccess = () => {}
      }) => {
        this.addedItemInfo = {
          ...data
        };
        if (!this.addedItemInfo) return;
        this.bannerData = {
          addedItem: this.addedItemInfo,
          ...this.bannerCartSummationInfo
        };
        this.reRender();
        this.listenImageLoadEvent();
        onSuccess();
      });
    }
    listenCartDataUpdate() {
      CartService.cartEventBus.on(CartService.CartEventBusEnum.UPDATE, data => {
        this.processCartInfoData(data);
      });
    }
    listenImageLoadEvent() {
      const _that = this;
      this._root.find('.trade-cart-sku-item-image-wrapper').each((index, img) => {
        this.needUnbindEleList.push($(img));
        $(img).on('error', function () {
          $(img).parent().children('.trade-cart-sku-item-image-fallback').removeClass('hide');
          $(img).addClass('hide');
          _that.loadFailedImgSet.add($(img).attr('origin-src'));
        });
      });
    }
    listenSelectContentReport() {
      $('.trade_mini_cart').on('click', '.trade-cart-sku-item-image', function () {
        const {
          productSource,
          skuId,
          name,
          skuAttrs,
          price,
          salePrice,
          itemNo,
          customCategoryName
        } = $(this).data();
        if (productSource === 1) {
          cartReport.selectContent({
            skuId,
            name,
            price: parseInt(salePrice, 10) > parseInt(price, 10) ? salePrice : price,
            skuAttrs,
            itemNo,
            customCategoryName
          });
        }
      });
    }
    processCartInfoData(cartInfo) {
      const {
        count,
        totalAmount,
        realAmount,
        discountCodeTotalAmount,
        promotionAmount
      } = cartInfo;
      this.bannerCartSummationInfo = {
        count,
        totalAmount,
        realAmount,
        discountCodeTotalAmount,
        promotionAmount
      };
    }
    getPriceInfo(data) {
      return `${format(data)}`;
    }
    getImageUrl(src) {
      return imgUrl(src, {
        width: 100,
        scale: 2
      });
    }
    getImageFallbackIfNecessary(data) {
      const url = this.getImageUrl(data.image);
      if (!url || this.loadFailedImgSet.has(data.image)) {
        return `<div class="trade-cart-sku-item-image-fallback"></div>`;
      }
      return `
    <div class="hide trade-cart-sku-item-image-fallback"></div>
    <img class="trade-cart-sku-item-image-wrapper" src="${url}" origin-src="${data.image}">
    `;
    }
    getItemSkuAttr(skuAttr) {
      const skuContent = [];
      if (skuAttr && skuAttr.length) {
        skuContent.push('<div class="trade-cart-sku-item-info-wrapper">');
        skuAttr.forEach(data => {
          skuContent.push(`
        <div class="trade-cart-sku-item-info-spec body4">
        <div class="trade-cart-sku-item-info-spec-key">${encodeHTML(data.attributeName)}:</div>
        <div class="trade-cart-sku-item-info-spec-value">${encodeHTML(data.attributeValue)}</div>
        </div>`);
        });
        skuContent.push('</div>');
      }
      return skuContent.join('\n');
    }
    getItemSkuCustomTips(customProductTips) {
      const tipsContent = [];
      if (customProductTips && customProductTips.length) {
        customProductTips.forEach(data => {
          tipsContent.push(`
        <div class="trade-cart-sku-item-info-customTip notranslate">${encodeHTML(data)}</div>`);
        });
      }
      return tipsContent.join('\n');
    }
    getItemAmount(data) {
      return `
      <span class="isolate notranslate body2 text_bold" data-amount=${data.price}>${this.getPriceInfo(data.price)}</span>
      <span
      class="notranslate body2 text_bold trade-cart-sku-item-info-amount-sign">x&nbsp;<span
        class="notranslate body2 text_bold trade-cart-sku-item-info-amount-count">${this.addedItemInfo.num}</span>
      `;
    }
    getImageContent(data) {
      return `
    <a class="trade-cart-sku-item-image" href="${window.Shopline.redirectTo(`/products/${data.handle || data.spuId}`)}"
         data-product-source="${data.productSource}"
         data-group-id="${nullishCoalescingOperator(data.groupId, '')}"
         data-name="${escape(data.name)}"
         data-sku-id="${data.skuId}"
         data-spu-id="${data.spuId}"
         data-sku-attrs="${escape((data.skuAttr || []).join(','))}"
         data-price="${data.price}"
         data-sale-price="${data.salePrice}"
         data-item-no="${data.itemNo}"
         data-custom-category-name="${data.customCategoryName}"
    >
      ${this.getImageFallbackIfNecessary(data)}
    </a>`;
    }
    updateCartTotalInfo(count) {
      this._cartTotal.text(count);
    }
    updateSubtotal(subtotal) {
      this._subtotal.attr('data-amount', subtotal);
      this._subtotal.html(this.getPriceInfo(subtotal));
    }
    updateSkuCard(itemInfo) {
      const imageBox = this._skuCard.find('.trade-cart-sku-item-image-wrapper');
      imageBox.html(this.getImageContent(itemInfo));
      this.updateProductDetail(itemInfo);
    }
    updateProductDetail(itemInfo) {
      const productNameEle = this._skuCard.find('.trade-cart-sku-item-info-title');
      productNameEle.html(encodeHTML(itemInfo.name));
      const productAttrsEle = this._skuCard.find('.trade-cart-sku-item-info-attrs');
      productAttrsEle.html(this.getItemSkuAttr(itemInfo.skuAttributes));
      const productCustomTipsEle = this._skuCard.find('.trade-cart-sku-item-info-custom');
      productCustomTipsEle.html(this.getItemSkuCustomTips(itemInfo.customProductTips));
      const productAmountEle = this._skuCard.find('.trade-cart-sku-item-info-amount');
      productAmountEle.html(this.getItemAmount(itemInfo));
    }
    reRender() {
      this.needUnbindEleList.forEach(ele => {
        ele && ele.unbind && ele.unbind();
      });
      const {
        count,
        totalAmount,
        addedItem
      } = this.bannerData;
      this._root = $('.trade_mini_cart');
      this._subtotal = this._root.find('.trade-cart-banner-summations-subtotal--price');
      this._cartTotal = this._root.find('.trade-cart-banner-summations-footer-cart-total');
      this._skuCard = this._root.find('.trade-cart-sku-item');
      this.updateCartTotalInfo(count);
      this.updateSubtotal(totalAmount);
      setTimeout(() => {
        this.updateSkuCard(addedItem);
      }, 100);
    }
  }
  _exports.default = new CartBanner();
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/biz/checkout/effect.js'] = window.SLM['cart/script/biz/checkout/effect.js'] || function () {
  const _exports = {};
  const CartServiceValuer = window['SLM']['cart/script/valuer/cartService.js'].default;
  const cartItemListValuer = window['SLM']['cart/script/valuer/cartItemList.js'].default;
  async function verifyCart(ctx) {
    const cartService = CartServiceValuer.withCartService(ctx);
    const cartItemList = cartItemListValuer.withCartItemList(ctx);
    return cartService.verifyCartItemList(cartItemList);
  }
  function getCheckoutParams(ctx, verifiedItemList) {
    const cartService = CartServiceValuer.withCartService(ctx);
    return cartService.getCheckoutParams(verifiedItemList);
  }
  _exports.default = {
    getCheckoutParams,
    verifyCart
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/biz/cart/cart_module.js'] = window.SLM['cart/script/biz/cart/cart_module.js'] || function () {
  const _exports = {};
  const Cookie = window['js-cookie']['default'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { convertFormat } = window['SLM']['theme-shared/utils/newCurrency/CurrencyConvert.js'];
  const { Owner, Action } = window['@yy/sl-theme-shared']['/utils/logger/sentryReport'];
  const TopDrawer = window['SLM']['theme-shared/components/hbs/shared/components/topDrawer/index.js'].default;
  const { DRAWER_EVENT_NAME, DRAWER_OPERATORS } = window['SLM']['theme-shared/components/hbs/shared/components/topDrawer/const.js'];
  const AdditionalButton = window['SLM']['theme-shared/components/pay-button/additional-button/index.js'].default;
  const { EPaymentUpdate, EPaymentUpdateType } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const LoggerService = window['SLM']['commons/logger/index.js'].default;
  const { Status: LoggerStatus } = window['SLM']['commons/logger/index.js'];
  const SkuCard = window['SLM']['cart/script/components/sku-card.js'].default;
  const { initMainCartSticky, listenHeaderSectionChange, initMiniCartSticky } = window['SLM']['cart/script/biz/sticky-cart/index.js'];
  const SummationModule = window['SLM']['cart/script/biz/trade-summations/index.js'].default;
  const initCoupon = window['SLM']['cart/script/biz/trade-coupon/index.js'].default;
  const CheckoutErrorModule = window['SLM']['cart/script/biz/checkout-error/index.js'].default;
  const CartService = window['SLM']['cart/script/service/cart/index.js'].default;
  const Service = window['SLM']['cart/script/service/index.js'].default;
  const context = window['SLM']['cart/script/utils/context/index.js'].default;
  const cartServiceValuer = window['SLM']['cart/script/valuer/cartService.js'].default;
  const valuer = window['SLM']['cart/script/valuer/index.js'].default;
  const CartBanner = window['SLM']['cart/script/components/banner.js'].default;
  const initTradeCheckbox = window['SLM']['cart/script/components/trade-checkbox/index.js'].default;
  const cartReport = window['SLM']['cart/script/report/cartReport.js'].default;
  const checkoutEffect = window['SLM']['cart/script/biz/checkout/effect.js'].default;
  const logger = LoggerService.pipeOwner(`${Owner.Cart} biz/cart/index.js`);
  const cartToken = Cookie.get('t_cart');
  class CartModule {
    constructor(cartType) {
      this._cartType = cartType;
      this._skuCardComponent = null;
      this._ctx = null;
      this._initAfterLoaded();
    }
    _initCurrencyChangeListener() {
      const cartRootNode = this._root;
      SL_State.on('currencyCode', () => {
        const amountNode = cartRootNode.find('[data-amount]');
        amountNode.each(function () {
          $(this).html(convertFormat($(this).attr('data-amount')));
        });
      });
    }
    _initAfterLoaded() {
      logger.info(`normal 主站购物车 初始化 _initAfterLoaded`, {
        data: {
          cartToken
        },
        action: Action.InitCart,
        status: LoggerStatus.Success
      });
      if (document.readyState !== 'loading') {
        this._init();
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          this._init();
        });
      }
    }
    _init() {
      logger.info(`normal 主站购物车 全局化 cart service _init`, {
        data: {
          cartToken
        },
        action: Action.InitCart,
        status: LoggerStatus.Start
      });
      Service.init();
      let ctx = context.background();
      ctx = context.withValue(ctx, cartServiceValuer.valuer, CartService.takeCartService());
      ctx = valuer.checkoutHooksValuer.withCheckoutHooks(ctx);
      ctx = valuer.cartActionHooksValuer.withCartActionHooks(ctx);
      this._ctx = ctx;
      if (this._cartType === 'main') {
        logger.info(`normal 主站购物车 _init`, {
          data: {
            cartToken
          },
          action: Action.InitCart,
          status: LoggerStatus.Start
        });
        initMainCartSticky();
        try {
          SummationModule.init('cart');
        } catch (error) {
          logger.error(`normal 主站购物车 _init SummationModule 初始化失败`, {
            data: {
              cartToken
            },
            action: Action.InitCart,
            error,
            errorLevel: 'P0'
          });
        }
        try {
          initCoupon(`.${this._cartType}`);
        } catch (error) {
          logger.error(`normal 主站购物车 _init Coupon 初始化失败`, {
            data: {
              cartToken
            },
            action: Action.InitCart,
            error,
            errorLevel: 'P0'
          });
        }
        logger.info(`非 main 主站购物车 Coupon 初始化 _init`, {
          data: {
            cartToken
          },
          action: Action.InitCart,
          status: LoggerStatus.Start
        });
      } else {
        listenHeaderSectionChange();
        new TopDrawer('cart-select');
        this._initBanner();
        initTradeCheckbox();
        const cartOpenType = window.SL_State.get('theme.settings.cart_open_type');
        if (cartOpenType === 'drawer') {
          initMiniCartSticky();
          SummationModule.init('miniCart');
          initCoupon(`.${this._cartType}`);
        } else {
          CartBanner.init();
        }
        logger.info(`normal 主站购物车 CartBanner 初始化 _init`, {
          data: {
            cartToken
          },
          action: Action.InitCart,
          status: LoggerStatus.Start
        });
      }
      this._initPayButton();
      const cartOpenType = window.SL_State.get('theme.settings.cart_open_type');
      if (cartOpenType === 'drawer' || this._cartType === 'main') {
        this._skuCardComponent = new SkuCard(ctx, this._cartType);
        this._skuCardComponent.init();
      }
      this._initCheckoutErrorModule();
      this._root = $(`.${this._cartType === 'main' ? 'trade_cart' : 'trade_mini_cart'}`);
      this._initCurrencyChangeListener();
      if (window.location.pathname === window.Shopline.redirectTo('/cart') && this._cartType === 'main') {
        const cartInfo = SL_State.get('cartInfo');
        cartReport.viewCart(cartInfo);
      }
    }
    _initCheckoutErrorModule() {
      logger.info(`normal 主站购物车 结账错误初始化 _initCheckoutErrorModule`, {
        data: {
          cartToken
        },
        action: Action.InitCart,
        status: LoggerStatus.Start
      });
      const nodeList = document.querySelectorAll(`.${this._cartType}__trade-cart-checkout-error`);
      nodeList.forEach(el => {
        CheckoutErrorModule.newCheckoutErrorModule(this._ctx, el);
      });
      logger.info(`normal 主站购物车 结账错误初始化 _initCheckoutErrorModule`, {
        data: {
          cartToken
        },
        action: Action.InitCart,
        status: LoggerStatus.Success
      });
    }
    _initBanner() {
      logger.info(`mini 主站购物车 banner 初始化`, {
        action: Action.InitCart,
        status: LoggerStatus.Start
      });
      $(document).on('click', '.trade-cart-banner--close', () => {
        window.SL_EventBus.emit(DRAWER_EVENT_NAME, {
          id: 'cart-select',
          operator: DRAWER_OPERATORS.CLOSE
        });
      });
    }
    getButtonStyleBySetting(wrapperCls) {
      const {
        btn_border_thickness,
        btn_border_radius
      } = window.Shopline.theme.settings;
      const borderRadius = btn_border_thickness + btn_border_radius;
      return {
        height: $(`#${wrapperCls} .pay-button-checkout`).outerHeight(),
        borderRadius
      };
    }
    async _initPayButton() {
      const CART_TYPE = {
        MAIN: 'main',
        DRAWER: 'drawer',
        MINI: 'mini'
      };
      const mainCartIds = ['additional_button_cart-spb', 'additional_button_cart-spb-fixed'];
      const drawerCartIds = ['additional_button_mini-cart-spb', 'additional_button_mini-cart-spb-fixed'];
      const miniCartIds = ['additional_button_mini-cart-pay-button'];
      const cartOpenType = SL_State.get('theme.settings.cart_open_type');
      const buttonStyle = this.getButtonStyleBySetting(mainCartIds[0]);
      const config = {
        getSaveAbandonOrderParams: () => {
          const cartService = cartServiceValuer.withCartService(this._ctx);
          const cartItemList = cartService.getCardItemList();
          const params = checkoutEffect.getCheckoutParams(this._ctx, cartItemList);
          return {
            products: params && params.products,
            discountCodes: params && params.discountCode,
            useMemberPoint: params && params.useMemberPoint
          };
        },
        props: {
          style: {
            height: buttonStyle.height,
            'border-radius': buttonStyle.borderRadius
          }
        }
      };
      let payButton = null;
      let fixedPayButton = null;
      if (this._cartType === 'main') {
        payButton = new AdditionalButton({
          ...config,
          domId: mainCartIds[0],
          props: {
            ...config.props,
            cartType: CART_TYPE.MAIN
          }
        });
        fixedPayButton = new AdditionalButton({
          ...config,
          domId: mainCartIds[1],
          props: {
            ...config.props,
            cartType: CART_TYPE.MAIN
          }
        });
      } else if (cartOpenType === 'drawer') {
        payButton = new AdditionalButton({
          ...config,
          domId: drawerCartIds[0],
          buttonTypes: ['normalButton'],
          props: {
            cartType: CART_TYPE.DRAWER
          }
        });
        fixedPayButton = new AdditionalButton({
          ...config,
          domId: drawerCartIds[1],
          props: {
            cartType: CART_TYPE.DRAWER
          }
        });
      } else {
        payButton = new AdditionalButton({
          ...config,
          domId: miniCartIds[0],
          buttonTypes: ['normalButton'],
          props: {
            cartType: CART_TYPE.MINI
          }
        });
      }
      await Promise.all([payButton && payButton.render(), fixedPayButton && fixedPayButton.render()].filter(item => Boolean(item)));
      window.Shopline.event.emit(EPaymentUpdate, {
        type: EPaymentUpdateType.CartPayButton,
        data: [payButton, fixedPayButton].filter(item => Boolean(item))
      });
    }
  }
  _exports.default = CartModule;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/biz/cart/index.js'] = window.SLM['cart/script/biz/cart/index.js'] || function () {
  const _exports = {};
  const Cookie = window['js-cookie']['default'];
  const { Owner, Action } = window['@yy/sl-theme-shared']['/utils/logger/sentryReport'];
  const LoggerService = window['SLM']['commons/logger/index.js'].default;
  const { Status: LoggerStatus } = window['SLM']['commons/logger/index.js'];
  const CartModule = window['SLM']['cart/script/biz/cart/cart_module.js'].default;
  const logger = LoggerService.pipeOwner(`${Owner.Cart} biz/cart/index.js`);
  const cartToken = Cookie.get('t_cart');
  let cartModule;
  function initCartModule(cartType) {
    logger.info(`normal 主站购物车 初始化 initCartModule`, {
      data: {
        cartToken,
        cartType
      },
      action: Action.InitCart,
      status: LoggerStatus.Start
    });
    cartModule = new CartModule(cartType);
    logger.info(`normal 主站购物车 初始化 initCartModule`, {
      data: {
        cartToken,
        cartType
      },
      action: Action.InitCart,
      status: LoggerStatus.Success
    });
  }
  function takeCartModule() {
    logger.info(`normal 主站购物车 takeCartModule`, {
      data: {
        cartToken,
        cartModule
      },
      action: Action.TakeCart,
      status: LoggerStatus.Start
    });
    return cartModule;
  }
  _exports.default = {
    initCartModule,
    takeCartModule
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['cart/script/mini-cart.js'] = window.SLM['cart/script/mini-cart.js'] || function () {
  const _exports = {};
  const createLogger = window['SLM']['theme-shared/utils/createLogger.js'].default;
  const Cookie = window['js-cookie']['default'];
  const { Owner, Action } = window['@yy/sl-theme-shared']['/utils/logger/sentryReport'];
  const CartModule = window['SLM']['cart/script/biz/cart/index.js'].default;
  const { renderMiniCart } = window['SLM']['commons/utils/dynamicImportMiniCart.js'];
  const LoggerService = window['SLM']['commons/logger/index.js'].default;
  const { Status: LoggerStatus } = window['SLM']['commons/logger/index.js'];
  const sentryLogger = LoggerService.pipeOwner(`${Owner.miniCart} mini-cart.js`);
  const cartToken = Cookie.get('t_cart');
  const logger = createLogger('mini-cart');
  logger.info('ready to init sidebar cart');
  sentryLogger.info('mini购物车主站', {
    data: {
      cartToken
    },
    action: Action.InitCart,
    status: LoggerStatus.Start
  });
  CartModule.initCartModule('sidebar');
  $(document).on('shopline:section:load', async e => {
    if (e.detail.sectionId === 'header') {
      await renderMiniCart();
      logger.info('mini购物车 编辑器', {
        data: {
          cartToken
        },
        action: Action.InitCart,
        status: LoggerStatus.Start
      });
      CartModule.initCartModule('sidebar');
    }
  });
  return _exports;
}();