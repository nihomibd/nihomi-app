import React from 'react';

/**
 * NIHOMI.COM — Furigana & Ruby Parsing Engine
 * Strictly converts Japanese text formatted as 漢字[かんじ] into semantic HTML <ruby>漢字<rt>かんじ</rt></ruby>.
 */

export interface FuriganaRenderOptions {
  className?: string;
  rubyClassName?: string;
  rtClassName?: string;
}

// Regex to capture Kanji (or alphanumeric) base immediately followed by reading in brackets: 漢字[かんじ]
const FURIGANA_REGEX = /([\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF々〇ヶヵA-Za-z0-9]+)\[([^\]]+)\]/g;

/**
 * Converts a Japanese string with 漢字[かんじ] syntax into a semantic HTML string.
 * Example: "私[わたし]は学生[がくせい]です"
 * Output: "<ruby>私<rt>わたし</rt></ruby>は<ruby>学生<rt>がくせい</rt></ruby>です"
 */
export function furiganaToHtml(text: string, options?: FuriganaRenderOptions): string {
  if (!text) return '';
  const rubyClass = options?.rubyClassName ? ` class="${options.rubyClassName}"` : '';
  const rtClass = options?.rtClassName ? ` class="${options.rtClassName}"` : '';

  return text.replace(
    FURIGANA_REGEX,
    (_, kanji, reading) => `<ruby${rubyClass}>${kanji}<rt${rtClass}>${reading}</rt></ruby>`
  );
}

/**
 * Strips bracketed furigana to return pure text with Kanji only.
 * Example: "私[わたし]は学生[がくせい]です" -> "私は学生です"
 */
export function stripFurigana(text: string): string {
  if (!text) return '';
  return text.replace(FURIGANA_REGEX, '$1');
}

/**
 * Extracts only the kana/romaji readings, discarding the kanji.
 * Example: "私[わたし]は学生[がくせい]です" -> "わたしはがくせいです"
 */
export function extractReading(text: string): string {
  if (!text) return '';
  return text.replace(FURIGANA_REGEX, '$2');
}

/**
 * Parses a string containing 漢字[かんじ] syntax into React nodes with semantic <ruby> and <rt> tags.
 */
export function renderFurigana(
  text: string,
  options?: FuriganaRenderOptions
): React.ReactNode {
  if (!text) return null;

  // Split text into tokens: plain text vs kanji[reading] matches
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const regex = new RegExp(FURIGANA_REGEX);

  while ((match = regex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = regex.lastIndex;

    // Push preceding non-ruby text
    if (matchStart > lastIndex) {
      nodes.push(text.substring(lastIndex, matchStart));
    }

    const kanji = match[1];
    const reading = match[2];
    const key = `ruby-${matchStart}-${kanji}`;

    nodes.push(
      <ruby
        key={key}
        className={`ruby-text ${options?.rubyClassName || ''}`}
        style={{ rubyPosition: 'over' }}
      >
        {kanji}
        <rt
          className={`ruby-rt text-[0.62em] font-medium select-none text-red-500/90 dark:text-red-400/90 ${
            options?.rtClassName || ''
          }`}
        >
          {reading}
        </rt>
      </ruby>
    );

    lastIndex = matchEnd;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    nodes.push(text.substring(lastIndex));
  }

  return (
    <span className={`inline-block font-japanese leading-relaxed ${options?.className || ''}`}>
      {nodes}
    </span>
  );
}

/**
 * React Component for rendering Furigana text seamlessly.
 */
export const FuriganaText: React.FC<{
  text: string;
  className?: string;
  rubyClassName?: string;
  rtClassName?: string;
}> = ({ text, className, rubyClassName, rtClassName }) => {
  return <>{renderFurigana(text, { className, rubyClassName, rtClassName })}</>;
};

export default renderFurigana;
