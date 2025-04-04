import request from '@/utils/request'

// 查询供应链SCM-销售管理-销售退货列表
export function listReturn(query) {
  return request({
    url: '/scm/return/list',
    method: 'get',
    params: query
  })
}

// 查询供应链SCM-销售管理-销售退货详细
export function getReturn(id) {
  return request({
    url: '/scm/return/' + id,
    method: 'get'
  })
}

// 新增供应链SCM-销售管理-销售退货
export function addReturn(data) {
  return request({
    url: '/scm/return',
    method: 'post',
    data: data
  })
}

// 修改供应链SCM-销售管理-销售退货
export function updateReturn(data) {
  return request({
    url: '/scm/return',
    method: 'put',
    data: data
  })
}

// 删除供应链SCM-销售管理-销售退货
export function delReturn(id) {
  return request({
    url: '/scm/return/' + id,
    method: 'delete'
  })
}
