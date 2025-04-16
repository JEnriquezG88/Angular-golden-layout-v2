import { Component, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-vertical--graph',
  imports: [NgxChartsModule],
  templateUrl: './vertical-graph.component.html',
  styleUrl: './vertical-graph.component.scss'
})
export class VerticalGraphComponent {
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
