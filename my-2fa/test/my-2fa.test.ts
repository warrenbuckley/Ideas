import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { My2fa } from '../src/My2fa.js';
import '../src/my-2fa.js';

describe('My2fa', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture<My2fa>(html`<my-2fa></my-2fa>`);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<My2fa>(html`<my-2fa></my-2fa>`);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture<My2fa>(
      html`<my-2fa title="attribute title"></my-2fa>`
    );

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<My2fa>(html`<my-2fa></my-2fa>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
