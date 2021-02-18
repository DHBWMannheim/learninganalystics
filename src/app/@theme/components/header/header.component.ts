import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { User, UserService } from '../../../@core/data/user.service';
import { LayoutService } from '../../../@core/utils/layout.service';
import { RippleService } from '../../../@core/utils/ripple.service';
import { MenuHelperService } from '../../menu-helper.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public readonly materialTheme$: Observable<boolean>;
  userPictureOnly: boolean = false;

  user: Observable<User | null>;

  themes = [
    {
      value: 'dhbw',
      name: 'DHBW'
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
    {
      value: 'material-light',
      name: 'Material Light',
    },
    {
      value: 'material-dark',
      name: 'Material Dark',
    },
  ];

  currentTheme = 'dhbw';

  userMenu = [
    {
      title: 'Log out',
      icon: 'log-out-outline',
      link: '/auth/logout',
    },
  ];

  languageMenu = [];

  public constructor(
    private readonly sidebarService: NbSidebarService,
    private readonly menuService: NbMenuService,
    private readonly themeService: NbThemeService,
    private readonly layoutService: LayoutService,
    private readonly breakpointService: NbMediaBreakpointsService,
    private readonly rippleService: RippleService,
    private readonly userService: UserService,
    private readonly translate: TranslateService,
    private readonly menuHelper: MenuHelperService,
  ) {
    this.materialTheme$ = this.themeService.onThemeChange().pipe(
      map((theme) => {
        const themeName: string = theme?.name || '';
        return themeName.startsWith('material');
      }),
    );
  }

  ngOnInit() {
    this.user = this.userService.userObservable;

    this.currentTheme = this.themeService.currentTheme;

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl),
      );

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe((themeName) => {
        this.currentTheme = themeName;
        this.rippleService.toggle(themeName?.startsWith('material'));
      });

    this.menuService
      .onItemClick()
      .pipe(filter(({ tag }) => tag === 'languageMenu'))
      .subscribe(({ item }) => {
        this.translate.use(item.title.toLowerCase());
        this.menuHelper.reloadMenu();
      });

    this.languageMenu = this.translate.getLangs().map((lang) => ({
      title: lang.toUpperCase(),
    }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  areNewMessagesAvailable() {
    return true; //TODO: Anstehende Klausuren, Todos, ...
  }
}
