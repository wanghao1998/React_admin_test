import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'
import {connect} from 'react-redux'

import './header.less'
import {formateDate} from '../../utils/dateUtils'
import {reqWeather} from '../../ajax/index'
import LinkButton from '../link-but/linkButton'
import {logout} from '../../redux/actions'

const { confirm } = Modal;

class Header extends Component{
    state = {
        currentTime: formateDate(Date.now()), // 当前时间的字符串
        dayPictureUrl: '',//天气图片
        weather:''//温度
    };
    //获取时间
    getTime = () => {
        this.gettimes = setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    };
    getWeather = async () => {
        //获取天气
        const {dayPictureUrl, weather} = await reqWeather('禹州')
        this.setState({dayPictureUrl, weather})
    };
    /*使用redux后不再需要手动获取
    getTitle = () => {
        //得到当前请求路径
        const path = this.props.location.pathname
        //找到title
        let title
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            }
            else if (item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }*/
    //退出框
    logout = () => {
        confirm({
            content: '确定退出吗',
            onOk: () => {
               this.props.logout()
            }
        });
    }
    componentDidMount() {
        //在此执行异步操作
        //动态获取当前时间
        this.getTime()
        //发送请求获取天气
        this.getWeather()
    }
    componentWillUnmount() {
        //在当前组件死亡之前调用
        clearInterval(this.gettimes)
    }

    render() {
        const user = this.props.user

        const {currentTime, dayPictureUrl, weather} = this.state
        const title = this.props.headTitle
        return (
            <div className="header">
                <div className='header-top'>
                    <span>欢迎, {user.username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        <span>{title}</span>
                    </div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt=""/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
         )
    }
}
export default connect(
    state => ({headTitle:state.headTitle, user:state.user}),{logout}
)(withRouter(Header))
