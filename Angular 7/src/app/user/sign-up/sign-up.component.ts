import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserService } from '../../shared/user.service';
// import { ConsoleReporter } from 'jasmine';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage: boolean;
  serverErrorMessages: string;
  array: ({ a: number; b: string; c: boolean; d: number; } | { b: StringConstructor; a?: undefined; c?: undefined; d?: undefined; })[];

  constructor(private userService: UserService) { }

  ngOnInit() {

    this.array = [{a: 1, b: 'str', c: true, d: 999}, {b: String}];

      var results = this.findByMatchingProperties(this.array, { b: "str" });

      console.log('result', results);
   
  }


   findByMatchingProperties(set, properties) {
    return set.filter(function (entry) {
        return Object.keys(properties).every(function (key) {
            return entry[key] === properties[key];
        });
    });
}


  onSubmit(form: NgForm) {
    this.userService.postUser(form.value).subscribe(
      res => {
        this.showSucessMessage = true;
        setTimeout(() => this.showSucessMessage = false, 4000);
        this.resetForm(form);
      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.serverErrorMessages = 'Something went wrong.Please contact admin.';
      }
    );
  }

  resetForm(form: NgForm) {
    this.userService.selectedUser = {
      fullName: '',
      email: '',
      password: ''
    };
    form.resetForm();
    this.serverErrorMessages = '';
  }

}
