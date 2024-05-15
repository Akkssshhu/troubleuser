export class SourceOfIncome{
  list =[
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

  constructor(){

  }

  listOfIncome(){
    return  this.list;
  }
} 

   