import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { LoanRepaymentDialogComponent } from '../loan-repayment-dialog/loan-repayment-dialog.component';

interface Currency {
  code: string;
  value: number;
}

interface State {
  name: string;
  code: string;
  tax : number
}

@Component({
  selector: 'app-calculate-repay-amount',
  templateUrl: './calculate-repay-amount.component.html',
  styleUrls: ['./calculate-repay-amount.component.css']
})

export class CalculateRepayAmountComponent implements OnInit {

  RepayAmountForm = new FormGroup({
    loanAmount : new FormControl( null , [Validators.min(0), Validators.required]), // numeric
    homeCurrency : new FormControl('', [Validators.required]), // number
    interestRate : new FormControl( null, [Validators.min(0), Validators.required]), // percentage field. have to be float
    // toCountry : new FormControl('United States', [Validators.required]), // string
    state : new FormControl('', [Validators.required]), // string
    salaryPerMonth : new FormControl(null, [Validators.required]), // numeric
    dateOfLoanTaken : new FormControl('', [Validators.required]),
    dateOfLoanRepayment : new FormControl('', [Validators.required])
  });

  currencyList: Currency[] = [
    {code: 'INR', value: 73.5},
    {code: 'CAD', value: 1.26},
    {code: 'YEN', value: 109.83}
  ];

  // currencyMap : any = {
  //   'INR' : 73.5,
  //   'CAD' : 1.26,
  //   'YEN' : 109.83
  // }

  stateList: State[] = [
    {code: 'OH', name: 'Ohio', tax : 5.75},
    {code: 'NY', name: 'New York', tax : 4},
    {code: 'AL', name: 'Alabama', tax : 6},
    {code: 'TX', name: 'Texas', tax : 0},
  ];

  stateCodeMap : any = {
    'OH' : 5.75, 'NY' : 4, 'AL' : 6, 'TX' : 0
  }

  todayDate : any;
  successMessage : string = "";
  errorMessage : string = "";

  constructor(public dialog: MatDialog) { 
    this.todayDate = new Date();
    this.setSuccessErrorDefault();
  }

  ngOnInit(): void {
  }

  setSuccessErrorDefault() {
    this.successMessage = "";
    this.errorMessage = "";
  }

  calTimeInYears() {
    var diff = Math.abs(new Date(this.RepayAmountForm.value.dateOfLoanRepayment).getTime() - new Date(this.RepayAmountForm.value.dateOfLoanTaken).getTime());
    var diffYears = diff/(1000 * 3600 * 24 * 30 * 12);
    return diffYears;
  }

  calTimeInMonths() {
    var diff = Math.abs(new Date(this.RepayAmountForm.value.dateOfLoanRepayment).getTime() - new Date(this.RepayAmountForm.value.dateOfLoanTaken).getTime());
    var diffMonths= diff/(1000 * 3600 * 24 * 30);
    return diffMonths;
  }

  openDialog(msg : string) {
    const dialogRef = this.dialog.open(LoanRepaymentDialogComponent, {
      width: '400px',
      height: '150px', 
      data: { message : msg }
    });
  }

  calculateRepaymentAmount() {
    console.log(" Hi! I am here. ");
    this.setSuccessErrorDefault();
    var timeInMonths = this.calTimeInMonths();
    var timeInYears = this.calTimeInYears();
    var finalAmount = this.finalAmount(this.RepayAmountForm.value.loanAmount, timeInYears, this.RepayAmountForm.value.interestRate);
    var toCountryAmount = this.amountConvertedIntoCurrent(finalAmount, this.RepayAmountForm.value.homeCurrency);
    var salaryAfterTaxDeduction = this.salAfterTax(this.stateCodeMap[this.RepayAmountForm.value.state], this.RepayAmountForm.value.salaryPerMonth);
    var savings = this.findSavingsAfterLoan(salaryAfterTaxDeduction, toCountryAmount, timeInMonths);
    if(savings < 0) {
      this.errorMessage = "Considering the average expenses in this region, we advice you to increase the time period of loan repayment. You are deficit by $" + Math.floor(Math.abs(savings)) + " per month.";
      this.openDialog(this.errorMessage);
    } else {
      this.successMessage = "Your loan can be repayed in the selected time period with approximate savings of $" + Math.floor(savings) + " per month.";
      this.openDialog(this.successMessage);
    }
    console.log(timeInMonths, "\n", timeInYears, "\n", finalAmount, "\n", toCountryAmount, "\n", salaryAfterTaxDeduction, "\n", savings);

  }

  finalAmount(loanAmt : number, time : number, rate : number) {
    return loanAmt*(100+(time*rate))/100;
  }
 
//Amount to bee repayed back in current country currency 
  amountConvertedIntoCurrent(finalAmount : number, rateOfConvertion : number) {
    return (finalAmount/rateOfConvertion);
  }
 
  //salary after tax
  salAfterTax(tax : number, salary : number) {
    return salary * ((100-tax)/100);
  }
 
  findSavingsAfterLoan(salaryAT : number, amountConvertedIntoCurrent : number, timeInMonths : number) {
    var savings : number;
    if(salaryAT < 5000) {
      savings = (salaryAT * 40) / 100;
    } else {
      savings = (salaryAT - 3500);
    }
    return savings - (amountConvertedIntoCurrent/timeInMonths);
  }

}
