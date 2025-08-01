import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserServiceService } from '../user-service.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { CommonModule } from '@angular/common';
import { UpdateUserComponent } from '../update-user/update-user.component';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, AddUserComponent, CommonModule, UpdateUserComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss', 
  standalone: true,
})
export class HomeComponent {

  showAddUserForm: boolean = false;
  showUpdateUserForm: boolean = false;
  showUserList: boolean = true;
  isEmpty: boolean = true;
 
  makeHomeDull: boolean = false;

  users: any[] = [];

  selectedUsers: string[] = []; //store selected users ids


  onCheckBoxChange(event: any, userId: string) {
    if (event.target.checked) {
      this.addToSelected(userId);
    } else {
      this.removeFromSelected(userId);
    }
  }

  toggleUpdateUserForm() {
    console.log("Toggling update user form visibility.");
    this.showUpdateUserForm = true;
    this.makeHomeDull = true;
  }

  handleUpdateFormClose() {
    this.showUpdateUserForm = false;
    this.makeHomeDull = false;
    this.fetchUsers(); // Refresh the user list after updating
    console.log('Update form closed, user list refreshed.');
  }

  addToSelected(userId: string) {
    if (!this.selectedUsers.includes(userId)) {
      this.selectedUsers.push(userId);
    }

    console.log("Selected users:", this.selectedUsers);
  } 

  removeFromSelected(userId: string) {
      const index = this.selectedUsers.indexOf(userId);
      if (index > -1) {
        this.selectedUsers.splice(index, 1);
      }

      console.log("Selected users after removal:", this.selectedUsers);
  }

  deleteSelectedUsers() {
    console.log("Deleting selected users:", this.selectedUsers);
    if(this.selectedUsers.length > 0) {
      for(const userId of this.selectedUsers) {
        this.userService.deleteUser(userId).subscribe(() => {
          console.log(`User with ID ${userId} deleted successfully.`);
          this.fetchUsers(); // Refresh the user list after deletion
        }, error => {
          console.error(`Error deleting user with ID ${userId}:`, error);
        });
      }
      this.selectedUsers = [];
    }
  }

  //use service to fetch users
  constructor(private userService: UserServiceService) {}
  ngOnInit() {
    this.fetchUsers();
  }

  handleFormClose() {
    this.showAddUserForm = false;
    this.makeHomeDull = false;
    this.fetchUsers(); // Refresh the user list after adding a new user
    console.log('Form closed, user list refreshed.');
  }

  fetchUsers() {
    console.log("Fetching users...");
    this.userService.getUsers().subscribe((data: any[]) => {
      this.users = data;
      console.log("Users fetched:", this.users);
      
      // Check if the list is empty AFTER the data is received
      if(this.users.length === 0) {
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
    });
  }

  toggleAddUserForm() {
    this.showAddUserForm = !this.showAddUserForm;
    this.makeHomeDull = this.showAddUserForm;
  }
} 
