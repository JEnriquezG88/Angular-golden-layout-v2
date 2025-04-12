import { Injectable } from '@angular/core';
import { JsonValue } from 'golden-layout';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  public saveJsonFile(file: JsonValue, defaultTitle: string): void {
    const blob = new Blob([JSON.stringify(file)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = defaultTitle;
    a.click();
  }

  public loadJsonFile(): Promise<any> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.style.display = 'none';

      input.addEventListener('change', (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject('No se seleccionó ningún archivo.');
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          try {
            const json = JSON.parse(reader.result as string);
            resolve(json);
          } catch (error) {
            reject('Archivo no es un JSON válido.');
          }
        };
        reader.onerror = () => reject('Error al leer el archivo.');
        reader.readAsText(file);
      });

      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    });
  }

}
