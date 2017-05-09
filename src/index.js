import React, { Component } from 'react'
import match from 'match-url'

const utils = {
    getHash() {
        return window.location.hash.substr(1)
    },

    type: function(obj) {
        return Object.prototype.toString.call(obj).toLowerCase();
    },

    isArray(obj) {
        return Array.isArray ? Array.isArray(obj) : utils.type(obj) === '[object Array]';
    }
}

export default class extends Component {
    constructor(props) {
        super();
        this.state = {
            error: false,
            route: utils.getHash()
        }
    }

    componentWillMount() {
        const { __default, __root, __error, children, routers } = this.props,
            _routers = { __default, __root, __error }
        if (children) {
            this.addToRouters(_routers, '', children)
        } else {
            Object.assign(_routers, routers)
        }
        this.routers = _routers
        this.matchRoutes = []
        this.matchRouter(this.state.route)
    }

    componentDidMount() {
        window.addEventListener('hashchange', () => {
            this.setState({
                error: false,
                route: utils.getHash()
            })
        })
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.error) {
            this.Component = this.routers['__error']
            if (!this.Component) throw new Error('This router\'config has not  "__error" word.')
        }
    }

    shouldComponentUpdate(...props) {
        this.matchRouter(props[1].route)
        return !!this.Component
    }

    render() {
        if (!this.Component) throw new Error('This route has not match component.', this.state.route)
        if (!this.state.error) this.routeProps.toErrorPage = () => { this.setState({ error: true }); }
        return React.createElement(this.Component, this.routeProps)
    }

    addToRouters(routers, path, children) {
        if (!children) return [...children].forEach((router) => {
            const _path = path + router.props.path
            routers[_path] = router.type
            this.addToRouters(routers, _path, router.props.children)
        })
    }

    matchRouter(route) {
        let _routers = this.routers,
            _route = (route === void 0 || route === '' || route === '/') ? '__root' : route,
            Component = _routers[_route], // 直接匹配返回
            routeParams = {}, // 返回的参数对象
            matchRoutesLen = this.matchRoutes.length

        // 匹配已经转换成正则的路由路径
        if (!Component && matchRoutesLen !== 0) {
            for (let i = 0; i < matchRoutesLen; i++) {
                let { paramReg, paramKeys, component } = this.matchRoutes[i]
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
                let { paramReg, paramKeys } = ret, component = _routers[_routeKey]
                this.matchRoutes.push({ paramReg, paramKeys, component })

                delete _routers[_routeKey] // 删除已转换正则的路由路径

                routeParams = match.matchResult(_route, paramKeys, paramReg)
                if (routeParams) {
                    Component = component
                    break
                }
            }
        }

        // 未匹配到时匹配默认的
        if (!Component) {
            Component = _routers['__default']
        }

        // 添加路径参数
        if (route.indexOf('?') > -1 && !routeParams.params) {
            routeParams.params = route.substr(route.indexOf('?') + 1)
        }

        this.Component = Component
        this.routeProps = routeParams
    }
}