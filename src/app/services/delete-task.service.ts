import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,forkJoin  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteTaskService {

  constructor(private http: HttpClient) { }

  deleteRow(id: number) {

    return this.http.delete<any[]>(`http://localhost:3000/tasks/${id}`);

  }

  deleteAllRows(ids: number[]) : Observable<any[]> {
    console.log(ids,'this is the ids array');
    // return ids.forEach(id=>{
    //  this.deleteRow(id);
    // });
    // return this.http.delete<any[]>(`http://localhost:3000/tasks/${id}`);
    const deleteRequests = ids.map(id => this.deleteRow(id));
    return forkJoin(deleteRequests);

  }
}