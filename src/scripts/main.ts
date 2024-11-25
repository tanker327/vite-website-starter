import '../styles/style.css';
import $ from 'jquery';

import typescriptLogo from '../assets/images/typescript.svg';

import { setupCounter } from './counter.ts';

declare global {
  interface Window {
    $: JQueryStatic;
    jQuery: JQueryStatic;
  }
}
window.$ = window.jQuery = $;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

console.log('Hello World');
console.log($);
