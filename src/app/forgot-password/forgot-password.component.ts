import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScreenJsonService } from '../services/screen-json.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UtilsService } from '../services/utils.service';
declare let $: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [ScreenJsonService, UtilsService]
})
export class ForgotPasswordComponent {

  public emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  PasswordForm: FormGroup
  httpOptions: any;
  message: string = ""
  USER_OBJ: any;
  constructor(private fb: FormBuilder,
    private httpClient: HttpClient,
    private utilService: UtilsService,
    public screenJsonService: ScreenJsonService,
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.USER_OBJ = JSON.parse(sessionStorage.getItem('USER_OBJ'))
    this.PasswordForm = this.fb.group({
      email: ["", Validators.pattern(this.emailRegex)],
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
  }

  savePassword() {
    if (this.data.title == 'Change Password') {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.USER_OBJ.id_token}`
        }),
        responseType: 'json',
      };
      let param = "/changePassword"

      if (this.utilService.isNonEmpty(this.PasswordForm.controls['oldPassword'].value) &&
        this.utilService.isNonEmpty(this.PasswordForm.controls['newPassword'].value) &&
        this.utilService.isNonEmpty(this.PasswordForm.controls['confirmPassword'].value) &&
        (this.PasswordForm.controls['confirmPassword'].value == this.PasswordForm.controls['newPassword'].value))
        this.httpClient.post(`${environment.API}` + param, this.PasswordForm.value, this.httpOptions).subscribe((result: any) => {
          console.log("result == ", result);
          this.message = result.message;
          document.getElementById('colorText').style.color = 'green'
          setTimeout(() => {
            this.message = ""
            this.dialogRef.close();
          }, 3000)
        }, error => {
          console.log("error == ", error);
          this.message = error.error.message
          document.getElementById('colorText').style.color = 'red'
          setTimeout(() => {
            this.message = "";
            // this.dialogRef.close();
          }, 3000)
        })
    } else if (this.data.title == 'Forgot Password') {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }),
        responseType: 'json',
      };
      let param = "/resetPassword"

      if (this.utilService.isNonEmpty(this.PasswordForm.controls['email'].value) && this.PasswordForm.controls['email'].valid) {
        this.httpClient.post(`${environment.API}` + param, { email: this.PasswordForm.controls['email'].value }, this.httpOptions).subscribe((result: any) => {
          console.log("result == ", result);
          this.message = result.message;
          document.getElementById('colorText').style.color = 'green'
          setTimeout(() => {
            this.message = ""
            this.dialogRef.close();
          }, 3000)
        }, error => {
          console.log("error == ", error);
          this.message = error.error.message
          document.getElementById('colorText').style.color = 'red'
          setTimeout(() => {
            this.message = ""
          }, 3000)
        })
      } else {
        this.message = "Please fill valid data";
        document.getElementById('colorText').style.color = 'red'
        setTimeout(() => {
          this.message = ""
        }, 3000)
      }
    }

  }
}
