import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public electronService: ElectronService,
    private translate: TranslateService) {

    translate.setDefaultLang('en');

    if (electronService.isElectron()) {
      console.log('Mode electron');
      // Check if electron is correctly injected (see externals in webpack.config.js)
      console.log('c', electronService.ipcRenderer);
      // Check if nodeJs childProcess is correctly injected (see externals in webpack.config.js)
      console.log('c', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
    /*const fs = require('fs-extra');
    const dir = 'D:/X_Drive';
    console.log(fs.readdirSync(dir));
    const child: any = require('child_process').execFile;
    const executablePath: any = 'C:\\Program Files\\Beyond Compare 4\\bcompare.exe';
    let parameters = [];
    parameters.push('anc.xls');
    parameters.push('anc.xls');
    child(executablePath, parameters, function(err, data) {
      console.log(err);
      console.log(data.toString());
    });*/
  }
}
