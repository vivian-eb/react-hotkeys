'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _HotKeys = require('./HotKeys');

var _HotKeys2 = _interopRequireDefault(_HotKeys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * withHotKeys is an HOC that provides the wrappedComponent with the ability to implement keyboard actions
 * without the user wrapping every component with a <HotKeys> component individually
 *
 * See examples/master/HOCWrappedNode.js for an example implementation
 * Follow the steps below to use the HOC:
 *
 * @example <caption>Example usage of withHotKeys.</caption>
 * // Returns the HOC-wrapped component.
 * // 1. Declared a key map that with the actionName as key and keyboardKeys as values
 * const ACTION_KEY_MAP = {
 *     'logConsole' : 'down',
 * };
 *
 * class BasicBox extends React.Component {
 *
 * // 2. declare 'hotKeyHandlers' within the Component's class definition
 *   hotKeyHandlers: {
 *     'logConsole': this.logConsole.bind(this),
 *   }
 *
 *   logConsole() {
 *     console.log('a hotkey is pressed');
 *   }
 *
 *   render() {
 *     return (
 *         <div tabIndex="0">
 *             Press the down arrow
 *         </div>
 *     );
 *   }
 * }
 *
 * // 3. Wrap the Component with withHotKeys
 * export default withHotKeys(ACTION_KEY_MAP)(BasicBox);
 * @returns {function} Returns the HOC-wrapped component.
 *
 * @param {Object} keyMap an action-to-keyboard-key mapping
 * @summary An HOC that provides the wrappedComponent with the ability to implement keyboard actions
 */
var withHotKeys = function withHotKeys(keyMap) {
  return function (Component) {
    return function (_PureComponent) {
      _inherits(HotKeysWrapper, _PureComponent);

      function HotKeysWrapper(props) {
        _classCallCheck(this, HotKeysWrapper);

        var _this = _possibleConstructorReturn(this, (HotKeysWrapper.__proto__ || Object.getPrototypeOf(HotKeysWrapper)).call(this, props));

        _this._setRef = _this._setRef.bind(_this);
        _this.state = {
          handlers: {}
        };
        return _this;
      }

      _createClass(HotKeysWrapper, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.setState({ handlers: this._ref.hotKeyHandlers });
        }
      }, {
        key: '_setRef',
        value: function _setRef(node) {
          this._ref = node;
        }
      }, {
        key: 'render',
        value: function render() {
          var handlers = this.state.handlers;

          // Setting component as documentfragment to avoid unexpected stylistic changes to the wrapped component

          return _react2.default.createElement(
            _HotKeys2.default,
            { component: 'document-fragment', keyMap: keyMap, handlers: handlers },
            _react2.default.createElement(Component, _extends({
              ref: this._setRef
            }, this.props))
          );
        }
      }]);

      return HotKeysWrapper;
    }(_react.PureComponent);
  };
};

exports.default = withHotKeys;