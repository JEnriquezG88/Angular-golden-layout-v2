import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable, Type } from '@angular/core';
import { ContentItem, GoldenLayout, JsonValue, LayoutConfig } from 'golden-layout';
import { FilesService } from './files.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private layout!: GoldenLayout;
  private registerComponents: string[] = [];
  private containerElement!: HTMLElement;
  private resolver: EnvironmentInjector = inject(EnvironmentInjector);
  private appRef: ApplicationRef = inject(ApplicationRef);
  private filesService: FilesService = inject(FilesService);
  private resizeObserver!: ResizeObserver;
  private layoutConfig: LayoutConfig = {
    root: {
      type: 'row',
      content: []
    },
    settings: {
      showPopoutIcon: false,
      showMaximiseIcon: false,
      showCloseIcon: true
    }
  }

  public initializeLayout(containerElement: HTMLElement): void {
    this.containerElement = containerElement;
    this.layout = new GoldenLayout(this.containerElement);
    this.layout.loadLayout(this.layoutConfig);
    this.registerObserver();
  }

  public addNewComponent(title: string, component: Type<any>): void {
    if (this.checkForErrors()) return;
    const componentType: string = this.createComponentType(title)
    this.registerNewComponent(componentType, component);
    this.layout.addComponent(componentType, undefined, title);
  }

  public saveLayout(): void {
    const currentLayout = {
      importedComponents: this.registerComponents,
      layoutData: this.layout.saveLayout()
    }
    this.filesService.saveJsonFile(currentLayout, 'golden-layout-config.json');
  }
  public loadLayout(loadedLayout: any): void {
    const config = LayoutConfig.fromResolved(loadedLayout);
    this.layout.loadLayout(config);
  }

  private createComponentType(title: string): string {
    if (!title) return '';

    const words = title.trim().split(/\s+/);

    const camelCase = words.map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    const result = camelCase.join('');
    return result;
  }

  public registerNewComponent(componentType: string, component: Type<any>): void {
    if (this.registerComponents.includes(componentType)) return;

    this.layout.registerComponentFactoryFunction(componentType, (container) => {
      const componentRef = this.createAngularComponent(component);
      container.element.append(componentRef.location.nativeElement);
    });
    this.registerComponents.push(componentType);
  }

  private createAngularComponent<T>(component: Type<T>): ComponentRef<T> {
    const componentRef = createComponent(component, {
      environmentInjector: this.resolver
    });
    this.appRef.attachView(componentRef.hostView);
    return componentRef;
  }

  private registerObserver(): void {
    if (this.checkForErrors()) return;

    this.resizeObserver = new ResizeObserver(() => {
      const width = this.containerElement?.clientWidth;
      const height = this.containerElement?.clientHeight;

      this.layout.setSize(width, height);
    });
    this.resizeObserver.observe(this.containerElement);
  }

  private checkForErrors(): boolean {
    if (!this.layout) {
      console.error('Layout does not exist.');
      return true;
    }
    if (!this.containerElement) {
      console.error('container element not found.');
      return true;
    }
    return false;
  }
  constructor() { }
}
