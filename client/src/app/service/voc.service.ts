import { getLocaleDateFormat } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VocService {

  constructor() { }

  getVocs(stageID: string): VocRecord[] {
    return VocMockSource.getData();
  }
}


export class VocRecord {
  id: number ;
  content: string;
  pronunce: string;
  translate: { [langType: string]: string};
}

class VocMockSource {
  public static getData(): VocRecord[] {
    return [
      { id: 1, content: 'family', pronunce: '', translate: { zh: '家人'}},
      { id: 2, content: 'father', pronunce: '', translate: { zh: '父親'}},
      { id: 3, content: 'mother', pronunce: '', translate: { zh: '母親'}},
      { id: 4, content: 'brother', pronunce: '', translate: { zh: '兄弟'}},
      { id: 4, content: 'sister', pronunce: '', translate: { zh: '姐妹'}}
    ];
  }
}
