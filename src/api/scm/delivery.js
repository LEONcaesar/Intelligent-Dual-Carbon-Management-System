import request from '@/utils/request'

// 查询供应链SCM-销售管理-销售发货列表
export function listDelivery(query) {
  return request({
    url: '/scm/delivery/list',
    method: 'get',
    params: query
  })
}

// 查询供应链SCM-销售管理-销售发货详细
export function getDelivery(id) {
  return request({
    url: '/scm/delivery/' + id,
    method: 'get'
  })
}

// 新增供应链SCM-销售管理-销售发货
export function addDelivery(data) {
  return request({
    url: '/scm/delivery',
    method: 'post',
    data: data
  })
}

// 修改供应链SCM-销售管理-销售发货
export function updateDelivery(data) {
  return request({
    url: '/scm/delivery',
    method: 'put',
    data: data
  })
}

// 删除供应链SCM-销售管理-销售发货
export function delDelivery(id) {
  return request({
    url: '/scm/delivery/' + id,
    method: 'delete'
  })
}
