import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { LayoutService } from '../../services/layout.service';
import { FilesService } from '../../services/files.service';
import { TestComponent } from '../test/test.component';
import { TableComponent } from '../table/table.component';
import { TreeComponent } from '../tree/tree.component';
import { VerticalGraphComponent } from '../vertical-graph/vertical-graph.component';
import { HorizontalGraphComponent } from '../horizontal-graph/horizontal-graph.component';
import { PieGraphComponent } from '../pie-graph/pie-graph.component';
import { W } from '@angular/cdk/keycodes';

enum ComponentType {
  Test = 'test',
  Table = 'table',
  Tree = 'tree',
  VerticalGraph = 'verticalGraph',
  HorizontalGraph = 'horizontalGraph',
  PieGraph = 'piegraph'
}

enum PresetType {
  Custom = 'custom',
  Stack = 'stack',
  Row = 'row',
  Column = 'column',
  Combined = 'combined'
}

@Component({
  selector: 'app-toolbar',
  imports: [MatButtonModule, MatMenuModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  public ComponentType = ComponentType; // Expose the enumerator to the template.
  public PresetType = PresetType; // Expose the enumerator to the template.
  private readonly layoutService = inject(LayoutService);
  private readonly fileService = inject(FilesService);

  // Adds a new component to the layout based on the provided type.
  // param component - The type of the component to add.
  public addComponent(component: ComponentType): void {
    const componentMap: Record<ComponentType, typeof TestComponent | typeof TableComponent | typeof TreeComponent | typeof VerticalGraphComponent | typeof HorizontalGraphComponent | typeof PieGraphComponent> = {
      [ComponentType.Test]: TestComponent,
      [ComponentType.Table]: TableComponent,
      [ComponentType.Tree]: TreeComponent,
      [ComponentType.VerticalGraph]: VerticalGraphComponent,
      [ComponentType.HorizontalGraph]: HorizontalGraphComponent,
      [ComponentType.PieGraph]: PieGraphComponent
    };
  
    // TypeScript ahora sabe que 'component' siempre será una clave válida en 'componentMap'
    const selectedComponent = componentMap[component];
    if (selectedComponent) {
      this.layoutService.addNewComponent(this.getComponentTitle(component), selectedComponent);
    } else {
      console.error(`Component type "${component}" is not recognized.`);
    }
  }

  // Saves the current layout configuration.
  public saveLayout(): void {
    this.layoutService.saveLayout();
  }

  // Loads a layout preset or a custom layout.
  // param preset - The type of layout preset to load.
  public loadLayout(preset: PresetType): void {

    if (preset == PresetType.Custom) {
      this.loadCustomLayout();
    } else {
      this.loadPreset(preset);
    }
  }

  // Loads a custom layout from a JSON file.
  private async loadCustomLayout(): Promise<void> {
    try {
      const loadedLayout = await this.fileService.loadJsonFile();
      this.loadLayoutService(loadedLayout);
    } catch (error) {
      console.error('Failed to load the layout:', error);
    }
  }
  private loadLayoutService(loadedLayout: any): void {
    this.registerComponentsInLoad(loadedLayout);
    this.layoutService.loadLayout(loadedLayout.layoutData);
  }
  // Loads a preset layout from a JSON file based on the preset type.
  private async loadPreset(preset: PresetType): Promise<void> {

    const presetFileMap: Record<PresetType, string> = {
      [PresetType.Stack]: 'presets/stackPreset.json',
      [PresetType.Row]: 'presets/rowPreset.json',
      [PresetType.Column]: 'presets/columnPreset.json',
      [PresetType.Combined]: 'presets/combinedPreset.json',
      [PresetType.Custom]: '' // This will never be used due to the check above.
    };

    const filePath = presetFileMap[preset];
    if (!filePath) {
      console.error(`No file path defined for preset "${preset}".`);
      return;
    }
    const loadedLayout = await this.fileService.loadJsonFileFromPath(filePath);
    this.loadLayoutService(loadedLayout);
  }

  // Registers components dynamically based on the loaded layout configuration.
  // param loadedLayout - The layout configuration containing component information.
  private registerComponentsInLoad(loadedLayout: { importedComponents: string[] }): void {
    // Helper map to translate JSON strings into ComponentType enumerator values.
    const stringToComponentType: Record<string, ComponentType> = {
      testComponent: ComponentType.Test,
      tableComponent: ComponentType.Table,
      treeComponent: ComponentType.Tree,
      verticalGraph: ComponentType.VerticalGraph,
      horizontalGraph: ComponentType.HorizontalGraph,
      pieGraph: ComponentType.PieGraph
    };
  
    const componentMap: Record<ComponentType, typeof TestComponent | typeof TableComponent | typeof TreeComponent | typeof VerticalGraphComponent | typeof HorizontalGraphComponent | typeof PieGraphComponent> = {
      [ComponentType.Test]: TestComponent,
      [ComponentType.Table]: TableComponent,
      [ComponentType.Tree]: TreeComponent,
      [ComponentType.VerticalGraph]: VerticalGraphComponent,
      [ComponentType.HorizontalGraph]: HorizontalGraphComponent,
      [ComponentType.PieGraph]: PieGraphComponent
    };
  
    for (const component of loadedLayout.importedComponents) {
      // Maps the JSON string to the value of the ComponentType enumerator
      const componentType = stringToComponentType[component];
  
      if (componentType && componentType in componentMap) {
        const selectedComponent = componentMap[componentType];
        this.layoutService.registerNewComponent(component, selectedComponent);
      } else {
        console.warn(`Component "${component}" is not recognized.`);
      }
    }
  }

  // Returns a user-friendly title for a given component type.
  // param component - The type of the component.
  // returns The title of the component.
  private getComponentTitle(component: ComponentType): string {
    const titles = {
      [ComponentType.Test]: 'Test Component',
      [ComponentType.Table]: 'Table Component',
      [ComponentType.Tree]: 'Tree Component',
      [ComponentType.VerticalGraph]: 'Vertical Graph',
      [ComponentType.HorizontalGraph]: 'Horizontal Graph',
      [ComponentType.PieGraph]: 'Pie Graph'
    };

    return titles[component] || 'Unknown Component';
  }

  public clearLayout(): void {
    this.layoutService.clearLayout();
  };
}