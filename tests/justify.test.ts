import { justifyText } from '../src/services/justify';

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
});