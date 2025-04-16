import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-pie-graph',
  imports: [NgxChartsModule],
  templateUrl: './pie-graph.component.html',
  styleUrl: './pie-graph.component.scss'
})
export class PieGraphComponent {
  @Input() graphType: string = 'horizontal';

  view: [number, number] = [700, 400];

  barData = [
    { name: 'Black Metal', value: 80 },
    { name: 'Death Metal', value: 65 },
    { name: 'Doom Metal', value: 50 },
    { name: 'Folk Metal', value: 35 }
  ];

  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  xAxisLabel = 'Género';
  showXAxisLabel = true;
  yAxisLabel = 'Popularidad';
  showYAxisLabel = true;
  colorScheme = 'air';
  doughtnut = true;
  theme = 'Dark';
  leyend = 'Metal Music Genres.';
  trueBoolean = true;
}
