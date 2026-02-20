import { useState, useEffect } from "react";

const SHEET_ID = "1u-Xfxob9htPe7uxU9Ik_RC-yoxCqZBdk0am5JO0Hou4";

export interface QuizQuestion {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct: string;
}

export interface MatchPair {
  left_item: string;
  right_item: string;
}

const parseSheetData = (raw: string): Record<string, string>[] => {
  try {
    // Strip JSONP wrapper
    const jsonStr = raw
      .replace(/^[^(]*\(/, "")
      .replace(/\);?\s*$/, "");
    const data = JSON.parse(jsonStr);
    const cols: { id: string; label: string }[] = data?.table?.cols ?? [];
    const rows: { c: ({ v: string | number | null; f?: string } | null)[] }[] = data?.table?.rows ?? [];

    // Build column label -> index map (use label first, fallback to id)
    const colMap: Record<string, number> = {};
    cols.forEach((col, i) => {
      if (col.label) colMap[col.label.trim().toLowerCase()] = i;
      if (col.id) colMap[col.id.trim().toLowerCase()] = i;
    });

    return rows.map((row) => {
      const obj: Record<string, string> = {};
      Object.entries(colMap).forEach(([key, idx]) => {
        const cell = row.c?.[idx];
        obj[key] = cell?.v?.toString()?.trim() ?? "";
      });
      return obj;
    });
  } catch (e) {
    console.error("Sheet parse error:", e);
    return [];
  }
};

export const useQuizQuestions = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=quiz_questions`;
    fetch(url)
      .then((r) => r.text())
      .then((raw) => {
        const parsed = parseSheetData(raw);
        const mapped: QuizQuestion[] = parsed
          .map((row) => ({
            question: row["question"] ?? "",
            option_a: row["option_a"] ?? "",
            option_b: row["option_b"] ?? "",
            option_c: row["option_c"] ?? "",
            option_d: row["option_d"] ?? "",
            correct: row["correct"] ?? "",
          }))
          .filter((q) => q.question.length > 0);
        setQuestions(mapped);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Quiz fetch error:", e);
        setError("Failed to fetch questions. Please check internet connection.");
        setLoading(false);
      });
  }, []);

  return { questions, loading, error };
};

export const useMatchPairs = () => {
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=match_pairs`;
    fetch(url)
      .then((r) => r.text())
      .then((raw) => {
        const parsed = parseSheetData(raw);
        const mapped: MatchPair[] = parsed
          .map((row) => ({
            left_item: row["left_item"] ?? "",
            right_item: row["right_item"] ?? "",
          }))
          .filter((p) => p.left_item.length > 0);
        setPairs(mapped);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Match fetch error:", e);
        setError("Failed to fetch pairs.");
        setLoading(false);
      });
  }, []);

  return { pairs, loading, error };
};
