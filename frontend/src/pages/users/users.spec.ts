import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Users } from './users';
import { UsersService } from '../../service/users';
import { of, throwError } from 'rxjs';

describe('Users', () => {
  let component: Users;
  let fixture: ComponentFixture<Users>;
  let usersService: {
    getAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    usersService = {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Users],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Users);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@test.com', password_hash: '', role: 'EMPLOYEE' as const },
      { id: 2, name: 'User 2', email: 'user2@test.com', password_hash: '', role: 'ADMIN' as const },
    ];
    usersService.getAll.mockReturnValue(of(mockUsers));

    component.ngOnInit();

    expect(usersService.getAll).toHaveBeenCalled();
    expect(component.users()).toEqual(mockUsers);
  });

  it('should handle error when loading users', () => {
    usersService.getAll.mockReturnValue(throwError(() => new Error('Network error')));

    component.ngOnInit();

    expect(component.error()).toBe('Error al cargar los usuarios');
  });

  it('should open create form', () => {
    component.openCreateForm();

    expect(component.formMode()).toBe('create');
    expect(component.formData.id).toBe(0);
    expect(component.formData.name).toBe('');
  });
});
