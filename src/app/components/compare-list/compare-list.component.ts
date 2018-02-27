import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
const {dialog} = require('electron').remote;
const {app} = require('electron').remote;
const config = require('electron-json-config');
const fs = require('fs');
const child = require('child_process').execFile;
const executablePath = 'C:\\Program Files\\Beyond Compare 4\\bcompare.exe';

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
  matchedRules = [];
  showErrorMessage = '';
  keyUsedFromSource = '';
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
    let execStep2 = false;
    if (this.ngxPath === '') {
      const ngxSelection = dialog.showOpenDialog({ title: 'Please select folder for NGX Repository.',
      defaultPath: app.getPath('userDesktop'), properties: [ 'openDirectory', 'createDirectory']});
      if (Array.isArray(ngxSelection) && ngxSelection.length === 1) {
        this.ngxPath = ngxSelection[0];
        this.dataService.changeNgxPath(this.ngxPath);
        execStep2 = true;
      }
    } else {
      execStep2 = true;
    }

    if (execStep2) {
      if (Object.keys(this.compareRules).length === 0) {
        this.rulePath = dialog.showOpenDialog({ title: 'Please select folder with Rules File.',
        defaultPath: app.getPath('userDesktop'), properties: [ 'openDirectory', 'createDirectory']})[0];
            // Asynchronous read
            const self = this;
            fs.readFile(this.rulePath + '/config.json', function (err, data) {
              if (err) {
                self.showErrorMessage = 'Error in File Handling...' + err;
                return console.error(err);
              }
              console.log(JSON.parse(data.toString()));
              self.checkAndProceed(JSON.parse(data.toString()));
            });

      } else {
        /*Existing rules in session.*/
        this.rulePath = JSON.stringify(this.compareRules);
        this.checkAndProceed(this.compareRules);
      }
    } else {
      this.onNavigateBack();
    }
  }

  onOpenCompare() {
    const parameters = [];
    parameters.push(this.fileSource);
    parameters.push(this.ngxPath + '/' + this.matchedRules);
    child(executablePath, parameters, function(err, data) {
      console.log(err);
      console.log(data.toString());
    });
  }

  checkAndProceed(rules) {
    this.compareRules = rules;
    this.dataService.changeCompareRules(this.compareRules);
    if (fs.existsSync(this.fileSource)) {
      if (fs.existsSync(this.ngxPath)) {
        if (Object.keys(this.compareRules).length > 0 ) {
            const n = this.fileSource.lastIndexOf('/NG/');
            this.keyUsedFromSource = this.fileSource.substr(n + 1);
            this.matchedRules = this.compareRules[this.keyUsedFromSource];
            console.log(this.fileSource.substr(n + 1));
        } else {
          this.showErrorMessage = 'Rules are empty or not parsed correctly.';
        }
      } else {
        this.showErrorMessage = 'NGX Path does not exists.';
      }
    } else {
      this.showErrorMessage = 'Source file does not exists.';
    }
  }
  onNavigateBack() {
    this.routerCompareList.navigate(['']);
  }

}
