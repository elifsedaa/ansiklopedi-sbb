import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorDetail } from './author-detail';

describe('AuthorDetail', () => {
  let component: AuthorDetail;
  let fixture: ComponentFixture<AuthorDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
