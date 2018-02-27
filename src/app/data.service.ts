import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { BasicSearch } from './basic-search';

@Injectable()
export class DataService {

  private fileSource = new BehaviorSubject<string>('');
  private compareRules = new BehaviorSubject<object>({});
  private ngxPath = new BehaviorSubject<string>('');
  private modelScreen1 = new BehaviorSubject<BasicSearch>(new BasicSearch('', '', 'T', null));
  currentFileSource = this.fileSource.asObservable();
  currentCompareRules = this.compareRules.asObservable();
  currentNgxPath = this.ngxPath.asObservable();
  currentModelScreen1 = this.modelScreen1.asObservable();
  constructor() {

  }
  changeFileSource (fileSource: string) {
    fileSource = fileSource.replace(/\\/g, '/');
    this.fileSource.next(fileSource);
  }

  changeCompareRules (ruleSet: object) {
    this.compareRules.next(ruleSet);
  }

  changeNgxPath (ngxSource: string) {
    ngxSource = ngxSource.replace(/\\/g, '/');
    this.ngxPath.next(ngxSource);
  }

  changeModelScreen1 (data: BasicSearch) {
    this.modelScreen1.next(data);
  }

}

