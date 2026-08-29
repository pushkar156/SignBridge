# Phase 7: Healthcare Service Workflow & QR Entry

**Status:** POST-MVP ROADMAP  
**Module:** Point-of-Service Integration & Healthcare Workflows  
**Dependencies:** Phase 6  

---

## 1. Phase Overview

Phase 7 tailors the Core Communication MVP specifically to **Healthcare Public-Service Points** (Hospitals, Registration Desks, Help Counters in Pune). It introduces institution-branded QR code entry points for immediate citizen access and pre-configures routine healthcare service communication scenarios.

---

## 2. Point-of-Service User Flow

```
[ Citizen Scans Service Point QR Code ]
                  │
                  ▼
[ Launches SignBridge with Service Point Context ]
(e.g., "KEM Hospital Pune - Registration Counter #3")
                  │
                  ▼
[ Selects Target Language: Marathi / Hindi / English ]
                  │
                  ▼
[ Performs Healthcare Request Signs ]
("I need doctor appointment", "Where is blood test lab?")
                  │
                  ▼
[ Reception Staff Reads Clean Message & Responds ]
```

---

## 3. Detailed Scope & Requirements

1. **Service Point Identity & QR Routing**:
   - Dynamic URL structure: `https://signbridge.in/c?inst=pune_kem&sp=reg_03`
   - Automatically pre-loads institutional branding and department context.

2. **Healthcare Communication Quick-Packs**:
   - Optimized sequence templates for high-footfall scenarios:
     - **Registration**: Appointment requests, OPD slip issuance.
     - **Navigation**: Locating labs, pharmacy, radiology, wards.
     - **Assistance**: Emergency support, wheelchair requests.

3. **Frontline Staff Display Mode**:
   - Flip-screen view / Dual-view option allowing non-ISL staff to read large text while citizen signs into camera.

4. **Privacy & Security Safeguards**:
   - Zero video recording or raw video frame storage on server.
   - Session data anonymized for basic institutional analytics.

---

## 4. Granular Deliverables

- [ ] **QR Code Generator Tool**: Build script/service to generate institution-specific QR standee graphics (`scripts/generate_qr_codes.py`).
- [ ] **Contextual Entry Route**: Build `/c` route in `frontend/src/pages/Communication/QRRoute.jsx` reading query params.
- [ ] **Service Point Metadata Service**: Implement `backend/app/services/institution_service.py` to resolve service point profiles.
- [ ] **Healthcare Phrase Packs**: Create pre-configured prompt contexts in `data/samples/healthcare_phrases.json`.
- [ ] **Dual-View Staff Interface**: Add "Reception Staff Mode" with high-legibility text cards.

---

## 5. Exit Criteria & Verification

- [ ] Scanning a hospital QR standee opens the communication UI in under 2 seconds.
- [ ] Service point name ("Pune City Hospital - Counter 2") displays prominently on screen.
- [ ] Routine healthcare communication scenarios (Appointments, Navigation, Help) complete successfully in demo trials.
- [ ] Zero video data is saved to server storage during live sessions.
