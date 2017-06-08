import { FederalInstitution, InstitutionType } from './data-types';
export interface Department {
    DeptID: number;
    Name: string;
    Color: string;
}

export interface DepartmentDB {
    DeptDBID: number;
    Name: string;
    DeptID: number;
    Connection?: string;
    Server: string;
    DBName: string;
    Abbrev: string;
    IsActive: boolean;
    Pct: number;
    Color: string;
    EntityName: string;
    LastModified?: Date;
    LastModifiedUser?: string;
    Department: Department;
    Institutions: Institution[];
}

export interface DepositInstitution {
    BA_ID: number;
    BA_KEY_ID: number;
}

export interface Institution {
    InstitutionID: number;
    CustomID: string;
    Name: string;
    StateCode: string;
    InstitutionType: InstitutionType;
    InstitutionTypeID: number;
    Region: string;
    RSSDID?: number;
    HCID: number;
    DeptDBID: number;
    FederalInstitution: FederalInstitution;
    IsSelected: boolean;
}

export interface InstitutionType {
    InstitutionTypeID: number;
    Name: string;
}

export interface FederalInstitution {
    RSSDID: number;
    HeadRSSDID: number;
    HCRSSDID?: number;
    Name: string;
    FullName: string;
    FederalEntityTypeCode: string;
    CharterTypeID?: number;
    EstablishmentTypeID: number;
    Street1: string;
    Street2?: string;
    City: string;
    StateCode: string;
    ZipCode: string;
    CountryCode: number;
    CountryName: string;
    Province?: string;
    Url?: string;
    NAICS?: string;
    FDICID?: number;
    TaxID?: number;
    IsHCCode?: boolean;
    IsSLHoldingCompany?: boolean;
    BankCnt?: number;
    StartDate: Date;
    CloseDate: Date;
    TerminationReasonID?: number;
    IsActive: boolean;
    IsBranch: boolean;
    FederalEntityType: FederalEntityType;
    Institutions: Institution[];
    HoldingCompany: FederalInstitution;
}

export interface FederalEntityType {
    FederalEntityTypeCode: string;
    Name: string;
    Description?: string;
}

export interface InstitutionFilter {
    deptDBID: number;
    RSSDID: number | null;
    searchTxt: string;
    isStartsWith: boolean;
    selectedStates: string[] | null;
    selectedTypes: number[] | string | null;
}

export interface FedInstitutionFilter {
    RSSDID: number | undefined;
    searchTxt: string;
    isStartsWith: boolean;
    selectedStates: string[] | null;
    searchBankingTypes: boolean;
    searchHoldingCompanies: boolean;
}

export interface State {
    IsActive: boolean;
    Name: string;
    StateCode: string;
}

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
    showDeptDBs: boolean;
    states: Array<State>;
}

export type KnownAction = RequestDepartmentDBsAction | ReceiveDepartmentDBsAction | SetInstitutionFilter
    | SetFedInstitutionFilter | ReceiveInstitutionsAction | RequestInstitutionsAction
    | RequestFedInstitutionsAction | ReceiveFedInstitutionsAction | LoadInstitutionTypesAction
    | UpdateInstitutionSelection | AssignFederalInstitutionAction | SelectAllAction | SelectNoneAction
    | SelectDeptDBAction | LoadStatesAction | ToggleDepartmentVisiblityAction;

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

interface SelectAllAction {
    type: 'SELECT_ALL';
}

interface SelectNoneAction {
    type: 'SELECT_NONE';
}

interface ToggleDepartmentVisiblityAction {
    type: 'TOGGLE_DEPARTMENT_VISIBILITY';
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

export function MultiSort(...args: Array<any>) {
    // let args = arguments,
    let array = args[0],
        caseSensitive: boolean, keysLength: number, key, desc, a, b, i;

    if (typeof arguments[arguments.length - 1] === 'boolean') {
        caseSensitive = arguments[arguments.length - 1];
        keysLength = arguments.length - 1;
    } else {
        caseSensitive = false;
        keysLength = arguments.length;
    }

    return array.sort(function (obj1: Object, obj2: Object) {
        for (i = 1; i < keysLength; i++) {
            key = args[i];
            if (typeof key !== 'string') {
                desc = key[1];
                key = key[0];
                a = obj1[args[i][0]];
                b = obj2[args[i][0]];
            } else {
                desc = false;
                a = obj1[args[i]];
                b = obj2[args[i]];
            }

            if (caseSensitive === false && typeof a === 'string') {
                a = a.toLowerCase();
                b = b.toLowerCase();
            }

            if (!desc) {
                if (a < b) { return -1; };
                if (a > b) { return 1; };
            } else {
                if (a > b) { return -1; };
                if (a < b) { return 1; };
            }
        }
        return 0;
    });
};