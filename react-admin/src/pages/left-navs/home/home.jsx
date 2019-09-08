/*
* 首页路由*/
import React,{Component} from 'react'
import {Card, Statistic,Row, Col, Icon, Timeline} from 'antd'
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Legend,
} from "bizcharts"

import './home.less'
export  default class Home extends Component{
    state = {
        noTitleKey: 'app',
    };
    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState({ [type]: key });
    };
    render() {
        const data = [
            {
                month: "Jan",
                city: "Tokyo",
                temperature: 7
            },
            {
                month: "Jan",
                city: "London",
                temperature: 3.9
            },
            {
                month: "Feb",
                city: "Tokyo",
                temperature: 6.9
            },
            {
                month: "Feb",
                city: "London",
                temperature: 4.2
            },
            {
                month: "Mar",
                city: "Tokyo",
                temperature: 9.5
            },
            {
                month: "Mar",
                city: "London",
                temperature: 5.7
            },
            {
                month: "Apr",
                city: "Tokyo",
                temperature: 14.5
            },
            {
                month: "Apr",
                city: "London",
                temperature: 8.5
            },
            {
                month: "May",
                city: "Tokyo",
                temperature: 18.4
            },
            {
                month: "May",
                city: "London",
                temperature: 11.9
            },
            {
                month: "Jun",
                city: "Tokyo",
                temperature: 21.5
            },
            {
                month: "Jun",
                city: "London",
                temperature: 15.2
            },
            {
                month: "Jul",
                city: "Tokyo",
                temperature: 25.2
            },
            {
                month: "Jul",
                city: "London",
                temperature: 17
            },
            {
                month: "Aug",
                city: "Tokyo",
                temperature: 26.5
            },
            {
                month: "Aug",
                city: "London",
                temperature: 16.6
            },
            {
                month: "Sep",
                city: "Tokyo",
                temperature: 23.3
            },
            {
                month: "Sep",
                city: "London",
                temperature: 14.2
            },
            {
                month: "Oct",
                city: "Tokyo",
                temperature: 18.3
            },
            {
                month: "Oct",
                city: "London",
                temperature: 10.3
            },
            {
                month: "Nov",
                city: "Tokyo",
                temperature: 13.9
            },
            {
                month: "Nov",
                city: "London",
                temperature: 6.6
            },
            {
                month: "Dec",
                city: "Tokyo",
                temperature: 9.6
            },
            {
                month: "Dec",
                city: "London",
                temperature: 4.8
            }
        ];
        const cols = {
            month: {
                range: [0, 1]
            }
        };
        const tabListNoTitle = [
            {
                key: 'article',
                tab: '访问量',
            },
            {
                key: 'app',
                tab: '销售量',
            },
        ];
        const contentListNoTitle = {
            article: <p>article content</p>,
            app: (<Timeline>
                <Timeline.Item color="green">新版本迭代会</Timeline.Item>
                <Timeline.Item color="green">完成网站设计初版</Timeline.Item>
                <Timeline.Item color="red">
                    <p>联调接口</p>
                    <p>功能验收</p>
                </Timeline.Item>
                <Timeline.Item>
                    <p>登录功能设计</p>
                    <p>权限验证</p>
                    <p>页面排版</p>
                </Timeline.Item>
            </Timeline>),
        };
        return (
            <div className='home'>
                <Row style={{width:'100%'}} gutter={32}>
                    <Col span={6}>
                        <Card title='商品总量' style={{marginLeft:'30px', marginTop:'20px'}}>
                            <Row>
                                <Statistic  value={112893} />
                            </Row>
                            <Row>
                                <Statistic
                                    title=""
                                    value={11.28}
                                    precision={2}
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<span>周同比<Icon type="arrow-up" /></span>}
                                    suffix="%"
                                />
                            </Row>
                            <Row>
                                <Statistic
                                title=""
                                value={9.28}
                                precision={2}
                                valueStyle={{ color: 'red' }}
                                prefix={<span>日同比<Icon type="arrow-down" /></span>}
                                suffix="%"
                                />
                            </Row>
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Chart height={300} data={data} scale={cols} forceFit>
                            <Legend />
                            <Axis name="month" />
                            <Axis
                                name="temperature"
                                label={{
                                    formatter: val => `${val}万个`
                                }}
                            />
                            <Tooltip
                                crosshairs={{
                                    type: "y"
                                }}
                            />
                            <Geom
                                type="line"
                                position="month*temperature"
                                size={2}
                                color={"city"}
                                shape={"smooth"}
                            />
                            <Geom
                                type="point"
                                position="month*temperature"
                                size={4}
                                shape={"circle"}
                                color={"city"}
                                style={{
                                    stroke: "#fff",
                                    lineWidth: 1
                                }}
                            />
                        </Chart>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card
                            style={{ width: '95%', margin:'auto' }}
                            tabList={tabListNoTitle}
                            activeTabKey={this.state.noTitleKey}
                            extra={<a href="#">6666</a>}
                            onTabChange={key => {
                                this.onTabChange(key, 'noTitleKey');
                            }}
                        >
                            {contentListNoTitle[this.state.noTitleKey]}
                        </Card>
                    </Col>

                </Row>

            </div>
         )
    }
}
