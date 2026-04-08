export type ObservedCell = HTMLElement & {
  dataset: DOMStringMap & {
    sourceText?: string;
    translatedText?: string;
  };
};
