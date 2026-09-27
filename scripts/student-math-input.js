const SIMPLE_INTEGER_POWER = /\^\(\s*([+-]?\d+)\s*\)/g;

export function normaliseStudentMathInput(value) {
  return String(value ?? "")
    .replace(/[−–—]/g, "-")
    .replace(SIMPLE_INTEGER_POWER, "^$1")
    .replace(/\+\s*-\s*/g, "-")
    .replace(/-\s*\+\s*/g, "-")
    .replace(/-\s*-\s*/g, "+");
}

export function formatStudentMathForDisplay(value) {
  return normaliseStudentMathInput(value)
    .replace(/sqrt\s*\(/gi, "√(")
    .replace(/\bpi\b/gi, "π")
    .replace(/\*/g, "×")
    .replace(/<=/g, "≤")
    .replace(/>=/g, "≥")
    .replace(/!=/g, "≠")
    .replace(/(?<!\^)-/g, "−");
}
