import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSearchFormComponent } from './basic-search-form.component';

describe('BasicSearchFormComponent', () => {
  let component: BasicSearchFormComponent;
  let fixture: ComponentFixture<BasicSearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicSearchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
