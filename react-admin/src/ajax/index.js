/*
* 包含n个接口请求函数的模块
* */
import jsonp from 'jsonp'
import {message} from 'antd'
import ajax from './ajax'
/*用户*/
//登录接口
/*export function reqLogin() {
    return ajax('http://localhost:5000/login',{username, password}, 'POST')
}*/
export const reqLogin = (username, password) => ajax('/login',{username, password}, 'POST')
//添加更新用户
export const addupdateUser = (user) => ajax('/manage/user/'+(user._id? 'update':'add'), user, 'POST')
//获取所有用户
export const reqUsers = () => ajax('/manage/user/list')
//删除用户
export const delectUsers = (userId) => ajax('/manage/user/delete', {userId}, 'POST')

/*商品*/
//获取商品类别
export const reqCategorys = (parentId) => ajax('/manage/category/list', {parentId}, 'GET')
//添加商品类别
export const reqaddCategorys = (categoryName, parentId) => ajax('/manage/category/add', {categoryName,parentId}, 'POST')
//更新商品类别
export const reqrealCategorys = (categoryName, categoryId) => ajax('/manage/category/update', {categoryName, categoryId}, 'POST')
//获取单个分类
export const reqinfoCategorys = (categoryId) => ajax('/manage/category/info',{categoryId},'GET')
//获取商品分页列表
export const reqProuducts = (pageNum, pageSize)=> ajax('/manage/product/list',{pageNum, pageSize}, 'GET')
//商品上架下架
export const requpdateStatus = (productId, status) => ajax('/manage/product/updateStatus',{productId, status}, 'POST')
//搜索商品分页列表
//搜索类型:searchType:productName/productDesc
export const reqSearchProuducts = ({pageNum, pageSize, searchName, searchType})=> ajax('/manage/product/search',{pageNum, pageSize, [searchType]:searchName},"GET")
//商品图片删除
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'POST')
// 添加商品/更新商品
export const reqAddOrUpdataProuduct = (product) => ajax('/manage/product/'+(product._id?'update':'add'),product,'POST')


/*角色权限*/
//获取所有角色列表
export const reqRoles = () => ajax('/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')
//更新角色权限
export const reqUpdataRole = (role) => ajax('/manage/role/update', role, 'POST')

/*jsonp请求的接口函数*/
export const reqWeather = (city) => {
    return new Promise((resolve, reject)=>{
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        //发送jsonp请求
        jsonp(url, {}, (err, data)=>{
            //成功
            if (!err && data.status==='success') {
                //取出需要的数据
                const {dayPictureUrl, weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl, weather})
            } else {
                //失败
                message.error('获取天气信息失败')
            }
        })
    })

}

