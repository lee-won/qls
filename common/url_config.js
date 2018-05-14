//const BASIC_URL = 'https://www.banmaso.com/api/'
const BASIC_URL = 'http://192.168.50.106:8000/api/'
const URL = {
  LOGIN_URL : BASIC_URL + 'course/miniapp/login/',
  LIST_URL: BASIC_URL + 'course/search/',
  DETAIL_URL: BASIC_URL + 'course/detail/',
  SHARE_URL: BASIC_URL + 'article/miniapp/share/',
  BUY_URL: BASIC_URL + 'course/buy/',
  BUY_RECORD_URL: BASIC_URL + 'course/buy/record/',
  SEND_MESSAGE_URL: BASIC_URL + 'send-message/',
  SAVE_PHONE_URL: BASIC_URL + 'save-phone/', 
  BASIC_URL: 'http://192.168.50.106:8000'
}
module.exports = URL