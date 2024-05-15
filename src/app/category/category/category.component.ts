import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../services/utils.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [UtilsService]
})
export class CategoryComponent implements OnInit {
  busy: boolean;
  categorylist: any;
  httpOptions: any;
  parentNode: any;
  categoryId: any;
  breadCrumbArray = [];

  constructor(public httpClient: HttpClient,
    private router: Router,
    public utilsService: UtilsService,
    private utilService: UtilsService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(param => {
      this.categoryId = param.id
      console.log("this.routeData ", this.categoryId)
    })

    this.getcategorylist()
  }

  getcategorylist() {
    this.utilsService.openLoaderDialog();
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
      responseType: 'json',
    };

    let param = '/node'
    this.httpClient.get(`${environment.API}` + param, this.httpOptions).subscribe(result => {
      console.log("result == ", result);
      this.parentNode = result['data'].filter(item => item.typeNode.toString().toUpperCase() === 'CONTAINER' && item.status == "ENABLED");

      let categoryIdArray = []
      this.parentNode.forEach(element => {
        categoryIdArray.push({ categoryId: element.nodeId })
      });
      console.log("categoryIdArray = ", categoryIdArray)
      sessionStorage.setItem('ID', JSON.stringify(categoryIdArray))
      this.utilsService.dialogRef.close()
    }, error => {
      this.utilsService.dialogRef.close()
    })
  }

  goToSubCategoty(nodeId, name) {
    this.utilsService.openLoaderDialog();
    /* this.breadCrumbArray[0].category = name
    this.breadCrumbArray[0].id = nodeId */
    this.breadCrumbArray.push({
      id: nodeId,
      category: name,
      type: 'subcategory'
    })
    sessionStorage.setItem('BREAD_CRUMB', JSON.stringify(this.breadCrumbArray))
    this.router.navigate(['subcategory', nodeId]);
    this.utilsService.dialogRef.close()
  }

}
