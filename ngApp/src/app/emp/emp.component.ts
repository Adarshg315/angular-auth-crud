import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { ApiService } from '../api.service';
import { Employees } from '../emp';

@Component({
  selector: 'app-emp',
  templateUrl: './emp.component.html',
  styleUrls: ['./emp.component.css'],
})
export class EmployeesComponent implements OnInit {
  socket = io('http://localhost:4000');
  displayedColumns: string[] = ['empName', 'empEmail'];
  data: Employees[] = [];
  isLoadingResults = true;

  constructor(private api: ApiService) {}
  getEmployees() {
    this.api.getEmployees().subscribe(
      (res: any) => {
        this.data = res;

        this.isLoadingResults = false;
      },
      (err) => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );
  }

  ngOnInit(): void {
    this.getEmployees();

    this.socket.on(
      'update-data',
      function (data: any) {
        this.getEmployees();
      }.bind(this)
    );
  }
}
