'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var match = require('match-url');

var utils = {
    getHash: function getHash() {
        return window.location.hash.substr(1);
    },
    isArray: function isArray(obj) {
        return Array.isArray ? Array.isArray(obj) : Util.type(obj) === '[object Array]';
    },
    toArray: function toArray(obj) {
        if (!obj || utils.isArray(obj)) {
            return obj;
        }
        return new Array(obj);
    }
};

var _class = function (_Component) {
    _inherits(_class, _Component);

    function _class(props) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

        _this.state = {
            route: utils.getHash()
        };
        return _this;
    }

    _createClass(_class, [{
        key: 'addToRouters',
        value: function addToRouters(routers, path, children) {
            var _this2 = this;

            if (!children) return;
            utils.toArray(children).forEach(function (router) {
                var _path = path + router.props.path;
                routers[_path] = router.type;
                _this2.addToRouters(routers, _path, router.props.children);
            });
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _routers = {},
                self = this;
            if (self.props.children) {
                _routers.default = self.props.default;
                self.addToRouters(_routers, '', self.props.children);
            } else {
                Object.assign(_routers, self.props.routers);
            }
            self.routers = _routers;
            self.matchRoutes = [];
            self.matchRouter(this.state.route);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this3 = this;

            window.addEventListener('hashchange', function () {
                _this3.setState({
                    route: utils.getHash()
                });
            });
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate() {
            for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
                props[_key] = arguments[_key];
            }

            this.matchRouter(props[1].route);
            return !!this.Component;
        }
    }, {
        key: 'matchRouter',
        value: function matchRouter(route) {
            var _routers = this.routers,
                _route = route === void 0 || route === '' ? '/' : route,
                Component = _route ? _routers[_route] : _routers['/'],
                routeParams = {},
                matchRoutesLen = this.matchRoutes.length;

            if (!Component && matchRoutesLen !== 0) {
                for (var i = 0; i < matchRoutesLen; i++) {
                    var _matchRoutes$i = this.matchRoutes[i],
                        paramReg = _matchRoutes$i.paramReg,
                        paramKeys = _matchRoutes$i.paramKeys,
                        component = _matchRoutes$i.component;

                    routeParams = match.matchResult(_route, paramKeys, paramReg);
                    if (routeParams) {
                        Component = component;
                        break;
                    }
                }
            }

            if (!Component) {
                var _routesKeys = Object.keys(_routers);
                for (var _i = 0, len = _routesKeys.length; _i < len; _i++) {
                    var _routeKey = _routesKeys[_i],
                        ret = match.getRegAndKeys(_routeKey, this.props.sign);

                    if (!ret) continue;
                    var paramReg = ret.paramReg,
                        paramKeys = ret.paramKeys,
                        component = _routers[_routeKey];

                    this.matchRoutes.push({ paramReg: paramReg, paramKeys: paramKeys, component: component });

                    delete _routers[_routeKey];

                    routeParams = match.matchResult(_route, paramKeys, paramReg);
                    if (routeParams) {
                        Component = component;
                        break;
                    }
                }
            }

            if (!Component) {
                Component = _routers['default'];
            }

            if (route.indexOf('?') > -1 && !routeParams.params) {
                routeParams.params = route.substr(route.indexOf('?') + 1);
            }

            this.Component = Component;
            this.routeParams = routeParams;
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.Component) throw new Error('This route has not match component.', this.state.route);
            return _react2.default.createElement(this.Component, this.routeParams);
        }
    }]);

    return _class;
}(_react.Component);

exports.default = _class;
