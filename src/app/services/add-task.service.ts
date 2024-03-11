import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddTaskService {

  constructor(private http: HttpClient) { }


  postData(apiUrl: string, formData: any) {

    return this.http.post<any>(apiUrl, formData).subscribe(
      (response: any) => {

        console.log(response);
      },
      (error) => {
        console.log(error);

      }
    );

  }


  sendExample() {
    console.log('help');
  }
}
