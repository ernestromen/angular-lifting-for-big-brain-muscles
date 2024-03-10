import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AddTaskService } from '../../services/add-task.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // Add this import
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule,CommonModule ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  providers: [AddTaskService],

})
export class FormComponent {

  rowList: any[] = [];


  headers = new HttpHeaders({
    'X-XSRF-TOKEN': 'your-csrf-token-value-another-one' // Replace with your actual CSRF token
  });


  constructor(private AddTaskService: AddTaskService, private http: HttpClient) { }


  ngOnInit() {
    this.fetchRows();
  }

  private URL: string = 'http://localhost:3000/tasks/';


  profileForm = new FormGroup({
    title: new FormControl(''),
    views: new FormControl(''),
  });



  onSubmit(): void {
    const headers = new HttpHeaders({

      'X-XSRF-TOKEN': 'your-csrf-token-value-for-real-time-time-time-time' // Replace with your actual CSRF token
    });

    // Process checkout data here
    console.log(this.profileForm.value, 'here');

    const formData = this.profileForm.value;

    // this.AddTaskService.sendExample();

    this.AddTaskService.postData(this.URL, formData, { headers: headers });

  }


  fetchRows() {

    this.http.get<any[]>(this.URL, { headers: this.headers }).subscribe(
      (data) => {

        console.log(data, 'data2');
        console.log(this.rowList, 'data2');
        this.rowList = data;
        console.log(this.rowList, 'after');

      },
      (error) => {
        console.log(error, 'error');
      }
    );
  }
}
