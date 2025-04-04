import request from '@/utils/request'

// 查询客户档案列表
export function listCustom(query) {
  return request({
    url: '/scm/custom/list',
    method: 'get',
    params: query
  })
}

// 查询客户档案详细
export function getCustom(id) {
  return request({
    url: '/scm/custom/' + id,
    method: 'get'
  })
}

// 新增客户档案
export function addCustom(data) {
  return request({
    url: '/scm/custom',
    method: 'post',
    data: data
  })
}

// 修改客户档案
export function updateCustom(data) {
  return request({
    url: '/scm/custom',
    method: 'put',
    data: data
  })
}

// 删除客户档案
export function delCustom(id) {
  return request({
    url: '/scm/custom/' + id,
    method: 'delete'
  })
}
// 按月统计查询客户对账
export function customBillByMonth(query) {
  return request({
    url: '/carbonReport/saleContract/byMonth',
    method: 'get',
    params: query
  })
}
// 按季度统计查询客户对账
export function customBillByQuarter(query) {
  return request({
    url: '/carbonReport/saleContract/byQuarter',
    method: 'get',
    params: query
  })
}

// 查询客户档案列表(不分页)
export function listCustomList(query) {
  return request({
    url: '/scm/custom/customList',
    method: 'get',
    params: query
  })
}
