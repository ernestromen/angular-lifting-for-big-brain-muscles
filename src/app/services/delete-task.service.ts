import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeleteTaskService {

  constructor(private http: HttpClient) { }

  deleteRow(id: number) {

    return this.http.delete<any[]>(`http://localhost:3000/tasks/${id}`);

  }

  deleteAllRows(ids: number[]){
    // console.log(ids,'this is the ids array');
    ids.forEach(id=>{
    return this.deleteRow(id);
    });
    // return this.http.delete<any[]>(`http://localhost:3000/tasks/${id}`);

  }
}