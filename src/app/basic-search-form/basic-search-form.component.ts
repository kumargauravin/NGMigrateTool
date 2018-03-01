import { Component, OnInit } from '@angular/core';
import { BasicSearch } from '../basic-search';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
const fs = require('fs');

@Component({
  selector: 'app-basic-search-form',
  templateUrl: './basic-search-form.component.html',
  styleUrls: ['./basic-search-form.component.scss']
})
export class BasicSearchFormComponent implements OnInit {
  model = new BasicSearch('', '', 'G', null, '');
  submitted = false;
  ngPath = '';
  showErrorMessage = '';
  onSubmit() {
    this.submitted = true;
    console.log(this.diagnostic);
    let fileName = this.model.sourceGit;
    if (this.model.searchType === 'B') {
      fileName = this.model.sourceBrowse;
    }

    const self = this;
    let fileToSearch = this.ngPath + '/' + this.model.sourceGit;
    if (this.model.searchType === 'B') {
      fileToSearch = this.model.sourceBrowse;
    }
    console.log(fileToSearch);
    fs.stat(fileToSearch, function (err, stats) {
      if (stats && stats.isFile()) {
        self.showErrorMessage = '';
        self.dataService.changeModelScreen1(self.model);
        self.dataService.changeFileSource(fileName);
        self.dataService.changeConfigPath('Available');
        self.routerhome.navigate(['compareList']);
      } else {
        self.showErrorMessage = err.message ? err.message.replace(',', '<br>') : 'File error occured. Try Again.';
        self.model.sourceName = '';
        self.model.sourceBrowse = '';
      }
    });
  }

  handleFileInput(files: FileList) {
    this.model.sourceBrowse = '';
    if (files.length > 0) {
      this.model.sourceBrowse = files.item(0).path;
    }
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
  constructor(private dataService: DataService, private routerhome: Router ) {
    this.dataService.currentModelScreen1.subscribe(modelScreen1BasicSearch => {
      this.model = modelScreen1BasicSearch;
    });
    this.dataService.currentNgPath.subscribe(ngPathBasicSearch => {
      this.ngPath = ngPathBasicSearch;
    });
  }

  ngOnInit() {
  }

  onListView() {
    this.routerhome.navigate(['listView']);
  }
}
