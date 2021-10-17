import {
  trigger,
  transition,
  query,
  style,
  stagger,
  animate,
  keyframes,
} from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, Platform } from '@ionic/angular';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FacultyData, FacultyService } from 'src/app/services/faculty.service';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.page.html',
  styleUrls: ['./faculty.page.scss'],
  animations: [
    trigger('cardsAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(
          ':enter',
          stagger(
            '100ms',
            animate(
              '300ms 50ms ease-out',
              keyframes([
                style({ opacity: 0, transform: 'translateY(20px)', offset: 0 }),
                style({ opacity: 1, transform: 'translateY(0px)', offset: 1 }),
              ])
            )
          ),
          { optional: true }
        ),
      ]),
    ]),
    trigger('pop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.5)' }),
        animate('150ms ease-in', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate(
          '150ms ease-out',
          style({ opacity: 0, transform: 'scale(.5)' })
        ),
      ]),
    ]),
  ],
})
export class FacultyPage implements OnInit {
  @ViewChild(IonSearchbar, { static: true }) searchBar: IonSearchbar;
  @ViewChild(IonContent, { static: false }) content: IonContent;

  filteredFaculty$: Observable<FacultyData>;
  defaultImage = '../../../assets/webp/person.webp';

  isScrollTopNeeded = false;

  constructor(
    private facultyService: FacultyService,
    private platform: Platform
  ) {}

  ngOnInit() {
    const faculty$ = this.facultyService.getFaculty();

    const searchTerm$ = this.searchBar.ionChange.pipe(
      map((event) => (event.target as HTMLInputElement).value),
      startWith('')
    );

    this.filteredFaculty$ = combineLatest([faculty$, searchTerm$]).pipe(
      map(([faculty, searchTerm]) =>
        faculty.filter(
          (f) =>
            searchTerm === '' ||
            f.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.department.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  manageScroll(ev: any) {
    if (ev.detail.scrollTop > this.platform.height()) {
      this.isScrollTopNeeded = true;
    } else {
      this.isScrollTopNeeded = false;
    }
  }

  scrollTop() {
    this.content.scrollToTop(1000);
  }
}
