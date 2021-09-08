import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, concat, throwError } from "rxjs";
import { catchError, map, mergeMap, scan, switchMap, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class KcService {
  token?: string;

  total = new BehaviorSubject(0);
  processed = new BehaviorSubject(0);

  get headers() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  constructor(private http: HttpClient) { }

  loginUser(login: string, password: string) {
    const params = new HttpParams();
    params.set('login', login);
    params.set('password', password);

    console.log('should do get');

    return this.http.get('someOuthUrl', { params }).pipe(
      map((response: any) => response.token),
      tap(token => this.token = token)
    );
  }

  fetchUsers() {
    return this.http.get('someGetUrl');
  }

  deleteUsers(users: {}[]) {
    this.total.next(users?.length ?? 0);
    return concat(
      users.map(
        (u: any) => this.http.delete(`someUrlContaining${u.id}`)
      )
    ).pipe(
      scan((acc) => {
        const processed = acc++;
        this.processed.next(processed);
        return acc;
      }, 0)
    );
  }

  process(login: string, password: string) {
    return this.loginUser(login, password).pipe(
      switchMap(() => this.fetchUsers()),
      switchMap((users) => this.deleteUsers(users as {}[]))
    ).pipe(
      catchError(err => {
        alert('Error while processing...');
        return throwError(err);
      })
    )
  }


}
