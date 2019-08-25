import React,{Component} from 'react'
import {Form, Input} from 'antd'
import Proptypes from 'prop-types'
const Item = Form.Item
/*更新分类的form组件*/
class UpdataForm extends Component{
    static propTypes = {
        categoryName: Proptypes.string.isRequired,
        setForm: Proptypes.func.isRequired
    };
    componentWillMount() {
        //将form对象通过setForm传递给父组件
        this.props.setForm(this.props.form)
    }

    render() {
        const {categoryName} = this.props
        const {getFieldDecorator} = this.props.form
        return (
            <div>
                <Form>
                    <Item>
                        {
                            getFieldDecorator('categoryName',{
                                initialValue:categoryName,
                                rules: [{ required: true, message: '必须输入类名！' }]

                            })(
                                <Input placeholder='请输入要修改的分类名称'/>
                            )
                        }

                    </Item>
                </Form>
            </div>
         )
    }
}

/*form高阶组件*/
export default Form.create()(UpdataForm)
