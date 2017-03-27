var React = require('react')
var ReactDom = require('react-dom')

var match = require('match-url')

require('./Assign')

var utils = {
    getHash: function () {
        return window.location.hash.substr(1)
    },

    isArray: function (obj) {
        return Array.isArray ? Array.isArray(obj) : Util.type(obj) === '[object Array]';
    },

    toArray: function (obj) {
        if (!obj || utils.isArray(obj)) {
            return obj
        }
        return new Array(obj)
    },
}

var Router = React.createClass({
    getInitialState: function () {
        return {
            route: util.getHash()
        }
    },

    addToRouters: function (routers, path, children) {
        if (!children) return
        var self = this
        utils.toArray(children).forEach(function (router) {
            var _path = path + router.props.path
            routers[_path] = router.type
            self.addToRouters(routers, _path, router.props.children)
        })
    },

    componentWillMount: function () {
        var _routers = {}, self = this
        if (self.props.children) {
            _routers.default = self.props.default
            self.addToRouters(_routers, '', self.props.children)
        } else {
            Object.assign(_routers, self.props.routers)
        }
        self.routers = _routers
        self.matchRoutes = []
        self.matchRouter(this.state.route)
    },

    componentDidMount: function () {
        var self = this
        window.addEventListener('hashchange', function () {
            self.setState({
                route: utils.getHash()
            })
        })
    },

    shouldComponentUpdate: function () {
        this.matchRouter(arguments[1].route)
        return !!this.Component
    },

    matchRouter: function (route) {
        var _routers = this.routers, 
            _route = (route === void 0 || route === '') ? '/' : route,
            Component = _route ? _routers[_route] : _routers['/'],
            routeParams = {},
            matchRoutesLen = this.matchRoutes.length

        if (!Component && matchRoutesLen !== 0) {
            for (var i = 0; i < matchRoutesLen; i++) {
                var _router = this.matchRoutes[i],
                    paramReg = _router.paramReg, paramKeys = _router.paramKeys, component = _router.component,
                    routeParams = match.matchResult(_route, paramKeys, paramReg)
                if (routeParams) {
                    Component = component
                    break
                }
            }
        }

        if (!Component) {
            var _routesKeys = Object.keys(_routers)
            for (var i = 0, len = _routesKeys.length; i < len; i++) {
                var _routeKey = _routesKeys[i],
                    ret = match.getRegAndKeys(_routeKey, this.props.sign)

                if (!ret) continue
                var paramReg = ret.paramReg, paramKeys = ret.paramKeys, component = _routers[_routeKey]
                this.matchRoutes.push({ paramReg: paramReg, paramKeys: paramKeys, component: component })

                delete _routers[_routeKey]

                var routeParams = match.matchResult(_route, paramKeys, paramReg)
                if (routeParams) {
                    Component = component
                    break
                }
            }
        }

        if (!Component) {
            Component = _routers['default']
        }

        this.Component = Component
        this.routeParams = routeParams
    },

    render: function () {
        if(!this.Component)throw new Error('This route has not match component.', this.state.route)
        return React.createElement(this.Component, this.routeParams)
    }
})

module.exports = Router