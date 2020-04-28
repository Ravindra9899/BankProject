import { Component, OnInit } from '@angular/core';     
import { ActivatedRoute,Router} from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title = 'Bar Chart';
      data: any;
  constructor(private routes: ActivatedRoute,
              private router: Router,) { 
    this.data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: '#1F618D',
            borderColor: '#D68910',
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor: '#CD6155',
            borderColor: '#2874A6',
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
  }
}
  ngOnInit() {

  }
  ViewProfile() {
    this.router.navigate(['userprofile']);
  }
}
