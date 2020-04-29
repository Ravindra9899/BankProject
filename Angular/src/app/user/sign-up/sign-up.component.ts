import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm:FormGroup;
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder) { 
     
    }
  
  ngOnInit() {
       this.signUpForm = this._formBuilder.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern('[6-9]\\d{9}')]],
            gender:['', [Validators.required]],
            city:['', [Validators.required]],
            password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
        });
   
  }

  onSubmit() {
    console.log('form',this.signUpForm.valid);
    if(this.signUpForm.valid){
    this.userService.postUser(this.signUpForm.value).subscribe(
      res => {
        //setTimeout(() => this.showSucessMessage = false, 4000);
        this.toastr.success('User successfully registered !!');
        this.signUpForm.reset();
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
      alert('Please fill complete form !!');
    }
  }
}
