import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';

import { User } from '../../../@core/data/user';
import { LayoutService } from '../../../@core/utils';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { RippleService } from '../../../@core/utils/ripple.service';
import { NbAuthService } from '@nebular/auth';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public readonly materialTheme$: Observable<boolean>;
  userPictureOnly: boolean = false;

  user: User;

  themes = [
    {
      value: 'default',
      name: 'Light',
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

  currentTheme = 'default';

  userMenu = [
    {
      title: 'Profile',
      icon: 'person-outline',
      link: '/pages/profile',
    },
    {
      title: 'Log out',
      icon: 'log-out-outline',
      link: '/auth/logout'
    },
  ];

  public constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private rippleService: RippleService,
    private authService: NbAuthService,
    private router: Router,
    private firebaseAuth: AngularFireAuth,
  ) {
    this.materialTheme$ = this.themeService.onThemeChange().pipe(
      map((theme) => {
        const themeName: string = theme?.name || '';
        return themeName.startsWith('material');
      }),
    );
  }

  ngOnInit() {
    this.firebaseAuth.authState.subscribe((authState) => {
      this.user = authState && {
        name: authState.displayName || 'Anonymous User',
        picture: authState.photoURL,
      };
    });

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
