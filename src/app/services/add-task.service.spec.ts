import { TestBed } from '@angular/core/testing';

import { AddTaskService } from './add-task.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


describe('AddTaskService', () => {
  let service: AddTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
