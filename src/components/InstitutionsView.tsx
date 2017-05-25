import * as React from 'react';
import { Component } from 'react';
import { ApplicationState } from '../store';
// import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import * as DepartmentDBStore from '../store/DepartmentDBReducer';
// import LinearProgress from 'material-ui/LinearProgress';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRowColumn,
    TableRow,
} from 'material-ui/Table';

type InstitutionsProps = DepartmentDBStore.DepartmentDBState &
    typeof DepartmentDBStore.actionCreators;

const styles = {
    mainContainer: {
        alignText: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'white',
        height: '100%',
        overflow: 'auto',
    } as React.CSSProperties,
    loader: {
        margin: 100,
    }
};

export class InstitutionView extends Component<InstitutionsProps, void> {
    constructor() {
        super();
    }

    public render() {
        let { activeInstitutions, activeDeptDB, institutionsLoading } = this.props;

        return (
            <Paper style={styles.mainContainer} zDepth={2}>
                <Table
                    fixedHeader={true}
                    selectable={true}
                    multiSelectable={true}>
                    <TableHeader
                        displaySelectAll={false}
                        enableSelectAll={true}>
                        <TableRow>
                            <TableRowColumn colSpan={5}>
                                <h3>Institutions |
                                    <small> {activeDeptDB && activeDeptDB.Name} | {activeInstitutions.length}</small>
                                </h3>
                            </TableRowColumn>
                        </TableRow>
                        <TableRow style={{ height: 20 }}>
                            <TableHeaderColumn style={{ height: 20 }}>ID</TableHeaderColumn>
                            <TableHeaderColumn style={{ height: 20 }}>Name</TableHeaderColumn>
                            <TableHeaderColumn style={{ height: 20 }}>State</TableHeaderColumn>
                            <TableHeaderColumn style={{ height: 20 }}>Fed. Inst.</TableHeaderColumn>
                            <TableHeaderColumn style={{ height: 20 }}>RSSDID</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        deselectOnClickaway={true}
                        displayRowCheckbox={false}
                        stripedRows={true}
                        showRowHover={false}>
                        {activeInstitutions && (activeInstitutions.map(i => (
                            <TableRow className="row" style={{ height: 20 }} key={i.CustomID}>
                                <TableRowColumn style={{ height: 20 }} >{i.CustomID}</TableRowColumn>
                                <TableRowColumn style={{ height: 20 }} >{i.Name}</TableRowColumn>
                                <TableRowColumn style={{ height: 20 }} >{i.StateCode}</TableRowColumn>
                                <TableRowColumn style={{ height: 20 }} >
                                    {i.FederalInstitution
                                        && i.FederalInstitution.Name}
                                </TableRowColumn>
                                <TableRowColumn style={{ height: 20 }} >{i.RSSDID}</TableRowColumn>
                            </TableRow>)
                        ))}
                        {institutionsLoading && (
                            <TableRow>
                                <TableRowColumn colSpan={5} style={{textAlign: 'center'}}>
                                    <CircularProgress style={{ width: '100%' }} mode={'indeterminate'} />
                                </TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        );
    }

    componentDidMount() {
        this.props.requestDepartmentDBs('');
        
        // this.props.requestInstitutions();
    }
}

export default connect(
    (state: ApplicationState) => state.departmentDBs,
    DepartmentDBStore.actionCreators
)(InstitutionView);