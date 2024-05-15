import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss'],
  providers: [UtilsService]
})
export class SubCategoryComponent implements OnInit {

  busy: boolean;
  categorylist: any;
  httpOptions: any;
  childNode: any;
  categoryId: any;
  breadCrumbArray = [];

  constructor(public httpClient: HttpClient,
    private router: Router,
    public utilsService: UtilsService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.categoryId = param.id
      console.log("this.routeData ", this.categoryId)
      this.getcategorylist(this.categoryId, '')
    })

    this.breadCrumbArray = JSON.parse(sessionStorage.getItem('BREAD_CRUMB'))
  }

  getcategorylist(id, name) {
    this.breadCrumbArray = JSON.parse(sessionStorage.getItem('BREAD_CRUMB'))
    if (name !== "") {
      this.breadCrumbArray.push({
        id: Number(id),
        category: name,
        type: 'problem'
      })
      sessionStorage.setItem('BREAD_CRUMB', JSON.stringify(this.breadCrumbArray))
    }

    this.utilsService.openLoaderDialog();
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
      responseType: 'json',
    };
    let param = '/node/' + id
    this.httpClient.get(`${environment.API}` + param, this.httpOptions).subscribe((result: any) => {
      console.log("sub categories == ", result);
      this.childNode = result['data'].child;
      let categoryIdArray = []
      this.childNode.forEach(element => {
        categoryIdArray.push({ categoryId: element.nodeId })
      });
      console.log("categoryIdArray = ", categoryIdArray)
      sessionStorage.setItem('ID', JSON.stringify(categoryIdArray))
      this.utilsService.dialogRef.close()
    }, error => {
      this.utilsService.dialogRef.close()
    })
  }

  viewProblem(nodeId, name) {
    this.utilsService.openLoaderDialog();
    this.breadCrumbArray.push({
      id: nodeId,
      category: name,
      type: 'problem'
    })
    sessionStorage.setItem('BREAD_CRUMB', JSON.stringify(this.breadCrumbArray))
    this.router.navigate(['problem', nodeId]);
    this.utilsService.dialogRef.close()
  }
}
