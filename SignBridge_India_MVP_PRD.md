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

The MVP focuses on a practical communication bridge:

**ISL gesture → Computer Vision → Initial CNN-based recognition →
Confidence score → Sequence construction → AI language processing →
English / Hindi / Marathi text**

The wider platform extends beyond the recognition engine with ISL
learning and practice, QR-based service access, institutional
dashboards, assessment/certification and readiness monitoring.

The MVP intentionally uses a defined and validated set of supported ISL
sign/character classes. It does not claim unrestricted continuous ISL
translation, complete ISL vocabulary recognition, or full two-way
communication.

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
- Recognise a defined and validated set of supported ISL
  signs/characters.
- Return a prediction with a confidence score.
- Construct recognised outputs into a sequence.
- Use AI language processing to form coherent sentences.
- Generate output in English, Hindi or Marathi.
- Provide a simple interface for the non-ISL user.
- Demonstrate the workflow in a healthcare service scenario.
- Provide a foundation for institutional deployment.

## 5. Non-Goals

The initial MVP will not attempt:

- Complete unrestricted ISL translation
- Recognition of all 10,000+ dictionary terms
- Full continuous natural ISL understanding
- Full two-way communication
- Speech output as a core MVP dependency
- Every Indian language
- Every public-service sector
- Replacement of professional ISL interpreters
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
ISL USER
   ↓
Opens SignBridge
   ↓
Selects output language
   ↓
Starts camera
   ↓
Performs supported ISL gesture/sign
   ↓
Computer Vision
   ↓
Initial CNN-based recognition
   ↓
Prediction + confidence
   ↓
Sequence construction
   ↓
AI language processing
   ↓
Coherent message
   ↓
English / Hindi / Marathi
   ↓
NON-ISL USER UNDERSTANDS
```

## 8. Technical Architecture

### Recognition Pipeline

1.  **Input Capture:** Camera captures the user’s hand gestures.
2.  **Computer Vision:** The CV layer processes the camera input.
3.  **Initial CNN Recognition:** The CNN classifies supported
    signs/characters.
4.  **Confidence:** Each prediction receives a confidence score.
5.  **Sequence Construction:** Recognised outputs are maintained in
    order.
6.  **AI Language Processing:** The sequence is reconstructed into
    coherent language.
7.  **Multilingual Output:** The final message is displayed in English,
    Hindi or Marathi.

Example:

``` text
Gesture
  ↓
CNN
  ↓
Prediction: HELP
Confidence: 0.94
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

The MVP uses a **defined and validated set of supported ISL
sign/character classes**.

The existing 10,000-term ISL Dictionary is treated as a broader national
language/resource ecosystem, not as the number of initial CNN classes.

Expansion path:

``` text
Defined MVP classes
      ↓
Larger validated vocabulary
      ↓
Word-level recognition
      ↓
Temporal/sequence recognition
      ↓
Richer ISL understanding
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

The screen should show:

- Camera feed
- Recognition status
- Recognised sequence
- Confidence indication
- Generated message
- Output language
- Clear/retry controls

Example:

``` text
SIGNBRIDGE COMMUNICATION

Output Language: [ English ▼ ]

[ CAMERA FEED ]

Detected:
I → NEED → HELP

Generated Message:
"I need help."

[Clear] [Start Again]
```

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
| FR-13 | Basic ISL learning content is available.                       |
| FR-14 | Basic institutional training and usage metrics can be tracked. |
| FR-15 | Users/institutions can provide feedback.                       |

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

> I need help.

The MVP should focus on routine service communication and should not be
positioned as a medical diagnosis or clinical decision-making system.

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

## 19. 90-Day Development Plan

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

The main demo should be a healthcare reception interaction.

Example:

1.  Deaf/ISL user arrives at a hospital.
2.  Receptionist does not know ISL.
3.  User opens SignBridge or scans the institution QR code.
4.  User selects Marathi.
5.  User signs a supported request.
6.  Camera captures the gesture.
7.  CV processes the input.
8.  CNN predicts the sign.
9.  Confidence is shown.
10. Recognised outputs are assembled.
11. AI language processing creates the message.
12. Marathi text is shown to the receptionist.
13. The same message can be demonstrated in English and Hindi.

## 29. Product Positioning

Do **not** position SignBridge as:

> “An AI that translates Indian Sign Language.”

Position it as:

> **“A multilingual ISL communication and institutional accessibility
> platform.”**

The AI is the communication engine.

The product is the broader accessibility ecosystem.

## 30. Final Product Definition

> **SignBridge India is a multilingual ISL communication and
> institutional accessibility platform whose MVP converts a defined set
> of ISL gestures/characters captured through a camera into coherent
> English, Hindi or Marathi text using computer vision, an initial
> CNN-based recognition model, sequence construction and AI language
> processing. The broader platform combines this communication layer
> with ISL learning, service-point access, institutional dashboards,
> assessment and readiness monitoring, enabling immediate communication
> support while institutions progressively build long-term ISL
> capability.**

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
