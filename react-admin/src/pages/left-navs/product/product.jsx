/*
* 商品路由*/
import React,{Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductAdd from './add-updata'
import ProductDetail from './detail'
import './product.less'
export  default class Product extends Component{
    render() {
        return (
            <div>
                <Switch>
                    <Route path='/product' component={ProductHome} exact/>{/*路径完全匹配*/}
                    <Route path='/product/addupdata' component={ProductAdd}/>
                    <Route path='/product/Detail' component={ProductDetail}/>
                    <Redirect to='/product'/>
                </Switch>
            </div>
         )
    }
}
