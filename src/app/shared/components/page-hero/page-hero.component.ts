import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-page-hero',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './page-hero.component.html',
    styleUrl: './page-hero.component.scss',
})
export class PageHeroComponent {
    @Input() eyebrow = 'Mirag Academy';
    @Input() title = '';
    @Input() description = '';
    @Input() align: 'center' | 'start' = 'center';
}
