import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { BasicSearch } from '../../basic-search';
const {dialog} = require('electron').remote;
const {app} = require('electron').remote;
const config = require('electron-json-config');
const fs = require('fs');
const child = require('child_process').execFile;

@Component({
  selector: 'app-compare-list',
  templateUrl: './compare-list.component.html',
  styleUrls: ['./compare-list.component.scss']
})
export class CompareListComponent implements OnInit {
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
    this.destinationFileNotExists = false;
    this.noDestinationFound = false;
    this.matchFound = false;
    this.checkAndProceed();
  }

  onOpenCompare() {
    const parameters = [];
    let fileSource = this.fileSource;
    if (this.modelScreen1.searchType === 'G') {
      fileSource = this.ngPath + '/' + this.fileSource;
    }
    parameters.push(fileSource);
    parameters.push(this.ngxPath + '/' + this.matchedRules);
    child(this.executablePath, parameters, function(err, data) {
      console.log(err);
      console.log(data.toString());
    });
  }

  checkAndProceed() {
    let fileToSearch = this.ngPath + '/' + this.modelScreen1.sourceGit;
    if (this.modelScreen1.searchType === 'B') {
      fileToSearch = this.modelScreen1.sourceBrowse;
    }

    if (fs.existsSync(fileToSearch)) {
      if (fs.existsSync(this.ngxPath)) {
        if (Object.keys(this.compareRules).length > 0 ) {
          this.keyUsedFromSource = this.fileSource;
          if (this.modelScreen1.searchType !== 'G') {
            /*Yet to take from NGPath*/
            const m = this.ngPath.lastIndexOf('/');
            const repoName = this.ngPath.substr(m + 1);
            const n = this.fileSource.lastIndexOf('/' + repoName + '/');
            this.keyUsedFromSource = this.fileSource.substr(n + repoName.length + 2);
          }
            this.matchedRules = this.compareRules[this.keyUsedFromSource];
            if (this.matchedRules && !fs.existsSync(this.ngxPath + '/' + this.matchedRules)) {
              this.destinationFileNotExists = true;
            } else if (!this.matchedRules) {
              this.noDestinationFound = true;
            } else {
              this.matchFound = true;
            }

        } else {
          this.showErrorMessage = 'Rules are empty or not parsed correctly.';
        }
      } else {
        this.showErrorMessage = 'NGX Path does not exists.<br>' + this.ngxPath;
      }
    } else {
      this.showErrorMessage = 'Source file does not exists.<br>' + fileToSearch;
    }
  }

  onNavigateBack() {
    this.routerCompareList.navigate(['']);
  }
}
