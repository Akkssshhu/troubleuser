import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScreenJsonService } from '../../services/screen-json.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [UtilsService]
})
export class SearchComponent implements OnInit {
  @Input() dataToChild: any

  searchText: FormControl
  httpOptions: any;
  searchResult: any
  isValid: boolean;
  message: string = "";

  constructor(private httpClient: HttpClient,
    public utilService: UtilsService,
    private router: Router,
    public screenJsonService: ScreenJsonService,
    public dialogRef: MatDialogRef<SearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.searchText = new FormControl('', Validators.required)
  }

  ngAfterContentChecked() {
    console.log("categoryId in search component = ", this.dataToChild)
  }

  searchproblem(searchKey) {
    console.log("searchKey = ", searchKey.value);

    let param = '/search/' + searchKey.value
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
      responseType: 'json',
    };

    if (this.utilService.isNonEmpty(searchKey.value)) {
      this.isValid = false;
      this.httpClient.post(`${environment.API}` + param, this.data, this.httpOptions).subscribe((result: any) => {
        this.searchResult = result.data;
        if (result.statusCode == 404) {
          this.message = 'No data found'
        } else {
          this.message = ""
        }

        console.log("this.searchResult == ", this.searchResult);
      }, error => {
        this.searchResult = []
        console.log("error == ", error);
      })
    } else {
      this.searchResult = []
      this.isValid = true;
    }

  }

  clear() {
    if (this.utilService.isNonEmpty(this.searchText.value)) { } else { this.searchResult = [] }
  }

  navigate(questionId, nextAction, category, treeId) {
    if (this.utilService.isNonEmpty(nextAction)) {
      let breadCrumbArray = []
      sessionStorage.setItem('BREAD_CRUMB', JSON.stringify(breadCrumbArray))
      sessionStorage.setItem('TREE_ID', JSON.stringify(treeId))
      breadCrumbArray = JSON.parse(sessionStorage.getItem('BREAD_CRUMB'))
      this.dialogRef.close()
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
            console.log("abc ", abc)
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
      console.log("breadCrumbArray = ", breadCrumbArray)
      let param = '/troubleshoot/' + questionId
      this.screenJsonService.getData(param).subscribe(result => {
        console.log("result = ", result)
        sessionStorage.setItem('BREAD_CRUMB', JSON.stringify(breadCrumbArray))
        this.router.navigate(['troubleshoot', nextAction]);
      }, error => {
        console.log("failed to get the data")
      })
    } else {
      this.utilService.showSnackBar("There is no troubleshoot guide available for this problem")
    }

  }
}
