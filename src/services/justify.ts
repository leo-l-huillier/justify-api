function justifyText(text: string, lineWidth: number = 80): string {

  let justifiedtext = "";
  
  let currentLineWords: string[] = [];
  let charCount = 0;

  for (const word of text.split(/\s+/)) {
    if (charCount + currentLineWords.length + word.length <= lineWidth) {
      currentLineWords.push(word);
      charCount += word.length;
    } else {
        justifiedtext += justifyLine(currentLineWords, lineWidth) + "\n";
        currentLineWords = [word];
        charCount = word.length;
    }
  }
  justifiedtext += justifyLine(currentLineWords, lineWidth, true); // Justify the last line as left-aligned

  return justifiedtext; // Placeholder return
}



function justifyLine(words: string[], lineWidth: number, lastLine: boolean = false): string {

  if (lastLine || words.length === 1) {
    return words.join(" ") + " ".repeat(lineWidth - words.join(" ").length);
  }

  const totalSpaces = lineWidth - words.reduce((sum, word) => sum + word.length, 0);
  const gapsNumber = words.length - 1;

  let extraSpaces = totalSpaces - gapsNumber; // spaces left after putting 1 space in each gap

  let result = "";
  for (const word of words) {
    result += word + " ";
    if (extraSpaces > 0) {
      result += " ";
      extraSpaces--;
    }
  }
  return result.trimEnd();
}



const input = `The sky above the port was the color of television 

tuned to a dead channel. It was a bright cold
day in April and the clocks were striking thirteen.
The quick brown fox jumps over the lazy dog and then just walked away slowly.`;


console.log("=".repeat(80));
console.log(input);
console.log("=".repeat(80));
console.log(justifyText(input));
console.log("=".repeat(80));

export default justifyText;
