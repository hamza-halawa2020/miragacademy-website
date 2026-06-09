import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingService } from '../../shared/services/setting.service';

@Component({
    selector: 'app-faq-section',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './faq-section.component.html',
    styleUrl: './faq-section.component.scss',
})
export class FaqSectionComponent implements OnInit {
    @Input() whatsappNumber: string = '201034100565';

    faqItems = [
        {
            question: 'What services does Mirag Academy provide?',
            answer: 'We provide online Quran memorization, Tajweed classes, Arabic language courses, and Islamic studies with qualified teachers.'
        },
        {
            question: 'Are online classes suitable for kids and adults?',
            answer: 'Yes. We offer age-appropriate plans and level-based programs with continuous progress tracking.'
        },
        {
            question: 'How can I register for classes?',
            answer: ''
        },
        {
            question: 'What will you get when you join Mirag Academy?',
            answer: ''
        },
    ];

    constructor(private settingService: SettingService) {}

    ngOnInit(): void {
        this.settingService.getSettings().subscribe({
            next: (settings) => {
                const raw = settings.whatsapp || settings.phone || '201034100565';
                this.whatsappNumber = raw.replace('+', '').replace(/\s/g, '');
            }
        });
    }
}
