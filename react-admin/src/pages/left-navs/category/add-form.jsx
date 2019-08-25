import React,{Component} from 'react'
import {Form, Select, Input} from 'antd'
import Proptypes from "prop-types";
const Item = Form.Item
const Option = Select.Option
/*添加分类的form组件*/
class AddForm extends Component{
    static propTypes = {
        dataSource: Proptypes.array.isRequired,
        parentid: Proptypes.string.isRequired,
        setForm: Proptypes.func.isRequired
    };
    componentWillMount() {
        //将form对象通过setForm传递给父组件
        this.props.setForm(this.props.form)
    };
    render() {
        const {getFieldDecorator} = this.props.form
        const {dataSource, parentid} = this.props
        return (
            <div>
                <Form>
                    <Item>
                        {
                            getFieldDecorator('parentId',{
                                initialValue: parentid===0 ? '0':parentid
                            })(
                                <Select>
                                    <Option value='0'>一级分类</Option>
                                    {
                                        dataSource.map(item=>{
                                           return (<Option value={item._id} key={item._id}>{item.name}</Option>)
                                        })
                                    }
                                </Select>
                            )

                        }

                    </Item>
                    <Item>
                        {
                            getFieldDecorator('categoryName',{
                                initialValue:'',
                                rules: [{ required: true, message: '必须输入类名！' }]

                            })(
                                <Input placeholder='请输入要添加的分类名称'/>
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
