/*
* 商品分类路由*/
import React,{Component} from 'react'
import { Card, Table, Button, Icon , message, Modal} from 'antd';

import './category.less'
import LinkButton from "../../../components/link-but/linkButton";
import {reqCategorys, reqaddCategorys, reqrealCategorys} from '../../../ajax/index'
import AddForm from './add-form'
import UpdataForm from './updata-form'
export  default class Category extends Component{
    state = {
        dataSource: [],//一级分类列表
        subCategorys: [],//二级分类列表
        isloading:true,//是否正在获取数据动画
        parentId:'0',//当前需要显示的分类列表的父类ID
        parentName:'',//当前需要显示的分类列表的父类name
        showStatus:0 //标识添加/更新的确认框是否显示，0：都不显示；1：显示添加；2：显示更新
    };

    /*异步获取一二级列表项*/
    getCategorys = async (parentId) =>{
        this.setState({isloading:true})
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        if (result.status === 0){
            const dataSource = result.data
            //取出分类数组数据
            if ( parentId ==='0'){
                this.setState({dataSource, isloading:false})
            } else {
                this.setState({subCategorys:dataSource, isloading:false})
            }

        } else {
            message.error('获取数据失败')
        }
    };

    /*初始化界面列表项*/
    initcolumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name'
            },
            {
                title: '操作',
                width: 300,
                render:(dataSource)=>(
                    //f返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={()=>{this.updataCategory(dataSource)}}>修改分类</LinkButton>
                        {/*如何向事件回调函数传递参数：定义匿名函数在函数调用处理的函数中传入数据*/}
                        {
                            this.state.parentId==='0'?<LinkButton onClick={()=>{this.showsubCategorys(dataSource)}}>查看子分类</LinkButton>: null
                        }

                    </span>
                )
            }
        ]
    };

    /*显示一级分类列表*/
    showCategorys = ()=>{
        //更新状态为一级列表状态
        this.setState({
            parentId:'0',
            parentName:'',
            subCategorys:[],
            maxLength:this.state.dataSource.length
        })
    };

    /*显示二级分类列表 */
    showsubCategorys = (dataSource)=>{
        //先更新状态
        this.setState({
            parentId:dataSource._id,
            parentName:dataSource.name
        },()=>{
            //在状态更新且界面更新后执行
            this.getCategorys(dataSource._id)
        })
        //setstate（）不能立即更新状态，因为setstate是一部更新状态的
    };

    /*点击取消对话输入框*/
    handleCancel = () => {
        this.form.resetFields()
        this.setState({
            showStatus:0
        })
    };

    /*添加分类*/
    addCategory = ()=>{
        this.setState({
            showStatus:1
        })
    };
    addOk = ()=>{
        this.form.validateFields( async (err, values) => {
            if (!err) {
                // 隐藏确认框
                this.setState({
                    showStatus: 0
                })
                // 准备数据
                /*const categoryName = this.form.getFieldValue('categoryName')
                const parentId = this.form.getFieldValue('parentId')*/
                const {categoryName, parentId} = values
                //清除输入数据
                this.form.resetFields()
                // 发送请求
                const result = await reqaddCategorys(categoryName, parentId)
                if (result.status === 0) {
                    //如果是在当前分类下更新从新显示列表
                    if (parentId === this.state.parentId) {
                        this.getCategorys()
                    } else if (parentId === '0') {
                        //在二级分类列表项添加一级分类，从新获取一级分类但不需要显示
                        this.getCategorys('0')
                    }
                    message.success('添加成功')
                } else {
                    message.error('添加失败')
                }
            }
        })

    };

    /*更新分类*/
    updataCategory = (dataSource)=>{
        //保存分类对象
        this.category = dataSource
        //更新状态
        this.setState({
            showStatus:2
        })
    }
    updataOk =  ()=>{
        this.form.validateFields( async (err, values) => {
            if (!err){
                // 隐藏确认框
                this.setState({
                    showStatus:0
                })
                // 准备数据
                const parentId = this.category.parentId
                const categoryId = this.category._id
                //const categoryName = this.form.getFieldValue('categoryName')
                const {categoryName} = values
                //清除输入数据
                this.form.resetFields()
                // 发送请求
                const result = await reqrealCategorys(categoryName, categoryId)
                if (result.status === 0){
                    //从新显示列表
                    this.getCategorys(parentId)
                    message.success('更新成功')
                }  else {
                    message.error('更新失败')
                }
            }
        })


    };

    //同步执行初始化
    componentWillMount() {
        this.initcolumns()
    };

    //异步操作
    componentDidMount() {

        this.getCategorys('0')

    };

    render() {
        const {dataSource, isloading, parentId, parentName, subCategorys, showStatus} = this.state
        const category = this.category || {} //如果为空指定空对象
        // card的左侧
        const title = parentId==='0' ? '一级分类列表': (<span>
            <LinkButton onClick={this.showCategorys}>一级分类</LinkButton>
            <Icon type='arrow-right'/>
                {parentName}
            </span>)
        // card的右侧
        const extra = (
            <Button type='primary' onClick={this.addCategory}>
                <Icon type='plus'/>
                <span>添加</span>
            </Button>
        )
        return (
            <div>
                <Card className='Card' title={title} extra={extra}  >
                    <Table bordered rowKey='_id'
                           loading={isloading}
                           pagination={{defaultPageSize:5, showQuickJumper:true,
                               showTotal:(maxLength, dataSource) => (`${dataSource[0]}-${dataSource[1]} 总计 ${maxLength} `) }}
                           dataSource={parentId==='0'?dataSource:subCategorys} columns={this.columns} />
                    <Modal
                        title="添加分类"
                        visible={showStatus === 1}
                        onOk={this.addOk}
                        onCancel={this.handleCancel}
                    >
                       <AddForm dataSource={dataSource} parentid={parentId} setForm={(form)=>{this.form = form}}/>
                    </Modal>
                    <Modal
                        title="更新分类"
                        visible={showStatus===2}
                        onOk={this.updataOk}
                        onCancel={this.handleCancel}
                    >
                       <UpdataForm categoryName={category.name} setForm={(form)=>{this.form = form}}/>
                    </Modal>
                </Card>
            </div>
         )
    }
}
