import request from '@/utils/request'

// 查询生产计划列表
export function listPlan(query) {
  return request({
    url: '/mes/plan/list',
    method: 'get',
    params: query
  })
}

// 查询生产计划详细
export function getPlan(id) {
  return request({
    url: '/mes/plan/' + id,
    method: 'get'
  })
}

// 新增生产计划（保存）
export function addPlan(data) {
  return request({
    url: '/mes/plan',
    method: 'post',
    data: data
  })
}

// 修改生产计划（保存）
export function updatePlan(data) {
  return request({
    url: '/mes/plan',
    method: 'put',
    data: data
  })
}

// 删除生产计划
export function delPlan(id) {
  return request({
    url: '/mes/plan/' + id,
    method: 'delete'
  })
}
// 获取项目维护
export function getMaintenance() {
  return request({
    url: '/mes/maintenance/getList',
    method: 'get'
  })
}

// 获取销售订单
export function getOrderList(query) {
  return request({
    url: '/scm/order/getList',
    method: 'get',
    params: query
  })
}

// 提交生产计划
export function submitPlan(data) {
  return request({
    url: '/mes/plan/submit',
    method: 'put',
    data: data
  })
}

// 生产计划审核
export function approvePlan(data) {
  return request({
    url: '/mes/plan/approve',
    method: 'put',
    data: data
  })
}