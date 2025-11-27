import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StatisticsService } from '../../../services/statistics.service';
import { Statistics } from '../../../models/statistics.model';

@Component({
  selector: 'app-admin-statistics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.scss']
})
export class AdminStatisticsComponent implements OnInit {
  statisticsForm: FormGroup;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  statistics: Statistics | null = null;

  constructor(
    private fb: FormBuilder,
    private statisticsService: StatisticsService
  ) {
    this.statisticsForm = this.fb.group({
      researchProjects: [500, [Validators.required, Validators.min(0)]],
      partnerInstitutions: [50, [Validators.required, Validators.min(0)]],
      publishedArticles: [2000, [Validators.required, Validators.min(0)]],
      researchFunding: [250, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.statisticsService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.statisticsForm.patchValue({
          researchProjects: stats.researchProjects,
          partnerInstitutions: stats.partnerInstitutions,
          publishedArticles: stats.publishedArticles,
          researchFunding: stats.researchFunding
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading statistics';
        this.isLoading = false;
        console.error('Error loading statistics:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.statisticsForm.invalid) {
      this.markFormGroupTouched(this.statisticsForm);
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData = this.statisticsForm.value;
    
    this.statisticsService.updateStatistics(updateData).subscribe({
      next: (updatedStats) => {
        this.statistics = updatedStats;
        this.successMessage = 'Statistics updated successfully!';
        this.isSaving = false;
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = 'Error updating statistics';
        this.isSaving = false;
        console.error('Error updating statistics:', error);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}


