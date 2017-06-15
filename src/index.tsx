import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
// import DepartmentDBsView from './components/DepartmentDBsView';
// import InstitutionsView from './components/InstitutionsView';
import { Provider } from 'react-redux';
import './index.css';
import configureStore from './configureStore';
import {
  actionCreators
} from './store/DepartmentDBReducer';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { blueGrey500 } from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    textColor: blueGrey500,
    primary1Color: blueGrey500,
  },
  appBar: {
    height: 40,
  },
});

const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

// const initialState = (window as any).initialReduxState as ApplicationState;
const store = configureStore();

store.dispatch(actionCreators.init());
store.dispatch(actionCreators.requestDepartmentDBs('', store.getState().departmentDBs.institutionFilter));

ReactDOM.render(
  (
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <App />
      </MuiThemeProvider>
    </Provider>
  ),
  document.getElementById('root') as HTMLElement
);