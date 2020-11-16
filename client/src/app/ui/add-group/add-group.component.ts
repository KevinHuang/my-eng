import { GroupInfo, LearnGroupService } from './../../service/learn-group.service';
import { Component, OnInit } from '@angular/core';

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
    console.log(this.groupCode);
    await this.groupService.joinGroup(this.groupCode).toPromise();
    await this.refreshGroup();
  }

  removeGroup(grp: GroupInfo): void {
    console.log(grp);
  }

}
