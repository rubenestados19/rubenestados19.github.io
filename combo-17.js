window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/constant/errorCode.js'] = window.SLM['theme-shared/biz-com/customer/constant/errorCode.js'] || function () {
  const _exports = {};
  const UDB_STOKEN_TIMEOUT_CODE = -13;
  _exports.UDB_STOKEN_TIMEOUT_CODE = UDB_STOKEN_TIMEOUT_CODE;
  const UDB_RESPONSE_LANGUAGE_ERROR_CODES = [-1, -4, -5, -13, -999, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1020, 1021, 1022, 1023, 1024, 2001, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2016, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010, 3014, 3019, 2014, 3015, 3022, 3023, 3024, 3029, 2020, 3021, 3027];
  _exports.UDB_RESPONSE_LANGUAGE_ERROR_CODES = UDB_RESPONSE_LANGUAGE_ERROR_CODES;
  const MOBILE_REGISTERED = '2001';
  _exports.MOBILE_REGISTERED = MOBILE_REGISTERED;
  const EMAIL_REGISTERED = '2002';
  _exports.EMAIL_REGISTERED = EMAIL_REGISTERED;
  const CAPTCHA_CODE = ['3018', '3021'];
  _exports.CAPTCHA_CODE = CAPTCHA_CODE;
  const TOKEN_ERROR_CODE = ['3022', '3023', '3024'];
  _exports.TOKEN_ERROR_CODE = TOKEN_ERROR_CODE;
  const ACCOUNT_ACTIVATED_CODE = ['3015'];
  _exports.ACCOUNT_ACTIVATED_CODE = ACCOUNT_ACTIVATED_CODE;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/helpers/getUdbResponseLanguageErrorKey.js'] = window.SLM['theme-shared/biz-com/customer/helpers/getUdbResponseLanguageErrorKey.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const { UDB_RESPONSE_LANGUAGE_ERROR_CODES } = window['SLM']['theme-shared/biz-com/customer/constant/errorCode.js'];
  const keyMaps = {
    '-1': '2',
    '-13': '3',
    '-4': '4',
    '-5': '5',
    '-999': '6'
  };
  const getUdbResponseLanguageErrorKey = rescode => {
    if (UDB_RESPONSE_LANGUAGE_ERROR_CODES.indexOf(Number(rescode)) > -1) {
      return `unvisiable.customer.error_message_${keyMaps[rescode] || rescode}`;
    }
    return undefined;
  };
  _exports.getUdbResponseLanguageErrorKey = getUdbResponseLanguageErrorKey;
  function getUdbErrorMessage(res) {
    const errorKey = getUdbResponseLanguageErrorKey(res.rescode);
    return errorKey ? t(errorKey) : res.message;
  }
  _exports.getUdbErrorMessage = getUdbErrorMessage;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/helpers/request.js'] = window.SLM['theme-shared/biz-com/customer/helpers/request.js'] || function () {
  const _exports = {};
  const axios = window['SLM']['theme-shared/utils/request.js'].default;
  const udbRequest = {
    get(url, options = {}) {
      return axios({
        method: 'GET',
        baseURL: '/leproxy',
        url,
        ...options
      });
    }
  };
  _exports.udbRequest = udbRequest;
  const request = axios;
  _exports.request = request;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/service/index.js'] = window.SLM['theme-shared/biz-com/customer/service/index.js'] || function () {
  const _exports = {};
  const { udbRequest, request } = window['SLM']['theme-shared/biz-com/customer/helpers/request.js'];
  const getStoreRegisterConfig = () => {
    return request.get('/user/front/store/config/register');
  };
  _exports.getStoreRegisterConfig = getStoreRegisterConfig;
  const getMemberInitConfig = params => {
    return udbRequest.get('/udb/reg/registermix/init.do', {
      params
    });
  };
  _exports.getMemberInitConfig = getMemberInitConfig;
  const checkAccount = params => {
    return udbRequest.get('/udb/reg/register/checkacct.do', {
      params
    });
  };
  _exports.checkAccount = checkAccount;
  const sendSignUpVerificationCode = params => {
    return udbRequest.get('/udb/reg/register/sendverifycode.do', {
      params
    });
  };
  _exports.sendSignUpVerificationCode = sendSignUpVerificationCode;
  const signUpMember = params => {
    return udbRequest.get('/udb/reg/registermix/regcore.do', {
      params
    });
  };
  _exports.signUpMember = signUpMember;
  const signUpUpdate = data => {
    return request.post('/user/front/users/save', data);
  };
  _exports.signUpUpdate = signUpUpdate;
  function getPolicyPageContent(params) {
    return request.get(`/site/render/page/${params.pageType}/${params.id}`);
  }
  _exports.getPolicyPageContent = getPolicyPageContent;
  const getLoginInitConfig = params => {
    return udbRequest.get('/udb/lgn/login/init.do', {
      params
    });
  };
  _exports.getLoginInitConfig = getLoginInitConfig;
  const loginAccount = params => {
    return udbRequest.get('/udb/lgn/login/verify.do', {
      params
    });
  };
  _exports.loginAccount = loginAccount;
  const sendBindPhoneVerificationCode = params => {
    return udbRequest.get('/udb/aq/mobile/bind/sendSms.do', {
      params
    });
  };
  _exports.sendBindPhoneVerificationCode = sendBindPhoneVerificationCode;
  const sendPhoneVerificationCode = params => {
    return udbRequest.get('/udb/aq/uni/sendSms.do', {
      params
    });
  };
  _exports.sendPhoneVerificationCode = sendPhoneVerificationCode;
  const sendEmailVerificationCode = params => {
    return udbRequest.get('/udb/aq/uni/sendEmailCode.do', {
      params
    });
  };
  _exports.sendEmailVerificationCode = sendEmailVerificationCode;
  const verifyPhoneVerificationCode = params => {
    return udbRequest.get('/udb/aq/uni/verifySms.do', {
      params
    });
  };
  _exports.verifyPhoneVerificationCode = verifyPhoneVerificationCode;
  const verifyEmailVerificationCode = params => {
    return udbRequest.get('/udb/aq/uni/verifyEmailCode.do', {
      params
    });
  };
  _exports.verifyEmailVerificationCode = verifyEmailVerificationCode;
  const signOut = params => {
    return udbRequest.get('/udb/lgn/login/logout.do', {
      params
    });
  };
  _exports.signOut = signOut;
  const signInThird = params => {
    return udbRequest.get('/udb/lgn/third/open/login.do', {
      params
    });
  };
  _exports.signInThird = signInThird;
  const saveThirdChannelInfo = data => {
    return request.post('/user/front/users/saveThirdChannelInfo', data);
  };
  _exports.saveThirdChannelInfo = saveThirdChannelInfo;
  const thirdLoginAndBind = params => {
    return udbRequest.get('/udb/lgn/third/open/loginAndBind.do', {
      params
    });
  };
  _exports.thirdLoginAndBind = thirdLoginAndBind;
  const thirdLoginAndBindByBindToken = params => {
    return udbRequest.get('/udb/lgn/third/open/thirdLoginAndBindByBindToken.do', {
      params
    });
  };
  _exports.thirdLoginAndBindByBindToken = thirdLoginAndBindByBindToken;
  const bindUidAccountMix = params => {
    return udbRequest.get('/udb/lgn/third/open/bindUidAccountMix.do', {
      params
    });
  };
  _exports.bindUidAccountMix = bindUidAccountMix;
  const getChangePasswordInitConfig = params => {
    return udbRequest.get('/udb/aq/pwd/change/init.do', {
      params
    });
  };
  _exports.getChangePasswordInitConfig = getChangePasswordInitConfig;
  const signInUpdate = data => {
    return request.post('/user/front/users/update', data);
  };
  _exports.signInUpdate = signInUpdate;
  const updateUserInfo = () => {
    return request.put('/carts/cart/cart-buyer-update');
  };
  _exports.updateUserInfo = updateUserInfo;
  const setSubscriptionStateNoLogin = data => {
    return request.post('/user/front/sub/stateNoLogin', data);
  };
  _exports.setSubscriptionStateNoLogin = setSubscriptionStateNoLogin;
  const resetPasswordByToken = params => {
    return udbRequest.get('/udb/aq/pwd/retrieve/token/modify.do', {
      params
    });
  };
  _exports.resetPasswordByToken = resetPasswordByToken;
  const getRetrieveTokenInitConfig = params => {
    return udbRequest.get('/udb/aq/pwd/retrieve/token/init.do', {
      params
    });
  };
  _exports.getRetrieveTokenInitConfig = getRetrieveTokenInitConfig;
  const activateByToken = params => {
    return udbRequest.get('/udb/aq/pwd/activate/token/modify.do', {
      params
    });
  };
  _exports.activateByToken = activateByToken;
  const getActivateTokenInitConfig = params => {
    return udbRequest.get('/udb/aq/pwd/activate/token/init.do', {
      params
    });
  };
  _exports.getActivateTokenInitConfig = getActivateTokenInitConfig;
  const getRetrieveInitConfig = params => {
    return udbRequest.get('/udb/aq/pwd/retrieve/init.do', {
      params
    });
  };
  _exports.getRetrieveInitConfig = getRetrieveInitConfig;
  const getRetrievePrechk = params => {
    return udbRequest.get('/udb/aq/pwd/retrieve/prechk.do', {
      params
    });
  };
  _exports.getRetrievePrechk = getRetrievePrechk;
  const getMethodList = params => {
    return udbRequest.get('/udb/aq/uni/getMethodList.do', {
      params
    });
  };
  _exports.getMethodList = getMethodList;
  const resetPassword = params => {
    return udbRequest.get('/udb/aq/pwd/retrieve/modify.do', {
      params
    });
  };
  _exports.resetPassword = resetPassword;
  const getDeleteAccountInitConfig = params => {
    return udbRequest.get('/udb/aq/user/destroy/init.do', {
      params
    });
  };
  _exports.getDeleteAccountInitConfig = getDeleteAccountInitConfig;
  const revokeDeleteAccount = () => {
    return request.post('/user/front/userinfo/cancelEraseData');
  };
  _exports.revokeDeleteAccount = revokeDeleteAccount;
  const getActivateCodeInitConfig = params => {
    return udbRequest.get('/udb/aq/pwd/activate/code/init.do', {
      params
    });
  };
  _exports.getActivateCodeInitConfig = getActivateCodeInitConfig;
  const getActivateCodePrechk = params => {
    return udbRequest.get('/udb/aq/pwd/activate/code/prechk.do', {
      params
    });
  };
  _exports.getActivateCodePrechk = getActivateCodePrechk;
  const activateAccountByCode = params => {
    return udbRequest.get('/udb/aq/pwd/activate/code/modify.do', {
      params
    });
  };
  _exports.activateAccountByCode = activateAccountByCode;
  const queryUserStatus = params => {
    return udbRequest.get('/udb/lgn/query/userStatus', {
      params
    });
  };
  _exports.queryUserStatus = queryUserStatus;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/constant/url.js'] = window.SLM['theme-shared/biz-com/customer/constant/url.js'] || function () {
  const _exports = {};
  const HOME = '/';
  _exports.HOME = HOME;
  const USER_CENTER = '/user/center';
  _exports.USER_CENTER = USER_CENTER;
  const SIGN_IN = '/user/signIn';
  _exports.SIGN_IN = SIGN_IN;
  const SIGN_UP = '/user/signUp';
  _exports.SIGN_UP = SIGN_UP;
  const UNSUB = '/user/unsubscribe';
  _exports.UNSUB = UNSUB;
  const THIRD_LOGIN_HREF = {
    facebook: 'https://www.facebook.com/v17.0/dialog/oauth',
    line: 'https://access.line.me/oauth2/v2.1/authorize',
    google: 'https://accounts.google.com/o/oauth2/v2/auth',
    tiktok: 'https://www.tiktok.com/v2/auth/authorize'
  };
  _exports.THIRD_LOGIN_HREF = THIRD_LOGIN_HREF;
  const THIRD_REDIRET_URL = typeof window === 'undefined' ? '' : `${window.location.origin}${SIGN_IN}`;
  _exports.THIRD_REDIRET_URL = THIRD_REDIRET_URL;
  const LOGISTICS_COUNTRIES = '/logistics/countries/v2';
  _exports.LOGISTICS_COUNTRIES = LOGISTICS_COUNTRIES;
  const LOGISTICS_ADDRESS_LIBRARY = '/logistics/address/library';
  _exports.LOGISTICS_ADDRESS_LIBRARY = LOGISTICS_ADDRESS_LIBRARY;
  const LOGISTICS_ADDRESS_LAYER = '/logistics/address/layer/list';
  _exports.LOGISTICS_ADDRESS_LAYER = LOGISTICS_ADDRESS_LAYER;
  const LOGISTICS_ADDRESS_TEMPLATE = '/logistics/addr/template/get';
  _exports.LOGISTICS_ADDRESS_TEMPLATE = LOGISTICS_ADDRESS_TEMPLATE;
  const PLACE_AUTOCOMPLETE = '/logistics/places/autocomplete';
  _exports.PLACE_AUTOCOMPLETE = PLACE_AUTOCOMPLETE;
  const PLACE_DETAIL = '/logistics/places/detail/v2';
  _exports.PLACE_DETAIL = PLACE_DETAIL;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/constant/pattern.js'] = window.SLM['theme-shared/biz-com/customer/constant/pattern.js'] || function () {
  const _exports = {};
  const EMAIL_PATTERN = /^([\w-.+]+)@([\w-.]+)\.([\w-.]+)$/;
  _exports.EMAIL_PATTERN = EMAIL_PATTERN;
  const MEMBER_PASSWORD_PATTERN = /^[\x20-\xff]{6,18}$/i;
  _exports.MEMBER_PASSWORD_PATTERN = MEMBER_PASSWORD_PATTERN;
  const PHONE_PATTERN = {
    '+86': /^[1-9]\d{10}$/,
    '+886': /^0?9\d{8}$/,
    '+852': /^[1-9]\d{7}$/
  };
  _exports.PHONE_PATTERN = PHONE_PATTERN;
  const CODE_PHONE_PATTERN = /^(\w+(\+\d+))-(.*)$/;
  _exports.CODE_PHONE_PATTERN = CODE_PHONE_PATTERN;
  const INTERNATIONAL_PHONE_PATTERN = /^(00|\+)[1-9]{1}([0-9]){9,16}$/;
  _exports.INTERNATIONAL_PHONE_PATTERN = INTERNATIONAL_PHONE_PATTERN;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/constant/language.js'] = window.SLM['theme-shared/biz-com/customer/constant/language.js'] || function () {
  const _exports = {};
  const LANGUAGE_MAP = {
    email: 'user.email',
    phone: 'user.phone',
    username: 'user.username',
    password: 'user.password',
    repeatPassword: 'user.repeatPassword',
    primevalPassword: 'user.primevalPassword',
    code: 'user.code',
    signUp: 'user.signUp',
    signIn: 'user.signIn',
    confirm: 'user.confirm',
    emailError: 'customer.general.email_error_hint',
    phoneError: 'customer.general.phone_error_message',
    codeError: 'user.codeError',
    passwordError: 'user.passwordError',
    repeatPasswordError: 'user.repeatPasswordError',
    repeatPasswordEmptyError: 'user.repeatPasswordEmptyError',
    primevalPasswordError: 'user.primevalPasswordError',
    send: 'user.send',
    resend: 'user.resend',
    sendError: 'user.sendError',
    noData: 'user.noData',
    passwordEmptyError: 'user.passwordEmptyError',
    passwordMemberError: 'user.passwordMemberError',
    emailEmptyError: 'user.emailEmptyError',
    phoneEmptyError: 'user.phoneEmptyError',
    usernameEmptyError: 'user.usernameEmptyError',
    primevalNewPasswordError: 'user.primevalNewPasswordError'
  };
  _exports.LANGUAGE_MAP = LANGUAGE_MAP;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/helpers/pattern.js'] = window.SLM['theme-shared/biz-com/customer/helpers/pattern.js'] || function () {
  const _exports = {};
  const { CODE_PHONE_PATTERN, INTERNATIONAL_PHONE_PATTERN, PHONE_PATTERN, EMAIL_PATTERN } = window['SLM']['theme-shared/biz-com/customer/constant/pattern.js'];
  const { LANGUAGE_MAP } = window['SLM']['theme-shared/biz-com/customer/constant/language.js'];
  const phoneNumberValidator = value => {
    return new Promise((resolve, reject) => {
      if (CODE_PHONE_PATTERN.test(value)) {
        const {
          $2,
          $3
        } = RegExp;
        if (INTERNATIONAL_PHONE_PATTERN.test(`${$2}${$3}`) && (!PHONE_PATTERN[$2] || PHONE_PATTERN[$2].test($3))) {
          return resolve();
        }
      }
      return reject(LANGUAGE_MAP.phoneError);
    });
  };
  _exports.phoneNumberValidator = phoneNumberValidator;
  const emailValidator = value => new Promise((resolve, reject) => EMAIL_PATTERN.test(value) && value.length <= 50 ? resolve() : reject(LANGUAGE_MAP.emailError));
  _exports.emailValidator = emailValidator;
  const usernameValidator = value => {
    if (CODE_PHONE_PATTERN.test(value) && RegExp.$3) {
      return phoneNumberValidator(value);
    }
    return emailValidator(value);
  };
  _exports.usernameValidator = usernameValidator;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/helpers/getFormFields.js'] = window.SLM['theme-shared/biz-com/customer/helpers/getFormFields.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const { MEMBER_PASSWORD_PATTERN } = window['SLM']['theme-shared/biz-com/customer/constant/pattern.js'];
  const { emailValidator } = window['SLM']['theme-shared/biz-com/customer/helpers/pattern.js'];
  const repeatPasswordRules = [{
    message: t('customer.general.set_password'),
    pattern: MEMBER_PASSWORD_PATTERN
  }, {
    validator: (v, record) => {
      if (!MEMBER_PASSWORD_PATTERN.test(v)) {
        return true;
      }
      return record.password === record.repeatPassword;
    },
    message: t('customer.general.repeat_passport_error')
  }];
  _exports.repeatPasswordRules = repeatPasswordRules;
  const formFields = {
    email(config = {}) {
      return {
        name: 'email',
        type: 'email',
        value: '',
        rules: [{
          message: t('customer.general.email_empty_hint'),
          required: true
        }, {
          message: t('customer.general.email_error_hint'),
          validator: value => emailValidator(value)
        }],
        ...config
      };
    },
    phone(config = {}) {
      return {
        name: 'phone',
        type: 'phone',
        value: '',
        dependencies: ['iso2'],
        rules: [{
          message: t('customer.general.phone_empty_message'),
          required: true
        }],
        ...config
      };
    },
    username(config = {}) {
      return {
        name: 'username',
        type: 'username',
        value: '',
        dependencies: ['iso2'],
        rules: [{
          message: t('customer.general.username_empty_hint'),
          required: true
        }],
        ...config
      };
    },
    password(config = {}) {
      return {
        name: 'password',
        type: 'password',
        value: '',
        rules: [{
          message: t('customer.general.password_empty_hint'),
          required: true
        }, {
          message: t('customer.general.set_password'),
          pattern: MEMBER_PASSWORD_PATTERN
        }],
        ...config
      };
    },
    loginPassword() {
      return {
        name: 'password',
        type: 'password',
        value: '',
        rules: [{
          message: t('customer.general.password_empty_hint'),
          required: true
        }, {
          message: t('unvisiable.customer.error_message_1001'),
          pattern: MEMBER_PASSWORD_PATTERN
        }]
      };
    },
    repeatPassword(config = {}) {
      return {
        name: 'repeatPassword',
        type: 'password',
        value: '',
        rules: [{
          message: t('customer.general.send_verification_code_hint'),
          required: true
        }, ...repeatPasswordRules],
        ...config
      };
    },
    verifycode(configs = {}) {
      return {
        name: 'verifycode',
        type: 'verifycode',
        value: '',
        rules: [{
          message: t('customer.general.enter_verification_code'),
          required: true
        }],
        ...configs
      };
    }
  };
  const getAccountFieldType = type => {
    const typeToFormFieldType = {
      member: 'username',
      mobile: 'phone'
    };
    return typeToFormFieldType[type] || type;
  };
  _exports.getAccountFieldType = getAccountFieldType;
  const getFormFieldsHelper = (types = []) => {
    return types.filter(type => !!type).map(item => {
      if (typeof item === 'string') {
        return formFields[item] && formFields[item]();
      }
      const {
        type,
        ...args
      } = item;
      return formFields[type](args);
    });
  };
  _exports.getFormFieldsHelper = getFormFieldsHelper;
  _exports.default = getFormFieldsHelper;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/reports/index.js'] = window.SLM['theme-shared/biz-com/customer/reports/index.js'] || function () {
  const _exports = {};
  const report = (eventid, params) => {
    window.HdSdk && window.HdSdk.shopTracker.report(eventid, params);
  };
  _exports.report = report;
  const reportV2 = collect => {
    window.HdSdk && window.HdSdk.shopTracker.collect(collect);
  };
  _exports.reportV2 = reportV2;
  const thirdPartReport = params => {
    window.SL_EventBus.emit('global:thirdPartReport', params);
  };
  _exports.thirdPartReport = thirdPartReport;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/constant/report.js'] = window.SLM['theme-shared/biz-com/customer/constant/report.js'] || function () {
  const _exports = {};
  const loginModalPageIdMap = {
    Home: 101,
    Products: 103,
    ProductsDetail: 105,
    ProductsSearch: 102,
    Center: 123,
    Cart: 106,
    NotFound: 130,
    Custom: 118
  };
  _exports.loginModalPageIdMap = loginModalPageIdMap;
  const pageMap = {
    SignIn: 128,
    SignOut: '',
    SignUp: 129,
    Bind: {
      phone: 135,
      email: 136
    },
    AddressNew: '',
    AddressEdit: 171,
    PasswordNew: 167,
    PasswordNewReset: 168,
    PasswordReset: 134,
    Message: 124,
    Center: 123,
    UnsubFeedback: '',
    LoginModal: 166,
    OrderList: 172
  };
  _exports.pageMap = pageMap;
  const ActionType = {
    view: 101,
    click: 102,
    input: 103,
    heartbeat: 106,
    check: 107,
    default: -999
  };
  _exports.ActionType = ActionType;
  const EventName = {
    login: 'Login',
    register: 'CompleteRegistration'
  };
  _exports.EventName = EventName;
  const Module = {
    normal: -999,
    loginModal: {
      register: 141,
      login: 142
    },
    userCenter: {
      account: 101,
      subscribe: 102,
      information: 103,
      address: 104
    }
  };
  _exports.Module = Module;
  const LOGIN_CID = '60079992';
  _exports.LOGIN_CID = LOGIN_CID;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/reports/password.js'] = window.SLM['theme-shared/biz-com/customer/reports/password.js'] || function () {
  const _exports = {};
  const { reportV2 } = window['SLM']['theme-shared/biz-com/customer/reports/index.js'];
  const { pageMap, ActionType, Module } = window['SLM']['theme-shared/biz-com/customer/constant/report.js'];
  const reportForgetPasswordToLogin = () => {
    reportV2({
      page: pageMap.PasswordNew,
      module: Module.normal,
      component: 101,
      action_type: ActionType.click,
      event_id: 1621
    });
  };
  _exports.reportForgetPasswordToLogin = reportForgetPasswordToLogin;
  const reportResetPasswordToLogin = () => {
    reportV2({
      page: pageMap.PasswordNewReset,
      module: Module.normal,
      component: 101,
      action_type: ActionType.click,
      event_id: 1413
    });
  };
  _exports.reportResetPasswordToLogin = reportResetPasswordToLogin;
  const reportChangePasswordToUserCenter = () => {
    return reportV2({
      page: pageMap.PasswordReset,
      module: Module.normal,
      component: 101,
      action_type: ActionType.click,
      event_id: 1617
    });
  };
  _exports.reportChangePasswordToUserCenter = reportChangePasswordToUserCenter;
  const reportVerifyAccountSuccess = () => {
    reportV2({
      page: 127,
      module: Module.normal,
      component: -999,
      action_type: ActionType.view,
      event_id: 1028
    });
  };
  _exports.reportVerifyAccountSuccess = reportVerifyAccountSuccess;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/utils/loadScript.js'] = window.SLM['theme-shared/biz-com/customer/utils/loadScript.js'] || function () {
  const _exports = {};
  const loadScript = url => {
    if (loadScript.instance && loadScript.instance[url]) {
      return loadScript.instance[url];
    }
    const scriptRequest = new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = url;
      scriptElement.type = 'text/javascript';
      scriptElement.async = true;
      scriptElement.crossOrigin = 'anonymous';
      scriptElement.onload = () => resolve();
      scriptElement.onerror = err => {
        if (loadScript.instance && loadScript.instance[url]) {
          delete loadScript.instance[url];
        }
        reject(err);
      };
      document.body.appendChild(scriptElement);
    });
    if (!loadScript.instance) {
      loadScript.instance = {
        [url]: scriptRequest
      };
    } else {
      loadScript.instance[url] = scriptRequest;
    }
    return scriptRequest;
  };
  _exports.loadScript = loadScript;
  loadScript.instance = {};
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/helpers/captcha.js'] = window.SLM['theme-shared/biz-com/customer/helpers/captcha.js'] || function () {
  const _exports = {};
  const getEnv = window['SLM']['theme-shared/utils/get-env.js'].default;
  const { loadScript } = window['SLM']['theme-shared/biz-com/customer/utils/loadScript.js'];
  const origins = {
    develop: 'https://captcha.myshoplinedev.com',
    staging: 'https://captcha.myshoplinestg.com',
    preview: 'https://captcha-geo-preview.myshopline.com',
    product: 'https://captcha-geo.myshopline.com'
  };
  _exports.origins = origins;
  const config = {
    SDK_URL_OSS: 'r2cdn.myshopline.cn/static/rs/acuf/prod/latest/bundle.iife.js',
    SDK_URL_S3: 'https://r2cdn.myshopline.com/static/rs/acuf/prod/latest/bundle.iife.js',
    IS_MAINLAND: false,
    APP_ENV: getEnv().APP_ENV || 'product',
    APP_CODE: 'm3tdgo'
  };
  const CAPTCHA_CONTROL_URL = config.IS_MAINLAND ? config.SDK_URL_OSS : config.SDK_URL_S3;
  let captchaInstance = null;
  const loadArmorCaptcha = ({
    wrapId = 'content',
    lang,
    onSuccess,
    onFail,
    onClose,
    captchaType = 'blockPuzzle',
    bizParam = {},
    captchaScene = 'user'
  }) => {
    const options = {
      wrapId,
      lang,
      onSuccess: (...args) => {
        captchaInstance && captchaInstance.destroy && captchaInstance.destroy();
        onSuccess && onSuccess(...args);
      },
      onFail,
      onClose,
      origin: window.location.origin,
      appCode: config.APP_CODE,
      captchaScene,
      captchaType,
      bizParam
    };
    if (window.ArmorCaptcha) {
      captchaInstance = new window.ArmorCaptcha(options);
      return Promise.resolve(captchaInstance);
    }
    return loadScript(CAPTCHA_CONTROL_URL).then(() => {
      const {
        ArmorCaptcha
      } = window;
      captchaInstance = new ArmorCaptcha(options);
      return captchaInstance;
    });
  };
  _exports.loadArmorCaptcha = loadArmorCaptcha;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/utils/url.js'] = window.SLM['theme-shared/biz-com/customer/utils/url.js'] || function () {
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
      const urlParse = url.parse(locationHref);
      const urlQuery = urlParse && urlParse.query;
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
    const urlParse = url.parse(locationHref);
    const urlQuery = urlParse && urlParse.query;
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
    const urlParse = url.parse(u);
    const urlArr = urlParse && urlParse.pathname && urlParse.pathname.replace(/^\//, '').split('/') || [];
    if (index < 0) {
      return urlArr[urlArr.length + index];
    }
    return urlArr[index];
  }
  _exports.getUrlPathId = getUrlPathId;
  function stringifyUrl(originUrl, params, sign = '?') {
    if (!originUrl) {
      return '';
    }
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
window.SLM['theme-shared/biz-com/customer/constant/const.js'] = window.SLM['theme-shared/biz-com/customer/constant/const.js'] || function () {
  const _exports = {};
  const getEnv = window['SLM']['theme-shared/utils/get-env.js'].default;
  const IS_PROD = ['preview', 'product'].includes(getEnv().APP_ENV || '');
  _exports.IS_PROD = IS_PROD;
  const THIRD_DEFAULT_REGION = 'CN';
  _exports.THIRD_DEFAULT_REGION = THIRD_DEFAULT_REGION;
  const DEFAULT_LANGUAGE = 'en';
  _exports.DEFAULT_LANGUAGE = DEFAULT_LANGUAGE;
  const UDB_PARAMS = {
    type: 'member',
    appid: IS_PROD ? '1165600903' : '1163336839',
    subappid: '5',
    mode: 'username'
  };
  _exports.UDB_PARAMS = UDB_PARAMS;
  const THIRD_EXTRA_PARAMS = {
    facebook: {},
    line: {
      scope: 'profile openid email'
    },
    google: {
      scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
      access_type: 'offline'
    },
    tiktok: {
      scope: 'user.info.basic'
    }
  };
  _exports.THIRD_EXTRA_PARAMS = THIRD_EXTRA_PARAMS;
  const DEFAULT_PHONE_ISO2 = 'cn';
  _exports.DEFAULT_PHONE_ISO2 = DEFAULT_PHONE_ISO2;
  const DEFAULT_PHONE_CODE = 'cn+86';
  _exports.DEFAULT_PHONE_CODE = DEFAULT_PHONE_CODE;
  const DEFAULT_PHONE_CODE2 = '+86';
  _exports.DEFAULT_PHONE_CODE2 = DEFAULT_PHONE_CODE2;
  const CHANNEL_TO_METHOD = {
    line: 'Line',
    facebook: 'Facebook',
    google: 'Google',
    tiktok: 'TikTok',
    apple: 'Apple'
  };
  _exports.CHANNEL_TO_METHOD = CHANNEL_TO_METHOD;
  const DEFAULT_FORM_VALUE = 'DEFAULT_FORM_VALUE';
  _exports.DEFAULT_FORM_VALUE = DEFAULT_FORM_VALUE;
  const ACCOUNT_ACTIVATED = 'ACCOUNT_ACTIVATED';
  _exports.ACCOUNT_ACTIVATED = ACCOUNT_ACTIVATED;
  const CONFIRM_SUBSCRIBE_EMAIL = 'confirmSubscribeEmail';
  _exports.CONFIRM_SUBSCRIBE_EMAIL = CONFIRM_SUBSCRIBE_EMAIL;
  const SUBSCRIBE_STATUS_MAP = {
    CANCEL: 0,
    SUBSCRIBE: 1,
    UNSUBSCRIBE: 2,
    CONFIRMING: 3,
    UNVALID: 4,
    DELETED: 5
  };
  _exports.SUBSCRIBE_STATUS_MAP = SUBSCRIBE_STATUS_MAP;
  const RESET_PASSWORD_TOKEN_EXPIRED = 'RESET_PASSWORD_TOKEN_EXPIRED';
  _exports.RESET_PASSWORD_TOKEN_EXPIRED = RESET_PASSWORD_TOKEN_EXPIRED;
  const ACCOUNT_ACTIVATED_TOKEN_EXPIRED = 'ACCOUNT_ACTIVATED_TOKEN_EXPIRED';
  _exports.ACCOUNT_ACTIVATED_TOKEN_EXPIRED = ACCOUNT_ACTIVATED_TOKEN_EXPIRED;
  const REGISTER_EXTRA_INFO = 'REGISTER_EXTRA_INFO';
  _exports.REGISTER_EXTRA_INFO = REGISTER_EXTRA_INFO;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/helpers/format.js'] = window.SLM['theme-shared/biz-com/customer/helpers/format.js'] || function () {
  const _exports = {};
  const redirectTo = url => {
    return window.Shopline && window.Shopline.redirectTo && window.Shopline.redirectTo(url) || url;
  };
  _exports.redirectTo = redirectTo;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/utils/helper.js'] = window.SLM['theme-shared/biz-com/customer/utils/helper.js'] || function () {
  const _exports = {};
  const { getUrlQuery, getUrlAllQuery } = window['SLM']['theme-shared/biz-com/customer/utils/url.js'];
  const { DEFAULT_LANGUAGE } = window['SLM']['theme-shared/biz-com/customer/constant/const.js'];
  const { redirectTo } = window['SLM']['theme-shared/biz-com/customer/helpers/format.js'];
  function unique(arr) {
    return arr.filter((item, index) => {
      return arr.indexOf(item, 0) === index;
    });
  }
  _exports.unique = unique;
  function uniqueObjectArray(arr, prop, callback) {
    return arr.filter((item, index) => {
      let result = true;
      if (typeof callback === 'function') {
        result = callback(item, index, arr);
      }
      return result && arr.findIndex(it => it[prop] === item[prop]) === index;
    });
  }
  _exports.uniqueObjectArray = uniqueObjectArray;
  function getLanguage() {
    return window && window.SL_State && window.SL_State.get('request.locale') || DEFAULT_LANGUAGE;
  }
  _exports.getLanguage = getLanguage;
  const getState = href => {
    try {
      const locationHref = href || window.location.href;
      const decodeUrl = window.decodeURIComponent(locationHref.replace(window.location.hash, ''));
      return JSON.parse(decodeUrl.match(/\{(.*)\}/)[0]);
    } catch (e) {
      try {
        return JSON.parse(getUrlQuery('state'));
      } catch (e) {
        return {};
      }
    }
  };
  _exports.getState = getState;
  const getRedirectUrl = () => {
    let {
      redirectUrl
    } = getUrlAllQuery();
    const state = getState();
    redirectUrl = state && state.redirectUrl && window.decodeURIComponent(state.redirectUrl) || redirectUrl;
    return redirectUrl;
  };
  _exports.getRedirectUrl = getRedirectUrl;
  function redirectPage(pathname) {
    const redirectUrl = getRedirectUrl();
    window.location.href = redirectUrl || redirectTo(pathname);
  }
  _exports.redirectPage = redirectPage;
  const getRedirectOriginUrl = () => {
    const redirectUrl = getRedirectUrl();
    if (!redirectUrl) return window.location.origin;
    return /^\//.test(redirectUrl) ? `${window.location.origin}${redirectUrl}` : redirectUrl;
  };
  _exports.getRedirectOriginUrl = getRedirectOriginUrl;
  const jumpWithSearchParams = path => {
    window.location.href = `${path}${window.location.search}`;
  };
  _exports.jumpWithSearchParams = jumpWithSearchParams;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/commons/captcha-modal/index.js'] = window.SLM['theme-shared/biz-com/customer/commons/captcha-modal/index.js'] || function () {
  const _exports = {};
  const { ModalWithHtml } = window['SLM']['theme-shared/components/hbs/shared/components/modal/index.js'];
  const { loadArmorCaptcha } = window['SLM']['theme-shared/biz-com/customer/helpers/captcha.js'];
  const { getLanguage } = window['SLM']['theme-shared/biz-com/customer/utils/helper.js'];
  let cacheModal = null;
  const contentId = `captcha-content`;
  const openCaptchaModal = async ({
    params = {},
    onSuccess,
    captchaScene
  }) => {
    const createArmorCaptcha = () => {
      return loadArmorCaptcha({
        captchaType: params.hitPunish,
        bizParam: {
          serialNo: params.serialNo
        },
        wrapId: contentId,
        lang: getLanguage(),
        onSuccess: token => {
          cacheModal.hide();
          onSuccess && onSuccess(token, params.serialNo);
        },
        captchaScene
      });
    };
    if (cacheModal) {
      $(`#${cacheModal.modalId} #${contentId}`).html('');
      cacheModal.show();
      await createArmorCaptcha();
      return;
    }
    cacheModal = new ModalWithHtml({
      zIndex: 1000,
      containerClassName: 'captcha-modal-container',
      closable: false,
      maskClosable: true,
      bodyClassName: 'captcha-modal-body',
      content: `<div id="${contentId}" class="captcha-content"></div>`,
      destroyedOnClosed: false
    });
    cacheModal.show();
    $(`#${cacheModal.modalId}`).find('.mp-modal__mask').addClass('captcha-transparent');
    $(`#${cacheModal.modalId}`).on('click', '.captcha-modal-container', e => {
      const $target = $(e.target).parents('.captcha-content');
      if ($target.length < 1) {
        cacheModal.hide();
      }
    });
    await createArmorCaptcha();
  };
  let captchaToken = null;
  let serialNo = null;
  const isFunction = fn => typeof fn === 'function';
  const CAPTCHA_CODE = ['2019', '3018', '1015', '2015'];
  const wrapArmorCaptcha = async ({
    beforeCapture,
    onCaptureCaptcha,
    onCaptchaVerifySuccess,
    onError,
    cleanCaptcha,
    captchaScene
  }) => {
    if (cleanCaptcha) {
      captchaToken = null;
    }
    if (!captchaToken) {
      isFunction(beforeCapture) && (await beforeCapture());
    }
    try {
      isFunction(onCaptureCaptcha) && (await onCaptureCaptcha(captchaToken, {}, serialNo));
      captchaToken = null;
    } catch (e) {
      captchaToken = null;
      if (CAPTCHA_CODE.includes(e.rescode)) {
        openCaptchaModal({
          params: e.data,
          onSuccess: async (token, serial) => {
            captchaToken = token;
            serialNo = serial;
            try {
              isFunction(onCaptchaVerifySuccess) && (await onCaptchaVerifySuccess(token, e || {}, serialNo));
            } catch (e) {
              onError && onError(e);
            }
          },
          captchaScene
        });
        return Promise.reject(false);
      }
      return Promise.reject(e);
    }
  };
  _exports.wrapArmorCaptcha = wrapArmorCaptcha;
  _exports.default = openCaptchaModal;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/constant/countries.js'] = window.SLM['theme-shared/biz-com/customer/constant/countries.js'] || function () {
  const _exports = {};
  const allCountries = [['Afghanistan (‫افغانستان‬‎)', 'af', '93'], ['Albania (Shqipëri)', 'al', '355'], ['Algeria (‫الجزائر‬‎)', 'dz', '213'], ['American Samoa', 'as', '1', 5, ['684']], ['Andorra', 'ad', '376'], ['Angola', 'ao', '244'], ['Anguilla', 'ai', '1', 6, ['264']], ['Antigua and Barbuda', 'ag', '1', 7, ['268']], ['Argentina', 'ar', '54'], ['Armenia (Հայաստան)', 'am', '374'], ['Aruba', 'aw', '297'], ['Australia', 'au', '61', 0], ['Austria (Österreich)', 'at', '43'], ['Azerbaijan (Azərbaycan)', 'az', '994'], ['Bahamas', 'bs', '1', 8, ['242']], ['Bahrain (‫البحرين‬‎)', 'bh', '973'], ['Bangladesh (বাংলাদেশ)', 'bd', '880'], ['Barbados', 'bb', '1', 9, ['246']], ['Belarus (Беларусь)', 'by', '375'], ['Belgium (België)', 'be', '32'], ['Belize', 'bz', '501'], ['Benin (Bénin)', 'bj', '229'], ['Bermuda', 'bm', '1', 10, ['441']], ['Bhutan (འབྲུག)', 'bt', '975'], ['Bolivia', 'bo', '591'], ['Bosnia and Herzegovina (Босна и Херцеговина)', 'ba', '387'], ['Botswana', 'bw', '267'], ['Brazil (Brasil)', 'br', '55'], ['British Indian Ocean Territory', 'io', '246'], ['British Virgin Islands', 'vg', '1', 11, ['284']], ['Brunei', 'bn', '673'], ['Bulgaria (България)', 'bg', '359'], ['Burkina Faso', 'bf', '226'], ['Burundi (Uburundi)', 'bi', '257'], ['Cambodia (កម្ពុជា)', 'kh', '855'], ['Cameroon (Cameroun)', 'cm', '237'], ['Canada', 'ca', '1', 1, ['204', '226', '236', '249', '250', '289', '306', '343', '365', '387', '403', '416', '418', '431', '437', '438', '450', '506', '514', '519', '548', '579', '581', '587', '604', '613', '639', '647', '672', '705', '709', '742', '778', '780', '782', '807', '819', '825', '867', '873', '902', '905']], ['Cape Verde (Kabu Verdi)', 'cv', '238'], ['Caribbean Netherlands', 'bq', '599', 1, ['3', '4', '7']], ['Cayman Islands', 'ky', '1', 12, ['345']], ['Central African Republic (République centrafricaine)', 'cf', '236'], ['Chad (Tchad)', 'td', '235'], ['Chile', 'cl', '56'], ['China (中国)', 'cn', '86'], ['Christmas Island', 'cx', '61', 2, ['89164']], ['Cocos (Keeling) Islands', 'cc', '61', 1, ['89162']], ['Colombia', 'co', '57'], ['Comoros (‫جزر القمر‬‎)', 'km', '269'], ['Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)', 'cd', '243'], ['Congo (Republic) (Congo-Brazzaville)', 'cg', '242'], ['Cook Islands', 'ck', '682'], ['Costa Rica', 'cr', '506'], ['Côte d’Ivoire', 'ci', '225'], ['Croatia (Hrvatska)', 'hr', '385'], ['Cuba', 'cu', '53'], ['Curaçao', 'cw', '599', 0], ['Cyprus (Κύπρος)', 'cy', '357'], ['Czech Republic (Česká republika)', 'cz', '420'], ['Denmark (Danmark)', 'dk', '45'], ['Djibouti', 'dj', '253'], ['Dominica', 'dm', '1', 13, ['767']], ['Dominican Republic (República Dominicana)', 'do', '1', 2, ['809', '829', '849']], ['Ecuador', 'ec', '593'], ['Egypt (‫مصر‬‎)', 'eg', '20'], ['El Salvador', 'sv', '503'], ['Equatorial Guinea (Guinea Ecuatorial)', 'gq', '240'], ['Eritrea', 'er', '291'], ['Estonia (Eesti)', 'ee', '372'], ['Ethiopia', 'et', '251'], ['Falkland Islands (Islas Malvinas)', 'fk', '500'], ['Faroe Islands (Føroyar)', 'fo', '298'], ['Fiji', 'fj', '679'], ['Finland (Suomi)', 'fi', '358', 0], ['France', 'fr', '33'], ['French Guiana (Guyane française)', 'gf', '594'], ['French Polynesia (Polynésie française)', 'pf', '689'], ['Gabon', 'ga', '241'], ['Gambia', 'gm', '220'], ['Georgia (საქართველო)', 'ge', '995'], ['Germany (Deutschland)', 'de', '49'], ['Ghana (Gaana)', 'gh', '233'], ['Gibraltar', 'gi', '350'], ['Greece (Ελλάδα)', 'gr', '30'], ['Greenland (Kalaallit Nunaat)', 'gl', '299'], ['Grenada', 'gd', '1', 14, ['473']], ['Guadeloupe', 'gp', '590', 0], ['Guam', 'gu', '1', 15, ['671']], ['Guatemala', 'gt', '502'], ['Guernsey', 'gg', '44', 1, ['1481', '7781', '7839', '7911']], ['Guinea (Guinée)', 'gn', '224'], ['Guinea-Bissau (Guiné Bissau)', 'gw', '245'], ['Guyana', 'gy', '592'], ['Haiti', 'ht', '509'], ['Honduras', 'hn', '504'], ['Hong Kong (香港)', 'hk', '852'], ['Hungary (Magyarország)', 'hu', '36'], ['Iceland (Ísland)', 'is', '354'], ['India (भारत)', 'in', '91'], ['Indonesia', 'id', '62'], ['Iran (‫ایران‬‎)', 'ir', '98'], ['Iraq (‫العراق‬‎)', 'iq', '964'], ['Ireland', 'ie', '353'], ['Isle of Man', 'im', '44', 2, ['1624', '74576', '7524', '7924', '7624']], ['Israel (‫ישראל‬‎)', 'il', '972'], ['Italy (Italia)', 'it', '39', 0], ['Jamaica', 'jm', '1', 4, ['876', '658']], ['Japan (日本)', 'jp', '81'], ['Jersey', 'je', '44', 3, ['1534', '7509', '7700', '7797', '7829', '7937']], ['Jordan (‫الأردن‬‎)', 'jo', '962'], ['Kazakhstan (Казахстан)', 'kz', '7', 1, ['33', '7']], ['Kenya', 'ke', '254'], ['Kiribati', 'ki', '686'], ['Kosovo', 'xk', '383'], ['Kuwait (‫الكويت‬‎)', 'kw', '965'], ['Kyrgyzstan (Кыргызстан)', 'kg', '996'], ['Laos (ລາວ)', 'la', '856'], ['Latvia (Latvija)', 'lv', '371'], ['Lebanon (‫لبنان‬‎)', 'lb', '961'], ['Lesotho', 'ls', '266'], ['Liberia', 'lr', '231'], ['Libya (‫ليبيا‬‎)', 'ly', '218'], ['Liechtenstein', 'li', '423'], ['Lithuania (Lietuva)', 'lt', '370'], ['Luxembourg', 'lu', '352'], ['Macau (澳門)', 'mo', '853'], ['Macedonia (FYROM) (Македонија)', 'mk', '389'], ['Madagascar (Madagasikara)', 'mg', '261'], ['Malawi', 'mw', '265'], ['Malaysia', 'my', '60'], ['Maldives', 'mv', '960'], ['Mali', 'ml', '223'], ['Malta', 'mt', '356'], ['Marshall Islands', 'mh', '692'], ['Martinique', 'mq', '596'], ['Mauritania (‫موريتانيا‬‎)', 'mr', '222'], ['Mauritius (Moris)', 'mu', '230'], ['Mayotte', 'yt', '262', 1, ['269', '639']], ['Mexico (México)', 'mx', '52'], ['Micronesia', 'fm', '691'], ['Moldova (Republica Moldova)', 'md', '373'], ['Monaco', 'mc', '377'], ['Mongolia (Монгол)', 'mn', '976'], ['Montenegro (Crna Gora)', 'me', '382'], ['Montserrat', 'ms', '1', 16, ['664']], ['Morocco (‫المغرب‬‎)', 'ma', '212', 0], ['Mozambique (Moçambique)', 'mz', '258'], ['Myanmar (Burma) (မြန်မာ)', 'mm', '95'], ['Namibia (Namibië)', 'na', '264'], ['Nauru', 'nr', '674'], ['Nepal (नेपाल)', 'np', '977'], ['Netherlands (Nederland)', 'nl', '31'], ['New Caledonia (Nouvelle-Calédonie)', 'nc', '687'], ['New Zealand', 'nz', '64'], ['Nicaragua', 'ni', '505'], ['Niger (Nijar)', 'ne', '227'], ['Nigeria', 'ng', '234'], ['Niue', 'nu', '683'], ['Norfolk Island', 'nf', '672'], ['North Korea (조선 민주주의 인민 공화국)', 'kp', '850'], ['Northern Mariana Islands', 'mp', '1', 17, ['670']], ['Norway (Norge)', 'no', '47', 0], ['Oman (‫عُمان‬‎)', 'om', '968'], ['Pakistan (‫پاکستان‬‎)', 'pk', '92'], ['Palau', 'pw', '680'], ['Palestine (‫فلسطين‬‎)', 'ps', '970'], ['Panama (Panamá)', 'pa', '507'], ['Papua New Guinea', 'pg', '675'], ['Paraguay', 'py', '595'], ['Peru (Perú)', 'pe', '51'], ['Philippines', 'ph', '63'], ['Poland (Polska)', 'pl', '48'], ['Portugal', 'pt', '351'], ['Puerto Rico', 'pr', '1', 3, ['787', '939']], ['Qatar (‫قطر‬‎)', 'qa', '974'], ['Réunion (La Réunion)', 're', '262', 0], ['Romania (România)', 'ro', '40'], ['Russia (Россия)', 'ru', '7', 0], ['Rwanda', 'rw', '250'], ['Saint Barthélemy', 'bl', '590', 1], ['Saint Helena', 'sh', '290'], ['Saint Kitts and Nevis', 'kn', '1', 18, ['869']], ['Saint Lucia', 'lc', '1', 19, ['758']], ['Saint Martin (Saint-Martin (partie française))', 'mf', '590', 2], ['Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)', 'pm', '508'], ['Saint Vincent and the Grenadines', 'vc', '1', 20, ['784']], ['Samoa', 'ws', '685'], ['San Marino', 'sm', '378'], ['São Tomé and Príncipe (São Tomé e Príncipe)', 'st', '239'], ['Saudi Arabia (‫المملكة العربية السعودية‬‎)', 'sa', '966'], ['Senegal (Sénégal)', 'sn', '221'], ['Serbia (Србија)', 'rs', '381'], ['Seychelles', 'sc', '248'], ['Sierra Leone', 'sl', '232'], ['Singapore', 'sg', '65'], ['Sint Maarten', 'sx', '1', 21, ['721']], ['Slovakia (Slovensko)', 'sk', '421'], ['Slovenia (Slovenija)', 'si', '386'], ['Solomon Islands', 'sb', '677'], ['Somalia (Soomaaliya)', 'so', '252'], ['South Africa', 'za', '27'], ['South Korea (대한민국)', 'kr', '82'], ['South Sudan (‫جنوب السودان‬‎)', 'ss', '211'], ['Spain (España)', 'es', '34'], ['Sri Lanka (ශ්‍රී ලංකාව)', 'lk', '94'], ['Sudan (‫السودان‬‎)', 'sd', '249'], ['Suriname', 'sr', '597'], ['Svalbard and Jan Mayen', 'sj', '47', 1, ['79']], ['Swaziland', 'sz', '268'], ['Sweden (Sverige)', 'se', '46'], ['Switzerland (Schweiz)', 'ch', '41'], ['Syria (‫سوريا‬‎)', 'sy', '963'], ['Taiwan (台灣)', 'tw', '886'], ['Tajikistan', 'tj', '992'], ['Tanzania', 'tz', '255'], ['Thailand (ไทย)', 'th', '66'], ['Timor-Leste', 'tl', '670'], ['Togo', 'tg', '228'], ['Tokelau', 'tk', '690'], ['Tonga', 'to', '676'], ['Trinidad and Tobago', 'tt', '1', 22, ['868']], ['Tunisia (‫تونس‬‎)', 'tn', '216'], ['Turkey (Türkiye)', 'tr', '90'], ['Turkmenistan', 'tm', '993'], ['Turks and Caicos Islands', 'tc', '1', 23, ['649']], ['Tuvalu', 'tv', '688'], ['U.S. Virgin Islands', 'vi', '1', 24, ['340']], ['Uganda', 'ug', '256'], ['Ukraine (Україна)', 'ua', '380'], ['United Arab Emirates (‫الإمارات العربية المتحدة‬‎)', 'ae', '971'], ['United Kingdom', 'gb', '44', 0], ['United States', 'us', '1', 0], ['Uruguay', 'uy', '598'], ['Uzbekistan (Oʻzbekiston)', 'uz', '998'], ['Vanuatu', 'vu', '678'], ['Vatican City (Città del Vaticano)', 'va', '39', 1, ['06698']], ['Venezuela', 've', '58'], ['Vietnam (Việt Nam)', 'vn', '84'], ['Wallis and Futuna (Wallis-et-Futuna)', 'wf', '681'], ['Western Sahara (‫الصحراء الغربية‬‎)', 'eh', '212', 1, ['5288', '5289']], ['Yemen (‫اليمن‬‎)', 'ye', '967'], ['Zambia', 'zm', '260'], ['Zimbabwe', 'zw', '263'], ['Åland Islands', 'ax', '358', 1, ['18']]];
  const countries = allCountries.map(([name, iso2, dialCode, priority, areaCodes]) => ({
    name: name.replace(/\s*\([^()]+?\)$/, ''),
    iso2,
    dialCode,
    priority: priority || 0,
    areaCodes: areaCodes || null
  }));
  _exports.countries = countries;
  const countriesCodeMap = countries.reduce((res, {
    iso2,
    dialCode
  }) => {
    res[iso2] = `+${dialCode}`;
    return res;
  }, {});
  _exports.countriesCodeMap = countriesCodeMap;
  const countriesDialCodeMap = countries.reduce((res, {
    iso2,
    dialCode
  }) => {
    res[dialCode] = iso2;
    return res;
  }, {});
  _exports.countriesDialCodeMap = countriesDialCodeMap;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/helpers/formatPhone.js'] = window.SLM['theme-shared/biz-com/customer/helpers/formatPhone.js'] || function () {
  const _exports = {};
  const { CODE_PHONE_PATTERN } = window['SLM']['theme-shared/biz-com/customer/constant/pattern.js'];
  const { countriesDialCodeMap } = window['SLM']['theme-shared/biz-com/customer/constant/countries.js'];
  const formatterCodePhone = codePhone => {
    return codePhone.replace(/[a-z]+\+(\d+)-(\d+)/i, '00$1$2');
  };
  _exports.formatterCodePhone = formatterCodePhone;
  const parsePhoneString = (phoneString, code) => {
    return {
      phoneString,
      iso2: countriesDialCodeMap[code],
      code,
      phone: phoneString && phoneString.replace(`00${code}`, '') || ''
    };
  };
  _exports.parsePhoneString = parsePhoneString;
  _exports.default = phone => {
    const result = {};
    if (phone) {
      const exec = CODE_PHONE_PATTERN.exec(phone);
      if (exec) {
        result.phone = `${exec[2]}${exec[3]}`.replace('+', '00');
        result._code = exec[1].slice(0, -exec[2].length);
      }
    }
    return result;
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/templates/getCodeSelect.js'] = window.SLM['theme-shared/biz-com/customer/templates/getCodeSelect.js'] || function () {
  const _exports = {};
  const { countries, countriesCodeMap } = window['SLM']['theme-shared/biz-com/customer/constant/countries.js'];
  const CODE_SELECT_CLASS = 'form-item__codeSelect';
  _exports.default = defaultIso2 => {
    const optionStr = countries.map(({
      name,
      iso2,
      dialCode
    }) => `
      <option value="${iso2}" label="${name}(+${dialCode})" ${iso2 === defaultIso2 ? 'selected="selected"' : ''}>${name}(+${dialCode})</option>
    `).join('');
    return `
    <div class="code-select__container">
      <div class="code-select__value-wrapper">
        <span class="code-select__value">${countriesCodeMap[defaultIso2]}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.5 1.5L5 5L8.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <select class="form-item__select ${CODE_SELECT_CLASS}" autocomplete="off">
        ${optionStr}
      </select>
    </div>
  `;
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/commons/form-item/username.js'] = window.SLM['theme-shared/biz-com/customer/commons/form-item/username.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const { countriesCodeMap } = window['SLM']['theme-shared/biz-com/customer/constant/countries.js'];
  const { CODE_PHONE_PATTERN } = window['SLM']['theme-shared/biz-com/customer/constant/pattern.js'];
  const { DEFAULT_PHONE_CODE, DEFAULT_PHONE_ISO2 } = window['SLM']['theme-shared/biz-com/customer/constant/const.js'];
  const formatPhone = window['SLM']['theme-shared/biz-com/customer/helpers/formatPhone.js'].default;
  const { usernameValidator } = window['SLM']['theme-shared/biz-com/customer/helpers/pattern.js'];
  const getCodeSelectTemplate = window['SLM']['theme-shared/biz-com/customer/templates/getCodeSelect.js'].default;
  const CODE_SELECT_CONTAINER_CLASS = 'code-select__container';
  const CODE_SELECT_CLASS = 'form-item__codeSelect';
  class Username {
    constructor({
      form,
      formId,
      value,
      iso2
    }) {
      this.form = form;
      this.formId = formId;
      this.$username = $(`#${formId} [sl-form-item-name="username"] .sl-input`);
      this.$input = this.$username.find('.sl-input__inpEle');
      const originValue = value || '';
      if (iso2) {
        this.iso2 = iso2;
        if (/^\d+$/.test(value)) {
          this.createCodeSelect();
        }
      } else {
        const countryCodeOriginal = window && window.SL_State && window.SL_State.get('customer_address.countryCode');
        const countryCode = countryCodeOriginal && countryCodeOriginal.toLowerCase();
        this.iso2 = iso2 || countryCode;
      }
      const code = countriesCodeMap[this.iso2];
      if (code) {
        this.code = `${this.iso2}${code}`;
      } else {
        this.iso2 = DEFAULT_PHONE_ISO2;
        this.code = DEFAULT_PHONE_CODE;
      }
      this.value = this.changeValue(this.code, originValue);
      this.inputValue = originValue;
      this.init();
    }
    init() {
      this.bindEvents();
    }
    install() {
      return {
        rules: [{
          validator: value => {
            const val = this.changeValue(this.code, value);
            return usernameValidator(val).catch(err => Promise.reject(t(err)));
          }
        }]
      };
    }
    changeValue(code, inputValue) {
      const value = inputValue && inputValue.trim();
      const val = /^\d+$/.test(value) ? `${code}-${value}` : value;
      this.code = code;
      this.value = val;
      this.inputValue = value;
      return val;
    }
    changeCodeValue(iso2) {
      const $codeValue = this.$username.find(`.code-select__value`);
      const $select = this.$username.find(`.${CODE_SELECT_CLASS}`);
      $codeValue.text(countriesCodeMap[iso2]);
      if ($select.val() !== iso2) {
        $select.val(iso2);
      }
    }
    getValue() {
      const $select = this.$username.find(`.${CODE_SELECT_CLASS}`);
      return {
        username: this.inputValue || this.$input && this.$input.val() || '',
        code: this.code,
        iso2: this.iso2 || $select.val() || ''
      };
    }
    getFormValue() {
      const value = this.value || this.changeValue(this.code, this.$input && this.$input.val());
      if (CODE_PHONE_PATTERN.test(value)) {
        const val = formatPhone(value);
        return {
          username: val.phone,
          _code: val._code
        };
      }
      return {
        username: value
      };
    }
    createCodeSelect() {
      const selectElementStr = getCodeSelectTemplate(this.iso2);
      this.$username.append(selectElementStr);
      const $container = this.$username.find(`.${CODE_SELECT_CONTAINER_CLASS}`);
      const $select = $container.find(`.${CODE_SELECT_CLASS}`);
      $select && $select.val(this.iso2);
      this.bindSelectCodeEvent($select);
      return $container;
    }
    bindEvents() {
      let $container = this.$username.find(`.${CODE_SELECT_CONTAINER_CLASS}`);
      const $select = $container.find(`.${CODE_SELECT_CLASS}`);
      let selectElementHasMounted = $select && $select.length > 0;
      this.$input.on('input', e => {
        const val = this.changeValue(this.code, e.target.value);
        const phoneInputMode = !(!CODE_PHONE_PATTERN.test(val || '') || !RegExp.$3);
        if (phoneInputMode) {
          if (!selectElementHasMounted) {
            $container = this.createCodeSelect();
            selectElementHasMounted = true;
            return;
          }
          $container && $container.show();
        }
        if (!phoneInputMode && selectElementHasMounted) {
          $container && $container.hide();
        }
      });
    }
    bindSelectCodeEvent($select) {
      $select.on('change', () => {
        const iso2 = $select.val();
        const val = countriesCodeMap[iso2];
        this.iso2 = iso2;
        this.code = `${iso2}${val}`;
        this.changeCodeValue(iso2);
        this.changeValue(this.code, this.inputValue);
        if (this.inputValue) {
          this.form.validateFields('username');
          this.form.setLocalsValue('username', this.$input.val());
        }
      });
      $select.on('input', e => e.stopPropagation());
    }
  }
  _exports.default = Username;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/commons/form-item/phone.js'] = window.SLM['theme-shared/biz-com/customer/commons/form-item/phone.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const { countriesCodeMap } = window['SLM']['theme-shared/biz-com/customer/constant/countries.js'];
  const { CODE_PHONE_PATTERN } = window['SLM']['theme-shared/biz-com/customer/constant/pattern.js'];
  const { DEFAULT_PHONE_CODE, DEFAULT_PHONE_ISO2 } = window['SLM']['theme-shared/biz-com/customer/constant/const.js'];
  const formatPhone = window['SLM']['theme-shared/biz-com/customer/helpers/formatPhone.js'].default;
  const { phoneNumberValidator } = window['SLM']['theme-shared/biz-com/customer/helpers/pattern.js'];
  const getCodeSelectTemplate = window['SLM']['theme-shared/biz-com/customer/templates/getCodeSelect.js'].default;
  const CODE_SELECT_CONTAINER_CLASS = 'code-select__container';
  const CODE_SELECT_CLASS = 'form-item__codeSelect';
  class Phone {
    constructor({
      form,
      formId,
      value,
      iso2,
      emit = {},
      $container
    }) {
      this.form = form;
      this.formId = formId;
      this.emit = emit;
      this.$phone = $container || $(`#${formId} [sl-form-item-name="phone"] .sl-input`);
      this.$input = this.$phone.find('.sl-input__inpEle');
      const originValue = value || '';
      const countryCodeOriginal = window && window.SL_State && window.SL_State.get('customer_address.countryCode');
      const countryCode = countryCodeOriginal && countryCodeOriginal.toLowerCase();
      this.iso2 = iso2 || countryCode;
      const code = countriesCodeMap[this.iso2];
      if (code) {
        this.code = `${this.iso2}${code}`;
      } else {
        this.iso2 = DEFAULT_PHONE_ISO2;
        this.code = DEFAULT_PHONE_CODE;
      }
      this.value = this.changeValue(this.code, originValue);
      this.inputValue = originValue;
      this.init();
    }
    init() {
      this.bindEvents();
    }
    install() {
      return {
        rules: [{
          validator: () => {
            return phoneNumberValidator(this.value).catch(err => Promise.reject(t(err)));
          }
        }]
      };
    }
    changeValue(code, inputValue) {
      const value = inputValue && inputValue.trim();
      const val = `${code}-${value}`;
      this.code = code;
      this.value = val;
      this.inputValue = value;
      return val;
    }
    changeCodeValue(iso2) {
      const $codeValue = this.$phone.find(`.code-select__value`);
      const $select = this.$phone.find(`.${CODE_SELECT_CLASS}`);
      $codeValue.text(countriesCodeMap[iso2]);
      if ($select.val() !== iso2) {
        $select.val(iso2);
      }
    }
    getValue() {
      const $select = this.$phone.find(`.${CODE_SELECT_CLASS}`);
      return {
        phone: this.inputValue || this.$input && this.$input.val() || '',
        code: this.code,
        iso2: this.iso2 || $select.val() || ''
      };
    }
    getFormValue() {
      const value = this.value || this.changeValue(this.code, this.$input && this.$input.val());
      if (CODE_PHONE_PATTERN.test(value)) {
        const val = formatPhone(value);
        return {
          phone: val.phone,
          _code: val._code
        };
      }
      return {
        phone: value
      };
    }
    bindEvents() {
      this.createCodeSelect();
      this.$input.on('input', e => this.changeValue(this.code, e.target.value));
    }
    createCodeSelect() {
      const selectElementStr = getCodeSelectTemplate(this.iso2);
      this.$phone.append(selectElementStr);
      const $container = this.$phone.find(`.${CODE_SELECT_CONTAINER_CLASS}`);
      const $select = $container.find(`.${CODE_SELECT_CLASS}`);
      $select && $select.val(this.iso2);
      this.bindSelectCodeEvent($select);
    }
    bindSelectCodeEvent($select) {
      $select.on('change', () => {
        const iso2 = $select.val();
        const val = countriesCodeMap[iso2];
        this.iso2 = iso2;
        this.code = `${iso2}${val}`;
        this.changeCodeValue(iso2);
        this.changeValue(this.code, this.inputValue);
        if (this.inputValue) {
          this.form.validateFields('phone');
          this.form.setLocalsValue('phone', this.$input.val());
          this.emit && this.emit.codeChange && this.emit.codeChange({
            iso2,
            val
          });
        }
      });
      $select.on('input', e => e.stopPropagation());
    }
  }
  _exports.default = Phone;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/templates/getEyeOpenIcon.js'] = window.SLM['theme-shared/biz-com/customer/templates/getEyeOpenIcon.js'] || function () {
  const _exports = {};
  _exports.default = () => {
    return `
    <svg class="" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <mask id="visible_svg__a" maskUnits="userSpaceOnUse" x="0.341" y="2" width="15" height="12" fill="#000">
          <path fill="#fff" d="M.341 2h15v12h-15z"></path>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M2.341 8a6.002 6.002 0 0111.317 0A6.003 6.003 0 012.341 8z"></path>
        </mask>
        <path d="M2.341 8L.927 7.5a1.5 1.5 0 000 1L2.341 8zm11.317 0l1.415.5a1.5 1.5 0 000-1l-1.415.5zm-9.902.5c.618-1.75 2.287-3 4.244-3v-3a7.502 7.502 0 00-7.073 5l2.829 1zM8 5.5a4.502 4.502 0 014.244 3l2.829-1A7.503 7.503 0 008 2.5v3zm4.244 2A4.502 4.502 0 018 10.5v3a7.502 7.502 0 007.073-5l-2.829-1zM8 10.5a4.502 4.502 0 01-4.244-3l-2.829 1A7.502 7.502 0 008 13.5v-3z" fill="currentColor" mask="url(#visible_svg__a)"></path>
      </g>
      <circle cx="8" cy="8" r="1.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></circle>
    </svg>
  `;
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/templates/getEyeCloseIcon.js'] = window.SLM['theme-shared/biz-com/customer/templates/getEyeCloseIcon.js'] || function () {
  const _exports = {};
  _exports.default = () => {
    return `
    <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" class="ant-input-password-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.21 5.76a.75.75 0 10-1.42.48c.313.928.79 1.78 1.393 2.516L1.055 9.884a.75.75 0 101.061 1.06L3.24 9.82a7.44 7.44 0 004.01 1.692V13a.75.75 0 001.5 0v-1.488a7.44 7.44 0 004.01-1.692l1.124 1.124a.75.75 0 001.06-1.06l-1.127-1.128a8.025 8.025 0 001.393-2.515.75.75 0 10-1.42-.481c-.852 2.518-3.138 4.29-5.79 4.29S3.062 8.278 2.21 5.76z" fill="currentColor"></path></svg>
  `;
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/helpers/udb.sdk.rsa.js'] = window.SLM['theme-shared/biz-com/customer/helpers/udb.sdk.rsa.js'] || function () {
  const _exports = {};
  (function () {
    var that = {};
    var RSAUtils = {};
    var biRadixBase = 2;
    var biRadixBits = 16;
    var bitsPerDigit = biRadixBits;
    var biRadix = 1 << 16;
    var biHalfRadix = biRadix >>> 1;
    var biRadixSquared = biRadix * biRadix;
    var maxDigitVal = biRadix - 1;
    var maxInteger = 9999999999999998;
    var maxDigits;
    var ZERO_ARRAY;
    var bigZero, bigOne;
    var rsaPubkey_m = 'b5f53d3e7ab166d99b91bdee1414364e97a5569d9a4da971dcf241e9aec4ee4ee7a27b203f278be7cc695207d19b9209f0e50a3ea367100e06ad635e4ccde6f8a7179d84b7b9b7365a6a7533a9909695f79f3f531ea3c329b7ede2cd9bb9722104e95c0f234f1a72222b0210579f6582fcaa9d8fa62c431a37d88a4899ebce3d';
    var rsaPubkey_e = '10001';
    var BigInt = that.BigInt = function (flag) {
      if (typeof flag == 'boolean' && flag == true) {
        this.digits = null;
      } else {
        this.digits = ZERO_ARRAY.slice(0);
      }
      this.isNeg = false;
    };
    RSAUtils.setMaxDigits = function (value) {
      maxDigits = value;
      ZERO_ARRAY = new Array(maxDigits);
      for (var iza = 0; iza < ZERO_ARRAY.length; iza++) ZERO_ARRAY[iza] = 0;
      bigZero = new BigInt();
      bigOne = new BigInt();
      bigOne.digits[0] = 1;
    };
    RSAUtils.setMaxDigits(20);
    var dpl10 = 15;
    RSAUtils.biFromNumber = function (i) {
      var result = new BigInt();
      result.isNeg = i < 0;
      i = Math.abs(i);
      var j = 0;
      while (i > 0) {
        result.digits[j++] = i & maxDigitVal;
        i = Math.floor(i / biRadix);
      }
      return result;
    };
    var lr10 = RSAUtils.biFromNumber(1000000000000000);
    RSAUtils.biFromDecimal = function (s) {
      var isNeg = s.charAt(0) == '-';
      var i = isNeg ? 1 : 0;
      var result;
      while (i < s.length && s.charAt(i) == '0') ++i;
      if (i == s.length) {
        result = new BigInt();
      } else {
        var digitCount = s.length - i;
        var fgl = digitCount % dpl10;
        if (fgl == 0) fgl = dpl10;
        result = RSAUtils.biFromNumber(Number(s.substr(i, fgl)));
        i += fgl;
        while (i < s.length) {
          result = RSAUtils.biAdd(RSAUtils.biMultiply(result, lr10), RSAUtils.biFromNumber(Number(s.substr(i, dpl10))));
          i += dpl10;
        }
        result.isNeg = isNeg;
      }
      return result;
    };
    RSAUtils.biCopy = function (bi) {
      var result = new BigInt(true);
      result.digits = bi.digits.slice(0);
      result.isNeg = bi.isNeg;
      return result;
    };
    RSAUtils.reverseStr = function (s) {
      var result = '';
      for (var i = s.length - 1; i > -1; --i) {
        result += s.charAt(i);
      }
      return result;
    };
    var hexatrigesimalToChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    RSAUtils.biToString = function (x, radix) {
      var b = new BigInt();
      b.digits[0] = radix;
      var qr = RSAUtils.biDivideModulo(x, b);
      var result = hexatrigesimalToChar[qr[1].digits[0]];
      var digit;
      while (RSAUtils.biCompare(qr[0], bigZero) == 1) {
        qr = RSAUtils.biDivideModulo(qr[0], b);
        digit = qr[1].digits[0];
        result += hexatrigesimalToChar[qr[1].digits[0]];
      }
      return (x.isNeg ? '-' : '') + RSAUtils.reverseStr(result);
    };
    RSAUtils.biToDecimal = function (x) {
      var b = new BigInt();
      b.digits[0] = 10;
      var qr = RSAUtils.biDivideModulo(x, b);
      var result = String(qr[1].digits[0]);
      while (RSAUtils.biCompare(qr[0], bigZero) == 1) {
        qr = RSAUtils.biDivideModulo(qr[0], b);
        result += String(qr[1].digits[0]);
      }
      return (x.isNeg ? '-' : '') + RSAUtils.reverseStr(result);
    };
    var hexToChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    RSAUtils.digitToHex = function (n) {
      var mask = 0xf;
      var result = '';
      for (var i = 0; i < 4; ++i) {
        result += hexToChar[n & mask];
        n >>>= 4;
      }
      return RSAUtils.reverseStr(result);
    };
    RSAUtils.biToHex = function (x) {
      var result = '';
      var n = RSAUtils.biHighIndex(x);
      for (var i = RSAUtils.biHighIndex(x); i > -1; --i) {
        result += RSAUtils.digitToHex(x.digits[i]);
      }
      return result;
    };
    RSAUtils.charToHex = function (c) {
      var ZERO = 48;
      var NINE = ZERO + 9;
      var littleA = 97;
      var littleZ = littleA + 25;
      var bigA = 65;
      var bigZ = 65 + 25;
      var result;
      if (c >= ZERO && c <= NINE) {
        result = c - ZERO;
      } else if (c >= bigA && c <= bigZ) {
        result = 10 + c - bigA;
      } else if (c >= littleA && c <= littleZ) {
        result = 10 + c - littleA;
      } else {
        result = 0;
      }
      return result;
    };
    RSAUtils.hexToDigit = function (s) {
      var result = 0;
      var sl = Math.min(s.length, 4);
      for (var i = 0; i < sl; ++i) {
        result <<= 4;
        result |= RSAUtils.charToHex(s.charCodeAt(i));
      }
      return result;
    };
    RSAUtils.biFromHex = function (s) {
      var result = new BigInt();
      var sl = s.length;
      for (var i = sl, j = 0; i > 0; i -= 4, ++j) {
        result.digits[j] = RSAUtils.hexToDigit(s.substr(Math.max(i - 4, 0), Math.min(i, 4)));
      }
      return result;
    };
    RSAUtils.biFromString = function (s, radix) {
      var isNeg = s.charAt(0) == '-';
      var istop = isNeg ? 1 : 0;
      var result = new BigInt();
      var place = new BigInt();
      place.digits[0] = 1;
      for (var i = s.length - 1; i >= istop; i--) {
        var c = s.charCodeAt(i);
        var digit = RSAUtils.charToHex(c);
        var biDigit = RSAUtils.biMultiplyDigit(place, digit);
        result = RSAUtils.biAdd(result, biDigit);
        place = RSAUtils.biMultiplyDigit(place, radix);
      }
      result.isNeg = isNeg;
      return result;
    };
    RSAUtils.biDump = function (b) {
      return (b.isNeg ? '-' : '') + b.digits.join(' ');
    };
    RSAUtils.biAdd = function (x, y) {
      var result;
      if (x.isNeg != y.isNeg) {
        y.isNeg = !y.isNeg;
        result = RSAUtils.biSubtract(x, y);
        y.isNeg = !y.isNeg;
      } else {
        result = new BigInt();
        var c = 0;
        var n;
        for (var i = 0; i < x.digits.length; ++i) {
          n = x.digits[i] + y.digits[i] + c;
          result.digits[i] = n % biRadix;
          c = Number(n >= biRadix);
        }
        result.isNeg = x.isNeg;
      }
      return result;
    };
    RSAUtils.biSubtract = function (x, y) {
      var result;
      if (x.isNeg != y.isNeg) {
        y.isNeg = !y.isNeg;
        result = RSAUtils.biAdd(x, y);
        y.isNeg = !y.isNeg;
      } else {
        result = new BigInt();
        var n, c;
        c = 0;
        for (let i = 0; i < x.digits.length; ++i) {
          n = x.digits[i] - y.digits[i] + c;
          result.digits[i] = n % biRadix;
          if (result.digits[i] < 0) result.digits[i] += biRadix;
          c = 0 - Number(n < 0);
        }
        if (c == -1) {
          c = 0;
          for (let i = 0; i < x.digits.length; ++i) {
            n = 0 - result.digits[i] + c;
            result.digits[i] = n % biRadix;
            if (result.digits[i] < 0) result.digits[i] += biRadix;
            c = 0 - Number(n < 0);
          }
          result.isNeg = !x.isNeg;
        } else {
          result.isNeg = x.isNeg;
        }
      }
      return result;
    };
    RSAUtils.biHighIndex = function (x) {
      var result = x.digits.length - 1;
      while (result > 0 && x.digits[result] == 0) --result;
      return result;
    };
    RSAUtils.biNumBits = function (x) {
      var n = RSAUtils.biHighIndex(x);
      var d = x.digits[n];
      var m = (n + 1) * bitsPerDigit;
      var result;
      for (result = m; result > m - bitsPerDigit; --result) {
        if ((d & 0x8000) != 0) break;
        d <<= 1;
      }
      return result;
    };
    RSAUtils.biMultiply = function (x, y) {
      var result = new BigInt();
      var c;
      var n = RSAUtils.biHighIndex(x);
      var t = RSAUtils.biHighIndex(y);
      var u, uv, k, j;
      for (var i = 0; i <= t; ++i) {
        c = 0;
        k = i;
        for (j = 0; j <= n; ++j, ++k) {
          uv = result.digits[k] + x.digits[j] * y.digits[i] + c;
          result.digits[k] = uv & maxDigitVal;
          c = uv >>> biRadixBits;
        }
        result.digits[i + n + 1] = c;
      }
      result.isNeg = x.isNeg != y.isNeg;
      return result;
    };
    RSAUtils.biMultiplyDigit = function (x, y) {
      var n, c, uv, result;
      result = new BigInt();
      n = RSAUtils.biHighIndex(x);
      c = 0;
      for (var j = 0; j <= n; ++j) {
        uv = result.digits[j] + x.digits[j] * y + c;
        result.digits[j] = uv & maxDigitVal;
        c = uv >>> biRadixBits;
      }
      result.digits[1 + n] = c;
      return result;
    };
    RSAUtils.arrayCopy = function (src, srcStart, dest, destStart, n) {
      var m = Math.min(srcStart + n, src.length);
      for (var i = srcStart, j = destStart; i < m; ++i, ++j) {
        dest[j] = src[i];
      }
    };
    var highBitMasks = [0x0000, 0x8000, 0xc000, 0xe000, 0xf000, 0xf800, 0xfc00, 0xfe00, 0xff00, 0xff80, 0xffc0, 0xffe0, 0xfff0, 0xfff8, 0xfffc, 0xfffe, 0xffff];
    RSAUtils.biShiftLeft = function (x, n) {
      var digitCount = Math.floor(n / bitsPerDigit);
      var result = new BigInt();
      RSAUtils.arrayCopy(x.digits, 0, result.digits, digitCount, result.digits.length - digitCount);
      var bits = n % bitsPerDigit;
      var rightBits = bitsPerDigit - bits;
      for (var i = result.digits.length - 1, i1 = i - 1; i > 0; --i, --i1) {
        result.digits[i] = result.digits[i] << bits & maxDigitVal | (result.digits[i1] & highBitMasks[bits]) >>> rightBits;
      }
      result.digits[0] = result.digits[i] << bits & maxDigitVal;
      result.isNeg = x.isNeg;
      return result;
    };
    var lowBitMasks = [0x0000, 0x0001, 0x0003, 0x0007, 0x000f, 0x001f, 0x003f, 0x007f, 0x00ff, 0x01ff, 0x03ff, 0x07ff, 0x0fff, 0x1fff, 0x3fff, 0x7fff, 0xffff];
    RSAUtils.biShiftRight = function (x, n) {
      var digitCount = Math.floor(n / bitsPerDigit);
      var result = new BigInt();
      RSAUtils.arrayCopy(x.digits, digitCount, result.digits, 0, x.digits.length - digitCount);
      var bits = n % bitsPerDigit;
      var leftBits = bitsPerDigit - bits;
      for (var i = 0, i1 = i + 1; i < result.digits.length - 1; ++i, ++i1) {
        result.digits[i] = result.digits[i] >>> bits | (result.digits[i1] & lowBitMasks[bits]) << leftBits;
      }
      result.digits[result.digits.length - 1] >>>= bits;
      result.isNeg = x.isNeg;
      return result;
    };
    RSAUtils.biMultiplyByRadixPower = function (x, n) {
      var result = new BigInt();
      RSAUtils.arrayCopy(x.digits, 0, result.digits, n, result.digits.length - n);
      return result;
    };
    RSAUtils.biDivideByRadixPower = function (x, n) {
      var result = new BigInt();
      RSAUtils.arrayCopy(x.digits, n, result.digits, 0, result.digits.length - n);
      return result;
    };
    RSAUtils.biModuloByRadixPower = function (x, n) {
      var result = new BigInt();
      RSAUtils.arrayCopy(x.digits, 0, result.digits, 0, n);
      return result;
    };
    RSAUtils.biCompare = function (x, y) {
      if (x.isNeg != y.isNeg) {
        return 1 - 2 * Number(x.isNeg);
      }
      for (var i = x.digits.length - 1; i >= 0; --i) {
        if (x.digits[i] != y.digits[i]) {
          if (x.isNeg) {
            return 1 - 2 * Number(x.digits[i] > y.digits[i]);
          } else {
            return 1 - 2 * Number(x.digits[i] < y.digits[i]);
          }
        }
      }
      return 0;
    };
    RSAUtils.biDivideModulo = function (x, y) {
      var nb = RSAUtils.biNumBits(x);
      var tb = RSAUtils.biNumBits(y);
      var origYIsNeg = y.isNeg;
      var q, r;
      if (nb < tb) {
        if (x.isNeg) {
          q = RSAUtils.biCopy(bigOne);
          q.isNeg = !y.isNeg;
          x.isNeg = false;
          y.isNeg = false;
          r = biSubtract(y, x);
          x.isNeg = true;
          y.isNeg = origYIsNeg;
        } else {
          q = new BigInt();
          r = RSAUtils.biCopy(x);
        }
        return [q, r];
      }
      q = new BigInt();
      r = x;
      var t = Math.ceil(tb / bitsPerDigit) - 1;
      var lambda = 0;
      while (y.digits[t] < biHalfRadix) {
        y = RSAUtils.biShiftLeft(y, 1);
        ++lambda;
        ++tb;
        t = Math.ceil(tb / bitsPerDigit) - 1;
      }
      r = RSAUtils.biShiftLeft(r, lambda);
      nb += lambda;
      var n = Math.ceil(nb / bitsPerDigit) - 1;
      var b = RSAUtils.biMultiplyByRadixPower(y, n - t);
      while (RSAUtils.biCompare(r, b) != -1) {
        ++q.digits[n - t];
        r = RSAUtils.biSubtract(r, b);
      }
      for (var i = n; i > t; --i) {
        var ri = i >= r.digits.length ? 0 : r.digits[i];
        var ri1 = i - 1 >= r.digits.length ? 0 : r.digits[i - 1];
        var ri2 = i - 2 >= r.digits.length ? 0 : r.digits[i - 2];
        var yt = t >= y.digits.length ? 0 : y.digits[t];
        var yt1 = t - 1 >= y.digits.length ? 0 : y.digits[t - 1];
        if (ri == yt) {
          q.digits[i - t - 1] = maxDigitVal;
        } else {
          q.digits[i - t - 1] = Math.floor((ri * biRadix + ri1) / yt);
        }
        var c1 = q.digits[i - t - 1] * (yt * biRadix + yt1);
        var c2 = ri * biRadixSquared + (ri1 * biRadix + ri2);
        while (c1 > c2) {
          --q.digits[i - t - 1];
          c1 = q.digits[i - t - 1] * (yt * biRadix | yt1);
          c2 = ri * biRadix * biRadix + (ri1 * biRadix + ri2);
        }
        b = RSAUtils.biMultiplyByRadixPower(y, i - t - 1);
        r = RSAUtils.biSubtract(r, RSAUtils.biMultiplyDigit(b, q.digits[i - t - 1]));
        if (r.isNeg) {
          r = RSAUtils.biAdd(r, b);
          --q.digits[i - t - 1];
        }
      }
      r = RSAUtils.biShiftRight(r, lambda);
      q.isNeg = x.isNeg != origYIsNeg;
      if (x.isNeg) {
        if (origYIsNeg) {
          q = RSAUtils.biAdd(q, bigOne);
        } else {
          q = RSAUtils.biSubtract(q, bigOne);
        }
        y = RSAUtils.biShiftRight(y, lambda);
        r = RSAUtils.biSubtract(y, r);
      }
      if (r.digits[0] == 0 && RSAUtils.biHighIndex(r) == 0) r.isNeg = false;
      return [q, r];
    };
    RSAUtils.biDivide = function (x, y) {
      return RSAUtils.biDivideModulo(x, y)[0];
    };
    RSAUtils.biModulo = function (x, y) {
      return RSAUtils.biDivideModulo(x, y)[1];
    };
    RSAUtils.biMultiplyMod = function (x, y, m) {
      return RSAUtils.biModulo(RSAUtils.biMultiply(x, y), m);
    };
    RSAUtils.biPow = function (x, y) {
      var result = bigOne;
      var a = x;
      while (true) {
        if ((y & 1) != 0) result = RSAUtils.biMultiply(result, a);
        y >>= 1;
        if (y == 0) break;
        a = RSAUtils.biMultiply(a, a);
      }
      return result;
    };
    RSAUtils.biPowMod = function (x, y, m) {
      var result = bigOne;
      var a = x;
      var k = y;
      while (true) {
        if ((k.digits[0] & 1) != 0) result = RSAUtils.biMultiplyMod(result, a, m);
        k = RSAUtils.biShiftRight(k, 1);
        if (k.digits[0] == 0 && RSAUtils.biHighIndex(k) == 0) break;
        a = RSAUtils.biMultiplyMod(a, a, m);
      }
      return result;
    };
    that.BarrettMu = function (m) {
      this.modulus = RSAUtils.biCopy(m);
      this.k = RSAUtils.biHighIndex(this.modulus) + 1;
      var b2k = new BigInt();
      b2k.digits[2 * this.k] = 1;
      this.mu = RSAUtils.biDivide(b2k, this.modulus);
      this.bkplus1 = new BigInt();
      this.bkplus1.digits[this.k + 1] = 1;
      this.modulo = BarrettMu_modulo;
      this.multiplyMod = BarrettMu_multiplyMod;
      this.powMod = BarrettMu_powMod;
    };
    function BarrettMu_modulo(x) {
      var $dmath = RSAUtils;
      var q1 = $dmath.biDivideByRadixPower(x, this.k - 1);
      var q2 = $dmath.biMultiply(q1, this.mu);
      var q3 = $dmath.biDivideByRadixPower(q2, this.k + 1);
      var r1 = $dmath.biModuloByRadixPower(x, this.k + 1);
      var r2term = $dmath.biMultiply(q3, this.modulus);
      var r2 = $dmath.biModuloByRadixPower(r2term, this.k + 1);
      var r = $dmath.biSubtract(r1, r2);
      if (r.isNeg) {
        r = $dmath.biAdd(r, this.bkplus1);
      }
      var rgtem = $dmath.biCompare(r, this.modulus) >= 0;
      while (rgtem) {
        r = $dmath.biSubtract(r, this.modulus);
        rgtem = $dmath.biCompare(r, this.modulus) >= 0;
      }
      return r;
    }
    function BarrettMu_multiplyMod(x, y) {
      var xy = RSAUtils.biMultiply(x, y);
      return this.modulo(xy);
    }
    function BarrettMu_powMod(x, y) {
      var result = new BigInt();
      result.digits[0] = 1;
      var a = x;
      var k = y;
      while (true) {
        if ((k.digits[0] & 1) != 0) result = this.multiplyMod(result, a);
        k = RSAUtils.biShiftRight(k, 1);
        if (k.digits[0] == 0 && RSAUtils.biHighIndex(k) == 0) break;
        a = this.multiplyMod(a, a);
      }
      return result;
    }
    var RSAKeyPair = function (encryptionExponent, decryptionExponent, modulus) {
      var $dmath = RSAUtils;
      this.e = $dmath.biFromHex(encryptionExponent);
      this.d = $dmath.biFromHex(decryptionExponent);
      this.m = $dmath.biFromHex(modulus);
      this.chunkSize = 2 * $dmath.biHighIndex(this.m);
      this.radix = 16;
      this.barrett = new that.BarrettMu(this.m);
    };
    RSAUtils.getKeyPair = function (encryptionExponent, decryptionExponent, modulus) {
      return new RSAKeyPair(encryptionExponent, decryptionExponent, modulus);
    };
    if (typeof that.twoDigit === 'undefined') {
      that.twoDigit = function (n) {
        return (n < 10 ? '0' : '') + String(n);
      };
    }
    RSAUtils.encryptedString = function (s) {
      if (s == null || RSAUtils.containsChinese(s)) {
        return '';
      }
      s = s.split('').reverse().join('');
      var key = new RSAUtils.getKeyPair(rsaPubkey_e, '', rsaPubkey_m);
      var a = [];
      var sl = s.length;
      var i = 0;
      while (i < sl) {
        a[i] = s.charCodeAt(i);
        i++;
      }
      while (a.length % key.chunkSize != 0) {
        a[i++] = 0;
      }
      var al = a.length;
      var result = '';
      var j, k, block;
      for (i = 0; i < al; i += key.chunkSize) {
        block = new BigInt();
        j = 0;
        for (k = i; k < i + key.chunkSize; ++j) {
          block.digits[j] = a[k++];
          block.digits[j] += a[k++] << 8;
        }
        var crypt = key.barrett.powMod(block, key.e);
        var text = key.radix == 16 ? RSAUtils.biToHex(crypt) : RSAUtils.biToString(crypt, key.radix);
        result += text + ' ';
      }
      result = result.substring(0, result.length - 1);
      if (result.length == 256) {
        return result;
      } else if (result.length == 252) {
        return '0000' + result;
      } else {
        return '';
      }
    };
    RSAUtils.decryptedString = function (key, s) {
      var blocks = s.split(' ');
      var result = '';
      var i, j, block;
      for (i = 0; i < blocks.length; ++i) {
        var bi;
        if (key.radix == 16) {
          bi = RSAUtils.biFromHex(blocks[i]);
        } else {
          bi = RSAUtils.biFromString(blocks[i], key.radix);
        }
        block = key.barrett.powMod(bi, key.d);
        for (j = 0; j <= RSAUtils.biHighIndex(block); ++j) {
          result += String.fromCharCode(block.digits[j] & 255, block.digits[j] >> 8);
        }
      }
      if (result.charCodeAt(result.length - 1) == 0) {
        result = result.substring(0, result.length - 1);
      }
      return result;
    };
    RSAUtils.containsChinese = function (data) {
      if (data == null || data.length == 0) {
        return false;
      }
      var dataArr = data.split('');
      for (var i = 0; i < dataArr.length; i++) {
        var tmp = dataArr[i];
        if (RSAUtils.isChinese(dataArr[i])) {
          return true;
        }
      }
      return false;
    };
    RSAUtils.isChinese = function (temp) {
      if (temp.charCodeAt(0) > 255) {
        return true;
      } else {
        return false;
      }
    };
    var NS = function (ns, hld) {
      var arr = ['window'];
      ns = ns.split('.');
      while (ns.length != 1) {
        arr.push(ns.shift());
        if (eval(arr.join('.')) == null) {
          eval(arr.join('.') + ' = {};');
        }
      }
      arr.push(ns.shift());
      eval(arr.join('.') + ' = hld;');
    };
    RSAUtils.setMaxDigits(200);
    that.registerNS = NS;
    that.RSAUtils = RSAUtils;
    that.registerNS('UDB.SDK.rsa', that);
  })();
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/helpers/encrypt.js'] = window.SLM['theme-shared/biz-com/customer/helpers/encrypt.js'] || function () {
  const _exports = {};
  const encrypt = value => window && window.UDB && window.UDB.SDK && window.UDB.SDK.rsa && window.UDB.SDK.rsa.RSAUtils && window.UDB.SDK.rsa.RSAUtils.encryptedString(value);
  _exports.encrypt = encrypt;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/commons/form-item/password.js'] = window.SLM['theme-shared/biz-com/customer/commons/form-item/password.js'] || function () {
  const _exports = {};
  const getEyeOpenIcon = window['SLM']['theme-shared/biz-com/customer/templates/getEyeOpenIcon.js'].default;
  const getEyeCloseIcon = window['SLM']['theme-shared/biz-com/customer/templates/getEyeCloseIcon.js'].default;
  const { encrypt } = window['SLM']['theme-shared/biz-com/customer/helpers/encrypt.js'];
  class Password {
    constructor({
      formId,
      value,
      name
    }) {
      this.formId = formId;
      this.name = name;
      this.$item = $(`#${formId} [sl-form-item-name="${name}"] .sl-input`);
      this.$input = this.$item.find('.sl-input__inpEle');
      const originValue = value || '';
      this.value = encrypt(originValue);
      this.inputValue = originValue;
      this.init();
    }
    init() {
      this.bindEvents();
    }
    getValue() {
      return {
        [this.name]: this.inputValue || this.$input.val() || ''
      };
    }
    getFormValue() {
      const value = this.inputValue || this.$input.val() || '';
      this.value = value && encrypt(value);
      return {
        [this.name]: this.value
      };
    }
    bindEvents() {
      this.$input.on('input', e => {
        const {
          value
        } = e.target;
        this.inputValue = value;
      });
      this.$item.find('.sl-input__suffix').click(e => {
        const $this = $(e.currentTarget);
        const $input = $this.siblings('.sl-input__area').find('.sl-input__inpEle');
        const type = $input.attr('type');
        if (type === 'password') {
          $input.attr('type', 'text');
          $this.html(getEyeOpenIcon());
        } else {
          $input.attr('type', 'password');
          $this.html(getEyeCloseIcon());
        }
      });
    }
  }
  _exports.default = Password;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/commons/form-item/verifycode.js'] = window.SLM['theme-shared/biz-com/customer/commons/form-item/verifycode.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const { CODE_PHONE_PATTERN } = window['SLM']['theme-shared/biz-com/customer/constant/pattern.js'];
  const { getUdbErrorMessage } = window['SLM']['theme-shared/biz-com/customer/helpers/getUdbResponseLanguageErrorKey.js'];
  const BUTTON_LOADING_CLASS = 'btn--loading';
  const formatterFormData = data => {
    const result = {
      ...data
    };
    if (data.phone || CODE_PHONE_PATTERN.test(data.username)) {
      const exec = CODE_PHONE_PATTERN.exec(data.phone || data.username);
      if (exec) {
        result[data.username ? 'username' : 'phone'] = `${exec[2]}${exec[3]}`.replace('+', '00');
        result._code = exec[1].slice(0, -exec[2].length);
      }
    }
    return result;
  };
  _exports.formatterFormData = formatterFormData;
  class Verifycode {
    constructor({
      form,
      formId,
      value,
      on,
      immediate
    }) {
      this.countDown = 60;
      this.countDownTimeout = null;
      this.form = form;
      this.formId = formId;
      this.on = on;
      this.$item = $(`#${formId} [sl-form-item-name="verifycode"] .sl-input`);
      this.$input = this.$item.find('.sl-input__inpEle');
      this.$send = this.$item.find(`.customer__send-btn`);
      const originValue = value || this.$input && this.$input.val();
      this.value = originValue;
      this.inputValue = originValue;
      this.immediate = immediate;
      this.dependFormItemName = null;
      this.init();
    }
    $$watch({
      name,
      value
    }) {
      this.changeSendButtonStatus(name, value);
    }
    changeSendButtonStatus(name, value) {
      if (this.countDownTimeout) {
        return;
      }
      if (value === undefined) {
        return;
      }
      const {
        $send
      } = this;
      if (value) {
        this.dependFormItemName = name;
        this.form.validateFields([name]).then(res => {
          if (res.pass) {
            $send.removeAttr('disabled');
          } else {
            $send.attr('disabled', true);
          }
        }).catch(() => {
          $send.attr('disabled', true);
        });
      } else {
        $send.attr('disabled', true);
      }
    }
    init() {
      this.bindSendCodeEvent();
    }
    getValue() {
      return {
        verifycode: this.inputValue || this.$input.val() || ''
      };
    }
    getFormValue() {
      const value = this.inputValue || this.$input.val() || '';
      this.value = value;
      return {
        verifycode: value
      };
    }
    setCountDown() {
      if (this.countDown > 0) {
        this.$send.attr('disabled', true);
        this.$send.text(`${t('customer.general.resend')}(${this.countDown})`);
        this.countDown -= 1;
        this.countDownTimeout = window.setTimeout(() => {
          this.setCountDown();
        }, 1000);
      } else {
        this.clearCountDown();
      }
    }
    clearCountDown() {
      this.$send.removeAttr('disabled');
      this.$send.text(t('customer.general.send'));
      window.clearTimeout(this.countDownTimeout);
      this.countDownTimeout = null;
      this.countDown = 60;
    }
    bindSendCodeEvent() {
      const {
        $send
      } = this;
      let loading = false;
      $send.on('click', async e => {
        e.preventDefault();
        if (loading) {
          return false;
        }
        this.clearCountDown();
        try {
          loading = true;
          $(e.target).addClass(BUTTON_LOADING_CLASS);
          await (this.on && this.on.send());
          this.form.removeErrList([this.dependFormItemName || 'verifycode']);
          this.setCountDown();
        } catch (error) {
          this.clearCountDown();
          if (error && (error.rescode || error.message)) {
            this.form.setErrMsgIntoDom([{
              name: this.dependFormItemName || 'verifycode',
              messages: [getUdbErrorMessage(error)]
            }]);
          }
        }
        loading = false;
        $(e.target).removeClass(BUTTON_LOADING_CLASS);
      });
      if (this.immediate) {
        this.triggerSendCode();
      }
    }
    triggerSendCode() {
      const {
        $send
      } = this;
      $send.removeAttr('disabled');
      $send.trigger('click');
    }
    reset() {
      this.clearCountDown();
    }
  }
  _exports.default = Verifycode;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/commons/form/install.js'] = window.SLM['theme-shared/biz-com/customer/commons/form/install.js'] || function () {
  const _exports = {};
  const Username = window['SLM']['theme-shared/biz-com/customer/commons/form-item/username.js'].default;
  const Phone = window['SLM']['theme-shared/biz-com/customer/commons/form-item/phone.js'].default;
  const Password = window['SLM']['theme-shared/biz-com/customer/commons/form-item/password.js'].default;
  const Verifycode = window['SLM']['theme-shared/biz-com/customer/commons/form-item/verifycode.js'].default;
  const map = {
    phone: Phone,
    username: Username,
    password: Password,
    verifycode: Verifycode
  };
  _exports.default = (formInstance, fields, defaultFormValue = {}) => {
    const formItems = {};
    const initFields = fields.map(({
      type,
      name,
      value,
      dependencies,
      rules = [],
      on = {},
      ...args
    }) => {
      const Constructor = map[type];
      const dependenciesValue = dependencies && dependencies.reduce((values, key) => {
        values[key] = defaultFormValue[key];
        return values;
      }, {});
      if (Constructor) {
        const instance = new Constructor({
          name,
          form: formInstance,
          formId: formInstance.fid,
          value,
          on,
          ...args,
          ...dependenciesValue
        });
        if (defaultFormValue[name]) {
          $(formInstance.el).find(`input[name=${name}]`).val(defaultFormValue[name]);
        }
        const {
          rules: defaultRules = []
        } = instance && instance.install && instance.install() || {};
        formItems[name] = instance;
        return {
          name,
          value,
          rules: rules.concat(defaultRules)
        };
      }
      return {
        name,
        value,
        rules
      };
    });
    initFields.forEach(({
      name,
      value,
      rules
    }) => {
      formInstance.setRule(rules, name);
      if (value) {
        formInstance.setLocalsValue(name, value);
      }
    });
    formInstance.on('valuesChange', ({
      changedValue
    }) => {
      const keys = Object.keys(changedValue);
      const key = keys && keys[0];
      const subscriptField = fields.filter(item => item && item.watch && item.watch.includes(key)) || [];
      subscriptField && subscriptField.forEach(field => {
        const currentInstance = formItems[field && field.type];
        const $$watch = currentInstance && currentInstance.$$watch;
        if (typeof $$watch === 'function') {
          $$watch && $$watch.call(currentInstance, {
            name: key,
            value: changedValue[key]
          });
        } else if (typeof $$watch === 'object') {
          $$watch && $$watch[key] && $$watch[key].call(currentInstance, changedValue[key]);
        }
      });
    });
    return formItems;
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/commons/form/index.js'] = window.SLM['theme-shared/biz-com/customer/commons/form/index.js'] || function () {
  const _exports = {};
  const Form = window['SLM']['theme-shared/utils/form/index.js'].default;
  const { ValidateTrigger } = window['SLM']['theme-shared/utils/form/form.js'];
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const installDefaultFormItem = window['SLM']['theme-shared/biz-com/customer/commons/form/install.js'].default;
  const { getUdbErrorMessage } = window['SLM']['theme-shared/biz-com/customer/helpers/getUdbResponseLanguageErrorKey.js'];
  const Toast = window['SLM']['theme-shared/components/hbs/shared/components/toast/index.js'].default;
  const BUTTON_LOADING_CLASS = 'btn--loading';
  class CustomerForm {
    constructor({
      id,
      fields,
      formValue = {},
      submitElement,
      onSubmit,
      onValidate
    }) {
      this.formId = id;
      this.fields = fields;
      this.formInstance = null;
      this.onSubmit = onSubmit;
      this.onValidate = onValidate;
      this.formItemInstances = {};
      this.isLoading = false;
      this.submitElement = submitElement ? $(submitElement) : $(`#${id} .submit-button`);
      this.defaultFormValue = formValue;
      this.init();
      return this;
    }
    init() {
      this.formInstance = this.initForm();
      this.setFormFields(this.fields);
      this.bindEvents();
    }
    initForm() {
      const formInstance = Form.takeForm(this.formId);
      formInstance.init({
        validateTriggerAfterValidationFailed: ValidateTrigger.MANUAL
      });
      return formInstance;
    }
    setFormFields(fields) {
      this.formItemInstances = installDefaultFormItem(this.formInstance, fields, this.defaultFormValue);
    }
    bindEvents() {
      this.bindFormSubmit();
    }
    setLoading(isLoading) {
      const $btn = this.submitElement;
      if (isLoading) {
        this.isLoading = true;
        $btn.addClass(BUTTON_LOADING_CLASS);
      } else {
        this.isLoading = false;
        $btn.removeClass(BUTTON_LOADING_CLASS);
      }
    }
    bindFormSubmit() {
      this.submitElement.click(async e => {
        if (this.isLoading) {
          return;
        }
        if (!(window && window.navigator && window.navigator.onLine)) {
          Toast.init({
            content: t('customer.general.network_error_message')
          });
          return;
        }
        e.preventDefault();
        try {
          await this.validateForm();
          const data = this.getFormValue();
          this.setLoading(true);
          await (this.onSubmit && this.onSubmit(data));
        } catch (err) {
          if (err.rescode) {
            const lastField = this.fields[this.fields.length - 1];
            if (lastField.name && getUdbErrorMessage(err)) {
              this.formInstance.setErrMsgIntoDom([{
                name: lastField.name,
                messages: [getUdbErrorMessage(err)]
              }]);
            }
          }
        }
        this.setLoading(false);
      });
      this.bindInputActive();
    }
    getValue() {
      const fieldsValue = this.formInstance.getFieldsValue();
      return Object.keys(fieldsValue).reduce((values, key) => {
        const itemValue = this.formItemInstances[key] && this.formItemInstances[key].getValue();
        if (itemValue) {
          return {
            ...values,
            ...itemValue
          };
        }
        return {
          ...values,
          [key]: fieldsValue[key]
        };
      }, {});
    }
    getFormValue() {
      const fieldsValue = this.formInstance.getFieldsValue();
      return Object.keys(fieldsValue).reduce((values, key) => {
        const itemValue = this.formItemInstances[key] && this.formItemInstances[key].getFormValue();
        if (itemValue) {
          return {
            ...values,
            ...itemValue
          };
        }
        return {
          ...values,
          [key]: fieldsValue[key]
        };
      }, {});
    }
    async validateForm() {
      const validateFields = [this.formInstance.validateFields()];
      if (typeof this.onValidate === 'function') {
        validateFields.push(this.onValidate());
      }
      const res = await Promise.all(validateFields);
      const failRes = res.filter(item => !item.pass);
      if (failRes.length > 0) {
        throw new Error({
          errFields: failRes.reduce((sum, item) => sum.concat(item.errFields), []),
          pass: false
        });
      }
      return true;
    }
    bindInputActive() {
      $(this.formInstance.el).find('.placeholder').one('transitionend', e => {
        $(e.target).addClass('active');
        setTimeout(() => $(e.target).removeClass('active'), 100);
      });
    }
    destroy() {
      this.formInstance = null;
      Object.keys(this.formItemInstances).forEach(instance => {
        this.formItemInstances[instance] && this.formItemInstances[instance].reset && this.formItemInstances[instance].reset();
      });
      this.formItemInstances = {};
      this.formInstance && this.formInstance.resetErrStatus();
      this.formInstance && this.formInstance.destroy();
    }
  }
  _exports.default = CustomerForm;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/commons/customer/init.js'] = window.SLM['theme-shared/biz-com/customer/commons/customer/init.js'] || function () {
  const _exports = {};
  const Cookie = window['js-cookie']['default'];
  const { HOME } = window['SLM']['theme-shared/biz-com/customer/constant/url.js'];
  const { UDB_PARAMS, THIRD_DEFAULT_REGION } = window['SLM']['theme-shared/biz-com/customer/constant/const.js'];
  const { redirectTo } = window['SLM']['theme-shared/biz-com/customer/helpers/format.js'];
  _exports.default = function () {
    const {
      checkTag,
      subAppid,
      types
    } = window && window.SL_State && window.SL_State.get('shop.store_register_config') || {};
    const {
      countryCode
    } = window && window.SL_State && window.SL_State.get('customer_address.countryCode') || {};
    const code = countryCode || THIRD_DEFAULT_REGION;
    Cookie.set('country_code', code);
    if (!types) {
      window.location.href = redirectTo(HOME);
      return;
    }
    const params = {
      ...UDB_PARAMS,
      subappid: subAppid,
      code
    };
    if (checkTag) {
      params.verify = '1';
    }
    const hasEmail = types.includes('email');
    const hasPhone = types.includes('mobile');
    if (!hasEmail) {
      params.mode = 'phone';
    } else if (!hasPhone) {
      params.mode = 'email';
    }
    return {
      ...params
    };
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/service/common.js'] = window.SLM['theme-shared/biz-com/customer/service/common.js'] || function () {
  const _exports = {};
  const { request, udbRequest } = window['SLM']['theme-shared/biz-com/customer/helpers/request.js'];
  const getMethodList = params => {
    return udbRequest.get('/udb/aq/uni/getMethodList.do', {
      params
    });
  };
  _exports.getMethodList = getMethodList;
  const passVerify = params => {
    return udbRequest.get('/udb/aq/uni/pass.do', {
      params
    });
  };
  _exports.passVerify = passVerify;
  const getCurrentTime = () => {
    return request.get('/user/front/userinfo/getCurrentTime');
  };
  _exports.getCurrentTime = getCurrentTime;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/service/bind.js'] = window.SLM['theme-shared/biz-com/customer/service/bind.js'] || function () {
  const _exports = {};
  const { udbRequest, request } = window['SLM']['theme-shared/biz-com/customer/helpers/request.js'];
  const getBindEmailInitConfig = params => {
    return udbRequest.get('/udb/aq/email/bind/init.do', {
      params
    });
  };
  _exports.getBindEmailInitConfig = getBindEmailInitConfig;
  const getBindPhoneInitConfig = params => {
    return udbRequest.get('/udb/aq/mobile/bind/init.do', {
      params
    });
  };
  _exports.getBindPhoneInitConfig = getBindPhoneInitConfig;
  const sendBindPhoneVerificationCode = params => {
    return udbRequest.get('/udb/aq/mobile/bind/sendSms.do', {
      params
    });
  };
  _exports.sendBindPhoneVerificationCode = sendBindPhoneVerificationCode;
  const sendBindEmailVerificationCode = params => {
    return udbRequest.get('/udb/aq/email/bind/sendCode.do', {
      params
    });
  };
  _exports.sendBindEmailVerificationCode = sendBindEmailVerificationCode;
  const updateBindInfo = type => {
    return request.get(`/user/front/userinfo/sync/${type}`);
  };
  _exports.updateBindInfo = updateBindInfo;
  const verifyBindPhoneVerificationCode = params => {
    return udbRequest.get('/udb/aq/mobile/bind/bind.do', {
      params
    });
  };
  _exports.verifyBindPhoneVerificationCode = verifyBindPhoneVerificationCode;
  const verifyBindEmailVerificationCode = params => {
    return udbRequest.get('/udb/aq/email/bind/bind.do', {
      params
    });
  };
  _exports.verifyBindEmailVerificationCode = verifyBindEmailVerificationCode;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/service/reset.js'] = window.SLM['theme-shared/biz-com/customer/service/reset.js'] || function () {
  const _exports = {};
  const { udbRequest } = window['SLM']['theme-shared/biz-com/customer/helpers/request.js'];
  const getChangePasswordInitConfig = params => {
    return udbRequest.get('/udb/aq/pwd/change/init.do', {
      params
    });
  };
  _exports.getChangePasswordInitConfig = getChangePasswordInitConfig;
  const checkResetAccount = params => {
    return udbRequest.get('/udb/aq/pwd/retrieve/prechk.do', {
      params
    });
  };
  _exports.checkResetAccount = checkResetAccount;
  const changeAccountPassword = params => {
    return udbRequest.get('/udb/aq/pwd/change/modify.do', {
      params
    });
  };
  _exports.changeAccountPassword = changeAccountPassword;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/helpers/riskControl.js'] = window.SLM['theme-shared/biz-com/customer/helpers/riskControl.js'] || function () {
  const _exports = {};
  const getEnv = window['SLM']['theme-shared/utils/get-env.js'].default;
  const { loadScript } = window['SLM']['theme-shared/biz-com/customer/utils/loadScript.js'];
  const config = {
    DF_SDK_URL_OSS: 'https://r2cdn.myshopline.cn/static/rs/adff/prod/latest/bundle.iife.js',
    DF_SDK_URL_S3: 'https://r2cdn.myshopline.com/static/rs/adff/prod/latest/bundle.iife.js',
    IS_MAINLAND: false,
    APP_ENV: getEnv().APP_ENV || 'product',
    DF_APP_CODE: 'm3tdgo',
    PUBLICKEY: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDFOkIm2U9Gn1fMq3cA5RUB9dG7LTIjt8lC3udJL75EzuclO2/GhHLVnVIbXnaBhBkCvYqDmwWJDyzWh2Uaor1VFeAtOuFAmqFWFc/JXS1MosLusO8HSHT1qUWLmkefU+BCf77rVPD7kBdXgWds2pLhB0sijpP6QdaFZNiVcTuetQIDAQAB'
  };
  const RISK_CONTROL_URL = config.IS_MAINLAND ? config.DF_SDK_URL_OSS : config.DF_SDK_URL_S3;
  let dfInstance = null;
  let checker = null;
  const riskHumanToken = {};
  const initRiskHumanToken = () => {
    checker = window.DeviceFingerprint.mmc({
      env: 'same_domain',
      publicKey: config.PUBLICKEY,
      timeout: 500
    });
  };
  const loadRiskControl = () => {
    if (dfInstance) {
      return Promise.resolve(dfInstance);
    }
    return loadScript(RISK_CONTROL_URL).then(() => {
      dfInstance = window.DeviceFingerprint && window.DeviceFingerprint({
        env: 'same_domain',
        appCode: config.DF_APP_CODE
      });
      initRiskHumanToken();
      return dfInstance;
    });
  };
  _exports.loadRiskControl = loadRiskControl;
  const addRiskHumanToken = (btnId, tokenKey) => {
    if (checker) {
      checker.listen(btnId, token => {
        riskHumanToken[tokenKey] = token;
      });
    }
  };
  _exports.addRiskHumanToken = addRiskHumanToken;
  const getRiskHumanToken = (tokenKey, n = 0) => {
    return new Promise(resolve => {
      if (riskHumanToken[tokenKey]) {
        resolve(riskHumanToken[tokenKey]);
        riskHumanToken[tokenKey] = null;
      } else {
        setTimeout(() => {
          if (n > 10) return resolve(null);
          getRiskHumanToken(tokenKey, n + 1).then(res => {
            resolve(res);
            riskHumanToken[tokenKey] = null;
          });
        }, 60);
      }
    });
  };
  _exports.getRiskHumanToken = getRiskHumanToken;
  const getRiskControlToken = () => {
    return loadRiskControl().then(df => {
      return df && df.getToken();
    });
  };
  _exports.getRiskControlToken = getRiskControlToken;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/helpers/cookie.js'] = window.SLM['theme-shared/biz-com/customer/helpers/cookie.js'] || function () {
  const _exports = {};
  const getCookie = key => {
    return window && window.SL_State && window.SL_State.get(`request.cookie.${key}`);
  };
  _exports.getCookie = getCookie;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/utils/storage.js'] = window.SLM['theme-shared/biz-com/customer/utils/storage.js'] || function () {
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
window.SLM['theme-shared/biz-com/customer/commons/customer/getUdbInfo.js'] = window.SLM['theme-shared/biz-com/customer/commons/customer/getUdbInfo.js'] || function () {
  const _exports = {};
  const { getLoginInitConfig, getMemberInitConfig, getDeleteAccountInitConfig, getRetrieveInitConfig, getActivateTokenInitConfig, getRetrieveTokenInitConfig, getActivateCodeInitConfig } = window['SLM']['theme-shared/biz-com/customer/service/index.js'];
  const { getMethodList, passVerify } = window['SLM']['theme-shared/biz-com/customer/service/common.js'];
  const { getBindEmailInitConfig, getBindPhoneInitConfig } = window['SLM']['theme-shared/biz-com/customer/service/bind.js'];
  const { getChangePasswordInitConfig } = window['SLM']['theme-shared/biz-com/customer/service/reset.js'];
  const { getRiskControlToken } = window['SLM']['theme-shared/biz-com/customer/helpers/riskControl.js'];
  const { getCookie } = window['SLM']['theme-shared/biz-com/customer/helpers/cookie.js'];
  const { TOKEN_ERROR_CODE, ACCOUNT_ACTIVATED_CODE } = window['SLM']['theme-shared/biz-com/customer/constant/errorCode.js'];
  const { ACCOUNT_ACTIVATED_TOKEN_EXPIRED, RESET_PASSWORD_TOKEN_EXPIRED, ACCOUNT_ACTIVATED } = window['SLM']['theme-shared/biz-com/customer/constant/const.js'];
  const { SIGN_IN } = window['SLM']['theme-shared/biz-com/customer/constant/url.js'];
  const storage = window['SLM']['theme-shared/biz-com/customer/utils/storage.js'].default;
  const { getLanguage, redirectPage } = window['SLM']['theme-shared/biz-com/customer/utils/helper.js'];
  const extLangRequestBody = data => {
    return {
      ...(data || {}),
      lang: getLanguage()
    };
  };
  const getUniversalInitConfig = init => {
    return async params => {
      const {
        stoken,
        data
      } = await init(params);
      const {
        data: {
          methods
        },
        stoken: newStoken
      } = await getMethodList(extLangRequestBody({
        appid: params.appid,
        stoken,
        servcode: data.servcode
      }));
      const {
        method,
        mobileMask,
        emailMask
      } = methods && methods[0] || {};
      let oauth;
      if (method === 'pass') {
        const {
          data: {
            oauthToken
          }
        } = await passVerify(extLangRequestBody({
          appid: params.appid,
          stoken: newStoken
        }));
        oauth = oauthToken;
      }
      return {
        stoken: newStoken || stoken,
        _method: method,
        _mask: mobileMask || emailMask,
        oauthToken: oauth,
        scene: data.scene
      };
    };
  };
  _exports.getUniversalInitConfig = getUniversalInitConfig;
  _exports.default = ({
    params,
    formType,
    FBPixelEventID = ''
  }) => {
    const {
      type,
      appid,
      subappid,
      mode,
      token
    } = params;
    const uid = getCookie('osudb_uid');
    let loginType = 'email';
    let isverify;
    let getInitConfig = null;
    let ticketType;
    let eventid = '';
    if (formType === 'signIn') {
      getInitConfig = getLoginInitConfig;
      loginType = 'email';
      eventid = FBPixelEventID;
      if (type === 'member' && mode !== 'email') {
        loginType = 'acct';
      }
    } else if (formType === 'signUp') {
      if (type === 'member') {
        getInitConfig = getMemberInitConfig;
      }
      eventid = FBPixelEventID;
    } else if (formType === 'activate') {
      if (token) {
        getInitConfig = getActivateTokenInitConfig;
      } else {
        getInitConfig = getMemberInitConfig;
        isverify = 0;
      }
    } else if (formType === 'reset') {
      if (uid) {
        getInitConfig = getUniversalInitConfig(getChangePasswordInitConfig);
        ticketType = '1';
      } else {
        getInitConfig = () => Promise.resolve();
      }
    } else if (formType === 'bind' && type === 'member') {
      if (mode === 'email') {
        getInitConfig = getUniversalInitConfig(getBindEmailInitConfig);
      } else if (mode === 'phone') {
        getInitConfig = getUniversalInitConfig(getBindPhoneInitConfig);
      }
      ticketType = '1';
    } else if (formType === 'passwordNew') {
      getInitConfig = getRetrieveInitConfig;
    } else if (formType === 'passwordNewToken' && token !== 'preview') {
      getInitConfig = getRetrieveTokenInitConfig;
    } else if (formType === 'delete-account') {
      getInitConfig = getUniversalInitConfig(getDeleteAccountInitConfig);
      ticketType = '1';
    } else if (formType === 'activateByCode') {
      getInitConfig = getActivateCodeInitConfig;
    } else {
      getInitConfig = () => Promise.resolve();
    }
    const init = dfptoken => getInitConfig && getInitConfig({
      appid,
      subappid,
      callback: 'js',
      type: loginType,
      isverify,
      token,
      uid,
      ticketType,
      lang: params.language || 'en',
      eventid,
      dfptoken
    }).then(res => {
      const {
        stoken,
        data,
        _mask,
        _method,
        oauthToken,
        scene
      } = res || {};
      return {
        appid,
        subappid,
        stoken,
        servcode: data && data.servcode,
        _mask,
        _method,
        oauthToken,
        scene,
        emailMask: data && data.email
      };
    }).catch(e => {
      if (formType === 'activate') {
        if (ACCOUNT_ACTIVATED_CODE.includes(e.rescode)) {
          storage.sessionStorage.set(ACCOUNT_ACTIVATED, true);
          redirectPage(SIGN_IN);
        } else if (TOKEN_ERROR_CODE.includes(e.rescode)) {
          storage.sessionStorage.set(ACCOUNT_ACTIVATED_TOKEN_EXPIRED, true);
          redirectPage(SIGN_IN);
        }
      } else if (formType === 'passwordNewToken') {
        if (TOKEN_ERROR_CODE.includes(e.rescode)) {
          storage.sessionStorage.set(RESET_PASSWORD_TOKEN_EXPIRED, true);
          redirectPage(SIGN_IN);
        }
      }
    });
    if (['signIn', 'signUp', 'bind', 'reset', 'passwordNew', 'passwordNewToken', 'activate', 'activateByCode'].includes(formType)) {
      const token = window.__DF__ && window.__DF__.getToken();
      if (token) {
        return init(token);
      }
      return getRiskControlToken().then(dfptoken => {
        return init(dfptoken);
      }).catch(() => {
        return init();
      });
    }
    return init();
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/reports/user-report.js'] = window.SLM['theme-shared/biz-com/customer/reports/user-report.js'] || function () {
  const _exports = {};
  const userHdReport = () => {
    const isSignIn = window.location.pathname === '/user/signIn';
    const isSignUp = window.location.pathname === '/user/signUp';
    const isCenter = window.location.pathname === '/user/center';
    const isMessage = window.location.pathname === '/user/message';
    const isOrders = window.location.pathname === '/user/orders';
    const isRefunds = window.location.pathname === '/user/refunds';
    if (isSignIn || isSignUp) {
      window.HdSdk && window.HdSdk.shopTracker.report(60079992, {
        iframe_id: 1,
        page: 'user_page',
        event_name: 'view'
      });
    }
    if (isSignIn) {
      window.HdSdk && window.HdSdk.shopTracker.report(60079992, {
        event_name: 'component_view',
        custom_component: ['sign_in_tab']
      });
    }
    if (isSignUp) {
      window.HdSdk && window.HdSdk.shopTracker.report(60079992, {
        event_name: 'component_view',
        custom_component: ['sign_up_tab']
      });
    }
    if (isCenter) {
      window.HdSdk && window.HdSdk.shopTracker.report(60079999, {
        iframe_id: 1,
        page: 'consumer_home',
        event_name: 'view'
      });
      window.HdSdk && window.HdSdk.shopTracker.report(60079999, {
        event_name: 'component_view',
        custom_component: ['consumer_info']
      });
    }
    if (isMessage) {
      window.HdSdk && window.HdSdk.shopTracker.report(60079999, {
        event_name: 'component_view',
        custom_component: ['message']
      });
    }
    if (isOrders) {
      window.HdSdk && window.HdSdk.shopTracker.report(60079999, {
        event_name: 'component_view',
        custom_component: ['order']
      });
    }
    if (isRefunds) {
      window.HdSdk && window.HdSdk.shopTracker.report(60079999, {
        event_name: 'component_view',
        custom_component: ['return_order']
      });
    }
  };
  _exports.userHdReport = userHdReport;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/commons/customer/base.js'] = window.SLM['theme-shared/biz-com/customer/commons/customer/base.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const { getEventID } = window['SLM']['theme-shared/utils/report/tool.js'];
  const { getLanguage } = window['SLM']['theme-shared/biz-com/customer/utils/helper.js'];
  const { getUrlAllQuery } = window['SLM']['theme-shared/biz-com/customer/utils/url.js'];
  const { getUdbResponseLanguageErrorKey } = window['SLM']['theme-shared/biz-com/customer/helpers/getUdbResponseLanguageErrorKey.js'];
  const { userHdReport } = window['SLM']['theme-shared/biz-com/customer/reports/user-report.js'];
  class BaseCustomer {
    constructor({
      id,
      formType
    }) {
      this.formId = id;
      this.formType = formType;
      this.query = getUrlAllQuery();
      this.eid = getEventID();
      this.pvEventId = window.SL_State.get('serverEventId') || getEventID();
      userHdReport();
    }
    report(eventid, params) {
      window.HdSdk && window.HdSdk.shopTracker.report(eventid, params);
    }
    setError(res) {
      const value = getUdbResponseLanguageErrorKey(res && res.rescode) || res && res.resmsg;
      if (value) {
        $(`#${this.formId} .customer__error`).text(t(value)).show();
      }
    }
    clearError() {
      $(`#${this.formId} .customer__error`).text('').hide();
    }
    formatRequestBody(data) {
      return {
        ...(data || {}),
        lang: getLanguage()
      };
    }
    formatterMask(params) {
      return `${params._method && params._method.includes('sms') ? '+' : ''}${params._mask}`;
    }
    updateToken(params, newParams) {
      Object.keys(newParams).forEach(k => {
        const v = newParams[k];
        if (v) {
          params[k] = v;
        }
      });
    }
  }
  _exports.default = BaseCustomer;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/reports/sign-in.js'] = window.SLM['theme-shared/biz-com/customer/reports/sign-in.js'] || function () {
  const _exports = {};
  const dayjs = window['dayjs']['default'];
  const { report, reportV2, thirdPartReport } = window['SLM']['theme-shared/biz-com/customer/reports/index.js'];
  const { pageMap, ActionType, Module, LOGIN_CID, EventName } = window['SLM']['theme-shared/biz-com/customer/constant/report.js'];
  const reportV1SignIn = config => report(LOGIN_CID, config);
  const reportSignIn = config => reportV2({
    page: pageMap.SignIn,
    ...config
  });
  const reportSubmitLogin = () => {
    reportSignIn({
      module: Module.normal,
      component: 127,
      action_type: ActionType.click,
      event_id: 1033
    });
  };
  _exports.reportSubmitLogin = reportSubmitLogin;
  const reportToForgetPassword = () => {
    reportSignIn({
      module: Module.normal,
      component: 125,
      action_type: ActionType.click,
      event_id: 1031
    });
  };
  _exports.reportToForgetPassword = reportToForgetPassword;
  const reportToSignUp = () => {
    reportSignIn({
      module: Module.normal,
      component: 126,
      action_type: ActionType.click,
      event_id: 1032
    });
  };
  _exports.reportToSignUp = reportToSignUp;
  const reportLoginSuccess = () => {
    reportSignIn({
      module: Module.normal,
      component: -999,
      action_type: ActionType.default,
      event_name: EventName.login,
      event_id: 1402
    });
  };
  _exports.reportLoginSuccess = reportLoginSuccess;
  const loginTypeToThirdPartReportConfig = {
    line: {
      component: 105,
      event_id: 1407
    },
    facebook: {
      component: 104,
      event_id: 1406
    },
    google: {
      component: 103,
      event_id: 1405
    }
  };
  const reportClickThirdPartLogin = loginType => {
    const reportConfig = loginTypeToThirdPartReportConfig[loginType];
    if (reportConfig) {
      reportSignIn({
        module: Module.normal,
        action_type: ActionType.click,
        ...reportConfig
      });
    }
  };
  _exports.reportClickThirdPartLogin = reportClickThirdPartLogin;
  const thirdReportSignInCallback = method => {
    thirdPartReport({
      GA: [['event', 'login', {
        method
      }]],
      GA4: [['event', 'login', {
        method
      }]]
    });
  };
  _exports.thirdReportSignInCallback = thirdReportSignInCallback;
  const riskReportSignIn = (isFirst = 1) => {
    const loginSuccessReportdata = {
      dimension: 0,
      subAppid: window && window.SL_State && window.SL_State.get('request.cookie.osudb_subappid'),
      termType: 0,
      uidIdentity: 'shopline',
      loginTime: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      loginResult: 1,
      isFirst
    };
    reportV1SignIn({
      event_name: 'login_success',
      ...loginSuccessReportdata
    });
  };
  _exports.riskReportSignIn = riskReportSignIn;
  const reportSignInPageView = () => {
    reportV1SignIn({
      event_name: 'component_view',
      custom_component: ['sign_in_105']
    });
  };
  _exports.reportSignInPageView = reportSignInPageView;
  const reportSignInPageLeave = page_dest => {
    reportV1SignIn({
      event_name: 'leave',
      page_dest
    });
  };
  _exports.reportSignInPageLeave = reportSignInPageLeave;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/reports/sign-up.js'] = window.SLM['theme-shared/biz-com/customer/reports/sign-up.js'] || function () {
  const _exports = {};
  const { report, reportV2, thirdPartReport } = window['SLM']['theme-shared/biz-com/customer/reports/index.js'];
  const { pageMap, ActionType, Module, LOGIN_CID, EventName } = window['SLM']['theme-shared/biz-com/customer/constant/report.js'];
  const reportV1SignUp = config => report(LOGIN_CID, config);
  const reportSignUp = config => reportV2({
    page: pageMap.SignUp,
    ...config
  });
  const reportRegisterToLogin = () => {
    reportSignUp({
      module: Module.normal,
      component: 129,
      action_type: ActionType.click,
      event_id: 1037
    });
  };
  _exports.reportRegisterToLogin = reportRegisterToLogin;
  const reportSignUpSuccess = () => {
    reportSignUp({
      module: Module.normal,
      component: -999,
      action_type: ActionType.default,
      event_name: EventName.register,
      event_id: 1394
    });
  };
  _exports.reportSignUpSuccess = reportSignUpSuccess;
  const reportCheckAgreement = () => {
    reportSignUp({
      module: Module.normal,
      component: 128,
      action_type: ActionType.check,
      event_id: 1036
    });
  };
  _exports.reportCheckAgreement = reportCheckAgreement;
  const reportClickPrivacyPolicy = () => {
    reportSignUp({
      module: Module.normal,
      component: 131,
      action_type: ActionType.click,
      event_id: 1039
    });
  };
  _exports.reportClickPrivacyPolicy = reportClickPrivacyPolicy;
  const reportClickTermsService = () => {
    reportSignUp({
      module: Module.normal,
      component: 132,
      action_type: ActionType.click,
      event_id: 1040
    });
  };
  _exports.reportClickTermsService = reportClickTermsService;
  const reportCheckSubscriptionBox = () => {
    reportSignUp({
      module: Module.normal,
      component: 102,
      action_type: ActionType.check,
      event_id: 1396
    });
  };
  _exports.reportCheckSubscriptionBox = reportCheckSubscriptionBox;
  const thirdReportSignUpSuccess = (eid, method) => {
    const userId = window && window.SL_State && window.SL_State.get('request.cookie.osudb_uid');
    thirdPartReport({
      FBPixel: [['track', 'CompleteRegistration', {
        content_name: userId
      }, {
        eventID: `completeRegistration${eid}`
      }]],
      GAAds: [['event', 'conversion', null, 'REGISTER-MEMBER']],
      GA: [['event', 'sign_up', {
        method
      }]],
      GA4: [['event', 'sign_up', {
        method
      }]]
    });
  };
  _exports.thirdReportSignUpSuccess = thirdReportSignUpSuccess;
  const reportSignUpPageView = () => {
    reportV1SignUp({
      event_name: 'component_view',
      custom_component: ['sign_up']
    });
  };
  _exports.reportSignUpPageView = reportSignUpPageView;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/reports/login-modal.js'] = window.SLM['theme-shared/biz-com/customer/reports/login-modal.js'] || function () {
  const _exports = {};
  const { reportV2 } = window['SLM']['theme-shared/biz-com/customer/reports/index.js'];
  const { pageMap, ActionType, Module, loginModalPageIdMap, EventName } = window['SLM']['theme-shared/biz-com/customer/constant/report.js'];
  const reportLoginModal = config => reportV2({
    page: pageMap.LoginModal,
    ...config
  });
  const reportPageView = () => {
    const alias = window.SL_State.get('templateAlias');
    if (loginModalPageIdMap[alias]) {
      reportV2({
        page: loginModalPageIdMap[alias],
        module: Module.normal,
        component: -999,
        action_type: ActionType.view,
        event_id: 1415
      });
    }
  };
  _exports.reportPageView = reportPageView;
  const reportSignUpSuccess = () => {
    reportLoginModal({
      module: Module.loginModal.register,
      component: -999,
      action_type: ActionType.default,
      event_name: EventName.register,
      event_id: 1416
    });
  };
  _exports.reportSignUpSuccess = reportSignUpSuccess;
  const reportCheckAgreement = () => {
    reportLoginModal({
      module: Module.loginModal.register,
      component: 101,
      action_type: ActionType.check,
      event_id: 1417
    });
  };
  _exports.reportCheckAgreement = reportCheckAgreement;
  const reportCheckSubscriptionBox = () => {
    reportLoginModal({
      module: Module.loginModal.register,
      component: 102,
      action_type: ActionType.check,
      event_id: 1418
    });
  };
  _exports.reportCheckSubscriptionBox = reportCheckSubscriptionBox;
  const reportClickPrivacyPolicy = () => {
    reportLoginModal({
      module: Module.loginModal.register,
      component: 103,
      action_type: ActionType.click,
      event_id: 1419
    });
  };
  _exports.reportClickPrivacyPolicy = reportClickPrivacyPolicy;
  const reportClickTermsService = () => {
    reportLoginModal({
      module: Module.loginModal.register,
      component: 104,
      action_type: ActionType.click,
      event_id: 1420
    });
  };
  _exports.reportClickTermsService = reportClickTermsService;
  const reportLoginSuccess = () => {
    reportLoginModal({
      module: Module.loginModal.login,
      component: -999,
      action_type: ActionType.default,
      event_name: EventName.login,
      event_id: 1421
    });
  };
  _exports.reportLoginSuccess = reportLoginSuccess;
  const reportToForgetPassword = () => {
    reportLoginModal({
      module: Module.loginModal.login,
      component: 105,
      action_type: ActionType.click,
      event_id: 1422
    });
  };
  _exports.reportToForgetPassword = reportToForgetPassword;
  const loginTypeToThirdPartReportConfig = {
    line: {
      component: 108,
      event_id: 1425
    },
    facebook: {
      component: 107,
      event_id: 1424
    },
    google: {
      component: 106,
      event_id: 1423
    }
  };
  const reportClickThirdPartLogin = loginType => {
    const reportConfig = loginTypeToThirdPartReportConfig[loginType];
    if (reportConfig) {
      reportLoginModal({
        module: Module.loginModal.login,
        action_type: ActionType.click,
        ...reportConfig
      });
    }
  };
  _exports.reportClickThirdPartLogin = reportClickThirdPartLogin;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/reports/login-register.js'] = window.SLM['theme-shared/biz-com/customer/reports/login-register.js'] || function () {
  const _exports = {};
  const login = window['SLM']['theme-shared/biz-com/customer/reports/sign-in.js'];
  const register = window['SLM']['theme-shared/biz-com/customer/reports/sign-up.js'];
  const loginModal = window['SLM']['theme-shared/biz-com/customer/reports/login-modal.js'];
  _exports.default = isLoginModal => {
    if (isLoginModal) {
      return {
        ...loginModal
      };
    }
    return {
      ...login,
      ...register
    };
  };
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/commons/customer/index.js'] = window.SLM['theme-shared/biz-com/customer/commons/customer/index.js'] || function () {
  const _exports = {};
  const initConfig = window['SLM']['theme-shared/biz-com/customer/commons/customer/init.js'].default;
  const getUdbInfo = window['SLM']['theme-shared/biz-com/customer/commons/customer/getUdbInfo.js'].default;
  const BaseCustomer = window['SLM']['theme-shared/biz-com/customer/commons/customer/base.js'].default;
  const reports = window['SLM']['theme-shared/biz-com/customer/reports/login-register.js'].default;
  class Customer extends BaseCustomer {
    constructor({
      id,
      formType,
      isModal,
      success,
      error
    }) {
      super({
        id,
        formType
      });
      this.isModal = isModal;
      this.success = success;
      this.error = error;
      this.$$reports = reports(isModal);
      this.UDBParams = {};
      this.configs = initConfig();
      setTimeout(() => this.initCustomer(), 0);
    }
    initCustomer() {
      this.beforeCreate && this.beforeCreate();
      this.getCustomerConfig().then(res => {
        this.UDBParams = res;
        this.init && this.init();
      });
    }
    async getCustomerConfig() {
      const {
        mode,
        token
      } = this.query;
      let queryParams = {
        ...this.configs,
        token
      };
      if (mode) {
        queryParams = {
          ...queryParams,
          mode
        };
      }
      return getUdbInfo({
        params: queryParams,
        formType: this.formType,
        FBPixelEventID: this.pvEventId
      });
    }
  }
  _exports.default = Customer;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/biz/password-new/password-set.js'] = window.SLM['theme-shared/biz-com/customer/biz/password-new/password-set.js'] || function () {
  const _exports = {};
  const { getUdbErrorMessage } = window['SLM']['theme-shared/biz-com/customer/helpers/getUdbResponseLanguageErrorKey.js'];
  const getFormFields = window['SLM']['theme-shared/biz-com/customer/helpers/getFormFields.js'].default;
  const Form = window['SLM']['theme-shared/biz-com/customer/commons/form/index.js'].default;
  const Customer = window['SLM']['theme-shared/biz-com/customer/commons/customer/index.js'].default;
  class PasswordSet extends Customer {
    constructor({
      id,
      onSubmit
    }) {
      super({
        id,
        formType: 'passwordNewReset'
      });
      this.passwordForm = null;
      this.onSubmit = onSubmit;
    }
    init() {
      this.passwordForm = new Form({
        id: this.formId,
        fields: this.getFieldConfigs(),
        onSubmit: data => this.onSubmit(data).then(res => {
          return Promise.resolve(res);
        }).catch(error => {
          this.passwordForm && this.passwordForm.formInstance.setErrMsgIntoDom([{
            name: 'repeatPassword',
            messages: [getUdbErrorMessage(error)]
          }]);
          return Promise.reject(error);
        })
      });
    }
    getFieldConfigs() {
      const fieldTypes = ['password', 'repeatPassword'];
      return getFormFields(fieldTypes);
    }
  }
  _exports.default = PasswordSet;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/biz/password-new/password-verify.js'] = window.SLM['theme-shared/biz-com/customer/biz/password-new/password-verify.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const { getUdbErrorMessage } = window['SLM']['theme-shared/biz-com/customer/helpers/getUdbResponseLanguageErrorKey.js'];
  const { getRetrievePrechk, getMethodList, sendPhoneVerificationCode, sendEmailVerificationCode, verifyPhoneVerificationCode, verifyEmailVerificationCode, resetPassword, queryUserStatus, getActivateCodePrechk, activateAccountByCode, signUpUpdate, updateUserInfo } = window['SLM']['theme-shared/biz-com/customer/service/index.js'];
  const { HOME, SIGN_IN } = window['SLM']['theme-shared/biz-com/customer/constant/url.js'];
  const getFormFields = window['SLM']['theme-shared/biz-com/customer/helpers/getFormFields.js'].default;
  const { getAccountFieldType, repeatPasswordRules } = window['SLM']['theme-shared/biz-com/customer/helpers/getFormFields.js'];
  const { reportForgetPasswordToLogin, reportResetPasswordToLogin } = window['SLM']['theme-shared/biz-com/customer/reports/password.js'];
  const { wrapArmorCaptcha } = window['SLM']['theme-shared/biz-com/customer/commons/captcha-modal/index.js'];
  const Form = window['SLM']['theme-shared/biz-com/customer/commons/form/index.js'].default;
  const Customer = window['SLM']['theme-shared/biz-com/customer/commons/customer/index.js'].default;
  const PasswordSet = window['SLM']['theme-shared/biz-com/customer/biz/password-new/password-set.js'].default;
  const { redirectTo } = window['SLM']['theme-shared/biz-com/customer/helpers/format.js'];
  const { MEMBER_PASSWORD_PATTERN } = window['SLM']['theme-shared/biz-com/customer/constant/pattern.js'];
  const { getLanguage, redirectPage } = window['SLM']['theme-shared/biz-com/customer/utils/helper.js'];
  class PasswordNew extends Customer {
    constructor({
      id,
      containerId,
      setFormId
    }) {
      super({
        id,
        formType: 'passwordNew'
      });
      this.containerId = containerId;
      this.setFormId = setFormId;
      this.passwordForm = null;
      this.needActivate = false;
      this.firstActive = true;
      this.activationTag = window.SL_State && window.SL_State.get('shop.store_register_config.activationTag');
      this.codeSend = false;
    }
    init() {
      this.passwordForm = new Form({
        id: this.formId,
        fields: this.getFieldConfigs(),
        onSubmit: data => this.onSubmit(data)
      });
      this.bindEvents();
      $(`#${this.containerId} .password__buttons a`).click(() => {
        const display = $(`#${this.formId}`).css('display');
        if (display !== 'none') {
          reportForgetPasswordToLogin();
        } else {
          reportResetPasswordToLogin();
        }
      });
    }
    getFieldConfigs() {
      const {
        mode
      } = this.configs;
      const accountFieldType = getAccountFieldType(mode);
      const fieldTypes = [accountFieldType, {
        type: 'password',
        rules: [{
          validator: v => {
            return !(this.needActivate && !v);
          },
          message: t('customer.general.password_empty_hint'),
          required: true
        }, {
          message: t('customer.general.set_password'),
          pattern: MEMBER_PASSWORD_PATTERN
        }]
      }, {
        type: 'repeatPassword',
        rules: [{
          validator: v => {
            return !(this.needActivate && !v);
          },
          message: t('customer.general.send_verification_code_hint'),
          required: true
        }, ...repeatPasswordRules]
      }, {
        type: 'verifycode',
        on: {
          send: () => this.sendVerifyCode()
        },
        watch: [accountFieldType]
      }];
      return getFormFields(fieldTypes);
    }
    bindEvents() {
      this.passwordForm && this.passwordForm.formInstance && this.passwordForm.formInstance.on('valuesChange', () => {
        this.clearError();
      });
    }
    async sendVerifyCode() {
      const {
        mode
      } = this.configs;
      const {
        UDBParams
      } = this;
      if (!mode) {
        return;
      }
      const formValue = this.passwordForm && this.passwordForm.getFormValue();
      const account = formValue[mode];
      if (this.activationTag && !this.needActivate) {
        const {
          data
        } = await queryUserStatus(super.formatRequestBody({
          ...UDBParams,
          account
        }));
        if (data && data.status === '2') {
          $(`#${this.containerId} .customer__title`).text(t('customer.activate.normal_title'));
          $(`#${this.formId} .submit-button`).text(t('customer.activate.button'));
          $(`#${this.formId} .password-reset__password`).show();
          this.needActivate = true;
          this.formType = 'activateByCode';
          const {
            stoken
          } = await this.getCustomerConfig();
          super.updateToken(UDBParams, {
            stoken
          });
        }
      }
      const preCheckFunc = this.needActivate ? getActivateCodePrechk : getRetrievePrechk;
      await wrapArmorCaptcha({
        captchaScene: 'COldForgetPwdMsg',
        beforeCapture: async () => {
          const {
            stoken,
            data
          } = await preCheckFunc(super.formatRequestBody({
            ...UDBParams,
            account
          }));
          super.updateToken(UDBParams, {
            stoken,
            servcode: data && data.servcode
          });
          const {
            data: {
              methods
            },
            stoken: newStoken
          } = await getMethodList(super.formatRequestBody(UDBParams));
          const {
            method,
            mobileMask,
            emailMask
          } = methods && methods[0] || {};
          super.updateToken(UDBParams, {
            stoken: newStoken,
            _method: method,
            _mask: mobileMask || emailMask
          });
        },
        onCaptureCaptcha: async (captchaToken, _, serialNo) => {
          const sendCodeFn = UDBParams._method && UDBParams._method.includes('sms') ? sendPhoneVerificationCode : sendEmailVerificationCode;
          const {
            stoken: lastStoken
          } = await sendCodeFn(super.formatRequestBody({
            ...UDBParams,
            captcha: captchaToken,
            serialNo
          }));
          this.codeSend = true;
          if (this.needActivate) {
            $(`#${this.containerId} .password-reset-tips`).text(t('customer.general.sign_in_activate', {
              account: UDBParams._mask
            }));
          }
          super.updateToken(UDBParams, {
            stoken: lastStoken
          });
        },
        onCaptchaVerifySuccess: async () => {
          this.passwordForm.formItemInstances.verifycode.triggerSendCode();
        }
      });
    }
    initSetForm() {
      $(`#${this.formId}`).hide();
      const passwordSetForm = new PasswordSet({
        id: this.setFormId,
        onSubmit: data => this.onResetConfirm(data)
      });
      $(`#${this.containerId}`).find('.password-reset-tips').text(t('customer.forget_password.tips_reset_password', {
        account: this.formatterMask(this.UDBParams)
      }));
      $(`#${passwordSetForm.formId}`).show();
    }
    onResetConfirm(data) {
      return resetPassword(super.formatRequestBody({
        ...this.UDBParams,
        pwd: data.password
      })).then(() => {
        window.location.href = redirectTo(`${SIGN_IN}${window.location.search}`);
        return Promise.resolve();
      }).catch(error => {
        return Promise.reject(error);
      });
    }
    onSubmit() {
      const {
        UDBParams
      } = this;
      const data = this.passwordForm && this.passwordForm.getFormValue();
      const {
        verifycode,
        password
      } = data;
      if (!this.codeSend) {
        const error = {
          message: t('customer.general.send_error')
        };
        this.passwordForm && this.passwordForm.formInstance.setErrMsgIntoDom([{
          name: 'verifycode',
          messages: [getUdbErrorMessage(error)]
        }]);
        return Promise.reject(error);
      }
      if (UDBParams.stoken) {
        if (this.needActivate) {
          const onActive = (captchaToken, updateParams = {}, serialNo = '') => {
            const formData = this.passwordForm && this.passwordForm.getFormValue();
            const {
              mode
            } = this.configs;
            return activateAccountByCode(super.formatRequestBody({
              ...this.UDBParams,
              acct: formData[mode],
              pwd: password,
              captcha: captchaToken,
              stoken: updateParams.stoken || this.UDBParams.stoken,
              verifycode: formData.verifycode,
              serialNo
            })).then(() => {
              const requestBody = {
                language: getLanguage(),
                udbFirstLogin: true
              };
              return Promise.all([signUpUpdate(requestBody), updateUserInfo()]).then(() => {
                redirectPage(HOME);
              });
            });
          };
          return wrapArmorCaptcha({
            captchaScene: 'COldForgetPwdMsg',
            cleanCaptcha: this.firstActive,
            onCaptureCaptcha: onActive,
            onCaptchaVerifySuccess: (captchaToken, prevRequestResult, serialNo) => {
              this.firstActive = false;
              onActive(captchaToken, {
                stoken: prevRequestResult && prevRequestResult.stoken
              }, serialNo);
            },
            onError: e => {
              this.setError(e);
            }
          }).catch(e => {
            this.setError(e);
          });
        }
        const verifyCodeFn = UDBParams._method && UDBParams._method.includes('sms') ? verifyPhoneVerificationCode : verifyEmailVerificationCode;
        return verifyCodeFn(super.formatRequestBody({
          ...UDBParams,
          code: verifycode
        })).then(({
          stoken,
          data
        }) => {
          super.updateToken(UDBParams, {
            stoken,
            oauthToken: data && data.oauthToken
          });
          this.initSetForm();
          return Promise.resolve();
        }).catch(error => {
          this.passwordForm && this.passwordForm.formInstance.setErrMsgIntoDom([{
            name: 'verifycode',
            messages: [getUdbErrorMessage(error)]
          }]);
          return Promise.reject(error);
        });
      }
    }
  }
  _exports.default = PasswordNew;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/biz/password-new/password-token.js'] = window.SLM['theme-shared/biz-com/customer/biz/password-new/password-token.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const { TOKEN_ERROR_CODE } = window['SLM']['theme-shared/biz-com/customer/constant/errorCode.js'];
  const { resetPasswordByToken } = window['SLM']['theme-shared/biz-com/customer/service/index.js'];
  const Customer = window['SLM']['theme-shared/biz-com/customer/commons/customer/index.js'].default;
  const PasswordSet = window['SLM']['theme-shared/biz-com/customer/biz/password-new/password-set.js'].default;
  const storage = window['SLM']['theme-shared/biz-com/customer/utils/storage.js'].default;
  const { RESET_PASSWORD_TOKEN_EXPIRED } = window['SLM']['theme-shared/biz-com/customer/constant/const.js'];
  const { SIGN_IN, USER_CENTER } = window['SLM']['theme-shared/biz-com/customer/constant/url.js'];
  const { redirectPage } = window['SLM']['theme-shared/biz-com/customer/utils/helper.js'];
  class PasswordToken extends Customer {
    constructor({
      id,
      containerId,
      setFormId
    }) {
      super({
        id,
        formType: 'passwordNewToken'
      });
      this.containerId = containerId;
      this.setFormId = setFormId;
      this.setInstance = null;
    }
    onResetConfirm(data) {
      return resetPasswordByToken({
        ...this.UDBParams,
        pwd: data.password
      }).then(() => {
        redirectPage(USER_CENTER);
        return Promise.resolve();
      }).catch(e => {
        if (TOKEN_ERROR_CODE.includes(e.rescode)) {
          storage.sessionStorage.set(RESET_PASSWORD_TOKEN_EXPIRED, true);
          redirectPage(SIGN_IN);
        }
        return Promise.reject(e);
      });
    }
    init() {
      this.setInstance = new PasswordSet({
        id: this.setFormId,
        onSubmit: data => {
          if (this.query.token === 'preview') {
            return Promise.resolve();
          }
          return this.onResetConfirm(data);
        }
      });
      $(`#${this.containerId}`).find('.password-reset-tips').text(t('customer.forget_password.tips_reset_password', {
        account: this.UDBParams.emailMask || ''
      }));
    }
  }
  _exports.default = PasswordToken;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/biz/password-new/index.js'] = window.SLM['theme-shared/biz-com/customer/biz/password-new/index.js'] || function () {
  const _exports = {};
  const PasswordVerify = window['SLM']['theme-shared/biz-com/customer/biz/password-new/password-verify.js'].default;
  const PasswordToken = window['SLM']['theme-shared/biz-com/customer/biz/password-new/password-token.js'].default;
  class PasswordNew {
    constructor({
      id = 'customer-password'
    }) {
      this.id = `${id}-verify`;
      this.containerId = id;
      this.setFormId = `${id}-set`;
      this.verifyInstance = null;
      this.tokenInstance = null;
      this.token = window.SL_State.get('request.uri.query.token');
      this.init();
    }
    init() {
      if (this.token) {
        this.tokenInstance = new PasswordToken({
          id: this.id,
          containerId: this.containerId,
          setFormId: this.setFormId
        });
      } else {
        this.verifyInstance = new PasswordVerify({
          id: this.id,
          containerId: this.containerId,
          setFormId: this.setFormId
        });
      }
    }
  }
  _exports.default = PasswordNew;
  return _exports;
}();
window.SLM = window.SLM || {};
window.SLM['customer/password-new/main.js'] = window.SLM['customer/password-new/main.js'] || function () {
  const _exports = {};
  const PasswordNew = window['SLM']['theme-shared/biz-com/customer/biz/password-new/index.js'].default;
  $(function () {
    if (!document.getElementById('customer-password')) {
      return false;
    }
    new PasswordNew({
      id: 'customer-password'
    });
  });
  return _exports;
}();