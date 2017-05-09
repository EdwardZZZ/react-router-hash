
# react-router-hash

A minimal router for react app, only supports hash url

React极简路由，仅支持hash url,可以采用两种方式进行路由配置，其中第二种配置必须在Router节点上配置sign="colon"

支持简单正则格式，例如数字，这样在组件中获取的参数也是数字


## config   这三个参数都可以配置在Router根节点中

### config
```
__root  配置根路由，也hash值为空时展示的页面 
__default 配置默认路由，路由匹配失败时展示的页面，不配置时页面不跳转 
__error  配置错误页面，当页面中调用this.props.toErrorPage()方法时展示的错误页面 
```

### props
```
__params 获取hash url的参数，例如#a?a=1 中，this.props.__params 为 a=1
其它路由参数是按别名获取，例如配置path={a}, 实际路径为/index，this.props.a的值是'index'
```

## 第一种 支持嵌套格式
```javascript
render((
    <Router __root={Login} __default={Login} __error={Error}>    /*__root配置根地址*/
        <List path="list">
            <List path="/{pn:\\d+}">
        </List>
        <Detail path="detail/{id:\\d+}">
        <Aboutus path="aboutus" >
            <Aboutus path="/{a}" >  /* switch a 可以根据a值在Aboutus内做逻辑操作 */
                <Aboutus path="/{b}" />
            </Aboutus>
            <Aboutus path="/{a}/{c}/d" />
        </Aboutus>
    </Router>
), document.getElementById('app'));
```

## 第二种 
```javascript
let routers = {
    '__root': Login,     /*  '/'配置根地址 */
    'list': List,
    // 'list/:pn': List,
    'list/:pn(\\d+)': List,
    'aboutus':Aboutus,
    'aboutus/:a(\\S+)':Aboutus,     // switch a 根据a值在Aboutus内做逻辑操作
    '__default': Login,                // default config
    '__error': Error
}
render((
    <Router routers={routers} sign="colon" />
), document.getElementById('app'));
```


## Usage 用法

```javascript
import Router from 'react-router-hash';

import Login from './components/Login';
import List from './components/List';
import Detail from './components/Detail';
import Aboutus from './components/Aboutus';

let routers = {
    '__root': Login,
    'list': List,
    'list/{pn}': List,
    // 'list/{pn:\\d+}': List,
    'detail/{id}': Detail,
    'detail/{id}/': Detail,
    'aboutus':Aboutus,
    'aboutus/{a:\\S+}':Aboutus,
    '__default': Login,
    '__error': Error
}

render((
    <div>
        <div>
            <a href="#">login</a>
            <a href="#list">list</a>
            <a href="#aboutus">aboutus</a>
        </div>
        <Router routers={routers} />
    </div>
), document.getElementById('app'));

//List.jsx
export default class List extends React.Component {
    constructor(props) {
        super();

        // to error page
        // this.props.toErrorPage();
    }

    render(){
        // get pn value
        console.log(this.props.pn)
        // get hash params
        console.log(this.props.params)
    }
}

```

