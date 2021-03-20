import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-edit-emp',
  templateUrl: './edit-emp.component.html',
  styleUrls: ['./edit-emp.component.css'],
})
export class EditEmployeesComponent implements OnInit {
  socket = io('http://localhost:4000');

  empForm: FormGroup;
  _id = '';
  empName: string = null;
  empEmail: string = null;
  empPassword: string = null;
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getEmployeesById(this.route.snapshot.params.id);
    this.empForm = this.formBuilder.group({
      empName: [null, Validators.required],
      empEmail: [null, Validators.required],
      empPassword: [null, Validators.required],
    });
  }
  getEmployeesById(id: any) {
    this.api.getEmployeesById(id).subscribe((data: any) => {
      this._id = data._id;
      this.empForm.setValue({
        empName: data.empName,
        empEmail: data.empEmail,
        empPassword: data.empPassword,
      });
    });
  }
  onFormSubmit() {
    this.isLoadingResults = true;
    this.api.updateEmployees(this._id, this.empForm.value).subscribe(
      (res: any) => {
        const id = res._id;
        this.isLoadingResults = false;
        this.socket.emit('updatedata', res);
        this.router.navigate(['/emp-details', this._id]);
      },
      (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );
  }
  empDetails() {
    this.router.navigate(['/emp-details', this._id]);
  }
}
