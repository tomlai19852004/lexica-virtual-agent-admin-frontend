import {
  createStore as createReduxStore,
  applyMiddleware,
  compose,
  combineReducers,
  Store,
} from 'redux';
import { default as createSagaMiddleware } from 'redux-saga';
import { reducer as reduxFormReducer } from 'redux-form';
import { routerReducer, routerMiddleware as createRouterMiddleware } from 'react-router-redux';
import { History } from 'history';
import * as reducers from './Reducers';
import { root } from './Sagas';

const createStore = (history: History, dev = false) => {
  const routerMiddleware = createRouterMiddleware(history);
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = compose(
    applyMiddleware(routerMiddleware, sagaMiddleware),
    (dev && (<any>window).devToolsExtension) ? (<any>window).devToolsExtension() : (f: any) => f,
  );
  const store = createReduxStore(
    combineReducers({
      ...reducers,
      router: routerReducer,
      form: reduxFormReducer,
    }),
    middlewares,
  );
  sagaMiddleware.run(root);
  return store;
};

export { Store, createStore };
