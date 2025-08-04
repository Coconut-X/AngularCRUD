import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserServiceService } from '../user-service.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'update-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss',
  standalone: true,
})
export class UpdateUserComponent implements OnChanges {

  constructor(private userService: UserServiceService) {}

  @Input() isVisible: boolean = false;
  @Input() selectedUser: any = null;
  @Output() closeForm = new EventEmitter<void>();

  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    mobile_number: new FormControl('', Validators.required),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedUser'] && this.selectedUser) {
      this.fillForm();
    }
  }

  closeUpdateForm() {
    // Reset form and hide it
    this.profileForm.reset();
    
    // Emit close event to parent component
    this.closeForm.emit();
    console.log('Update form closed via cross button.');
  }

  fillForm() {
    if (this.selectedUser) {
      this.profileForm.patchValue({
        name: this.selectedUser.name,
        address: this.selectedUser.address,
        mobile_number: this.selectedUser.mobile_number
      });
    }
  }

  updateUser(){
    if (this.profileForm.valid && this.selectedUser) {
      const userData = this.profileForm.value;
      const userDataWithId = { ...userData, id: this.selectedUser.id };
      
      this.userService.updateUser(userDataWithId).subscribe({
        next: () => {
          console.log('User updated successfully');
          
          this.profileForm.reset();
          this.closeForm.emit();
          console.log('Update form closed, user list refreshed.');
        },
        error: (error) => {
          console.error('Error updating user:', error);
          alert('Error updating user. Please try again.');
        }
      });
    }
    else {
      alert('Form is invalid');
    }
  }
}
