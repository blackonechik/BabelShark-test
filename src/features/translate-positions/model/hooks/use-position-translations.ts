import { useEffect, useRef } from "react";
import { translatePosition } from "../../api/translate-position";
import { normalizeText } from "../../lib/normalize-text";
import type { ObservedCell } from "../types";

export const usePositionTranslations = (): void => {
  const cacheRef = useRef<Map<string, Promise<string>>>(new Map());

  useEffect(() => {
    const translationRoot = document.querySelector<HTMLElement>(
      "[data-translation-root='positions']",
    );

    if (!translationRoot) {
      return undefined;
    }

    const requestTranslation = async (cell: ObservedCell): Promise<void> => {
      const currentText = normalizeText(cell.textContent);
      const previousSource = normalizeText(cell.dataset.sourceText);
      const previousTranslation = normalizeText(cell.dataset.translatedText);

      if (!currentText) {
        return;
      }

      if (currentText === previousTranslation && previousSource) {
        return;
      }

      const sourceText = currentText;
      cell.dataset.sourceText = sourceText;

      let translationPromise = cacheRef.current.get(sourceText);

      if (!translationPromise) {
        translationPromise = translatePosition(sourceText).catch(() => sourceText);
        cacheRef.current.set(sourceText, translationPromise);
      }

      const translatedText = await translationPromise;

      if (cell.dataset.sourceText !== sourceText) {
        return;
      }

      cell.dataset.translatedText = translatedText;

      if (normalizeText(cell.textContent) !== translatedText) {
        cell.textContent = translatedText;
      }
    };

    const translateAll = (elements?: Iterable<Element>): void => {
      const cells = elements
        ? Array.from(elements)
        : Array.from(translationRoot.querySelectorAll(".__t"));

      cells.forEach((element) => {
        if (element instanceof HTMLElement && element.classList.contains("__t")) {
          void requestTranslation(element as ObservedCell);
        }
      });
    };

    translateAll();

    const observer = new MutationObserver((mutations) => {
      const nextElements = new Set<Element>();

      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (!(node instanceof Element)) {
              return;
            }

            if (node.classList.contains("__t")) {
              nextElements.add(node);
            }

            node.querySelectorAll(".__t").forEach((cell) => nextElements.add(cell));
          });
        }

        if (
          mutation.type === "characterData" &&
          mutation.target.parentElement?.classList.contains("__t")
        ) {
          nextElements.add(mutation.target.parentElement);
        }
      });

      if (nextElements.size > 0) {
        translateAll(nextElements);
      }
    });

    observer.observe(translationRoot, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);
};
