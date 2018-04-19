import { stringify } from 'qs';
import request from '../utils/request';
import { api } from '../utils/config';

const { aliyun } = api;

// http://localhost:8000/api/v2/aliyun/iotxAccountListAttr
export async function iotxAccountListAttr(params) {
  const url = `${aliyun}/iotxAccountListAttr`
  return request(url, {
    method: 'get',
    data: params,
  })
}

// https://linkdevelop.aliyun.com/docCenter#/apiDetail/817/1928
// http://localhost:8000/api/v2/aliyun/productInfoListGet
export async function productInfoListGet(params) {
  return request(`${aliyun}/productInfoListGet?${stringify(params)}`)
}

// https://linkdevelop.aliyun.com/docCenter#/apiDetail/817/1929
export async function queryPropertyByProductKey(productKey){
  return request(`${aliyun}/queryPropertyByProductKey?productKey=${productKey}`)
}

export async function setThingProperties(params){
  return request(`${aliyun}/setThingProperties?${stringify(params)}`)
}

export async function getThingProperty(params) {
  return request(`${aliyun}/getThingProperty?${stringify(params)}`)
}

export async function queryDeviceByProductKey(params) {
  return request(`${aliyun}/queryDeviceByProductKey?${stringify(params)}`)
}

// export async function getExample(params) {
//   return request(`/api/get?${stringify(params)}`);
// }

// export async function postExample(params) {
//   return request('/api/post', {
//     method: 'POST',
//     body: params,
//   });
// }