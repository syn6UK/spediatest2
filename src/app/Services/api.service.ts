import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environment'
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpOptions: any;


  constructor(
    public router: Router,
    public http: HttpClient,
  ) {

  }

  getAllTransactions(): any {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          'https://' + environment.apiURL + 'transactions',
        )
        .subscribe(
          res => {
            resolve(res)
          },
          err => {
            reject(err)
          },
        )
    })
  }

  createTransaction(data): any {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          'https://' + environment.apiURL + 'transactions',
          data
        )
        .subscribe(
          res => {
            resolve(res)
          },
          err => {
            reject(err)
          },
        )
    })
  }

  updateTransaction(id, data): any {
    return new Promise((resolve, reject) => {
      this.http
        .put(
          'https://' + environment.apiURL + 'transactions/' + id,
          data
        )
        .subscribe(
          res => {
            resolve(res)
          },
          err => {
            reject(err)
          },
        )
    })
  }

  deleteTransaction(id): any {
    return new Promise((resolve, reject) => {
      this.http
        .delete(
          'https://' + environment.apiURL + 'transactions/' + id
        )
        .subscribe(
          res => {
            resolve(res)
          },
          err => {
            reject(err)
          },
        )
    })
  }


}
