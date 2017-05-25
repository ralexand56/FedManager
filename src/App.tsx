import * as React from 'react';
import { Component } from 'react';
// import { Institution, DepartmentDB } from './services/data-types';
// import AppBar from 'material-ui/AppBar';
import { blueGrey500 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import MenuItem from 'material-ui/MenuItem';
// import Divider from 'material-ui/Divider';
// import RaisedButton from 'material-ui/RaisedButton';
import './App.css';

const muiTheme = getMuiTheme({
  palette: {
    textColor: blueGrey500,
    primary1Color: blueGrey500,
  },
  appBar: {
    height: 40,
  },
});

// const styles = {
//   mainContainer: {
//     display: 'flex',
//     height: '100%',
//   } as React.CSSProperties,
//   asideContainer: {
//     backgroundColor: 'lightblue',
//     height: '100%',
//   } as React.CSSProperties,
//   bodyContainer: {
//     flex: 1,
//     display: 'flex',
//     padding: '0 15px',
//     flexDirection: 'column',
//     height: '100%',
//   } as React.CSSProperties,
//   bodyTopContainer: {
//     backgroundColor: 'white',
//     height: '100%',
//   } as React.CSSProperties,
//   bodyBottomContainer: {
//     backgroundColor: 'white',
//     height: '100%',
//   } as React.CSSProperties,
// };

// interface AppState {
//   departmentDBs: Array<DepartmentDB>;
//   open: boolean;
//   activeDepartmentDB?: DepartmentDB;
//   institutions: Array<Institution>;
//   redux?: number;
// }

export default class App extends Component<{}, void> {
  baseUrl = `http://dev.informars.com/webservices/FedSvc/odata/`;

  constructor() {
    super();

    // this.state = {
    //   departmentDBs: [],
    //   open: false,
    //   institutions: [],
    // };
  }

  componentDidMount() {
    fetch('http://dev.informars.com/webservices/FedSvc/odata/DepartmentDBs?$expand=Department')
      .then(response => response.json())
      .then(x => {
        // this.setState({
        //   ...this.state, departmentDBs: x.value, open: false, activeDepartmentDB: x.value[0],
        // });

        // if (this.state.activeDepartmentDB) {
        //   this.handleSelectDepartmentDB(this.state.activeDepartmentDB);
        // }
      });
  }

  // handleToggle = () => this.setState({ ...this.state, open: !this.state.open });

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
      <MuiThemeProvider muiTheme={muiTheme}>
        {/*<div style={{ fontFamily: 'Roboto', height: '100%' }}>
          <AppBar title="Federal Institution Manager">
            {activeDepartmentDB &&
              <MenuItem style={{ color: 'white' }}>Active Department DB: {activeDepartmentDB.Name}</MenuItem>}
            <RaisedButton
              label="Department Databases"
              onTouchTap={this.handleToggle}
            />
          </AppBar>
          <div style={styles.mainContainer}>
            <div style={styles.bodyContainer}>
             }
              <Divider />

              <div style={styles.bodyBottomContainer}><h4>Federal Institutions</h4></div>
            </div>
          </div>
        </div>*/}
      </MuiThemeProvider>
    );
  }
}
