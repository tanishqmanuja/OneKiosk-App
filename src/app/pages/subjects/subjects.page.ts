import {
  trigger,
  transition,
  query,
  style,
  stagger,
  animate,
  keyframes,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import {
  SubjectsItem,
  SubjectsService,
} from 'src/app/services/subjects.service';
import { titleShortener } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.page.html',
  styleUrls: ['./subjects.page.scss'],
  animations: [
    trigger('list', [
      transition('*=>*', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(
          ':enter',
          stagger(
            '100ms',
            animate(
              '320ms 50ms ease-out',
              keyframes([
                style({
                  opacity: 0,
                  transform: 'translateY(-20px)',
                  offset: 0,
                }),
                style({ opacity: 1, transform: 'translateY(0px)', offset: 1 }),
              ])
            )
          ),
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class SubjectsPage implements OnInit {
  selected$ = new BehaviorSubject(0);
  semcode: string = null;
  downloading = false;
  syncing = false;

  list$: Observable<string[]>;
  subjects$: Observable<SubjectsItem[]>;

  titleShortener = titleShortener;

  constructor(private subjectsService: SubjectsService) {}

  ngOnInit() {
    this.list$ = this.subjectsService.getList();

    this.subjects$ = combineLatest([
      this.getSemcode(),
      this.subjectsService.getSubjects(),
    ]).pipe(
      map(([semcode, sData]) => sData[semcode]),
      map((subjects) => {
        if (subjects) {
          return subjects.sort(
            (a, b) => parseInt(b.credits, 10) - parseInt(a.credits, 10)
          );
        }
      })
    );
  }

  getSemcode() {
    return combineLatest([this.list$, this.selected$]).pipe(
      map(([list, selected]) => list[selected]),
      tap((semcode) => (this.semcode = semcode))
    );
  }

  async changeSem(event: number) {
    if (event < 0) {
      this.syncing = true;
      await this.subjectsService.updateList();
      this.syncing = false;
      return;
    }
    this.selected$.next(event);
  }

  async fetchSemData() {
    this.downloading = true;
    if (!this.semcode) {
      await this.subjectsService.updateList();
    }
    await this.subjectsService.updateSubjects(this.semcode);
    this.downloading = false;
  }

  async doRefresh(event: any) {
    await this.subjectsService.updateSubjects(this.semcode);
    event.target.complete();
  }
}
