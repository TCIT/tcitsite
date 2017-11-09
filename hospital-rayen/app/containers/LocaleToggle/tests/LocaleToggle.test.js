import React from 'react';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { shallow, mount } from 'enzyme';

import Toggle from 'components/Toggle';
import LocaleToggle, { mapDispatchToProps } from '../LocaleToggle';
import SelectField from 'react-md/lib/SelectFields';
import { changeLocale } from 'containers/LanguageProvider/actions';
import LanguageProvider from 'containers/LanguageProvider';

import configureStore from '../../../store';
import { translationMessages } from '../../../i18n';

describe('<LocaleToggle />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the default language messages', () => {
    const renderedComponent = shallow(
      <Provider store={store}>
        <LanguageProvider messages={translationMessages}>
          <LocaleToggle />
        </LanguageProvider>
      </Provider>
    );
    expect(renderedComponent.contains(<LocaleToggle />)).toBe(true);
  });

  // it('should present the default `es` english language option', () => {
  //   const renderedComponent = mount(
  //     <Provider store={store}>
  //       <LanguageProvider messages={translationMessages}>
  //         <LocaleToggle />
  //       </LanguageProvider>
  //     </Provider>
  //   );
  //   expect(renderedComponent.contains(<Toggle value="es">es</Toggle>)).toBe(true);
  // });

  describe('mapDispatchToProps', () => {
    describe('onLocaleToggle', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onLocaleToggle).toBeDefined();
      });

      it('should dispatch changeLocale when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const locale = 'es';
        const evt = { target: { value: locale } };
        result.onLocaleToggle(evt);
        expect(dispatch).toHaveBeenCalledWith(changeLocale(evt));
      });
    });
  });
});
