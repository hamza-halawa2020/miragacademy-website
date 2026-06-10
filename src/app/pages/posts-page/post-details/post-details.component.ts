import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostsService } from '../posts.service';
import { TranslateModule } from '@ngx-translate/core';
import { HelpCtaComponent } from '../../../shared/components/help-cta/help-cta.component';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
    selector: 'app-post-details',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink, HelpCtaComponent],
    templateUrl: './post-details.component.html',
    styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {
    post: any;
    isLoading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private postsService: PostsService,
        private seoService: SeoService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const slug = params.get('slug');
            if (slug) {
                this.fetchDetails(slug);
            }
        });
    }

    fetchDetails(slug: string) {
        this.isLoading = true;
        this.postsService.getPostDetails(slug).subscribe({
            next: (response: any) => {
                this.post = response.data;
                this.isLoading = false;
                
                // Update SEO metadata with article schema
                this.seoService.update({
                    title: this.post.meta_title || this.post.title,
                    description: this.post.meta_description || this.post.description,
                    image: this.post.image_url,
                    canonicalPath: `/posts/${this.post.slug}`,
                    type: 'article',
                    article: {
                        author: this.post.author,
                        publishedDate: this.post.created_at,
                        updatedDate: this.post.updated_at
                    }
                });
            },
            error: (error: any) => {
                this.isLoading = false;
            }
        });
    }
}
