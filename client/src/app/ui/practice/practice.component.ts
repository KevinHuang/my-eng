import { VocRecord, VocService } from './../../service/voc.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent implements OnInit {

  stageID = '';
  vocQuestions: VocRecord[] = [];
  currentIndex = -1;
  currentQ: VocRecord ;
  currentOptions: string[] = [];
  currentLang = 'zh';

  constructor(
    private route: ActivatedRoute,
    private vocService: VocService,
  ) { }

  ngOnInit(): void {
    // 1. 取得 stage ID
    this.route.params.subscribe(params => {
      // tslint:disable-next-line:no-string-literal
      // console.log(params);
      this.stageID = params['stageid'];

      // 2. 取得題目清單
      this.vocQuestions = this.randomQ(this.vocService.getVocs(this.stageID));
      // console.log(this.vocQuestions);
      this.setCurrentQ(0);

      // 3. 取得練習結果

      // console.log(this.stageID);
    });
  }

  randomQ(qs: VocRecord[]): VocRecord[] {
    if (qs) {
      return qs.sort( (x, y): number => {
        return 0.5 - Math.random();
      });
    } else {
      return qs ;
    }
  }

  setCurrentQ(qIndex) {
    this.currentIndex = qIndex;
    if ( this.vocQuestions.length > this.currentIndex ) {
      this.currentQ = this.vocQuestions[qIndex];
      const tempOptions: string[] = [this.currentQ.translate[this.currentLang]];
      // 從題目裡任取另外三題
    }
    // console.log(this.currentIndex);
    // console.log(this.currentQ);
  }

}
