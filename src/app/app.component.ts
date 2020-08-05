import { Component } from '@angular/core';
import {ApiService} from './Services/api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Transaction} from './Models/Transaction.Model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2'
import * as moment from 'moment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  loaded = false;
  editing = false;
  error = false;
  closeResult = '';
  transactions : Transaction[] = [];
  modalRef: BsModalRef;

  transactionForm: FormGroup;

  constructor(
    public api: ApiService,
    private modalService: BsModalService
  ){

  }

  ngOnInit(): void {
    this.getTransactions()
  }

  getTransactions(){

    this.api.getAllTransactions().then((res)=>{
      this.error = false;
      this.loaded = true;
      this.transactions = res.transactions;
    }).catch((err)=>{
      this.loaded = true;
      this.error = true;
    })

  }

  showAddModal(content){

    this.editing = false;

    this.transactionForm = new FormGroup({
      c: new FormControl(new Date(), [Validators.required]),
      type: new FormControl('', [Validators.required]),
      security: new FormControl('', [Validators.required]),
      shares: new FormControl(''),
      value: new FormControl('')
    });

    this.modalRef = this.modalService.show(content, {ariaLabelledBy: 'modal-basic-title'})

  }

  showEditModal(modal, item){

    this.editing = true;

    this.transactionForm = new FormGroup({
      date: new FormControl(new Date(item.date), [Validators.required]),
      type: new FormControl(item.type, [Validators.required]),
      security: new FormControl(item.security, [Validators.required]),
      shares: new FormControl(item.shares),
      value: new FormControl(item.value/100),
      id: new FormControl(item.id)
    });

    this.modalRef = this.modalService.show(modal, {ariaLabelledBy: 'modal-basic-title'})
  }

  deleteTransaction(transaction){

    Swal.fire({
      title: 'Delete Transaction?',
      text:
        'You cannot undo this.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((res1)=>{
      if (res1.value){
        this.api.deleteTransaction(transaction.id).then((res)=>{
          const index = this.transactions.findIndex(x => x.id === transaction.id);
          this.transactions.splice(index);
          Swal.fire({
            title: 'Deleted',
            text:
              'This transaction has been deleted',
            icon: 'success',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
          })
        }).catch((err)=>{
          console.log(err)
        })
      }
    });

  }

  processForm(data){

    // APPLY CASHFLOW FIELD
    if(data.type === 'withdrawal' || data.type === 'buy'){
      data.cashflow = -Math.abs(data.value)
    }else{
      data.cashflow = Math.abs(data.value)
    }

    // NOW SEND TO RELEVANT ENDPOINT
    if(this.editing){
      this.updateTransaction(data)
    }else{
      this.addTransaction(data)
    }

  }

  calculateCashflow(){

    let total = 0;

    for (let transaction of this.transactions){
      total += transaction.value
    }

    return total

  }

  addTransaction(transaction : Transaction){

    transaction.value = transaction.value * 100;

    this.api.createTransaction(transaction).then((res) => {
      this.transactions.push(res)
      this.modalRef.hide();
    }).catch((err)=>{
      console.log(err)
    })

  }

  updateTransaction(transaction){

    console.log(transaction)
    transaction.value = transaction.value * 100;

    this.api.updateTransaction(transaction.id, transaction).then((res) => {

      const index = this.transactions.findIndex(x => x.id === transaction.id);
      this.transactions[index] = res
      this.modalRef.hide();
    }).catch((err)=>{
      console.log(err)
    })

  }

}
