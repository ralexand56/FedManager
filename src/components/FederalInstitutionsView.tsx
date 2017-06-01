import * as React from 'react';
import { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';

// interface Props {
//     federalInstitutions: Array<FederalInstitution>;
//     searchNameTxt: string;
// }
const styles = {
    mainContainer: {
        margin: 20,
        height: '100%',
    }
}

interface AppState {

}

export default class FederalInstitutionsView extends Component<{}, AppState> {

    render() {
        return (
            <Paper style={styles.mainContainer} zDepth={2}>
                <AppBar
                    titleStyle={{ fontSize: 20 }}
                    showMenuIconButton={false}
                    title={(
                        <span>Federal Institutions</span>
                    )} />
                <Toolbar style={{fontSize: 10}}>
                    <ToolbarTitle text="Search" />
                    <ToolbarGroup firstChild={true}>
                        <TextField
                            hintText="search by name..." />
                               <Toggle
                                    style={{ width: 70 }}
                                    defaultToggled={true}
                                    label={ 'starts with'} />
                    </ToolbarGroup>
                    <ToolbarSeparator />
                </Toolbar>
            </Paper>
        );
    }
}