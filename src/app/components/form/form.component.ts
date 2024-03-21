import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { AddTaskService } from '../../services/add-task.service';
import { DeleteTaskService } from '../../services/delete-task.service';
import { GetTasksService } from '../../services/get-tasks.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  providers: [AddTaskService, DeleteTaskService, GetTasksService],

})

export class FormComponent implements OnInit {

  public rowList: any[] = [];
  public lastID: number = 0;
  public postsToBeDeleted: any[] = [];
  public postsIds: number[] = [];
  public errorDisplay: boolean = false;
  public errorDisplayText: string = '';
  public showTable = false;

  constructor(private addTaskService: AddTaskService,
    private deleteTaskService: DeleteTaskService,
    private getTasksService: GetTasksService,
  ) { }


  ngOnInit() {
    this.fetchRows();
    this.showTable = this.rowList.length === 0 ? false : true;
  }

  private URL: string = 'http://localhost:3000/tasks/';


  profileForm = new FormGroup({
    id: new FormControl(this.lastID + 1),
    title: new FormControl(''),
    views: new FormControl(''),
  });



  onSubmit(): void {

    let formData = this.profileForm.value;

    this.addTaskService.postData(this.URL, formData).pipe(
      tap(() => {
        this.rowList.push(formData);
        this.lastID = this.rowList.length ? Number(this.rowList[this.rowList.length - 1].id) : 0;
        this.profileForm.patchValue({ id: this.lastID + 1 });
        this.showTable = this.rowList.length === 0 ? false : true;
      }),
      catchError(error => {
        throw error;
      })
    )
      .subscribe({
        next: () => { },
        error: error => {
          this.showTheErrorOnApiFaliure(error);
        }
      });

  }


  fetchRows() {
    this.getTasksService.getAllTasksFromDB(this.URL).pipe(
      tap((data) => {
        this.lastID = data.length ? Number(data[data.length - 1].id) : 0;
        this.profileForm.patchValue({ id: this.lastID + 1 });
        this.rowList = data;
      }),
      catchError(error => {
        throw error;
      })
    )
      .subscribe({
        next: () => { },
        error: error => {
          this.showTheErrorOnApiFaliure(error);
        }
      });
  }

  removeRowFromList(id: number) {

    this.deleteTaskService.deleteRow(id).pipe(
      tap(() => {
        this.rowList = this.rowList.filter(e => e.id !== id);
        this.showTable = this.rowList.length === 0 ? false : true;
      }),
      catchError(error => {
        throw error;
      })
    )
      .subscribe({
        next: () => { },
        error: error => {
          this.showTheErrorOnApiFaliure(error);

        }
      });
  }

  removeAllrowsFromlist(ids: number[]) {

    this.deleteTaskService.deleteAllRows(ids).pipe(
      tap((data) => {
        ids.forEach(id => {
          this.rowList = this.rowList.filter(e => e.id !== id);
        })
        this.showTable = this.rowList.length === 0 ? false : true;
      }),
      catchError(error => {
        throw error;
      })
    )
      .subscribe({
        next: () => { },
        error: error => {
          this.showTheErrorOnApiFaliure(error);
        }
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

  showTheErrorOnApiFaliure(err: Error) {
    this.errorDisplay = true;
    this.errorDisplayText = err.message;
    setTimeout(() => {
      this.errorDisplay = false;
      this.errorDisplayText = '';

    }, 2000);
  }

}
