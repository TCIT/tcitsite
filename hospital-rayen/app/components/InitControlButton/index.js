/**
*
* InitControlButton
*
*/

import React, {PropTypes} from 'react';
import Button from 'react-md/lib/Buttons/Button';
import Avatar from 'react-md/lib/Avatars';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

class InitControlButton extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleMouseHover = this.handleMouseHover.bind(this);
  }

  handleMouseHover() {
  }

  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering,
    };
  }

  selectAction(action) {
    this.props.openAction(action);
  }

  render() {
    return (
      <div className="md-grid init-control">
        {
          this.props.isHovering &&
          <List className="action-panel md-cell md-cell--1"
                onMouseEnter={this.handleMouseHover}
                onMouseLeave={this.handleMouseHover}
          >
            <ListItem primaryText="Accion" leftAvatar={<Avatar>D</Avatar>} onClick={() => this.selectAction("DIAGNOSTICO")} />
            <ListItem primaryText="Accion" leftAvatar={<Avatar>F</Avatar>} onClick={() => this.selectAction("FARMACOS")} />
          </List>
        }

        <Button
          floating
          secondary
          fixed
          onMouseEnter={this.handleMouseHover}
          onMouseLeave={this.handleMouseHover}
        >create
        </Button>
        <div className="button-panel md-paper md-paper--1">
          <Button flat primary>
            Imprimir Ficha
          </Button>
          <Button raised primary>
            <FormattedMessage {...messages.header} />
          </Button>
        </div>
      </div>
    );
  }
}

InitControlButton.propTypes = {
  openAction: PropTypes.func.isRequired,
};

export default InitControlButton;
