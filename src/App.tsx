import * as React from 'react';
import { Component } from 'react';
// import { Institution, DepartmentDB } from './services/data-types';
import AppBar from 'material-ui/AppBar';
import DepartmentDBsView from './components/DepartmentDBsView';
import InstitutionsView from './components/InstitutionsView';
import * as Radium from 'radium';
import FederalInstitutionsView from './components/FederalInstitutionsView';
// import MenuItem from 'material-ui/MenuItem';
// import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import './App.css';

const styles = {
  mainContainer: {
    display: 'flex',
    height: '100%',
  } as React.CSSProperties,
  asideContainer: {
    backgroundColor: 'lightblue',
    height: '100%',
  } as React.CSSProperties,
  bodyContainer: {
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

interface AppState {
  open: boolean;
}

@Radium
export default class App extends Component<{}, AppState> {
  baseUrl = `http://dev.informars.com/webservices/FedSvc/odata/`;

  constructor() {
    super();

    this.state = {
      open: false,
    };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  render() {

    return (
      <div style={{ fontFamily: 'Roboto', height: '100%' }}>
        <AppBar showMenuIconButton={false} 
                title="Federal Institution Manager">
          <RaisedButton
            label="Login"
            onTouchTap={this.handleToggle}
          />
          <RaisedButton
            label="Department Databases"
            onTouchTap={this.handleToggle}
          />
        </AppBar>
        <div style={styles.mainContainer}>
          <DepartmentDBsView />
          <div style={styles.bodyContainer}>
            <InstitutionsView />
            <FederalInstitutionsView />
          </div>
        </div>
      </div>
    );
  }
}
