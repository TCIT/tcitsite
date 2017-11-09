/**
*
* Stepper
*
*/

import React, { PropTypes } from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function Stepper({step}) {
  return (
    <div className="md-cell md-cell--12 mdl-card">
      <div className="mdl-card__supporting-text">
        <div className="mdl-stepper-horizontal-alternative">
          <div className={`mdl-stepper-step ${(step === 1) ? 'active-step editable-step': ''} ${(step > 1) ? 'step-done': ''}`}>
            <div className="mdl-stepper-circle"><span>1</span></div>
            <div className="mdl-stepper-title"><FormattedMessage {...messages.personalData} /></div>
            <div className="mdl-stepper-bar-left"></div>
            <div className="mdl-stepper-bar-right"></div>
          </div>
          <div className={`mdl-stepper-step ${(step === 2) ? 'active-step editable-step': ''} ${(step > 2) ? 'step-done': ''}`}>
            <div className="mdl-stepper-circle"><span>2</span></div>
            <div className="mdl-stepper-title"><FormattedMessage {...messages.addressData} /></div>
            <div className="mdl-stepper-bar-left"></div>
            <div className="mdl-stepper-bar-right"></div>
          </div>
          <div className={`mdl-stepper-step ${(step === 3) ? 'active-step editable-step': ''} ${(step > 3) ? 'step-done': ''}`}>
            <div className="mdl-stepper-circle"><span>3</span></div>
            <div className="mdl-stepper-title"><FormattedMessage {...messages.contactData} /></div>
            <div className="mdl-stepper-bar-left"></div>
            <div className="mdl-stepper-bar-right"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

Stepper.propTypes = {
  step: PropTypes.number.isRequired,
};

export default Stepper;
