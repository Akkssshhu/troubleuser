import { Component, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { SearchComponent } from './shared/search/search.component';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilsService } from './services/utils.service';
import { environment } from 'src/environments/environment';
import { ScreenJsonService } from './services/screen-json.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UtilsService]
})
export class AppComponent {

  @Input() dataToChild: any
  searchText: FormControl
  httpOptions: any;
  searchResult: any
  isValid: boolean;
  message: string = "";
  data: any;
  myformgroup: FormGroup;
  show = true;

  searchValue: string

  breadCrumbArray: any = []
  URL: any;
  categoryId: any;
  problemPath: string;
  troublePath: string;
  troubleId: string;
  USER_OBJ: any;
  key: any;
  constructor(private router: Router, private _formBuilder: FormBuilder,
    private location: Location,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    public utilService: UtilsService,
    public screenJsonService: ScreenJsonService,
  ) {
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['login'])
  }

  ngOnInit() {
    this.myformgroup = this._formBuilder.group({
      searchText: ['', Validators.required]
    });

    //this.searchText = new FormControl('', Validators.required)

  }
  ngAfterContentChecked() {
    this.breadCrumbArray = JSON.parse(sessionStorage.getItem('BREAD_CRUMB'))
    this.USER_OBJ = JSON.parse(sessionStorage.getItem('USER_OBJ'))
    this.categoryId = JSON.parse(sessionStorage.getItem('ID'))
    this.problemPath = this.router.url.substring(1, 8)
    this.troublePath = this.router.url.substring(1, 13)
    this.troubleId = '/troubleshoot/' + this.router.url.substring(14)
    this.URL = this.location.path()
    this.route.queryParams.subscribe((params) => {
      this.key = params['key']
    });

  }

  backToCategory() {
    this.router.navigate(['category', 0])
  }

  backToPage(type, id, index) {
   if (type === 'category') {
      this.breadCrumbArray = []
      this.router.navigate(['category', 0])
    } else if (type === 'subcategory') {
      this.breadCrumbArray.splice(index + 1, this.breadCrumbArray.length - (index + 1))
      this.router.navigate(['subcategory', id])
    } else if (type === 'problem') {

      this.breadCrumbArray.splice(index + 1, this.breadCrumbArray.length - (index + 1))
      this.router.navigate(['problem', id])
    }
    sessionStorage.setItem('SIDE_DATA', JSON.stringify([]))
    sessionStorage.setItem('BREAD_CRUMB', JSON.stringify(this.breadCrumbArray))
  }

  logoClick() {
    this.breadCrumbArray = []
    this.router.navigate(['category', 0])
    sessionStorage.setItem('BREAD_CRUMB', JSON.stringify(this.breadCrumbArray))
  }

  search() {
    const dialogRef = this.dialog.open(SearchComponent, {
      width: '600px',
      data: this.categoryId,
      // disableClose: true, // to prevent dialog closing on esc key
      panelClass: 'background-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {

    })
  }
  searchproblem(searchKey) {
//let param = '/search/' + searchKey.value
    let param = '/search/' + searchKey
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
      responseType: 'json',
    };

    //if (this.utilService.isNonEmpty(searchKey.value)) {
    if (this.utilService.isNonEmpty(searchKey)) {
      this.isValid = false;
      // this.httpClient.post(`${environment.API}` + param, this.data, this.httpOptions).subscribe((result: any) => {
      this.httpClient.post(`${environment.API}` + param, this.categoryId, this.httpOptions).subscribe((result: any) => {
        this.searchResult = result.data;
        if (result.statusCode == 404) {
          this.message = 'No data found'
        } else {
          this.message = ""
        }
      }, error => {
        this.searchResult = [] })
    } else {
      this.searchResult = []
      this.isValid = true;
    }

  }
  clear() {
    //if (this.utilService.isNonEmpty(this.searchText.value)) { } else { this.searchResult = [] }
    if (this.utilService.isNonEmpty(this.myformgroup.get('searchText').value)) { } else { this.searchResult = [] }
  }
  navigates(questionId, nextAction, category, treeId) {
    if (this.utilService.isNonEmpty(nextAction)) {
      let breadCrumbArray = []
      sessionStorage.setItem('BREAD_CRUMB', JSON.stringify(breadCrumbArray))
      sessionStorage.setItem('TREE_ID', JSON.stringify(treeId))
      breadCrumbArray = JSON.parse(sessionStorage.getItem('BREAD_CRUMB'))
      // this.dialogRef.close()
      let tempArray = [];

      let problem = this.searchResult.problem.filter(item => item.questionId == questionId)
      tempArray.push({
        id: Number(problem[0].questionId),
        category: problem[0].label,
        type: ''
      })

      let abc = ""
      for (let i = 0; i < this.searchResult.tree.length; i++) {
        if (this.searchResult.tree[i].nodeId == category) {
          abc = this.searchResult.tree[i].parentId
          tempArray.push({
            id: this.searchResult.tree[i].nodeId,
            category: this.searchResult.tree[i].friendlyName,
            type: (abc == '0') ? 'subcategory' : 'problem'
          })
        }

        for (let i = 0; i < this.searchResult.tree.length; i++)
          if (abc !== '' && abc == this.searchResult.tree[i].nodeId) {
            abc = this.searchResult.tree[i].parentId
             tempArray.push({
              id: this.searchResult.tree[i].nodeId,
              category: this.searchResult.tree[i].friendlyName,
              type: (abc == '0') ? 'subcategory' : 'problem'
            })
          }
      }

      breadCrumbArray = tempArray.reverse()
      for (let i = 0; i < breadCrumbArray.length; i++) {
        if (category !== breadCrumbArray[i].id && breadCrumbArray[i].type == 'problem') {
          breadCrumbArray.splice(i, 1)
        }
      }
      let param = '/troubleshoot/' + questionId
      this.screenJsonService.getData(param).subscribe(result => {
        sessionStorage.setItem('BREAD_CRUMB', JSON.stringify(breadCrumbArray))
        this.router.navigate(['troubleshoot', nextAction]);
        this.searchText.reset()
      }, error => {
        
      })
    } else {
      this.utilService.showSnackBar("There is no troubleshoot guide available for this problem")
    }
    this.show = !this.show;
  }

  changepassword() {
    let data = {
      title: "Change Password"
    }
    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      width: '500px',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {

    })
  }
}
