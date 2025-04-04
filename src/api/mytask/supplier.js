import request from '@/utils/request'

// 查询供应链SCM-销售管理-供应商列表
export function listSupplier(query) {
  return request({
    url: '/scm/supplier/list',
    method: 'get',
    params: query
  })
}

// 查询供应链SCM-销售管理-供应商详细
export function getSupplier(id) {
  return request({
    url: '/scm/supplier/' + id,
    method: 'get'
  })
}

// 新增供应链SCM-销售管理-供应商
export function addSupplier(data) {
  return request({
    url: '/scm/supplier',
    method: 'post',
    data: data
  })
}

// 修改供应链SCM-销售管理-供应商
export function updateSupplier(data) {
  return request({
    url: '/scm/supplier',
    method: 'put',
    data: data
  })
}

// 审核供应链SCM-销售管理-供应商
export function approveSupplier(data) {
  return request({
    url: '/scm/supplier/approve',
    method: 'put',
    data: data
  })
}

// 提交供应链SCM-销售管理-供应商
export function subSupplier(data) {
  return request({
    url: '/scm/supplier/submit',
    method: 'put',
    data: data
  })
}

// 删除供应链SCM-销售管理-供应商
export function delSupplier(id) {
  return request({
    url: '/scm/supplier/' + id,
    method: 'delete'
  })
}

//月份统计供应商对账
export function supplierBillByMonth(query) {
  return request({
    url: '/carbonReport/purchasingContract/supplier/byMonth',
    method: 'get',
    params: query
  })
}

//季度统计供应商对账
export function supplierBillByQuarter(query) {
  return request({
    url: '/carbonReport/purchasingContract/supplier/byQuarter',
    method: 'get',
    params: query
  })
}

// 查询用户列表
export function listUser() {
  return request({
    url: 'system/user/userList',
    method: 'get',
  })
}

// 查询供应链SCM-销售管理-供应商列表（不分页）
export function getListSupplier(query) {
  return request({
    url: '/scm/supplier/supplierList',
    method: 'get',
    params: query
  })
}