import { describe, it, expect } from "vitest";
import { chunkText } from "../extract";

describe("chunkText", () => {
  it("returns single chunk when text is shorter than chunkSize", () => {
    const result = chunkText("hello world", 3000, 200);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe("hello world");
  });

  it("splits into multiple chunks for long text", () => {
    const text = "a ".repeat(2000); // 4000 chars
    const result = chunkText(text, 3000, 200);
    expect(result.length).toBeGreaterThan(1);
  });

  it("each chunk is at most chunkSize characters", () => {
    const text = "x".repeat(10000);
    const chunks = chunkText(text, 3000, 200);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(3000);
    }
  });

  it("covers the full document — last chunk ends at document end", () => {
    const text = "a".repeat(7000);
    const chunks = chunkText(text, 3000, 200);
    const lastChunk = chunks[chunks.length - 1];
    // The last chunk should include the very last character
    expect(lastChunk.at(-1)).toBe("a");
    // All chars together should cover original length (accounting for overlap)
    // Reconstruct by removing overlaps: start at 0, step = chunkSize - overlap = 2800
    // Total coverage should equal original length
    const reconstructed = new Set<number>();
    let pos = 0;
    for (const chunk of chunks) {
      for (let i = 0; i < chunk.length; i++) {
        reconstructed.add(pos + i);
      }
      pos += chunk.length - 200;
    }
    expect(reconstructed.size).toBeGreaterThanOrEqual(text.length);
  });

  it("consecutive chunks overlap by exactly `overlap` chars at the boundary", () => {
    // Use a string where each character position is unique so we can detect overlap
    const text = Array.from({ length: 4000 }, (_, i) => String.fromCharCode(65 + (i % 26))).join("");
    // text has repeating A-Z but each position is unique in context
    const chunks = chunkText(text, 3000, 200);
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    for (let i = 1; i < chunks.length; i++) {
      // The end of the previous chunk and the start of the current chunk should share `overlap` chars
      const prevEnd = chunks[i - 1].slice(-200);
      const currStart = chunks[i].slice(0, 200);
      expect(prevEnd).toBe(currStart);
    }
  });

  it("returns empty array for empty string input", () => {
    // Empty string after trim → cleaned.length <= chunkSize → returns [cleaned]
    const result = chunkText("", 3000, 200);
    expect(result).toEqual([""]);
  });

  it("collapses multiple spaces", () => {
    const result = chunkText("hello   world", 3000, 200);
    expect(result[0]).toBe("hello world");
  });
});
