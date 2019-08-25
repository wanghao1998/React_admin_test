/*左侧导航菜单模块*/

const menuList = [
    {
        title: '首页', //菜 单 标 题 名 称
        key: '/home', //对 应 的 path
        icon: 'home', //图 标 名 称
        isPublic: true,
    },
    {
        title: '商品',
        key: '/products',
        icon: 'appstore',
        children: [ // 子 菜 单 列 表 { title: '品类管理', key: '/category', icon: 'bars' }, { title: '商品管理', key: '/product', icon: 'tool' }, ] },
            {
                title: '品类管理',
                key: '/category',
                icon: 'bars'
            },
            { title: '商品管理',
                key: '/product',
                icon: 'tool',
            }
        ]
    },
    {
        title: '用户管理', //菜 单 标 题 名 称
        key: '/user', //对 应 的 path
        icon: 'user', //图 标 名 称
    },
    {
        title: '角色管理', //菜 单 标 题 名 称
        key: '/role', //对 应 的 path
        icon: 'safety-certificate', //图 标 名 称
    },
    {
        title: '图形图表',
        key: '/charts',
        icon: 'area-chart',
        children: [
            {
                title: '柱形图',
                key: '/charts/bar',
                icon: 'bar-chart'
            },
            {
                title: '折线图',
                key: '/charts/line',
                icon: 'line-chart'
            },
            {
                title: '饼图',
                key: '/charts/pie',
                icon: 'pie-chart'
            }
        ]
    },
]

export default menuList
