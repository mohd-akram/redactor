function escapeRegex(s: string) {
  return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}

function makeInline(element: HTMLElement) {
  if (element.style.display == 'inline')
    return;
  element.style.display = 'inline';
  const div = document.createElement('div');
  // Need to insert the element first to ensure marginTop is updated
  element.parentNode.insertBefore(div, element);
  const marginTop = window.getComputedStyle(element).marginTop;
  if (parseFloat(marginTop))
    div.style.height = marginTop;
  else
    div.remove();
}

export type Condition = string[][];

class Redactor {
  conditions: Condition[];
  className: string;

  constructor(conditions: Condition[], className: string) {
    this.conditions = conditions;
    this.className = className;
  }

  match(text: string) {
    return this.conditions.map(condition =>
      condition.reduce((prev, curr) => {
        curr = curr.map(w => escapeRegex(w.replace(/\W+$/, '')));
        const regex = new RegExp(`\\b(${curr.join('|')})\\b`);
        return prev && regex.test(text);
      }, true)
    ).find(Boolean);
  }

  redact(elements: HTMLElement[] | NodeListOf<Element>) {
    for (const element of elements as NodeListOf<HTMLElement>) {
      if (element.classList.contains(this.className))
        continue;
      if (this.match(element.textContent)) {
        const color = window.getComputedStyle(element).color;
        element.style.backgroundColor = color;
        element.classList.add(this.className);
        makeInline(element);
        for (const p of element.querySelectorAll('p'))
          makeInline(p);
        if (window.getComputedStyle(element.parentElement).display == 'flex')
          element.parentElement.style.display = 'block';
      }
    }
  }

  observe(element: HTMLElement, selector: string) {
    const observer = new MutationObserver(() =>
      this.redact(document.querySelectorAll(selector))
    );
    observer.observe(element, { childList: true, subtree: true });
  }
}

export default Redactor;
