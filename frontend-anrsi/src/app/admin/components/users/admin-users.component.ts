import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

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
    private authService: AuthService
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
    // Mock users data - replace with actual service call
    const mockUsers: User[] = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@anrsi.mr',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date()
      },
      {
        id: 2,
        username: 'editor',
        email: 'editor@anrsi.mr',
        role: 'editor',
        firstName: 'Editor',
        lastName: 'User',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        lastLogin: new Date()
      }
  
    ];

    this.usersSubject.next(mockUsers);
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
      const userData: User = {
        id: this.editingUserId || Date.now(),
        username: formValue.username,
        email: formValue.email,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        role: formValue.role,
        isActive: formValue.isActive,
        createdAt: this.editingUserId ? this.getUserById(this.editingUserId)?.createdAt || new Date() : new Date(),
        lastLogin: this.editingUserId ? this.getUserById(this.editingUserId)?.lastLogin : undefined
      };

      // Mock save operation
      // In real implementation, include password in API call if provided:
      // const updateData: any = { ...userData };
      // if (formValue.password) {
      //   updateData.password = formValue.password;
      // }
      
      setTimeout(() => {
        const currentUsers = this.usersSubject.value;
        if (this.isEditMode && this.editingUserId) {
          const index = currentUsers.findIndex(u => u.id === this.editingUserId);
          if (index !== -1) {
            currentUsers[index] = userData;
          }
        } else {
          currentUsers.push(userData);
        }
        
        this.usersSubject.next([...currentUsers]);
        this.isLoading = false;
        this.showUserForm = false;
        this.userForm.reset();
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      const currentUsers = this.usersSubject.value;
      const filteredUsers = currentUsers.filter(u => u.id !== id);
      this.usersSubject.next(filteredUsers);
    }
  }

  toggleUserStatus(user: User): void {
    const currentUsers = this.usersSubject.value;
    const index = currentUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      currentUsers[index].isActive = !currentUsers[index].isActive;
      this.usersSubject.next([...currentUsers]);
    }
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

