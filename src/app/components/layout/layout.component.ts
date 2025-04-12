import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-layout',
  imports: [],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements AfterViewInit {
  layoutService: LayoutService = inject(LayoutService);
  @ViewChild('layoutContainer', { static: true }) layoutContainer!: ElementRef;
  ngAfterViewInit(): void {
    this.layoutService.initializeLayout(this.layoutContainer.nativeElement);
  }
}
