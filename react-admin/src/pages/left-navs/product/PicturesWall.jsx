/*图片上传组件*/
import React,{Component} from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import PropTypes from 'prop-types'

import {reqDeleteImg} from '../../../ajax/index'
import {BASE_IMG_URL} from "../../../utils/constants";

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends Component {
    static propTypes = {
        imgs:PropTypes.array
    }
    constructor (props) {
        super(props)

        let fileList = []

        //如果传入imgs属性
        const {imgs} = this.props
        if (imgs && imgs.length>0) {
            fileList = imgs.map((img, index)=>({
                uid: -index, //每一个file需要有自己的id
                name: img,
                status: 'done', //图片状态状态有：uploading done error removed
                url: BASE_IMG_URL+img,
            }))
        }

        this.state = {
            previewVisible: false,//标识是否显示大图预览
            previewImage: '',// 大图的url
            fileList
        }
    }

    /*获取所有已上传图片文件名的数组*/
    getImgs = () => {
        return this.state.fileList.map(file=>file.name)
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        //显示指定的file对应的大图
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    /*
    file:当前操作的图片（上传删除）
    fileList：所有已上传图片数组*/
    handleChange = ({ file, fileList }) => {
        //一旦上传成功，将当前上传的file信息修正（name，url）
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                message.success('上传图片成功')
                const {name, url} = result.data
                file = fileList[fileList.length-1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        } else if (file.status === 'removed') {
            this.DeleteImg(file.name)
        }

        this.setState({ fileList });
    }
    DeleteImg = async (name) =>{
        const result = await reqDeleteImg(name)
        if (result.status === 0) {
            message.success('图片删除成功')
        } else {
            message.error('删除图片失败')
        }
    }
    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload" /*上传地址*/
                    accept=".xbm,.bmp,.jpeg,.jpg,.png" /*可接受图片样式*/
                    name='image'/*请求参数名*/
                    listType="picture-card" /*卡片样式*/
                    fileList={fileList} /*所有已上传图片文件对象的数组*/
                    onPreview={this.handlePreview} /*显示指定file对应的大图*/
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
