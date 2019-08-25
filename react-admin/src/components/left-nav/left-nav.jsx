/*左侧导航组件*/
import React,{Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu, Icon} from 'antd';

import menuList from '../../config/memuCofig'
import memoryUtils from '../../utils/memoryUtils'
import './left-nav.less'
import log from '../../assets/images/logo.png'

const { SubMenu } = Menu;

class LeftNav extends Component{
    /*判断用户的菜单权限*/
    hasAuth = (item) => {
        const {key, isPublic} = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        /*
        1.如果当前用户是admin
        2.如果当前item公开
        3.当前用户有此item权限：key有没有menus中
        * */
        if (username==='admin' || isPublic || menus.indexOf(key)!==-1) {
            return true
        } else {
            return false
        }
    }

    getMenuNodes_map = (menuList) => {
        /*根据menu的数据数组生成对应的标签数组*/
        return menuList.map(item=>{
            if (!item.children){
                return (
                    <Menu.Item key={item.key}>
                        <Link to= {item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return <SubMenu
                    key= {item.key}
                    title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                    }
                >
                    {this.getMenuNodes(item.children)}
                </SubMenu>
            }
        })
    }

    /*根据menu的数据生成标签数组
    * 使用reduce（）+递归调用*/
    getMenuNodes = (menuList) =>{
        return menuList.reduce((pre, item)=>{
            if (this.hasAuth(item)) {
                if (!item.children){
                    pre.push (
                        <Menu.Item key={item.key}>
                            <Link to= {item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                } else {
                    //查找一个与当前请求路径匹配的子item
                    let path = this.props.location.pathname
                    if (path.indexOf('/product') === 0){
                        //当前请求的是商品或者商品子路由
                        path = '/product'
                    }
                    const cItem = item.children.find(citem => citem.key === path)
                    if (cItem) {
                        this.openKey = item.key
                    }

                    pre.push (<SubMenu
                            key= {item.key}
                            title={
                                <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                }
            }

            return pre
        },[])
    };
    componentWillMount() {
        //在第一次render()之前执行一次，为第一次render（）准备数据（必须同步）
        this.MenuNodes =  this.getMenuNodes(menuList)
    }

    render() {
        let path = this.props.location.pathname
        if (path.indexOf('/product') === 0){
            //当前请求的是商品或者商品子路由
            path = '/product'
        }
        return (

            <div  className="left-nav">
                <Link to='/' className='left-nav-header'>
                    <img src={log} alt='logo'/>
                    <h1>后台管理</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[this.openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {
                        this.MenuNodes
                    }
                </Menu>
            </div>

         )
    }
}
/*
* withRouter高阶组件
* 包装非路由组件返回一个新组件
* 新的组件向非路由组件传递三个属性；history/location/match*/
export default withRouter(LeftNav)
