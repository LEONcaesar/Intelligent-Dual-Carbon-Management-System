import request from '@/utils/request'

// 查询智造双碳-能效预警列表
export function listPrewarning(query) {
  return request({
    url: '/dc/prewarning/list',
    method: 'get',
    params: query
  })
}

// 查询智造双碳-能效预警详细
export function getPrewarning(id) {
  return request({
    url: '/dc/prewarning/' + id,
    method: 'get'
  })
}

// 新增智造双碳-能效预警
export function addPrewarning(data) {
  return request({
    url: '/dc/prewarning',
    method: 'post',
    data: data
  })
}

// 修改智造双碳-能效预警
export function updatePrewarning(data) {
  return request({
    url: '/dc/prewarning',
    method: 'put',
    data: data
  })
}

// 删除智造双碳-能效预警
export function delPrewarning(id) {
  return request({
    url: '/dc/prewarning/' + id,
    method: 'delete'
  })
}