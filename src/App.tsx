import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import { AppContainer } from 'react-hot-loader';
import isNil from 'lodash-es/isNil';
import { createStore } from './redux';
import { default as Root } from './modules/root/ConnectedRoot';

const history = createBrowserHistory();
const store = createStore(history, __DEV__);

// tslint:disable-next-line
const renderHtml = (MyComponent: any) => {
  render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <MyComponent />
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  );
};

renderHtml(Root as any);

// Hot Module Replacement API
if (!isNil(module.hot)) {
  module.hot.accept('./modules/root/ConnectedRoot', () => renderHtml(Root as any));
}
