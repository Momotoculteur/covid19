import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { EFooterNav } from 'src/app/shared/enum/EFooterNav';

@Injectable({
  providedIn: 'root'
})
export class FooterComService {

  private navInfos: Subject<EFooterNav>;

  constructor() {
    this.navInfos = new Subject();
  }

  public updateNavInfosValue(newVal: EFooterNav): void {
    this.navInfos.next(newVal);
  }

  public getObsNavInfos(): Observable<EFooterNav> {
    return this.navInfos.asObservable();
  }
}
