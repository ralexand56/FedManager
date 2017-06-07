import * as React from 'react';
import { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import { ApplicationState } from '../store';
import { connect } from 'react-redux';
import { FederalInstitutionView} from './FederalInstitutionView';
import * as DepartmentDBStore from '../store/DepartmentDBReducer';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
    ToolbarTitle
} from 'material-ui/Toolbar';

type FedInstitutionsProps = DepartmentDBStore.DepartmentDBState &
    typeof DepartmentDBStore.actionCreators;

const styles = {
    mainContainer: {
        margin: 5,
        height: '100%',
    } as React.CSSProperties,
    fedContainer: {
        width: '100%',
        overflow: 'auto',
    } as React.CSSProperties,
};

export class FederalInstitutionsView extends Component<FedInstitutionsProps, void> {
    handleSearchTxtChanged(e: React.FormEvent<{}>, newVal: string) {
        this.props.setFedInstitutionFilter({ ...this.props.fedInstitutionFilter, searchTxt: newVal});
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
                            label={fedInstitutionFilter.isStartsWith ? 'starts' : 'contains'} />
                    </ToolbarGroup>
                    <ToolbarSeparator />
                </Toolbar>
                <div style={styles.fedContainer}>
                    {fedInstitutions.map(f => (
                        <FederalInstitutionView {...this.props} key={f.RSSDID} 
                            fedInst={f}
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