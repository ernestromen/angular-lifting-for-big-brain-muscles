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
}