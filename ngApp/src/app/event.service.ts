import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private _employeeUrl = 'http://localhost:3000/api/emp';

  constructor(private http: HttpClient) {}

  getEmployees() {
    return this.http.get<any>(this._employeeUrl);
  }
}
