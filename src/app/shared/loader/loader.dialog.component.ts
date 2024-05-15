import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmModel {
  title: string;
}
@Component({
  selector: 'app-loader-dialog',
  templateUrl: './loader.dialog.component.html',
  styleUrls: ['./loader.dialog.component.scss'],
})

export class LoaderDialogComponent {
  title: string;
  //This code snippest is added for closing modal dialog on escape key event
  constructor(public dialogRef: MatDialogRef<LoaderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { }
}

