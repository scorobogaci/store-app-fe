import {Injectable} from "@angular/core";
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from "@angular/material/snack-bar";
import {AppOverlayContainer} from "./app-overlay-container";

@Injectable({
  providedIn: 'root'
})
export class SnackService {

  private snackbarRef: MatSnackBarRef<SimpleSnackBar> | undefined;

  constructor(private appOverlayContainer: AppOverlayContainer, private snackBar: MatSnackBar) {
  }

  public displaySnack(overlayContainerWrapper: HTMLElement, message: string, action: string): void {
    if (overlayContainerWrapper === null) {
      return;
    }

    if (this.snackbarRef) {
      this.snackbarRef.dismiss();
    }

    setTimeout(() => {
      this.appOverlayContainer.appendToCustomWrapper(overlayContainerWrapper);

      this.snackbarRef = this.snackBar.open(message, action, {
        duration: 0
      });

    }, 100);

  }
}
