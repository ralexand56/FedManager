import * as React from 'react';
import { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import { ApplicationState } from '../store';
import { connect } from 'react-redux';
import * as DepartmentDBStore from '../store/DepartmentDBReducer';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
    ToolbarTitle
} from 'material-ui/Toolbar';
import {
    Table,
    TableBody,
    TableRowColumn,
    TableRow,
} from 'material-ui/Table';
import {
    FederalInstitution,
} from './../services/data-types';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

type FedInstitutionsProps = DepartmentDBStore.DepartmentDBState &
    typeof DepartmentDBStore.actionCreators;

const styles = {
    mainContainer: {
        margin: 20,
        height: '100%',
        width: '100vw',
        overflowX: 'scroll',
    } as React.CSSProperties,
    fedContainer: {
        display: 'flex',
    } as React.CSSProperties,
    fedInstitution: {
        minWidth: 250,
        width: 250,
        margin: 5,
    } as React.CSSProperties
};

const FedInstitutionView = (props: { fedInst: FederalInstitution, assignFed: () => {}}) => {
    let { fedInst } = props;

    return (
        <Paper style={styles.fedInstitution} zDepth={2}>
            <AppBar
                titleStyle={{ fontSize: 15 }}
                showMenuIconButton={false}
                title={(
                    <span>
                        {fedInst.Name}
                    </span>
                )}
                iconElementRight={(
                    <IconMenu
                        iconButtonElement={
                            <IconButton><MoreVertIcon /></IconButton>
                        }
                        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                    >
                        <MenuItem primaryText="Assign" onClick={props.assignFed} />
                        <MenuItem primaryText="Detail" />
                    </IconMenu>
                )}
            />

            <Table>
                <TableBody
                    displayRowCheckbox={false}>
                    <TableRow style={{ height: 25 }}>
                        <TableRowColumn style={{ height: 25 }}>
                            <span>RSSDID | <a target="_blank"
                                href={`https://www.ffiec.gov/nicpubweb/nicweb/InstitutionProfile.aspx?parID_Rssd=
                                ${fedInst.RSSDID}&parDT_END=99991231`}>
                                {fedInst.RSSDID}</a></span>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow style={{ height: 25 }}>
                        <TableRowColumn style={{ height: 25 }}>
                            <span>Name | {fedInst.FullName}</span>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow style={{ height: 25 }}>
                        <TableRowColumn style={{ height: 25 }}>
                            <span>State | {fedInst.StateCode}</span>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow style={{ height: 25 }}>
                        <TableRowColumn style={{ height: 25 }}>
                            <span>Type | {fedInst.FederalEntityType.Name}</span>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow style={{ height: 25 }}>
                        <TableRowColumn style={{ height: 25 }}>
                            <span>Assigned | {fedInst.Institutions.length}</span>
                        </TableRowColumn>
                    </TableRow>
                </TableBody>
            </Table>
        </Paper>
    );
};

export class FederalInstitutionsView extends Component<FedInstitutionsProps, void> {

    constructor() {
        super();

        // this.handleAssignFedClicked = this.handleAssignFedClicked.bind(this);
    }

    handleSearchTxtChanged(e: React.FormEvent<{}>, newVal: string) {
        this.props.setFedInstitutionFilter({ ...this.props.fedInstitutionFilter, searchTxt: newVal});
    }

    handleAssignFedClicked = (fed: FederalInstitution, insts: string) => {
        console.dir(fed);
    }

    render() {
        let {
            fedInstitutions,
            fedInstitutionFilter,
        } = this.props;

        return (
            <Paper style={styles.mainContainer} zDepth={2}>
                <AppBar
                    titleStyle={{ fontSize: 20 }}
                    showMenuIconButton={false}
                    title={(
                        <span>Federal Institutions <small> | Count: {fedInstitutions.length}</small></span>
                    )} />
                <Toolbar>
                    <ToolbarTitle text="Search" />
                    <ToolbarGroup firstChild={true}>
                        <TextField
                            onChange={(e, newVal) => this.handleSearchTxtChanged(e, newVal)}
                            hintText="search by name..." />
                        <Toggle
                            style={{ width: 70 }}
                            defaultToggled={true}
                            label={fedInstitutionFilter.isStartsWith ? 'starts with' : 'contains'} />
                    </ToolbarGroup>
                    <ToolbarSeparator />
                </Toolbar>
                <div style={styles.fedContainer}>
                    {fedInstitutions.map(f => (
                        <FedInstitutionView key={f.RSSDID} fedInst={f}
                            assignFed={() => this.handleAssignFedClicked}
                         />
                    ))}
                </div>
            </Paper>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.departmentDBs,
    DepartmentDBStore.actionCreators
)(FederalInstitutionsView);