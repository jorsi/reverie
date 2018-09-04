/**
 * Reverie DOM rendering library.
 */

 /**
  * Cache map for created templates.
  */
const templateCache: Map<TemplateStringsArray, HTMLTemplateElement> = new Map<TemplateStringsArray, HTMLTemplateElement>();

/**
 * Returns an html element from a built HTMLTemplateElement.
 * @param strings Template literal string of html.
 * @param values Properties
 */
export function html (strings: TemplateStringsArray, ...values: any[]) {
    console.log(strings, values);
    let template = templateCache.get(strings);
    if (template === undefined) {
        template = document.createElement('template');
        template.innerHTML = strings.reduce((prev, current, i) => {
            console.log('prev', prev);
            console.log('current', current);
            console.log(i);
            return prev + (values[i - 1] ? values[i - 1] : '') + current;
        });
        templateCache.set(strings, template);
    }
    return template.content.cloneNode(true);
};