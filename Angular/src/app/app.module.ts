// built-in
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule } from '@angular/material';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
// components
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
//routes
import { appRoutes } from './routes';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { TransactionsComponent } from './transactions/transactions.component';
import {ForgotDialogComponent} from './forgot-password/forgot.dialog.component'
import {ResetPasswordComponent} from './forgot-password/reset-password/reset.password.component'
import { UserService } from './shared/user.service';
//other
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
// import { ChartsModule } from 'ng2-charts';
import { ChartModule } from 'primeng/chart';
import { NgxUploaderModule } from 'ngx-uploader';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MatButtonModule, MatMenuModule, MatSidenavModule } from '@angular/material';
import { MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule } from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';

//import { MatMomentDateModule } from "@angular/material-moment-adapter";
@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    SignUpComponent,
    UserProfileComponent,
    SignInComponent,
    TransactionsComponent,
    ForgotDialogComponent,
    ResetPasswordComponent
  ],
  entryComponents: [TransactionsComponent,ForgotDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot(),
    HttpClientModule,
    ChartModule,
    NgxUploaderModule,
    ReactiveFormsModule,
    DatePickerModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
  exports:[MatDatepickerModule],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },AuthGuard,UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
