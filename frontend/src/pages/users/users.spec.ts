import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Users } from './users';
import { UsersService } from '../../service/users';

describe('Users', () => {
  let component: Users;
  let fixture: ComponentFixture<Users>;

  const usersServiceMock = {
    getAll: () => of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Users],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Users);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
