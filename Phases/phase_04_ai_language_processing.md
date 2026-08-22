# Phase 4: AI Language Processing (AI Framing System)

**Status:** Planned  
**Module:** Natural Language Processing & Sentence Reconstruction  
**Dependencies:** Phase 3  

---

## 1. Phase Overview

Phase 4 builds the **AI Framing System**. It receives raw, unordered, or keyword-based ISL gesture sequences (e.g. `["WHERE", "REGISTRATION", "DESK"]`) and uses an LLM/NLP language service to reconstruct them into grammatically coherent, natural sentences (`"Where is the registration desk?"`).

---

## 2. Technical Architecture & Prompt Engineering

```
[ Raw Sequence Buffer ] ──> [ AI Language Service ] ──> [ LLM Engine (Gemini/Local NLP) ]
  ["I", "NEED", "HELP"]             │                                 │
                                    ▼                                 ▼
                         [ Context Injection ]              [ Output Validation ]
                         ("Healthcare Reception")            ("I need help.")
```

### System Prompt Structure
```text
You are the SignBridge AI Language Framing Engine.
Your task is to take a sequence of recognized Indian Sign Language (ISL) gestures and construct a single, grammatically correct, natural English sentence.

Rules:
1. Preserve the exact intended meaning of the ISL user.
2. Do NOT hallucinate medical diagnoses, extra instructions, or assumptions.
3. Keep sentences concise, polite, and contextual to a public service/healthcare scenario.
4. Output JSON containing the formatted text and confidence.

Input sequence: {sequence}
Context: {context_sector}
```

### API Payload Specification
```json
// POST /api/language/generate
{
  "sequence": ["WHERE", "REGISTRATION", "DESK"],
  "context": "healthcare_reception",
  "target_language": "en"
}
```

### API Response Specification
```json
{
  "formatted_text": "Where is the registration desk?",
  "raw_sequence": ["WHERE", "REGISTRATION", "DESK"],
  "processing_time_ms": 140,
  "status": "success"
}
```

---

## 3. Detailed Scope & Requirements

1. **Grammar & Syntax Reconstruction**:
   - Convert ISL gloss structures (often Object-Subject-Verb or keyword-based) into standard sentence syntax.
   - Example: `["DOCTOR", "APPOINTMENT", "TODAY"]` $\rightarrow$ `"I have a doctor's appointment today."`

2. **Hallucination Prevention & Guardrails**:
   - Strictly prevent LLM from fabricating medical symptoms, prescriptions, or clinical advice not present in the gesture sequence.

3. **Fallback Mechanism**:
   - If AI service times out or network is offline, provide rule-based template joiner:
     `sequence.join(" ")` + capitalization/punctuation (`"I NEED HELP."`).

4. **Contextual Sector Adapter**:
   - Support sector context parameters (e.g., `healthcare_reception`, `hospital_navigation`, `emergency_desk`).

---

## 4. Granular Deliverables

- [ ] **AI Language Service**: Build `backend/app/services/language_service.py` integrating Gemini API / LLM provider.
- [ ] **Prompt Engineering Matrix**: Create system prompt templates optimized for ISL gloss conversion.
- [ ] **API Endpoint**: Implement `POST /api/language/generate` route in `backend/app/api/routes/language.py`.
- [ ] **Offline Fallback Service**: Implement rule-based sequence string formatter for zero-network conditions.
- [ ] **Guardrail Unit Tests**: Test hallucination boundaries with edge-case sequences.

---

## 5. Exit Criteria & Verification

- [ ] Unordered ISL keyword sequences reliably convert to clear, natural sentences.
- [ ] Processing latency remains $< 500\text{ ms}$.
- [ ] Zero medical/clinical hallucination on test sequence benchmark dataset.
- [ ] Fallback mechanism activates smoothly when network connection is severed.
