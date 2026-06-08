import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MainSlider } from '../../common/main-slider/main-slider.component';
import { HowItWorksComponent } from '../../common/how-it-works/how-it-works.component';
import { ServicesSectionComponent } from './components/services-section/services-section.component';
import { StatsSectionComponent } from './components/stats-section/stats-section.component';
import { TestimonialsSectionComponent } from './components/testimonials-section/testimonials-section.component';
import { LatestPostsSectionComponent } from './components/latest-posts-section/latest-posts-section.component';
import { CertificatesSectionComponent } from './components/certificates-section/certificates-section.component';
import { MediaGallerySectionComponent } from './components/media-gallery-section/media-gallery-section.component';
import { HeroBannerSectionComponent } from './components/hero-banner-section/hero-banner-section.component';
import { PaymentMethodsComponent } from '../../common/payment-methods/payment-methods.component';
import { ContactComponent } from '../../common/contact/contact.component';
import { HomeService, HomeData } from './home.service';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { LearningBenefitsSectionComponent } from './components/learning-benefits-section/learning-benefits-section.component';
import { TeachersSectionComponent } from './components/teachers-section/teachers-section.component';
import { SeoService } from '../../shared/services/seo.service';

type IdleWindow = Window & {
    requestIdleCallback?: (callback: (_deadline: unknown) => void, options?: { timeout: number }) => number;
    cancelIdleCallback?: (handle: number) => void;
};

@Component({
    selector: 'app-home-demo-one',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        TranslateModule,
        MainSlider,
        HowItWorksComponent,
        ServicesSectionComponent,
        StatsSectionComponent,
        TestimonialsSectionComponent,
        LatestPostsSectionComponent,
        CertificatesSectionComponent,
        MediaGallerySectionComponent,
        HeroBannerSectionComponent,
        PaymentMethodsComponent,
        ContactComponent,
        ScrollRevealDirective,
        LearningBenefitsSectionComponent,
        TeachersSectionComponent,
    ],
    templateUrl: './home-demo-one.component.html',
    styleUrl: './home-demo-one.component.scss',
})
export class HomeDemoOneComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('homeDataTrigger')
    private homeDataTrigger?: ElementRef<HTMLElement>;

    homeData: HomeData | null = null;
    isLoading = false;
    error: string | null = null;
    private homeDataSubscription?: Subscription;
    private removeLoadListener?: () => void;
    private idleCallbackId: number | null = null;
    private idleTimeoutId: number | null = null;
    private hasRequestedHomeData = false;
    private homeDataObserver?: IntersectionObserver;
    private languageSubscription?: Subscription;
    seoFaqItems: Array<{ question: string; answer: string }> = [];
    whyUsItems = [
        {
            icon: 'fa-solid fa-user',
            title: 'Expert Native Arabic Tutors',
            description: 'Learn with qualified teachers who explain Quran, Tajweed, Arabic, and Islamic studies clearly.'
        },
        {
            icon: 'fa-solid fa-check',
            title: 'One-to-One Learning',
            description: 'Private classes built around the learner’s age, level, pace, and personal learning goal.'
        },
        {
            icon: 'fa-solid fa-chalkboard-user',
            title: 'Certified Tutors',
            description: 'We have expert Male and Female teachers who are fluent in English and they are Arabic native speakers , graduated from Al-Azhar university in Cairo,and Al Madina university in Saudi Arabia Kingdom and have Ijazaah in Quran.'
        },
        {
            icon: 'fa-solid fa-video',
            title: 'Live Online Classes',
            description: 'Interactive online sessions from home with flexible scheduling for busy families.'
        },
        {
            icon: 'fa-solid fa-hand-holding-heart',
            title: 'Support 24/7',
            description: 'Our team helps you choose the suitable teacher, plan, and schedule before enrollment.'
        },
        {
            icon: 'fa-solid fa-star-and-crescent',
            title: 'Spiritual Journey',
            description: 'A calm and encouraging environment that connects knowledge with purpose and adab.'
        },
    ];
    expertiseItems = [
        'Easy communication with teachers who can support English-speaking learners.',
        'Programs for kids, adults, beginners, and advanced students.',
        'Quran recitation, memorization, Tajweed, Arabic, and Islamic studies in one place.',
        'Flexible weekly plans connected with clear monthly pricing.',
        'Female teachers available for sisters and young learners when needed.',
        'Fun, engaging learning with practical homework and progress notes.',
    ];

    defaultStats = {
        completedStudies: 50,  // Students graduated
        satisfiedClients: 500,  // Active students
        yearsExperience: 20000,     // Years of teaching excellence
        successPartners: 90      // qualified teachers
    };

    constructor(
        public translate: TranslateService,
        private homeService: HomeService,
        private ngZone: NgZone,
        private seoService: SeoService
    ) { }

    ngOnInit(): void {
        this.applySeoContent();
        this.languageSubscription = this.translate.onLangChange.subscribe(() => this.applySeoContent());

        if (typeof window === 'undefined') {
            this.loadHomeData();
        }
    }

    ngAfterViewInit(): void {
        if (typeof window !== 'undefined') {
            this.scheduleHomeDataLoad();
        }
    }

    ngOnDestroy(): void {
        this.homeDataObserver?.disconnect();
        this.removeLoadListener?.();
        this.homeDataSubscription?.unsubscribe();
        this.languageSubscription?.unsubscribe();

        if (typeof window === 'undefined') {
            return;
        }

        const idleWindow = window as IdleWindow;
        if (this.idleCallbackId !== null) {
            idleWindow.cancelIdleCallback?.(this.idleCallbackId);
            this.idleCallbackId = null;
        }

        if (this.idleTimeoutId !== null) {
            window.clearTimeout(this.idleTimeoutId);
            this.idleTimeoutId = null;
        }
    }

    loadHomeData(): void {
        this.hasRequestedHomeData = true;
        this.isLoading = true;
        this.error = null;

        this.homeDataSubscription?.unsubscribe();
        this.homeDataSubscription = this.homeService.getHomeData().subscribe({
            next: (data) => {
                if (!this.homeData) {
                    this.homeData = {
                        stats: this.defaultStats,
                        latestWorkSamples: [],
                        teamMembers: [],
                        testimonials: [],
                        latestPosts: [],
                        latestCourses: [],
                        courseCategories: [],
                        certificates: [],
                        partners: [],
                        mediaItems: []
                    };
                }

                if (data.stats) {
                    this.homeData.stats = data.stats;
                }
                if (data.testimonials && data.testimonials.length > 0) {
                    this.homeData.testimonials = data.testimonials;
                }
                if (data.partners && data.partners.length > 0) {
                    this.homeData.partners = data.partners;
                }
                if (data.latestWorkSamples && data.latestWorkSamples.length > 0) {
                    this.homeData.latestWorkSamples = data.latestWorkSamples;
                }
                if (data.teamMembers && data.teamMembers.length > 0) {
                    this.homeData.teamMembers = data.teamMembers;
                }
                if (data.latestPosts && data.latestPosts.length > 0) {
                    this.homeData.latestPosts = data.latestPosts;
                }
                if (data.latestCourses && data.latestCourses.length > 0) {
                    this.homeData.latestCourses = data.latestCourses;
                }
                if (data.courseCategories && data.courseCategories.length > 0) {
                    this.homeData.courseCategories = data.courseCategories;
                }
                if (data.certificates && data.certificates.length > 0) {
                    this.homeData.certificates = data.certificates;
                }
                if (data.mediaItems && data.mediaItems.length > 0) {
                    this.homeData.mediaItems = data.mediaItems;
                }

                this.isLoading = false;
            },
            error: (error) => {
                
                if (!this.homeData) {
                    this.homeData = {
                        stats: this.defaultStats,
                        latestWorkSamples: [],
                        teamMembers: [],
                        testimonials: [],
                        latestPosts: [],
                        latestCourses: [],
                        courseCategories: [],
                        certificates: [],
                        partners: [],
                        mediaItems: []
                    };
                }
                this.isLoading = false;
            }
        });
    }

    retryLoadData(): void {
        this.clearScheduledHomeDataLoad();
        this.hasRequestedHomeData = false;
        this.loadHomeData();
    }

    private scheduleHomeDataLoad(): void {
        if (typeof window === 'undefined') {
            this.loadHomeData();
            return;
        }

        const triggerElement = this.homeDataTrigger?.nativeElement;
        if (!triggerElement || typeof IntersectionObserver !== 'function') {
            this.scheduleFallbackHomeDataLoad();
            return;
        }

        this.ngZone.runOutsideAngular(() => {
            this.homeDataObserver = new IntersectionObserver((entries) => {
                if (!entries.some((entry) => entry.isIntersecting || entry.intersectionRatio > 0)) {
                    return;
                }

                this.homeDataObserver?.disconnect();
                this.homeDataObserver = undefined;

                if (this.hasRequestedHomeData) {
                    return;
                }

                this.ngZone.run(() => {
                    this.loadHomeData();
                });
            }, {
                rootMargin: '500px 0px 900px',
                threshold: 0,
            });

            this.homeDataObserver.observe(triggerElement);
        });
    }

    private scheduleFallbackHomeDataLoad(): void {
        this.ngZone.runOutsideAngular(() => {
            const startLoading = () => {
                if (this.hasRequestedHomeData) {
                    return;
                }

                this.ngZone.run(() => {
                    this.loadHomeData();
                });
            };

            const queueIdleLoad = () => {
                this.removeLoadListener?.();

                const idleWindow = window as IdleWindow;
                if (typeof idleWindow.requestIdleCallback === 'function') {
                    this.idleCallbackId = idleWindow.requestIdleCallback(() => {
                        this.idleCallbackId = null;
                        startLoading();
                    }, { timeout: 1500 });
                    return;
                }

                this.idleTimeoutId = window.setTimeout(() => {
                    this.idleTimeoutId = null;
                    startLoading();
                }, 600);
            };

            if (document.readyState === 'complete') {
                queueIdleLoad();
                return;
            }

            const onWindowLoad = () => {
                queueIdleLoad();
            };

            window.addEventListener('load', onWindowLoad, { once: true });
            this.removeLoadListener = () => {
                window.removeEventListener('load', onWindowLoad);
                this.removeLoadListener = undefined;
            };
        });
    }

    private clearScheduledHomeDataLoad(): void {
        this.removeLoadListener?.();

        if (typeof window === 'undefined') {
            return;
        }

        const idleWindow = window as IdleWindow;
        if (this.idleCallbackId !== null) {
            idleWindow.cancelIdleCallback?.(this.idleCallbackId);
            this.idleCallbackId = null;
        }

        if (this.idleTimeoutId !== null) {
            window.clearTimeout(this.idleTimeoutId);
            this.idleTimeoutId = null;
        }
    }

    private applySeoContent(): void {

        const title = 'Mirag Academy - Online Quran Memorization, Tajweed and Arabic Lessons';

        const description = 'Learn Quran online with qualified teachers in memorization, Tajweed, Arabic language, and Islamic studies for all ages.';

        this.seoFaqItems = [
                {
                    question: 'What services does mirag Academy provide?',
                    answer: 'We provide online Quran memorization, Tajweed classes, Arabic language courses, and Islamic studies with qualified teachers.'
                },
                {
                    question: 'Are online classes suitable for kids and adults?',
                    answer: 'Yes. We offer age-appropriate plans and level-based programs with continuous progress tracking.'
                },
                {
                    question: 'How can I register for classes?',
                    answer: 'You can register through the contact page, and our team will follow up to assess your level and schedule your program.'
                }
            ];

        this.seoService.update({
            title,
            description,
            canonicalPath: '/',
            faq: this.seoFaqItems
        });
    }
}
