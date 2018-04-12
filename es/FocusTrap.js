var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * Component to wrap its children in a parent that has a tabIndex of -1,
 * making it programmatically focusable and with focus and blur handlers
 */
class FocusTrap extends Component {

  render() {
    const _props = this.props,
          {
      component: Component,
      children
    } = _props,
          props = _objectWithoutProperties(_props, ['component', 'children']);

    return React.createElement(
      Component,
      _extends({ tabIndex: '-1' }, props),
      children
    );
  }
}

FocusTrap.propTypes = {
  /**
   * Function to call when this component gains focus in the browser
   */
  onFocus: PropTypes.func,

  /**
   * Function to call when this component loses focus in the browser
   */
  onBlur: PropTypes.func,

  /**
   * Component (or component type as a string) to use as a wrapper or
   * parent of this component's children
   */
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

  /**
   * Children to place in the wrapper or parent
   */
  children: PropTypes.node
};
FocusTrap.defaultProps = {
  component: 'div'
};
export default FocusTrap;