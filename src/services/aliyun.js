// import { stringify } from 'qs';
import request from '../utils/request';
import { api } from '../utils/config';

const { aliyun } = api;

export async function accountatt(params) {
  const url = `${aliyun}/accountatt`
  console.log(url)
  return request({
    method: 'get',
    url,
    data: params,
  })
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