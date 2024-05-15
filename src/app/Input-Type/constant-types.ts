export const enum ASSESSEE_TYPE { 
    Individual="INDIVIDUAL",
    Company="COMPANY",
    HUF="HUF",
    Firm="FIRM",
    Hindu_Undivided_Family="HUF (Hindu Undivided Family)"
};

export const enum SCRUTINY_TYPE{
    complete = "Complete Scrutiny",
    limited = "Limited Scrutiny",
    Compulsory ="Compulsory Manual Scrutiny"
};

export const ACTIVITIES = [
    {activity:"Trading", id:1},
    {activity:"Manufacturing", id:2},
    {activity:"contractor", id:3},
    {activity:"Beauty parlour", id:4},
    {activity:"service providers", id:5},
    {activity:"Software services", id:6},
    {activity:"Share brokers,sub brokers,etc.", id:7},
    {activity:"Agency business", id:8},
    {activity:"Commission agent", id:9},
    {activity:"Consultancy services", id:10},
    {activity:"Legal professionals", id:11},
    {activity:"Architectural/Engineering", id:12},
    {activity:"Medical professional", id:13},
    {activity:"Fashion designer", id:14},
    {activity:"Film artiest", id:15},
    {activity:"Interior designer", id:16},
    {activity:"Accounting", id:17},
    {activity:"Professional - others", id:18},
    {activity:"Transporters - others", id:19}
];


export const ASSETS =[
    {
      "title": "Residential House/Flat /Bunglow",
      "value": "RHP",
      "disabled": false,
    },
    {
      "title": "Building other than residential",
      "value": "BOR",
      "disabled": false,
    },
    {
      "title": "Urban Agriculture Land",
      "value": "UAL",
      "disabled": false,
    },
    {
      "title": "Plot of land",
      "value": "POL",
      "disabled": false,
    },
    {
      "title": "Industrial land/building/land & building",
      "value": "ILB",
      "disabled": false,
    },
    {
      "title": "Shares & Securities",
      "value": "SAS",
      "disabled": false,
    },
    {
      "title": "Jewellery",
      "value": "JWE",
      "disabled": false,
    },
    {
      "title": "Others",
      "value": "OTH",
      "disabled": false,
    }
  ];