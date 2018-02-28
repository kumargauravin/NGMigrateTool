import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
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
  constructor(private dataService: DataService) {
    this.dataService.currentConfigPath.subscribe(configPathHome => {
      this.configPath = configPathHome;
    });
  }

  ngOnInit() {
    if (this.configPath !== '') {
      this.settingsLoaded = true;
    }
  }

  onLoadAppSettings() {
    const configSelection = dialog.showOpenDialog({ title: 'Please select app config file...',
    defaultPath: app.getPath('userDesktop'), filters: [ { name: 'config.json', extensions: ['json'] }], properties: ['openFile']});
    if (Array.isArray(configSelection) && configSelection.length === 1) {
      console.log('MUAPPSETTINGS: File selection Completed.');
      this.dataService.changeConfigPath(configSelection[0]);
      const configSelected = this.configPath;
      console.log('MUAPPSETTINGS: ' + configSelected);
      // Asynchronous read
      const self = this;
      fs.readFile(configSelected, function (err, data) {
        if (err || !self.isJsonString(data.toString())) {
          self.showErrorMessage = (!err ? 'JSON Parse Error.' : err);
          self.settingsLoaded = false;
          return console.error(err);
        }
        console.log(JSON.parse(data.toString()));
        self.setDataAndEnable(JSON.parse(data.toString()));
      });
    }
  }

  setDataAndEnable(data) {
    try {
      this.dataService.changeNgPath(data.sysconfig['ng-path']);
      this.dataService.changeBcPath(data.sysconfig['bc-path']);
      this.dataService.changeCompareRules(data.rules);
      this.dataService.changeNgxPath(data.sysconfig['ngx-path']);
      this.settingsLoaded = true;
      this.showErrorMessage = '';
    } catch (e) {
      this.settingsLoaded = false;
      this.showErrorMessage = 'File does not have required fields:-<br>' + e;
    }
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
