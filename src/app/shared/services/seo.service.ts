import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

type FaqItem = {
    question: string;
    answer: string;
};

type SeoConfig = {
    title: string;
    description: string;
    image?: string;
    locale?: string;
    type?: string;
    canonicalPath?: string;
    faq?: FaqItem[];
};

@Injectable({ providedIn: 'root' })
export class SeoService {
    private readonly siteName = 'Mirag Academy';
    private readonly defaultSiteUrl = 'https://miragacademy.com';
    private readonly navigationItems = [
        { name: 'Home', url: '/' },
        { name: 'Pricing', url: '/pricing' },
        { name: 'Courses', url: '/courses' },
        { name: 'Teachers', url: '/teachers' },
        { name: 'Student Reviews', url: '/testimonials' },
        { name: 'About Us', url: '/about' },
        { name: 'Contact Us', url: '/contacts' },
        { name: 'Apply as a Teacher', url: '/teacher-application' }
    ];

    constructor(
        private title: Title,
        private meta: Meta,
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: object
    ) { }

    update(config: SeoConfig): void {
        const siteUrl = this.getSiteUrl();
        const canonicalPath = config.canonicalPath ?? '';
        const canonicalUrl = `${siteUrl}${canonicalPath}`;
        const pageType = config.type ?? 'website';
        const locale = config.locale ?? 'en_US';
        const image = config.image ?? `${siteUrl}/assets/images/full_logo.webp`;

        this.title.setTitle(config.title);
        this.meta.updateTag({ name: 'description', content: config.description });

        this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
        this.meta.updateTag({ property: 'og:title', content: config.title });
        this.meta.updateTag({ property: 'og:description', content: config.description });
        this.meta.updateTag({ property: 'og:type', content: pageType });
        this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
        this.meta.updateTag({ property: 'og:image', content: image });
        this.meta.updateTag({ property: 'og:image:secure_url', content: image });
        this.meta.updateTag({ property: 'og:locale', content: locale });

        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: config.title });
        this.meta.updateTag({ name: 'twitter:description', content: config.description });
        this.meta.updateTag({ name: 'twitter:image', content: image });

        this.updateCanonical(canonicalUrl);
        this.updateSiteSchema(siteUrl);
        this.updateFaqSchema(config.faq);
    }

    private updateCanonical(href: string): void {
        let link = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
        if (!link) {
            link = this.document.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.document.head.appendChild(link);
        }
        link.setAttribute('href', href);
    }

    private updateFaqSchema(faq?: FaqItem[]): void {
        const scriptId = 'seo-faq-schema';

        if (!faq || faq.length === 0) {
            this.removeJsonLd(scriptId);
            return;
        }

        this.updateJsonLd(scriptId, {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer
                }
            }))
        });
    }

    private updateSiteSchema(siteUrl: string): void {
        this.updateJsonLd('seo-site-schema', {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'Organization',
                    '@id': `${siteUrl}/#organization`,
                    name: this.siteName,
                    url: `${siteUrl}/`,
                    logo: `${siteUrl}/assets/images/full_logo.webp`,
                    image: `${siteUrl}/assets/images/full_logo.webp`,
                    description: 'Online Quran, Tajweed, Arabic language, and Islamic studies academy for kids and adults.'
                },
                {
                    '@type': 'WebSite',
                    '@id': `${siteUrl}/#website`,
                    name: this.siteName,
                    alternateName: ['Mirag Academy', 'miragacademy'],
                    url: `${siteUrl}/`,
                    publisher: {
                        '@id': `${siteUrl}/#organization`
                    }
                },
                {
                    '@type': 'ItemList',
                    '@id': `${siteUrl}/#site-navigation`,
                    name: 'Main site navigation',
                    itemListElement: this.navigationItems.map((item, index) => ({
                        '@type': 'SiteNavigationElement',
                        position: index + 1,
                        name: item.name,
                        url: `${siteUrl}${item.url === '/' ? '/' : item.url}`
                    }))
                }
            ]
        });
    }

    private updateJsonLd(id: string, data: object): void {
        let script = this.document.getElementById(id) as HTMLScriptElement | null;

        if (!script) {
            script = this.document.createElement('script');
            script.id = id;
            script.type = 'application/ld+json';
            this.document.head.appendChild(script);
        }

        script.text = JSON.stringify(data);
    }

    private removeJsonLd(id: string): void {
        const existingScript = this.document.getElementById(id);
        existingScript?.remove();
    }

    private getSiteUrl(): string {
        if (isPlatformBrowser(this.platformId)) {
            return window.location.origin;
        }

        const baseTag = this.document.querySelector('base');
        const href = baseTag?.getAttribute('href') || this.defaultSiteUrl;

        if (href.startsWith('/')) {
            return this.defaultSiteUrl;
        }

        return href.endsWith('/') ? href.slice(0, -1) : href;
    }
}
