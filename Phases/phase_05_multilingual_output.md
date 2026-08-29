# Phase 5: Multilingual Output (English, Hindi, Marathi)

**Status:** COMPLETED (MVP Live)  
**Module:** Translation & Multilingual Localization Layer  
**Dependencies:** Phase 4  

---

## 1. Phase Overview

Phase 5 enables **SignBridge India** to deliver translated text outputs in **English, Hindi, and Marathi**. It ensures ISL recognition remains strictly source-agnostic while the AI framing layer projects meaning accurately across target regional languages with proper script rendering (Devanagari Unicode).

---

## 2. Multilingual Architectural Strategy

```
                          ISL Sign Input
                                │
                                ▼
                       Recognition Engine
                                │
                                ▼
                         Sequence Buffer
                                │
                                ▼
                      AI Language Processing
                                │
                 ┌──────────────┼──────────────┐
                 ▼              ▼              ▼
              English         Hindi         Marathi
             "I need      "मुझे मदद      "मला मदतीची
              help."       चाहिए।"        गरज आहे."
```

### Multilingual Payload Contract
```json
{
  "sequence": ["I", "NEED", "HELP"],
  "output_languages": {
    "en": "I need help.",
    "hi": "मुझे मदद की आवश्यकता है।",
    "mr": "मला मदतीची गरज आहे।"
  },
  "active_language": "mr"
}
```

---

## 3. Detailed Scope & Requirements

1. **Target Output Support**:
   - **English (en)**: Standard English output.
   - **Hindi (hi)**: Devanagari script (`हिंदी`).
   - **Marathi (mr)**: Devanagari script (`मराठी`), ensuring regional dialect accuracy for the Pune healthcare pilot.

2. **Decoupled Language Architecture**:
   - Switching output languages must **never re-run model inference** or alter ISL keypoint classification logic.
   - Translation occurs entirely in the AI Framing Layer.

3. **Font & Unicode Rendering**:
   - Support high-readability Google Fonts (e.g., Noto Sans Devanagari / Inter) for crisp display on healthcare service monitors and kiosks.
   - Prevent text clipping, character distortion, or broken ligature renders.

4. **Dynamic Language Switcher**:
   - Allow instant switching between English, Hindi, and Marathi on the active communication screen.

---

## 4. Granular Deliverables

- [ ] **Multilingual Translation Module**: Extend `backend/app/services/language_service.py` to support multi-target prompts.
- [ ] **Language Selector Component**: Build `frontend/src/components/language/LanguageSelector.jsx` with visual language badges.
- [ ] **Devanagari Font Assets**: Integrate Google Fonts (`Noto Sans Devanagari`) into `frontend/src/styles/fonts.css`.
- [ ] **UI Dictionary Files**: Create `frontend/src/constants/translations.json` for static UI interface labels in English, Hindi, and Marathi.
- [ ] **Translation Verification Suite**: Test healthcare communication phrases across all 3 languages for grammatical correctness.

---

## 5. Exit Criteria & Verification

- [ ] The same ISL gesture sequence generates accurate output in English, Hindi, and Marathi.
- [ ] Language selection updates screen output instantly (<100 ms).
- [ ] Devanagari ligatures and characters render cleanly without broken symbols.
- [ ] Pune healthcare staff can understand Marathi output without ambiguity.
