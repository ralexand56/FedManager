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