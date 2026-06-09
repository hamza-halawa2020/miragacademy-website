import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PricingPlan, PricingService } from './pricing.service';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { HelpCtaComponent } from '../../shared/components/help-cta/help-cta.component';

@Component({
    selector: 'app-pricing-page',
    standalone: true,
    imports: [CommonModule, RouterLink, PageHeroComponent, SectionHeadingComponent, HelpCtaComponent],
    templateUrl: './pricing-page.component.html',
    styleUrl: './pricing-page.component.scss',
})
export class PricingPageComponent implements OnInit {
    plans: PricingPlan[] = [];
    isLoading = true;

    constructor(private pricingService: PricingService) { }

    ngOnInit(): void {
        this.fetchPlans();
    }

    fetchPlans(): void {
        this.isLoading = true;

        this.pricingService.getPricingPlans().subscribe({
            next: (response) => {
                this.plans = response.data || [];
                this.isLoading = false;
            },
            error: () => {
                this.plans = [];
                this.isLoading = false;
            }
        });
    }

    formatAmount(value: number | string | null | undefined): string {
        const numberValue = Number(value ?? 0);
        return Number.isInteger(numberValue) ? numberValue.toFixed(0) : numberValue.toFixed(1);
    }

    formatMoney(value: number | string | null | undefined, currency: string | null | undefined = 'USD'): string {
        const currencyLabel = currency || 'USD';
        return `${currencyLabel} ${this.formatAmount(value)}`;
    }

    calcMonthlyHours(daysPerWeek: number, minutesPerClass: number): string {
        const totalMinutes = daysPerWeek * minutesPerClass * 4;
        const hours = totalMinutes / 60;
        return this.formatAmount(hours);
    }

    planFeatures(plan: PricingPlan): string[] {
        const apiFeatures = Array.isArray(plan.features) ? plan.features.filter(Boolean) : [];

        if (apiFeatures.length > 0) {
            return apiFeatures;
        }

        return [
            // 'Live one-to-one online sessions',
            // 'Flexible monthly schedule',
            // 'Progress follow-up with the teacher',
        ];
    }
}
