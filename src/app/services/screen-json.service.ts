import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScreenJsonService {

  userId = ''
  taxqueryId = ''
  httpOptions: any;

  constructor(private http: HttpClient) { };

  getData(...param) {
    let USER_OBJ = JSON.parse(sessionStorage.getItem("USER_OBJ"));
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + USER_OBJ.id_token
    });
    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    // headers.append('Authorization', 'Bearer ' + USER_OBJ.id_token);
    return this.http.get(environment.API + param,
      { headers: headers }).pipe(map(response => {
        return response;
      }))
  };

  // for login
  loginMethod(...param) {
    let USER_OBJ = JSON.parse(sessionStorage.getItem("USER_OBJ"));
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.http.post(environment.API + param[0], param[1], { headers: headers })
      .pipe(map(response => response))
  }

  postMethod(...param) {
    let USER_OBJ = JSON.parse(sessionStorage.getItem("USER_OBJ"));
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + USER_OBJ.id_token);

    return this.http.post(environment.API + param[0], param[1], { headers: headers })
      .pipe(map(response => response))
  }


  contentData(id) {
    console.log("Get content service call.............................. ")
    return this.http.get(`${environment.API}/api/tax-query-content?contentId=${id}`)
      .pipe(map((response: any) => response.json()));
  };


  getCalculatedValue(api) {
    let USER_OBJ = JSON.parse(sessionStorage.getItem("USER_OBJ"));
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + USER_OBJ.id_token);

    return this.http.post(environment.API + api, { headers: headers }).pipe(map((response: any) => response.json()))
  };

  handleHTTPError(error: Response) {
    let errorMessage: string;
    switch (error.status) {
      case 500: {
        errorMessage = 'Internal server Error';
        break;
      }
      case 503: {
        errorMessage = 'Internal server Error';
        break;
      }
      case 400: {
        errorMessage = 'Insufficient data. Please Fill Complete details';
        break;
      }
      case 401: {
        errorMessage = 'Please login again';
        break;
      }
      case 403: {
        errorMessage = 'Internal server Error';
        break;
      }
      case 404: {
        errorMessage = 'Not found';
        break;
      }
      case 0: {
        errorMessage = 'Please chech your internet connection';
        break;
      }
      default: {
        errorMessage = 'Oops,Something went wrong';
        break;
      }
    }
    return Observable.throw(errorMessage);
  };

}
