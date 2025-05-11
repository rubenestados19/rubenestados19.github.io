window.SLM = window.SLM || {};
window.SLM['product/collections/js/sort.js'] = window.SLM['product/collections/js/sort.js'] || function () {
  const _exports = {};
  const querystring = window['querystring']['default'];
  const { getUrlAllQuery } = window['SLM']['commons/utils/url.js'];
  _exports.default = () => {
    $('#collectionsAjaxInner').delegate('#collection-sort', 'change', function (event) {
      const newQueryObj = {
        ...getUrlAllQuery(),
        sort_type: event.detail
      };
      const newQueryStr = querystring.stringify(newQueryObj);
      setTimeout(() => {
        window.location.href = `${window.location.origin + window.location.pathname}?${newQueryStr}`;
      }, 0);
    });
    if ($('#product-list-list-header-filter').css('display') === 'none') {
      $('.product-list-filter-container').css('width', '100%');
    }
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/events/product/updateSection/index.js'] = window.SLM['theme-shared/events/product/updateSection/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const EVENT_NAME = 'Product::UpdateSection::Filter';
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
window.SLM['product/collections/js/sidebar.js'] = window.SLM['product/collections/js/sidebar.js'] || function () {
  const _exports = {};
  const axios = window['axios']['default'];
  const querystring = window['querystring']['default'];
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const chunk = window['lodash']['chunk'];
  const filterUpdateSection = window['SLM']['theme-shared/events/product/updateSection/index.js'].default;
  const { disablePageScroll, enablePageScroll } = window['SLM']['commons/components/modal/common.js'];
  const { updateUrlQueryParam, getUrlAllQuery } = window['SLM']['commons/utils/url.js'];
  const createShadowDom = window['SLM']['product/commons/js/createShadowDom.js'].default;
  const { DRAWER_CALLBACK_EVENT_NAME } = window['SLM']['commons/components/topDrawer/index.js'];
  const Base = window['SLM']['commons/base/BaseClass.js'].default;
  const base = new Base();
  class Sidebar {
    constructor(opt) {
      this.options = $.extend({}, opt);
      this.$menu = $('.product-list-menu');
      this.$collectionsAjaxInner = $('#collectionsAjaxInner');
      this.listGridSelector = {
        trigger: '.product-grid-select'
      };
      this.listListNumSelector = {
        trigger: '.J_product_list_showby'
      };
      this.listGridWrapCls = {
        small_grid: 'row g-4 row-cols-2 row-cols-md-4 product-list-small-grid product-list-item-parent-controller',
        list: 'row g-4 row-cols-1 row-cols-md-1 product-list-single-grid product-list-item-parent-controller'
      };
      this.collapsePanelSelectors = {
        trigger: '.collapsible-trigger',
        module: '.collapsible-content',
        moduleInner: '.collapsible-content-inner'
      };
      this.collapsePanelClasses = {
        hide: 'hide',
        show: 'is-open',
        auto: 'collapsible-autoHeight'
      };
      this.tagSelectors = {
        tag: '.product_base-checkbox',
        activeTagsList: '.product_sidebar-activeTagList',
        activeTagsListItem: '.product_sidebar-activeTagList-item',
        drawerFilterBtn: '#collections-drawer-filter',
        moreBtn: '.product-list-sidebar-box-ul-more'
      };
      this.tagClasses = {
        active: 'tag-active',
        none: 'tag-none',
        remove: 'tag-remove',
        drawerFilterBtnActive: 'filter-active',
        moreClass: 'filterHasMore'
      };
      this.config = {
        combineTags: false
      };
      this.filterRelationClasses = {
        filters: '#js-product-collections-mobile-filters',
        container: '#js-product-collections_filter_container',
        wrapper: '.product_collections-filters-wrapper',
        drawer: '.product_collections-drawer',
        header: '#stage-header .header__layout',
        headerWrapper: '.header-sticky-wrapper',
        isActive: 'is-active',
        headerIsSticky: 'is-sticky'
      };
      this.collectionsUrl = window.location.href;
    }
    init() {
      this.initCollapsePanel();
      this.initTags();
      this.initEventBus();
      this.setStyle();
      this.fetchChildCategoryProductNum();
      this.initListGrid();
      this.initListNum();
      this.listenHeaderSticky();
    }
    initCollapsePanel() {
      $(document).on('click', this.collapsePanelSelectors.trigger, this.collapsePanelToggle.bind(this));
    }
    initListGrid() {
      const self = this;
      $(document).on('click', self.listGridSelector.trigger, function () {
        const column = $(this).attr('data-column');
        const updateUrl = updateUrlQueryParam(window.location.href, 'mobile_grid_type', column);
        window.location.href = updateUrl;
      });
    }
    setTransitionHeight(container, height, isOpen) {
      if (height === 0) {
        container.css('height', `0px`);
      } else {
        container.css('height', `auto`);
      }
      if (isOpen) {
        container.removeClass(this.collapsePanelClasses.show);
      } else {
        container.addClass(this.collapsePanelClasses.show);
      }
    }
    collapsePanelToggle(event) {
      const el = $(event.currentTarget);
      const isOpen = el.hasClass('is-open');
      const box = el.siblings(this.collapsePanelSelectors.module);
      if (!box) return;
      const boxHeight = box.find(this.collapsePanelSelectors.moduleInner).outerHeight();
      if (isOpen) {
        el.removeClass(this.collapsePanelClasses.show);
        this.setTransitionHeight(box, 0, isOpen);
      } else {
        el.addClass(this.collapsePanelClasses.show);
        this.setTransitionHeight(box, boxHeight, isOpen);
      }
    }
    initListNum() {
      $(document).on('click', this.listListNumSelector.trigger, function () {
        const newQueryObj = {
          ...getUrlAllQuery(),
          page_num: 1,
          page_size: $(this).attr('data-num')
        };
        const newQueryStr = querystring.stringify(newQueryObj);
        window.location.href = `${window.location.origin + window.location.pathname}?${newQueryStr}`;
      });
    }
    initTags() {
      $(document).on('click', this.tagSelectors.tag, this.tagsToggle.bind(this));
      $(document).on('click', this.tagSelectors.activeTagsListItem, this.tagsToggle.bind(this));
      this.config.combineTags = this.$menu.attr('data-combine-tags') === 'true';
      $(document).on('click', this.tagSelectors.drawerFilterBtn, this.drawerToggle.bind(this));
      $(document).on('click', this.tagSelectors.moreBtn, this.moreClick.bind(this));
    }
    listenHeaderSticky() {}
    tagsToggle(event) {
      const $el = $(event.currentTarget);
      const isActive = $el.hasClass(this.tagClasses.active);
      const isRemove = $el.hasClass(this.tagClasses.remove);
      if (this.config.combineTags) {
        if (isActive) {
          $el.removeClass(this.tagClasses.active);
        } else {
          $el.addClass(this.tagClasses.active);
          if (isRemove) {
            $el.remove();
          } else {
            const tagText = $el.text();
            const tagVal = $el.attr('data-tag');
            const activeTagNode = this.createTagNode(tagText, tagVal);
            $(this.tagSelectors.activeTagsList).append(activeTagNode);
          }
        }
      } else {
        $(this.tagSelectors.tag).removeClass(this.tagClasses.active);
        $el.addClass(this.tagClasses.active);
      }
      this.setNewUrl($el);
    }
    createTagNode(tagText, tagVal) {
      this.tagNode = `
    <li class="product_sidebar-activeTagList-item tag-remove body4" data-tag="${tagVal}">
      <div class="product_sidebar-activeTagList-item-content">
        <span>${tagText}</span>
        <svg class="product_sidebar-activeTagList-item-iconClose" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 1L1 9" stroke="currentColor" stroke-linecap="round"/>
          <path d="M1 1L9 9" stroke="currentColor" stroke-linecap="round"/>
        </svg>
      </div>
    </li>`;
      return this.tagNode;
    }
    getTagsSelected() {
      const $el = $(this.tagSelectors.tag);
      const val = [];
      if ($el.length) {
        Array.from($el).forEach(item => {
          const $dom = $(item);
          if ($dom.hasClass(this.tagClasses.active)) {
            val.push($dom.attr('data-tag'));
          }
        });
      }
      return val;
    }
    setTagsSelected(val) {
      const $el = $(this.tagSelectors.tag);
      Array.from($el).filter(`[data-tag=${val}]`).addClass(this.tagClasses.active);
    }
    setNewUrl($el) {
      let newUrl = $el.attr('data-href') || $el.parent().attr('data-href');
      newUrl = updateUrlQueryParam(newUrl, 'page_num', 1);
      window.history.pushState({}, '', newUrl);
      this.getNewTagsContentAjax(newUrl);
    }
    getNewTagsContentAjax(url) {
      url = url.indexOf('?') === -1 ? `${url}?view=ajax&isJsonSettings=true` : `${url}&view=ajax&isJsonSettings=true`;
      this.fetchCollectionHtml(url);
    }
    fetchCollectionHtml(url) {
      this.closeDrawer();
      axios.get(url).then(res => {
        const {
          data
        } = res;
        this.$collectionsAjaxInner.html(data);
        this.setStyle();
        createShadowDom();
        enablePageScroll();
        filterUpdateSection && filterUpdateSection({
          content: this.$collectionsAjaxInner
        });
        this.renderChildCategoryProductNum();
        const headerHeightNow = $('#stage-header').outerHeight();
        const $top = $('#collectionsAjaxInner').offset().top - headerHeightNow;
        if (typeof this.headerHeight !== 'undefined') {
          $(this.filterRelationClasses.container).css('top', `${this.headerHeight}px`);
        }
        $(document).scrollTop($top);
      });
    }
    drawerToggle(event) {
      const $current = $(event.currentTarget);
      const $filters = $(this.filterRelationClasses.filters);
      const $container = $(this.filterRelationClasses.container);
      const $wrapper = $container.find(this.filterRelationClasses.wrapper);
      $wrapper.parent().css('z-index', 0);
      this.scrollToTop();
      if ($wrapper.length > 0) {
        this.drawerTransition($current);
        return;
      }
      $container.append($filters.clone(true));
      this.drawerTransition($current);
    }
    drawerTransition($current) {
      const $container = $(this.filterRelationClasses.container);
      const $wrapper = $container.find(this.filterRelationClasses.wrapper);
      if (!$wrapper.hasClass(this.filterRelationClasses.isActive)) {
        disablePageScroll($wrapper.get(0));
      }
      base.prepareTransition($wrapper, () => {
        this.toggleFilterActive($current);
      }, () => {
        const isOpen = $current.hasClass('is-open');
        const zIndex = isOpen ? 2 : 0;
        $wrapper.parent().css({
          zIndex
        });
      });
    }
    toggleFilterActive($current) {
      const $container = $(this.filterRelationClasses.container);
      const $wrapper = $container.find(this.filterRelationClasses.wrapper);
      const isOpen = !$current.hasClass('is-open');
      $container.toggleClass('is-open', isOpen);
      $current.toggleClass('is-open', isOpen);
      $wrapper.toggleClass(this.filterRelationClasses.isActive, isOpen);
      if (!isOpen) {
        enablePageScroll($wrapper.get(0));
      }
    }
    scrollToTop() {
      const $header = $(this.filterRelationClasses.header);
      const $headerWrapper = $header.parents(this.filterRelationClasses.headerWrapper);
      const $container = $(this.filterRelationClasses.container);
      const headerHeight = $header.outerHeight();
      const containerHeight = $container.outerHeight();
      const maxFiltersHeight = window.innerHeight - headerHeight - containerHeight;
      const windowScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const containerClientRectTop = $container.get(0).getBoundingClientRect().top;
      const scrollTop = windowScrollTop + containerClientRectTop;
      let realScrollTop = containerClientRectTop > headerHeight ? scrollTop : scrollTop - headerHeight;
      if (containerClientRectTop === headerHeight && !$headerWrapper.hasClass(this.filterRelationClasses.headerIsSticky)) {
        realScrollTop = scrollTop;
      }
      $container.get(0).style.setProperty('--maxFiltersHeight', `${maxFiltersHeight}px`);
      window.scrollTo({
        top: realScrollTop,
        behavior: 'smooth'
      });
    }
    closeDrawer() {
      window.SL_EventBus.emit('stage:drawer', {
        id: 'product_collections-menu-drawer',
        status: 'close'
      });
    }
    moreClick(event) {
      const $el = $(event.currentTarget).find('span');
      const $ul = $el.parent().siblings(this.collapsePanelSelectors.moduleInner);
      if ($ul.hasClass(this.tagClasses.moreClass)) {
        $ul.removeClass(this.tagClasses.moreClass);
        $el.html(t('products.product_list.less'));
      } else {
        $ul.addClass(this.tagClasses.moreClass);
        $el.html(t('products.product_list.more'));
      }
    }
    renderChildCategoryProductNum() {
      const childCategoryDom = $('.product-list-child-category');
      const isOpenProductNum = childCategoryDom.data('show-product-num');
      if (this.sortationCountVoList && isOpenProductNum) {
        this.sortationCountVoList.forEach(item => {
          const targetSortation = childCategoryDom.find(`[data-sortation-id="${item.sortationId}"]`);
          const innerText = targetSortation.eq(0).text();
          targetSortation.text(`${innerText} — ${item.count}`);
        });
      }
    }
    fetchChildCategoryProductNum() {
      const allChildSortation = $('[data-all-show-sortation-ids]').eq(0);
      const isOpenProductNum = $('.product-list-child-category').data('show-product-num');
      if (allChildSortation.length === 0 || !isOpenProductNum) return;
      const sortationIds = allChildSortation.data('all-show-sortation-ids').split(', ');
      const chunks = chunk(sortationIds, 20);
      const promise = [];
      chunks.forEach((item, index) => {
        const chunkSortationIds = item.join(',');
        const apiPrefix = window.location.hostname === 'localhost' ? '/leproxy/api' : '/api';
        promise[index] = axios.get(`${apiPrefix}/product/list/sortation/count/query?sortationIdStr=${chunkSortationIds}`);
      });
      this.sortationCountVoList = [];
      Promise.all(promise).then(res => {
        res.forEach(item => {
          const {
            data
          } = item.data || {};
          if (data && data.sortationCountVoList) {
            data.sortationCountVoList.forEach(_ => {
              this.sortationCountVoList.push(_);
            });
          }
        });
        this.renderChildCategoryProductNum();
      });
    }
    initEventBus() {
      const $this = this;
      $(document).on('shopline:section:load', e => {
        if (e.detail.sectionId === 'collection-page') {
          $this.$menu = $('.product-list-menu');
          $this.$collectionsAjaxInner = $('#collectionsAjaxInner');
          $this.config.combineTags = $this.$menu.attr('data-combine-tags') === 'true';
          if (!this.sortationCountVoList) {
            $this.fetchChildCategoryProductNum();
          } else {
            $this.renderChildCategoryProductNum();
          }
        }
      });
      window.SL_EventBus.on(DRAWER_CALLBACK_EVENT_NAME, ({
        status,
        id
      }) => {
        if (status === 'open') {
          $(`#${id} .drawer__main`).scrollTop(0);
        }
      });
      window.Shopline.event.on('Stage::HeaderSticky', ({
        data
      }) => {
        const top = data.header_sticky ? data.header_height + data.above_element_height : data.above_element_height;
        $('#js-product-collections_filter_container').css({
          top
        });
        $('body').css({
          '--collection-filter-sticky-top': `${top}px`
        });
      });
    }
    setFilterText() {
      const $filterDom = $('#collections-drawer-filter');
      if (!$filterDom) {
        return;
      }
      const num = this.getTagsSelected().length;
      const $filterDomText = $filterDom.find('.product_collections-drawer-filter-text');
      const textStr = `Filter（${num}）`;
      if (num > 0 && $filterDomText) {
        $filterDomText.html(textStr);
      } else if (num < 0) {
        $filterDomText.html('Filter');
      }
    }
    setStyle() {
      const header = $('#stage-header');
      const headerIsSticky = header.data('sticky');
      const headerHeight = headerIsSticky ? header.outerHeight() : 0;
      const windowHeight = $(window).outerHeight();
      const filterTop = 45;
      $('.product-list-filter').css({
        maxHeight: headerIsSticky ? `${windowHeight - headerHeight}px` : `${windowHeight - filterTop}px`,
        top: headerIsSticky ? `${headerHeight + 10}px` : `${filterTop}px`
      });
    }
  }
  _exports.default = Sidebar;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/collections/js/infiniteScrollList.js'] = window.SLM['product/collections/js/infiniteScrollList.js'] || function () {
  const _exports = {};
  const axios = window['axios']['default'];
  const filterUpdateSection = window['SLM']['theme-shared/events/product/updateSection/index.js'].default;
  const { changeURLArg, delParam, getUrlQuery } = window['SLM']['commons/utils/url.js'];
  function initWhenVisible(options) {
    const threshold = options.threshold ? options.threshold : 0;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (typeof options.callback === 'function') {
            options.callback(entry);
          }
        }
      });
    }, {
      rootMargin: `0px 0px ${threshold}px 0px`
    });
    observer.observe(options.observeElement[0]);
    return observer;
  }
  _exports.initWhenVisible = initWhenVisible;
  class InfiniteScrollList {
    constructor(options) {
      this.loading = false;
      this.options = options;
      this.anchorObserverTarget = null;
      this.button = document.querySelector('#infinite-scroll-button');
      this.buttonWrapper = document.querySelector('.infinite-scroll-button-wrapper');
      this.cachePageKey = 'SL_COLLECTION_CACHE';
      this.cacheLastClickKey = 'SL_COLLECTION_LAST_CLICKED_ID';
      this.cacheLastScrollKey = 'SL_COLLECTION_LAST_SCROLL';
      this.init(options);
      this.destroyUpdateSectionEvent = this.listerUpdateSection();
    }
    deletePageNumParamByUrl() {
      const hasPageNumParam = getUrlQuery('page_num');
      if (hasPageNumParam) {
        const fixUrl = delParam('page_num');
        window.history.pushState({}, '', fixUrl);
      }
    }
    init(options) {
      this.checkHistory();
      this.bindProductClick();
      this.deletePageNumParamByUrl();
      if (this.anchorObserverTarget) {
        this.anchorObserverTarget.disconnect();
      }
      const infiniteScrollAnchor = $('.product-list-infinite-scroll-anchor');
      const isInitLastPage = infiniteScrollAnchor.length <= 0;
      if (isInitLastPage) return;
      const useButton = Boolean(this.button);
      if (useButton) {
        this.bindButton();
        return;
      }
      const _options = {
        observeElement: infiniteScrollAnchor,
        callback: () => {
          this.loadMore();
        },
        ...options
      };
      this.anchorObserverTarget = initWhenVisible(_options);
    }
    bindProductClick() {
      $('.product-infinite-list-container').on('click', e => {
        const card = e.target.closest('.js-product-item');
        const {
          id
        } = card.dataset;
        this.cacheClickId(id);
      });
    }
    checkHistory() {
      const cachePage = window.sessionStorage.getItem(this.cachePageKey);
      const cacheLastScroll = window.sessionStorage.getItem(this.cacheLastScrollKey);
      if (!cachePage || !cacheLastScroll) {
        return;
      }
      try {
        const cachePageData = JSON.parse(cachePage);
        if (cachePageData.currentPath !== window.location.pathname) {
          return;
        }
        const lastLoadPage = cachePageData.pages[cachePageData.pages.length - 1];
        const contentWrapper = $('.product-infinite-list-container');
        const loadingElement = $('.product-list-infinite-scroll-anchor');
        contentWrapper.html(lastLoadPage.html.list);
        loadingElement.attr('data-pageNum', lastLoadPage.page);
        window.scrollTo({
          top: cacheLastScroll,
          behavior: 'smooth'
        });
        window.sessionStorage.removeItem(this.cacheLastScrollKey);
      } catch (error) {}
    }
    bindButton() {
      this.button.addEventListener('click', () => {
        if (this.isLastPageLoaded) {
          return;
        }
        if (!this.loading) {
          this.loadMore();
        }
      });
    }
    listerUpdateSection() {
      const bindInit = this.init.bind(this);
      window.Shopline.event.on('Product::UpdateSection::Filter', bindInit);
      window.Shopline.event.on('plugin::filter::updateSection', bindInit);
      return () => {
        window.Shopline.event.off('Product::UpdateSection::Filter', bindInit);
        window.Shopline.event.off('plugin::filter::updateSection', bindInit);
      };
    }
    handleLoading(isLoad) {
      this.loading = isLoad;
      this.handleLoadingButton(isLoad);
      if (isLoad) {
        $('.product-list-infinite-scroll-loading').css('display', 'flex');
      } else {
        $('.product-list-infinite-scroll-loading').css('display', 'none');
      }
    }
    handleLoadingButton(loading) {
      if (!this.button) {
        return;
      }
      const loadingActiveClass = 'disabled';
      if (loading) {
        this.button.classList.add(loadingActiveClass);
      } else {
        this.button.classList.remove(loadingActiveClass);
      }
      if (this.isLastPageLoaded) {
        this.buttonWrapper.classList.add('hidden');
      }
    }
    get isLastPageLoaded() {
      const lastPageEle = $('.product-infinite-list-lastPage');
      const isLoadMoreLastPage = lastPageEle.length > 0;
      return isLoadMoreLastPage;
    }
    loadMore() {
      const observeEle = $('.product-list-infinite-scroll-anchor');
      const appendEle = $('.product-infinite-list-container');
      const lastPageEle = $('.product-infinite-list-lastPage');
      const isLoadMoreLastPage = lastPageEle.length > 0;
      if (isLoadMoreLastPage) {
        this.anchorObserverTarget.disconnect();
      }
      if (this.loading || isLoadMoreLastPage) return;
      const pageNum = Number(observeEle.attr('data-pageNum')) + 1;
      this.handleLoading(true);
      const requestUrl = changeURLArg(window.location.search, 'page_num', pageNum, false);
      const collectionPath = window.location.pathname;
      axios.get(`${collectionPath}${requestUrl}&view=ajax&isJsonSettings=true&loadMore=true`).then(res => {
        const {
          data
        } = res;
        if (data) {
          const children = $(data).children();
          appendEle.append(children);
          observeEle.attr('data-pageNum', pageNum);
          filterUpdateSection({
            content: appendEle
          });
          this.cachePage({
            page: pageNum,
            html: {
              list: appendEle.html()
            }
          });
        }
      }).catch(err => {
        console.error(`InfiniteScrollList ${err}`);
      }).finally(() => {
        this.handleLoading(false);
      });
    }
    cacheClickId(id) {
      window.sessionStorage.setItem(this.cacheLastClickKey, id);
      window.sessionStorage.setItem(this.cacheLastScrollKey, window.scrollY);
    }
    cachePage(cacheItem) {
      const cacheKey = this.cachePageKey;
      const initialData = {
        currentPath: window.location.pathname,
        pages: []
      };
      let cacheData = window.sessionStorage.getItem(cacheKey);
      if (!cacheData) {
        cacheData = initialData;
      } else {
        try {
          cacheData = JSON.parse(cacheData);
          if (cacheData.currentPath !== window.location.pathname) {
            cacheData = initialData;
          }
        } catch (error) {
          cacheData = initialData;
        }
      }
      cacheData.pages.push(cacheItem);
      window.sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
    }
    destroy() {
      if (this.anchorObserverTarget) {
        this.anchorObserverTarget.disconnect();
      }
      if (this.destroyUpdateSectionEvent) {
        this.destroyUpdateSectionEvent();
      }
    }
  }
  _exports.default = InfiniteScrollList;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/collections/js/report.js'] = window.SLM['product/collections/js/report.js'] || function () {
  const _exports = {};
  const { collectObserver } = window['SLM']['theme-shared/utils/report/index.js'];
  const ProductItemReport = window['SLM']['theme-shared/report/product/product-item.js'].default;
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const getCurrencyCode = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'].default;
  const { convertPrice } = window['SLM']['theme-shared/utils/currency/getCurrencyCode.js'];
  const hdReport = new ProductItemReport();
  const eventid = '60006260';
  const productItemClassName = '__sl-custom-track-product-list-item';
  const productItemSelector = `.${productItemClassName}`;
  const productMenuClassName = '__sl-custom-track-product-menu';
  const productMenuSelector = `.${productMenuClassName}`;
  const productMenuItemClassName = '__sl-custom-track-product-menu-item';
  const productMenuItemSelector = `.${productMenuItemClassName}`;
  const _productList = SL_State.get('products.list');
  const productList = _productList !== undefined ? _productList : null;
  const _productSortation = SL_State.get('productSortation');
  const productSortation = _productSortation !== undefined ? _productSortation : null;
  if (productList) {
    hdReport.itemListView({
      productsInfo: {
        productSortation,
        productList
      }
    });
  }
  const report = function (event_id, value) {
    if (window.HdSdk && window.HdSdk.shopTracker && window.HdSdk.shopTracker.report) {
      window.HdSdk.shopTracker.report(event_id, value);
    }
  };
  window.SL_EventBus.on('global:hdReport:expose', target => {
    const $target = $(target);
    if ($target.hasClass(productItemClassName)) {
      const product_id = $target.data('id');
      const product_name = $target.data('name');
      const product_price = convertPrice($target.data('price'));
      const position = $target.data('index') + 1;
      const status = $target.data('status') ? 'soldout' : 'selling';
      report(eventid, {
        event_name: 'product_view',
        product_id,
        product_name,
        currency: getCurrencyCode(),
        product_price,
        position,
        status
      });
    } else if ($target.hasClass(productMenuClassName)) {
      report(eventid, {
        page: 'product_list',
        event_name: 'component_view',
        custom_component: 'product_menu'
      });
      report(eventid, {
        event_name: 'menu_view',
        product_menu: ($target.data('all-show-sortation-ids') || '').split(', ')
      });
    }
  });
  collectObserver({
    selector: productItemSelector
  });
  collectObserver({
    selector: productMenuSelector
  });
  const sortBy = {
    1: 'default',
    2: 'default',
    3: 'newestToOldest',
    4: 'priceLowToHigh',
    5: 'priceHighToLow'
  };
  $(document.body).on('click', productMenuSelector, function () {
    report(eventid, {
      event_name: 'click_component',
      page: 'product_list',
      custom_component: 'product_menu'
    });
  }).on('click', productMenuItemSelector, function () {
    report(eventid, {
      event_name: 'menu_click',
      product_menu: [$(this).data('sortation-id')]
    });
  }).on('change', '#collection-sort', function (event) {
    report(eventid, {
      event_name: 'sort_click',
      sort_by: sortBy[event.detail] || sortBy[1]
    });
  });
  window.SL_EventBus.emit('global:hdReport:exit', [eventid]);
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/components/hbs/active/js/index.js'] = window.SLM['theme-shared/components/hbs/active/js/index.js'] || function () {
  const _exports = {};
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['product/collections/main.js'] = window.SLM['product/collections/main.js'] || function () {
  const _exports = {};
  const { registrySectionConstructor } = window['SLM']['theme-shared/utils/sectionsLoad/index.js'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const SortChange = window['SLM']['product/collections/js/sort.js'].default;
  const createShadowDom = window['SLM']['product/commons/js/createShadowDom.js'].default;
  const Sidebar = window['SLM']['product/collections/js/sidebar.js'].default;
  const InfiniteScrollList = window['SLM']['product/collections/js/infiniteScrollList.js'].default;
  const pvTrackData = SL_State.get('productTrackData.plp');
  if (pvTrackData) {
    window.HdSdk && window.HdSdk.shopTracker.report('60006260', pvTrackData.hd);
    window.SL_EventBus && window.SL_EventBus.emit('global:thirdPartReport', pvTrackData.thirdPart());
  }
  const sideBar = new Sidebar({});
  sideBar.init();
  class CollectionsPage {
    constructor() {
      SortChange();
      const isListInfiniteScroll = $('.product-list-is-infinite-scroll-mode').length > 0;
      if (isListInfiniteScroll) {
        this.infiniteScrollInstance = new InfiniteScrollList({
          threshold: 400
        });
      }
      createShadowDom();
    }
    onUnload() {
      if (this.infiniteScrollInstance) {
        this.infiniteScrollInstance.destroy();
      }
    }
  }
  _exports.default = CollectionsPage;
  CollectionsPage.type = 'collections-page';
  registrySectionConstructor('collections-page', CollectionsPage);
  return _exports;
}();