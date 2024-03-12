import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetTasksService {

  constructor(private http: HttpClient) { }

  getAllTasksFromDB(URL: string) {

    return this.http.get<any>(URL);

  }
}