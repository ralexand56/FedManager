import { Component } from 'react';
import { FederalInstitution } from '../services/data-types';

interface Props {
    federalInstitutions: Array<FederalInstitution>;
    searchNameTxt: string;
}

interface AppState {

}

export default class DepartmentDBView extends Component<Props, AppState> { 

}