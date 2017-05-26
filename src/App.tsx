import * as React from 'react';
import { Component } from 'react';
// import { Institution, DepartmentDB } from './services/data-types';
import AppBar from 'material-ui/AppBar';
import DepartmentDBsView from './components/DepartmentDBsView';
import InstitutionsView from './components/InstitutionsView';
// import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
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
    display: 'flex',
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

export default class App extends Component<{}, AppState> {
  baseUrl = `http://dev.informars.com/webservices/FedSvc/odata/`;

  constructor() {
    super();

    this.state = {
      open: false,
    };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  // handleSelectDepartmentDB(d: DepartmentDB) {
  //   // this.setState(
  //   //   {
  //   //     ...this.state,
  //   //     activeDepartmentDB: d,
  //   //   }
  //   // );

  //   fetch(`${this.baseUrl}Institutions?$filter=DeptDBID eq ${d.DeptDBID}&$expand=FederalInstitution&$top=500`)
  //     .then(response => response.json())
  //     .then(x => {
  //       // this.setState({
  //       //   ...this.state,
  //       //   institutions: x.value
  //       // });
  //     });
  // }

  render() {
    // let { activeDepartmentDB } = this.state;

    return (
      <div style={{ fontFamily: 'Roboto', height: '100%' }}>
        <AppBar title="Federal Institution Manager">
          <RaisedButton
            label="Department Databases"
            onTouchTap={this.handleToggle}
          />
        </AppBar>
        <div style={styles.mainContainer}>
          <div style={styles.bodyContainer}>
            <DepartmentDBsView />
            <InstitutionsView />
            <Divider />
          </div>
        </div>
      </div>
    );
  }
}
