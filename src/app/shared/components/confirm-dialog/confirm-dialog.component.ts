import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports:[MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">{{ data.cancelText }}</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true" cdkFocusInitial>
        {{ data.confirmText }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-actions {
      padding: 16px 24px;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string;
      confirmText: string;
      cancelText: string;
    }
  ) {}
}
