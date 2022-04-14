import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface UploadDialogComponentData {
  title: string;
  fileName: string;
  progress: number;
}

@Component({
  selector: 'app-upload-dialog',
  templateUrl: 'upload-dialog.component.html',
})
export class UploadDialogComponent {

  constructor(public dialogRef: MatDialogRef<UploadDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UploadDialogComponentData) {

  }

  onDismiss(value: string): void {
    this.dialogRef.close(value);
  }

}
