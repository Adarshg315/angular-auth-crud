import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-add-emp',
  templateUrl: './add-emp.component.html',
  styleUrls: ['./add-emp.component.css'],
})
export class AddEmployeesComponent implements OnInit {
  socket = io('http://localhost:4000');

  empForm: FormGroup;
  empName = '';
  empEmail: string = null;
  empPassword: string = null;
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  constructor(
    private router: Router,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.empForm = this.formBuilder.group({
      empName: [null, Validators.required],
      empEmail: [null, Validators.required],
      empPassword: [null, Validators.required],
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.api.addEmployees(this.empForm.value).subscribe(
      (res: any) => {
        const id = res._id;
        this.isLoadingResults = false;
        this.socket.emit('updatedata', res);
        this.router.navigate(['/emp-details', id]);
      },
      (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );
  }
}
