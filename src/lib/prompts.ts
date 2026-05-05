export function buildAuditPrompt(code: string): string {
	return `You are an expert smart contract security auditor with experience from firms like OpenZeppelin, Trail of Bits, and Certik.

Analyze the following Solidity smart contract and return a detailed security audit report.

CRITICAL INSTRUCTIONS:
- Return ONLY a valid JSON object, no markdown, no explanation, no text before or after
- Every field in the JSON must be present, use null for optional fields if not applicable
- Be thorough and accurate like a professional audit firm
- Reference real-world hacks where applicable (The DAO 2016, Ronin Bridge 2022, etc.)

SMART CONTRACT CODE:
\`\`\`solidity
${code}
\`\`\`

Return this exact JSON structure:

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
      "codeSnippet": <string | null>,
      "recommendation": <string>,
      "fixedCode": <string | null>,
      "realWorldExample": <string | null>
    }
  ],
  "gasOptimizations": [
    {
      "id": <number>,
      "title": <string>,
      "description": <string>,
      "lineNumber": <number | null>,
      "estimatedSaving": <string>,
      "fixedCode": <string | null>
    }
  ],
  "overallRecommendation": <string>
}

Scoring guide:
- Start at 100
- CRITICAL vulnerability: -25 points each
- HIGH: -15 points each
- MEDIUM: -8 points each
- LOW: -3 points each
- Minimum score: 0`
}

export function buildComparisonPrompt(
	originalCode: string,
	fixedCode: string,
): string {
	return ''
}

export function buildExplainPrompt(
	vulnerabilityTitle: string,
	codeSnippet: string,
): string {
	return ''
}
