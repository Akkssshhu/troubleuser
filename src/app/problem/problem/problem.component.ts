import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreenJsonService } from '../../../app/services/screen-json.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
  providers: [UtilsService]
})
export class ProblemComponent implements OnInit {
  httpOptions: any;
  categoryId: any;
  allProblems = [];
  breadCrumbArray = [];
  showMessage: string = "";

  constructor(public screenJsonService: ScreenJsonService,
    private route: ActivatedRoute,
    public utilService: UtilsService,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.categoryId = param.id
      console.log("this.routeData ", this.categoryId)
      // sessionStorage.setItem('ID', JSON.stringify(this.categoryId))
      sessionStorage.setItem('ID', JSON.stringify([{ categoryId: this.categoryId }]))
      this.getAllChild(this.categoryId)
    })
    this.breadCrumbArray = JSON.parse(sessionStorage.getItem('BREAD_CRUMB'))
  }

  getAllChild(id) {
    this.utilService.openLoaderDialog();
    let param = "/troubleshoot?categoryId=" + id
    this.screenJsonService.getData(param).subscribe((result: any) => {
      console.log("result = ", result)
      this.utilService.dialogRef.close()
      this.allProblems = result.filter(item => item.type === 'PROBLEM')
    }, error => [
      this.utilService.dialogRef.close()
    ])
  }

  startTroubleshoot(nextAction, problemLabel, problemId, treeId) {
    sessionStorage.setItem('TREE_ID', JSON.stringify(treeId))
    this.utilService.openLoaderDialog();
    if (nextAction !== "" && nextAction !== null && nextAction !== undefined) {
      this.breadCrumbArray.push({
        id: Number(problemId),
        category: problemLabel,
        type: ''
      })

      let param = '/troubleshoot/' + problemId
      this.screenJsonService.getData(param).subscribe(result => {
        console.log("result = ", result)
        sessionStorage.setItem('BREAD_CRUMB', JSON.stringify(this.breadCrumbArray))
        this.router.navigate(['troubleshoot', nextAction]);
        this.utilService.dialogRef.close()
      }, error => {
        console.log("failed to get the data")
      })
    } else {
      this.utilService.showSnackBar("There is no troubleshoot guide available for this problem")
      this.utilService.dialogRef.close()
    }

  }
}
