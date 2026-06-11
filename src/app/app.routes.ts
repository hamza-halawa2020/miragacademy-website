import { Routes } from '@angular/router';
import { HomeDemoOneComponent } from './demos/home-demo-one/home-demo-one.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeDemoOneComponent,
        data: {
            seo: {
                title: 'Mirag Academy - Online Quran, Tajweed and Arabic Lessons',
                description: 'Learn Quran online with qualified teachers in memorization, Tajweed, Arabic language, and Islamic studies for kids and adults.',
                canonicalPath: '/'
            }
        }
    },
    {
        path: 'about',
        loadComponent: () => import('./pages/about-page/about-page.component').then(m => m.AboutPageComponent),
        data: {
            seo: {
                title: 'About Us - Mirag Academy',
                description: 'Learn more about Mirag Academy, our qualified Quran teachers, online learning approach, and mission to teach Quran, Tajweed, Arabic, and Islamic studies.',
                canonicalPath: '/about'
            }
        }
    },
    {
        path: 'privacy-policy',
        loadComponent: () => import('./pages/privacy-policy-page/privacy-policy-page.component').then(m => m.PrivacyPolicyPageComponent),
        data: {
            seo: {
                title: 'Privacy Policy - Mirag Academy',
                description: 'Read Mirag Academy privacy policy and learn how we protect your personal information when you use our online Quran learning services.',
                canonicalPath: '/privacy-policy'
            }
        }
    },
    {
        path: 'terms-conditions',
        loadComponent: () => import('./pages/terms-conditions-page/terms-conditions-page.component').then(m => m.TermsConditionsPageComponent),
        data: {
            seo: {
                title: 'Terms and Conditions - Mirag Academy',
                description: 'Review the terms and conditions for using Mirag Academy online Quran, Tajweed, Arabic, and Islamic studies services.',
                canonicalPath: '/terms-conditions'
            }
        }
    },
    {
        path: 'contacts',
        loadComponent: () => import('./pages/contact-page/contact-page.component').then(m => m.ContactPageComponent),
        data: {
            seo: {
                title: 'Contact Us - Mirag Academy',
                description: 'Contact Mirag Academy to Book a free trial, ask about Quran courses, or get help choosing the right online learning plan.',
                canonicalPath: '/contacts'
            }
        }
    },
    {
        path: 'pricing',
        loadComponent: () => import('./pages/pricing-page/pricing-page.component').then(m => m.PricingPageComponent),
        data: {
            seo: {
                title: 'Pricing - Mirag Academy',
                description: 'View Mirag Academy monthly pricing plans for online Quran, Tajweed, Arabic language, and Islamic studies classes.',
                canonicalPath: '/pricing'
            }
        }
    },
    {
        path: 'teacher-application',
        loadComponent: () => import('./pages/teacher-application-page/teacher-application-page.component').then(m => m.TeacherApplicationPageComponent),
        data: {
            seo: {
                title: 'Apply as a Teacher - Mirag Academy',
                description: 'Apply to teach Quran, Tajweed, Arabic, or Islamic studies online with Mirag Academy.',
                canonicalPath: '/teacher-application'
            }
        }
    },
    {
        path: 'posts',
        loadComponent: () => import('./pages/posts-page/posts-list/posts-list.component').then(m => m.PostsListComponent),
        data: {
            seo: {
                title: 'Articles - Mirag Academy',
                description: 'Read Mirag Academy articles about Quran learning, Tajweed, Arabic language, Islamic studies, and online education tips.',
                canonicalPath: '/posts'
            }
        }
    },
    {
        path: 'posts/:slug',
        loadComponent: () => import('./pages/posts-page/post-details/post-details.component').then(m => m.PostDetailsComponent)
    },
    {
        path: 'courses',
        loadComponent: () => import('./pages/courses-page/courses-list/courses-list.component').then(m => m.CoursesListComponent),
        data: {
            seo: {
                title: 'Courses - Mirag Academy',
                description: 'Explore Mirag Academy online courses for Quran memorization, Tajweed, Arabic language, and Islamic studies.',
                canonicalPath: '/courses'
            }
        }
    },
    {
        path: 'courses/:id',
        loadComponent: () => import('./pages/courses-page/course-details/course-details.component').then(m => m.CourseDetailsComponent)
    },
    {
        path: 'teachers',
        loadComponent: () => import('./pages/teachers-page/teachers-list/teachers-list.component').then(m => m.TeachersListComponent),
        data: {
            seo: {
                title: 'Teachers - Mirag Academy',
                description: 'Meet qualified Mirag Academy teachers for online Quran memorization, Tajweed, Arabic, and Islamic studies classes.',
                canonicalPath: '/teachers'
            }
        }
    },
    {
        path: 'testimonials',
        loadComponent: () => import('./pages/reviews-page/reviews-list/reviews-list.component').then(m => m.ReviewsListComponent),
        data: {
            seo: {
                title: 'Student Reviews - Mirag Academy',
                description: 'Read student and parent reviews about learning Quran, Tajweed, Arabic, and Islamic studies online with Mirag Academy.',
                canonicalPath: '/testimonials'
            }
        }
    },
    {
        path: 'media',
        loadComponent: () => import('./pages/media-gallery-page/media-gallery-page.component').then(m => m.MediaGalleryPageComponent),
        data: {
            seo: {
                title: 'Watch Real Classes - Mirag Academy',
                description: 'View Mirag Academy media, learning moments, certificates, and online Quran education activities.',
                canonicalPath: '/media'
            }
        }
    },
    {
        path: 'certificates',
        loadComponent: () => import('./pages/certificates-page/certificates-list/certificates-list.component').then(m => m.CertificatesListComponent),
        data: {
            seo: {
                title: 'Certificates - Mirag Academy',
                description: 'Explore Mirag Academy certificates and student achievements in Quran, Tajweed, Arabic, and Islamic studies.',
                canonicalPath: '/certificates'
            }
        }
    },
    {
        path: '**',
        loadComponent: () => import('./pages/error-page/error-page.component').then(m => m.ErrorPageComponent)
    },
];
