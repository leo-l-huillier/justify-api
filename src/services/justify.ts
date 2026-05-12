export function justifyText(text: string, lineWidth: number = 80): string {
  // Split into paragraphs on blank lines, preserving single newlines
  const paragraphs = text.split(/\n{2,}/);

  const justifiedParagraphs = paragraphs.map(paragraph => {
    // Within a paragraph, treat single newlines as spaces
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '';

    const lines: string[][] = [];
    let currentLineWords: string[] = [];
    let charCount = 0;

    for (const word of words) {
      if (charCount + currentLineWords.length + word.length <= lineWidth) {
        currentLineWords.push(word);
        charCount += word.length;
      } else {
        lines.push(currentLineWords);
        currentLineWords = [word];
        charCount = word.length;
      }
    }
    lines.push(currentLineWords); // last line

    return lines.map((lineWords, index) => {
      const isLastLine = index === lines.length - 1;
      return justifyLine(lineWords, lineWidth, isLastLine);
    }).join('\n');
  });

  return justifiedParagraphs.join('\n\n');
}

export function justifyLine(words: string[], lineWidth: number, lastLine: boolean = false): string {
  if (lastLine || words.length === 1) {
    return words.join(" ") + " ".repeat(lineWidth - words.join(" ").length);
  }

  const totalSpaces = lineWidth - words.reduce((sum, word) => sum + word.length, 0); //nb d'espaces à répartir
  const gapsNumber = words.length - 1; // nb de gaps entre les mots
  const baseSpaces = Math.floor(totalSpaces / gapsNumber); // nb d'espaces de base à ajouter entre chaque mot
  const extraSpaces = totalSpaces % gapsNumber; // nb d'espaces supplémentaires à ajouter aux premiers gaps

  let result = "";
  for (let i = 0; i < words.length; i++) {
    result += words[i];
    if (i < gapsNumber) {
      result += " ".repeat(baseSpaces + (i < extraSpaces ? 1 : 0));
    }
  }
  return result;
}