# SignBridge India - MVP Product Requirements Document

**Version:** 1.0  
**Status:** MVP Development  
**Programme:** YUVA Future 6.0 · Young Indians (Yi), CII  
**Track:** Accessibility  
**Problem Statement:** Indian Sign Language for All  
**Initial Pilot:** Healthcare, Pune  
**MVP Output Languages:** English, Hindi, Marathi

## 1. Executive Summary

SignBridge India is a multilingual Indian Sign Language (ISL)
communication and institutional accessibility platform. The immediate
problem is the communication barrier between ISL users and people who do
not understand ISL, particularly at essential public-service touchpoints
such as hospitals, government offices, banks, schools and other service
institutions.

The MVP focuses on a practical two-way communication bridge:

**Direction A: ISL → Text (Primary)**
ISL gesture → Computer Vision (MediaPipe) → CNN Character Recognition (35 classes: A-Z, 1-9) → Hold-to-Confirm Stabilization → Character/Word Sequence Assembly → AI Language Processing → English / Hindi / Marathi Text

**Direction B: Text → ISL Avatar (Reverse)**
Non-ISL User → Types message / selects predefined phrase → Language Processing → Supported ISL phrase mapping → Animated ISL Avatar → ISL User

The wider platform extends beyond the recognition engine with ISL learning and practice, QR-based service access, institutional dashboards, assessment/certification and readiness monitoring.

The MVP intentionally uses a defined and validated set of supported ISL sign/character classes and predefined healthcare phrases. It does not claim unrestricted continuous ISL translation, complete 10,000+ ISL vocabulary recognition, or unrestricted free-form natural language to continuous 3D ISL avatar generation.

## 2. Problem

ISL is officially recognised and India has growing ISL resources, but
communication barriers remain at public-service touchpoints. Many
frontline employees do not have sufficient ISL capability, while
professional interpreters are not available at every service point.

The practical gap is therefore not simply awareness. It is the lack of a
connected institutional ecosystem combining:

- Frontline ISL capability
- Point-of-service communication support
- Standardised assessment and readiness
- Institutional monitoring
- Adoption and incentive mechanisms

## 3. Product Vision

> Enable an ISL user to communicate with a non-ISL user immediately,
> while helping institutions progressively build long-term ISL
> capability.

SignBridge is a combination of:

**Communication Technology + Learning + Institutional Accessibility +
Readiness Measurement**

## 4. MVP Goals

The MVP must:

- Capture ISL gestures through a camera.
- Process input through computer vision.
- Recognise a defined and validated set of supported ISL signs/characters.
- Return a prediction with a confidence score.
- Construct recognised outputs into a sequence.
- Use AI language processing to form coherent sentences.
- Generate output in English, Hindi or Marathi.
- Provide a simple interface for the non-ISL user.
- Allow the non-ISL user to respond via typed text or predefined healthcare phrase buttons.
- Map responses to validated ISL phrase sequences and render an animated ISL Avatar.
- Demonstrate the two-way workflow in a healthcare service scenario.
- Provide a foundation for institutional deployment.

## 5. Non-Goals

The initial MVP will not attempt:

- Complete unrestricted ISL translation (both directions)
- Recognition of all 10,000+ dictionary terms
- Full continuous natural ISL understanding
- Unrestricted free-form natural-language to continuous 3D ISL avatar generation (fake/hallucinated signs)
- Speech output as a core MVP dependency
- Every Indian language
- Every public-service sector
- Replacement of professional ISL interpreters for complex medical diagnosis
- Complex national government integration
- Full enterprise certification infrastructure
- Large-scale rural deployment before core validation

These are future roadmap possibilities.

## 6. Target Users

### Primary Users

**ISL users** - Deaf citizens - Hard-of-hearing citizens - Other
citizens who communicate using ISL

**Non-ISL users** - Doctors - Nurses - Receptionists - Healthcare
support staff - Government service staff - Other frontline service
providers

### Initial Institutional Users

The MVP is healthcare-first, focusing on:

- Hospitals
- Healthcare institutions
- Reception desks
- Registration counters
- Appointment/help desks
- High-footfall healthcare service points

### Future Sectors

- Government offices
- Schools
- Banks
- Police
- Workplaces
- Other essential public services

## 7. Core User Journey

``` text
Direction A: ISL USER → NON-ISL USER
ISL USER
   ↓
Opens SignBridge (or scans QR code)
   ↓
Selects output language (English / Hindi / Marathi)
   ↓
Starts camera & performs ISL gesture
   ↓
Computer Vision (MediaPipe 84 keypoints)
   ↓
CNN-based recognition + confidence score (≥0.75)
   ↓
Sequence construction & AI language framing
   ↓
NON-ISL USER READS TEXT

Direction B: NON-ISL USER → ISL USER
NON-ISL USER
   ↓
Types message OR taps predefined healthcare button
   ↓
Language Processing & Phrase Matching
   ↓
Supported ISL phrase sequence mapping
   ↓
Animated ISL Avatar Player
   ↓
ISL USER UNDERSTANDS RESPONSE
```

## 8. Technical Architecture

### Recognition Pipeline

1. **Input Capture:** Camera captures live video frames.
2. **Computer Vision:** MediaPipe detects hands and crops the region of interest.
3. **CNN Character Classifier:** Classifies supported ISL characters (35 classes: `A-Z`, `1-9`).
4. **Confidence Scoring:** Each prediction returns a confidence score ($0.0 - 1.0$).
5. **Hold-to-Confirm Stabilization:** Requires identical class predictions across consecutive frames with confidence $\ge \text{threshold}$ before accepting into buffer.
6. **Pause-Based Word Boundary Detection:** A 1.0–1.5 second pause between gestures inserts a word space boundary (`HELP` + [pause] + `I` + [pause] + `NEED`).
7. **AI Language Processing:** The word sequence (`HELP I NEED`) is converted into a coherent sentence (*"I need help."*).
8. **Multilingual Output:** Displayed in English (primary for 3-day MVP), Hindi, or Marathi.

Example:

``` text
Gesture (H)
  ↓
MediaPipe Hand Crop
  ↓
CNN (35 Classes)
  ↓
Prediction: H (Confidence: 0.96)
  ↓
Hold-to-Confirm (3 Consecutive Frames)
  ↓
Buffer: [ H ]
```

A low-confidence result should trigger retry/clarification rather than
silently becoming part of the final sentence.

## 9. Multilingual Principle

ISL is the **source communication language**.

English, Hindi and Marathi are the **target output languages**.

``` text
                 ISL
                  ↓
        Sign Recognition
                  ↓
        Sequence / Meaning
                  ↓
       AI Language Processing
          ↙        ↓        ↘
      English     Hindi    Marathi
```

The target language should not affect the core ISL recognition layer.
This architecture allows additional Indian languages to be added later.

## 10. Vocabulary Strategy

The competition MVP uses **Kaggle ISL Dataset 1** consisting of **35 character-level classes**:
- Alphabets: `A` to `Z` (26 classes)
- Digits: `1` to `9` (9 classes, no `0`)

The ML model performs **character-level recognition** (`ISL sign → Character`). The application layer constructs words (`HELP`, `DOCTOR`, `APPOINTMENT`, `REGISTRATION`) and sentences from the stabilized character stream.

Expansion path:

``` text
35 Character MVP Classes (A-Z, 1-9)
      ↓
Word Assembly Layer (HELP, DOCTOR)
      ↓
Larger Validated Word Vocabulary
      ↓
Temporal/Sequence Sign Recognition
      ↓
Continuous ISL Understanding
```

Do not claim complete dictionary recognition unless it has actually been
implemented and validated.

## 11. Core Product Modules

### 11.1 ISL Communication Engine

- Camera capture
- Computer vision
- Gesture processing
- CNN inference
- Confidence scoring
- Sequence construction
- AI language processing
- Multilingual text generation

### 11.2 Language Selection

The user selects English, Hindi or Marathi. This changes the output
language only.

### 11.3 Communication Interface

The screen should provide a balanced dual-panel layout (or tabbed view on mobile):

``` text
SIGNBRIDGE COMMUNICATION
Hospital Service Desk

Output Language: [ English ▼ ]

┌────────────────────────────┬────────────────────────────┐
│   DIRECTION A: ISL → TEXT   │   DIRECTION B: TEXT → ISL  │
│                            │                            │
│   [ CAMERA FEED ]          │   Type Message:            │
│                            │   ┌──────────────────────┐ │
│   Detected Sequence:       │   │ Please wait here     │ │
│   I → NEED → HELP          │   └──────────────────────┘ │
│                            │   [ Show in ISL Avatar ]   │
│   Generated Message:       │                            │
│   "I need help."           │   Predefined Quick Buttons:│
│                            │   [ Please wait ]          │
│   [Clear] [Start Again]    │   [ Go to registration ]   │
│                            │   [ Your appointment ok ]  │
│                            │                            │
│                            │   [ ANIMATED AVATAR ]      │
│                            │   [▶ Play] [↻ Replay]      │
└────────────────────────────┴────────────────────────────┘
```

### 11.4 Two-Way ISL Avatar Communication Module

- **Input Methods**: Typed text input box or Quick Predefined Healthcare Buttons.
- **Controlled Phrase Library**: Predefined validated mappings for Reception, Registration, Appointment, Navigation, and General Assistance.
- **Phrase Service**: Maps selected or typed text to validated ISL animation sequences (`please_wait` → `PLEASE` → `WAIT` → `HERE`).
- **Avatar Player**: Renders animated ISL gestures with playback controls (`Play`, `Pause`, `Replay`).
- **Safety Fallback**: Rejects unvalidated text inputs or complex clinical queries with an interpreter escalation warning.

### 11.4 ISL Learning & Practice

- Bite-sized lessons
- Role-specific lessons
- Practice
- Quizzes
- Progress tracking
- Low-data access
- Offline/downloadable content where practical

### 11.5 QR-Based Service Access

Institutions can place SignBridge QR codes at reception, registration,
help desks and appointment counters. The QR code launches the
communication interface quickly.

### 11.6 Institution Dashboard

The dashboard should track:

- Staff enrollment
- Training progress
- Assessment progress
- Communication sessions
- Service-point status
- Readiness indicators
- Feedback

### 11.7 Assessment & ISL Readiness

The long-term flow is:

``` text
Training → Practice → Assessment → Readiness
```

The MVP should keep certification simple and focus on demonstrating
staff training, assessment and institutional readiness tracking.

### 11.8 Community Validation

ISL educators, Deaf-community representatives and relevant language
experts should validate:

- Supported signs
- Labels
- Communication flows
- Generated output
- User experience
- Cultural appropriateness

## 12. Functional Requirements

| ID    | Requirement                                                    |
|-------|----------------------------------------------------------------|
| FR-01 | User can grant camera access and view a live feed.             |
| FR-02 | System processes supported ISL gestures.                       |
| FR-03 | Recognition model classifies supported signs/characters.       |
| FR-04 | Each prediction includes a confidence score.                   |
| FR-05 | Low-confidence results trigger retry/clarification.            |
| FR-06 | Recognised outputs are maintained in sequence.                 |
| FR-07 | AI layer converts sequences into coherent text.                |
| FR-08 | Output is available in English, Hindi and Marathi.             |
| FR-09 | User can change output language.                               |
| FR-10 | Generated message is clearly displayed to the non-ISL user.    |
| FR-11 | User can clear the sequence and restart.                       |
| FR-12 | Institution-specific QR access can launch communication.       |
| FR-13 | Non-ISL user can enter text or select a predefined phrase.     |
| FR-14 | System maps supported text phrases to validated ISL sequences.|
| FR-15 | System renders animated ISL Avatar playback (Play/Pause/Replay).|
| FR-16 | UI provides Quick Predefined Buttons for healthcare scenarios.  |
| FR-17 | Unsupported/complex clinical queries display interpreter warning.|
| FR-18 | Basic ISL learning content is available.                       |
| FR-19 | Basic institutional training and usage metrics can be tracked. |
| FR-20 | Users/institutions can provide feedback.                       |

## 13. Non-Functional Requirements

### Accessibility

- High readability
- Clear typography
- Simple navigation
- Minimal cognitive load
- Large controls
- Clear visual status indicators

### Performance

Recognition should provide sufficiently responsive feedback for
practical interactions.

### Reliability

Uncertain recognition must not silently become an incorrect message.

### Privacy

Avoid unnecessary storage of raw video and unnecessary personal
information. Clearly communicate any data storage.

### Connectivity

The platform should be designed for low-data use, with downloadable
learning content where practical.

### Modularity

The recognition model must be replaceable without rebuilding the entire
application.

## 14. Healthcare Use Cases

### Reception

ISL user communicates:

> I need an appointment.

### Navigation

ISL user communicates:

> Where is the registration desk?

### Assistance

ISL user communicates:

### Assistance

ISL user communicates:

> I need help.

### Reverse Communication (Non-ISL → ISL Avatar)

Receptionist responds via Quick Button or Text:

> "Please wait here." → Avatar animates: **PLEASE → WAIT → HERE**  
> "Go to registration." → Avatar animates: **GO → REGISTRATION**

### Healthcare Safety Boundary

The MVP focus is strictly routine service communication (reception, registration, appointments, navigation, general assistance).

**Autonomous SignBridge Suitable**:
- Reception desk inquiries
- OPD registration guidance
- Appointment status checks
- Direction/navigation inside hospital
- Billing & pharmacy desk directions

**Interpreter Escalation Required (Not suitable for autonomous AI)**:
- Medical diagnosis & clinical consultations
- Informed consent & surgery risk explanations
- Complex treatment regimens & medication side-effects
- Emergency clinical triage

When complex medical phrasing is entered, SignBridge will display:
> *"For complex clinical communication, please escalate to a qualified ISL interpreter."*

## 15. Technical Stack Direction

The exact stack can be selected during implementation, but the
architecture should support:

### Frontend

- React / Next.js
- Or a simpler HTML/CSS/JavaScript implementation for a rapid MVP

### Computer Vision

- MediaPipe
- OpenCV
- Browser-compatible CV where practical

### Recognition

- Initial CNN classifier
- Future improved/temporal models

### AI Language Layer

A language-processing service/model capable of: - Sequence
reconstruction - Grammar correction - Coherent sentence generation -
Multilingual output

### Backend

A lightweight API/backend for: - Model inference - Institution data -
Training progress - Analytics - Feedback

### Database

Store only required: - User data - Institution data - Training
progress - Assessments - Metrics - Feedback

## 16. Model Interface

The recognition layer should expose a model-independent interface.

Example:

``` json
{
  "class": "HELP",
  "confidence": 0.94
}
```

Multiple predictions:

``` json
{
  "predictions": [
    {"class": "I", "confidence": 0.96},
    {"class": "NEED", "confidence": 0.91},
    {"class": "HELP", "confidence": 0.94}
  ]
}
```

The frontend should not depend on the internal implementation of the
model.

## 17. Model Evaluation

Measure actual:

- Overall accuracy
- Per-class performance
- Confusion matrix
- Confidence distribution
- False recognition cases
- Real-world camera performance

Also measure product-level outcomes:

- Communication success rate
- Retry rate
- Task completion
- User satisfaction

Do not use unverified accuracy claims.

## 18. Pilot Plan

### Initial Pilot

**3–5 Pune healthcare institutions**

### Pilot Flow

``` text
Build
  ↓
Validate
  ↓
Deploy
  ↓
Measure
  ↓
Improve
```

The pilot should include ISL/community validation and participating
frontline staff.

## 19. 3-Day Competition MVP & 90-Day Development Plan

### Urgent 3-Day Competition MVP Plan (Future 6.0 Round)

- **Day 1: ML Recognition & Webcam Pipeline**
  - Adapt pretrained reference pipeline (`BRO-CODES-HERE`) & fine-tune on 35-class Kaggle ISL dataset (`A-Z`, `1-9`).
  - MediaPipe hand cropping & image normalization.
  - Implement Hold-to-Confirm stabilization logic.
  - *Success Target*: Live webcam outputting a clean character stream (`H` `E` `L` `P`).

- **Day 2: SignBridge Core & English Framing**
  - Character buffer to word assembly (`HELP`).
  - Pause-based word boundary detection (1.2s pause).
  - LLM AI sentence framing layer (*"I need help."*).
  - Mobile-first Communication UI integration (English output focus).

- **Day 3: Demo Polish, Avatar & QR Standees**
  - Quick Predefined Healthcare Buttons (`Please wait`, `Go to registration`).
  - Reverse ISL Avatar animation player.
  - Hospital QR standee context routing.
  - Institutional readiness dashboard polish & regional language toggle (Hindi/Marathi).

---

### Broader 90-Day Institutional Pilot Plan

### Days 1–30: Build & Validate

Deliver: - Supported sign/character set - Dataset preparation - Initial
CNN model - Camera/CV pipeline - Basic recognition UI - Confidence
handling - Initial expert validation

### Days 31–60: Multilingual Integration

Deliver: - Sequence construction - AI language processing - English
output - Hindi output - Marathi output - Communication UI - QR access -
Basic training module

### Days 61–90: Healthcare Pilot

Deliver: - Pilot deployment - Staff onboarding - Communication access
points - Usage measurement - User feedback - Communication success
measurement - Institutional readiness measurement - Pilot case study

## 20. Proposed Pilot KPIs

| KPI                                 |           90-day target |
|-------------------------------------|------------------------:|
| Pilot institutions                  |                     3–5 |
| Frontline staff enrolled            |                100–150+ |
| Staff completing basic training     |                 75–100+ |
| Staff completing assessment         |                     50+ |
| Communication access points         |                   5–10+ |
| Supported communication sessions    |                    500+ |
| Communication success rate          |             ≥80% target |
| Citizen satisfaction                |           ≥80% positive |
| Institutions assessed for readiness |                     3–5 |
| Output languages                    | English, Hindi, Marathi |

These are proposed targets, not achieved results.

## 21. Institutional Adoption & Sustainability

SignBridge follows an institutional B2B/B2G/B2B2C model.

Potential funding/deployment sources:

- Government
- Public institutions
- CSR partners
- Institutional subscriptions/services

The citizen-facing communication service should remain free at the point
of service where deployed.

Conceptually:

``` text
Government / Institution / CSR
              ↓
       Funds deployment
              ↓
         SignBridge
              ↓
      Free citizen access
              ↓
        Accessibility
```

Do not implement payments in the MVP.

## 22. Scalability

``` text
Pune Healthcare Pilot
        ↓
Pune Healthcare Network
        ↓
Maharashtra Healthcare
        ↓
Tier 2/3 Cities
        ↓
Government Services
        ↓
Education / Banks / Police / Workplaces
        ↓
National Rollout
```

The institutional platform should scale independently from the evolving
recognition model.

## 23. Differentiation

SignBridge’s innovation is not simply the use of AI.

It combines three layers:

### Layer 1: Communication

**ISL → English/Hindi/Marathi**

### Layer 2: Capability

**Learn → Practice → Assess**

### Layer 3: Institution

**Service Access → Dashboard → Readiness**

The unique unlock is:

> **Move from “ISL learning as an individual activity” to “ISL readiness
> as an institutional capability.”**

SignBridge complements existing ISL resources, learning content and
professional interpreter services. It does not replace professional
interpreters.

## 24. Policy Alignment

The broader solution supports the proposed:

> **National ISL Accessibility & Readiness Standard**

The proposed standard can include:

- Role-based ISL training
- Standardised assessment
- Point-of-service communication support
- Institutional readiness
- Monitoring
- Incentives/recognition

SignBridge is a technology-enabled implementation layer, not the policy
itself.

## 25. Future Roadmap

### V2

- Larger validated vocabulary
- Improved sequence recognition
- Better contextual language processing
- Text-to-speech
- Improved learning
- Expanded analytics

### V3

- Two-way communication
- Speech/text → ISL
- More Indian languages
- More sectors
- More Tier 2/3 deployments

### Long Term

- National institutional readiness network
- Advanced ISL language understanding
- Larger validated vocabulary
- Expanded accessibility infrastructure
- Policy-linked institutional adoption

## 26. Development Priorities

Build in this order:

1.  Camera interface
2.  Real recognition model integration
3.  Confidence handling
4.  Sequence construction
5.  AI language processing
6.  English/Hindi/Marathi output
7.  Communication UI polish
8.  QR access
9.  Basic learning module
10. Basic institutional dashboard
11. Assessment/readiness
12. Advanced analytics

Do not build low-priority institutional features before the core
communication flow is functional.

## 27. MVP Acceptance Criteria

The MVP is functional when:

- Camera access works.
- Live gesture input reaches the recognition system.
- Supported classes can be recognised.
- Predictions include confidence.
- Low-confidence results can be retried.
- Multiple predictions form a sequence.
- The sequence becomes a coherent sentence.
- English output works.
- Hindi output works.
- Marathi output works.
- The non-ISL user can clearly understand the generated message.
- The healthcare interaction can be demonstrated end-to-end.
- The product does not falsely claim complete ISL translation.
- The recognition model can be replaced without redesigning the entire
  application.

## 28. Primary Demo

The main demo should be a two-way healthcare reception interaction.

Example:

1. **Step 1 (ISL → Text)**:
   - Deaf/ISL user arrives at hospital OPD desk.
   - User scans QR code on desk standee.
   - User selects Marathi (मराठी).
   - User signs: `I` `NEED` `APPOINTMENT`.
   - Camera captures gesture → MediaPipe extracts 84 keypoints → CNN model recognizes signs with confidence (>0.90).
   - AI language framing layer creates Marathi sentence: *"मला अपॉइंटमेंट हवी आहे."* (English: *"I need an appointment."*).
   - Text displays on screen for receptionist.

2. **Step 2 (Text → ISL Avatar Response)**:
   - Receptionist taps Quick Button: `[ Please wait here ]`.
   - System maps phrase to validated sequence: `PLEASE` → `WAIT` → `HERE`.
   - Animated Avatar plays ISL gesture sequence.
   - Deaf user views avatar on phone/screen and understands response.

3. **Step 3 (Navigation Response)**:
   - Receptionist taps Quick Button: `[ Go to registration ]`.
   - Avatar plays sequence: `GO` → `REGISTRATION`.
   - Proves reliable end-to-end two-way communication.

## 29. Product Positioning

Do **not** position SignBridge as:

> “An AI that translates Indian Sign Language.”

Position it as:

> **“A multilingual ISL communication and institutional accessibility
> platform.”**

The AI is the communication engine.

The product is the broader accessibility ecosystem.

## 30. Final Product Definition

> **SignBridge India is a multilingual ISL communication and institutional accessibility platform. Its MVP provides a healthcare-focused two-way communication bridge: converting camera-captured ISL gestures into coherent English, Hindi, or Marathi text (Direction A), and converting non-ISL staff responses into validated ISL sign sequences rendered by an animated avatar (Direction B). The broader platform combines this two-way communication layer with ISL micro-learning, service-point QR access, institutional dashboards, assessment, and readiness monitoring, enabling immediate communication support while institutions progressively build long-term ISL capability.**

## 31. Guiding Development Principle

> **Build the smallest real product that proves the communication
> loop.**

The first milestone is:

``` text
ISL USER
   ↓
CAMERA
   ↓
REAL RECOGNITION
   ↓
CONFIDENCE
   ↓
SEQUENCE
   ↓
AI LANGUAGE PROCESSING
   ↓
ENGLISH / HINDI / MARATHI
   ↓
NON-ISL USER
```

Once this works reliably, expand the institutional ecosystem around it.
