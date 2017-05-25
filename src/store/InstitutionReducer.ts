import { AppThunkAction } from './index';
import { Institution } from './../services/data-types';
import { Reducer } from 'redux';

const baseUrl = `http://dev.informars.com/webservices/FedSvc/odata/`;

export interface InstitutionState {
    currentPage: number;
    deptDBID: number;
    institutions: Array<Institution>;
    isLoading: boolean;
}

interface RequestInstitutionsAction {
    type: 'REQUEST_INSTITUTIONS';
    deptDBID: number;
};

interface ReceiveInstitutionsAction {
    type: 'RECEIVE_INSTITUTIONS';
    institutions: Array<Institution>;
};

type KnownAction = RequestInstitutionsAction | ReceiveInstitutionsAction;

export const actionCreators = {
    requestInstitutions: (deptDBID: number = 1): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let { departmentDBs } = getState();
        let { activeDeptDB } = departmentDBs;
        console.dir(activeDeptDB);

        // let nameFilter = `$filter=startswith(Name, '${searchTxt}')&`;
        let reqTxt = `${baseUrl}Institutions?$filter=DeptDBID eq ${activeDeptDB ? activeDeptDB.DeptDBID : deptDBID}
        &$top=100&$expand=FederalInstitution`;

        fetch(reqTxt)
            .then(response => response.json())
            .then(data => {
                dispatch({ type: 'RECEIVE_INSTITUTIONS', institutions: data.value });
            });

        dispatch({ type: 'REQUEST_INSTITUTIONS', deptDBID: deptDBID });
    }
};

const unloadedState: InstitutionState = {
    currentPage: 0,
    deptDBID: 1,
    institutions: [],
    isLoading: false,
};

export const reducer: Reducer<InstitutionState> = (state: InstitutionState, action: KnownAction) => {
    switch (action.type) {
        case 'REQUEST_INSTITUTIONS':
            return {
                ...state,
                institutions: [],
                isLoading: true,
            };

        case 'RECEIVE_INSTITUTIONS':
            return {
                ...state,
                institutions: action.institutions,
                isLoading: false,
            };

        default:
            return state || unloadedState;
    }
};