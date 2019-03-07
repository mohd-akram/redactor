function escapeRegex(s: string) {
  return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
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

  redact(elements: HTMLElement[] | NodeListOf<any>) {
    for (const element of elements) {
      if (element.classList.contains(this.className))
        continue;
      if (this.match(element.innerText)) {
        const style = window.getComputedStyle(element, null);
        const color = style.getPropertyValue('color');
        element.style.backgroundColor = color;
        element.style.display = 'inline';
        element.classList.add(this.className);
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
