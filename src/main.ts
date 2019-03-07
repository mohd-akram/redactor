import Redactor, { Condition } from './redactor';

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
    const selector = '.userContent p';
    const elements = document.querySelectorAll(selector);
    redactor.redact(elements);
    const feed = document.querySelector('#contentArea') as HTMLElement;
    if (feed)
      redactor.observe(feed, selector);
  }

  else if (hostname.endsWith('twitter.com')) {
    const selector = '.tweet-text';
    const elements = document.querySelectorAll(selector);
    redactor.redact(elements);
    const timeline = document.querySelector('#timeline') as HTMLElement;
    if (timeline)
      redactor.observe(timeline, selector);
  }

  else if (hostname.endsWith('reddit.com')) {
    redactor.redact(document.querySelectorAll('.link a.title'));
    // New reddit
    const selector = 'a[data-click-id=body] h2';
    const elements = document.querySelectorAll(selector);
    redactor.redact(elements);
    if (elements.length)
      redactor.observe(document.body, selector);
  }
}

main();
