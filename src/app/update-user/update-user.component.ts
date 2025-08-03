import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class UpdateUserComponent {

  constructor(private userService: UserServiceService) {}

  @Input() showIdForm: boolean = false;
  @Output() closeForm = new EventEmitter<void>();
  showUpdateForm: boolean = false;

  idForm = new FormGroup({
    id: new FormControl('',Validators.required),
  });

  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    mobile_number: new FormControl('', Validators.required),
  });

  closeUpdateForm() {
    // Reset forms and hide the form
    this.showUpdateForm = false;
    this.showIdForm = false;
    this.profileForm.reset();
    this.idForm.reset();
    
    // Emit close event to parent component
    this.closeForm.emit();
    console.log('Update form closed via cross button.');
  }

  onIdInput() {
    const id = this.idForm.value.id;
    if (id) {
      this.userService.getUserById(id).subscribe({
        next: (user) => {
          if (user) {
            // User found, show update form and fill it
            this.showUpdateForm = true;
            this.fillForm(id);
          } else {
            alert('User not found');
          }
        },
        error: (error) => {
          console.error('Error fetching user:', error);
          alert('User not found');
        }
      });
    } else {
      alert('Please enter a valid User ID');
    }
  }

  fillForm(id:string){
    this.userService.getUserById(id).subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          address: user.address,
          mobile_number: user.mobile_number
        });
      } else {
        alert('User not found');
      }
    });
  }

  updateUser(){
    if (this.profileForm.valid) {
      const userData = this.profileForm.value;
      const id = this.idForm.value.id;
      
      const userDataWithId = { ...userData, id: id };
      
      this.userService.updateUser(userDataWithId).subscribe({
        next: () => {
          console.log('User updated successfully');
          
          this.showUpdateForm = false;
          this.showIdForm = false;
          this.profileForm.reset();
          this.idForm.reset();

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
