import request from '@/utils/request'

export function apply(data) {
  return request({
    url: 'api/license/apply',
    method: 'post',
    data
  })
}


export function getLicense() {
  return request({
    url: 'api/license/getLicense',
    method: 'get',
  })
}

export function shutdown() {
  return request({
    url: 'api/install',
    method: 'get'
  })
}

export function getSMS(data) {
  return request({
    url: 'api/sendSMS',
    method: 'post',
    data
  })
}
