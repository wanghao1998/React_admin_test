/*富文本编辑器*/
import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState} from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import PropTypes from "prop-types"



 export default class RichTextDeitor extends Component {
     static propTypes = {
         detail:PropTypes.string
     }

     constructor(props) {
         super(props);
         const html = this.props.detail;
         if (html) {//若果有值
             const contentBlock = htmlToDraft(html);
             if (contentBlock) {
                 const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                 const editorState = EditorState.createWithContent(contentState);
                 this.state = {
                     editorState,
                 };
             }
         } else {
             this.state = {
                 editorState: EditorState.createEmpty(),//创建一个没有内容的编辑对象
             };
         }
     }
    /*父组件获取文本的方法*/
     getDeitor = () => {
         return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
     };

    onEditorStateChange = (editorState) => {
        console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        this.setState({
            editorState,
        })
    };

     uploadImageCallBack = (file) => {
         return new Promise(
             (resolve, reject) => {
                 const xhr = new XMLHttpRequest();
                 xhr.open('POST', '/manage/img/upload');
                 xhr.setRequestHeader('image', 'Client-ID XXXXX');
                 const data = new FormData();
                 data.append('image', file);
                 xhr.send(data);
                 xhr.addEventListener('load', () => {
                     const response = JSON.parse(xhr.responseText);
                     const url = response.data.url
                     resolve({data:{link: url}});
                 });
                 xhr.addEventListener('error', () => {
                     const error = JSON.parse(xhr.responseText);
                     reject(error);
                 });
             }
         );
     }
    render() {
        const { editorState } = this.state;

        return (
            <div>
                <Editor
                    editorState={editorState}
                    editorStyle={{border:"1px solid black", height: 200, padding:10}}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        inline: { inDropdown: true },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        link: { inDropdown: true },
                        history: { inDropdown: true },
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />
            </div>
        );
    }
}
