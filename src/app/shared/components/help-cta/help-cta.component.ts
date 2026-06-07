import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-help-cta',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './help-cta.component.html',
    styleUrl: './help-cta.component.scss',
})
export class HelpCtaComponent {
    @Input() eyebrow = 'Need Help?';
    @Input() title = 'Not sure which plan fits you?';
    @Input() description = 'Contact us and we will help you choose the right schedule based on age, level, and learning goal.';
    @Input() buttonLabel = 'Contact Us';
    @Input() buttonLink = '/contacts';
}
