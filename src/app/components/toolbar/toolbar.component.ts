import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { LayoutService } from '../../services/layout.service';
import { TestComponent } from '../test/test.component';
import { FilesService } from '../../services/files.service';
import { TableComponent } from '../table/table.component';
import { TreeComponent } from '../tree/tree.component';

@Component({
  selector: 'app-toolbar',
  imports: [MatButtonModule, MatMenuModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  layoutService: LayoutService = inject(LayoutService);
  fileService: FilesService = inject(FilesService);

  public addComponent(component: string): void {
    switch (component) {
      case 'test':
        this.layoutService.addNewComponent('Test Component', TestComponent);
        break;
      case 'table':
        this.layoutService.addNewComponent('Table Component', TableComponent);
        break;
      case 'tree':
        this.layoutService.addNewComponent('Tree Component', TreeComponent);
        break;
    }
  }

  public saveLayout() {
    this.layoutService.saveLayout();
  }

  public loadlayout(preset: string) {
    this.loadCases(preset);
  }

  private async loadCases(preset: string) {
    switch (preset) {
      case 'custom':
        try {
          const loadedLayout = await this.fileService.loadJsonFile();
          this.registerComponentsInLoad(loadedLayout);
          const layout = loadedLayout.layoutData;
          this.layoutService.loadLayout(layout);
        } catch {
          console.error('Failed to load the layout');
        }
        break;
      case 'stack':
        break;
      case 'row':
        break;
      case 'column':
        break;
      case 'conbined':
        break;
    }

  }

  private registerComponentsInLoad(loadedLayout: any): void {
    for (const component of loadedLayout.importedComponents) {
      switch (component) {
        case 'testComponent':
          this.layoutService.registerNewComponent(component, TestComponent);
          break;
        case 'tableComponent':
          this.layoutService.registerNewComponent(component, TableComponent);
          break;
        case 'treeComponent':
          this.layoutService.registerNewComponent(component, TreeComponent);
          break;
      }
    }
  }
}
