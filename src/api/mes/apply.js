import request from '@/utils/request'

// 查询领料申请列表
export function listApply(query) {
  return request({
    url: '/mes/apply/list',
    method: 'get',
    params: query
  })
}

// 查询领料申请详细
export function getApply(id) {
  return request({
    url: '/mes/apply/' + id,
    method: 'get'
  })
}

// 新增领料申请
export function addApply(data) {
  return request({
    url: '/mes/apply',
    method: 'post',
    data: data
  })
}

// 修改领料申请
export function updateApply(data) {
  return request({
    url: '/mes/apply',
    method: 'put',
    data: data
  })
}

// 删除领料申请
export function delApply(id) {
  return request({
    url: '/mes/apply/' + id,
    method: 'delete'
  })
}

// 提交领料申请
export function submitApply(data) {
  return request({
    url: '/mes/apply/submit',
    method: 'put',
    data: data
  })
}

// 领料申请审核
export function approveApply(data) {
  return request({
    url: '/mes/apply/approve',
    method: 'put',
    data: data
  })
}