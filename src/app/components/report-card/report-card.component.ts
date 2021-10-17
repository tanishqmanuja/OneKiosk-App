import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Marks, ReportsItem } from 'src/app/services/report.service';
import { titleShortener } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportCardComponent implements OnInit {
  @Input() data: ReportsItem;

  constructor() { }

  ngOnInit() {}

  get title() {
    return titleShortener(this.data.course.name,14);
  }

  get valid(): boolean {
    return this.data && (Object.keys(this.data.marks).length>0);
  }

  get isGradeLow() {
    if(!this.data.grade) return false;
    if(['A+','A','B+'].includes(this.data.grade)) return false;
    return true;
  }


  examName(str: string){
    str = str.substring(0,str.lastIndexOf('('));

    const isT1 = (s: string) => !!s.match(/T.*1/g) && !s.match(/2/g);
    const isT2 = (s: string) => !!s.match(/T.*2/g);
    const isMid = (s: string) => !!s.match(/MID/g);
    const isEnd = (s: string) => !!s.match(/END|FINAL/g);
    const isViva = (s: string) => !!s.match(/V(.*)?A/g);
    const isSeminar = (s: string) => !!s.match(/SEMINAR/g);
    const isReport = (s: string) => !!s.match(/REPORT/g);


    if(isEnd(str) && isSeminar(str)) return 'ES';
    if(isMid(str) && isSeminar(str)) return 'MS';
    if(isReport(str)) return 'RP';
    if(isEnd(str) && isViva(str)) return 'EV';
    if(isMid(str) && isViva(str)) return 'MV';
    if(isViva(str)) return 'VA';
    if(isEnd(str)) return 'ET';
    if(isMid(str)) return 'MT';
    if(isT2(str)) return 'T2';
    if(isT1(str)) return 'T1';

    return str.substring(0,2);
  }


  maxMarks(str: string){
    return parseInt(str.substring(
      str.lastIndexOf('(') + 1,
      str.lastIndexOf(')')
    ), 10);
  }

  marksPercentage(key: string,value: string){
    return 100 * parseInt(value,10) / this.maxMarks(key);
  }

  totalPercentage(marks: Marks){
    const summer = (a: number, b: number) => a + b;
    const sum = Object.values(marks).map(x => parseInt(x,10)).reduce(summer);
    const max = Object.keys(marks).map(this.maxMarks).reduce(summer);
    return Math.floor(100 * sum / max);
  }

}
