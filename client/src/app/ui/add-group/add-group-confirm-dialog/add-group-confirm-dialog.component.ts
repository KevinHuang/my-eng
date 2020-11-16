import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupInfo } from 'src/app/service/learn-group.service';

/** Material Dialog 參考文件：https://www.ahmedbouchefra.com/angular-material-modal/ */


@Component({
  selector: 'app-add-group-confirm-dialog',
  templateUrl: './add-group-confirm-dialog.component.html',
  styleUrls: ['./add-group-confirm-dialog.component.css']
})
export class AddGroupConfirmDialogComponent implements OnInit {

  grp: GroupInfo ;

  constructor(
    public dialogRef: MatDialogRef<AddGroupConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GroupInfo
  ) { }

  ngOnInit(): void {
    this.grp = this.data ;
    console.log(this.grp);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

