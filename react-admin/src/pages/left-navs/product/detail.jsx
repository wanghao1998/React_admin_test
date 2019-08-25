/*
* 商品路由的详情 子路由组件*/
import React,{Component} from 'react'
import {Card, Icon, List, Button} from 'antd'

import {BASE_IMG_URL} from '../../../utils/constants'
import {reqinfoCategorys} from '../../../ajax/index'

const Item = List.Item
export  default class ProductDetail extends Component{
    state = {
        cName1:'', //一级分类名称
        cName2:'' //二级分类名称
    }

    //获取所属分类
    async componentDidMount () {
        const product = this.props.location.state
        if (product.pCategoryId === '0') {
            const result = await reqinfoCategorys(product.categoryId)
            if (result.status === 0) {
                const cName1 = result.data.name
                this.setState({cName1})
            }
        } else {

            /* 通过多个await方式发多个请求，后边的请求实在前一个请求成功返回之后才发送
            const result1 = await reqinfoCategorys(product.pCategoryId)
            const result2 = await reqinfoCategorys(product.categoryId)*/

            //一次性发送多个请求，只有都成功了，才正常处理
            const results = await Promise.all([reqinfoCategorys(product.pCategoryId), reqinfoCategorys(product.categoryId)])
            if (results[0].status === 0) {
                const cName1 = results[0].data.name
                this.setState({cName1})
            }
            if (results[1].status === 0) {
                const cName2 = results[1].data.name
                this.setState({cName2})
            }
        }

    }

    render() {
        const product = this.props.location.state
        const {cName1, cName2} = this.state
        const title = (
            <span>
                <Button type='link' onClick={()=>this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{color:'green',marginRight:20}}/>
                </Button>
                <span>
                    商品详情
                </span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <Item>
                    <span className='left'>商品名称：</span>
                    <span>{product.name}</span>
                </Item>
                <Item>
                    <span className='left'>商品描述：</span>
                    <span>{product.desc}</span>
                </Item>
                <Item>
                    <span className='left'>商品价格：</span>
                    <span>{product.price}</span>
                </Item>
                <Item>
                    <span className='left'>所属分类：</span>
                    <span>{cName1}-->{cName2? cName2:''}</span>
                </Item>
                <Item>
                    <span className='left'>商品图片：</span>
                    <span>
                        {
                            product.imgs.map(img => (
                                <img key={img} src={BASE_IMG_URL+img} alt='img' className='product-img'/>
                            ))
                        }
                    </span>
                </Item>
                <Item>
                    <span className='left'>商品详情：</span>
                    <span dangerouslySetInnerHTML={{__html: product.detail}}></span>
                </Item>
            </Card>
         )
    }
}
