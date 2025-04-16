import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { LayoutComponent } from './components/layout/layout.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';


@Component({
  selector: 'app-root',
  imports: [LayoutComponent, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('layoutContainer', { static: true }) layoutContainer!: ElementRef;
  ngAfterViewInit(): void {
    this.setLayoutSize();
  }
  @HostListener('window:resize')
  onResize() {
    this.setLayoutSize();
  }

  setLayoutSize(): void {
    const width = `${window.innerWidth}px`;
    const height = `${window.innerHeight - 35}px`;

    const element = this.layoutContainer.nativeElement;
    element.style.width = width;
    element.style.height = height;
  }
}
