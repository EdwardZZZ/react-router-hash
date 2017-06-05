'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _matchUrl = require('match-url');

var _matchUrl2 = _interopRequireDefault(_matchUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var utils = {
    getHash: function getHash() {
        return window.location.hash.substr(1);
    },


    type: function type(obj) {
        return Object.prototype.toString.call(obj).toLowerCase();
    },

    isArray: function isArray(obj) {
        return Array.isArray ? Array.isArray(obj) : utils.type(obj) === '[object Array]';
    }
};

var _class = function (_Component) {
    _inherits(_class, _Component);

    function _class(props) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

        _this.state = {
            error: false,
            route: utils.getHash()
        };
        return _this;
    }

    _createClass(_class, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _props = this.props,
                __default = _props.__default,
                __root = _props.__root,
                __error = _props.__error,
                children = _props.children,
                routers = _props.routers,
                _routers = { __default: __default, __root: __root, __error: __error };

            if (children) {
                this.addToRouters(_routers, '', children);
            } else {
                _extends(_routers, routers);
            }
            this.routers = _routers;
            this.matchRoutes = [];
            this.matchRouter(this.state.route);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            window.addEventListener('hashchange', function () {
                _this2.setState({
                    error: false,
                    route: utils.getHash()
                });
            });
        }
    }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate(nextProps, nextState) {
            if (nextState.error) {
                this.Component = this.routers['__error'];
                if (!this.Component) throw new Error('This router\'config has not  "__error" word.');
            }
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
        key: 'render',
        value: function render() {
            var _this3 = this;

            if (!this.Component) throw new Error('This route has not match component.', this.state.route);
            if (!this.state.error) this.routeProps.toErrorPage = function () {
                _this3.setState({ error: true });
            };
            return _react2.default.createElement(this.Component, this.routeProps);
        }
    }, {
        key: 'addToRouters',
        value: function addToRouters(routers, path, children) {
            var _this4 = this;

            if (!children) return [].concat(_toConsumableArray(children)).forEach(function (router) {
                var _path = path + router.props.path;
                routers[_path] = router.type;
                _this4.addToRouters(routers, _path, router.props.children);
            });
        }
    }, {
        key: 'matchRouter',
        value: function matchRouter(route) {
            var _routers = this.routers,
                _route = route === void 0 || route === '' || route === '/' ? '__root' : route,
                Component = _routers[_route],
                routeParams = {},
                matchRoutesLen = this.matchRoutes.length;

            if (!Component && matchRoutesLen !== 0) {
                for (var i = 0; i < matchRoutesLen; i++) {
                    var _matchRoutes$i = this.matchRoutes[i],
                        paramReg = _matchRoutes$i.paramReg,
                        paramKeys = _matchRoutes$i.paramKeys,
                        component = _matchRoutes$i.component;

                    routeParams = _matchUrl2.default.matchResult(_route, paramKeys, paramReg);
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
                        ret = _matchUrl2.default.getRegAndKeys(_routeKey, this.props.sign);

                    if (!ret) continue;
                    var paramReg = ret.paramReg,
                        paramKeys = ret.paramKeys,
                        component = _routers[_routeKey];

                    this.matchRoutes.push({ paramReg: paramReg, paramKeys: paramKeys, component: component });

                    delete _routers[_routeKey];

                    routeParams = _matchUrl2.default.matchResult(_route, paramKeys, paramReg);
                    if (routeParams) {
                        Component = component;
                        break;
                    }
                }
            }

            if (!Component) {
                Component = _routers['__default'];
            }

            if (route.indexOf('?') > -1 && !routeParams.params) {
                routeParams.params = route.substr(route.indexOf('?') + 1);
            }

            this.Component = Component;
            this.routeProps = routeParams;
        }
    }]);

    return _class;
}(_react.Component);

exports.default = _class;
