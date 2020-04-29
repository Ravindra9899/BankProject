import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset.password.component.html',
  styleUrls: ['./reset.password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm:FormGroup;
  token:any;
  constructor(
    private router: Router,
    private routes: ActivatedRoute,
    private userService: UserService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder) { 
     
    }
  
  ngOnInit() {
        this.routes.params.subscribe((params: Params) => {
            console.log('params',params);
        if (params.token != 'token') {
            this.token=params.token;
        }})
       this.resetForm = this._formBuilder.group({
            password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
            confirmpassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]]
        });
   
  }

  onSubmit() {
    if(this.resetForm.valid){
        if(this.resetForm.value.password==this.resetForm.value.confirmpassword){
            let param={
                token:this.token,
                password:this.resetForm.value.password
            }
            this.userService.resetPassword(param).subscribe(
            res => {
                alert('Password reset successfully !!');
                this.resetForm.reset();
                this.router.navigate(['/login']);
            },
            err => {
                if (err.status === 422) {
                //this.serverErrorMessages = err.error.join('<br/>');
                this.toastr.error('Duplicate email adrress found.');
                }
                else
                this.toastr.error('Something went wrong.Please contact admin.');
            }
            );
        }else{
             alert('Both password is not same !!');
        }
    }else{
      alert('Please fill password feilds !!');
    }
  }
}
