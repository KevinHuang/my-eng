import { TopicInfo, QuizService } from './../../service/quiz.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stage-list',
  templateUrl: './stage-list.component.html',
  styleUrls: ['./stage-list.component.css']
})
export class StageListComponent implements OnInit {

  topics: TopicInfo[];
  groups: string[] = [];
  dicTopicsByGroup: {[grpName: string]: TopicInfo[]} = {};

  constructor(
    private quizService: QuizService ,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // tslint:disable-next-line:typedef
  async ngOnInit() {
    this.topics = await this.quizService.getMyTopics().toPromise();
    this.parseTopics();
  }

  parseTopics(): void {
    this.groups = [];
    this.dicTopicsByGroup = {};
    this.topics.forEach(topic => {
      if (!this.dicTopicsByGroup[topic.group_name]) {
        this.dicTopicsByGroup[topic.group_name] = [];
        this.groups.push(topic.group_name);
      }
      this.dicTopicsByGroup[topic.group_name].push(topic);
    });
  }

  showTopic(topic: TopicInfo): void {
    console.log(topic);
    this.router.navigate([ topic.topic_uuid ], { relativeTo: this.route });
  }

}
