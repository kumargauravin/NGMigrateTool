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

  constructor(private dataService: DataService, private routerListView: Router) { }
  listViewModel = [];
  model = new BasicSearch('', '', 'G', null, '');
  ngOnInit() {
    this.listViewModel = [];
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
    this.prepareListView(this.compareRules);
  }

  prepareListView(rules) {
    console.log('List View Start.');
    const arrayKeys = Object.keys(rules);
    for (let key of arrayKeys) {
      this.listViewModel.push({relPath : key, mappedPath : rules[key]});
    }
  }

  onCompareFiles(rule) {
    this.checkAndProceed(rule);
  }

  onOpenCompare() {
    const parameters = [];
    const fileSource = this.fileSource;
    parameters.push(fileSource);
    parameters.push(this.ngxPath + '/' + this.matchedRules);
    child(this.executablePath, parameters, function(err, data) {
      console.log(err);
      console.log(data.toString());
    });
  }

  checkAndProceed(rule) {
    const fileToSearch = this.ngPath + '/' + rule.relPath;
    this.fileSource = fileToSearch;
    this.matchedRules = rule.mappedPath;
    if (fs.existsSync(fileToSearch)) {
      if (fs.existsSync(this.ngxPath)) {
            if (this.matchedRules && !fs.existsSync(this.ngxPath + '/' + this.matchedRules)) {
              this.destinationFileNotExists = true;
              this.showErrorMessage = 'Destination file does not exists.';
            } else if (!this.matchedRules) {
              this.noDestinationFound = true;
              this.showErrorMessage = 'Destination not provided in rules.';
            } else {
              this.showErrorMessage = '';
              this.matchFound = true;
              this.onOpenCompare();
            }
      } else {
        this.showErrorMessage = 'NGX Path does not exists.<br>' + this.ngxPath;
      }
    } else {
      this.showErrorMessage = 'Source file does not exists.<br>' + fileToSearch;
    }
  }

  onNavigateBack() {
    this.routerListView.navigate(['']);
  }

}
