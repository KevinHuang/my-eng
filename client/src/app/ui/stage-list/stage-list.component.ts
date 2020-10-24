import { ActivatedRoute } from '@angular/router';
import { StageRecord, StageService } from './../../service/stage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stage-list',
  templateUrl: './stage-list.component.html',
  styleUrls: ['./stage-list.component.css']
})
export class StageListComponent implements OnInit {

  stages: StageRecord[];

  constructor(
    private stageService: StageService,
  ) { }

  ngOnInit(): void {
    this.stages = this.stageService.getStages();
  }

}
