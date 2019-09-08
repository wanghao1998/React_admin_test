/*
* 商品路由的添加及修改子路由组件*/
import React,{Component} from 'react'
import {Card, Form, Input, Cascader, Button, Icon ,message} from 'antd'

import {reqCategorys, reqAddOrUpdataProuduct} from '../../../ajax/index'
import PicturesWall from './PicturesWall'
import RichTextDeitor from './rich-text-deitor'

const {Item} = Form
const {TextArea} = Input

class ProductAdd extends Component{
    state = {
        options: [],
    };

    //使用ref获取子组件
    constructor (props) {
        super(props)
        //创建用来保存ref标识的标签对象容器
        this.pw = React.createRef() //imgref容器
        this.dr = React.createRef() //富文本ref容器
    }

    /*初始化级联数组一级列表结构*/
    initoptions = async (categorys) => {
        //生成options数组
        const options = categorys.map(c=>({
           value: c._id,
           label: c.name,
           isLeaf:  false
        }))
        //如果修改是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {pCategoryId} = product
        if (isUpdate && pCategoryId!=='0') {
            //获取二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            //生成二级下拉列表
            const childOptions = subCategorys.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf:  true
            }))
            //找到当前商品对应的Option
            const targetOption = options.find(option=> option.value === pCategoryId)
            targetOption.children = childOptions
            this.setState({
                options: [...this.state.options],
            })
        }
        //更新状态
        this.setState({options})
    }

    /*获取以一级/二级列表分类并显示*/
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status===0) {
            const categorys = result.data
            //如果是一级分类列表
            if (parentId === '0') {
                this.initoptions(categorys)
            } else {
                //返回二级列表
                return categorys
            }

        }
    }

    // 设置金额的验证规则，不能为负数
    validatePrice = (rule, value, callback) => {
        if (value*1 > 0){
            callback() // 验证通过
        } else {
            callback('价格必须大于0')
        }
    };

    // 进行表单提交
    submit = () =>{
        //进行表单验证
        this.props.form.validateFields( async (error, values)=>{
            if (!error) {
                // 1 收集数据
                let pCategoryId,categoryId
                if (values.categoryIds.length === 1){
                    pCategoryId = '0'
                    categoryId = values.categoryIds[0]
                } else {
                    pCategoryId = values.categoryIds[0]
                    categoryId = values.categoryIds[1]
                }
                const product = {
                    _id:this.product._id,
                    imgs: this.pw.current.getImgs(),
                    name: values.name,
                    desc: values.desc,
                    price: values.price,
                    detail: this.dr.current.getDeitor(),
                    pCategoryId: pCategoryId,
                    categoryId: categoryId,
                }
                // 2 调用接口更新或者添加
                const result = await reqAddOrUpdataProuduct(product)
                // 3 根据结果提示
                if (result.status === 0){
                    if (this.isUpdate){
                        message.success('商品更新成功')
                    } else {
                        message.success('商品添加成功')
                    }
                    this.props.history.goBack()
                } else {
                    message.error('请求失败!')
                }
            }
        })
    }

    //级联模块
    onChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
    };
    /*用于加载下级列表的回调函数*/
    loadData = async selectedOptions => {
        //得到选择的option对象
        const targetOption = selectedOptions[selectedOptions.length - 1];
        //显示loading
        targetOption.loading = true;
        //根据选中分类获取下一级列表
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false;
        if (subCategorys && subCategorys.length > 0){
            //生成二级列表Options
            const childOptions = subCategorys.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf:  true
            }))
            targetOption.children = childOptions
        }  else {
            targetOption.isLeaf = true
        }
        // load options lazily
            //g更新
            this.setState({
                options: [...this.state.options],
            })
    };
/*同步初始化*/
    componentWillMount() {
        //取出携带的state
        const product = this.props.location.state //若果是添加则有值，否则无值
        //保存是否为更新的标识
        this.isUpdate = !!product
        // 保存商品数据，如果没有则为空对象
        this.product = product || {}
    }

    /*异步获取*/
    componentDidMount() {
        this.getCategorys('0')
    }

    render() {
        const {isUpdate, product} = this
        const { getFieldDecorator } = this.props.form;
        const title = (
            <span>
                <Button type='link' onClick={()=>this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{color:'green',marginRight:20}}/>
                </Button>
                <span>
                    {isUpdate===true ?'商品修改': '商品添加'}
                </span>
            </span>
        )
        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='商品名称'>
                        {getFieldDecorator('name', {
                            initialValue: product.name,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入商品名称',
                                },
                            ],
                        })(<Input placeholder="请输入商品名称" />)}
                    </Item>
                    <Item label='商品描述'>
                        {getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入商品描述',
                                },
                            ],
                        })(<TextArea placeholder="请输入商品描述" />)}
                    </Item>
                    <Item label='商品价格'>
                        {getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入商品价格',
                                },
                                {
                                    validator: this.validatePrice,
                                }
                            ],
                        })(<Input type='number' addonAfter='￥' placeholder="请输入商品价格" />)}
                    </Item>
                    <Item label='商品分类'>
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: [product.pCategoryId, product.categoryId],
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择商品分类',
                                    }
                                ],
                            })(<Cascader
                                options={this.state.options}
                                loadData={this.loadData}/*需要显示的列表数据*/
                                onChange={this.onChange}/*当选择某个列表项，加载下一集列表的监听回调*/
                                changeOnSelect
                            />)
                        }

                    </Item>
                    <Item label='商品图片'>
                        <PicturesWall ref={this.pw} imgs={product.imgs}></PicturesWall>
                    </Item>
                    <Item label='商品详情' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextDeitor ref={this.dr} detail={product.detail}/>
                    </Item>
                    <Button type='primary' onClick={this.submit}>
                        提交
                    </Button>
                </Form>
            </Card>
         )
    }
}
const WrappedNormalAddForm = Form.create()(ProductAdd);
export  default WrappedNormalAddForm
