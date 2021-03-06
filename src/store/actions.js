/**
 * 通过mutations间接更新state的多个方法对象
 */
import {
  SET_IS_CAMERA,
  SET_IS_LOGIN,
  SET_TOKEN,
  SET_USER_INFO,
  SET_OPENID,
  SET_WECHAT_USER_INFO
} from './mutations-type'

import { login, getUserInfo, updateUserInfo, wechatLogin, binding, unbinding } from '@/api/user'

const TOKEN_KEY = 'access-token'

export default {
  SetCamera ({ commit }, isCamera) {
    commit(SET_IS_CAMERA, isCamera)
  },
  SetToken ({ commit }, token) {
    commit(SET_TOKEN, token)
  },
  Login ({ commit }, userInfo) {
    userInfo.username = userInfo.username.trim()
    return new Promise((resolve, reject) => {
      login(userInfo).then(data => {
        if (data.success === true) {
          commit(SET_IS_LOGIN, true)
          commit(SET_TOKEN, data[TOKEN_KEY])
          resolve(data)
        } else {
          reject(data)
        }
      }).catch(error => {
        reject(error.data)
      })
    })
  },
  WechatLogin ({ commit }, code) {
    return new Promise((resolve, reject) => {
      wechatLogin(code).then(data => {
        if (data.success === true) {
          commit(SET_IS_LOGIN, true)
          commit(SET_TOKEN, data[TOKEN_KEY])
          resolve(data)
        } else {
          reject(data)
        }
      }).catch(error => {
        reject(error.data)
      })
    })
  },
  // 获取用户信息
  GetUserInfo ({ dispatch, commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(data => {
        if (data.success === true) {
          let userinfo = {
            faceToken: data.faceToken,
            username: data.username,
            fullName: data.fullName,
            number: data.number,
            nickName: data.nickName,
            avatarUrl: data.avatarUrl,
            openId: data.openId
          }
          commit(SET_USER_INFO, userinfo)
          if (data.nickName !== state.wechatUserInfo.nickName || data.avatarUrl !== state.wechatUserInfo.avatarUrl) {
            console.log('进来修改')
            dispatch('UpdateUserInfo', state.wechatUserInfo).then((data) => {
              if (data.success === true) {
                dispatch('GetUserInfo')
              }
            })
          }

          resolve(data)
        } else {
          reject(data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 保存openId
  SetOpenId ({ commit }, openId) {
    return new Promise((resolve, reject) => {
      commit(SET_OPENID, openId)
    })
  },
  // 获取微信用户信息
  SetWechatUserInfo ({ commit }, wechatUserInfo) {
    return new Promise((resolve, reject) => {
      commit(SET_WECHAT_USER_INFO, wechatUserInfo)
    })
  },
  // 更新用户信息
  UpdateUserInfo ({ commit }, wechatUserInfo) {
    return new Promise((resolve, reject) => {
      updateUserInfo(wechatUserInfo).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 登出
  LogOut ({ commit }) {
    return new Promise(resolve => {
      commit(SET_IS_LOGIN, false)
      commit(SET_TOKEN, '')
      commit(SET_USER_INFO, null)
      resolve()
    })
  },
  // 绑定
  Binding ({ commit }, code) {
    return new Promise((resolve, reject) => {
      binding(code).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 解绑
  Unbinding ({ commit }) {
    return new Promise((resolve, reject) => {
      unbinding().then(data => {
        commit(SET_OPENID, '')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
