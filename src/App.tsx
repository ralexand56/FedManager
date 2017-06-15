import * as React from 'react';
import { Component } from 'react';
// import { Institution, DepartmentDB } from './services/data-types';
import AppBar from 'material-ui/AppBar';
import { ApplicationState } from './store';
import { connect } from 'react-redux';

import {
  DepartmentDBState,
} from './services/data-types';
import * as DepartmentDBStore from './store/DepartmentDBReducer';
import DepartmentDBsContainer from './components/DepartmentDBsContainer';
import FederalInstitutionsContainer from './components/FederalInstitutionsContainer';
import InstitutionsContainer from './components/InstitutionsContainer';
import * as Radium from 'radium';
// import MenuItem from 'material-ui/MenuItem';
// import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import './App.css';
import * as hello from 'hellojs';

const styles = {
  mainContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
  } as React.CSSProperties,
  asideContainer: {
    backgroundColor: 'lightblue',
    height: '100%',
  } as React.CSSProperties,
  bodyContainer: {
    width: '100%',
    height: '100%',
  } as React.CSSProperties,
  bodyTopContainer: {
    backgroundColor: 'white',
    height: '100%',
  } as React.CSSProperties,
  bodyBottomContainer: {
    backgroundColor: 'white',
    height: '100%',
  } as React.CSSProperties,
};

type AppProps = DepartmentDBState &
  typeof DepartmentDBStore.actionCreators;

@Radium
export class App extends Component<AppProps, void> {
  baseUrl = `http://dev.informars.com/webservices/FedSvc/odata/`;

  constructor() {
    super();

    hello.init({
      windows: '8b8e7508-5d17-4800-9c56-a04d55ea53f5',
    },
               {
        redirect_uri: 'https://login.live.com/oauth20_desktop.srf',
      },
    );

    // let wl = hello('windows').getAuthResponse();
    // console.dir(wl);
    hello.on('auth.login', () => this.auth);

    // console.dir(hello);
  }

  auth = (auth: { network: string }) => {
    console.dir('hello!');
    // Call user information, for the given network
    hello(auth.network).api('me').then((r) => {
      // Inject it into the container
      var label = document.getElementById('profile_' + auth.network);
      if (!label) {
        label = document.createElement('div');
        label.id = 'profile_' + auth.network;
        document.getElementById('profile')!.appendChild(label);
      }
      // label.innerHTML = '<img src="' + r.thumbnail + '" /> Hey ' + r.name;
    });
  }

  handleToggle = () => this.props.toggleDepartmentVisibility();

  login = () => {
    hello('windows').login();
  }

  render() {

    return (
      <div style={{ fontFamily: 'Roboto', height: '100%', width: '100%' }}>
        <AppBar showMenuIconButton={false}
          title="Federal Institution Manager">
          <RaisedButton
            label="Login"
            onTouchTap={this.login}
          />
          <RaisedButton
            label="Department Databases"
            onTouchTap={this.handleToggle}
          />
        </AppBar>
        <div style={styles.mainContainer}>
          <div style={styles.bodyContainer}>
            <InstitutionsContainer />
            <FederalInstitutionsContainer />
          </div>

          <DepartmentDBsContainer />
        </div>
      </div>
    );
  }
}
export default connect(
  (state: ApplicationState) => state.departmentDBs,
  DepartmentDBStore.actionCreators
)(App);