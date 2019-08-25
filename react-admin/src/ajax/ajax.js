/*能发送异步ajax请求的函数模块
* 封装axios库、
* 函数的返回值是promise对象
* 1.优化 统一处理请求异常
*   在外层包一个自己的promise对象
*   在请求出错时返回提示而不是错误信息
* */
//统一处理错误请求
import axios from 'axios'
import {message} from 'antd'
export default function ajax(url, data={}, type='GET') {
    return new Promise((resolve, reject) => {
        //1.执行Ajax请求
        let promise
        if (type==='GET') {
            promise = axios.get(url, {
                params:data
            })
        } else {
            promise = axios.post(url, data)
        }
        //2.如果成功了调用resolve（value）
        promise.then(response => {
            //2.如果成功了调用resolve（value）
            resolve(response.data)
        }).catch(error => {
            //3. 如果失败不调用reject，提示错误信息
            message.error('请求出错'+error.message)
        })
    })
}
