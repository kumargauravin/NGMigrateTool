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
  model = new BasicSearch('', '', 'T', null);
  submitted = false;

  onSubmit() {
    this.submitted = true;
    console.log(this.diagnostic);
    let fileName = this.model.sourceName;
    if (this.model.searchType === 'B') {
      fileName = this.model.sourceBrowse;
    }

    const self = this;
    fs.stat(fileName, function (err, stats) {
      if (stats && stats.isFile()) {
        const backupModel = new BasicSearch(fileName , '', 'T', null);
        self.dataService.changeModelScreen1(backupModel);
        self.dataService.changeFileSource(fileName);
        self.routerhome.navigate(['compareList']);
      } else {
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
  }

  ngOnInit() {
  }

}