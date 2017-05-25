import { AppThunkAction } from './index';
import { DepartmentDB, Institution } from './../services/data-types';
import { Reducer } from 'redux';

const baseUrl = `http://dev.informars.com/webservices/FedSvc/odata/`;

export interface DepartmentDBState {
    activeDeptDB?: DepartmentDB;
    activeInstitutions: Array<Institution>;
    departmentDBs: Array<DepartmentDB>;
    deptDBsLoading: boolean;
    institutionsLoading: boolean;
}

interface RequestDepartmentDBsAction {
    type: 'REQUEST_DEPARTMENTDBS';
    searchTxt: string;
};

interface ReceiveDepartmentDBsAction {
    type: 'RECEIVE_DEPARTMENTDBS';
    searchTxt: string;
    departmentDBs: Array<DepartmentDB>;
};

interface RequestInstitutionsAction {
    type: 'REQUEST_INSTITUTIONS';
    deptDBID: number;
};

interface ReceiveInstitutionsAction {
    type: 'RECEIVE_INSTITUTIONS';
    activeInstitutions: Array<Institution>;
};

interface SelectDeptDBAction {
    type: 'SELECT_DEPTDB';
    deptDBID: number;
}

// interface DepartmentDBSearchChanged {
//     type: 'DEPARTMENTDB_SEARCH_CHANGED';
//     searchTxt: string;
// }

type KnownAction = RequestDepartmentDBsAction | ReceiveDepartmentDBsAction
    | RequestInstitutionsAction | ReceiveInstitutionsAction | SelectDeptDBAction;

// const fetchInstitutions = (deptDBID: number, dispatch: AppThunkAction<KnownAction>) => {
//     let reqTxt = `${baseUrl}Institutions?$filter=DeptDBID eq ${deptDBID}&$top=100&$expand=FederalInstitution`;
//     fetch(reqTxt)
//         .then(response => response.json())
//         .then(data => {
//             dispatch({ type: 'RECEIVE_INSTITUTIONS', activeInstitutions: data.value });
//         });
// };

export const actionCreators = {
    requestDepartmentDBs: (searchTxt: string): AppThunkAction<KnownAction> => (dispatch, getState) => {

        let nameFilter = `$filter=startswith(Name, '${searchTxt}')&`;
        let reqTxt = `${baseUrl}DepartmentDBs?${searchTxt && nameFilter}$expand=Department`;

        fetch(reqTxt)
            .then(response => response.json())
            .then(data => {
                let deptDBID: number = data.value[0].DeptDBID;

                // let instTxt = `${baseUrl}Institutions?$filter=DeptDBID 
                // eq ${deptDBID}&$top=100&$expand=FederalInstitution`;
                // fetch(instTxt)
                //     .then(response => response.json())
                //     .then(insts => {
                //         dispatch({ type: 'RECEIVE_INSTITUTIONS', activeInstitutions: insts.value });
                //     });
                dispatch({ type: 'REQUEST_INSTITUTIONS', deptDBID: deptDBID });

                dispatch({ type: 'RECEIVE_DEPARTMENTDBS', searchTxt: searchTxt, departmentDBs: data.value });
            });

        dispatch({ type: 'REQUEST_DEPARTMENTDBS', searchTxt: searchTxt });
    },

    requestInstitutions: (deptDBID: number = 0): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // let nameFilter = `$filter=startswith(Name, '${searchTxt}')&`;
        let reqTxt = `${baseUrl}Institutions?$filter=DeptDBID eq ${deptDBID}&$top=100&$expand=FederalInstitution`;

        console.dir('here');
        fetch(reqTxt)
            .then(response => response.json())
            .then(data => {
                console.dir('here');
                dispatch({ type: 'RECEIVE_INSTITUTIONS', activeInstitutions: data.value });
            });

        dispatch({ type: 'REQUEST_INSTITUTIONS', deptDBID: deptDBID });
    },

    selectDeptDB: (deptDBID: number): AppThunkAction<KnownAction> => (dispatch, getState) => {

        dispatch({ type: 'SELECT_DEPTDB', deptDBID: deptDBID });
    }
};

const unloadedState: DepartmentDBState = {
    activeDeptDB: undefined,
    activeInstitutions: [],
    departmentDBs: [],
    deptDBsLoading: false,
    institutionsLoading: false,
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

            actionCreators.requestInstitutions(action.departmentDBs[0].DeptDBID);
            return {
                ...state,
                activeDeptDB: action.departmentDBs ? action.departmentDBs[0] : undefined,
                departmentDBs: action.departmentDBs,
                deptDBsLoading: false,
            };

        case 'REQUEST_INSTITUTIONS':

            console.dir('reqw');
            return {
                ...state,
                activeInstitutions: [],
                institutionsLoading: true,
            };

        case 'RECEIVE_INSTITUTIONS':
            return {
                ...state,
                activeInstitutions: action.activeInstitutions,
                institutionsLoading: false,
            };

        case 'SELECT_DEPTDB':
            let activeDB = state.departmentDBs.filter(d => d.DeptDBID === action.deptDBID)[0];

            actionCreators.requestInstitutions(activeDB.DeptDBID);
            return {
                ...state,
                activeDeptDB: activeDB,
            };

        default:
            return state || unloadedState;
    }
};