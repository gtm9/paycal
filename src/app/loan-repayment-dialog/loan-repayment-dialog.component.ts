import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-loan-repayment-dialog',
  templateUrl: './loan-repayment-dialog.component.html',
  styleUrls: ['./loan-repayment-dialog.component.css']
})
export class LoanRepaymentDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LoanRepaymentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 

  }

  ngOnInit(): void {
  }

}
