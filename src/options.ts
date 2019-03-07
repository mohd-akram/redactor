import { Condition } from './redactor';

const addToList = (list: HTMLUListElement, item: HTMLElement) => {
  const listItem = document.createElement('li');
  if (item.tagName == 'INPUT')
    listItem.className = 'browser-style';
  listItem.appendChild(item);
  list.insertBefore(listItem, list.lastElementChild);
};

const addHandler = (element: HTMLButtonElement, create: () => HTMLElement) =>
  element.onclick = () => addToList(element.closest('ul'), create());

const getConditions = (element: HTMLUListElement) => {
  const conditions = [];
  for (const c of element.querySelectorAll('.condition')) {
    const wordlists = [];
    for (const wl of c.querySelectorAll('.wordlist')) {
      const words = Array.from(
        wl.querySelectorAll('.word') as NodeListOf<HTMLInputElement>
      ).map(w => w.value);
      wordlists.push(words);
    }
    conditions.push(wordlists);
  }
  return conditions;
};

async function main() {
  const _conditionElement = document.querySelector('.condition');
  _conditionElement.closest('li').remove();
  const _wordlistElement = _conditionElement.querySelector('.wordlist');
  _wordlistElement.closest('li').remove();
  const _wordElement = _wordlistElement.querySelector('.word');
  _wordElement.closest('li').remove();

  const createWordElement = (value = '') => {
    const element = _wordElement.cloneNode(true) as HTMLInputElement;
    element.value = value;
    return element;
  };

  const createWordlistElement = (values = ['']) => {
    const element = _wordlistElement.cloneNode(true) as HTMLUListElement;
    for (const value of values) {
      const wordElement = createWordElement(value);
      addToList(element, wordElement);
    }
    addHandler(element.querySelector('.add-word'), createWordElement);
    return element;
  };

  const createConditionElement = (condition = [['']]) => {
    const element = _conditionElement.cloneNode(true) as HTMLUListElement;
    for (const wordlist of condition) {
      const wordlistElement = createWordlistElement(wordlist);
      addToList(element, wordlistElement);
    }
    addHandler(
      element.querySelector('.add-wordlist'), createWordlistElement
    );
    return element;
  };

  const conditionsElement =
    document.querySelector('.conditions') as HTMLUListElement;

  const conditions =
    ((await browser.storage.sync.get('conditions')).conditions as Condition[])
    || [[['']]];

  (document.querySelector('.add-condition') as HTMLButtonElement)
    .onclick = () => addToList(conditionsElement, createConditionElement());

  for (const condition of conditions) {
    const conditionElement = createConditionElement(condition);
    addToList(conditionsElement, conditionElement);
  }

  conditionsElement.onchange = () => {
    for (const c of conditionsElement.querySelectorAll('.condition')) {
      const wordlists = c.querySelectorAll('.wordlist');
      const emptyWordlists = [];
      for (const wl of wordlists) {
        const words =
          wl.querySelectorAll('.word') as NodeListOf<HTMLInputElement>;
        const emptyWords = Array.from(words).filter(w => !w.value);
        for (const word of emptyWords)
          word.closest('li').remove();
        if (words.length == emptyWords.length) {
          wl.closest('li').remove();
          emptyWordlists.push(wl);
        }
      }
      if (wordlists.length == emptyWordlists.length)
        c.closest('li').remove();
    }
    const conditions = getConditions(conditionsElement);
    browser.storage.sync.set({ conditions });
    // If all the conditions were removed, add one again
    if (!conditionsElement.querySelector('.condition'))
      addToList(conditionsElement, createConditionElement());
  };
}

document.addEventListener('DOMContentLoaded', main);
