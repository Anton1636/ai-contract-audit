// src/lib/prompts.ts

// Prompt for auditing a single contract
export function buildAuditPrompt(code: string): string {
	return `You are an expert smart contract security auditor with experience from firms like OpenZeppelin, Trail of Bits, and Certik.

Analyze the following Solidity smart contract and return a detailed security audit report.

SMART CONTRACT CODE:
\`\`\`solidity
${code}
\`\`\`

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, just JSON):

{
  "score": <number 0-100>,
  "grade": <"A" | "B" | "C" | "D" | "F">,
  "summary": <string, 2-3 sentences overview>,
  "contractName": <string, extracted from code or "Unknown">,
  "vulnerabilities": [
    {
      "id": <number>,
      "severity": <"CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO">,
      "title": <string>,
      "description": <string, detailed explanation>,
      "lineNumber": <number | null>,
      "codeSnippet": <string | null, the vulnerable code>,
      "recommendation": <string, how to fix>,
      "fixedCode": <string | null, corrected code snippet>,
      "realWorldExample": <string | null, real hack reference e.g. "The DAO hack 2016 used this exact vulnerability to drain $60M">
    }
  ],
  "gasOptimizations": [
    {
      "id": <number>,
      "title": <string>,
      "description": <string>,
      "lineNumber": <number | null>,
      "estimatedSaving": <string, e.g. "~2000 gas per call">,
      "fixedCode": <string | null>
    }
  ],
  "overallRecommendation": <string, 2-3 sentences final advice>
}

Scoring guide:
- Start at 100
- CRITICAL vulnerability: -25 points each
- HIGH: -15 points each
- MEDIUM: -8 points each
- LOW: -3 points each
- Minimum score: 0

Be thorough, accurate, and professional like a real audit report.`
}

// Prompt for comparing two versions of a contract
export function buildComparisonPrompt(
	originalCode: string,
	fixedCode: string,
): string {
	return '' // empty(
}

// Prompt for explaining a specific vulnerability
export function buildExplainPrompt(
	vulnerabilityTitle: string,
	codeSnippet: string,
): string {
	return '' // empty(
}
