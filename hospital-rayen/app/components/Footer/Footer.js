import React from 'react';
import { FormattedMessage } from 'react-intl';
import LocaleToggle from 'containers/LocaleToggle';
import ThemeToggle from 'containers/ThemeToggle';
import messages from './messages';

class Footer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { theme } = this.props;
    return (
      <footer className="md-grid app-footer">
        <section className="md-cell md-cell--2 md-cell--tablet-hidden md-cell--phone-hidden">
          <h4 className="md-title" style={{margin:'30px'}}><FormattedMessage {...messages.title} /></h4>
        </section>
        <section className="md-cell md-cell--2">
          <ThemeToggle theme={theme}/>
        </section>
        <section className="md-cell md-cell--2">
          <LocaleToggle />
        </section>
        <section className="md-cell md-cell--6">
          <p className="md-text-right md-cell md-cell--12  md-cell--tablet-hidden md-cell--phone-hidden" style={{marginTop: '60px'}}>Version: <i>1.0</i></p>
        </section>
      </footer>
    );
  }
}

export default Footer;
