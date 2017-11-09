// Code stolen from
// https://github.com/mjrussell/redux-auth-wrapper/tree/master/examples/react-router-3

import React from 'react';
import locationHelperBuilder from 'redux-auth-wrapper/history3/locationHelper';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history3/redirect';
import { routerActions } from 'react-router-redux';

const locationHelper = locationHelperBuilder({});

export default function Loading() {
  return <div>Logging you in...</div>
}

export const userIsAuthenticated = connectedRouterRedirect({
  redirectPath: '/',
  authenticatedSelector: state => !!state.toJS().app.activeSessionId,
  authenticatingSelector: state => state.toJS().session.isLoading,
  AuthenticatingComponent: Loading,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsAuthenticated'
});
