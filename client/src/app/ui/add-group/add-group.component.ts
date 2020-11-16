import { AddGroupConfirmDialogComponent } from './add-group-confirm-dialog/add-group-confirm-dialog.component';
import { GroupInfo, LearnGroupService } from './../../service/learn-group.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {

  groupCode = '';
  groups: GroupInfo[] = [];
  groupLabels = '';

  constructor(
    private groupService: LearnGroupService,
    private dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    await this.refreshGroup();
  }

  async refreshGroup(): Promise<void> {
    this.groups = await this.groupService.getMyGroups().toPromise();
    if (this.groups.length > 0) {
      this.groupLabels = '您的群組如下：';
    } else {
      this.groupLabels = '您尚未屬於任何群組，請輸入群組代碼來加入群組。';
    }
  }

  async addGroup(): Promise<void> {
    // console.log(this.groupCode);
    if (!this.groupCode) {
      return ;
    }
    await this.groupService.joinGroup(this.groupCode).toPromise();
    this.groupCode = '';
    await this.refreshGroup();
  }

  removeGroup(grp: GroupInfo): void {
    // console.log(grp);
    this.openDialog(grp);
  }

  openDialog(grp: GroupInfo): void {
    const dialogRef = this.dialog.open(AddGroupConfirmDialogComponent, {
      width: '300px',
      data: grp
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      if (result) {
        this.groupService.removeGroup(result.id).subscribe( r => {
          this.refreshGroup().then();
        });
      }
    });
  }

}
