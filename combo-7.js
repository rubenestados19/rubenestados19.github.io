window.SLM = window.SLM || {};
window.SLM['stage/header/scripts/header-search.js'] = window.SLM['stage/header/scripts/header-search.js'] || function () {
  const _exports = {};
  const request = window['SLM']['theme-shared/utils/request.js'].default;
  const { debounce, escape } = window['lodash'];
  const Base = window['SLM']['commons/base/BaseClass.js'].default;
  const virtualReport = window['SLM']['commons/report/virtualReport.js'].default;
  const HEADER_SEARCH_EVENT = 'stage-header-search';
  const SEARCH_API = '/product/list/query/suggest';
  const SEARCH_TYPE = {
    0: 'suggest_search',
    1: 'suggest_ai',
    2: 'user_search'
  };
  const getSearchResultUrl = (key, type) => {
    return window.Shopline.redirectTo(`/search?keyword=${encodeURIComponent(key.trim())}&type=${SEARCH_TYPE[type]}`);
  };
  const renderSearchResultItem = (item, searchKey) => {
    const {
      title,
      src
    } = item;
    const url = getSearchResultUrl(title, src) || 'javascript:;';
    if (title.toLocaleLowerCase() === searchKey.toLocaleLowerCase().trim()) {
      return '';
    }
    if (title.toLocaleLowerCase().startsWith(searchKey.toLocaleLowerCase())) {
      return `<li>
		<a class="body3" href="${url}" data-type="${src}" data-match=true >
			<span>${escape(title.substring(0, searchKey.length)).replaceAll(' ', '&nbsp;')}</span>${escape(title.substring(searchKey.length, title.length)).replaceAll(' ', '&nbsp;')}
		</a>
	</li>`;
    }
    return `<li>
		<a class="body3" href="${url}" data-type="${src}" data-match="true" >
${escape(title)}
		</a>
	</li>`;
  };
  const renderFirstKey = key => {
    const url = getSearchResultUrl(key, 2) || 'javascript:;';
    return `<li>
	<a class="body3" href="${url}" data-type="2" data-match="true" >
<span>${escape(key)}</span>
			</a>
	</li>`;
  };
  const renderDynamicItem = (data, searchKey) => {
    virtualReport.reportSearchSuggestItem(true);
    return data.map(item => {
      return renderSearchResultItem(item, searchKey);
    }).join('');
  };
  const renderSearchResult = (data, searchKey) => {
    return renderFirstKey(searchKey) + renderDynamicItem(data, searchKey);
  };
  class HeaderSearch extends Base {
    constructor() {
      super();
      this.config = {
        namespace: 'stage:headerSearch'
      };
      this.cacheResult = {};
      this.classes = {
        activeClass: 'is-active',
        drawerOpenRoot: 'stage-drawer-root-open',
        drawerClosingRoot: 'stage-drawer-root-closing',
        drawerOpenRootSearch: 'stage-drawer-root-open-search'
      };
      this.selectors = {
        searchContainer: '.header__search--container',
        searchBtn: '.j-stage-header-search',
        searchCloseBtn: '.j-stage-search-close',
        suggestList: '.header__suggest--list',
        suggestLink: '.header__search--predicate li a',
        input: '.header__search--input',
        forceSearchBtn: '.j-stage-force-search',
        searchBarInput: '.searchbar--input',
        searchBarSuggestList: '.searchbar__suggest--list'
      };
      this.counter = 0;
      this.tempSearchKey = '';
      this.jq = {
        root: $('body')
      };
      this.$setNamespace(this.config.namespace);
      this.init();
      this.tempEventType = `click.tempWrapperClick-${this.namespace}-mask`;
    }
    bindClickEvent() {
      this.$on('click', this.selectors.searchBtn, () => {
        window.SL_EventBus.emit(HEADER_SEARCH_EVENT, 'open', 'btn');
      });
      this.$on('click', this.selectors.searchCloseBtn, () => {
        window.SL_EventBus.emit(HEADER_SEARCH_EVENT, 'close');
      });
      this.$on('click', this.selectors.suggestLink, e => {
        this.doSearchReport(e.target.innerText);
      });
    }
    init() {
      this.bindClickEvent();
      this.bindInput(this.selectors.searchBarInput);
      this.bindSearchBarFocustAndBlur();
      this.bindForceSearchEvent();
      window.SL_EventBus.on(HEADER_SEARCH_EVENT, (status, caller) => {
        if (status === undefined) {
          return;
        }
        if (status === 'open') {
          window.SL_EventBus.emit('force-header-intoView');
          this.openSearch(caller);
        } else {
          this.closeSearch();
        }
      });
    }
    openSearch() {
      const $container = $(this.selectors.searchContainer);
      if ($container.hasClass(this.classes.activeClass)) {
        return;
      }
      this.prepareTransition($container, () => {
        this.jq.root.addClass([this.classes.drawerOpenRoot, this.classes.drawerOpenRootSearch]);
        $container.addClass(this.classes.activeClass);
      }, () => {});
      const $input = $(this.selectors.input);
      $input.trigger('focus');
      this.bindInput(this.selectors.input);
      this.bindMaskClick();
    }
    closeSearch() {
      const $container = $(this.selectors.searchContainer);
      if (!$container.hasClass(this.classes.activeClass)) {
        return;
      }
      $(this.selectors.input).trigger('blur').val('');
      $(this.selectors.suggestList).html('');
      this.prepareTransition($container, () => {
        this.jq.root.removeClass([this.classes.drawerOpenRoot, this.classes.drawerOpenRootSearch]);
        this.jq.root.addClass(this.classes.drawerClosingRoot);
        $container.removeClass(this.classes.activeClass);
      }, () => {
        this.jq.root.removeClass(this.classes.drawerClosingRoot);
        this.counter = 0;
        this.tempSearchKey = '';
        this.$off(this.tempEventType);
      });
      this.$off('input', this.selectors.input);
    }
    bindMaskClick() {
      this.$on(this.tempEventType, ({
        target
      }) => {
        const container = $(this.selectors.searchContainer)[0];
        if (!container) {
          return;
        }
        if (!container.contains(target)) {
          window.SL_EventBus.emit(HEADER_SEARCH_EVENT, 'close');
        }
      });
    }
    doSearchReport(value) {
      virtualReport.reportSearch(value);
      window.SL_EventBus.emit('global:thirdPartReport', {
        GA: [['event', 'search', {
          search_term: value || ''
        }]],
        GA4: [['event', 'search', {
          search_term: value || ''
        }]]
      });
    }
    doSearch(e) {
      const id = $(e.currentTarget).data('id');
      const value = $(`#${id}__input`).val();
      if (!value) {
        return;
      }
      this.doSearchReport(value);
      window.location.href = getSearchResultUrl(value, 2);
    }
    bindForceSearchEvent() {
      this.$on('keydown', this.selectors.input, e => {
        if (e.keyCode === 13) {
          this.doSearch(e);
        }
      });
      this.$on('focus', this.selectors.input, () => {
        const $target = $('#suggest-menu-list');
        $(this.selectors.suggestList).html($target.html());
      });
      this.$on('blur', this.selectors.input, () => {
        setTimeout(() => {
          $(this.selectors.suggestList).html('');
        }, 500);
      });
      this.$on('click', this.selectors.forceSearchBtn, this.doSearch.bind(this));
    }
    offForceSearchEvent() {
      this.$off('keydown', this.selectors.searchBarInput);
      this.$off('click', this.selectors.forceSearchBtn);
    }
    updateDom(data, counter, resultList) {
      if (counter !== this.counter) {
        return;
      }
      const html = renderDynamicItem(data, this.tempSearchKey);
      const list = $(resultList)[0];
      const children = list && list.children || [];
      const firstItem = children[0] && children[0].outerHTML;
      if (firstItem) {
        $(resultList).html(firstItem + html);
      }
    }
    bindInput(selector) {
      this.$on('input', selector, debounce(async e => {
        const resultList = `#${$(e.target).data('id')}__suggest-list`;
        const $list = $(resultList);
        const {
          value: searchValue
        } = e.target;
        if (!searchValue) {
          $list.html('');
          virtualReport.reportSearchSuggestItem(false);
          return;
        }
        if (this.cacheResult[searchValue]) {
          const html = renderSearchResult(this.cacheResult[searchValue], searchValue);
          $list.html(html);
          return;
        }
        if ($list[0].children.length > 0) {
          $list[0].children[0].outerHTML = renderFirstKey(searchValue);
        } else {
          $list.html(renderFirstKey(searchValue));
        }
        this.counter += 1;
        this.tempSearchKey = searchValue;
        const ret = await request.get(SEARCH_API, {
          params: {
            word: searchValue,
            num: 10
          }
        });
        if (ret.code === 'SUCCESS') {
          this.cacheResult[searchValue] = ret.data;
          this.updateDom(ret.data, this.counter, resultList);
        }
      }, 100));
    }
    bindSearchBarFocustAndBlur() {
      this.$on('keypress', this.selectors.searchBarInput, e => {
        if (e.keyCode === 13) {
          this.doSearch(e);
          return false;
        }
      });
      this.$on('focus', this.selectors.searchBarInput, e => {
        const resultList = `#${$(e.target).data('id')}__suggest-list`;
        const $target = $('#suggest-menu-list');
        $(resultList).html($target.html());
      });
      this.$on('blur', this.selectors.searchBarInput, e => {
        const resultList = `#${$(e.target).data('id')}__suggest-list`;
        setTimeout(() => {
          $(resultList).html('');
        }, 500);
      });
    }
    off() {
      this.$offAll();
    }
  }
  let instance = new HeaderSearch();
  $(document).on('shopline:section:load', () => {
    instance.off();
    instance = new HeaderSearch();
  });
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['stage/header/scripts/drawer-menu.js'] = window.SLM['stage/header/scripts/drawer-menu.js'] || function () {
  const _exports = {};
  const Base = window['SLM']['commons/base/BaseClass.js'].default;
  class DrawerMenu extends Base {
    constructor() {
      super();
      this.config = {
        namespace: 'stage:drawerMenu'
      };
      this.classes = {
        openClass: 'is-open'
      };
      this.selector = {
        trigger: '.nav-collapsible-trigger ',
        inner: '.collapsible-content__inner',
        sublist: '.mobile-nav__sublist',
        drawer: '.stage-drawer-nested.stage-drawer--is-open',
        localeCurrency: '.locale-currency.mobile-nav__link',
        localeCurrencyContainer: '.drawer-menu-locale-currency'
      };
      this.$setNamespace(this.config.namespace);
      this.bindEvent();
      this.bindDrawer();
      this.bindLocaleCurrencyChange();
    }
    modifyParent($button, addHeight, isOpen) {
      const parent = $button.parents(`div${this.selector.sublist}`);
      if (!parent.length) {
        return;
      }
      parent.height(parent.height());
      if (isOpen) {
        parent.height(parent.height() + addHeight);
      } else {
        parent.height(parent.height() - addHeight);
      }
    }
    bindEvent() {
      this.$on('click', this.selector.trigger, e => {
        const $button = $(e.currentTarget);
        const controlsId = $button.attr('aria-controls');
        const $controls = $(`#${controlsId}`);
        const $inner = $controls.find(this.selector.inner);
        const height = $inner.height();
        if ($button.hasClass(this.classes.openClass)) {
          $controls.height(height);
          $button.removeClass(this.classes.openClass);
          this.modifyParent($button, height, false);
          this.prepareTransition($controls, () => {
            $controls.height(0);
            $controls.removeClass(this.classes.openClass);
          });
        } else {
          this.modifyParent($button, height, true);
          this.prepareTransition($controls, () => {
            $controls.height(height);
            $controls.addClass(this.classes.openClass);
          });
          $button.addClass(this.classes.openClass);
        }
      });
    }
    bindDrawer() {
      this.$on('click', this.selector.localeCurrency, e => {
        const $target = $(e.currentTarget);
        const drawerId = $target.data('drawer');
        window.SL_EventBus.emit('stage:drawer', {
          id: drawerId,
          status: 'open'
        });
      });
    }
    bindLocaleCurrencyChange() {
      this.$on('click', `${this.selector.localeCurrencyContainer} li`, e => {
        const $target = $(e.currentTarget);
        const drawerId = $target.parents(this.selector.drawer).eq(0).attr('id');
        window.SL_EventBus.emit('stage:drawer', {
          id: drawerId,
          status: 'close_self'
        });
      });
    }
    off() {
      this.$offAll();
    }
  }
  let instance = new DrawerMenu();
  $(document).on('shopline:section:load', () => {
    instance.off();
    instance = new DrawerMenu();
  });
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
window.SLM['commons/components/topDrawer/index.js'] = window.SLM['commons/components/topDrawer/index.js'] || function () {
  const _exports = {};
  const TopDrawer = window['SLM']['theme-shared/components/hbs/shared/components/topDrawer/index.js'].default;
  const { DRAWER_EVENT_NAME, DRAWER_CALLBACK_EVENT_NAME, DRAWER_OPERATORS } = window['SLM']['theme-shared/components/hbs/shared/components/topDrawer/const.js'];
  _exports.DRAWER_EVENT_NAME = DRAWER_EVENT_NAME;
  _exports.DRAWER_CALLBACK_EVENT_NAME = DRAWER_CALLBACK_EVENT_NAME;
  _exports.DRAWER_OPERATORS = DRAWER_OPERATORS;
  _exports.default = TopDrawer;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['stage/header/scripts/mobile-locale-currency-drawer.js'] = window.SLM['stage/header/scripts/mobile-locale-currency-drawer.js'] || function () {
  const _exports = {};
  const Base = window['SLM']['commons/base/BaseClass.js'].default;
  const TopDrawer = window['SLM']['commons/components/topDrawer/index.js'].default;
  class DrawerMenu extends Base {
    constructor() {
      super();
      this.config = {
        namespace: 'stage:mobileLocaleCurrencyDrawer'
      };
      this.classes = {};
      this.selector = {
        drawer: '.stage-top-drawer.top-drawer--open',
        localeCurrencyContainer: '.drawer-menu-locale-currency',
        localeBtn: '.j-locale-drawer-btn',
        countryBtn: '.j-country-drawer-btn'
      };
      this.drawers = {
        localeDrawer: null,
        countryDrawer: null
      };
      this.$setNamespace(this.config.namespace);
      this.init();
      this.bindEvent();
      this.bindLocaleCurrencyChange();
    }
    init() {
      this.drawers.localeDrawer = new TopDrawer('global-locale-drawer', {
        fullScreen: true
      });
      this.drawers.countryDrawer = new TopDrawer('global-country-drawer', {
        fullScreen: true
      });
    }
    bindEvent() {
      this.$on('click', this.selector.localeBtn, () => {
        this.drawers.localeDrawer.open();
      });
      this.$on('click', this.selector.countryBtn, () => {
        this.drawers.countryDrawer.open();
      });
    }
    bindLocaleCurrencyChange() {
      this.$on('click', `${this.selector.localeCurrencyContainer} li`, e => {
        const $target = $(e.currentTarget);
        const drawerId = $target.parents(this.selector.drawer).eq(0).attr('id');
        Object.keys(this.drawers).forEach(key => {
          const drawer = this.drawers[key];
          if (drawer.id === drawerId) {
            drawer.close();
          }
        });
      });
    }
    off() {
      this.drawers.localeDrawer.$offAll();
      this.drawers.countryDrawer.$offAll();
      this.$offAll();
    }
  }
  let instance = new DrawerMenu();
  $(document).on('shopline:section:load', () => {
    instance.off();
    instance = new DrawerMenu();
  });
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/stickyElementManager.js'] = window.SLM['theme-shared/utils/stickyElementManager.js'] || function () {
  const _exports = {};
  const { debounce } = window['lodash'];
  const EVENT_STICKY_ELEMENT_HEIGHT = 'stage:header:stickyElementHeight';
  function getStickyElementHeight(headerSectionSelector = '#shopline-section-header') {
    let top = 0;
    $(headerSectionSelector).prevAll().each((_, el) => {
      const $el = $(el);
      if ($el.css('position') === 'sticky') {
        top += $el.height();
      }
    });
    return top;
  }
  function emitStickyElementHeight() {
    const stickyElementHeight = getStickyElementHeight();
    requestAnimationFrame(() => {
      window.SL_EventBus.emit(EVENT_STICKY_ELEMENT_HEIGHT, {
        stickyElementHeight
      });
    });
  }
  class StickyElementManager {
    constructor() {
      this.namespace = 'stage:stickyElementManager';
      this.bindLoaded();
    }
    bindLoaded() {
      if (document.readyState !== 'loading') {
        this.initAfterLoaded();
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          this.initAfterLoaded();
        });
      }
    }
    initAfterLoaded() {
      this.initStickyJob();
    }
    initStickyJob() {
      emitStickyElementHeight();
      setTimeout(() => {
        requestAnimationFrame(emitStickyElementHeight);
      }, 2500);
      this.onEvent();
    }
    onEvent() {
      $(window).on(`scroll.${this.namespace}`, debounce(emitStickyElementHeight, 30, {
        leading: true
      }));
    }
    offEvent() {
      $(window).off(`scroll.${this.namespace}`);
    }
  }
  _exports.EVENT_STICKY_ELEMENT_HEIGHT = EVENT_STICKY_ELEMENT_HEIGHT;
  _exports.StickyElementManager = StickyElementManager;
  _exports.getStickyElementHeight = getStickyElementHeight;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/stage/enum/index.js'] = window.SLM['theme-shared/events/stage/enum/index.js'] || function () {
  const _exports = {};
  const HEADER_STICKY = 'Stage::HeaderSticky';
  _exports.HEADER_STICKY = HEADER_STICKY;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/stage/developer-api/header-sticky/index.js'] = window.SLM['theme-shared/events/stage/developer-api/header-sticky/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const externalEvent = window['SLM']['theme-shared/events/stage/enum/index.js'];
  const EVENT_NAME = externalEvent.HEADER_STICKY;
  const logger = apiLogger(EVENT_NAME);
  const external = window.Shopline.event;
  const headerSticky = data => {
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
  };
  headerSticky.apiName = EVENT_NAME;
  _exports.default = headerSticky;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/headerStickyEvent.js'] = window.SLM['theme-shared/utils/headerStickyEvent.js'] || function () {
  const _exports = {};
  const qs = window['query-string']['default'];
  const headerSticky = window['SLM']['theme-shared/events/stage/developer-api/header-sticky/index.js'].default;
  class HeaderStickyEvent {
    constructor() {
      this.headerSectionId = 'shopline-section-header';
      this.headerWrapperSelector = '#stage-header';
      this.aboveElementHeight = 0;
      this.isSticky = false;
      this.namespace = 'stage:stickyElementManager';
      this.isDebug = false;
      this.mutationTimer = null;
      this.originalThreshold = 250;
      this.bindLoaded();
    }
    bindLoaded() {
      if (document.readyState !== 'loading') {
        this.initAfterLoaded();
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          this.initAfterLoaded();
        });
      }
    }
    initAfterLoaded() {
      this.initDebugMode();
      this.initMutationObserver();
    }
    initDebugMode() {
      const params = qs.parse(window.location.search);
      this.isDebug = params.ssr_debug === '1';
    }
    emitSticky(stickyActive) {
      if (stickyActive) {
        this.sticky();
      } else {
        this.unSticky();
      }
    }
    sticky() {
      if (this.isSticky) {
        return;
      }
      this.isSticky = true;
      this.emitEvent();
    }
    unSticky() {
      if (!this.isSticky) {
        return;
      }
      this.isSticky = false;
      this.emitEvent();
    }
    getAboveElementHeight(headerSectionSelector) {
      const sel = headerSectionSelector || `#${this.headerSectionId}`;
      const that = this;
      let height = 0;
      $(sel).prevAll().each((_, el) => {
        const $el = $(el);
        if ($el.css('position') === 'sticky') {
          const h = $el.height();
          if (that.isDebug) {}
          height = Math.max(height, h);
        }
      });
      return height;
    }
    getThreshold() {
      const total = this.originalThreshold + this.aboveElementHeight;
      return total;
    }
    onMutation(mutationList) {
      const nodesChangedMutation = mutationList.find(mutation => {
        const {
          type,
          addedNodes = [],
          removedNodes = []
        } = mutation;
        const nodesChanged = addedNodes.length || removedNodes.length;
        return type === 'childList' && nodesChanged;
      });
      if (!nodesChangedMutation) {
        return;
      }
      if (this.mutationTimer) {
        clearTimeout(this.mutationTimer);
      }
      this.mutationTimer = setTimeout(() => {
        const height = this.getAboveElementHeight(`#${this.headerSectionId}`);
        if (height !== this.aboveElementHeight) {
          this.aboveElementHeight = height;
          this.emitEvent();
        }
      }, 200);
    }
    initMutationObserver() {
      const targetNode = document.querySelector('body');
      const observerOptions = {
        childList: true
      };
      const observer = new MutationObserver(mutationList => {
        this.onMutation(mutationList);
      });
      observer.observe(targetNode, observerOptions);
    }
    emitEvent() {
      const that = this;
      const headerElement = document.querySelector(that.headerWrapperSelector);
      const headerHeight = headerElement ? headerElement.getBoundingClientRect().height : 0;
      const aboveElementHeight = this.getAboveElementHeight(`#${this.headerSectionId}`);
      that.aboveElementHeight = aboveElementHeight;
      const data = {
        header_sticky: that.isSticky,
        header_height: headerHeight,
        above_element_height: that.aboveElementHeight
      };
      if (that.isDebug) {
        console.groupCollapsed(`[Offical Event]${headerSticky.apiName}`);
        console.table(data);
        console.groupEnd();
      }
      headerSticky(data);
    }
  }
  const headerStickyEvent = new HeaderStickyEvent();
  _exports.headerStickyEvent = headerStickyEvent;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['stage/header/scripts/desktop-site-nav.js'] = window.SLM['stage/header/scripts/desktop-site-nav.js'] || function () {
  const _exports = {};
  let isPad = document.ontouchmove !== undefined;
  if (window.__PRELOAD_STATE__) {
    isPad = window.__PRELOAD_STATE__.request.is_mobile;
  }
  const firstNavItem = '.site-nav--has-dropdown';
  const firstNavItemLink = '.site-nav__link--has-dropdown';
  const registryNavMouseenterHandler = () => {
    document.querySelectorAll(firstNavItem).forEach(element => {
      element.addEventListener('mouseenter', function (e) {
        setCalcMenuDropdownPos(element);
        element.classList.add('actived');
        setSecondMenuMaxHeight(e);
        setActivedMask(true);
      });
      element.addEventListener('mouseleave', function () {
        element.classList.remove('actived');
        setActivedMask(false);
      });
    });
  };
  function setCalcMenuDropdownPos(element) {
    element.style.setProperty('--menu-dropdown-top', `${element.offsetHeight}px`);
  }
  function setActivedMask(flag) {
    const $nav = document.querySelector('.desktop-site-nav');
    const useNavEffectdata = $nav.dataset.navigationEffect;
    if (useNavEffectdata !== 'true') {
      return;
    }
    const {
      insert,
      remove
    } = setHeaderMask();
    if (flag) {
      insert();
    } else {
      remove();
    }
  }
  function setHeaderMask() {
    const maskClass = 'header-wrapper-effect-mask';
    const $headerWrapperMask = document.createElement('div');
    $headerWrapperMask.classList.add(maskClass);
    return {
      insert: () => {
        if (document.querySelector(`.${maskClass}`)) {
          return;
        }
        const $headerWrapper = document.querySelector('.header-sticky-wrapper');
        $headerWrapper.parentElement.insertBefore($headerWrapperMask, $headerWrapper.nextElementSibling);
        handleSameLevel().insert();
      },
      remove: () => {
        const $mask = document.querySelector(`.${maskClass}`);
        if (!$mask) return;
        if ($mask.parentElement) {
          $mask.parentElement.removeChild($mask);
        }
        handleSameLevel().remove();
      }
    };
  }
  function handleSameLevel() {
    const zIndex = 122;
    const $announcementBar = document.querySelector('.announcement-bar__container .announcement-bar__swiper');
    const $toolbar = document.querySelector('.header__top');
    return {
      insert: () => {
        if ($announcementBar) {
          $announcementBar.style.zIndex = zIndex;
        }
        if ($toolbar) {
          const toolbarPos = window.getComputedStyle($toolbar).getPropertyValue('position');
          if (toolbarPos === 'static') {
            $toolbar.style.position = 'relative';
            $toolbar.style.backgroundColor = `rgba(var(--color-page-background))`;
          }
          $toolbar.style.zIndex = zIndex;
        }
      },
      remove: () => {
        if ($announcementBar) {
          $announcementBar.style.removeProperty('z-index');
        }
        if ($toolbar) {
          const toolbarPos = window.getComputedStyle($toolbar).getPropertyValue('position');
          if (toolbarPos === 'relative') {
            $toolbar.style.position = 'static';
            $toolbar.style.removeProperty('background-color');
          }
          $toolbar.style.removeProperty('z-index');
        }
      }
    };
  }
  function setSecondMenuMaxHeight(e) {
    const $nav = document.querySelector('.desktop-site-nav');
    const useNavEffectdata = $nav.dataset.navigationEffect;
    const windowHeight = window.innerHeight;
    const {
      target
    } = e;
    const maxHeight = windowHeight - target.getBoundingClientRect().bottom - 50;
    const megamenuList = target.getElementsByClassName('megamenu');
    const unmegamenuList = target.getElementsByClassName('unmegamenu-container');
    [...unmegamenuList, ...megamenuList].forEach(el => {
      if (useNavEffectdata === 'true') {
        el.style.setProperty('--max-height', `${maxHeight}px`);
      } else {
        el.style.maxHeight = `${maxHeight}px`;
      }
    });
  }
  if (isPad) {
    $(document).on('click', firstNavItemLink, function (e) {
      e.preventDefault();
      e.stopPropagation();
      const $parent = $(this).parent();
      if ($parent.hasClass('actived')) {
        window.location.href = e.target.href;
        $parent.removeClass('actived');
      } else {
        $parent.addClass('actived');
        $(firstNavItem).not($parent).removeClass('actived');
      }
    });
    $(document).on('click', 'body', function (e) {
      const that = $(e.target).parents(firstNavItem);
      if (!that.hasClass('site-nav--has-dropdown')) {
        $(firstNavItem).removeClass('actived');
      }
    });
  } else {
    registryNavMouseenterHandler();
    $(document).on('shopline:section:load', async e => {
      if (e.detail.sectionId === 'header') {
        registryNavMouseenterHandler();
      }
    });
  }
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['stage/header/index.js'] = window.SLM['stage/header/index.js'] || function () {
  const _exports = {};
  const { throttle, debounce } = window['lodash'];
  const request = window['SLM']['theme-shared/utils/request.js'].default;
  const { StickyElementManager } = window['SLM']['theme-shared/utils/stickyElementManager.js'];
  const { DRAWER_EVENT_NAME } = window['SLM']['theme-shared/components/hbs/shared/components/drawer/const.js'];
  const { headerStickyEvent } = window['SLM']['theme-shared/utils/headerStickyEvent.js'];
  const Swiper = window['swiper']['default'];
  const Base = window['SLM']['commons/base/BaseClass.js'].default;
  const { OPEN_MINI_CART, CLOSE_MINI_CART } = window['SLM']['commons/cart/globalEvent.js'];
  const isMobile = window['SLM']['commons/utils/isMobile.js'].default;
  class Header extends Base {
    constructor() {
      super();
      this.config = {
        namespace: 'satge:header',
        wrapperOverlayed: false,
        stickyEnabled: false,
        stickyActive: false,
        stickyHeader: false,
        lastScroll: 0,
        forceStopSticky: false,
        stickyHeaderWrapper: 'StickyHeaderWrap',
        swiperBreakpoint: 750,
        lastStickOffsetTop: 0
      };
      this.classes = {
        overlayedClass: 'header--is-light',
        stickyClass: 'header__main--sticky',
        openTransitionClass: 'header__main--opening',
        activateSwiperClass: 'swiper-wrapper',
        activateSwiperContainer: 'swiper-container',
        activeCartClass: 'header__cart--active',
        outerWrapperSticky: 'is-sticky',
        wrapperSticky: 'header-wrapper--sticky',
        activeNavClass: 'show-nav',
        headerBtnLink: 'header__btn--link',
        headerBtnActive: 'header__btn--on',
        headerBtnWrapperActive: 'header__btn--active'
      };
      this.selectors = {
        wrapper: '#stage-headerWrapper',
        header: '#stage-header',
        drawerBtn: '.j-header-drawer-btn',
        miniCart: '.header__cart',
        cartBtn: '#stage-header-cart',
        cartPoint: '.header__cart-point',
        logoImage: '.header__logo--link img',
        outerWrapper: '.header-sticky-wrapper',
        logoImag: '.header__logo--link img',
        notOverlayId: '#CollectionHeaderSection',
        navBtn: '.j-header-nav-btn',
        headerBtn: '.header__btn',
        headerBtnWrapper: '.header__item--buttons',
        menuBtn: '.header__btn--menu',
        layoutContainer: '.header__layout-container',
        sectionOuterHeaderWrapper: '#shopline-section-header',
        mobileTopNav: '.mobile-site-nav__swiper'
      };
      this.jq = {
        header: $(),
        wrapper: $(),
        stickyHeaderWrapper: $()
      };
      this.menuDrawer = null;
      this.$setNamespace(this.config.namespace);
      this.jq.header = $(this.selectors.header);
      this.jq.wrapper = $(this.selectors.wrapper);
      this.stickyElementManager = new StickyElementManager();
      this.bindCartEvent();
      this.initAfterLoaded();
      this.bindHeaderNav();
      const $img = $(this.selectors.logoImag);
      let waitForImg = null;
      if ($img.length) {
        waitForImg = $img.toArray().find(img => img.offsetParent !== null);
      }
      if (waitForImg) {
        if (waitForImg.complete && waitForImg.naturalHeight !== 0) {
          this.initHeader();
        } else {
          waitForImg.onload = () => {
            this.initHeader();
          };
        }
      } else {
        $(() => {
          this.initHeader();
        });
      }
      this.initMobileTopNav();
    }
    initAfterLoaded() {
      if (document.readyState !== 'loading') {
        this.bindCartCount();
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          this.bindCartCount();
        });
      }
    }
    initHeader() {
      this.config.stickyEnabled = this.jq.header.data('sticky');
      if (this.config.stickyEnabled) {
        const notOverlay = $(this.selectors.notOverlayId);
        if (notOverlay.length) {
          this.config.wrapperOverlayed = false;
          this.jq.wrapper.removeClass(this.classes.overlayedClass);
          this.jq.wrapper.removeClass(this.classes.wrapperSticky);
        } else {
          this.config.wrapperOverlayed = this.jq.wrapper.data('overlay');
        }
        this.stickyHeaderCheck();
      }
      window.SL_EventBus.on('force-header-intoView', () => {
        if (window.scrollY < 250 && window.scrollY > 0) {
          $(this.selectors.header)[0].scrollIntoView();
        }
      });
      window.SL_EventBus.on('stage:locale:change', () => {
        const domEl = this.jq.stickyHeaderWrapper[0];
        if (domEl && domEl.style.height) {
          domEl.style.height = 'auto';
          this.stickyHeaderHeight();
        }
      });
    }
    stickyHeaderCheck() {
      this.config.stickyHeader = true;
      if (this.config.stickyHeader) {
        this.config.forceStopSticky = false;
        this.stickyHeader();
      } else {
        this.config.forceStopSticky = true;
      }
    }
    stickyHeader() {
      this.config.lastScroll = 0;
      const wrapWith = document.createElement('div');
      wrapWith.id = this.config.stickyHeaderWrapper;
      this.jq.header.wrap(wrapWith);
      this.jq.stickyHeaderWrapper = $(`#${wrapWith.id}`);
      this.stickyHeaderHeight();
      this.stickyHeaderScroll();
      setTimeout(() => {
        requestAnimationFrame(this.scrollWorker.bind(this));
      }, 2500);
      this.$onWin('resize', debounce(this.stickyHeaderHeight.bind(this), 50));
      this.$onWin('scroll', throttle(this.stickyHeaderScroll.bind(this), 20));
      if (window.Shopline.designMode) {
        const $logoImage = $(this.selectors.logoImage);
        const onLoadHandler = () => {
          setTimeout(() => {
            this.stickyHeaderHeight();
          }, 1000);
          $logoImage.off('load');
        };
        $logoImage.on('load', onLoadHandler);
      }
    }
    stickyHeaderScroll() {
      if (!this.config.stickyEnabled) {
        return;
      }
      if (this.config.forceStopSticky) {
        return;
      }
      requestAnimationFrame(this.scrollWorker.bind(this));
      this.config.lastScroll = window.scrollY;
    }
    scrollWorker() {
      if (window.scrollY > 250) {
        this.doSticky();
      } else {
        this.undoSticky();
      }
    }
    emitSticky(stickyActive) {
      headerStickyEvent.emitSticky(stickyActive);
      const headerHeight = $(this.selectors.header).height();
      const stickOffsetTop = this.getStickHeaderOffsetTop();
      this.config.lastStickOffsetTop = stickOffsetTop;
      window.SL_EventBus.emit('stage:header:sticky', {
        stickyActive,
        headerHeight
      });
      window.SL_EventBus.emit('stage:header:stickOffsetTopUpdate', {
        stickOffsetTop,
        stickyActive
      });
    }
    undoSticky() {
      if (this.config.stickyActive === false) {
        return;
      }
      this.config.stickyActive = false;
      this.jq.header.removeClass([this.classes.openTransitionClass, this.classes.stickyClass]);
      $(this.selectors.outerWrapper).removeClass(this.classes.outerWrapperSticky);
      this.jq.header.css({
        top: 0
      });
      this.jq.stickyHeaderWrapper.eq(0).height('auto');
      if (this.config.wrapperOverlayed) {
        this.jq.wrapper.addClass(this.classes.overlayedClass);
      }
      this.emitSticky(false);
    }
    doSticky() {
      const stickOffsetTop = this.getStickHeaderOffsetTop();
      const isNeedRerender = !this.config.stickyActive || this.config.lastStickOffsetTop !== stickOffsetTop;
      if (!isNeedRerender) {
        return;
      }
      this.config.stickyActive = true;
      const height = $(this.selectors.header).innerHeight();
      this.jq.header.addClass(this.classes.stickyClass);
      this.jq.stickyHeaderWrapper.eq(0).height(height);
      this.jq.header.addClass(this.classes.stickyClass);
      if (this.config.wrapperOverlayed) {
        this.jq.wrapper.removeClass(this.classes.overlayedClass);
      }
      setTimeout(() => {
        this.jq.header.addClass(this.classes.openTransitionClass);
        $(this.selectors.outerWrapper).addClass(this.classes.outerWrapperSticky);
        this.emitSticky(true);
        this.jq.header.css({
          top: stickOffsetTop
        });
      }, 100);
    }
    stickyHeaderHeight() {
      if (!this.config.stickyEnabled) {
        return;
      }
      const headerLayoutBackgroundHeight = $('.header__layout-background').css('height') || 0;
      const h = headerLayoutBackgroundHeight;
      this.jq.stickyHeaderWrapper[0].style.height = this.config.wrapperOverlayed ? 'auto' : `${h}px`;
    }
    getStickHeaderOffsetTop() {
      return headerStickyEvent.getAboveElementHeight();
    }
    bindCartEvent() {
      this.$on('click', this.selectors.miniCart, e => {
        const $btn = $(e.currentTarget);
        if ($btn.hasClass('header__btn--on')) {
          window.SL_EventBus.emit(CLOSE_MINI_CART);
        } else {
          window.SL_EventBus.emit(OPEN_MINI_CART);
        }
      });
    }
    bindHeaderNav() {
      this.$on('click', this.selectors.navBtn, () => {
        $(this.selectors.layoutContainer).toggleClass(this.classes.activeNavClass);
      });
      this.$on('click', this.selectors.drawerBtn, () => {
        const hasMobileMenu = $('#mobile-menu-drawer').length > 0;
        const id = isMobile() && hasMobileMenu ? 'mobile-menu-drawer' : 'menu-drawer';
        window.SL_EventBus.emit(DRAWER_EVENT_NAME, {
          id,
          status: 'open'
        });
      });
    }
    swiperResizeHandler() {
      this.disableSwiper();
      this.activateSwiper();
    }
    fetchCartInfo() {
      return request({
        url: 'carts/cart/count',
        method: 'GET'
      }).then(res => {
        if (res.success) {
          return Promise.resolve(res.data);
        }
      });
    }
    bindCartCount() {
      window.SL_State.on('cartInfo', () => {
        const num = window.SL_State.get('cartInfo.count');
        this.activeCart(num);
      });
      this.fetchCartInfo().then(num => {
        this.activeCart(num);
      });
    }
    activeCart(cartNum) {
      const cartBtn = $(this.selectors.cartBtn);
      if (!cartBtn.length) {
        return;
      }
      if (cartNum) {
        cartBtn.removeClass(this.classes.activeCartClass).addClass(this.classes.activeCartClass);
        $(this.selectors.cartPoint).html(cartNum);
      } else {
        cartBtn.removeClass(this.classes.activeCartClass);
      }
    }
    offEventBus() {
      window.SL_EventBus.off('force-header-intoView');
    }
    initMobileTopNav() {
      const $wrapper = $(this.selectors.mobileTopNav);
      if ($wrapper.length === 0) return;
      this.swiperInstance = new Swiper(this.selectors.mobileTopNav, {
        slideClass: 'mobile-site-nav__item-slide',
        slidesPerView: 'auto'
      });
    }
    off() {
      this.$offAll();
      this.stickyElementManager.offEvent();
      this.offEventBus();
      this.swiperInstance && this.swiperInstance.destroy();
    }
  }
  let instance = new Header();
  const getHeaderSectionId = () => {
    return $(instance.selectors.wrapper).data('section=id');
  };
  _exports.getHeaderSectionId = getHeaderSectionId;
  $(document).on('shopline:section:load', () => {
    instance.off();
    instance = null;
    instance = new Header();
  });
  return _exports;
}();