import request from '@/utils/request'

export function getPosts (params?: any) {
  return request({
    url: '/posts',
    method: 'get',
    params,
  })
}

export function getPostById (id: string | number) {
  return request({
    url: `/posts/${id}`,
    method: 'get',
  })
}

export function createPost (data: any) {
  return request({
    url: '/posts',
    method: 'post',
    data,
  })
}

export function updatePost (id: string | number, data: any) {
  return request({
    url: `/posts/${id}`,
    method: 'patch',
    data,
  })
}

export function deletePost (id: string | number) {
  return request({
    url: `/posts/${id}`,
    method: 'delete',
  })
}
