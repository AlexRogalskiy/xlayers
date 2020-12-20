import { Injectable } from '@angular/core';
import { StackBlitzProjectPayload } from './stackblitz.service';
import { XlayersNgxEditorModel } from '../../editor-container/codegen/codegen.service';

@Injectable({
  providedIn: 'root',
})
export class ExportStackblitzStencilService {
  prepare(content: XlayersNgxEditorModel[]): StackBlitzProjectPayload {
    const files = {};
    for (let i = 0; i < content.length; i++) {
      for (const prop in content[i]) {
        if (prop === 'uri') {
          files[`src/components/` + content[i].uri] = content[i].value;
        }
      }
    }

    files['package.json'] = `\
{
  "name": "my-component",
  "version": "0.0.1",
  "module": "dist/esm/index.js",
  "main": "dist/index.js",
  "types": "dist/types/components.d.ts",
  "collection": "dist/collection/collection-manifest.json",
  "files": [
    "dist/"
  ],
  "scripts": {
    "build": "npx stencil build --docs",
    "start": "npx stencil build",
    "test": "npx stencil test --spec --e2e",
    "test.watch": "npx stencil test --spec --e2e --watchAll"
  },
  "dependencies": {},
  "devDependencies": {
    "@stencil/core": "~0.15.2"
  },
  "license": "MIT"
}`;
    // add extra files
    files['tsconfig.json'] = `\
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "allowUnreachableCode": false,
    "declaration": false,
    "experimentalDecorators": true,
    "lib": [
      "dom",
      "es2017"
    ],
    "moduleResolution": "node",
    "module": "esnext",
    "target": "es2017",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "jsx": "react",
    "jsxFactory": "h"
  },
  "include": [
    "src",
    "types/jsx.d.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}`;

    files['stencil.config.ts'] = `\
import { Config } from '@stencil/core';
export const config: Config = {
  outputTargets:[
    { type: 'dist' },
    { type: 'docs' },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};`;

    files['src/index.html'] = `\
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0">
  <title>Stencil Component Starter</title>
  // <script src="/build/my-component.js"></script>
</head>
<body>
  // <my-component></my-component>
</body>
</html>`;

    return {
      files,
      template: 'typescript',
      tags: ['stencil'],
    };
  }
}
