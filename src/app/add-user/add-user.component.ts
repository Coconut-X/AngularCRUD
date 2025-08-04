import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormControl, FormGroup, Validators} from '@angular/forms';
import { UserServiceService } from '../user-service.service';
@Component({
  selector: 'add-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
  standalone: true,
})
export class AddUserComponent {

  constructor(public userService: UserServiceService) {}

  @Input() isVisible: boolean = false;

  @Output() close = new EventEmitter<void>();

    profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobile_number: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    description: new FormControl(''),
    telephone: new FormControl(''),
  });

  cancelForm(){
    this.isVisible = false;
    this.close.emit();
    this.profileForm.reset();
    console.log("Add User form cancelled.");
  }

  submitForm(){

    if(this.profileForm.valid) {
      const userData = this.profileForm.value;
      console.log("Submitting user data:", userData);
      this.userService.addUser(userData).subscribe(() => {
        console.log("User added successfully.");
        this.isVisible = false;
        this.close.emit();
        this.profileForm.reset();
      }, error => {
        console.error("Error adding user:", error);
      });
    }

  }
} 
 