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

export const SessionPassword = ({ activeSession, actions, controls, error, ajaxState}) => {
  const payload = {
    activeSession: activeSession,
    password: controls.password,
    newPassword: controls.newPassword,
    confirmPassword: controls.confirmPassword,
  };
  const disabledButton = !(controls.password && controls.newPassword && controls.confirmPassword);
  return (
    <div className="md-grid">
      <Card className="md-cell md-cell--4 md-cell--4-offset">
        <SessionLogo />
        <CardText>
          <CardTitle title={<FormattedMessage {...messages.header} />} />
          <TextField id="password" label={<FormattedMessage {...messages.password} />} type="password"
            value={controls.password}
            onChange={(value) => actions.controlsChanged({password: value})} />
            <TextField id="newPassword" label={<FormattedMessage {...messages.newPassword} />} type="password"
            value={controls.newPassword}
            onChange={(value) => actions.controlsChanged({newPassword: value})} />
            <TextField id="confirmPassword" label={<FormattedMessage {...messages.confirmPassword} />} type="password"
            value={controls.confirmPassword}
            onChange={(value) => actions.controlsChanged({confirmPassword: value})} />
        </CardText>
        <p style={{color: 'red'}}> {error} </p>
        <CardActions style={{justifyContent: 'flex-end'}}>
          <Button disabled={disabledButton} type="submit" id="sessionlogin-button-submit" raised primary onClick={() => actions.changePassword(payload)}>
            <AjaxState ajaxState={ajaxState} style={{marginRight: '5px'}}/>
            Siguiente
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default SessionPassword;
