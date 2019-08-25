/*
* 用户路由*/
import React,{Component} from 'react'
import {Card, Modal, Table, message, Button} from 'antd'
import AddForm from "./addupdataUser";

import {formateDate} from "../../../utils/dateUtils";
import {reqUsers, addupdateUser, delectUsers} from "../../../ajax";

const { confirm } = Modal
export  default class User extends Component{
    state = {
        users:[],
        roles:[],
        isloading:false,
        showStatus:false
    };

    initColum = () => {
        this.columns = [
            {
                title:'用户名',
                dataIndex:'username'
            },
            {
                title:'邮箱',
                dataIndex:'email'
            },
            {
                title:'电话',
                dataIndex:'phone'
            },
            {
                title:'注册时间',
                dataIndex:'create_time',
                render:(create_time)=>{
                    return formateDate(create_time)
                }
            },
             {
                title:'所属角色',
                dataIndex:'role_id',
                 render: (rolr_id) => {
                    return this.roleNames[rolr_id]
                 }
            },
             {
                title:'操作',
                 render:(user)=>{
                     return (
                         <span>
                            <Button type='link' onClick={()=>this.showUpdataUser(user)}>修改</Button>
                            <br/>
                            <Button type='link' onClick={()=>this.delectUser(user)}>删除</Button>
                        </span>

                     )
                 }
            },

        ]
    }

    /*根据role数组生成包含所有角色名的对象*/
    initRoles = (roles) => {
        const roleNames = roles.reduce((pre,role)=>{
            pre[role._id] = role.name
            return pre
        },{})
        //保存在内存中
        this.roleNames = roleNames
    }

    /*获取用户*/
    getusers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const {users, roles} = result.data
            this.initRoles(roles)
            this.setState({
                users,roles
            })
        }
    }


    /*显示修改用户界面*/
    showUpdataUser = (user)=>{
            this.user = user
        this.setState({
            showStatus:true,
        })
    };
    /*显示添加用户界面*/
    addUser  = ()=>{
        this.user = null
        this.setState({
            showStatus:true,
        })
    };
    addOk = async ()=>{
        this.form.validateFields( async (err, values) => {
            if (!err) {
                // 隐藏确认框
                this.setState({
                    showStatus: false
                })
                // 准备数据
                const user = this.form.getFieldsValue()
                this.form.resetFields()
                if (this.user) {
                    user._id = this.user._id
                }
                // 发送请求
                const result = await addupdateUser(user)
                if (result.status === 0) {
                    if (user._id) {
                        message.success('修改用户成功')
                    } else {
                        message.success('创建用户成功')
                    }
                } else {
                    message.error('用户已存在')
                }
                this.getusers()
            }
        })

    };

    /*删除用户*/
    delectUser = (user) => {
        confirm({
            title: `确认删除用户 ${user.username} ?` ,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                const result = await delectUsers(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功')
                    this.getusers()
                }
            }
        });
    };

    componentWillMount() {
        this.initColum()
    }
    componentDidMount() {
        this.getusers()
    }

    render() {
        const {users, showStatus, roles, isloading} = this.state
        const user = this.user || {}
        const title = (
            <span>
                <Button type='primary' onClick={()=>this.addUser()}>创建用户</Button>
            </span>
        )

        return (
            <Card className='Card' title={title}>
                <Table bordered rowKey='_id'
                       loading={isloading}
                       pagination={{defaultPageSize:5, showQuickJumper:true,
                           showTotal:(maxLength, users) => (`${users[0]}-${users[1]} 总计 ${maxLength} `) }}
                       dataSource={users} columns={this.columns} />
                <Modal
                    title={this.isUpdate ? "修改用户":"添加用户"}
                    visible={showStatus}
                    onOk={this.addOk}
                    onCancel={()=>{
                        this.form.resetFields()
                        this.setState({showStatus:false})
                    }}
                >
                    <AddForm setForm={(form)=>{this.form = form}}user={user} roles={roles}/>
                </Modal>
            </Card>

        )
    }
}

