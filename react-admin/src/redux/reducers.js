// 包含n个reducers的函数
import {combineReducers} from 'redux'

/*管理头部的reduce函数*/
import storageUtils from '../utils/storageUtils'
import {SET_HEAD_TITLE, SET_USER, SHOW_ERR_MESSG, RESET_USER } from './action-types'

const initHeadTitle = '首页'

function headTitle(state = initHeadTitle,action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data
        default:return state;
    }
}

const initUser = storageUtils.getUser()

function user( state= initUser, action) {
    switch (action.type) {
        case SET_USER:
            return action.data
        case SHOW_ERR_MESSG:
            const errorMsg = action.data
            return {...state, errorMsg}
        case RESET_USER : return {}
        default:return state
    }
}
export default combineReducers({
    headTitle:headTitle,
    user:user
})
