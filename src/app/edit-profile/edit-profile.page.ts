import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss']
})
export class EditProfilePage implements OnInit {
  editNameClicked = false;
  constructor() {}

  ngOnInit() {}

  onEditName() {
    this.editNameClicked = true;
  }

  onNameCancel() {
    this.editNameClicked = false;
  }

  onUpdateName() {
    console.log('Update Name Clicked');
  }
}
