export interface ScrutinyData {
    assesseeType:string | null
    assessmentYear:string | null
    date:string | null
    id?:string 
    lock:string | null
    panNumber:string | null
    scrutinyType:string | null
    sectionId:string | null 
    taxQueryId:string | null
    userId:string | null    
    scrutinyReasonsStatus: [{
        id: string | null,
        reasonId: string | null,
        implementStatus: string | null,
        startAction: string | null,
        knownFlag: string | null,
        reasonText: string | null,
        endId: string | null
    }],

    userData:Array<userData>
}


interface userData{
    key: string | null,
    parentId: string | null,
    action: string | null,
    allDataObj: [{
        key: string | null,
        value: string | null,
        tableValue?: Array<any> | null,
        constTableValue?: Array<any> | null,
        multiValue?: Array<any> | null
    }]
}