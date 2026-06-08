import { NgClass, NgIf, CommonModule } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { auditTime } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrnamentCornersComponent } from '../../shared/components/ornament-corners/ornament-corners.component';

interface NavbarItem {
    label: string;
    route?: string;
    children?: Array<{
        label: string;
        route: string;
    }>;
}

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        NgIf,
        NgClass,
        TranslateModule,
        OrnamentCornersComponent,
    ],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
    isCollapsed = true;
    isSticky: boolean = false;
    currentLanguage: string = 'en';
    private subscriptions = new Subscription();
    menuItems: NavbarItem[] = [
        {
            label: 'HOME',
            route: '/'
        },
        {
            label: 'Courses',
            route: '/courses'
        },
        {
            label: 'Pricing',
            route: '/pricing'
        },
        {
            label: 'TEACHERS',
            route: '/teachers'
        },
        {
            label: 'TESTIMONIALS',
            route: '/testimonials'
        },
        {
            label: 'About Us',
            route: '/about'
        },
        // {
        //     label: 'More',
        //     children: [
        //         {
        //             label: 'Articles',
        //             route: '/posts'
        //         },
        //         {
        //             label: 'MEDIA_GALLERY.TITLE',
        //             route: '/media'
        //         },
        //         {
        //             label: 'Certificates',
        //             route: '/certificates'
        //         },
        //     ],
        // },
    ];
    languages = [
        {
            code: 'en',
            name: 'English',
            flag: 'ðŸ‡ºðŸ‡¸'
        },
        {
            code: 'ar',
            name: 'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©',
            flag: 'ðŸ‡¸ðŸ‡¦'
        }
    ];

    constructor(
        public router: Router,
        private translate: TranslateService,
        private ngZone: NgZone
    ) {
        this.translate.addLangs(['en']);
        this.translate.setDefaultLang('en');
        this.translate.use('en');
        this.currentLanguage = 'en';
        this.applyLanguageDirection('en');
    }

    ngOnInit(): void {
        this.ngZone.runOutsideAngular(() => {
            this.subscriptions.add(
                fromEvent(window, 'scroll', { passive: true })
                    .pipe(auditTime(100))
                    .subscribe(() => {
                        const isSticky = this.getScrollPosition() >= 50;

                        if (isSticky !== this.isSticky) {
                            this.ngZone.run(() => {
                                this.isSticky = isSticky;
                            });
                        }
                    })
            );
        });
        this.subscriptions.add(
            this.translate.onLangChange.subscribe((event) => {
                this.currentLanguage = event.lang;
                this.applyLanguageDirection(event.lang);
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private getScrollPosition(): number {
        return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }

    switchLanguage(lang: string) {
        this.translate.use(lang);
        this.currentLanguage = lang;
        this.applyLanguageDirection(lang);
        localStorage.setItem('language', lang);
        this.isCollapsed = true;
    }

    getCurrentLanguage(): string {
        return this.currentLanguage || this.translate.getDefaultLang();
    }

    getCurrentLanguageData() {
        return this.languages.find(lang => lang.code === this.currentLanguage) || this.languages[0];
    }

    isMenuItemActive(item: NavbarItem): boolean {
        if (item.route) {
            return item.route === '/'
                ? this.router.url === '/'
                : this.router.url.startsWith(item.route);
        }

        return item.children?.some(child => this.router.url.startsWith(child.route)) || false;
    }

    private applyLanguageDirection(lang: string) {
        const htmlElement = document.documentElement;
        const bodyElement = document.body;

        if (lang === 'ar') {
            htmlElement.setAttribute('dir', 'rtl');
            htmlElement.setAttribute('lang', 'ar');
            bodyElement.classList.add('rtl');
            bodyElement.classList.remove('ltr');
        } else {
            htmlElement.setAttribute('dir', 'ltr');
            htmlElement.setAttribute('lang', 'en');
            bodyElement.classList.add('ltr');
            bodyElement.classList.remove('rtl');
        }
    }
    closeMobileMenu() {
        this.isCollapsed = true;
    }
    toggleMobileMenu() {
        this.isCollapsed = !this.isCollapsed;
    }
}

