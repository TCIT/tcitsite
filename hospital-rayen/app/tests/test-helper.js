import React from 'react'
import { shallow, mount } from 'enzyme'
import configureStore from 'store'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import defaults from 'lodash/defaults'
import { translationMessages } from 'i18n'

export const mountConnected = (toRender, options = {}) => {
  defaults(options, {
    locale: 'en',
    store: configureStore(),
    messages: translationMessages,
  })

  return mount(
    <Provider store={options.store}>
      <IntlProvider
        locale={options.locale}
        messages={options.messages[options.locale]}
        >
        {toRender}
      </IntlProvider>
    </Provider>
  )
}

export {
  React,
  shallow,
  mount,
  configureStore,
}
