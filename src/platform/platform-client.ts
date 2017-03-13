import { PlatformApi } from './platform-api';
import { isDef, toCamelCase } from '../utils/helpers';


export class PlatformClient implements PlatformApi {
  private css: {[tag: string]: boolean} = {};

  constructor(private d: HTMLDocument) {}

  createElement(tagName: any): HTMLElement {
    return this.d.createElement(tagName);
  }

  createElementNS(namespaceURI: string, qualifiedName: string): Element {
    return this.d.createElementNS(namespaceURI, qualifiedName);
  }

  createTextNode(text: string): Text {
    return this.d.createTextNode(text);
  }

  createComment(text: string): Comment {
    return this.d.createComment(text);
  }

  insertBefore(parentNode: Node, newNode: Node, referenceNode: Node | null): void {
    parentNode.insertBefore(newNode, referenceNode);
  }

  removeChild(node: Node, child: Node): void {
    node.removeChild(child);
  }

  appendChild(node: Node, child: Node): void {
    node.appendChild(child);
  }

  parentNode(node: Node): Node | null {
    return node.parentNode;
  }

  nextSibling(node: Node): Node | null {
    return node.nextSibling;
  }

  tag(elm: Element): string {
    return (elm.tagName || '').toLowerCase();
  }

  setTextContent(node: Node, text: string | null): void {
    node.textContent = text;
  }

  getTextContent(node: Node): string | null {
    return node.textContent;
  }

  getAttribute(elm: HTMLElement, attrName: string): string {
    return elm.getAttribute(attrName);
  }

  getProperty(node: Node, propName: string): any {
    return (<any>node)[propName];
  }

  getPropOrAttr(elm: HTMLElement, name: string): any {
    const val = (<any>elm)[toCamelCase(name)];
    return isDef(val) ? val : elm.getAttribute(name);
  }

  setStyle(elm: HTMLElement, styleName: string, styleValue: any) {
    (<any>elm.style)[toCamelCase(styleName)] = styleValue;
  }

  isElement(node: Node): node is Element {
    return node.nodeType === 1;
  }

  isText(node: Node): node is Text {
    return node.nodeType === 3;
  }

  isComment(node: Node): node is Comment {
    return node.nodeType === 8;
  }

  hasElementCss(tag: string) {
    return !!this.css[tag];
  }

  appendStyles(tag: string, styles: string) {
    this.css[tag] = true;

    if (styles) {
      const cssId = `css-${tag}`;
      const head = this.d.getElementsByTagName('head')[0];

      if (!head.querySelector(`#${cssId}`)) {
        const styleEle = <HTMLStyleElement>this.createElement('style');
        styleEle.id = cssId;
        styleEle.innerHTML = styles;
        head.insertBefore(styleEle, head.firstChild);
      }
    }
  }

  appendStyleUrl(tag: string, styleUrl: string) {
    this.css[tag] = true;

    if (styleUrl) {
      const cssId = `css-${tag}`;
      const head = this.d.getElementsByTagName('head')[0];

      if (!head.querySelector(`#${cssId}`)) {
        const linkEle = <HTMLLinkElement>this.createElement('link');
        linkEle.id = cssId;
        linkEle.href = styleUrl;
        linkEle.rel = 'stylesheet';
        head.insertBefore(linkEle, head.firstChild);
      }
    }
  }

  nextTick(cb: Function) {
    const obs = new MutationObserver(() => {
      cb && cb();
    });

    const textNode = this.createTextNode('');
    obs.observe(textNode, { characterData: true });
    textNode.data = '1';
  }

}