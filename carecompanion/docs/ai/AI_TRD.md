# AI_TRD.md

# CareCompanion

## AI Technical Requirements Document

Version: 1.0

Status: Approved

Owner: AI Team

---

# Purpose

This document defines the architecture, implementation strategy, prompt engineering workflow, and integration design for the AI subsystem.

The AI subsystem is responsible for providing intelligent healthcare assistance while ensuring safety, consistency, and accessibility.

The AI communicates only through the Backend.

---

# Technology Stack

LLM

- Gemini 2.5 Flash

Programming Language

- Python

Framework

- FastAPI (Backend Integration)

Communication

- REST API

Prompt Management

- Markdown Prompt Templates

Report Processing

- PDF Parser
- OCR (Future)

---

# AI Architecture

The AI subsystem follows a modular architecture.

```

Frontend

↓

Backend

↓

AI Router

↓

AI Service

↓

Context Builder

↓

Prompt Builder

↓

Gemini API

↓

Safety Layer

↓

Response Formatter

↓

Backend

↓

Frontend

```

The frontend never communicates directly with Gemini.

---

# Project Structure

```

backend/

app/

ai/

│

├── prompts/

│ ├── system_prompt.md

│ ├── chat_prompt.md

│ ├── report_prompt.md

│ ├── wellness_prompt.md

│ └── medication_prompt.md

│

├── services/

│ ├── ai_service.py

│ ├── prompt_builder.py

│ ├── context_builder.py

│ ├── report_service.py

│ ├── formatter.py

│ └── safety.py

│

└── utils/

```

---

# AI Request Flow

```

User

↓

Backend Router

↓

AI Service

↓

Context Builder

↓

Prompt Builder

↓

Gemini

↓

Safety Check

↓

Formatter

↓

Backend Response

↓

Frontend

```

---

# AI Components

## Context Builder

Purpose

Collect relevant information before generating prompts.

Sources

- User Role
- Conversation
- Wellness Data
- Medication Information
- Uploaded Reports

Responsibilities

- Build user context
- Remove unnecessary information
- Keep prompts concise

---

## Prompt Builder

Purpose

Generate structured prompts.

Responsibilities

- Load template
- Inject context
- Inject user message
- Generate final prompt

Prompt templates should NEVER be hardcoded.

---

## Gemini Client

Purpose

Communicate with Gemini.

Responsibilities

- Send prompt
- Receive response
- Handle retries
- Handle API failures

---

## Safety Layer

Purpose

Ensure AI responses follow project rules.

Responsibilities

- Remove unsafe advice
- Prevent diagnosis
- Prevent prescriptions
- Detect hallucination risk
- Add medical disclaimer when required

---

## Response Formatter

Purpose

Convert Gemini output into frontend-friendly responses.

Responsibilities

- Clean formatting
- Short paragraphs
- Bullet lists
- Friendly language

---

# Prompt Architecture

Every prompt follows

```

System Prompt

↓

Context

↓

Task

↓

User Input

↓

Expected Output

```

---

# System Prompt

Contains

- AI Personality
- Behaviour Rules
- Medical Limitations
- Response Style

Loaded for every request.

---

# Context Injection

Include only relevant information.

Example

```

User Role

Current Medication

Today's Wellness

Recent Report Summary

Conversation History

```

Avoid sending unnecessary data.

---

# Prompt Templates

Required Templates

```

system_prompt.md

chat_prompt.md

report_prompt.md

wellness_prompt.md

medication_prompt.md

```

Each template has one responsibility.

---

# Conversation Management

Maintain only recent conversation context.

Recommended

Last 5–10 exchanges.

Avoid sending the entire conversation.

---

# Medical Report Pipeline

```

Upload Report

↓

Extract Text

↓

Clean Text

↓

Prompt Builder

↓

Gemini

↓

Summary

↓

Recommendations

↓

Frontend

```

---

# Wellness Pipeline

```

Wellness Data

↓

Prompt Builder

↓

Gemini

↓

Friendly Guidance

↓

Frontend

```

---

# Medication Pipeline

```

User Question

↓

Medication Context

↓

Prompt Builder

↓

Gemini

↓

Simple Explanation

↓

Frontend

```

---

# AI Output Format

Every AI response should contain

```json
{
  "reply": "",
  "tips": [],
  "warning": "",
  "disclaimer": ""
}
```

This keeps responses consistent.

---

# Error Handling

Possible Failures

- Gemini unavailable
- Timeout
- Invalid response
- Empty response

Fallback Response

"I'm unable to answer that right now. Please try again later or consult your healthcare provider if your concern is urgent."

---

# Performance Goals

Chat Response

<5 seconds

Report Analysis

<10 seconds

Prompt Construction

<100ms

---

# Security

Never expose

- API Keys
- Prompt Templates
- Internal Context

Never send

Passwords

JWT Tokens

Private backend data

to Gemini.

---

# Token Optimization

Keep prompts concise.

Remove duplicate information.

Avoid sending large reports directly.

Summarize context before prompting when needed.

---

# Future Enhancements

Conversation Memory

Voice Input

Regional Languages

Health Timeline Context

Personalized Coaching

---

# Dependencies

Backend

Gemini

Prompt Templates

API_SCHEMA.md

PROJECT_CONTEXT.md

---

# Definition of Done

AI implementation is complete when

✓ Prompt templates created

✓ Context Builder implemented

✓ Gemini integration complete

✓ Safety layer active

✓ Response formatter working

✓ Report analysis working

✓ AI follows personality guidelines

✓ Backend integration complete

---

End of Document
