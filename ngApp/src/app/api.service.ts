import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Employees } from './emp';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const apiUrl = 'http://localhost:3000/api/';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
  getEmployees(): Observable<Employees[]> {
    return this.http.get<Employees[]>(`${apiUrl}`).pipe(
      tap((emp) => console.log('fetched emp')),
      catchError(this.handleError('getEmployees', []))
    );
  }

  getEmployeesById(id: string): Observable<Employees> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Employees>(url).pipe(
      tap((_) => console.log(`fetched emp id=${id}`)),
      catchError(this.handleError<Employees>(`getEmployeesById id=${id}`))
    );
  }

  addEmployees(emp: Employees): Observable<Employees> {
    return this.http.post<Employees>(apiUrl, emp, httpOptions).pipe(
      tap((s: Employees) => console.log(`added emp w/ id=${s._id}`)),
      catchError(this.handleError<Employees>('addEmployees'))
    );
  }

  updateEmployees(id: string, emp: Employees): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, emp, httpOptions).pipe(
      tap((_) => console.log(`updated emp id=${id}`)),
      catchError(this.handleError<any>('updateEmployees'))
    );
  }

  deleteEmployees(id: string): Observable<Employees> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Employees>(url, httpOptions).pipe(
      tap((_) => console.log(`deleted emp id=${id}`)),
      catchError(this.handleError<Employees>('deleteEmployees'))
    );
  }
}
