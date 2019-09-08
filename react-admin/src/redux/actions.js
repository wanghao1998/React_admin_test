//包含所有的action creator
import {reqLogin} from '../ajax/index'
import {SET_HEAD_TITLE,SET_USER, SHOW_ERR_MESSG, RESET_USER} from './action-types'
import storageUtils from '../utils/storageUtils'
/*设置头部标题的同步active*/
export const setHeadTitle = (headTitle)=>({type:SET_HEAD_TITLE,data:headTitle});
/*接收用户的同步action*/
export const receiveUser = (user)=>({type:SET_USER,data:user});
export const showErrorMsg = (errorMsg)=>({type:SHOW_ERR_MESSG,data:errorMsg})

/*退出登录同步*/
export const logout = () => {
    storageUtils.removeUser()
    return {type: RESET_USER}
}

//登录异步action
export const login = (username, password) => {
    return  async dispatch => {
        // 1.执行异步ajax请求
        const result = await reqLogin(username, password)
        //成功，分发成功的同步action
        if (result.status === 0) {
            const user = result.data
            //保存在local中
            storageUtils.saveUser(user)
            dispatch(receiveUser(user))
        } else {
            //失败，分发失败action
            const errorMsg = result.msg
            dispatch(showErrorMsg(errorMsg))
        }

    }
}
