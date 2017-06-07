import * as React from 'react';
import { Component } from 'react';
// import { Institution, DepartmentDB } from './services/data-types';
import AppBar from 'material-ui/AppBar';
import { ApplicationState } from './store';
import { connect } from 'react-redux';
import * as DepartmentDBStore from './store/DepartmentDBReducer';
import DepartmentDBsView from './components/DepartmentDBsView';
import InstitutionsView from './components/InstitutionsView';
import * as Radium from 'radium';
import FederalInstitutionsView from './components/FederalInstitutionsView';
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

type AppProps = DepartmentDBStore.DepartmentDBState &
    typeof DepartmentDBStore.actionCreators;

@Radium
export class App extends Component<AppProps, void> {
  baseUrl = `http://dev.informars.com/webservices/FedSvc/odata/`;

  constructor() {
    super();

    hello.init({
      windows: 'beb173ee-10fd-40cf-861e-5a5a8585c013',
    },         { redirect_uri: 'redirect.html' });

    hello.on('auth.login', (auth) => {
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
    });
  }

  handleToggle = () => this.setState({ open: false });

  login = () => hello('windows').login();

  render() {
    let { showDeptDBs } = this.props;

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
            <InstitutionsView />
            <FederalInstitutionsView />
          </div>
          
          {showDeptDBs && <DepartmentDBsView />}
        </div>
      </div>
    );
  }
}
export default connect(
    (state: ApplicationState) => state.departmentDBs,
    DepartmentDBStore.actionCreators
)(App);