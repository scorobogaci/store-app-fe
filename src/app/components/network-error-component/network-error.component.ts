import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogModel} from "../dialog-component/confirm-dialog.component";

export class NetworkErrorModel {
  title: string;
  message: string;

  constructor(title: string, message: string) {
    this.title = title;
    this.message = message;
  }
}

@Component({
  selector: 'app-network-error-dialog',
  templateUrl: 'network-error.component.html',
})
export class NetworkErrorComponent {

  title: string;
  message: string;

  constructor(public dialogRef: MatDialogRef<NetworkErrorComponent>, @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) {
    this.title = data.title;
    this.message = data.message;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

}
