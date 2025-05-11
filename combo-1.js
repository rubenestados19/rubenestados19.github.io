window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/emailReg.js'] = window.SLM['theme-shared/utils/emailReg.js'] || function () {
  const _exports = {};
  const EMAIL_VALID_REGEXP = /^[0-9a-zA-Z\+]+[0-9a-zA-Z\.\-\+\_]*[0-9a-zA-Z\+]+@[0-9a-zA-Z\u4e00-\u9fa5]+(\-?[0-9a-zA-Z\u4e00-\u9fa5]+)*(\.[0-9a-zA-Z\u4e00-\u9fa5]+)+$|^[0-9a-zA-Z\+]+[0-9a-zA-Z\.\-\+\_]*[0-9a-zA-Z\+]+@[0-9a-zA-Z\u4e00-\u9fa5]+(\-?[0-9a-zA-Z\u4e00-\u9fa5]+)*(\.[0-9a-zA-Z\u4e00-\u9fa5]+\-[0-9a-zA-Z\u4e00-\u9fa5]+)+$|^[0-9a-zA-Z\+]+[0-9a-zA-Z\.\-\+\_]*[0-9a-zA-Z\+]+@[0-9a-zA-Z\u4e00-\u9fa5]+(\-?[0-9a-zA-Z\u4e00-\u9fa5]+)*(\.[0-9a-zA-Z\u4e00-\u9fa5]+(\-[0-9a-zA-Z\u4e00-\u9fa5]+)*)+$|^[0-9a-zA-Z\+]+@[0-9a-zA-Z\u4e00-\u9fa5]+(\-?[0-9a-zA-Z\u4e00-\u9fa5]+)*(\.[0-9a-zA-Z\u4e00-\u9fa5]+)+$|^[0-9a-zA-Z\+]+@[0-9a-zA-Z\u4e00-\u9fa5]+(\-?[0-9a-zA-Z\u4e00-\u9fa5]+)*(\.[0-9a-zA-Z\u4e00-\u9fa5]+\-[0-9a-zA-Z\u4e00-\u9fa5]+)+$|^[0-9a-zA-Z\+]+@[0-9a-zA-Z\u4e00-\u9fa5]+(\-?[0-9a-zA-Z\u4e00-\u9fa5]+)*(\.[0-9a-zA-Z\u4e00-\u9fa5]+(\-[0-9a-zA-Z\u4e00-\u9fa5]+)*)+$/;
  _exports.EMAIL_VALID_REGEXP = EMAIL_VALID_REGEXP;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/utils/checkEmail.js'] = window.SLM['commons/utils/checkEmail.js'] || function () {
  const _exports = {};
  const { EMAIL_VALID_REGEXP } = window['SLM']['theme-shared/utils/emailReg.js'];
  const checkEmail = email => {
    if (!EMAIL_VALID_REGEXP.test(String(email).toLowerCase())) {
      return 'regexp';
    }
    if (email && email.length > 50) {
      return 'length.over';
    }
    return true;
  };
  _exports.default = checkEmail;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['commons/components/dropdownList/index.js'] = window.SLM['commons/components/dropdownList/index.js'] || function () {
  const _exports = {};
  const { nullishCoalescingOperator } = window['SLM']['theme-shared/utils/syntax-patch.js'];
  const defaultOptions = {
    triggerClass: 'global-dropdown-list__head',
    dropdownListClass: 'global-dropdown-list__main',
    opendClass: 'is-open',
    closedClass: 'is-close'
  };
  class DropdownList {
    constructor(id) {
      this.id = id;
      this.options = {
        ...defaultOptions
      };
      this._initSelector();
    }
    get status() {
      return this._doActionWithCheck(() => {
        return this.container.hasClass(this.options.opendClass);
      }, false);
    }
    get disabled() {
      return this.container.attr('data-disabled') === 'true';
    }
    set disabled(disabled) {
      this.container.attr('data-disabled', String(!!disabled));
    }
    _initSelector() {
      const {
        id,
        options
      } = this;
      Object.assign(this, getTargetElement($(`#${id}`), options));
    }
    _doActionWithCheck(action, errorReturnValue) {
      if (this.container.length && this.trigger.length && this.dropdownList.length) {
        return action();
      }
      return nullishCoalescingOperator(errorReturnValue, this);
    }
    toggle(flag, effect = true) {
      return this._doActionWithCheck(() => {
        const {
          dropdownList,
          container,
          trigger,
          options
        } = this;
        const nowOptions = {
          ...options,
          trigger,
          container,
          dropdownList
        };
        if (effect) closeOtherReleased(nowOptions);
        toggle(nowOptions, flag);
      });
    }
  }
  function getTargetElement(container, options) {
    const {
      triggerClass,
      dropdownListClass
    } = options;
    const trigger = container.find(`.${triggerClass}`);
    const dropdownList = container.find(`.${dropdownListClass}`);
    return {
      container,
      trigger,
      dropdownList
    };
  }
  function toggle(options, flag) {
    const {
      container,
      dropdownList,
      opendClass,
      closedClass
    } = options;
    const isDisabled = container.attr('data-disabled') === 'true';
    const isOpen = flag == null ? !container.hasClass(opendClass) : flag;
    if (isDisabled) return;
    dropdownList.css('height', isOpen ? dropdownList.prop('scrollHeight') : '');
    if (isOpen) {
      container.addClass(opendClass).removeClass(closedClass);
    } else {
      container.addClass(closedClass).removeClass(opendClass);
    }
  }
  function closeOtherReleased(options) {
    const {
      container
    } = options;
    const attr = 'global-dropdown-list-related-id';
    const relatedId = container.data(attr);
    if (relatedId) {
      $(`[data-${attr}=${relatedId}]`).each((_idx, element) => {
        if (element === container[0]) return;
        toggle({
          ...options,
          ...getTargetElement($(element), options)
        }, false);
      });
    }
  }
  $(function () {
    function openHandler(event) {
      const trigger = $(event.currentTarget);
      const container = trigger.parent('.global-dropdown-list');
      const dropdownList = trigger.siblings('.global-dropdown-list__main');
      const options = {
        ...defaultOptions,
        relatedId: container.data('global-dropdown-list-related-id'),
        container,
        trigger,
        dropdownList
      };
      closeOtherReleased(options);
      toggle(options);
    }
    $('body').on('click', `.global-dropdown-list .${defaultOptions.triggerClass}`, openHandler);
  });
  _exports.default = DropdownList;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['stage/footer/index.js'] = window.SLM['stage/footer/index.js'] || function () {
  const _exports = {};
  const request = window['SLM']['theme-shared/utils/request.js'].default;
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const utils = window['SLM']['commons/utils/index.js'].default;
  const Base = window['SLM']['commons/base/BaseClass.js'].default;
  const checkEmail = window['SLM']['commons/utils/checkEmail.js'].default;
  const debounce = window['SLM']['commons/utils/debounce.js'].default;
  const Toast = window['SLM']['commons/components/toast/index.js'].default;
  const {
    listenPlatform
  } = utils.helper;
  class Footer extends Base {
    constructor() {
      super();
      this.config = {
        namespace: 'satge:footer'
      };
      this.$setNamespace(this.config.namespace);
      this.init();
      listenPlatform(() => {
        this.reset();
      });
    }
    init() {
      this.bindEvent();
      this.initMobileToolkit();
    }
    initMobileToolkit() {
      const $item = $('#stage-footer .j-locale-currency-flag');
      const $root = $('#stage-footer');
      const $localeBtn = $root.find('.j-locale-drawer-btn');
      const $countryBtn = $root.find('.j-country-drawer-btn');
      const locale_selector = $item.data('locale');
      const country_selector = $item.data('country');
      if (locale_selector) {
        $localeBtn.addClass('show');
      }
      if (country_selector) {
        $countryBtn.addClass('show');
      }
    }
    reset() {
      this.offEvent();
      this.init();
    }
    offEvent() {
      this.$off('click');
    }
    bindEvent() {
      this.bindSubscription();
    }
    bindSubscription() {
      const post = debounce(300, val => {
        const params = {
          subscribeAccountType: 'email',
          subscribeAccount: val,
          consentCollectedFrom: 'PageFooter'
        };
        const SLMemberPlugin = window.SLMemberPlugin || {};
        const memberReferralCode = SLMemberPlugin.memberReferralCode || {};
        const referralCode = memberReferralCode.value || null;
        if (referralCode) {
          params.referralCode = referralCode;
        }
        request.post('/user/front/users/footersub', params).then(res => {
          if (res.success) {
            Toast.init({
              content: t('general.footer.subscribe_success')
            });
          } else {
            Toast.init({
              content: t('general.footer.subscribe_format_error')
            });
          }
        }).catch(err => {
          Toast.init({
            content: t('general.footer.subscribe_format_error')
          });
        });
      });
      this.$on('click', '.footer__newsletter-btn', e => {
        const $input = $(e.currentTarget).parent().find('input');
        const value = $input.val();
        if (checkEmail(value) !== true) {
          Toast.init({
            content: t('general.footer.subscribe_format_error')
          });
          return;
        }
        post(value);
      });
    }
  }
  const instance = new Footer();
  $(document).on('shopline:section:load', () => {
    instance.reset();
  });
  return _exports;
}();