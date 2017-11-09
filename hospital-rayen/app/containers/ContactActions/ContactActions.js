/**
*
* ContactActions
*
*/

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { removeContact } from 'containers/ContactList/actions';
import { showMessage } from 'containers/NotificationCenter/actions';
import Button from 'react-md/lib/Buttons';
import Dialog from 'react-md/lib/Dialogs';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import ActionModal from 'components/ActionModal';

class ContactActions extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  openDialog = () => {
  };

  closeDialog = () => {
  };

  editContact = () => {
    this.props.onEditContact(this.props.contact);
  };

  deleteContact = () => {
    this.props.onDeleteContact(this.props.contact);
    // this.closeDialog();
  };

  render() {
    return (
      <td>
        <ActionModal
          visible={false}
          action={this.deleteContact}
          close={this.closeDialog}
          type="delete"
          count={1}
        />
        <Button icon onClick={this.editContact}>edit</Button>
        <Button icon onClick={this.openDialog}>delete</Button>
      </td>
    );
  }
}

ContactActions.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onEditContact: PropTypes.func.isRequired,
  onDeleteContact: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onDeleteContact: (contact) => {
      const msg = `El contacto ${contact.first_name} ${contact.last_name} fue eliminado`;
      dispatch(removeContact(contact.id));
      dispatch(showMessage(msg));
    },
    onEditContact: (contact) => {
      dispatch(push(`/edit/${contact.id}`));
    }
  }
}

export default connect(null, mapDispatchToProps)(ContactActions);
