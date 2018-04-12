var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

export default function HotKeyMapMixin(hotKeyMap = {}) {

  return {

    contextTypes: {
      hotKeyMap: PropTypes.object
    },

    childContextTypes: {
      hotKeyMap: PropTypes.object
    },

    getChildContext() {
      return {
        hotKeyMap: this.__hotKeyMap__
      };
    },

    componentWillMount() {
      this.updateMap();
    },

    updateMap() {
      const newMap = this.buildMap();

      if (!isEqual(newMap, this.__hotKeyMap__)) {
        this.__hotKeyMap__ = newMap;
        return true;
      }

      return false;
    },

    buildMap() {
      const parentMap = this.context.hotKeyMap || {};
      const thisMap = this.props.keyMap || {};

      return _extends({}, parentMap, hotKeyMap, thisMap);
    },

    getMap() {
      return this.__hotKeyMap__;
    }

  };
}