import TranslationsProvider from '../../_locales/_provider';

global.TranslationProvider = new TranslationsProvider();

if (global.HTMLSpanElement) {
  const createTranslationElement = (originalElement, elementTag) => {
    const TranslationProto = Object.create(originalElement.prototype);

    TranslationProto.createdCallback = function createdCallback() {
      this._key = this.textContent;
      this.innerHTML = TranslationProvider.query(this.textContent);
    };
    TranslationProto.setKey = function setKey(newKey) {
      this._key = newKey;
      this.innerHTML = TranslationProvider.query(newKey);
    };
    TranslationProto.getKey = function getKey() {
      return this._key;
    };

    window.ThumbImage = document.registerElement(`translation-key${elementTag === 'span' ? '' : `-${elementTag}`}`, {
      prototype: TranslationProto,
      extends: elementTag,
    });
  };

  createTranslationElement(HTMLSpanElement, 'span');
  createTranslationElement(HTMLParagraphElement, 'p');
  createTranslationElement(HTMLHeadingElement, 'h4');
}
