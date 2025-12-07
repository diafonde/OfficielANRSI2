import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, BehaviorSubject, catchError, of } from 'rxjs';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UserAdminService, UserCreateRequest } from '../../services/user-admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users$: Observable<User[]>;
  showUserForm = false;
  userForm: FormGroup;
  isEditMode = false;
  editingUserId: number | null = null;
  isLoading = false;
  errorMessage = '';

  private usersSubject = new BehaviorSubject<User[]>([]);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserAdminService
  ) {
    this.users$ = this.usersSubject.asObservable();
    
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      role: ['', [Validators.required]],
      password: [''],
      confirmPassword: [''],
      isActive: [true]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.userService.getAll().pipe(
      catchError(error => {
        console.error('Error loading users:', error);
        this.errorMessage = error.error?.message || 'Failed to load users';
        this.isLoading = false;
        return of([]);
      })
    ).subscribe(users => {
      // Convert date strings to Date objects if needed
      const processedUsers = users.map(user => ({
        ...user,
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
      }));
      this.usersSubject.next(processedUsers);
      this.isLoading = false;
    });
  }

  showCreateForm(): void {
    this.isEditMode = false;
    this.editingUserId = null;
    this.userForm.reset({
      isActive: true,
      password: '',
      confirmPassword: ''
    });
    // Set password as required for create mode
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
    this.showUserForm = true;
  }

  showEditForm(user: User): void {
    this.isEditMode = true;
    this.editingUserId = user.id;
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      password: '',
      confirmPassword: ''
    });
    // Make password optional for edit mode
    this.userForm.get('password')?.setValidators([Validators.minLength(6)]);
    this.userForm.get('confirmPassword')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
    this.showUserForm = true;
  }

  onSubmit(): void {
    // If in edit mode and password is provided, confirmPassword is required
    if (this.isEditMode) {
      const password = this.userForm.get('password')?.value;
      const confirmPassword = this.userForm.get('confirmPassword')?.value;
      
      if (password && !confirmPassword) {
        this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
        this.userForm.get('confirmPassword')?.updateValueAndValidity();
        this.userForm.get('confirmPassword')?.markAsTouched();
      } else if (password && confirmPassword) {
        this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
        this.userForm.get('confirmPassword')?.updateValueAndValidity();
      } else {
        this.userForm.get('confirmPassword')?.clearValidators();
        this.userForm.get('confirmPassword')?.updateValueAndValidity();
      }
    }

    if (this.userForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.userForm.value;
      const userRequest: UserCreateRequest = {
        username: formValue.username,
        email: formValue.email,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        role: formValue.role.toUpperCase() as 'ADMIN' | 'EDITOR' | 'VIEWER',
        isActive: formValue.isActive ?? true
      };

      // Password is required for create, optional for update
      if (!this.isEditMode) {
        // Create mode: password is required (validated by form)
        userRequest.password = formValue.password;
      } else if (formValue.password) {
        // Edit mode: include password only if provided
        userRequest.password = formValue.password;
      }

      const operation = this.isEditMode && this.editingUserId
        ? this.userService.update(this.editingUserId, userRequest)
        : this.userService.create(userRequest);

      operation.pipe(
        catchError(error => {
          console.error('Error saving user:', error);
          this.errorMessage = error.error?.message || error.error?.error || 'Failed to save user';
          this.isLoading = false;
          return of(null);
        })
      ).subscribe(savedUser => {
        if (savedUser) {
          // Convert date strings to Date objects
          const processedUser = {
            ...savedUser,
            createdAt: savedUser.createdAt ? new Date(savedUser.createdAt) : new Date(),
            lastLogin: savedUser.lastLogin ? new Date(savedUser.lastLogin) : undefined
          };

          const currentUsers = this.usersSubject.value;
          if (this.isEditMode && this.editingUserId) {
            const index = currentUsers.findIndex(u => u.id === this.editingUserId);
            if (index !== -1) {
              currentUsers[index] = processedUser;
            }
          } else {
            currentUsers.push(processedUser);
          }
          
          this.usersSubject.next([...currentUsers]);
          this.showUserForm = false;
          this.userForm.reset();
        }
        this.isLoading = false;
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.isLoading = true;
      this.userService.delete(id).pipe(
        catchError(error => {
          console.error('Error deleting user:', error);
          this.errorMessage = error.error?.message || error.error?.error || 'Failed to delete user';
          this.isLoading = false;
          return of(null);
        })
      ).subscribe(() => {
        const currentUsers = this.usersSubject.value;
        const filteredUsers = currentUsers.filter(u => u.id !== id);
        this.usersSubject.next(filteredUsers);
        this.isLoading = false;
      });
    }
  }

  toggleUserStatus(user: User): void {
    this.isLoading = true;
    this.userService.toggleStatus(user.id).pipe(
      catchError(error => {
        console.error('Error toggling user status:', error);
        this.errorMessage = error.error?.message || error.error?.error || 'Failed to update user status';
        this.isLoading = false;
        return of(null);
      })
    ).subscribe(updatedUser => {
      if (updatedUser) {
        // Convert date strings to Date objects
        const processedUser = {
          ...updatedUser,
          createdAt: updatedUser.createdAt ? new Date(updatedUser.createdAt) : new Date(),
          lastLogin: updatedUser.lastLogin ? new Date(updatedUser.lastLogin) : undefined
        };

        const currentUsers = this.usersSubject.value;
        const index = currentUsers.findIndex(u => u.id === user.id);
        if (index !== -1) {
          currentUsers[index] = processedUser;
          this.usersSubject.next([...currentUsers]);
        }
      }
      this.isLoading = false;
    });
  }

  cancelForm(): void {
    this.showUserForm = false;
    this.userForm.reset();
    this.isEditMode = false;
    this.editingUserId = null;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName === 'confirmPassword' ? 'Confirm password' : fieldName} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${fieldName === 'password' ? 'Password' : fieldName} must be at least ${requiredLength} characters`;
      }
    }
    
    // Check for password mismatch error at form level
    if (fieldName === 'confirmPassword' && this.userForm.errors?.['passwordMismatch'] && field?.touched) {
      return 'Passwords do not match';
    }
    
    return '';
  }

  private getUserById(id: number): User | undefined {
    return this.usersSubject.value.find(u => u.id === id);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getRoles(): string[] {
    return ['admin', 'editor', 'viewer'];
  }

  getRoleDisplayName(role: string): string {
    return role.charAt(0).toUpperCase() + role.slice(1);
  }
}

