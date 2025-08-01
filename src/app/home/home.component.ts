import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserServiceService } from '../user-service.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, AddUserComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss', 
  standalone: true,
})
export class HomeComponent {

  showAddUserForm: boolean = false;
  showUserList: boolean = true;
  isEmpty: boolean = true;

  users: any[] = [];

  selectedUsers: string[] = []; //store selected users ids


  onCheckBoxChange(event: any, userId: string) {
    if (event.target.checked) {
      this.addToSelected(userId);
    } else {
      this.removeFromSelected(userId);
    }
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

    this.fetchUsers(); // Refresh the user list after adding a new user
    console.log('Form closed, user list refreshed.');
  }

  fetchUsers() {
    console.log("Fetching users...");
    this.userService.getUsers().subscribe((data: any[]) => {
      this.users = data;
      console.log("Users fetched:", this.users);
    });

    if(this.users.length === 0) {
      this.isEmpty = true;
    } else {
      this.isEmpty = false;
    }
  }

  toggleAddUserForm() {
    this.showAddUserForm = !this.showAddUserForm;
  }
} 
