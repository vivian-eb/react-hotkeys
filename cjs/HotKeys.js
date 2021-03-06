'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _FocusTrap = require('./FocusTrap');

var _FocusTrap2 = _interopRequireDefault(_FocusTrap);

var _lodash = require('lodash.isboolean');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isobject');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.isequal');

var _lodash6 = _interopRequireDefault(_lodash5);

var _sequencesFromKeyMap = require('./utils/sequencesFromKeyMap');

var _sequencesFromKeyMap2 = _interopRequireDefault(_sequencesFromKeyMap);

var _hasChanged = require('./utils/hasChanged');

var _hasChanged2 = _interopRequireDefault(_hasChanged);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A string or list of strings, that represent a sequence of one or more keys
 * @typedef {String | Array.<String>} MouseTrapKeySequence
 * @see {@link https://craig.is/killing/mice} for support key sequences
 */

/**
 * Name of a key event
 * @typedef {'keyup'|'keydown'|'keypress'} KeyEventName
 */

/**
 * Options for the mapping of a key sequence and event
 * @typedef {Object} KeyEventOptions
 * @property {MouseTrapKeySequence} The key sequence required to satisfy a KeyEventMatcher
 * @property {KeyEventName} action The keyboard state required to satisfy a KeyEventMatcher
 */

/**
 * A matcher used on keyboard sequences and events to trigger handler functions
 * when matching sequences occur
 * @typedef {MouseTrapKeySequence | KeyMapOptions | Array<MouseTrapKeySequence>} KeyEventMatcher
 */

/**
 * A unique key to associate with KeyEventMatchers that allows associating handler
 * functions at a later stage
 * @typedef {String} ActionName
 */

/**
 * A mapping from ActionNames to KeyEventMatchers
 * @typedef {Object.<String, KeyEventMatcher>} KeySequence
 */

/**
 * Component that wraps it children in a "focus trap" and allows key events to
 * trigger function handlers when its children are in focus
 */
var HotKeys = function (_Component) {
  _inherits(HotKeys, _Component);

  function HotKeys(props, context) {
    _classCallCheck(this, HotKeys);

    /**
     * The focus and blur handlers need access to the current component as 'this'
     * so they need to be bound to it when the component is instantiated
     */

    var _this = _possibleConstructorReturn(this, (HotKeys.__proto__ || Object.getPrototypeOf(HotKeys)).call(this, props, context));

    _this.onFocus = _this.onFocus.bind(_this);
    _this.onBlur = _this.onBlur.bind(_this);
    return _this;
  }

  /**
   * Constructs the context object that contains references to this component
   * and its KeyMap so that they may be accessed by any descendant HotKeys
   * components
   * @returns {{hotKeyParent: HotKeys, hotKeyMap: KeySequence}} Child context object
   */


  _createClass(HotKeys, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        hotKeyParent: this,
        hotKeyMap: this.__hotKeyMap__
      };
    }

    /**
     * Sets this components KeyMap from its keyMap prop and the KeyMap of its
     * ancestor KeyMap component (if one exists)
     */

  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.updateMap();
    }

    /**
     * Updates this component's KeyMap if either its own keyMap prop has changed
     * or its ancestor's KeyMap has been update
     *
     * @returns {boolean} Whether the KeyMap was updated
     */

  }, {
    key: 'updateMap',
    value: function updateMap() {
      var newMap = this.buildMap();

      if (!(0, _lodash6.default)(newMap, this.__hotKeyMap__)) {
        this.__hotKeyMap__ = newMap;

        return true;
      }

      return false;
    }

    /**
     * This component's KeyMap merged with that of its most direct ancestor that is a
     * HotKeys component. This component's mappings take precedence over those defined
     * in its ancestor.
     * @returns {KeySequence} This component's KeyMap merged with its HotKeys ancestor's
     */

  }, {
    key: 'buildMap',
    value: function buildMap() {
      var parentMap = this.context.hotKeyMap || {};
      var thisMap = this.props.keyMap || {};

      /**
       * TODO: This appears to only merge in the key maps of its most direct
       * ancestor - what about grandparent components' KeyMap's?
       */
      return _extends({}, parentMap, thisMap);
    }

    /**
     * This component's KeyMap
     * @returns {KeySequence} This component's KeyMap
     */

  }, {
    key: 'getMap',
    value: function getMap() {
      return this.__hotKeyMap__;
    }

    /**
     * Imports mousetrap and stores a reference to it on the this component
     */

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      // import is here to support React's server rendering as Mousetrap immediately
      // calls itself with window and it fails in Node environment
      var Mousetrap = require('mousetrap');

      /**
       * TODO: Not optimal - imagine hundreds of this component. We need a top level
       * delegation point for mousetrap
       */
      this.__mousetrap__ = new Mousetrap(this.props.attach || _reactDom2.default.findDOMNode(this));

      this.updateHotKeys(true);
    }

    /**
     * Updates this component's KeyMap and synchronises the handlers across to
     * Mousetrap after the component has been updated (passed new prop values)
     * @param {Object} prevProps The props used on the component's last render
     */

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this.updateHotKeys(false, prevProps);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.context.hotKeyParent) {
        this.context.hotKeyParent.childHandledSequence(null);
      }

      if (this.__mousetrap__) {
        this.__mousetrap__.reset();
      }
    }

    /**
     * Updates this component's KeyMap and synchronises the changes across
     * to Mouestrap
     * @param {Boolean} force Whether to force an update of the KeyMap and sync
     *        to Mousetrap, even if no relevant values appear to have changed
     *        since the last time
     * @param {Object} prevProps The props used on the component's last render
     */

  }, {
    key: 'updateHotKeys',
    value: function updateHotKeys() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var prevProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _props$handlers = this.props.handlers,
          handlers = _props$handlers === undefined ? {} : _props$handlers;
      var _prevProps$handlers = prevProps.handlers,
          prevHandlers = _prevProps$handlers === undefined ? handlers : _prevProps$handlers;


      var keyMapHasChanged = this.updateMap();

      if (force || keyMapHasChanged || (0, _hasChanged2.default)(handlers, prevHandlers)) {
        this.syncHandlersToMousetrap();
      }
    }

    /**
     * Synchronises the KeyMap and handlers applied to this component over to
     * Mousetrap
     */

  }, {
    key: 'syncHandlersToMousetrap',
    value: function syncHandlersToMousetrap() {
      var _this2 = this;

      var _props$handlers2 = this.props.handlers,
          handlers = _props$handlers2 === undefined ? {} : _props$handlers2;


      var hotKeyMap = this.getMap();
      var sequenceHandlers = [];
      var mousetrap = this.__mousetrap__;

      // Group all our handlers by sequence
      Object.keys(handlers).forEach(function (hotKey) {
        var handler = handlers[hotKey];

        var sequencesAsArray = (0, _sequencesFromKeyMap2.default)(hotKeyMap, hotKey);

        /**
         * TODO: Could be optimized as every handler will get called across every bound
         * component - imagine making a node a focus point and then having hundreds!
         */
        sequencesAsArray.forEach(function (sequence) {
          var action = void 0;

          var callback = function callback(event, sequence) {
            /**
             * Check we are actually in focus and that a child hasn't already
             * handled this sequence
             */
            var isFocused = (0, _lodash2.default)(_this2.props.focused) ? _this2.props.focused : _this2.__isFocused__;

            if (isFocused && sequence !== _this2.__lastChildSequence__) {
              if (_this2.context.hotKeyParent) {
                _this2.context.hotKeyParent.childHandledSequence(sequence);
              }

              return handler(event, sequence);
            }
          };

          if ((0, _lodash4.default)(sequence)) {
            action = sequence.action;
            sequence = sequence.sequence;
          }

          sequenceHandlers.push({ callback: callback, action: action, sequence: sequence });
        });
      });

      /**
       * TODO: Hard reset our handlers (probably could be more efficient)
       */
      mousetrap.reset();

      sequenceHandlers.forEach(function (_ref) {
        var sequence = _ref.sequence,
            callback = _ref.callback,
            action = _ref.action;
        return mousetrap.bind(sequence, callback, action);
      });
    }

    /**
     * Stores a reference to the last key sequence handled by the most direct
     * descendant HotKeys component, and passes that sequence to its own most
     * direct HotKeys ancestor for it to do the same.
     *
     * This reference is stored so that parent HotKeys components do not try
     * to handle a sequence that has already been handled by one of its
     * descendants.
     *
     * @param {KeyEventMatcher} sequence The sequence handled most recently by
     * a child HotKeys component
     */

  }, {
    key: 'childHandledSequence',
    value: function childHandledSequence() {
      var sequence = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this.__lastChildSequence__ = sequence;

      /**
       * Traverse up any hot key parents so everyone is aware a child has
       * handled a certain sequence
       */
      if (this.context.hotKeyParent) {
        this.context.hotKeyParent.childHandledSequence(sequence);
      }
    }

    /**
     * Renders the component's children wrapped in a FocusTrap with the necessary
     * props to capture keyboard events
     *
     * @returns {FocusTrap} FocusTrap with necessary props to capture keyboard events
     */

  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          keyMap = _props.keyMap,
          handlers = _props.handlers,
          focused = _props.focused,
          attach = _props.attach,
          children = _props.children,
          props = _objectWithoutProperties(_props, ['keyMap', 'handlers', 'focused', 'attach', 'children']);

      return _react2.default.createElement(
        _FocusTrap2.default,
        _extends({}, props, { onFocus: this.onFocus, onBlur: this.onBlur }),
        children
      );
    }

    /**
     * Updates the internal focused state and calls the onFocus prop if it is
     * defined
     */

  }, {
    key: 'onFocus',
    value: function onFocus() {
      this.__isFocused__ = true;

      if (this.props.onFocus) {
        var _props2;

        (_props2 = this.props).onFocus.apply(_props2, arguments);
      }
    }

    /**
     * Updates the internal focused state and calls the onBlur prop if it is
     * defined.
     *
     * Also registers a null sequence as being handled by this component with
     * its ancestor HotKeys.
     */

  }, {
    key: 'onBlur',
    value: function onBlur() {
      this.__isFocused__ = false;

      if (this.props.onBlur) {
        var _props3;

        (_props3 = this.props).onBlur.apply(_props3, arguments);
      }

      if (this.context.hotKeyParent) {
        this.context.hotKeyParent.childHandledSequence(null);
      }
    }
  }]);

  return HotKeys;
}(_react.Component);

HotKeys.propTypes = {
  /**
   * A map from action names to Mousetrap key sequences
   */
  keyMap: _propTypes2.default.object,

  /**
   * A map from action names to event handler functions
   */
  handlers: _propTypes2.default.object,

  /**
   * Whether HotKeys should behave as if it has focus in the browser,
   * whether it does or not - a way to force focus behaviour
   */
  focused: _propTypes2.default.bool,

  /**
   * The DOM element the keyboard listeners should be attached to
   */
  attach: _propTypes2.default.any,

  /**
   * Children to wrap within a focus trap
   */
  children: _propTypes2.default.node,

  /**
   * Function to call when this component gains focus in the browser
   */
  onFocus: _propTypes2.default.func,

  /**
   * Function to call when this component loses focus in the browser
   */
  onBlur: _propTypes2.default.func
};
HotKeys.childContextTypes = {
  /**
   * Reference to this instance of HotKeys so that any descendents are aware
   * that they are being rendered within another HotKeys component
   */
  hotKeyParent: _propTypes2.default.any,

  /**
   * Reference to this instance's KeyMap so that any descendents may merge it
   * into its own
   */
  hotKeyMap: _propTypes2.default.object
};
HotKeys.contextTypes = {
  /**
   * Reference to the most direct ancestor that is a HotKeys component (if one
   * exists) so that messages may be passed to it when necessary
   */
  hotKeyParent: _propTypes2.default.any,

  /**
   * Reference to the KeyMap of its most direct HotKeys ancestor, so that it may
   * be merged into this components
   */
  hotKeyMap: _propTypes2.default.object
};
exports.default = HotKeys;