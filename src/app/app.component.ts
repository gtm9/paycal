import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Loan-Repayment-Calculator';

  constructor(private router : Router) {}

  dashBoard() {
    this.router.navigate(['/LRCalculator']);
  }
}
