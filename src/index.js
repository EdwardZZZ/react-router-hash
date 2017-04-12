import React, { Component } from 'react';

let match = require('match-url')

let utils = {
    getHash() {
        return window.location.hash.substr(1)
    },

    isArray(obj) {
        return Array.isArray ? Array.isArray(obj) : Util.type(obj) === '[object Array]';
    },

    toArray(obj) {
        if (!obj || utils.isArray(obj)) {
            return obj
        }
        return new Array(obj)
    },
}

export default class extends Component {
    constructor(props) {
        super();
        this.state = {
            route: utils.getHash()
        }
    }

    addToRouters(routers, path, children) {
        if (!children) return
        utils.toArray(children).forEach((router) => {
            let _path = path + router.props.path
            routers[_path] = router.type
            this.addToRouters(routers, _path, router.props.children)
        })
    }

    componentWillMount() {
        let _routers = {}, self = this
        if (self.props.children) {
            _routers.default = self.props.default
            self.addToRouters(_routers, '', self.props.children)
        } else {
            Object.assign(_routers, self.props.routers)
        }
        self.routers = _routers
        self.matchRoutes = []
        self.matchRouter(this.state.route)
    }

    componentDidMount() {
        window.addEventListener('hashchange', () => {
            this.setState({
                route: utils.getHash()
            })
        })
    }

    shouldComponentUpdate(...props) {
        this.matchRouter(props[1].route)
        return !!this.Component
    }

    matchRouter(route) {
        let _routers = this.routers, 
            _route = (route === void 0 || route === '') ? '/' : route,
            Component = _route ? _routers[_route] : _routers['/'],  // 直接匹配返回
            routeParams = {},   // 返回的参数对象
            matchRoutesLen = this.matchRoutes.length

        // 匹配已经转换成正则的路由路径
        if (!Component && matchRoutesLen !== 0) {
            for (let i = 0; i < matchRoutesLen; i++) {
                let {paramReg, paramKeys, component} = this.matchRoutes[i]
                    routeParams = match.matchResult(_route, paramKeys, paramReg)
                if (routeParams) {
                    Component = component
                    break
                }
            }
        }

        // 匹配未转换成正则的路由路径，同时将转换成路正则的路径添加到matchRoutes中
        if (!Component) {
            let _routesKeys = Object.keys(_routers)
            for (let i = 0, len = _routesKeys.length; i < len; i++) {
                let _routeKey = _routesKeys[i],
                    ret = match.getRegAndKeys(_routeKey, this.props.sign)

                if (!ret) continue
                let {paramReg, paramKeys} = ret, component = _routers[_routeKey]
                this.matchRoutes.push({ paramReg, paramKeys, component })

                delete _routers[_routeKey]  // 删除已转换正则的路由路径

                routeParams = match.matchResult(_route, paramKeys, paramReg)
                if (routeParams) {
                    Component = component
                    break
                }
            }
        }

        // 未匹配到时匹配默认的
        if (!Component) {
            Component = _routers['default']
        }

        // 添加路径参数
        if(route.indexOf('?') > -1 && !routeParams.params){
            routeParams.params = route.substr(route.indexOf('?') + 1)
        }

        this.Component = Component
        this.routeParams = routeParams
    }

    render() {
        if(!this.Component)throw new Error('This route has not match component.', this.state.route)
        return React.createElement(this.Component, this.routeParams)
        // return <this.Component {...this.routeParams} />
    }
}
