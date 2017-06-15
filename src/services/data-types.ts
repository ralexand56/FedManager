export interface DepartmentDBState {
    activeDeptDB?: DepartmentDB;
    activeInstitutions: Institution[];
    departmentDBs: DepartmentDB[];
    deptDBsLoading: boolean;
    fedInstitutions: FederalInstitution[];
    fedInstitutionFilter: FedInstitutionFilter;
    fedInstitutionTypes: FederalEntityType[];
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

export type KnownAction =
    AssignFederalInstitutionAction |
    InitAction |
    ReceiveInstitutionTypesAction |
    ReceiveDepartmentDBsAction |
    ReceiveFedInstitutionsAction |
    ReceiveFedInstitutionTypesAction |
    ReceiveInstitutionsAction |
    ReceiveStatesAction |
    RequestDepartmentDBsAction |
    RequestFedInstitutionsAction |
    RequestInstitutionsAction |
    SetInstitutionFilter |
    SetFedInstitutionFilter |
    SelectAllAction |
    SelectDeptDBAction |
    SelectNoneAction |
    ToggleDepartmentVisiblityAction |
    UpdateInstitutionSelection;

export interface AssignFederalInstitutionAction {
    type: 'ASSIGN_FEDINSTITUTION';
}

export interface InitAction {
    type: 'INIT';
}

export interface RequestDepartmentDBsAction {
    type: 'REQUEST_DEPARTMENTDBS';
    searchTxt: string;
    institutionFilter: InstitutionFilter;
};

export interface ReceiveDepartmentDBsAction {
    type: 'RECEIVE_DEPARTMENTDBS';
    searchTxt: string;
    departmentDBs: Array<DepartmentDB>;
};

export interface SetInstitutionFilter {
    type: 'SET_INSTITUTION_FILTER';
    institutionFilter: InstitutionFilter;
}

export interface SetFedInstitutionFilter {
    type: 'SET_FEDINSTITUTION_FILTER';
    fedInstitutionFilter: FedInstitutionFilter;
}

export interface SelectAllAction {
    type: 'SELECT_ALL';
}

export interface SelectNoneAction {
    type: 'SELECT_NONE';
}

export interface ToggleDepartmentVisiblityAction {
    type: 'TOGGLE_DEPARTMENT_VISIBILITY';
}

export interface ReceiveStatesAction {
    type: 'RECEIVE_STATES';
    states: Array<State>;
}

export interface ReceiveInstitutionTypesAction {
    type: 'RECEIVE_INSTITUTIONTYPES';
    instTypes: InstitutionType[];
}

export interface RequestFedInstitutionsAction {
    type: 'REQUEST_FEDINSTITUTIONS';
};

export interface ReceiveFedInstitutionsAction {
    type: 'RECEIVE_FEDINSTITUTIONS';
    fedInstitutions: FederalInstitution[];
};

export interface ReceiveFedInstitutionTypesAction {
    type: 'RECEIVE_FEDINSTITUTIONTYPES';
    fedInstitutionTypes: FederalEntityType[];
}

export interface RequestInstitutionsAction {
    type: 'REQUEST_INSTITUTIONS';
};

export interface ReceiveInstitutionsAction {
    type: 'RECEIVE_INSTITUTIONS';
    activeInstitutions: Array<Institution>;
    cnt: number;
};

export interface SelectDeptDBAction {
    type: 'SELECT_DEPTDB';
    deptDBID: number;
    institutionFilter: InstitutionFilter;
};

export interface UpdateInstitutionSelection {
    type: 'UPDATE_INSTITUTION_SELECTION';
    indices: string | Array<number>;
}

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
    selectedStates: string[];
    selectedTypes: string[];
    searchBankingTypes: boolean;
    searchHoldingCompanies: boolean;
}

export interface State {
    IsActive: boolean;
    Name: string;
    StateCode: string;
}