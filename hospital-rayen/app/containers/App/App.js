/* eslint no-underscore-dangle: 0 */
import * as appActions from './actions';
import React from 'react';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userIsAuthenticated } from '../../utils/auth';
import AppWrapper from 'containers/AppWrapper';
import Footer from 'components/Footer';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';

/* load global style */
require('!style-loader!css-loader!sass-loader!sass/all.scss');


class App extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * App.react.js
   *
   * This component is the skeleton around the actual pages, and should only
   * contain code that should be seen on all pages. (e.g. navigation bar)
   *
   * NOTE: while this component should technically be a stateless functional
   * component (SFC), hot reloading does not currently support SFCs. If hot
   * reloading is not a necessity for you then you can refactor it and remove
   * the linting exception.
   */

  constructor(props, context){
    super(props, context)
    context.router // will work
  }

  componentDidMount() {
    this.props.actions.activate();
  }
  componentDidMount() {
    this.props.actions.activate();
  }

  render() {
    const {theme, time, controls, objects, notification, subtitle} = this.props.app;
    const {actions, changeRoute} = this.props;
    
    return (
      <div className="body">
        <AppWrapper subtitle={subtitle} notification={notification} theme={theme} time={time} 
          controls={controls} changeRoute={changeRoute} 
          actions={actions}>{React.Children.toArray(this.props.children)}</AppWrapper>
        <Footer theme={theme} key="footer" className="main" style={{position: 'relative'}}/>
      </div>

    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object
};

App.PropTypes = {
  children: React.PropTypes.node,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(appActions, dispatch),
    changeRoute: (url) => dispatch(push(url))
  };
}
function mapAppAction(state) {
  return state.get('app').toJS();
}

const mapStateToProps = createStructuredSelector({
  app: mapAppAction
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
