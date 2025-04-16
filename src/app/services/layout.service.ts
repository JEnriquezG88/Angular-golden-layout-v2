import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, Injectable, inject, Type } from '@angular/core';
import { GoldenLayout, LayoutConfig } from 'golden-layout';
import { FilesService } from './files.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private layout!: GoldenLayout; // The GoldenLayout instance
  private readonly registerComponents: string[] = []; // Array to store registered component types
  private containerElement!: HTMLElement; // The container element for the layout

  private readonly layoutConfig: LayoutConfig = {
    root: {
      type: 'row',
      content: []
    },
    settings: {
      showPopoutIcon: false,
      showMaximiseIcon: false,
      showCloseIcon: true
    },
    dimensions: {
      headerHeight: 35
    }
  }; // Default layout configuration
  private readonly resolver = inject(EnvironmentInjector); // Angular environment injector for creating components
  private readonly appRef = inject(ApplicationRef); // Angular application reference for attaching views
  private readonly filesService = inject(FilesService); // Service for file operations

  //Initializes the GoldenLayout instance with the provided container element.
  public initializeLayout(containerElement: HTMLElement): void {
    this.containerElement = containerElement; 
    this.layout = new GoldenLayout(this.containerElement);
    this.layout.loadLayout(this.layoutConfig);
    this.initLayoutStateChanged();
  }

  //Adds a new Angular component to the layout.
  public addNewComponent(title: string, component: Type<any>): void {
    if (this.hasErrors()) return;

    const componentType = this.createComponentType(title);
    this.registerNewComponent(componentType, component);
    this.layout.addComponent(componentType, undefined, title);
  }

  //Saves the current layout configuration to a JSON file.  
  public saveLayout(): void {
    const currentLayout = {
      importedComponents: this.registerComponents,
      layoutData: this.layout.saveLayout()
    };
    this.filesService.saveJsonFile(currentLayout, 'layout-config.json');
  }

  //Loads a layout configuration from a provided object.
  public loadLayout(loadedLayout: any): void {
    const config = LayoutConfig.fromResolved(loadedLayout);
    this.layout.loadLayout(config);
  }

  //Clears the layout and resets registered components.
  public clearLayout(): void {
    if (this.hasErrors()) return;
    this.layout.clear(); // Clears all components from the layout
  }

  //Registers a new Angular component with the layout.
  public registerNewComponent(componentType: string, component: Type<any>): void {
    if (this.registerComponents.includes(componentType)) return;

    this.layout.registerComponentFactoryFunction(componentType, (container) => {
      const componentRef = this.createAngularComponent(component);
      container.element.append(componentRef.location.nativeElement);
    });
    this.registerComponents.push(componentType);
  }

  //Creates an Angular component dynamically.
  private createAngularComponent<T>(component: Type<T>): ComponentRef<T> {
    const componentRef = createComponent(component, {
      environmentInjector: this.resolver
    });
    this.appRef.attachView(componentRef.hostView);
    return componentRef;
  }

  //Initializes the layout's state change listener.
  private initLayoutStateChanged(): void {
    if (this.hasErrors()) return;

    this.layout.on('stateChanged', () => this.resizeLayout());
  }

  

  //Resizes the layout to fit the window dimensions.
  private resizeLayout(): void {
    const width = window.innerWidth;
    const height = window.innerHeight - 35;
    this.layout.setSize(width, height);
  }

  //Checks for errors in the layout or container element.
  private hasErrors(): boolean {
    if (!this.layout) {
      console.error('Layout does not exist.');
      return true;
    }
    if (!this.containerElement) {
      console.error('Container element not found.');
      return true;
    }
    return false;
  }

  //Converts a title string into a camelCase component type.
  private createComponentType(title: string): string {
    if (!title) return '';

    return title
      .trim()
      .split(/\s+/)
      .map((word, index) =>
        index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');
  }
}