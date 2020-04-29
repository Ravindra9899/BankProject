import { Component, OnInit,Inject } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
import { FormControl} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatDatepicker } from '@angular/material/datepicker';
@Component({
  selector: 'app-forgot-dialog',
  templateUrl: './forgot.dialog.component.html',
  styleUrls: ['./forgot.dialog.component.css']
})
export class ForgotDialogComponent implements OnInit {
email = new FormControl();
constructor(private router: Router,
private userService: UserService,
public dialogRef: MatDialogRef<ForgotDialogComponent>,
@Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
      console.log('this.data',this.data);
      
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(){
      if(this.email.value==undefined || this.email.value==null || this.email.value==""){
          alert('Please enter registered email !');
      }else{
       let param={
           email:this.email.value,
           emailSentOrNot:true
       }   
       this.userService.sendVerificationLink(param).subscribe(res => {
        if(res){
          this.email =new FormControl();
          this.dialogRef.close();
          alert('Link has been sent to your email !!')
        }
      },
      err => {
        console.log(err);
      }
    );
      }
  }

}