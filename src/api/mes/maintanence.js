import request from '@/utils/request'

// 查询项目维护列表
export function listMaintanence(query) {
  return request({
    url: '/mes/maintenance/list',
    method: 'get',
    params: query
  })
}

// 查询项目维护详细
export function getMaintanence(id) {
  return request({
    url: '/mes/maintenance/' + id,
    method: 'get'
  })
}

// 新增项目维护
export function addMaintanence(data) {
  return request({
    url: '/mes/maintenance',
    method: 'post',
    data: data
  })
}

// 修改项目维护
export function updateMaintanence(data) {
  return request({
    url: '/mes/maintenance',
    method: 'put',
    data: data
  })
}

// 删除项目维护
export function delMaintanence(id) {
  return request({
    url: '/mes/maintenance/' + id,
    method: 'delete'
  })
}