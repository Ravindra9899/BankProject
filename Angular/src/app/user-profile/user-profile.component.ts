import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
import { FormControl} from '@angular/forms';
import { MatDialog } from '@angular/material';
import {TransactionsComponent} from 'src/app/transactions/transactions.component'
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails;
  balance:any=0.0;
  depositVar =new FormControl();
  withdrawVar =new FormControl();
  constructor(
   private userService: UserService,
   private router: Router,
   public dialog: MatDialog,
   ) { }

  ngOnInit() {
    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res['user'];
        this.checkBalance(this.userDetails);
      },
      err => {
        console.log(err);
      }
    );
    
  }

  onLogout() {
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

  Transactions(userObj) {
    this.dialog.open(TransactionsComponent, {
        height:'600px',
        width:'800px',
        data:{userObj}
    });
  }

  dipositAmt(userObj){
    if(this.depositVar.value==undefined || this.depositVar.value==null || this.depositVar.value==''){
      alert('Please enter deposit amount !!')
    }else{
      let param={
        accountNo : userObj['accountNo'],
        userId : userObj['_id'],
        email: userObj['email'],
        amount : this.depositVar.value
      }
       this.userService.depositAmt(param).subscribe(res => {
        if(res){
          this.depositVar =new FormControl();
          this.checkBalance(userObj);
          alert('Amount deposit successfully !!')
        }
      },
      err => {
        console.log(err);
      }
    );
    }
  }

  WithdrawAmt(userObj){
    if(this.withdrawVar.value==undefined || this.withdrawVar.value==null || this.withdrawVar.value==''){
      alert('Please enter withdraw amount !!')
    }else{
      let param={
        accountNo : userObj['accountNo'],
        userId : userObj['_id'],
        email: userObj['email'],
        amount : this.withdrawVar.value
      }
      this.userService.checkBalance(param).subscribe(balance => {
            if(balance){
              if(balance['amount']>=this.withdrawVar.value){
              this.userService.WithdrawAmt(param).subscribe(res => {
                if(res){
                  this.withdrawVar =new FormControl();
                  this.checkBalance(userObj);
                  alert('Amount withdraw successfully !!')
                }
              },
              err => {
                console.log(err);
              }
            );
          }else{
            alert('Your current balance is below to withdraw amount!!')
           }
        }
      },
      err => {
        console.log(err);
      }
    );
    }
  }

  checkBalance(userObj){
      let param={
        accountNo : userObj['accountNo'],
        userId : userObj['_id']
      }
        this.userService.checkBalance(param).subscribe(res => {
        if(res){
          this.balance =res['amount'];
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
