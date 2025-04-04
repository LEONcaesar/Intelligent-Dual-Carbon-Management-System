import request from '@/utils/request'

// 查询智能仓储WMS-出库申请列表
export function listOutboundApplication(query) {
  return request({
    url: '/wms/outboundApplication/list',
    method: 'get',
    params: query
  })
}

// 查询智能仓储WMS-出库申请详细
export function getOutboundApplication(id) {
  return request({
    url: '/wms/outboundApplication/' + id,
    method: 'get'
  })
}

// 新增智能仓储WMS-出库申请
export function addOutboundApplication(data) {
  return request({
    url: '/wms/outboundApplication',
    method: 'post',
    data: data
  })
}

// 提交智能仓储WMS-出库申请
export function subOutboundApplication(data) {
  return request({
    url: '/wms/outboundApplication/submit',
    method: 'put',
    data: data
  })
}

// 删除智能仓储WMS-出库申请
export function delOutboundApplication(id) {
  return request({
    url: '/wms/outboundApplication/' + id,
    method: 'delete'
  })
}

// 查询用户列表
export function listUser() {
  return request({
    url: 'system/user/userList',
    method: 'get',
  })
}

// 查询物料列表不分页
export function listMaterial() {
  return request({
    url: '/wms/material/materialList',
    method: 'get',
  })
}
// 修改智能仓储WMS-出库申请
export function updateOutboundApplication(data) {
  return request({
    url: '/wms/outboundApplication',
    method: 'put',
    data: data
  })
}
// 审核智能仓储WMS-出库申请
export function outboundApplication(data) {
  return request({
    url: '/wms/outboundApplication/approve',
    method: 'put',
    data: data
  })
}

// 智能仓储WMS-出库申请-分拣
export function OutBound(data) {
  return request({
    url: '/wms/outboundApplication/outBound',
    method: 'post',
    data: data
  })
}

// 智能仓储WMS-出库申请-盘点
export function outInventoryInfo(data) {
  return request({
    url: '/wms/outboundApplication/outInventoryInfo',
    method: 'post',
    data: data
  })
}


// 智能仓储WMS-出库申请-发货
export function outDelivery(data) {
  return request({
    url: '/wms/outboundApplication/delivery',
    method: 'post',
    data: data
  })
}



