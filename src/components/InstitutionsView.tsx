import * as React from 'react';
import { Component } from 'react';
import { ApplicationState } from '../store';
import AppBar from 'material-ui/AppBar';
// import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import * as DepartmentDBStore from '../store/DepartmentDBReducer';
// import { InstitutionFilter } from './../services/data-types';
// import LinearProgress from 'material-ui/LinearProgress';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import * as Radium from 'radium';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
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
        height: '60%',
        flow: 1,
        backgroundColor: 'white',
        margin: 20,
        overflow: 'auto',
    } as React.CSSProperties,
    loader: {
        margin: 100,
    }
};

interface AppState {
    selectedState: Array<string> | null;
}

@connect()
@Radium
export class InstitutionView extends Component<InstitutionsProps, AppState> {
    isStartsWith: boolean = true;
    constructor() {
        super();

        this.state = { selectedState: [] };
    }

    handleSelectedStateChanged = (
        evt: React.FormEvent<{}>,
        index: number,
        value: Array<string> | null) => {
        this.setState({ selectedState: value });

        this.props.setInstitutionFilter({ ...this.props.institutionFilter, selectedStates: value });
    }

    handleToggleSelection(rows: number[] | string) {
        this.props.updateInstitutionSelection(rows);
    }

    handleSearchTxtChanged(e: React.FormEvent<{}>, newVal: string) {
        this.props.setInstitutionFilter({ ...this.props.institutionFilter, searchTxt: newVal, });
    }

    handleStartsWithToggle(e: React.FormEvent<{}>, isInputChecked: boolean) {
        this.props.setInstitutionFilter({ ...this.props.institutionFilter, isStartsWith: isInputChecked, });
    }

    public render() {
        let {
            activeDeptDB,
            activeInstitutions,
            institutionsLoading,
            institutionFilter,
            institutionTotalCnt,
            selectedInstitutionIndices,
            states,
         } = this.props;

        let arr: number[] = [];

        if (typeof (selectedInstitutionIndices) !== 'string') {
            arr = selectedInstitutionIndices;
        }

        return (
            <Paper style={styles.mainContainer} zDepth={2}>
                <AppBar
                    titleStyle={{ fontSize: 20 }}
                    showMenuIconButton={false}
                    title={activeDeptDB && (
                            <span>{activeDeptDB!.Name}
                            <small> | Count: {institutionTotalCnt}</small></span>
                            )} />
                <Table
                    onRowSelection={(e) => this.handleToggleSelection(e)}
                    fixedHeader={true}
                    selectable={true}
                    multiSelectable={true}>
                    <TableHeader
                        displaySelectAll={false}
                        enableSelectAll={true}>
                        <TableRow>
                            <TableHeaderColumn>
                                <TextField style={{ padding: '0px' }}
                                    onChange={(e, newVal) => this.handleSearchTxtChanged(e, newVal)}
                                    hintText="search by name..." />
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                <Toggle
                                    style={{ width: 70 }}
                                    defaultToggled={true}
                                    onToggle={(e, isInputChecked) => this.handleStartsWithToggle(e, isInputChecked)}
                                    label={institutionFilter.isStartsWith ? 'starts with' : 'contains'} />
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                <SelectField
                                    value={this.state.selectedState}
                                    style={{ fontSize: 13 }}
                                    multiple={true}
                                    onChange={this.handleSelectedStateChanged}>
                                    <MenuItem
                                        value={[]}
                                        primaryText="Select State" />
                                    {
                                        states.map(st =>
                                            (
                                                <MenuItem key={st.StateCode}
                                                    value={st.StateCode}
                                                    primaryText={st.Name} />)
                                        )}
                                </SelectField>
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                Selection: {selectedInstitutionIndices.length}
                            </TableHeaderColumn>
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
                        {activeInstitutions && (activeInstitutions.map((i, ind) => (
                            <TableRow className="row"
                                selected={arr.indexOf(ind) !== -1}
                                style={{ height: 20 }}
                                key={i.CustomID}>
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
                                <TableRowColumn colSpan={5} style={{ textAlign: 'center' }}>
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
        this.props.loadStates();
    }
}

export default connect(
    (state: ApplicationState) => state.departmentDBs,
    DepartmentDBStore.actionCreators
)(InstitutionView);