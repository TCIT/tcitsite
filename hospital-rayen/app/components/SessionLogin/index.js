import React from 'react';
import Button from 'react-md/lib/Buttons';
import Card from 'react-md/lib/Cards/Card';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import TextField from 'react-md/lib/TextFields';
import SessionLogo from 'components/SessionLogo';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import AjaxState from '../Helpers/AjaxState';

export const SessionLogin = ({actions, controls, error, ajaxState}) => {
  const payload = {
          loggingIn: true,
          username: controls.username,
          password: controls.password,
        };
  const disabledButton = !(controls.username && controls.password);
  return (
    <div className="md-grid">
      <Card className="md-cell md-cell--4 md-cell--4-offset">
        <SessionLogo />
        <CardText>
          <CardTitle title={<FormattedMessage {...messages.header} />} />
          <TextField 
            label={<FormattedMessage {...messages.username} />} 
            type="text"
            value={controls.username}
            onChange={(value) => actions.controlsChanged({username: value})}
          />

          <TextField 
            label={<FormattedMessage {...messages.password} />}
            type="password"
            value={controls.password}
            onChange={(value) => actions.controlsChanged({password: value})}
          />
        </CardText>
        <p style={{color: 'red'}}> {error} </p>
        <CardActions style={{justifyContent: 'flex-end'}}>
          <Button disabled={disabledButton} type="submit" id="sessionlogin-button-submit" raised primary onClick={() => actions.addSession(payload)}>
            <span>
              <AjaxState ajaxState={ajaxState} style={{marginRight: '5px'}}/>
              Siguiente
            </span>
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default SessionLogin;
