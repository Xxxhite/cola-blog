import request from '@/utils/request';

export function login(data: any) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  });
}

export function register(data: any) {
  return request({
    url: '/auth/register',
    method: 'post',
    data,
  });
}

export function getProfile() {
  return request({
    url: '/auth/profile',
    method: 'get',
  });
}
