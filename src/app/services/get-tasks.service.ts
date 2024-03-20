import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RowList } from '../row-list';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetTasksService {

  constructor(private http: HttpClient) { }

  getAllTasksFromDB(URL: string) :  Observable<RowList[]>  {

    return this.http.get<any>(URL);

  }
}