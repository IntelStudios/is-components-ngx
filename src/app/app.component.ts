import { Component, ChangeDetectionStrategy, Renderer2, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
})
export class AppComponent implements OnInit {

  theme: string = 'is-theme-light';

  demos = [
    { title: 'Select', route: '/select' },
    { title: 'Froala', route: '/froala' },
    { title: 'Core UI', route: '/core-ui' },
    { title: 'Date Picker', route: '/datepicker' },
    { title: 'Select Tree', route: '/select-tree' },
    { title: 'Time Picker', route: '/timepicker' },
    { title: 'Cron editor', route: '/croneditor' },
  ].sort((a, b) => a.title.localeCompare(b.title));

  constructor(private renderer: Renderer2, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.theme) {
        this.renderer.removeClass(document.body, this.theme);
        this.renderer.addClass(document.body, params.theme);
        this.theme = params.theme;
      }
    })
  }

  onThemeChange($event: Event) {
    const theme = ($event.target as HTMLSelectElement).value;
    this.router.navigate([], { queryParams: { theme }, queryParamsHandling: 'merge', relativeTo: this.route });
  }
}
