import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Employees } from '../emp';

@Component({
  selector: 'app-emp-details',
  templateUrl: './emp-details.component.html',
  styleUrls: ['./emp-details.component.css'],
})
export class EmployeesDetailsComponent implements OnInit {
  socket = io('http://localhost:4000');

  emp: Employees = {
    _id: '',
    empName: '',
    empEmail: null,
    empPassword: null,
    updated: null,
  };
  isLoadingResults = true;
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  getEmployeesDetails(id: string) {
    this.api.getEmployeesById(id).subscribe((data: any) => {
      this.emp = data;
      console.log(this.emp);
      this.isLoadingResults = false;
    });
  }
  ngOnInit(): void {
    this.getEmployeesDetails(this.route.snapshot.params.id);

    this.socket.on(
      'update-data',
      function (data: any) {
        this.getEmployeesDetails();
      }.bind(this)
    );
  }
  deleteEmployees(id: any) {
    this.isLoadingResults = true;
    this.api.deleteEmployees(id).subscribe(
      (res) => {
        this.isLoadingResults = false;
        this.router.navigate(['/']);
        this.socket.emit('updatedata', res);
      },
      (err) => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );
  }
}
