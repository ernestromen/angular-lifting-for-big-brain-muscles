import { Component, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { AddTaskService } from '../../services/add-task.service';
import { DeleteTaskService } from '../../services/delete-task.service';
import { GetTasksService } from '../../services/get-tasks.service';
import { HttpClientModule } from '@angular/common/http'; // Add this import
import { CommonModule } from '@angular/common'
import { catchError,tap  } from 'rxjs/operators';
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
  public postsIds: number[] = [];
  public errorDisplay: boolean = false;
  public errorDisplayText: string = '';

  constructor(private addTaskService: AddTaskService,
    private deleteTaskService: DeleteTaskService,
    private getTasksService: GetTasksService,
  ) { }


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

    this.addTaskService.postData(this.URL, formData)  .pipe(
      tap(() => {
        this.rowList.push(formData);
        console.log('Data posted successfully');
      }),
      catchError(error => {
        // console.error('An error occurred while posting data:', error);
        throw error; // Throw the error to stop execution
      })
    )
    .subscribe({
      next: () => {
        // This block is not needed if you only want to handle errors
      },
      error: error => {
        // console.log('Error occurred, data not added to rowList.');
        // console.log(error);
        this.errorDisplay = true;
        this.errorDisplayText = error.message;
        // Handle error or show an error message to the user
      }
    });

  }


  fetchRows() {

    this.getTasksService.getAllTasksFromDB(this.URL).pipe(
      catchError(err => of([]))
    ).subscribe(

      (data: any) => {
        this.rowList = data;
        this.lastID = data.length ? Number(data[data.length - 1].id) : 0;
        this.profileForm.patchValue({ id: this.lastID + 1 });

      },
    );
  }

  removeRowFromList(id: number) {

    this.deleteTaskService.deleteRow(id).subscribe(() => {
      this.rowList = this.rowList.filter(e => e.id !== id);
    });

  }

  removeAllrowsFromlist(ids: number[]) {

    this.deleteTaskService.deleteAllRows(ids).subscribe(() => {
      ids.forEach(id => {
        this.rowList = this.rowList.filter(e => e.id !== id);
      })
    });
    this.postsIds = [];
  }

  checkIfItemIsInToBeDeletedList(id: number, event: any) {
    if (!event.target.checked) {
      this.postsIds = this.postsIds.filter((e) => e !== id);
    }

    if (event.target.checked && !this.postsIds.includes(id)) {
      this.postsIds.push(id);
    }
  }

}
