import React,{Component} from 'react'
import { Form, Icon, Input, Button} from 'antd';
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {login} from '../../redux/actions'

import './login.less'
import log from '../../assets/images/logo.png'


/*登录的路由组件*/
 class Login extends Component{
    handleSubmit = (event)=>{
        //阻止默认事件
        event.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            //校验成功
            if (!err) {
                // value为输入的值
                //console.log('提交登录ajax请求', values);
                const {username, password} = values
                //调用异步action函数，有结果后更新状态
                this.props.login(username, password)
            }
        });
/*        const form = this.props.form
        //得到输入的值
        const values = form.getFieldsValue()*/
    }
    render() {
        // 如果用户已经登陆跳转到管理界面
        const user =  this.props.user
        if(user && user._id){
            return <Redirect to='/home'/>
        }
        const form = this.props.form
        const {getFieldDecorator} = form
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={log} alt='log'/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
                        <h2>用户登录</h2>
                        <div>
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <Form.Item>
                                    {getFieldDecorator('username', {
                                        //声明式验证，使用定义好的验证规则进行验证
                                        rules: [{ required: true, message: '必须输入用户名！' },
                                            { min: 4, message: '最少为4位！' },
                                            { max: 12, message: '最多为12位！' },
                                            {pattern:/^[a-zA-Z0-9_]+$/, message: '用户名只能是数字字母下划线'}],
                                    })(
                                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                               placeholder="用户名"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: 'Please input your passworld!' },
                                            { min: 4, message: '最少为4位！' },

                                            { max: 14, message: '最多为14位！' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            type="password"
                                            placeholder="用户密码"
                                            />,
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        登录
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                </section>
            </div>
         )
    }
}
/*
* 1.高阶函数
*   1) 一类特别的函数
*       a.接收函数类型的参数
*       b。返回值是函数
*   2）常见
*       a 定时器
*       b promise
*       c 数组遍历相关方法
*       d 函数对象的bind
* 2.高阶组件
*   1）本质上是一个函数
*   2）接收一个组件，返回一个新组建，包装组建会像被包装组件传入特定属性
*   3）作用：扩展组件的功能
*   4）高阶组件也是高阶函数：接受一个组建函数返回新的组件函数
* */
//包装form
const WrappedNormalLoginForm = Form.create()(Login);
export  default connect(
    state=>({
        user:state.user
    }),{login}
) (WrappedNormalLoginForm)
