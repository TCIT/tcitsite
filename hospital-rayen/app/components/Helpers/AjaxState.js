import React from 'react';
export default class AjaxState extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    let faClass = '';
    let content = <div></div>;
    const { ajaxState, style, color } = this.props;
    const size = this.props.size ? `fa-${(this.props.size || 2).toString()}x` : '';
    if (ajaxState) {
      switch (ajaxState) {
        case 'pending':
          faClass = 'fa fa-cog fa-spin ' + size + (color ? 'text-info' : '');
          break;
        case 'typing':
          faClass = 'fa fa-spinner fa-spin ' + size + (color ? 'text-muted' : '');
          break;
        case 'disabled':
          faClass = 'fa fa-cog fa-spin ' + size;
          break;
        case 'success':
          faClass = 'fa fa-check-circle-o ' + size + (color ? 'text-success' : '');
          break;
        case 'fail':
          faClass = 'fa fa-exclamation-circle ' + size + (color ? 'text-danger' : '');
          break;
        default:
          faClass = 'fa ' + size + 'fa-' + ajaxState;
      }
      content = <i className={faClass} style={style}></i>;
    }
    return content;
  }
}
