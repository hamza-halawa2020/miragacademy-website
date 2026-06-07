import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-section-heading',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './section-heading.component.html',
    styleUrl: './section-heading.component.scss',
})
export class SectionHeadingComponent {
    @Input() eyebrow = '';
    @Input() title = '';
    @Input() description = '';
    @Input() align: 'center' | 'start' = 'center';
}
