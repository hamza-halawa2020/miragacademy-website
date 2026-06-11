import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription, filter } from 'rxjs';

@Component({
    selector: 'app-social-share',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './social-share.component.html',
    styleUrls: ['./social-share.component.scss']
})
export class SocialShareComponent implements OnInit, OnDestroy {
    isOpen = false;
    linkCopied = false;
    private subscription = new Subscription();

    shareOptions: { key: string; color: string; svg: SafeHtml }[] = [];

    constructor(
        private router: Router,
        private translate: TranslateService,
        private sanitizer: DomSanitizer
    ) {
        this.shareOptions = [
            {
                key: 'Facebook', color: '#1877F2',
                svg: this.sanitizer.bypassSecurityTrustHtml(
                    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>`
                )
            },
            {
                key: 'WhatsApp', color: '#25D366',
                svg: this.sanitizer.bypassSecurityTrustHtml(
                    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.428a.75.75 0 0 0 .916.916l5.628-1.479A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.534-5.197-1.458l-.372-.22-3.862 1.015 1.03-3.758-.242-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>`
                )
            },
            {
                key: 'Twitter', color: '#1DA1F2',
                svg: this.sanitizer.bypassSecurityTrustHtml(
                    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                    </svg>`
                )
            },
            {
                key: 'Email', color: '#EA4335',
                svg: this.sanitizer.bypassSecurityTrustHtml(
                    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>`
                )
            },
        ];
    }

    ngOnInit() {
        this.subscription.add(
            this.router.events.pipe(filter(e => e instanceof NavigationEnd))
                .subscribe(() => this.isOpen = false)
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    @HostListener('document:keydown.escape')
    onEscape() {
        this.isOpen = false;
    }

    toggleShare() {
        this.isOpen = !this.isOpen;
        this.linkCopied = false;
    }

    share(key: string) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);

        const urls: Record<string, string> = {
            Facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            WhatsApp: `https://wa.me/?text=${title}%20${url}`,
            Twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
            Email: `mailto:?subject=${title}&body=${url}`,
        };

        const link = urls[key];
        if (link) {
            if (key === 'Email') {
                window.location.href = link;
            } else {
                window.open(link, '_blank', 'noopener,width=600,height=400');
            }
            this.isOpen = false;
        }
    }
}
