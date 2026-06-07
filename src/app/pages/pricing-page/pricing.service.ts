import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type PricingPlan = {
    id?: number;
    title: string;
    subtitle?: string | null;
    currency: string;
    price: number | string;
    classes_count: number;
    days_per_week: number;
    minutes_per_class: number;
    price_per_class?: number | string | null;
    badge?: string | null;
    is_featured?: boolean;
    features?: string[] | null;
};

@Injectable({
    providedIn: 'root'
})
export class PricingService {
    private apiUrl = environment.backEndUrl;

    constructor(private http: HttpClient) { }

    getPricingPlans(): Observable<{ data: PricingPlan[] }> {
        return this.http.get<{ data: PricingPlan[] }>(`${this.apiUrl}/pricing-plans`);
    }
}
