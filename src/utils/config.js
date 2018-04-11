const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

module.exports = {
  name: 'IOT-管理平台',
  prefix: 'brcIotAdmin',
  footerText: 'BRC Admin  © 2018 taoqianbao',
  logo: '/assets/logo.svg',
  CORS: [],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  api: {
    aliyun: `${APIV2}/aliyun`,
  },
}
