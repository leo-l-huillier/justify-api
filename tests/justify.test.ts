import { justifyText, justifyLine } from '../src/services/justify';

describe('justifyText', () => {
  it('should return a single short line as-is (left aligned)', () => {
    const result = justifyText('hello world');
    expect(result).toBe('hello world' + ' '.repeat(69)); // sans \n
    });

  it('should justify a line to exactly 80 characters', () => {
    const lines = justifyText('The sky above the port was the color of television tuned to a dead channel.')
      .split('\n')
      .filter(Boolean);
    
    lines.forEach(line => {
      expect(line.length).toBe(80);
    });
  });

  it('should handle multiple words on multiple lines', () => {
    const text = 'word '.repeat(100).trim();
    const lines = justifyText(text).split('\n').filter(Boolean);
    expect(lines.length).toBeGreaterThan(1);
  });
  
  it('should handle text with leading/trailing blank lines', () => {
    const result = justifyText('\n\nhello world\n\n');
    expect(result).toContain('hello world');
  });

  it('should justify a line with exactly one word that is not the last line', () => {
    // a single very long word forces a line by itself, not as the last line
    const longWord = 'a'.repeat(80);
    const result = justifyText(`${longWord}\nhello world`);
    expect(result).toContain(longWord);
  });

  it('should justify a line without lastLine parameter (default false)', () => {
    const result = justifyLine(['hello', 'world', 'foo'], 20);
    expect(result.length).toBe(20);
  });
});