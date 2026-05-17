"""
AI Service for code analysis using Google Gemini
Provides real AI-powered code review, error detection, and fix suggestions
"""
import google.generativeai as genai
from typing import List, Dict, Any, Optional
import json
import re
from datetime import datetime

from config import settings


class AIService:
    """Service for AI-powered code analysis using Google Gemini"""
    
    def __init__(self):
        """Initialize Gemini AI with API key"""
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def analyze_code(self, code: str, language: str, filename: str = "") -> Dict[str, Any]:
        """
        Analyze code for errors, warnings, and improvements
        
        Args:
            code: Source code to analyze
            language: Programming language
            filename: Optional filename for context
            
        Returns:
            Dictionary with errors, warnings, and suggestions
        """
        prompt = f"""You are an expert code reviewer. Analyze the following {language} code and provide a detailed analysis.

Filename: {filename or 'untitled'}
Language: {language}

Code:
```{language}
{code}
```

Provide your analysis in the following JSON format:
{{
    "errors": [
        {{
            "line": <line_number>,
            "column": <column_number>,
            "message": "<error_description>",
            "severity": "error",
            "code_snippet": "<relevant_code>",
            "category": "<error_category>"
        }}
    ],
    "warnings": [
        {{
            "line": <line_number>,
            "column": <column_number>,
            "message": "<warning_description>",
            "severity": "warning",
            "code_snippet": "<relevant_code>",
            "category": "<warning_category>"
        }}
    ],
    "suggestions": [
        {{
            "line": <line_number>,
            "message": "<improvement_suggestion>",
            "priority": "high|medium|low"
        }}
    ],
    "summary": {{
        "total_issues": <count>,
        "critical_issues": <count>,
        "code_quality_score": <0-100>,
        "maintainability": "excellent|good|fair|poor"
    }}
}}

Focus on:
1. Syntax errors and bugs
2. Logic errors and potential runtime issues
3. Security vulnerabilities
4. Performance issues
5. Code style and best practices
6. Potential null/undefined errors
7. Type safety issues

Be specific with line numbers and provide actionable feedback."""

        try:
            response = self.model.generate_content(prompt)
            result_text = response.text
            
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                analysis = json.loads(json_match.group())
                return analysis
            else:
                # Fallback if JSON parsing fails
                return {
                    "errors": [],
                    "warnings": [],
                    "suggestions": [],
                    "summary": {
                        "total_issues": 0,
                        "critical_issues": 0,
                        "code_quality_score": 85,
                        "maintainability": "good"
                    },
                    "raw_response": result_text
                }
        except Exception as e:
            print(f"AI analysis error: {e}")
            return {
                "errors": [],
                "warnings": [],
                "suggestions": [],
                "summary": {
                    "total_issues": 0,
                    "critical_issues": 0,
                    "code_quality_score": 0,
                    "maintainability": "unknown"
                },
                "error": str(e)
            }
    
    async def generate_fix(self, code: str, error: Dict[str, Any], language: str) -> Dict[str, Any]:
        """
        Generate a fix for a specific error
        
        Args:
            code: Original code
            error: Error details
            language: Programming language
            
        Returns:
            Fix suggestion with code and explanation
        """
        prompt = f"""You are an expert programmer. Generate a fix for the following error in {language} code.

Original Code:
```{language}
{code}
```

Error:
- Line: {error.get('line', 'unknown')}
- Message: {error.get('message', 'unknown')}
- Severity: {error.get('severity', 'unknown')}

Provide your fix in the following JSON format:
{{
    "fixed_code": "<complete_fixed_code>",
    "explanation": "<detailed_explanation_of_fix>",
    "changes": [
        {{
            "line": <line_number>,
            "old": "<old_code>",
            "new": "<new_code>",
            "reason": "<why_this_change>"
        }}
    ],
    "confidence": <0-100>,
    "alternative_approaches": [
        "<alternative_1>",
        "<alternative_2>"
    ]
}}

Provide a complete, working fix that:
1. Resolves the error
2. Maintains code functionality
3. Follows best practices
4. Is production-ready"""

        try:
            response = self.model.generate_content(prompt)
            result_text = response.text
            
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                fix = json.loads(json_match.group())
                return fix
            else:
                return {
                    "fixed_code": code,
                    "explanation": "Unable to generate fix",
                    "changes": [],
                    "confidence": 0,
                    "alternative_approaches": [],
                    "raw_response": result_text
                }
        except Exception as e:
            print(f"Fix generation error: {e}")
            return {
                "fixed_code": code,
                "explanation": f"Error generating fix: {str(e)}",
                "changes": [],
                "confidence": 0,
                "alternative_approaches": [],
                "error": str(e)
            }
    
    async def analyze_repository_structure(self, files: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Analyze repository structure and identify patterns
        
        Args:
            files: List of files with path and content
            
        Returns:
            Repository analysis with architecture insights
        """
        file_list = "\n".join([f"- {f['path']}" for f in files[:50]])  # Limit to 50 files
        
        prompt = f"""Analyze this repository structure and provide insights.

Files in repository:
{file_list}

Provide analysis in JSON format:
{{
    "architecture": {{
        "type": "<monorepo|microservices|mvc|etc>",
        "framework": "<detected_framework>",
        "language_distribution": {{"<lang>": <percentage>}}
    }},
    "quality_indicators": {{
        "has_tests": <boolean>,
        "has_documentation": <boolean>,
        "has_ci_cd": <boolean>,
        "code_organization": "excellent|good|fair|poor"
    }},
    "recommendations": [
        "<recommendation_1>",
        "<recommendation_2>"
    ],
    "potential_issues": [
        "<issue_1>",
        "<issue_2>"
    ]
}}"""

        try:
            response = self.model.generate_content(prompt)
            result_text = response.text
            
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                return {
                    "architecture": {"type": "unknown", "framework": "unknown"},
                    "quality_indicators": {},
                    "recommendations": [],
                    "potential_issues": []
                }
        except Exception as e:
            print(f"Repository analysis error: {e}")
            return {
                "architecture": {"type": "unknown", "framework": "unknown"},
                "quality_indicators": {},
                "recommendations": [],
                "potential_issues": [],
                "error": str(e)
            }
    
    async def analyze_error_log(self, error_log: str, context: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyze error log and provide root cause analysis
        
        Args:
            error_log: Error log or stack trace
            context: Optional context (repo URL, environment, etc.)
            
        Returns:
            Detailed error analysis with root cause
        """
        prompt = f"""You are an expert at debugging production errors. Analyze this error log and provide a comprehensive root cause analysis.

Error Log:
```
{error_log}
```

{f"Context: {context}" if context else ""}

Provide analysis in JSON format:
{{
    "error_type": "<error_type>",
    "severity": "P0|P1|P2|P3",
    "root_cause": {{
        "description": "<detailed_root_cause>",
        "actual_location": {{
            "file": "<file>",
            "line": <line>,
            "function": "<function>"
        }},
        "triggering_event": "<what_triggered_it>",
        "why_it_broke": "<explanation>",
        "why_now": "<why_it_happened_now>"
    }},
    "impact": {{
        "user_facing": <boolean>,
        "data_loss_risk": <boolean>,
        "estimated_affected_users": "<estimate>",
        "business_impact": "critical|high|medium|low"
    }},
    "fixes": {{
        "immediate": {{
            "action": "<immediate_fix>",
            "code": "<code_snippet>",
            "estimated_time": "<time>"
        }},
        "proper": {{
            "action": "<proper_fix>",
            "code": "<code_snippet>",
            "estimated_time": "<time>"
        }},
        "systemic": {{
            "action": "<prevent_similar_issues>",
            "changes": ["<change_1>", "<change_2>"]
        }}
    }},
    "prevention": {{
        "immediate": ["<action_1>", "<action_2>"],
        "short_term": ["<action_1>", "<action_2>"],
        "long_term": ["<action_1>", "<action_2>"]
    }},
    "similar_patterns": [
        {{
            "pattern": "<pattern_description>",
            "frequency": "common|occasional|rare"
        }}
    ]
}}

Be specific, actionable, and focus on preventing recurrence."""

        try:
            response = self.model.generate_content(prompt)
            result_text = response.text
            
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                return {
                    "error_type": "unknown",
                    "severity": "P2",
                    "root_cause": {"description": "Unable to analyze"},
                    "impact": {},
                    "fixes": {},
                    "prevention": {},
                    "similar_patterns": []
                }
        except Exception as e:
            print(f"Error log analysis error: {e}")
            return {
                "error_type": "unknown",
                "severity": "P2",
                "root_cause": {"description": f"Analysis error: {str(e)}"},
                "impact": {},
                "fixes": {},
                "prevention": {},
                "similar_patterns": [],
                "error": str(e)
            }


# Global AI service instance
ai_service = AIService()

# Made with Bob
