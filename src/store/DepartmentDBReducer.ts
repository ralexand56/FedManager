import { AppThunkAction, ApplicationState } from './index';
import {
    DepartmentDBState,
    DepartmentDB,
    DepositInstitution,
    KnownAction,
    Institution,
    InstitutionFilter,
    FederalInstitution,
    FedInstitutionFilter
} from './../services/data-types';
import { Reducer } from 'redux';

const baseUrl = `https://dev.informars.com/webservices/FedSvc/odata/`;

const unloadedState: DepartmentDBState = {
    activeDeptDB: undefined,
    activeInstitutions: [],
    departmentDBs: [],
    deptDBsLoading: false,
    fedInstitutions: [],
    fedInstitutionFilter: {
        RSSDID: undefined,
        searchTxt: '',
        isStartsWith: true,
        searchBankingTypes: false,
        searchHoldingCompanies: true,
        selectedStates: [''],
        selectedTypes: [''],
    },
    fedInstitutionsLoading: false,
    fedInstitutionTypes: [],
    institutionsLoading: false,
    institutionFilter: {
        deptDBID: 1,
        searchTxt: '',
        isStartsWith: true,
        RSSDID: null,
        selectedStates: [],
        selectedTypes: null,
    },
    institutionTotalCnt: 0,
    institutionTypes: [],
    searchTxt: '',
    selectedInstitutionIndices: [],
    showDeptDBs: true,
    states: [],
};

export const reducer: Reducer<DepartmentDBState> = (state: DepartmentDBState, action: KnownAction) => {
    switch (action.type) {
        case 'ASSIGN_FEDINSTITUTION':

            return {
                ...state,
            };

        case 'INIT':

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

        case 'RECEIVE_FEDINSTITUTIONTYPES':

            return {
                ...state,
                fedInstitutionTypes: action.fedInstitutionTypes,
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

        case 'RECEIVE_STATES':

            return {
                ...state,
                states: action.states,
            };

        case 'RECEIVE_INSTITUTIONTYPES':

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
                institutionTotalCnt: 0,
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

        case 'SELECT_ALL':

            return {
                ...state,
                selectedInstitutionIndices: state.activeInstitutions.map((x, ind) => ind),
            };

        case 'SELECT_NONE':

            return {
                ...state,
                selectedInstitutionIndices: [],
            };

        case 'SELECT_DEPTDB':

            return {
                ...state,
                activeDeptDB: state.departmentDBs.filter(deptDB => deptDB.DeptDBID === action.deptDBID)[0],
                institutionFilter: unloadedState.institutionFilter,
            };

        case 'SET_FEDINSTITUTION_FILTER':

            return {
                ...state,
                fedInstitutionFilter: action.fedInstitutionFilter,
            };

        case 'TOGGLE_DEPARTMENT_VISIBILITY':

            return {
                ...state,
                showDeptDBs: !state.showDeptDBs,
            };

        default:
            return state || unloadedState;
    }
};

// Fetch functions

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
        // console.dir(reqTxt);
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

        let selectedStates = searchOptions.selectedStates.filter(x => x !== '');
        let selectedTypes = searchOptions.selectedTypes.filter(x => x !== '');

        if (
            (searchOptions.searchTxt === undefined || searchOptions.searchTxt.toString().trim() === '')
            && (searchOptions.RSSDID === undefined || searchOptions.RSSDID!.toString().trim() === '')
            && (selectedStates.length === 0)
            && (selectedTypes.length === 0)) {
            dispatch({
                type: 'RECEIVE_FEDINSTITUTIONS',
                fedInstitutions: [],
            });

            console.dir(searchOptions.searchTxt);

            return;
        }

        let searchStr = (searchOptions.RSSDID === undefined
            || searchOptions.RSSDID.toString().trim() === '')
            ? `${baseUrl}FederalInstitutions?$filter=IsActive%20eq%20true`
            : `${baseUrl}FederalInstitutions?$filter=RSSDID eq ${searchOptions.RSSDID}
                &$expand=Institutions,FederalEntityType,HoldingCompany`;

        if (searchOptions.RSSDID === undefined ||
            searchOptions.RSSDID.toString().trim() === '') {
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

            if (selectedStates.length) {
                let statesTxt = selectedStates.map(x => `StateCode eq '${x}'`).join(' or ');
                searchStr += ` and (${statesTxt})`;
            }

            if (selectedTypes.length) {
                let fedTypesTxt = selectedTypes.map(x => `FederalEntityTypeCode eq '${x}'`).join(' or ');
                searchStr += ` and (${fedTypesTxt})`;
            }

            if (searchOptions.isStartsWith) {
                let searchHoldingTxt = searchOptions.searchHoldingCompanies
                    && `or startswith(HoldingCompany/FullName, '${nameSearch}')`;

                searchStr += ` and (startswith(FullName, '${nameSearch}') ${searchHoldingTxt})`;
            } else {
                let searchHoldingTxt = searchOptions.searchHoldingCompanies
                    && `or contains(HoldingCompany/FullName, '${nameSearch}')`;

                searchStr += ` and (contains(FullName, '${nameSearch}') ${searchHoldingTxt})`;
            }

            searchStr += `&$top=50&$expand=Institutions,FederalEntityType,HoldingCompany&$orderby=FullName,StateCode`;
        }
        // console.dir(searchStr);

        // debugger;
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

// Action Creators

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

    init: ():
        AppThunkAction<KnownAction> => (dispatch: (action: KnownAction) => void, getState: () => ApplicationState) => {
            fetch(`${baseUrl}States`)
                .then(response => response.json())
                .then(states => dispatch({ type: 'RECEIVE_STATES', states: states.value }));

            fetch(`${baseUrl}InstitutionTypes`)
                .then(response => response.json())
                .then(instTypes => dispatch({ type: 'RECEIVE_INSTITUTIONTYPES', instTypes: instTypes.value }));

            fetch(`${baseUrl}FederalEntityTypes`)
                .then(response => response.json())
                .then(fedTypes => dispatch({
                    type: 'RECEIVE_FEDINSTITUTIONTYPES',
                    fedInstitutionTypes: fedTypes.value
                }));

            dispatch({ type: 'INIT', });
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

    selectAll: () => {
        return ({
            type: 'SELECT_ALL'
        });
    },

    selectNone: () => {
        return ({
            type: 'SELECT_NONE'
        });
    },

    selectDeptDB: (deptDBID: number, instFilter: InstitutionFilter):
        AppThunkAction<KnownAction> => (dispatch, getState) => {
            fetchInstitutions(dispatch, instFilter);

            dispatch({ type: 'SELECT_DEPTDB', deptDBID: deptDBID, institutionFilter: instFilter });
        },

    toggleDepartmentVisibility: () => {
        return {
            type: 'TOGGLE_DEPARTMENT_VISIBILITY',
        };
    },

    updateInstitutionSelection: (indices: string | number[]) => {
        return {
            type: 'UPDATE_INSTITUTION_SELECTION', indices: indices
        };
    },
};