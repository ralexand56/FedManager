import * as React from 'react';
import { Component } from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import { ApplicationState } from '../store';
import * as DepartmentDBStore from '../store/DepartmentDBReducer';
import { connect } from 'react-redux';

type DepartmentDBProps = DepartmentDBStore.DepartmentDBState &
    typeof DepartmentDBStore.actionCreators;

interface AppState {
    searchTxt: string;
}

const styles = {
    height: 175,
    width: 200,
    margin: 10,
    textAlign: 'center',
    display: 'inline-block',
    cursor: 'pointer',
};

const DepartmentDBView = ({
                            name = ``,
                            departmentName = ``,
                            isActive = false,
                            pct = 0 }) => {
    return (
        <Paper style={styles} zDepth={1}>
            <h4>{name} | <small>{departmentName}</small> {isActive && 'Active'}</h4>
            <Divider />
            <div>
                <h2>{pct} <small>%</small></h2>
            </div>
        </Paper>
    );
};

export class DepartmentDBListView extends Component<DepartmentDBProps, AppState> {
    constructor() {
        super();

        this.state = { searchTxt: '' };
    }

    handleSearchTxtChanged(e: React.FormEvent<{}>, newVal: string) {
        this.setState({ searchTxt: newVal });

        this.props.requestDepartmentDBs(newVal);
    }

    componentDidMount() {
        this.props.requestDepartmentDBs('');
    }

    render() {
        let { departmentDBs, deptDBsLoading, activeDeptDB, selectDeptDB } = this.props;
        let { searchTxt } = this.state;

        return (
            <Drawer containerStyle={{ backgroundColor: '#CFD8DC', textAlign: 'center' }} open={true}>
                <h4>Department Databases</h4>
                <Divider />
                <TextField style={{ padding: '0px 15px' }}
                    value={searchTxt}
                    onChange={(e, newVal) => this.handleSearchTxtChanged(e, newVal)}
                    hintText="search by name..." />
                {
                    deptDBsLoading ? (<CircularProgress />)
                        : (departmentDBs.map(d => (
                            <div onClick={() => selectDeptDB(d.DeptDBID)} 
                                    key={d.DeptDBID}>
                                <DepartmentDBView
                                    name={d.Name}
                                    departmentName={d.Department.Name}
                                    isActive={d.DeptDBID === activeDeptDB!.DeptDBID}
                                />
                            </div>
                        )))
                }
            </Drawer>
        );
    };
}

export default connect(
    (state: ApplicationState) => state.departmentDBs,
    DepartmentDBStore.actionCreators
)(DepartmentDBListView);