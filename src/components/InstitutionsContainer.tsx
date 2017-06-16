import * as React from 'react';
import { Component } from 'react';
import { ApplicationState } from '../store';
// import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import * as DepartmentDBStore from '../store/DepartmentDBReducer';
// import { InstitutionFilter } from './../services/data-types';
// import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
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

import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
    ToolbarTitle
} from 'material-ui/Toolbar';

import {
    DepartmentDBState,
} from './../services/data-types';

type InstitutionsProps = DepartmentDBState &
    typeof DepartmentDBStore.actionCreators;

const styles = {
    td: {
        height: 20
    } as React.CSSProperties,
    mainContainer: {
        height: '60%',
        flow: 1,
        backgroundColor: 'white',
        margin: 5,
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
export class InstitutionsContainer extends Component<InstitutionsProps, AppState> {
    node: SelectField;
    isStartsWith: boolean = true;
    constructor() {
        super();

        this.state = { selectedState: [] };
    }

    handleSelectedStateChanged = (
        evt: React.FormEvent<{}>,
        index: number,
        value: Array<string>) => {
        this.setState({ selectedState: value });

        this.props.setInstitutionFilter({ ...this.props.institutionFilter, selectedStates: value });
    }

    handleSelectedInstTypeChanged = (
        evt: React.FormEvent<{}>,
        index: number,
        value: number[]) => {

        this.props.setInstitutionFilter({ ...this.props.institutionFilter, selectedTypes: value });
    }

    handleSelectAll = () => {
        this.props.selectAll();
    }

    handleSelectNone = () => {
        this.props.selectNone();
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
            institutionTypes,
            selectedInstitutionIndices,
            states,
         } = this.props;

        let arr: number[] = [];

        if (typeof (selectedInstitutionIndices) !== 'string') {
            arr = selectedInstitutionIndices;
        }

        return (
            <Paper style={styles.mainContainer} zDepth={2}>
                <Toolbar
                    style={{ height: 30, fontSize: 20 }}>
                    <ToolbarGroup>
                        {activeDeptDB && (
                            <span>{activeDeptDB!.Name}
                                <small> | Count: {institutionTotalCnt}</small></span>
                        )}
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarTitle text={`Selection: ${selectedInstitutionIndices.length}`} />
                        <ToolbarSeparator />
                        <FlatButton label="All" onClick={this.handleSelectAll} />
                        <FlatButton label="None" onClick={this.handleSelectNone} />
                    </ToolbarGroup>
                </Toolbar>
                <Toolbar style={{ height: 30, fontSize: 20 }}>
                    <ToolbarGroup>
                        <ToolbarTitle text="Search" />
                        <TextField style={{ padding: '0px' }}
                            onChange={(e, newVal) => this.handleSearchTxtChanged(e, newVal)}
                            hintText="search by name..." />
                        <Toggle
                            style={{ width: 70 }}
                            defaultToggled={true}
                            onToggle={(e, isInputChecked) => this.handleStartsWithToggle(e, isInputChecked)}
                            label={institutionFilter.isStartsWith ? 'starts' : 'contains'} />
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <SelectField
                            value={institutionFilter.selectedStates}
                            style={{ fontSize: 15 }}
                            multiple={true}
                            onChange={this.handleSelectedStateChanged}>
                            <MenuItem
                                value={''}
                                primaryText="Select State" />
                            {
                                states.map(st =>
                                    (
                                        <MenuItem key={st.StateCode}
                                            value={st.StateCode}
                                            primaryText={st.Name} />)
                                )}
                        </SelectField>
                        <SelectField
                            ref={node => this.node = node}
                            style={{ fontSize: 15 }}
                            multiple={true}
                            value={institutionFilter.selectedTypes}
                            onChange={this.handleSelectedInstTypeChanged}>
                            <MenuItem
                                value={0}
                                primaryText="Select Type" />
                            {
                                institutionTypes.map(typ =>
                                    (
                                        <MenuItem key={typ.InstitutionTypeID}
                                            value={typ.InstitutionTypeID}
                                            primaryText={typ.Name} />)
                                )}
                        </SelectField>
                    </ToolbarGroup>
                    <ToolbarSeparator />
                </Toolbar>
                <Table
                    onRowSelection={(e) => this.handleToggleSelection(e)}
                    fixedHeader={true}
                    selectable={true}
                    multiSelectable={true}>
                    <TableHeader
                        adjustForCheckbox={false}
                        displaySelectAll={false}
                        enableSelectAll={true}>
                        <TableRow style={{ height: 20 }} >
                            <TableHeaderColumn style={{ height: 20 }}>ID</TableHeaderColumn>
                            <TableHeaderColumn style={{ height: 20 }}>Name</TableHeaderColumn>
                            <TableHeaderColumn style={{ height: 20 }}>State</TableHeaderColumn>
                            <TableHeaderColumn style={{ height: 20 }}>Type</TableHeaderColumn>
                            <TableHeaderColumn style={{ height: 20 }}>Region</TableHeaderColumn>
                            <TableHeaderColumn style={{ height: 20 }}>Fed. Inst.</TableHeaderColumn>
                            <TableHeaderColumn style={{ height: 20 }}>RSSDID</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        deselectOnClickaway={false}
                        displayRowCheckbox={true}
                        stripedRows={true}
                        showRowHover={false}>
                        {activeInstitutions && (activeInstitutions.map((i, ind) => (
                            <TableRow
                                selected={arr.indexOf(ind) !== -1}
                                style={styles.td}
                                key={i.CustomID}>
                                <TableRowColumn
                                    style={{ height: 20, color: i.RSSDID ? 'green' : 'red' }}
                                >{i.CustomID}</TableRowColumn>
                                <TableRowColumn style={{ height: 20 }} >{i.Name}</TableRowColumn>
                                <TableRowColumn style={{ height: 20 }} >{i.StateCode}</TableRowColumn>
                                <TableRowColumn style={{ height: 20 }} >{i.InstitutionType.Name}</TableRowColumn>
                                <TableRowColumn style={{ height: 20 }} >{i.Region}</TableRowColumn>
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
}

export default connect(
    (state: ApplicationState) => state.departmentDBs,
    DepartmentDBStore.actionCreators
)(InstitutionsContainer);