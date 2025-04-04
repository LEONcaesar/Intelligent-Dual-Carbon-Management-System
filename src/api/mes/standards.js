import request from '@/utils/request'

// 查询检验标准列表

export function listStandards(query) {
  return request({
    url: '/mes/standards/list',
    method: 'get',
    params: query
  })
}

// 查询检验标准详细

export function getStandards(id) {
  return request({
    url: '/mes/standards/' + id,
    method: 'get'
  })
}

// 新增检验标准
export function addStandards(data) {
  return request({
    url: '/mes/standards',
    method: 'post',
    data: data
  })
}

// 修改检验标准

export function updateStandards(data) {
  return request({
    url: '/mes/standards',
    method: 'put',
    data: data
  })
}

// 删除检验标准

export function delStandards(id) {
  return request({
    url: '/mes/standards/' + id,
    method: 'delete'
  })
}
