import React,{Component} from 'react'
import {Form,Input, Tree} from 'antd'
import Proptypes from "prop-types";

import menuList from '../../../config/memuCofig'

const { TreeNode } = Tree;
const Item = Form.Item
/*添加分类的form组件*/
export default class UpdataForm extends Component{
    static propTypes = {
        role:Proptypes.object.isRequired
    };

    constructor(props) {
        super(props)
        //根据传入角色生成初始状态
        const {menus} = this.props.role
        this.state = {
            checkedKeys:menus
        }
    }

    /*得到树形结点*/
    getMenuNodes_map = (menuList) => {
        /*根据menu的数据数组生成对应的标签数组*/
        return menuList.map(item=>{
            if (!item.children){
                return (
                    <TreeNode title={item.title} key={item.key}/>

                )
            } else {
                return (
                    <TreeNode title={item.title} key={item.key}>
                        {
                            this.getMenuNodes_map(item.children)
                        }
                    </TreeNode>
                )
            }
        })
    }

    /*选中调用*/
    onCheck = checkedKeys => {
        this.setState({ checkedKeys });
    };

    getCheck = () => {
        return this.state.checkedKeys
    }
   componentWillMount() {
        this.treeNodes = this.getMenuNodes_map(menuList)
   }
    componentWillReceiveProps(nextProps) {
        //组件将要接收新属性的时候调用
        const {menus} = nextProps.role
        this.setState({
            checkedKeys:menus
        })
    }

    render() {
        const {role} = this.props
        const {checkedKeys} = this.state
        const formItemLayout = {
            wrapperCol: {span: 15},
            labelCol: {span: 4}
        }
        return (
                <Form>
                    <Item label='角色名称' {...formItemLayout}>
                        <Input value={role.name} disabled/>
                    </Item>
                    <Tree
                    defaultExpandAll={true}/*默认全部展开*/
                    checkable /*选项框*/
                    checkedKeys={checkedKeys} //默认选中
                    onCheck={this.onCheck} //选中调用
                    >
                        <TreeNode title='平台权限' key='all'>
                            {
                                this.treeNodes
                            }
                        </TreeNode>
                    </Tree>
                </Form>
        )
    }
}

