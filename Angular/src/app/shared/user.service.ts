import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User = {
    fullName: '',
    email: '',
    phone:0,
    gender:'',
    city:'',
    password: ''
  };

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  //HttpMethods

  postUser(user: User){
    return this.http.post(environment.apiBaseUrl+'/register',user,this.noAuthHeader);
  }

  login(authCredentials) {
    return this.http.post(environment.apiBaseUrl + '/authenticate', authCredentials,this.noAuthHeader);
  }

  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + '/userProfile');
  }

  depositAmt(param){
    return this.http.post(environment.apiBaseUrl+'/depositAmt',param,this.noAuthHeader);
  }

  WithdrawAmt(param){
    return this.http.post(environment.apiBaseUrl+'/WithdrawAmt',param,this.noAuthHeader);
  }

  checkBalance(param){
    return this.http.post(environment.apiBaseUrl+'/checkBalance',param,this.noAuthHeader);
  }

  getTransactions(param){
    return this.http.post(environment.apiBaseUrl+'/getTransactions',param,this.noAuthHeader);
  }

  sendVerificationLink(param){
    return this.http.post(environment.apiBaseUrl+'/sendVerificationLink',param,this.noAuthHeader);
  }

  resetPassword(param){
    return this.http.post(environment.apiBaseUrl+'/resetPassword',param,this.noAuthHeader);
  }
  //Helper Methods

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }
}
