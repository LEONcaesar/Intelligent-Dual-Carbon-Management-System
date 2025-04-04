import request from '@/utils/request'

// 查询Bom列表
export function listBom(query) {
  return request({
    url: '/mes/bom/list',
    method: 'get',
    params: query
  })
}

// 查询Bom详细
export function getBom(id) {
  return request({
    url: '/mes/bom/' + id,
    method: 'get'
  })
}

// 新增Bom
export function addBom(data) {
  return request({
    url: '/mes/bom',
    method: 'post',
    data: data
  })
}

// 修改Bom
export function updateBom(data) {
  return request({
    url: '/mes/bom',
    method: 'put',
    data: data
  })
}

// 删除Bom
export function delBom(id) {
  return request({
    url: '/mes/bom/' + id,
    method: 'delete'
  })
}
