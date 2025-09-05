import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryDetail } from './entry-detail.component';

describe('EntryDetail', () => {
  let component: EntryDetail;
  let fixture: ComponentFixture<EntryDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
