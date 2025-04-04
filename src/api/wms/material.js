import request from '@/utils/request'

// 查询物料档案列表
export function listMaterial(query) {
  return request({
    url: '/wms/material/list',
    method: 'get',
    params: query
  })
}

// 查询物料档案详细
export function getMaterial(id) {
  return request({
    url: '/wms/material/' + id,
    method: 'get'
  })
}

// 新增物料档案
export function addMaterial(data) {
  return request({
    url: '/wms/material',
    method: 'post',
    data: data
  })
}

// 修改物料档案
export function updateMaterial(data) {
  return request({
    url: '/wms/material',
    method: 'put',
    data: data
  })
}

// 删除物料档案
export function delMaterial(id) {
  return request({
    url: '/wms/material/' + id,
    method: 'delete'
  })
}

// 查询物料档案下拉树结构
export function classifyTreeSelect() {
  return request({
    url: '/wms/material/classifyTree',
    method: 'get'
  })
}
