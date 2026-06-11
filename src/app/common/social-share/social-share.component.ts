import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { SettingService, Settings } from '../../shared/services/setting.service';

interface SocialLink {
    key: string;
    label: string;
    url: string;
    color: string;
    svg: SafeHtml;
}

@Component({
    selector: 'app-social-share',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './social-share.component.html',
    styleUrls: ['./social-share.component.scss']
})
export class SocialShareComponent implements OnInit, OnDestroy {
    isOpen = false;
    socialLinks: SocialLink[] = [];
    private subscription = new Subscription();

    private svgs: Record<string, string> = {
        facebook:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
        instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
        youtube:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="white" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
        whatsapp:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.428a.75.75 0 0 0 .916.916l5.628-1.479A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.534-5.197-1.458l-.372-.22-3.862 1.015 1.03-3.758-.242-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>`,
    };

    constructor(private settingService: SettingService, private sanitizer: DomSanitizer) {}

    ngOnInit() {
        this.subscription.add(
            this.settingService.getSettings().subscribe({
                next: (settings: Settings) => this.buildLinks(settings)
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private s(key: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(this.svgs[key]);
    }

    private buildLinks(settings: Settings) {
        const links: SocialLink[] = [];
        if (settings.facebook)  links.push({ key: 'facebook',  label: 'Facebook',  url: settings.facebook,  color: '#1877F2', svg: this.s('facebook') });
        if (settings.instagram) links.push({ key: 'instagram', label: 'Instagram', url: settings.instagram, color: '#E1306C', svg: this.s('instagram') });
        if (settings.youtube)   links.push({ key: 'youtube',   label: 'YouTube',   url: settings.youtube,   color: '#FF0000', svg: this.s('youtube') });
        if (settings.whatsapp) {
            const num = settings.whatsapp.replace(/\D/g, '');
            links.push({ key: 'whatsapp', label: 'WhatsApp', url: `https://wa.me/${num}`, color: '#25D366', svg: this.s('whatsapp') });
        }
        this.socialLinks = links;
    }

    toggleShare() {
        this.isOpen = !this.isOpen;
    }

    openLink(url: string) {
        window.open(url, '_blank', 'noopener');
        this.isOpen = false;
    }
}
