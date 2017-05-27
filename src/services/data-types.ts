import { FederalInstitution } from './data-types';
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
    Color: string;
    EntityName: string;
    LastModified?: Date;
    LastModifiedUser?: string;
    Department: Department;
}

export interface Institution {
    InstitutionID: number;
    CustomID: string;
    Name: string;
    StateCode: string;
    InstitutionTypeID: number;
    RSSDID?: number;
    HCID: number;
    DeptDBID: number;
    FederalInstitution: FederalInstitution;
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
}

export interface FederalEntityType {
    FederalEntityTypeCode: string;
    Name: string;
    Description?: string;
}

export interface InstitutionFilter {
    deptDBID: number;
    searchTxt: string;
    isStartsWith: boolean;
    selectedStates: Array<string>;
}

export interface State {
    IsActive: boolean;
    Name: string;
    StateCode: string;
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