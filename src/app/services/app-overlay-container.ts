import {OverlayContainer} from "@angular/cdk/overlay";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AppOverlayContainer extends OverlayContainer {
  appOverlayContainerClass = 'app-cdk-overlay-container';

  public appendToCustomWrapper(wrapperElement: HTMLElement): void {
    if (wrapperElement === null) {
      return;
    }

    if (!this._containerElement) {
      super._createContainer();
    }

    this._containerElement.classList.add(this.appOverlayContainerClass);

    wrapperElement.appendChild(this._containerElement);
  }

  public appendToBody(): void {
    if (!this._containerElement) {
      return;
    }

    this._containerElement.classList.remove(this.appOverlayContainerClass);

    this._document.body.appendChild(this._containerElement);
  }
}
