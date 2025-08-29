import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Volumes } from './volumes';

describe('Volumes', () => {
  let component: Volumes;
  let fixture: ComponentFixture<Volumes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Volumes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Volumes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
