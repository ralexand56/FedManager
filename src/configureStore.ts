import { createStore, applyMiddleware, combineReducers, ReducersMapObject } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as Redux from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { logger } from 'redux-logger';
import * as Store from './store';

export default function configureStore(initialState?: Store.ApplicationState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    // const windowIfDefined = typeof window === 'undefined' ? null : window as {};
    // If devTools is installed, connect to it
    // const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension as () => GenericStoreEnhancer;
    const createStoreWithMiddleware = composeWithDevTools(
        applyMiddleware(logger, thunk, promiseMiddleware()),
    )(createStore);

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(Store.reducers);
    const store = createStoreWithMiddleware(allReducers, initialState,
    ) as Redux.Store<Store.ApplicationState>;

    // // Enable Webpack hot module replacement for reducers
    // if (module.hot) {
    //     module.hot.accept('./store', () => {
    //         const nextRootReducer = require<typeof Store>('./store');
    //         store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
    //     });
    // }

    return store;
}

function buildRootReducer(allReducers: ReducersMapObject) {
    return combineReducers<Store.ApplicationState>(Object.assign({}, allReducers));
}
