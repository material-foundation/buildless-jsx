/** @license
 *  Copyright 2023 - present The Buildless JSX Authors. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy
 *  of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations
 *  under the License.
 */

import {
  transpileModule,
} from 'typescript';

const containsJSX = (src) => (src.includes('</') || src.includes('/>')) && !src.includes('ignore yourself');

const jsxModules = Array.from(
  document.getElementsByTagName('script'),
  tag => tag.textContent
).filter(containsJSX);

const transpiledTags = jsxModules.map(
  jsx => {
    const textContent = transpileModule(
      jsx,
      {
        compilerOptions: {
          "jsx": "react",
          "jsxFactory": "createElement",
          "target": "esnext"
        }
      }
    ).outputText;

    const script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.textContent = textContent;
    return script;
  }
);

transpiledTags.forEach(
  tag => document.head.appendChild(tag)
);
