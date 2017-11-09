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

require('!style-loader!css-loader!sass-loader!./InitControlButton.scss');

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
      <div className="init-control">
        { this.state.isHovering &&
          <List className="action-panel"
                onMouseEnter={this.handleMouseHover}
                onMouseLeave={this.handleMouseHover}
          >
            <ListItem className="actionButton" primaryText="" onClick={() => this.selectAction("DIAGNOSTICO")}>
              <Avatar>D</Avatar>
            </ListItem>
            <ListItem className="actionButton" primaryText="" onClick={() => this.selectAction("FARMACOS")}>
              <Avatar>F</Avatar>
            </ListItem>
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

        {/* <div className="button-panel">
          <Button
            flat
            primary
            label="Imprimir Ficha"
          >print
          </Button>
          <Button
            raised
            primary
            label={<FormattedMessage {...messages.header} />}
          />
      </div> */}
      </div>
    );
  }
}

InitControlButton.propTypes = {
  openAction: PropTypes.func.isRequired,
};

export default InitControlButton;
