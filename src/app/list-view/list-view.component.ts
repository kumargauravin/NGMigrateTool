import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { BasicSearch } from '../basic-search';
const {dialog} = require('electron').remote;
const {app} = require('electron').remote;
const config = require('electron-json-config');
const fs = require('fs');
const child = require('child_process').execFile;

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {
  fileSource = '';
  compareRules = {};
  rulePath = '';
  ngxPath = '';
  ngPath = '';
  matchedRules = '';
  showErrorMessage = '';
  keyUsedFromSource = '';
  executablePath = '';
  destinationFileNotExists = false;
  noDestinationFound = false;
  matchFound = false;
  modelScreen1 = new BasicSearch('', '', '', null, '');

  constructor(private dataService: DataService, private routerCompareList: Router) { }

  ngOnInit() {
    this.showErrorMessage = '';
    this.dataService.currentFileSource.subscribe(fileSourceCompareList => {
      this.fileSource = fileSourceCompareList;
    });
    this.dataService.currentCompareRules.subscribe(compareRulesCompareList => {
      this.compareRules = compareRulesCompareList;
    });
    this.dataService.currentNgxPath.subscribe(ngxPathCompareList => {
      this.ngxPath = ngxPathCompareList;
    });
    this.dataService.currentNgPath.subscribe(ngPathCompareList => {
      this.ngPath = ngPathCompareList;
    });
    this.dataService.currentBcPath.subscribe(bcPathCompareList => {
      this.executablePath = bcPathCompareList;
    });
    this.dataService.currentModelScreen1.subscribe(currentModelScreen1CompareList => {
      this.modelScreen1 = currentModelScreen1CompareList;
    });

  }

}
