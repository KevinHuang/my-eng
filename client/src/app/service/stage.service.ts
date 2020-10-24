import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StageService {

  constructor() { }


  getStages(): StageRecord[] {
    return [
      {id: 111, title: 'Lession 1', subtitle: '這是副標題', description: '這是說明', vocCount: 10, phraseCount: 10, grammerCount: 10},
      {id: 222, title: 'Lession 2', subtitle: '這是副標題', description: '這是說明', vocCount: 10, phraseCount: 10, grammerCount: 10},
      {id: 333, title: 'Lession 3', subtitle: '這是副標題', description: '這是說明', vocCount: 10, phraseCount: 10, grammerCount: 10},
      {id: 444, title: 'Lession 4', subtitle: '這是副標題', description: '這是說明', vocCount: 10, phraseCount: 10, grammerCount: 10},
      {id: 555, title: 'Lession 5', subtitle: '這是副標題', description: '這是說明', vocCount: 10, phraseCount: 10, grammerCount: 10},
      {id: 666, title: 'Lession 6', subtitle: '這是副標題', description: '這是說明', vocCount: 10, phraseCount: 10, grammerCount: 10},
      {id: 777, title: 'Lession 7', subtitle: '這是副標題', description: '這是說明', vocCount: 10, phraseCount: 10, grammerCount: 10},
    ];
  }

}


export class StageRecord {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  vocCount: number;
  phraseCount: number;
  grammerCount: number;
}
