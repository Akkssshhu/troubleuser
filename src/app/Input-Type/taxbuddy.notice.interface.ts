export interface TaxNotice {
    taxQueryId: string,
    userId: string,
    sectionId: string,
    panNumber: string,
    assessmentYear: string,
    date: Date,
    lock: boolean,
    scrutinyType: string,
    assesseeType: string,
    reasons: Array<reason>,
    userData: {
        panOfAssessee: string,
        statusOfAssessee: string,
        nameOfAssessee: string,
        address: string,
        section: string,
        assessmentYear: string,
        scrutinyNoticeType: string,
        dateOfRecipt: Date,
        dateOfNotice: Date,
        dateOfreturnFilling: Date,
        ackno: string,
        place: string,
        email: string,
        mobile: string,
        nameOfOfficer: string,
        assessmentOfficerDesignation: string,
        sourceOfIncome: SourceOfIncome,
        bankDetails: BankDetails[],
        HUF: HUF[],
        firm: Firm[],
        company: Company[],
        RHP: any,
        buildingOthrRH:any,
        urbanAgriLand:any,
        plotOfLand:any,
        industrialLandBuilding:any
    }
};

export interface reason {
    id: number,
    reasonId: string,
    implementStatus: string,
    startAction: string,
    knownFlag: string,
    reasonName: string,
    endId: string
}


export interface SourceOfIncome {
    salary: Array<Salary>,
    houseProp: string,
    business: {
        businessDetails: BusinessDetails[],
        booksAuditedDate: Date,
        profitGain: number,
        deductionAny: string,
        netProfitAsPerITR: string,
        hasSpeculativeAndSpecified: string,
        speculativeNetProfit: string,
        broughtForwordLosses: BroughtForwordLosses
    },
    partnership: Partnership[],
    capitalGain: CapitalGain,
    otherIncomeSourceAmt: number;

}

export interface Salary {
    nameOfEmployeer: string,
    designation: string,
    netSal: string
}
export interface BusinessDetails {
    nameOfEntity: string,
    natureOfActivity: string,
    activityInWords: string
}
export interface Partnership {
    nameOfEntity: string,
    pan: string,
    natureOfActivity: string,
    shareOfProfitInPer: string,
    shareOfProfitInAmt: string,
    interstOnCapital: string,
    netRemuneration: string,
    netFirmIncome: string
}

export interface CapitalGain {
    longTerm: CapitalGainDetail[],
    shortTerm: CapitalGainDetail[]
}

export interface CapitalGainDetail {
    typeOfAsset: string,
    grossIncome: string,
    deduction: string,
    netIncome: string
}

export interface BroughtForwordLosses {
    housing: number,
    LTCG: number,
    STCG: number,
    Other: number,
    businessAndProfession: number
};

export interface BankDetails {
    bankName: string,
    accountNo: string,
    bankAddress: string,
    acountType: string
}

export interface HUF {
    name: string,
    pan: string,
    relationwithKarta: string
}
export interface Firm {
    name: string,
    pan: string,
    fshareOfProfit: string
}
export interface Company {
    name: string,
    pan: string,
    cshareOfHolding:string;
}

export interface IResidentialHouseProperty {
    address: "",
    percentageShareInProp: "",
    isGovAcq: "",
    isRecInKind: "",
    dateOfCompansation: "",
    kindInExTransfer: {
        kindConsiDetails: [
            {
                whatIsRecInkind: "",
                date: "",
                valueOfAsset: ""
            }],
        hasReceiveThrBanking: "Y",
        amtThrBanking: "",
        dateReceiptOfCompensation: ""
    },
    computation: {
        transactionDate: "",
        fullValueAsPerItr: "",
        govValuationOfProperty: "",
        fullValConsideration: "",
        expenditure: [
            {
                perticular: "",
                amt: ""
            }
        ],
        netSaleConsideration: "",
        assetAcquiredDate: "",
        assetAcquiredFrom: "",
        isAcqThrInheritance: "Y",
        acquiredAmtAsPerItr: "",
        indexedCOA: "",
        COI: [
            {
                perticulars: "",
                date: "",
                amount: "",
                indexdCOI: ""
            }
        ],
        longTermCG: ""
    },
    deductionClaimedDetails: {
        // right claimed section 54, 54EE, 54EC, 54G, 54B
        rightClaimedSection: [{
            section: string,
            amount: number,
            date: Date,
            deductionAmt: number
        }],
        //wrong claimed sections 
        wrongClaimedSection: [
            {
                sections: string,
                amount: number,
                date: Date,
                deductionAmt: number
            }
        ],
        totalDeduction: "",
        taxableAmt: ""
    }
}