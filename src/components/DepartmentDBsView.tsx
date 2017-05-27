import * as React from 'react';
import { Component } from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
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
    mainContainer: {
        overFlow: 'visible',
        backgroundColor: '#CFD8DC',
        textAlign: 'center',
        height: '100vh',
    },
    deptView: {
        height: 175,
        width: 200,
        margin: 10,
        textAlign: 'center',
        display: 'inline-block',
        cursor: 'pointer',
    }
};

const DepartmentDBView = ({ name = ``, departmentName = ``, isActive = false, pct = 0 }) => {
    let localStyle = {
        height: 175,
        width: 200,
        margin: 10,
        textAlign: 'center',
        display: 'inline-block',
        cursor: 'pointer',
    };

    if (isActive) {
        localStyle = { ...styles.deptView };
    }

    return (
        <Paper style={localStyle} zDepth={isActive ? 2 : 0}>
            <h4>{name} | <small>{departmentName}</small></h4>
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

        this.props.requestDepartmentDBs(newVal, this.props.institutionFilter);
    }

    componentDidMount() {
        this.props.requestDepartmentDBs('', this.props.institutionFilter);
    }

    render() {
        let { departmentDBs, deptDBsLoading, activeDeptDB, selectDeptDB } = this.props;
        let { searchTxt } = this.state;

        return (
            <Paper style={styles.mainContainer} open={true}>
                <h4>Department Databases</h4>
                <Divider />
                <TextField style={{ padding: '0px' }}
                    value={searchTxt}
                    onChange={(e, newVal) => this.handleSearchTxtChanged(e, newVal)}
                    hintText="search by name..." />
                {
                    deptDBsLoading ? (<CircularProgress />)
                        : (departmentDBs.map(d => (
                            <div onClick={
                                () => selectDeptDB(d.DeptDBID,
                                                   {
                                        ...this.props.institutionFilter,
                                        deptDBID: d.DeptDBID,
                                    })}
                                key={d.DeptDBID}>
                                <DepartmentDBView
                                    name={d.Name}
                                    departmentName={d.Department.Name}
                                    isActive={d.DeptDBID === activeDeptDB!.DeptDBID}
                                />
                            </div>
                        )))
                }
            </Paper>
        );
    };
}

export default connect(
    (state: ApplicationState) => state.departmentDBs,
    DepartmentDBStore.actionCreators
)(DepartmentDBListView);