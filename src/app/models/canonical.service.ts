import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CanonicalService {
  constructor(@Inject(DOCUMENT) private doc: Document) {}

  setCanonical(url?: string) {
    const link: HTMLLinkElement =
      this.doc.querySelector(`link[rel='canonical']`) || this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url || this.doc.location.href);
    if (!link.parentNode) {
      this.doc.head.appendChild(link);
    }
  }
}
