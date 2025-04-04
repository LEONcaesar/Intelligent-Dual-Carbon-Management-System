import request from '@/utils/request'

// 查询库存明细报表列表
export function listInventoryDetails(query) {
  return request({
    url: '/carbonReport/materialInventoryDetails/list',
    method: 'get',
    params: query
  })
}

// 查询库存明细报表详细
export function getInventoryDetails(id) {
  return request({
    url: '/wms/inventoryDetails/' + id,
    method: 'get'
  })
}

// 新增库存明细报表
export function addInventoryDetails(data) {
  return request({
    url: '/wms/inventoryDetails',
    method: 'post',
    data: data
  })
}

// 修改库存明细报表
export function updateInventoryDetails(data) {
  return request({
    url: '/wms/inventoryDetails',
    method: 'put',
    data: data
  })
}

// 删除库存明细报表
export function delInventoryDetails(id) {
  return request({
    url: '/wms/inventoryDetails/' + id,
    method: 'delete'
  })
}

// 查询仓库列表不分页
export function listWarehouse() {
  return request({
    url: '/wms/warehouse/warehouseList',
    method: 'get',
  })
}

// 查询仓库详细
export function getWarehouse(id) {
  return request({
    url: '/wms/warehouse/' + id,
    method: 'get'
  })
}

// 查询库区详细
export function getArea(id) {
  return request({
    url: '/wms/area/' + id,
    method: 'get'
  })
}
