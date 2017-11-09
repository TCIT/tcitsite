import React, { PropTypes } from 'react';


export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date(), offsetTime: this.props.offsetTime, timeOut: null};
  }
  componentDidMount() {
    this.setState({date: new Date(), offsetTime: this.props.offsetTime});
    this.triggerTimeOut(this.state);
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout);
  }

  triggerTimeOut(state) {
    const timeout = setTimeout(() => this.triggerTimeOut(state), 1000);
    this.setState({date: new Date((new Date().getTime() + this.state.offsetTime)), timeout});
  }
  render() {
    const timeZone = this.props.timeZone;
    return <div style = {{fontSize: '10px', color: 'white', marginTop: '-43px', display: 'inline-block'}}>{(this.state.date).toLocaleString('es-CL', { timeZone: timeZone })}</div>;
  }
}
