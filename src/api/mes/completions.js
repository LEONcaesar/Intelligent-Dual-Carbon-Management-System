import request from '@/utils/request'

// 查询生产完工单列表
export function listCompletion(query) {
  return request({
    url: '/mes/completion/list',
    method: 'get',
    params: query
  })
}

// 查询生产完工单详细
export function getCompletion(id) {
  return request({
    url: '/mes/completion/' + id,
    method: 'get'
  })
}

// 新增生产完工单
export function addCompletion(data) {
  return request({
    url: '/mes/completion',
    method: 'post',
    data: data
  })
}

// 修改生产完工单
export function updateCompletion(data) {
  return request({
    url: '/mes/completion',
    method: 'put',
    data: data
  })
}

// 删除生产完工单
export function delCompletion(id) {
  return request({
    url: '/mes/completion/' + id,
    method: 'delete'
  })
}
