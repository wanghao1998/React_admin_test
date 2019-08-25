/*
* 商品路由的子路由组件*/
import React,{Component} from 'react'
import {Card, Select, Input, Button, Icon, Table, message} from 'antd'

import {reqProuducts, reqSearchProuducts, requpdateStatus} from '../../../ajax/index'
import {PAGE_SIZE} from '../../../utils/constants'
const Option = Select.Option

export  default class ProductHome extends Component{
    state = {
        products: [], //商品数组
        total:0, //商品总数量
        loading:false ,//是否加载中
        searchName:'',//搜索关键字
        SearchType:'productName'
    };

    /*初始化表格的Colum*/
    initColums = () =>{
        this.columns = [
            {
                title: '商品',
                dataIndex: 'name'
            },
            {
                title: '商品描述',
                width:'50%' ,
                dataIndex: 'desc'
            },
            {
                title: '价格',
                dataIndex: 'price',
                render:(price)=>{
                    return '￥'+price
                }
            },
            {
                title: '状态',
                render:(product)=>{
                    const {status, _id} = product
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button
                                type={status === 1 ? 'primary' : 'danger'}
                                onClick={()=>this.updateStatus(_id, newStatus)}
                            >{status === 1 ? '下架' : '上架'}</Button><br/>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                render:(product)=>{
                    return (
                        <span>
                            <Button type='link' onClick={()=>this.props.history.push('/product/Detail', product)}>详情</Button>
                            <br/>
                            <Button type='link' onClick={()=>this.props.history.push('/product/addupdata', product)}>修改</Button>
                        </span>

                    )
                }
            },
        ]
    }

    /*获取制定页码的列表显示数据*/
    getProducts = async (pageNum)=>{
        this.pageNum = pageNum
        this.setState({loading:true})
        const {searchName, SearchType} = this.state
        let result
        //判断是否有搜索，有则做搜索分页，无则做普通分页
        if (searchName) {
            result = await reqSearchProuducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType:SearchType})
        } else {
            result = await reqProuducts(pageNum, PAGE_SIZE)
        }
        this.setState({loading: false})
        if (result.status === 0){
            const {total, list} = result.data
            this.setState({
                total,
                products: list
                })
        } else {
            message.error('获取商品失败')
        }
    };

    /*更新指定商品的状态*/
    updateStatus = async (productId, status) => {
        const result = await requpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('商品更新成功！')
            console.log(this.pageNum);
            this.getProducts(this.pageNum)
        }
    }

    componentWillMount() {
        // 同步初始化
        this.initColums()
    };

    componentDidMount() {
        //异步获取
        this.getProducts(1)
    };

    render() {
        //取出状态数据
        const {products, total, loading, SearchType, searchName} = this.state

        const title = (
            <span>
                <Select value={SearchType} style={{width:130}} onChange={value => this.setState({SearchType:value})}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='请输入关键字' style={{width:150, margin: '0 15px'}} value={searchName} onChange={event => this.setState({searchName:event.target.value})}/>
                <Button type='primary' onClick={()=> this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <span>
                <Button type='primary' onClick={()=>this.props.history.push('/product/addupdata')}><Icon type='plus'/>添加商品</Button>
            </span>
        )
        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table rowKey='_id'
                           pagination={{
                               current: this.pageNum,
                               defaultPageSize:PAGE_SIZE,
                               showQuickJumper: true,
                               total:total,
                               defaultCurrent:1,
                               onChange:(page)=>{this.getProducts(page)}
                           }}
                           dataSource={products}
                           columns={this.columns}
                           loading={loading}
                    />
                </Card>
            </div>
         )
    }
}
