import request from '@/utils/request'

// 查询作业装配列表
export function listAssembly(query) {
  return request({
    url: '/mes/jobAssembly/list',
    method: 'get',
    params: query
  })
}

// 查询作业装配详细
export function getAssembly(id) {
  return request({
    url: '/mes/jobAssembly/' + id,
    method: 'get'
  })
}

// 新增作业装配
export function addAssembly(data) {
  return request({
    url: '/mes/jobAssembly',
    method: 'post',
    data: data
  })
}

// 修改作业装配
export function updateAssembly(data) {
  return request({
    url: '/mes/jobAssembly',
    method: 'put',
    data: data
  })
}

// 删除作业装配
export function delAssembly(id) {
  return request({
    url: '/mes/jobAssembly/' + id,
    method: 'delete'
  })
}

// 作业装配操作状态
export function uptAssemblyStatus(data) {
  return request({
    url: '/mes/jobAssembly/changeStatus',
    method: 'put',
    data: data
  })
}

