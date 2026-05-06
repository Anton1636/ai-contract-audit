export function buildAuditPrompt(code: string): string {
	return `You are a senior smart contract security auditor combining methodologies from OpenZeppelin, CertiK, and Trail of Bits.

Analyze the following Solidity smart contract with the thoroughness of a professional audit firm.

SMART CONTRACT CODE:
\`\`\`solidity
${code}
\`\`\`

CRITICAL INSTRUCTIONS:
- Return ONLY a valid JSON object, no markdown, no explanation, no text before or after
- Every field must be present, use null for optional fields if not applicable
- Focus on these vulnerability categories (in order of frequency):
  1. Access control / permission issues
  2. Business logic / validation errors  
  3. Math / accounting errors (overflow, incorrect calculations)
  4. Reentrancy attacks
  5. State inconsistencies / race conditions
  6. Oracle / price manipulation
  7. Missing events / logging
  8. Integration risks (external contracts, dependencies)

SEVERITY DEFINITION (based on financial impact like real exploits):
- CRITICAL: Direct loss of funds possible, protocol can be drained (e.g. The DAO -$60M, Ronin Bridge -$625M)
- HIGH: Significant financial impact or system compromise possible
- MEDIUM: Limited impact or requires specific conditions to exploit
- LOW: Minor risk, edge cases, best practice violations
- INFO: Code quality, documentation, gas efficiency notes

FOR EACH VULNERABILITY PROVIDE:
- Description: what the problem is
- Impact: what an attacker can do (loss-based: "attacker could drain X ETH")
- Proof of Concept: step-by-step attack scenario
- Recommendation: how to fix with concrete Solidity code when possible
- Real world reference: actual hack that used this vector

Return this exact JSON:

{
  "score": <number 0-100>,
  "grade": <"A" | "B" | "C" | "D" | "F">,
  "summary": <string, 2-3 sentences executive summary like OpenZeppelin>,
  "contractName": <string>,
  "scope": <string, what was analyzed>,
  "vulnerabilities": [
    {
      "id": <number>,
      "severity": <"CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO">,
      "category": <"Access Control" | "Reentrancy" | "Math Error" | "Logic Error" | "State Issue" | "Oracle" | "Missing Events" | "Integration Risk" | "Code Quality">,
      "title": <string>,
      "description": <string>,
      "impact": <string, loss-based like "attacker could drain all ETH from contract">,
      "proofOfConcept": <string, step-by-step attack scenario>,
      "lineNumber": <number | null>,
      "codeSnippet": <string | null>,
      "recommendation": <string>,
      "fixedCode": <string | null>,
      "realWorldExample": <string | null, e.g. "The DAO hack 2016 — $60M drained using identical reentrancy pattern">
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
  "overallRecommendation": <string, 2-3 sentences final advice>,
  "auditedAt": <string, current ISO date>
}

SCORING (start at 100, deduct):
- CRITICAL: -25 each
- HIGH: -15 each
- MEDIUM: -8 each
- LOW: -3 each
- Minimum: 0

Be thorough. A real audit finds ALL issues, not just obvious ones.

CONSISTENCY RULES:
- Always assign the same severity to the same type of vulnerability
- CRITICAL reentrancy = always -25 points
- Do not vary scores between runs for identical code
- Be deterministic: same input must produce same score`
}

export function buildComparisonPrompt(
	originalCode: string,
	fixedCode: string,
): string {
	return `You are an expert smart contract security auditor.

Compare these two versions of a smart contract and determine if vulnerabilities were properly fixed.

ORIGINAL CONTRACT:
\`\`\`solidity
${originalCode}
\`\`\`

FIXED CONTRACT:
\`\`\`solidity
${fixedCode}
\`\`\`

Return ONLY valid JSON:

{
  "overallImprovement": <"Excellent" | "Good" | "Partial" | "Minimal" | "None">,
  "summary": <string, 2-3 sentences>,
  "fixedIssues": [
    {
      "title": <string>,
      "description": <string>
    }
  ],
  "remainingIssues": [
    {
      "title": <string>,
      "severity": <"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">,
      "description": <string>
    }
  ],
  "newIssues": [
    {
      "title": <string>,
      "severity": <"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">,
      "description": <string>
    }
  ],
  "scoreBefore": <number 0-100>,
  "scoreAfter": <number 0-100>
}`
}

export function buildExplainPrompt(
	vulnerabilityTitle: string,
	codeSnippet: string,
): string {
	return ''
}

export function buildChatPrompt(
	contractCode: string,
	auditReport: string,
	userMessage: string,
	chatHistory: { role: string; content: string }[],
): string {
	const history = chatHistory
		.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
		.join('\n')

	return `You are an expert smart contract security auditor. You have already analyzed the following contract and produced an audit report. Answer the user's questions about the contract and audit findings.

ANALYZED CONTRACT:
\`\`\`solidity
${contractCode}
\`\`\`

AUDIT REPORT SUMMARY:
${auditReport}

CONVERSATION HISTORY:
${history}

User: ${userMessage}

Provide a clear, technical but understandable answer. Reference specific line numbers or code snippets when relevant. If asked to show fixed code, provide complete corrected Solidity code.`
}
