/*
* 角色路由*/
import React,{Component} from 'react'
import {Card, Button, Table, message, Modal} from 'antd'

import {reqAddRole, reqRoles, reqUpdataRole} from '../../../ajax/index'
import AddForm from "./addrole-form"
import UpdataForm from "./updatarole-form"
import memoryUtils from "../../../utils/memoryUtils";
import {formateDate} from '../../../utils/dateUtils'

export  default class Role extends Component{
    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }

    state = {
        roles:[],
        role: {},// 选中行
        isloading:false,
        showStatus:0
    };

    /*初始化列*/
    initColum = () => {
        this.columns = [
            {
                title:'角色名称',
                dataIndex:'name'
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render:(create_time)=>{
                    return formateDate(create_time)
                }
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render:(auth_time)=>{
                    return formateDate(auth_time)
                }
            },
            {
                title:'授权人',
                dataIndex:'auth_name'
            }
        ]
    }

    /*获取角色列表*/
    getRoles = async () => {
        this.setState({
            isloading:true
        })
        const reslut = await reqRoles()
        if (reslut.status === 0) {
            this.setState({
                roles:reslut.data,
                isloading:false
            })
        }
    }

    /*onrow点击行事件*/
    onRow = (record) => {
        return {
            onClick: event => {
                console.log(record);
                this.setState({
                    role:record
                })
            }
        }
    }

    /*点击选择回调函数*/
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ role:selectedRows[0] });
    };

    /*点击取消对话输入框*/
    handleCance = () => {
        this.form.resetFields()
        this.setState({
            showStatus:0
        })
    };
    handleCancel2 = () => {
        this.setState({
            showStatus:0
        })
    };

    /*添加角色*/
    addRole = ()=>{
        this.setState({
            showStatus:1
        })
    };
    addOk = async ()=>{
        this.form.validateFields( async (err, values) => {
            if (!err) {
                // 隐藏确认框
                this.setState({
                    showStatus: 0
                })
                // 准备数据
                const {roleName} = values
                //清除输入数据
                this.form.resetFields()
                // 发送请求
                const result = await reqAddRole(roleName)
                if (result.status === 0) {
                    //如更新从新显示列表
                    this.getRoles()
                    message.success('添加成功')
                } else {
                    message.error('添加失败')
                }
            }
        })

    };

    /*更新角色权限*/
    updataRole = () => {
        this.setState({
            showStatus:2
        })
    };
    updatahOk = async () => {
        this.setState({
            showStatus: 0
        })

        //准备数据
        const role = this.state.role
        const user =  memoryUtils.user
        role.menus = this.auth.current.getCheck()
        role.auth_name = user.username
        const result = await reqUpdataRole(role)
        if (result.status === 0) {
            message.success('更新成功')
            this.setState({roles:[...this.state.roles]})
            /*this.getRoles()*/
        } else {
            message.error('更新失败')
        }

    }

    componentWillMount() {
        this.initColum()
    }
    componentDidMount() {
        this.getRoles()
    }

    render() {
        const {roles, isloading, role, showStatus} = this.state

        const rowSelection = {
            type:'radio',
            selectedRowKeys:role._id,
            onChange: this.onSelectChange,
        };

        const hasSelected = role._id ;

        const title = (
            <span>
                <Button type='primary' onClick={this.addRole}>创建角色</Button>&nbsp;&nbsp;&nbsp;
                <Button type='primary' onClick={this.updataRole} disabled={!hasSelected}>设置角色权限</Button>
            </span>
        )

        return (
            <Card className='Card' title={title}>
                <Table bordered rowKey='_id'
                       loading={isloading}
                       rowSelection={rowSelection}
                       onRow={record =>(this.onRow(record))}
                       pagination={{defaultPageSize:5, showQuickJumper:true,
                           showTotal:(maxLength, roles) => (`${roles[0]}-${roles[1]} 总计 ${maxLength} `) }}
                       dataSource={roles} columns={this.columns} />
                <Modal
                    title="添加角色"
                    visible={showStatus === 1}
                    onOk={this.addOk}
                    onCancel={this.handleCancel}
                >
                    <AddForm   setForm={(form)=>{this.form = form}}/>
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={showStatus === 2}
                    onOk={this.updatahOk}
                    onCancel={this.handleCancel2}
                >
                    <UpdataForm role={role} ref={this.auth} />
                </Modal>
            </Card>

         )
    }
}
