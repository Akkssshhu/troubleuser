import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [UtilsService]
})
export class ResetPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup
  show: boolean = false;
  hide: boolean = true;
  hides: boolean = true;
  httpOptions: any;
  busy: boolean;
  constructor(private fb: FormBuilder,
    public utilsService: UtilsService,
    public router: Router,
    public httpClient: HttpClient,
    private route: ActivatedRoute) { }

  ngOnInit() {
    let key
    this.route.queryParams.subscribe((params) => {
      key = params['key'];
      console.log("key = ", key);
    });

    this.forgotPasswordForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      key: [this.utilsService.isNonEmpty(key) ? key : '']
    })
  }

  // http://192.168.168.80:8080/userflow/#/forgotPassword?key=85552780105463305923

  forgotpasswordMethod() {
    console.log("this.forgotPasswordForm = ", this.forgotPasswordForm.value)
    if (this.forgotPasswordForm.valid &&
      this.forgotPasswordForm.controls['confirmPassword'].value === this.forgotPasswordForm.controls['newPassword'].value) {
      this.busy = true;
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }),
        responseType: 'json',
      };
      let param = "/resetPassword/finish"

      this.httpClient.post(`${environment.API}` + param, this.forgotPasswordForm.value, this.httpOptions).subscribe((result: any) => {
        console.log("result == ", result);
        this.utilsService.showSnackBar(result.message)
        setTimeout(() => {
          this.busy = false;
          this.router.navigate(['login'])
        },2500)
      }, error => {
        this.busy = false;
        console.log("error=", error)
        this.utilsService.showSnackBar(error.message)
      })
    }
  }
}
