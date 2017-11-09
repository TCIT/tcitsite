/**
*
* ActionModal
*
*/

import React, {PropTypes} from 'react';
// import styled from 'styled-components';
import Button from 'react-md/lib/Buttons';
import Dialog from 'react-md/lib/Dialogs';

import { FormattedMessage, FormattedPlural } from 'react-intl';
import messages from './messages';

class ActionModal extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.actionName = '';
    this.title = '';
    this.body = '';
    this.cancel = '';
  }

  componentDidMount() {
    // textos modal borrar contactos
    if (this.props.type === 'delete') {
      this.actionName = <FormattedMessage {...messages.actionDelete} />
      this.title = (this.props.count > 1) ? <FormattedMessage {...messages.headerDeleteMany} /> : <FormattedMessage {...messages.headerDeleteOne} />
      this.body = (this.props.count > 1) ? <FormattedMessage {...messages.bodyDeleteMany} /> : <FormattedMessage {...messages.bodyDeleteOne} />
      this.cancel = <FormattedMessage {...messages.cancel} />;
    } else
    // textos modal volver a lista
    if (this.props.type === 'backform') {
      this.actionName = <FormattedMessage {...messages.action} />;
      this.title = <FormattedMessage {...messages.header} />;
      this.body = <FormattedMessage {...messages.bodyBackform} />;
      this.cancel = <FormattedMessage {...messages.cancel} />;
    // textos modal generico
    } else {
      this.actionName = <FormattedMessage {...messages.action} />;
      this.title = <FormattedMessage {...messages.header} />;
      this.body = <FormattedMessage {...messages.body} />;
      this.cancel = <FormattedMessage {...messages.cancel} />;
    }
  }

  render() {
    const { visible } = this.props;
    return (
      <Dialog
        id="speedBoost"
        visible={false}
        title={this.title}
        onHide={this.closeDialog}
        aria-labelledby="speedBoostDescription"
        modal
        actions={[{
          onClick: this.props.action,
          primary: false,
          label: this.actionName,
        }, {
          onClick: this.props.close,
          primary: false,
          label: this.cancel,
        }]}
      >
        <p id="speedBoostDescription" className="md-color--secondary-text">
          {this.body}
        </p>
      </Dialog>
    );
  }
}

ActionModal.propTypes = {
  action: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  count: PropTypes.number,
};

export default ActionModal;
