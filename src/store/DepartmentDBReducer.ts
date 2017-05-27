import { AppThunkAction } from './index';
import { DepartmentDB, Institution, InstitutionFilter, State } from './../services/data-types';
import { Reducer } from 'redux';

const baseUrl = `http://dev.informars.com/webservices/FedSvc/odata/`;

export interface DepartmentDBState {
    activeDeptDB?: DepartmentDB;
    activeInstitutions: Array<Institution>;
    departmentDBs: Array<DepartmentDB>;
    deptDBsLoading: boolean;
    searchTxt: string;
    institutionsLoading: boolean;
    institutionFilter: InstitutionFilter;
    institutionTotalCnt: number;
    states: Array<State>;
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

interface LoadStates {
    type: 'LOAD_STATES';
    states: Array<State>;
}

// interface RequestInstitutionsAction {
//     type: 'REQUEST_INSTITUTIONS';
//     institutionFilter: InstitutionFilter;
// };

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

// interface DepartmentDBSearchChanged {
//     type: 'DEPARTMENTDB_SEARCH_CHANGED';
//     searchTxt: string;
// }

type KnownAction = RequestDepartmentDBsAction | ReceiveDepartmentDBsAction | SetInstitutionFilter
    | ReceiveInstitutionsAction | SelectDeptDBAction | LoadStates;

const fetchInstitutions = (instFilter: InstitutionFilter) => {
    let reqTxt = `${baseUrl}Institutions?$filter=DeptDBID eq ${instFilter.deptDBID}`;

    if (instFilter.searchTxt) {
        reqTxt += ` and ${instFilter.isStartsWith ? 'startswith' : 'contains'}(Name, '${instFilter.searchTxt}')`;
    }

    if (instFilter.selectedStates.length) {
        let statesTxt = instFilter.selectedStates.map(x => `StateCode eq '${x}'`).join(' or ');
        reqTxt += `and (${statesTxt})`;
    }

    reqTxt += `&$top=100&$expand=FederalInstitution&$count=true`;
    // console.dir(reqTxt);
    return fetch(reqTxt)
        .then(response => response.json());
};

export const actionCreators = {
    loadStates: ():
        AppThunkAction<KnownAction> => (dispatch, getState) => {
            fetch(`${baseUrl}States`)
                .then(response => response.json())
                .then(states => dispatch({ type: 'LOAD_STATES', states: states.value }));
        }
    ,
    requestDepartmentDBs: (searchTxt: string, instFilter: InstitutionFilter):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            let nameFilter = `$filter=startswith(Name, '${searchTxt}')&`;
            let reqTxt = `${baseUrl}DepartmentDBs?${searchTxt && nameFilter}$expand=Department`;

            fetch(reqTxt)
                .then(response => response.json())
                .then(depts => {
                    let deptDBID: number = depts.value[0].DeptDBID;
                    instFilter.deptDBID = deptDBID;

                    fetchInstitutions(instFilter)
                        .then(insts => {

                            dispatch({
                                type: 'RECEIVE_INSTITUTIONS',
                                activeInstitutions: insts.value, // MultiSort(insts.value, 'Name', 'StateCode'),
                                cnt: insts['@odata.count'],
                            });
                        });

                    dispatch({ type: 'RECEIVE_DEPARTMENTDBS', searchTxt: searchTxt, departmentDBs: depts.value });
                });

            dispatch({ type: 'REQUEST_DEPARTMENTDBS', searchTxt: searchTxt, institutionFilter: instFilter });
        },

    setInstitutionFilter: (instFilter: InstitutionFilter):
        AppThunkAction<KnownAction> => (dispatch, getState) => {
            fetchInstitutions(instFilter)
                .then(insts => {
                    dispatch({
                        type: 'RECEIVE_INSTITUTIONS',
                        activeInstitutions: insts.value,
                        cnt: insts['@odata.count'],
                    });
                });

            dispatch({ type: 'SET_INSTITUTION_FILTER', institutionFilter: instFilter });
        },

    // requestInstitutions: (deptDBID: number = 0):
    //     AppThunkAction<KnownAction> => (dispatch, getState) => {
    //         let { institutionFilter } = getState().departmentDBs;
    //         console.dir(institutionFilter);
    //         // let nameFilter = `$filter=startswith(Name, '${searchTxt}')&`;
    //         let reqTxt = `${baseUrl}Institutions?$filter=DeptDBID eq ${deptDBID}`;

    //         if (institutionFilter.searchTxt) {
    //             reqTxt += ` and startswith(Name, '${institutionFilter.searchTxt}')`;
    //         }

    //         reqTxt += `&$top=100&$expand=FederalInstitution`;

    //         fetch(reqTxt)
    //             .then(response => response.json())
    //             .then(data => {
    //                 dispatch({ type: 'RECEIVE_INSTITUTIONS', activeInstitutions: data.value });
    //             });

    //         dispatch({ type: 'REQUEST_INSTITUTIONS', deptDBID: deptDBID });
    //     },

    selectDeptDB: (deptDBID: number, instFilter: InstitutionFilter):
        AppThunkAction<KnownAction> => (dispatch, getState) => {
            fetchInstitutions(instFilter)
                .then(insts => {
                    dispatch({
                        type: 'RECEIVE_INSTITUTIONS',
                        activeInstitutions: insts.value, // MultiSort(insts.value, 'Name', 'StateCode'),
                        cnt: insts['@odata.count'],
                    });
                });

            dispatch({ type: 'SELECT_DEPTDB', deptDBID: deptDBID, institutionFilter: instFilter });
        },
};

const unloadedState: DepartmentDBState = {
    activeDeptDB: undefined,
    activeInstitutions: [],
    departmentDBs: [],
    deptDBsLoading: false,
    institutionsLoading: false,
    institutionFilter: {
        deptDBID: 0,
        searchTxt: '',
        isStartsWith: true,
        selectedStates: [],
    },
    institutionTotalCnt: 0,
    searchTxt: '',
    states: [],
};

export const reducer: Reducer<DepartmentDBState> = (state: DepartmentDBState, action: KnownAction) => {
    switch (action.type) {
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

        case 'LOAD_STATES':

            return {
                ...state,
                states: action.states,
            };

        // case 'REQUEST_INSTITUTIONS':

        //     return {
        //         ...state,
        //         activeInstitutions: [],
        //         institutionsLoading: true,
        //         institutionFilter: action.F
        //     };

        case 'RECEIVE_INSTITUTIONS':
            return {
                ...state,
                activeInstitutions: action.activeInstitutions,
                institutionTotalCnt: action.cnt,
                institutionsLoading: false,
            };

        case 'SELECT_DEPTDB':
            let activeDB = state.departmentDBs.filter(d => d.DeptDBID === action.deptDBID)[0];
            action.institutionFilter.deptDBID = action.deptDBID;

            actionCreators.setInstitutionFilter(action.institutionFilter);
            return {
                ...state,
                activeDeptDB: activeDB,
            };

        default:
            return state || unloadedState;
    }
};