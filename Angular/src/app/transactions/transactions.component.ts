import { Component, OnInit,Inject } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
import { FormControl} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
//   providers: [
//     { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
//     { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
//   ]
})
export class TransactionsComponent implements OnInit {
fromDate = new FormControl();
toDate = new FormControl();
result:any;  
isShowTransaction:boolean=false;  
constructor(private router: Router,
private userService: UserService,
public dialogRef: MatDialogRef<TransactionsComponent>,
@Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
      console.log('this.data',this.data);
      
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  view(){
      console.log(this.fromDate.value);
      console.log(this.toDate.value);
      this.isShowTransaction=false;
      if(this.fromDate.value ==undefined || this.fromDate.value ==null || this.fromDate.value =='' || this.toDate.value ==undefined || this.toDate.value ==null || this.toDate.value ==''){
          alert('Please select from and to date !!')
      }else{
        let dates={
          fromDate:this.fromDate.value,
          toDate:this.toDate.value
        }
        this.Transactions(this.data['userObj'],dates);
      } 
  }

  Transactions(userObj,dates){
     let param={
        accountNo : userObj['accountNo'],
        userId : userObj['_id'],
        fromDate:dates['fromDate'],
        toDate:dates['toDate']
      }
      
        this.userService.getTransactions(param).subscribe(res => {
        if(res){
          this.isShowTransaction=true;
          this.result =res;
          console.log('this.result',this.result);
        }else{
            this.isShowTransaction=false;
            alert('No records found !!');
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}