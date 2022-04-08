import {Component, Inject, Optional} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

interface ConfirmDialogOptions {
  okButtonText: string;
  cancelButtonText: string;
}

export class ConfirmDialogModel {
  title: string;
  message: string;

  constructor(
    title: string,
    message: string,
    @Optional() public options?: Partial<ConfirmDialogOptions>
  ) {
    this.title = title;
    this.message = message;
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
})
export class DialogComponent {

  title: string;
  message: string;
  okButtonText: string;
  cancelButtonText: string;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel
  ) {
    this.title = data.title;
    this.message = data.message;
    this.okButtonText = 'Yes'
    this.cancelButtonText = 'No'
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
