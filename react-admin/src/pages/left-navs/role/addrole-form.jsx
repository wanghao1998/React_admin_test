import React,{Component} from 'react'
import {Form, Input} from 'antd'
import Proptypes from "prop-types";
const Item = Form.Item
/*添加分类的form组件*/
class AddForm extends Component{
    static propTypes = {
        setForm: Proptypes.func.isRequired
    };
    componentWillMount() {
        //将form对象通过setForm传递给父组件
        this.props.setForm(this.props.form)
    };
    render() {
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            wrapperCol: {span: 15},
            labelCol: {span: 4}
        }
        return (
            <div>
                <Form>
                    <Item label='角色名称' {...formItemLayout}>
                        {
                            getFieldDecorator('roleName',{
                                initialValue:'',
                                rules: [{ required: true, message: '必须输入角色名！' }]

                            })(
                                <Input placeholder='请输入要添加的角色名称'/>
                            )

                        }

                    </Item>
                </Form>
            </div>
        )
    }
}

/*form高阶组件*/
export default Form.create()(AddForm)
