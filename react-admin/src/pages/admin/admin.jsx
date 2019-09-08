/*
* 后台管理路由组件
* */
import React,{Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import { Layout } from 'antd';
import {connect} from 'react-redux'

import LeftNav from '../../components/left-nav/left-nav'
import Header from '../../components/Header/Header'
import Home from '../left-navs/home/home'
import Category from '../left-navs/category/category'
import Product from '../left-navs/product/product'
import Role from '../left-navs/role/role'
import User from '../left-navs/user/user'
import Bar from '../left-navs/charts/bar'
import Line from '../left-navs/charts/line'
import Pie from '../left-navs/charts/pie'
import NotFound from '../not-found/not-found'
import './admin.less'
const {Footer, Sider, Content } = Layout;
class Admin extends Component{

    render() {
        const user = this.props.user
        //如果内存中没有user 当前没有登录
        if (!user._id){
            // 自动跳转灯登录
            return <Redirect to='/login'/>
        }
        return (
                <Layout className='layout'>
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout className='layout2'>
                        <Header/>
                        <Content className='Content'>
                            <Switch>
                                <Route path='/home' component={Home}/>
                                <Route path='/category' component={Category}/>
                                <Route path='/product' component={Product}/>
                                <Route path='/role' component={Role}/>
                                <Route path='/user' component={User}/>
                                <Route path='/charts/bar' component={Bar}/>
                                <Route path='/charts/line' component={Line}/>
                                <Route path='/charts/pie' component={Pie}/>
                                <Route  component={NotFound}/>
                                <Redirect to='/home'/>
                            </Switch>
                        </Content>
                        <Footer className='Footer'>使用谷歌浏览器效果最佳</Footer>
                    </Layout>
                </Layout>
         )
    }
}
export default connect( state => ({user: state.user}) )(Admin)
