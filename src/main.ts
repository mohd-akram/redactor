import Redactor, { Condition } from './redactor.js';

async function main() {
  const conditions =
    (await browser.storage.sync.get('conditions')).conditions as Condition[]
    || [];

  const className = 'red--ted';

  const style = document.createElement('style');
  style.appendChild(document.createTextNode(
    `.${className}:hover{background-color:inherit!important}`
  ));
  document.head.appendChild(style);

  const hostname = window.location.hostname;

  const redactor = new Redactor(conditions, className);

  if (hostname.endsWith('facebook.com')) {
    const selector = '.userContent';
    const elements = document.querySelectorAll(selector);
    redactor.redact(elements);
    redactor.observe(document.body, selector);
  }

  else if (hostname.endsWith('twitter.com')) {
    const selector = 'article [lang], .tweet-text';
    const elements = document.querySelectorAll(selector);
    redactor.redact(elements);
    redactor.observe(document.body, selector);
  }

  else if (hostname.endsWith('reddit.com')) {
    redactor.redact(document.querySelectorAll('.link a.title'));
    // New reddit
    const selector = 'a[data-click-id=body] h3';
    const elements = document.querySelectorAll(selector);
    redactor.redact(elements);
    redactor.observe(document.body, selector);
  }
}

main();
