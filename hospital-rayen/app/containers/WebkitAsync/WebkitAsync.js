/*
 *
 * WebkitAsync
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Card from 'react-md/lib/Cards/Card';
import Button from 'react-md/lib/Buttons/Button';

import {asyncCall} from './actions';

export class WebkitAsync extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="md-cell md-cell--10-desktop md-cell--1-desktop-offset md-cell--12-tablet" style={{paddingTop:'30px'}}>
        <Helmet
          title="WebkitSearch"
          meta={[
            { name: 'description', content: 'Description of WebkitSearch' },
          ]}
        />
        <h1>Llamadas asincronas</h1>
        <Card className="md-grid">
          <h3 className="md-cell md-cell--12">Concatenar llamadas asincronas</h3>
          <Button secondary raised label="Enviar llamada asincrona" onClick={() => this.props.onAsyncCall()} />
        </Card>
      </div>
    );
  }
}

WebkitAsync.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onAsyncCall: () => {
      dispatch(asyncCall());
    }
  };
}

export default connect(null, mapDispatchToProps)(WebkitAsync);
