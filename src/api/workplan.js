import request from '@/utils/request'

export const getWorkPlanList = params => {
  return request({
    url: '/admin/workplan/list',
    method: 'post',
    data: params
  })
}

export const getWorkPlanKanban = params => {
  return request({
    url: '/admin/workplan/kanban',
    method: 'get',
    data: params
  })
}

export const delWorkPlan = params => {
  return request({
    url: '/admin/workplan/del',
    method: 'post',
    data: params
  })
}

export const batchDelWorkPlan = params => {
  return request({
    url: '/admin/workplan/batchDel',
    method: 'post',
    data: params
  })
}

export const editWorkPlan = params => {
  return request({
    url: '/admin/workplan/edit',
    method: 'post',
    data: params
  })
}

export const addWorkPlan = params => {
  return request({
    url: '/admin/workplan/add',
    method: 'post',
    data: params
  })
}

export const getWorkPlan = params => {
  return request({
    url: '/admin/workplan/get',
    method: 'post',
    data: params
  })
}
