import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactAdminService } from '../../services/contact-admin.service';
import { ContactMessageResponse } from '../../../services/contact.service';

@Component({
  selector: 'app-admin-contact-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-contact-messages.component.html',
  styleUrls: ['./admin-contact-messages.component.scss']
})
export class AdminContactMessagesComponent implements OnInit {
  messages: ContactMessageResponse[] = [];
  filteredMessages: ContactMessageResponse[] = [];
  selectedMessage: ContactMessageResponse | null = null;
  isLoading = false;
  errorMessage = '';
  filterStatus: 'all' | 'unread' | 'read' = 'all';
  searchTerm = '';

  constructor(private contactAdminService: ContactAdminService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.contactAdminService.getAllMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading messages. Please try again.';
        this.isLoading = false;
        console.error('Error loading messages:', error);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.messages];

    // Apply status filter
    if (this.filterStatus === 'unread') {
      filtered = filtered.filter(m => !m.isRead);
    } else if (this.filterStatus === 'read') {
      filtered = filtered.filter(m => m.isRead);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        m.subject.toLowerCase().includes(term) ||
        m.message.toLowerCase().includes(term)
      );
    }

    this.filteredMessages = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  viewMessage(message: ContactMessageResponse): void {
    this.selectedMessage = message;
    // Mark as read if unread
    if (!message.isRead) {
      this.contactAdminService.markAsRead(message.id!).subscribe({
        next: (updated) => {
          const index = this.messages.findIndex(m => m.id === updated.id);
          if (index !== -1) {
            this.messages[index] = updated;
            this.applyFilters();
          }
          if (this.selectedMessage?.id === updated.id) {
            this.selectedMessage = updated;
          }
        },
        error: (error) => {
          console.error('Error marking message as read:', error);
        }
      });
    }
  }

  closeMessageView(): void {
    this.selectedMessage = null;
  }

  markAsRead(message: ContactMessageResponse): void {
    if (message.isRead) {
      return;
    }

    this.contactAdminService.markAsRead(message.id!).subscribe({
      next: (updated) => {
        const index = this.messages.findIndex(m => m.id === updated.id);
        if (index !== -1) {
          this.messages[index] = updated;
          this.applyFilters();
        }
        if (this.selectedMessage?.id === updated.id) {
          this.selectedMessage = updated;
        }
      },
      error: (error) => {
        this.errorMessage = 'Error marking message as read.';
        console.error('Error marking message as read:', error);
      }
    });
  }

  deleteMessage(message: ContactMessageResponse): void {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    this.contactAdminService.deleteMessage(message.id!).subscribe({
      next: () => {
        this.messages = this.messages.filter(m => m.id !== message.id);
        this.applyFilters();
        if (this.selectedMessage?.id === message.id) {
          this.selectedMessage = null;
        }
      },
      error: (error) => {
        this.errorMessage = 'Error deleting message.';
        console.error('Error deleting message:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getUnreadCount(): number {
    return this.messages.filter(m => !m.isRead).length;
  }
}

