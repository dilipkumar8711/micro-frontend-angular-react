import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mfe2Wrapper } from './mfe2-wrapper';

describe('Mfe2Wrapper', () => {
  let component: Mfe2Wrapper;
  let fixture: ComponentFixture<Mfe2Wrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mfe2Wrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mfe2Wrapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
