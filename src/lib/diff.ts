export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumber: number;
}

export function computeDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  const result: DiffLine[] = [];

  const maxLen = Math.max(oldLines.length, newLines.length);
  let lineNum = 1;

  // Simple line-by-line diff
  const lcs = longestCommonSubsequence(oldLines, newLines);
  let oldIdx = 0;
  let newIdx = 0;
  let lcsIdx = 0;

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    if (
      lcsIdx < lcs.length &&
      oldIdx < oldLines.length &&
      newIdx < newLines.length &&
      oldLines[oldIdx] === lcs[lcsIdx] &&
      newLines[newIdx] === lcs[lcsIdx]
    ) {
      result.push({ type: "unchanged", content: oldLines[oldIdx], lineNumber: lineNum++ });
      oldIdx++;
      newIdx++;
      lcsIdx++;
    } else if (
      oldIdx < oldLines.length &&
      (lcsIdx >= lcs.length || oldLines[oldIdx] !== lcs[lcsIdx])
    ) {
      result.push({ type: "removed", content: oldLines[oldIdx], lineNumber: lineNum++ });
      oldIdx++;
    } else if (
      newIdx < newLines.length &&
      (lcsIdx >= lcs.length || newLines[newIdx] !== lcs[lcsIdx])
    ) {
      result.push({ type: "added", content: newLines[newIdx], lineNumber: lineNum++ });
      newIdx++;
    } else {
      break;
    }
  }

  return result;
}

function longestCommonSubsequence(a: string[], b: string[]): string[] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return result;
}

export function diffToString(diff: DiffLine[]): string {
  return diff
    .map((line) => {
      const prefix =
        line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
      return `${prefix} ${line.content}`;
    })
    .join("\n");
}
