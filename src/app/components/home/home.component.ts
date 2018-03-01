import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Observable } from 'rxjs/Observable';
const {dialog} = require('electron').remote;
const {app} = require('electron').remote;
const fs = require('fs');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showErrorMessage = '';
  settingsLoaded = false;
  configPath = '';
  appPath = '';
  appStatus = {};
  showSettingsButton = false;
  showRulesLoad = false;
  private filterJson = [{ name: 'JSON Files', extensions: ['json'] }];

  constructor(private dataService: DataService) {
    this.dataService.currentConfigPath.subscribe(configPathHome => {
      this.configPath = configPathHome;
    });
  }

  ngOnInit() {
    if (this.configPath !== '') {
      this.settingsLoaded = true;
    } else {
      this.showSettingsButton = false;
      this.showRulesLoad = false;
      this.appStatus['isAppConfigAvailable'] = false;
      this.appStatus['isRuleConfigAvailable'] = false;
      /*if not present ask for both config files after button click*/
      /*Initiate onLoadAppSettings if present*/
      this.appPath = app.getPath('userData');
      console.log('Checking for App Config Files in User Data');
      console.log(this.appPath);
      /*Look for app-config.json and config.json*/
      /*const filePromises = [this.loadFile(this.appPath + '/app-config.json'), this.loadFile(this.appPath + '/rule-config.json')];*/
      /*Promise.all(filePromises).then(
        (data) => console.log(data),
        (err) => console.log(err)
      );*/
      this.loadFile(this.appPath + '/app-config.json').then(
        (data) => this.appConfigFound(data),
        (err) => this.appConfigNotFound(err),
      );
    }
  }

  appConfigFound(data) {
    this.appStatus['isAppConfigAvailable'] = true;
    try {
      const stringData = data.toString();
      if (this.isJsonString(stringData)) {
        const jsonData = JSON.parse(stringData);
        this.dataService.changeNgPath(jsonData.sysconfig['ng-path']);
        this.dataService.changeBcPath(jsonData.sysconfig['bc-path']);
        this.dataService.changeNgxPath(jsonData.sysconfig['ngx-path']);
        this.loadFile(this.appPath + '/rule-config.json').then(
          (dataRule) => this.ruleConfigFound(dataRule),
          (errRule) => this.ruleConfigNotFound(errRule),
        );
      } else {
        this.showErrorMessage = 'APP-CONFIG: JSON Parse Error.';
      }
    } catch (e) {
      this.showErrorMessage = 'APP-CONFIG:' + e;
    }
  }

  appConfigNotFound(err) {
    this.appStatus['isAppConfigAvailable'] = false;
    if (err.message.indexOf('no such file or directory') === -1) {
      this.showErrorMessage = 'APP-CONFIG: ' + err;
    } else {
      this.showSettingsButton = true;
    }
  }

  ruleConfigFound(data) {
    this.appStatus['isRuleConfigAvailable'] = true;
    try {
      const stringData = data.toString();
      if (this.isJsonString(stringData)) {
        const jsonData = JSON.parse(stringData);
        this.dataService.changeCompareRules(jsonData.rules);
        this.settingsLoaded = true;
      } else {
        this.showErrorMessage = 'RULE-CONFIG: JSON Parse Error.';
      }
    } catch (e) {
      this.showErrorMessage = 'RULE-CONFIG: ' + e;
    }
  }

  ruleConfigNotFound(err) {
    this.appStatus['isRuleConfigAvailable'] = false;
    if (err.message.indexOf('no such file or directory') === -1) {
      this.showErrorMessage = 'RULE-CONFIG: ' + err;
    } else {
      this.showRulesLoad = true;
    }
  }

  onloadCustomRulesFile() {
    const configRulesPath = this.findPathThroughDialog('Select Rule Config File...', this.filterJson, ['openFile']);
    if (configRulesPath !== -1) {
      this.loadFile(configRulesPath).then(
        (dataRule) =>  {
          try {
            const stringData = dataRule.toString();
            if (this.isJsonString(stringData)) {
              const jsonData = JSON.parse(stringData);
              if (jsonData.rules) {
              this.dataService.changeCompareRules(jsonData.rules);
              this.showRulesLoad = false;
              this.settingsLoaded = true;
              this.showErrorMessage = '';
              } else {
                this.showErrorMessage = 'CUSTOM-RULE-CONFIG: Does not have Rules key.';
              }
            } else {
              this.showErrorMessage = 'CUSTOM-RULE-CONFIG: JSON Parse Error.';
            }
          } catch (e) {
            this.showErrorMessage = 'CUSTOM-RULE-CONFIG: ' + e;
          }
        },
        (errRule) => this.showErrorMessage = 'CUSTOM-RULE-CONFIG: ' + errRule.message
      );
    }
  }

  findPathThroughDialog(dTitle , dFilter, dProps) {
    const drivePath = dialog.showOpenDialog({ title: dTitle,
    defaultPath: app.getPath('userDesktop'), filters: dFilter, properties: dProps});
    if (Array.isArray(drivePath) && drivePath.length === 1) {
      return drivePath[0];
    } else {
      return -1;
    }
  }

  onLoadAppSettings() {
    const ngDrivePath = this.findPathThroughDialog('Select Older Repo Path', [], ['openDirectory']);
    if (ngDrivePath !== -1) {
      const ngxDrivePath = this.findPathThroughDialog('Select Newer Repo Path', [], ['openDirectory']);
      if (ngxDrivePath !== -1) {
        const bcDrivePath = this.findPathThroughDialog('Select Compare Program Exe', [{ name: 'Application', extensions: ['exe'] }], ['openFile']);
        if (bcDrivePath !== -1) {
          this.dataService.changeNgPath(ngDrivePath);
          this.dataService.changeBcPath(bcDrivePath);
          this.dataService.changeNgxPath(ngxDrivePath);
          this.showSettingsButton = false;
          this.loadFile(this.appPath + '/rule-config.json').then(
            (dataRule) => this.ruleConfigFound(dataRule),
            (errRule) => this.ruleConfigNotFound(errRule),
          );
        }
      }
    }
  }

  private loadFile(configSelected) {
    // Asynchronous read
    const promise = new Promise((resolve, reject) => {
        try {
        const self = this;
        fs.readFile(configSelected, function (err, data) {
          if (err) {
            reject(err);
            return false;
          }
          resolve(data);
        });
        } catch (e) {
          console.log(e);
        }
      });

    return promise;
  }

  isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }
}
