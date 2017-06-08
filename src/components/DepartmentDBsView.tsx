import * as React from 'react';
import { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import { ApplicationState } from '../store';
import * as DepartmentDBStore from '../store/DepartmentDBReducer';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import * as Radium from 'radium';
import * as moment from 'moment';
import {
    DepartmentDBState,
    DepartmentDB,
} from './../services/data-types';

type DepartmentDBProps = DepartmentDBState &
    typeof DepartmentDBStore.actionCreators;

interface AppState {
    searchTxt: string;
}

const styles = {
    mainContainer: {
        overflowY: 'auto',
        textAlign: 'center',
        minWidth: 300,
        margin: 5,
    } as React.CSSProperties,
    deptView: {
        opacity: 1,
        height: 175,
        width: 250,
        margin: '10px',
        textAlign: 'center',
        display: 'inline-block',
        cursor: 'pointer',
    } as React.CSSProperties,
};

const DepartmentDBView = (props: { dept: DepartmentDB, isActive: boolean }) => {
    let { dept, isActive } = props;

    let localStyle = {
        opacity: 0.7,
        height: 175,
        width: 220,
        margin: '10px',
        textAlign: 'center',
        display: 'inline-block',
        cursor: 'pointer',
    } as React.CSSProperties;

    let pctFormatted = Math.round(dept.Pct * 100);

    if (isActive) {
        localStyle = { ...styles.deptView };
    }

    return (
        <Paper style={localStyle} zDepth={isActive ? 2 : 2}>
            <AppBar
                titleStyle={{ fontSize: 15 }}
                showMenuIconButton={false}
                title={`${dept.Name} | ${dept.Department.Name}`} />
            <Divider />
            <div>
                <h2 style={{ margin: '45px 0 0 0' }}>{pctFormatted}<small>%</small></h2>
                <CircularProgress style={{ margin: '-150px 0 0 0' }}
                    mode="determinate"
                    size={80}
                    thickness={5}
                    value={pctFormatted} />
            </div>
            <h5>Last Updated | {moment(dept.LastModified).format('ll')}</h5>
        </Paper>
    );
};

@Radium
export class DepartmentDBsView extends Component<DepartmentDBProps, AppState> {
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
        let { departmentDBs, 
                deptDBsLoading, 
                activeDeptDB, 
                selectDeptDB, 
                showDeptDBs } = this.props;
        let { searchTxt } = this.state;

        return (
            <Paper style={{...styles.mainContainer, display: showDeptDBs ? 'inline' : 'none'}} open={true} zDepth={2}>
                <AppBar
                    titleStyle={{ fontSize: 20 }}
                    iconElementLeft={<IconButton><NavigationClose /></IconButton>}
                    showMenuIconButton={true}
                    title={'Dept. Databases'} />
                <Divider />
                <TextField style={{ padding: '0px' }}
                    value={searchTxt}
                    onChange={(e, newVal) => this.handleSearchTxtChanged(e, newVal)}
                    hintText="search by name..." />
                {
                    deptDBsLoading ? (<CircularProgress />)
                        : (departmentDBs.map(d => (
                            <div onClick={
                                () => selectDeptDB(d.DeptDBID, {
                                    ...this.props.institutionFilter,
                                    deptDBID: d.DeptDBID,
                                })}
                                key={d.DeptDBID}>
                                <DepartmentDBView
                                    dept={d}
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
)(DepartmentDBsView);