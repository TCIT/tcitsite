/*
 *
 * AppWrapper
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { push } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import FontIcon from 'react-md/lib/FontIcons';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import makeSelectSession from '../Session/selectors';
import { reselectObjects } from '../App/selectors';
import SessionMenu from 'components/SessionMenu';
import messages from './messages';
import Footer from 'components/Footer';
import NotificationCenter from 'containers/NotificationCenter';
import { showMessage } from 'containers/NotificationCenter/actions';
import logo from 'assets/logo-rayen-2.png';
import AjaxState from '../../components/Helpers/AjaxState';
import Clock from '../../components/Clock';
import { Grid, Cell } from 'react-md';
require('!style-loader!css-loader!sass-loader!sass/appWrapper.scss');

/* MENU LIST ITEMS */
const menuListItems = [{
  key: '/',
  primaryText: <FormattedMessage {...messages.menuContactList} />,
  leftIcon: <FontIcon>contact_mail</FontIcon>,
  active: true
}, {
  key: '/webkit_search',
  primaryText: <FormattedMessage {...messages.menuCache} />,
  leftIcon: <FontIcon>search</FontIcon>,
  active: true
}, {
  key: '/webkit_async',
  primaryText: <FormattedMessage {...messages.menuAsync} />,
  leftIcon: <FontIcon>compare_arrows</FontIcon>,
  active: true
}, {
  key: '/',
  primaryText: <FormattedMessage {...messages.menuAccount} />,
  leftIcon: <FontIcon>account_circle</FontIcon>,
  active: true
}];

export class AppWrapper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  /* eslint-disable no-param-reassign */
  constructor(props) {
    super(props);
    this.setPage = this.setPage.bind(this);
    this.navItems = menuListItems.map((item) => {
      if (!item.divider) {
        item.onClick = () => this.setPage(item.key);
      }
      return item;
    });
  }

  setPage(key) {
    browserHistory.push(key);
  }
  /* eslint-enable no-param-reassign */

  render() {
    const { controls, actions, changeRoute, objects, session, theme, notification, app } = this.props;
    const subtitles = {
      encountersPage: <FormattedMessage {...messages.encounters} />,
      '': ''
    };
    const subtitle = subtitles[this.props.children[0].props.route.name];
    let marginTop = '0px';
    if (this.props.children[0].props.route.name === 'encounterEventsPage') {
      marginTop = '100px'
    }
    const notificationSection = notification ? 
      <div id="encounters-notification-bar" style= {{position: 'fixed', width: '98%', marginTop: marginTop, zIndex: 100}}>
        <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
        {notification}
        <i onClick={actions.closeNotification} className="fa fa-times" aria-hidden="true"></i>
      </div> 
      : '';
    const offsetTime = session.offsetTime;
    const drawerHeaderChildren = <img src={logo} style={{height:'35px', margin: '10px auto'}} />
    const profileLink = {
      float: 'left',
      marginTop: '-4px',
      background: 'transparent',
    };
    const activeSession = objects.sessions[session.activeSessionId];
    const activeUser = activeSession ? objects.users[activeSession.userId] : null;
    const activeFacility = activeSession ? objects.facilities[activeSession.facilityId] : null;
    let userTime = null;
    if (offsetTime && activeFacility && activeFacility.timeZone) {
      userTime = <Clock offsetTime={offsetTime} timeZone={activeFacility.timeZone} />;
    }
    let sessionMenu = null;
    const shouldRender = ((app.socketConnectionId && app.cacheLoaded && session.activeSessionId) || this.props.children[0].props.route.name === 'sessionsPage');
    if (shouldRender) {
      sessionMenu = <SessionMenu
        actions={actions}
        controls={controls}
        activeSession={activeSession}
        sessions={Object.values(objects.sessions)}
        user={activeUser}
      />;
    }
    let toolbarStyle = {boxShadow: 'none'};
    if (this.props.children[0].props.location.pathname === '/') {
      toolbarStyle = {boxShadow: 'none', display: 'none'};
    }
    return (
      <NavigationDrawer
        navItems={this.navItems}
        contentClassName={`md-grid md-grid--no-spacing ${ theme }`}
        navClassName={theme}
        toolbarClassName={theme}
        contentClassName={theme}
        drawerClassName="blacks"
        toolbarTitleClassName="nav-title"
        className={theme}
        drawerHeaderChildren={drawerHeaderChildren}
        mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
        tabletDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
        desktopDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
        toolbarTitle={<div>
            <div className='app-main-title'>{activeFacility ? activeFacility.name : ''} {userTime}</div>
            <div className="app-sub-title">{subtitle}</div>
          </div>}
        toolbarActions={[sessionMenu]}
        contentId="holder"
        toolbarStyle={toolbarStyle}
      >
        <div id="body">
          <Grid>
            <Cell size={12} style={{marginTop: '0'}}>
              {notificationSection}
              {shouldRender ? React.Children.toArray(this.props.children) :
                <AjaxState ajaxState="pending" style={{position: 'absolute', margin: 'auto', top: '37%', left: '47%', fontSize: '100px'}}/>
              }
            </Cell>
          </Grid>
        </div>
        <NotificationCenter />
      </NavigationDrawer>
    );
  }
}

AppWrapper.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

AppWrapper.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: React.PropTypes.node,
};

const mapStateToProps = createStructuredSelector({
  app: (state) => state.get('app').toJS(),
  session: makeSelectSession(),
  objects: reselectObjects(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper);
