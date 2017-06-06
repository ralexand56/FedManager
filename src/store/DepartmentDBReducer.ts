import { AppThunkAction, ApplicationState } from './index';
import {
    DepartmentDB,
    DepositInstitution,
    Institution,
    InstitutionFilter,
    InstitutionType,
    State,
    FederalInstitution,
    FedInstitutionFilter
} from './../services/data-types';
import { Reducer } from 'redux';

const baseUrl = `http://dev.informars.com/webservices/FedSvc/odata/`;

export interface DepartmentDBState {
    activeDeptDB?: DepartmentDB;
    activeInstitutions: Institution[];
    departmentDBs: DepartmentDB[];
    deptDBsLoading: boolean;
    fedInstitutions: FederalInstitution[];
    fedInstitutionFilter: FedInstitutionFilter;
    fedInstitutionsLoading: boolean;
    institutionsLoading: boolean;
    institutionFilter: InstitutionFilter;
    institutionTotalCnt: number;
    institutionTypes: InstitutionType[];
    searchTxt: string;
    selectedInstitutionIndices: Array<number> | string;
    states: Array<State>;
}

interface AssignFederalInstitutionAction {
    type: 'ASSIGN_FEDINSTITUTION';
}

interface RequestDepartmentDBsAction {
    type: 'REQUEST_DEPARTMENTDBS';
    searchTxt: string;
    institutionFilter: InstitutionFilter;
};

interface ReceiveDepartmentDBsAction {
    type: 'RECEIVE_DEPARTMENTDBS';
    searchTxt: string;
    departmentDBs: Array<DepartmentDB>;
};

interface SetInstitutionFilter {
    type: 'SET_INSTITUTION_FILTER';
    institutionFilter: InstitutionFilter;
}

interface SetFedInstitutionFilter {
    type: 'SET_FEDINSTITUTION_FILTER';
    fedInstitutionFilter: FedInstitutionFilter;
}

interface LoadStatesAction {
    type: 'LOAD_STATES';
    states: Array<State>;
}

interface LoadInstitutionTypesAction {
    type: 'LOAD_INSTITUTIONTYPES';
    instTypes: InstitutionType[];
}

interface RequestFedInstitutionsAction {
    type: 'REQUEST_FEDINSTITUTIONS';
};

interface ReceiveFedInstitutionsAction {
    type: 'RECEIVE_FEDINSTITUTIONS';
    fedInstitutions: FederalInstitution[];
};

interface RequestInstitutionsAction {
    type: 'REQUEST_INSTITUTIONS';
};

interface ReceiveInstitutionsAction {
    type: 'RECEIVE_INSTITUTIONS';
    activeInstitutions: Array<Institution>;
    cnt: number;
};

interface SelectDeptDBAction {
    type: 'SELECT_DEPTDB';
    deptDBID: number;
    institutionFilter: InstitutionFilter;
};

interface UpdateInstitutionSelection {
    type: 'UPDATE_INSTITUTION_SELECTION';
    indices: string | Array<number>;
}

type KnownAction = RequestDepartmentDBsAction | ReceiveDepartmentDBsAction | SetInstitutionFilter
    | SetFedInstitutionFilter | ReceiveInstitutionsAction | RequestInstitutionsAction
    | RequestFedInstitutionsAction | ReceiveFedInstitutionsAction | LoadInstitutionTypesAction
    | UpdateInstitutionSelection | AssignFederalInstitutionAction
    | SelectDeptDBAction | LoadStatesAction;

const fetchInstitutions =
    (dispatch: (action: KnownAction) => void, instFilter: InstitutionFilter) => {

        dispatch({ type: 'REQUEST_INSTITUTIONS' });

        let reqTxt = `${baseUrl}Institutions?$filter=DeptDBID eq ${instFilter.deptDBID}`;

        if (instFilter.searchTxt) {
            let encodedTxt = encodeURIComponent(instFilter.searchTxt);

            reqTxt += ` and ${instFilter.isStartsWith ? 'startswith' : 'contains'}(Name, '${encodedTxt}')`;
        }

        if (instFilter.selectedStates !== null
            && instFilter.selectedStates.length
            && Array.isArray(instFilter.selectedStates)) {
            let statesTxt = instFilter.selectedStates.map(x => `StateCode eq '${x}'`).join(' or ');
            reqTxt += ` and (${statesTxt})`;
        }

        if (instFilter.selectedTypes !== null
            && instFilter.selectedTypes.length
            && Array.isArray(instFilter.selectedTypes)) {
            let typesTxt = instFilter.selectedTypes.map(x => `InstitutionTypeID eq ${x}`).join(' or ');
            reqTxt += ` and (${typesTxt})`;
        }

        reqTxt += `&$top=60&$expand=FederalInstitution,InstitutionType&$orderby=Name,StateCode&$count=true`;
        console.dir(reqTxt);
        fetch(reqTxt)
            .then(response => response.json())
            .then(insts => {
                let institutions: Array<Institution> = insts.value;

                institutions.forEach((i: Institution) => {
                    i.IsSelected = false;
                });

                dispatch({
                    type: 'RECEIVE_INSTITUTIONS',
                    activeInstitutions: institutions,
                    cnt: insts['@odata.count'],
                });
            }
            );

    };

export const fetchFederalInstitutions =
    (dispatch: (action: KnownAction) => void, searchOptions: FedInstitutionFilter) => {
        dispatch({ type: 'REQUEST_FEDINSTITUTIONS' });

        if (searchOptions.searchTxt === '') {
            dispatch({
                type: 'RECEIVE_FEDINSTITUTIONS',
                fedInstitutions: [],
            });

            return;
        }

        let searchStr = `${baseUrl}FederalInstitutions?$filter=IsActive%20eq%20true`;
        let nameSearch = encodeURIComponent(searchOptions.searchTxt);

        searchStr += ` and IsHCCode ne 1`;

        if (searchOptions.searchBankingTypes) {
            searchStr += ` and (FederalEntityTypeCode eq 'NMB' 
                      or FederalEntityTypeCode eq 'CPB' 
                      or FederalEntityTypeCode eq 'FBK' 
                      or FederalEntityTypeCode eq 'SMB' 
                      or FederalEntityTypeCode eq 'SSB' 
                      or FederalEntityTypeCode eq 'NAT' 
                      or FederalEntityTypeCode eq 'AGB')`;
        }

        if (searchOptions.isStartsWith) {
            searchStr += ` and (startswith(FullName, '${nameSearch}') 
            ${searchOptions.searchHoldingCompanies ? `or startswith(HoldingCompany/FullName, '${nameSearch}')` : ``})`;
        } else {
            searchStr += ` and (contains(FullName, '${nameSearch}') 
            ${searchOptions.searchHoldingCompanies ? `or contains(HoldingCompany/FullName, '${nameSearch}')` : ``})`;
        }

        searchStr += `&$top=50&$expand=Institutions,FederalEntityType,HoldingCompany&$orderby=FullName,StateCode`;

        // console.dir(searchStr);
        fetch(searchStr)
            .then(response => response.json())
            .then(fedInsts => {

                dispatch({
                    type: 'RECEIVE_FEDINSTITUTIONS',
                    fedInstitutions: fedInsts.value,
                });
            });
    };

export const assignFedByDeptDB = (dispatch: (action: KnownAction) => void,
    deptDBID: number, rssDID: number, instID: string) => {
    let response: Promise<Response>;
    console.dir(deptDBID);

    switch (deptDBID) {
        case 1:
            response = fetch(`DepositInstitutions(${parseInt(instID, 10)})`);

            response.then(r => r.json()).then((institution: DepositInstitution) => {

                institution.BA_KEY_ID = rssDID;

                let rssInst = {
                    BA_KEY_ID: rssDID.toString()
                };

                fetch(`DepositInstitutions(${institution.BA_ID})`, {
                    method: 'patch',
                    body: JSON.stringify(rssInst)
                });
            });
            break;

        case 3:
            response = fetch(`ConsumerInstitutions?$filter=BankID eq '${instID}'`);

            response.then(r => r.json()).then(x => {
                let institution = x.value[0];

                institution.RSSDID = rssDID;

                fetch(`ConsumerInstitutions(${institution.InstitutionID})`, {
                    method: 'put',
                    body: JSON.stringify(institution)
                });
            });
            break;

        default:
            break;
    }

    dispatch({
        type: 'ASSIGN_FEDINSTITUTION',
    });
};

export const updateModifiedDate = (dbid: number) => {
    return fetch(`DepartmentDBs(${dbid})`, {
        method: 'patch',
        body: JSON.stringify({ LastModified: new Date() })
    });
};

export const actionCreators = {
    assignFed: (fedInst: FederalInstitution, deptDBID: number, instIDs: number[] | string):
        AppThunkAction<KnownAction> => (dispatch: (action: KnownAction) => void, getState: () => ApplicationState) => {
            let rssDID = fedInst.RSSDID;

            // console.dir(fedInst);
            if (typeof (instIDs) !== 'string') {
                console.dir(instIDs);
                instIDs.forEach(i => {
                    assignFedByDeptDB(
                        dispatch,
                        deptDBID,
                        rssDID,
                        getState().departmentDBs.activeInstitutions[i].CustomID);
                });
            }

            // updateModifiedDate(deptDBID);
        },

    loadStates: ():
        AppThunkAction<KnownAction> => (dispatch: (action: KnownAction) => void, getState: () => ApplicationState) => {
            fetch(`${baseUrl}States`)
                .then(response => response.json())
                .then(states => dispatch({ type: 'LOAD_STATES', states: states.value }));
        },

    loadInstitutionTypes: ():
        AppThunkAction<KnownAction> => (dispatch: (action: KnownAction) => void, getState: () => ApplicationState) => {
            fetch(`${baseUrl}InstitutionTypes`)
                .then(response => response.json())
                .then(instTypes => dispatch({ type: 'LOAD_INSTITUTIONTYPES', instTypes: instTypes.value }));
        },

    requestDepartmentDBs: (searchTxt: string, instFilter: InstitutionFilter):
        AppThunkAction<KnownAction> => (dispatch: (action: KnownAction) => void, getState: () => ApplicationState) => {

            let nameFilter = `$filter=startswith(Name, '${searchTxt}')&`;
            let reqTxt = `${baseUrl}DepartmentDBs?${searchTxt && nameFilter}$expand=Department,Institutions`;

            fetch(reqTxt)
                .then(response => response.json())
                .then(depts => {
                    let deptsArr: DepartmentDB[] = depts.value;

                    deptsArr.forEach((d: DepartmentDB) => {
                        d.Pct = d.Institutions.length === 0 ? 0 :
                            (d.Institutions.filter(x => x.RSSDID).length / d.Institutions.length);
                    });

                    let deptDBID: number = depts.value[0].DeptDBID;
                    instFilter.deptDBID = deptDBID;

                    fetchInstitutions(dispatch, instFilter);

                    dispatch({ type: 'RECEIVE_DEPARTMENTDBS', searchTxt: searchTxt, departmentDBs: depts.value });
                });

            dispatch({ type: 'REQUEST_DEPARTMENTDBS', searchTxt: searchTxt, institutionFilter: instFilter });
        },

    setInstitutionFilter: (instFilter: InstitutionFilter):
        AppThunkAction<KnownAction> => (dispatch: (action: KnownAction) => void, getState: () => ApplicationState) => {
            fetchInstitutions(dispatch, instFilter);

            dispatch({ type: 'SET_INSTITUTION_FILTER', institutionFilter: instFilter });
        },

    setFedInstitutionFilter: (fedInstitutionFilter: FedInstitutionFilter):
        AppThunkAction<KnownAction> => (dispatch: (action: KnownAction) => void, getState: () => ApplicationState) => {
            fetchFederalInstitutions(dispatch, fedInstitutionFilter);

            dispatch({ type: 'SET_FEDINSTITUTION_FILTER', fedInstitutionFilter: fedInstitutionFilter });
        },

    selectDeptDB: (deptDBID: number, instFilter: InstitutionFilter):
        AppThunkAction<KnownAction> => (dispatch, getState) => {
            fetchInstitutions(dispatch, instFilter);

            dispatch({ type: 'SELECT_DEPTDB', deptDBID: deptDBID, institutionFilter: instFilter });
        },

    updateInstitutionSelection: (indices: string | number[]) => {
        return {
            type: 'UPDATE_INSTITUTION_SELECTION', indices: indices
        };
    },
};

const unloadedState: DepartmentDBState = {
    activeDeptDB: undefined,
    activeInstitutions: [],
    departmentDBs: [],
    deptDBsLoading: false,
    fedInstitutions: [],
    fedInstitutionFilter: {
        RSSDID: null,
        searchTxt: '',
        isStartsWith: true,
        searchBankingTypes: false,
        searchHoldingCompanies: true,
        selectedStates: [],
    },
    fedInstitutionsLoading: false,
    institutionsLoading: false,
    institutionFilter: {
        deptDBID: 0,
        searchTxt: '',
        isStartsWith: true,
        selectedStates: [],
        selectedTypes: null,
    },
    institutionTotalCnt: 0,
    institutionTypes: [],
    searchTxt: '',
    selectedInstitutionIndices: [],
    states: [],
};

export const reducer: Reducer<DepartmentDBState> = (state: DepartmentDBState, action: KnownAction) => {
    switch (action.type) {
        case 'ASSIGN_FEDINSTITUTION':

            return {
                ...state,
            };

        case 'REQUEST_DEPARTMENTDBS':

            return {
                ...state,
                departmentDBs: [],
                deptDBsLoading: true,
            };

        case 'RECEIVE_DEPARTMENTDBS':

            return {
                ...state,
                activeDeptDB: action.departmentDBs ? action.departmentDBs[0] : undefined,
                departmentDBs: action.departmentDBs,
                deptDBsLoading: false,
            };

        case 'SET_INSTITUTION_FILTER':

            return {
                ...state,
                institutionFilter: action.institutionFilter,
            };

        case 'SET_FEDINSTITUTION_FILTER':

            return {
                ...state,
                fedInstitutionFilter: action.fedInstitutionFilter,
            };

        case 'LOAD_STATES':

            return {
                ...state,
                states: action.states,
            };

        case 'LOAD_INSTITUTIONTYPES':

            return {
                ...state,
                institutionTypes: action.instTypes,
            };

        case 'REQUEST_FEDINSTITUTIONS':

            return {
                ...state,
                fedInstitutions: [],
                fedInstitutionsLoading: true,
            };

        case 'REQUEST_INSTITUTIONS':

            return {
                ...state,
                activeInstitutions: [],
                institutionsLoading: true,
            };

        case 'RECEIVE_INSTITUTIONS':

            return {
                ...state,
                activeInstitutions: action.activeInstitutions,
                institutionTotalCnt: action.cnt,
                institutionsLoading: false,
            };

        case 'RECEIVE_FEDINSTITUTIONS':

            return {
                ...state,
                fedInstitutions: action.fedInstitutions,
                fedInstitutionsLoading: false,
            };

        case 'SELECT_DEPTDB':
            let activeDB = state.departmentDBs.filter(d => d.DeptDBID === action.deptDBID)[0];
            action.institutionFilter = unloadedState.institutionFilter;
            action.institutionFilter.deptDBID = action.deptDBID;

            actionCreators.setInstitutionFilter(action.institutionFilter);
            return {
                ...state,
                activeDeptDB: activeDB,
                institutionFilter: action.institutionFilter,
            };

        case 'UPDATE_INSTITUTION_SELECTION':

            return {
                ...state,
                selectedInstitutionIndices: action.indices,
            };

        default:
            return state || unloadedState;
    }
};