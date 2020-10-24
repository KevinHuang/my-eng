import { VocRecord } from './voc.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PracticeService {

  constructor() { }

  //
  getPracticesOfStage(stageID:string ): PracticeRecord[] {

  }

  getPractive(practiceID: string): PracticeRecord {
    //
    return new PracticeRecord();
  }


}

export class PracticeRecord {
  id: number ;
  ref_user_id: number;
  practice_time: Date ;
  items: PracticeItem[];
}

/** 代表一題練習題，
 *  裡面包含
 */
export class PracticeItem {
  ref_voc_id: VocRecord ;
  practiveType: string;   // 填充, 單選
  practiveTime: Date;
  isRight: boolean;
  answer: string;
}
