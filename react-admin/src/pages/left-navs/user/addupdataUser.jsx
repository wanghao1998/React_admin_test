import React,{Component} from 'react'
import {Form, Input, Select} from 'antd'
import Proptypes from "prop-types";
const Item = Form.Item
const { Option } = Select;
/*添加分类的form组件*/
class AddForm extends Component{
    static propTypes = {
        setForm: Proptypes.func.isRequired,
        user: Proptypes.object,
        roles:Proptypes.array.isRequired,
    };
    componentWillMount() {
        //将form对象通过setForm传递给父组件
        this.props.setForm(this.props.form)
    };
    render() {
        const {getFieldDecorator} = this.props.form
        const {roles, user} = this.props
        const formItemLayout = {
            wrapperCol: {span: 15},
            labelCol: {span: 4}
        }
        return (
                <Form {...formItemLayout}>
                    <Item label='用户名称' >
                        {
                            getFieldDecorator('username',{
                                initialValue:user.username,
                                rules: [{ required: true, message: '必须输入用户名！' }]

                            })(
                                <Input placeholder='请输入要添加的角色名称'/>
                            )
                        }
                    </Item>
                    {
                        user._id ? null: (
                            <Item label='用户密码' >
                                {
                                    getFieldDecorator('password',{
                                        initialValue:user.password,
                                        rules: [{ required: true, message: '必须输入密码！' }]

                                    })(
                                        <Input placeholder='请输入要添加的密码'/>
                                    )
                                }
                            </Item>
                        )

                    }

                    <Item label='邮箱' >
                        {
                            getFieldDecorator('email',{
                                initialValue:user.email,
                                rules: [{ required: true, message: '必须输入邮箱！' }]

                            })(
                                <Input placeholder='请输入要添加的邮箱'/>
                            )
                        }
                    </Item><Item label='电话' >
                        {
                            getFieldDecorator('phone',{
                                initialValue:user.phone,
                                rules: [{ required: true, message: '必须输入电话！' }]

                            })(
                                <Input placeholder='请输入要添加的电话'/>
                            )
                        }
                    </Item>
                    <Item label='所属角色' >
                        {
                            getFieldDecorator('role_id',{
                                initialValue:user.role_id?user.role_id :'5d6e118c6c820024b05d264a' ,

                            })(
                                <Select>
                                    {
                                        roles.map(role => {
                                            return (<Option value={role._id} key={role._id}>{role.name}</Option>)
                                        })
                                    }
                                </Select>
                            )
                        }
                    </Item>

                </Form>
        )
    }
}

/*form高阶组件*/
export default Form.create()(AddForm)
