import { Component, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { AddTaskService } from '../../services/add-task.service';
import { DeleteTaskService } from '../../services/delete-task.service';
import { GetTasksService } from '../../services/get-tasks.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // Add this import
import { CommonModule } from '@angular/common'
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  providers: [AddTaskService, DeleteTaskService, GetTasksService],

})

export class FormComponent {

  rowList: any[] = [];
  lastID: number = 0;
  postsToBeDeleted: any[] = [];
  // public isChecked = false;
  public postsIds: number[] = [];


  constructor(private addTaskService: AddTaskService,
    private deleteTaskService: DeleteTaskService,
    private getTasksService: GetTasksService,
    private renderer: Renderer2,
    private el: ElementRef,
    private http: HttpClient) { }


  ngOnInit() {
    this.fetchRows();
  }

  private URL: string = 'http://localhost:3000/tasks/';


  profileForm = new FormGroup({
    id: new FormControl(this.lastID + 1),
    title: new FormControl(''),
    views: new FormControl(''),
  });



  onSubmit(): void {

    // Process checkout data here
    let formData = this.profileForm.value;

    this.addTaskService.postData(this.URL, formData).subscribe(() => {
      this.rowList.push(formData);
    });

  }


  fetchRows() {

    this.getTasksService.getAllTasksFromDB(this.URL).pipe(
      catchError(err => of([]))
    ).subscribe(

      (data: any) => {
        this.rowList = data;
        this.lastID = Number(data[data.length - 1].id);
        this.profileForm.patchValue({ id: this.lastID + 1 });

      },
    );
  }

  removeRowFromList(id: number) {

    this.deleteTaskService.deleteRow(id).subscribe(() => {
      this.rowList = this.rowList.filter(e => e.id !== id);
    });

  }

  removeAllrowsFromlist(ids : number[]){
    this.deleteTaskService.deleteAllRows(ids).subscribe(() => {
      console.log('success');
    });
  }

  checkIfItemIsInToBeDeletedList(id: number, event: any) {
    // this.isChecked = !this.isChecked;
    console.log(id, 'this is the id i neeed to delete');
    console.log(event.target);
    console.log(event.target.checked);

    if(!event.target.checked){
      this.postsIds = this.postsIds.filter((e)=> e !== id);
      console.log(this.postsIds,'unchecked');
    } 

    if (event.target.checked && !this.postsIds.includes(id)) {
      this.postsIds.push(id);
      console.log(this.postsIds, 'posts');
    }
  }

}
