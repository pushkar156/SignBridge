# Phase 8: ISL Learning & Practice Module

**Status:** POST-MVP ROADMAP  
**Module:** Staff Training & Interactive Practice  
**Dependencies:** Phase 7  

---

## 1. Phase Overview

Phase 8 introduces the **Capability Layer** of SignBridge India. It provides bite-sized, role-specific ISL learning content, interactive practice activities using real-time camera feedback, quizzes, and progress tracking for frontline hospital employees.

---

## 2. Learning Architecture & Experience

```
[ Frontline Staff Login ] ──> [ Select Role Module ] (Healthcare Receptionist)
                                      │
                                      ▼
                           [ Bite-Sized Video Lesson ]
                                      │
                                      ▼
                        [ Interactive Camera Practice ]
                        (Signs "HELP" → CV confirms sign)
                                      │
                                      ▼
                        [ Module Quiz & Progress Saved ]
```

---

## 3. Detailed Scope & Requirements

1. **Role-Specific Curriculum**:
   - Healthcare-focused mini-courses: *Basic ISL Greetings*, *Medical Registration Terms*, *Emergency Assistance Signs*.
   - Designed for 3-minute to 5-minute daily learning sessions on mobile/desktop.

2. **Interactive CV-Powered Practice**:
   - Uses the live recognition engine to grade staff gestures in real time.
   - Example: Prompt says "Sign HELP". Staff signs into camera $\rightarrow$ Model returns 92% confidence $\rightarrow$ System marks practice complete!

3. **Low-Data & Offline Support**:
   - Compress video tutorials (<5 MB per module) for low-bandwidth hospital networks.
   - Enable downloadable offline lesson assets.

4. **Staff Progress & Completion Badges**:
   - Track completed lessons, quiz scores, and practice accuracy.

---

## 4. Granular Deliverables

- [ ] **Learning Hub Page**: Build `frontend/src/pages/Learning/index.jsx` displaying course catalog.
- [ ] **Lesson Player Component**: Build `frontend/src/components/learning/LessonCard.jsx` with video and text guidance.
- [ ] **Interactive Practice Component**: Build `frontend/src/components/learning/PracticeCard.jsx` integrating real-time camera scoring.
- [ ] **Quiz Engine**: Build `frontend/src/components/learning/Quiz.jsx` for knowledge checks.
- [ ] **Progress Tracker API**: Implement `backend/app/services/training_service.py` to record staff progress in the database.
- [ ] **Course Data Schema**: Define lessons in `backend/app/models/training.py`.

---

## 5. Exit Criteria & Verification

- [ ] Hospital employee can complete a 3-minute ISL lesson end-to-end.
- [ ] Practice module correctly verifies user gesture using live camera feed.
- [ ] Employee training progress is accurately stored in the database.
- [ ] Lesson pages load smoothly under throttled 3G network conditions.
