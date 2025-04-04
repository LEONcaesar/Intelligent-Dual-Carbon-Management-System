import request from '@/utils/request'

// 查询采购到货列表
export function listArrival(query) {
  return request({
    url: '/scm/purchase/arrival/list',
    method: 'get',
    params: query
  })
}

// 查询采购到货详细
export function getArrival(id) {
  return request({
    url: '/scm/purchase/arrival/' + id,
    method: 'get'
  })
}

// 新增采购到货
export function addArrival(data) {
  return request({
    url: '/scm/purchase/arrival',
    method: 'post',
    data: data
  })
}

// 修改采购到货
export function updateArrival(data) {
  return request({
    url: '/scm/purchase/arrival',
    method: 'put',
    data: data
  })
}

// 删除采购到货
export function delArrival(id) {
  return request({
    url: '/scm/purchase/arrival/' + id,
    method: 'delete'
  })
}
