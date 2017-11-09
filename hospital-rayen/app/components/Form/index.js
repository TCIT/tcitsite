/**
*
* ActionDialog
*
*/

import React from 'react';
import Card from 'react-md/lib/Cards/Card';

import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';

require('!style-loader!css-loader!sass-loader!./ActionDialog.scss');

class Form extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {expanded: true};
  }
  render() {
    const actions = [
      <Button key="minimize" onClick={() => this.setState({expanded: false})}><i style={{height: '5px'}} className="fa fa-window-minimize" aria-hidden="true"></i></Button>,
      <Button key="maximize" onClick={() => this.setState({expanded: true})}><i style={{height: '5px'}} className="fa fa-window-maximize" aria-hidden="true"></i></Button>,
      <Button key="close" onClick={this.props.closeAction}><i style={{height: '5px', marginRight:'20px'}} className="fa fa-times" aria-hidden="true"></i></Button>,
    ];
    return (
      <Card className="modal-actions md-block-centered md-grid" style={{width: '500px'}}>
        <Toolbar
          style={{height: '40px'}}
          titleStyle={{lineHeight:'40px', marginLeft: '20px'}}
          colored
          title={this.props.title}
          actions={actions}
        />
        {this.state.expanded && this.props.children}
      </Card>
    );
  }
}

Form.propTypes = {
  children: React.PropTypes.node,
  title: React.PropTypes.string,
  closeAction: React.PropTypes.func,
};

export default Form;
