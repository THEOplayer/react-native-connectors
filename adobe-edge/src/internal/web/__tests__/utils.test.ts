import { sanitisePlayhead } from '../Utils';

describe('sanitisePlayhead', () => {
  it('returns 0 for undefined or NaN playhead', () => {
    expect(sanitisePlayhead(undefined, 120)).toBe(0);
    expect(sanitisePlayhead(NaN, 120)).toBe(0);
  });

  it('returns 0 for undefined, NaN or zero media length', () => {
    expect(sanitisePlayhead(42, undefined)).toBe(0);
    expect(sanitisePlayhead(42, NaN)).toBe(0);
    expect(sanitisePlayhead(42, 0)).toBe(0);
  });

  it('truncates a normal VOD playhead', () => {
    expect(sanitisePlayhead(42.9, 120)).toBe(42);
  });

  it('clamps a playhead exceeding the Adobe VA Edge range', () => {
    // Samsung Tizen reports the live playhead as an absolute presentation timestamp.
    expect(sanitisePlayhead(1754928000, 14400)).toBe(86400);
  });

  it('clamps a negative playhead', () => {
    expect(sanitisePlayhead(-10, 120)).toBe(0);
  });

  it('keeps a playhead at the range boundaries', () => {
    expect(sanitisePlayhead(0.5, 120)).toBe(0);
    expect(sanitisePlayhead(86400, 86400)).toBe(86400);
  });

  it('returns the current second of the day for live content', () => {
    const playhead = sanitisePlayhead(1754928000, Infinity);
    const now = new Date();
    const secondOfDay = now.getSeconds() + 60 * (now.getMinutes() + 60 * now.getHours());
    expect(playhead).toBeGreaterThanOrEqual(0);
    expect(playhead).toBeLessThanOrEqual(86400);
    // Allow a few seconds of drift between the two Date() reads.
    expect(Math.abs(playhead - secondOfDay)).toBeLessThanOrEqual(2);
  });
});
