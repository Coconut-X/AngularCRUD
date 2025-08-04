import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserServiceService } from '../user-service.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { Observable, forkJoin } from 'rxjs';
import { get } from 'http';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, AddUserComponent, CommonModule, FormsModule, UpdateUserComponent],
  templateUrl: './home.component.html',
  styleUrl: './home-new.component.scss', 
  standalone: true,
})
export class HomeComponent { 

  atleastOneUserSelected: boolean = false;
  allUsersSelected: boolean = false; // Track select all checkbox state
  exactlyOneUserSelected: boolean = false; // Track if exactly one user is selected

  showAddUserForm: boolean = false;
  showUpdateUserForm: boolean = false;
  showUserList: boolean = true;
  isEmpty: boolean = true;
 
  makeHomeDull: boolean = false;
  totalUsers = 0;

  users: any[] = [];
  filteredUsers: any[] = []; // For search functionality
  searchKeyword: string = ''; // Search input

  selectedUsers: string[] = []; 
  selectedUserForUpdate: any = null; 

  onSearch() {
    if (this.searchKeyword.trim() === '') {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user => 
        user.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        user.address.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        user.mobile_number.includes(this.searchKeyword) ||
        user.id.toString().includes(this.searchKeyword) ||
        (user.email && user.email.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
        (user.description && user.description.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
        (user.telephone && user.telephone.includes(this.searchKeyword))
      );
    }
  }

selectAll(event: any) {
  this.allUsersSelected = event.target.checked;
  
  if(this.allUsersSelected) {
    this.selectedUsers = [];
    this.users.forEach(user => {
      this.selectedUsers.push(user.id);
    });
  } else {

    this.selectedUsers = [];
  }
  
  this.updateSelectAllState();
  console.log("Select all toggled. Selected users:", this.selectedUsers);
}

  updateSelectAllState() {
    this.allUsersSelected = this.users.length > 0 && this.selectedUsers.length === this.users.length;
    this.atleastOneUserSelected = this.selectedUsers.length > 0;
    this.exactlyOneUserSelected = this.selectedUsers.length === 1;
    
    if (this.exactlyOneUserSelected) {
      const selectedUserId = this.selectedUsers[0];
      this.selectedUserForUpdate = this.users.find(user => user.id === selectedUserId);
    } else {
      this.selectedUserForUpdate = null;
    }
  }

  getTotalUsersCount(): Observable<number> {
    return this.userService.countUsers();
  }

  onCheckBoxChange(event: any, userId: string) {
    if (event.target.checked) {
      this.addToSelected(userId);
    } else {
      this.removeFromSelected(userId);
    }
  }

  toggleUpdateUserForm() {
    console.log("Toggling update user form visibility.");
    if (this.exactlyOneUserSelected && this.selectedUserForUpdate) {
      this.showUpdateUserForm = true;
      this.makeHomeDull = true;
    } else {
      alert('Please select exactly one user to update.');
    }
  }

  handleUpdateFormClose() {
    this.showUpdateUserForm = false;
    this.makeHomeDull = false;
    this.fetchUsers();
    console.log('Update form closed, user list refreshed.');
  }

  addToSelected(userId: string) {
    if (!this.selectedUsers.includes(userId)) {
      this.selectedUsers.push(userId);
    }
    this.updateSelectAllState();
    console.log("Selected users:", this.selectedUsers);
  } 

  removeFromSelected(userId: string) {
      const index = this.selectedUsers.indexOf(userId);
      if (index > -1) {
        this.selectedUsers.splice(index, 1);
      }
      this.updateSelectAllState();
      console.log("Selected users after removal:", this.selectedUsers);
  }

  deleteSelectedUsers() {
    console.log("Deleting selected users:", this.selectedUsers);
    if(this.selectedUsers.length > 0) {
      // Create an array of delete observables
      const deleteObservables = this.selectedUsers.map(userId => 
        this.userService.deleteUser(userId)
      );
      
      // Use forkJoin to wait for all delete operations to complete
      forkJoin(deleteObservables).subscribe({
        next: (results) => {
          console.log("All users deleted successfully:", results);
          this.selectedUsers = [];
          this.fetchUsers(); // Refresh the user list after all deletions
        },
        error: (error) => {
          console.error("Error during delete operations:", error);
          this.selectedUsers = [];
          this.fetchUsers(); // Refresh even if there were errors
        }
      });
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
      this.filteredUsers = [...data]; // Initialize filtered users
      console.log("Users fetched:", this.users);
      
      // Check if the list is empty AFTER the data is received
      if(this.users.length === 0) {
        this.isEmpty = true;
        this.selectedUsers = [];
        this.allUsersSelected = false;
        this.atleastOneUserSelected = false;
      } else {
        this.isEmpty = false;
        // Update select all state based on current selections
        this.updateSelectAllState();
      }
    });
  }

  toggleAddUserForm() {
    this.showAddUserForm = !this.showAddUserForm;
    this.makeHomeDull = this.showAddUserForm;
  }
} 
