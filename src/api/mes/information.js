import request from '@/utils/request'

// 查询设备信息列表
export function listInformation(query) {
  return request({
    url: '/mes/information/list',
    method: 'get',
    params: query
  })
}

// 查询设备信息详细
export function getInformation(id) {
  return request({
    url: '/mes/information/' + id,
    method: 'get'
  })
}

// 新增设备信息
export function addInformation(data) {
  return request({
    url: '/mes/information',
    method: 'post',
    data: data
  })
}

// 修改设备信息
export function updateInformation(data) {
  return request({
    url: '/mes/information',
    method: 'put',
    data: data
  })
}

// 删除设备信息
export function delInformation(id) {
  return request({
    url: '/mes/information/' + id,
    method: 'delete'
  })
}
