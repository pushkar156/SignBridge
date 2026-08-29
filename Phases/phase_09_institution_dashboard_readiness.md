# Phase 9: Institution Dashboard & Readiness Monitoring

**Status:** POST-MVP ROADMAP  
**Module:** Institutional Analytics & Admin Dashboard  
**Dependencies:** Phase 8  

---

## 1. Phase Overview

Phase 9 builds the **Institutional Platform Layer**—the key differentiator of SignBridge India. It gives hospital administrators a dashboard to track staff enrollment, ISL training completion rates, active service point QR standees, communication session volume, and calculate an overall **Institutional ISL Readiness Score**.

---

## 2. Dashboard Architecture & Metrics

```
┌────────────────────────────────────────────────────────┐
│             PUNE CITY HOSPITAL - ISL DASHBOARD         │
│                                                        │
│ Institutional Readiness Score: [ 84 / 100 ] ★★★☆       │
│                                                        │
│ ┌────────────────┐ ┌────────────────┐ ┌──────────────┐ │
│ │ Enrolled Staff │ │ Training Done  │ │ Total Sessions│ │
│ │     120        │ │   88 (73%)    │ │    1,420     │ │
│ └────────────────┘ └────────────────┘ └──────────────┘ │
│                                                        │
│ Service Points Active:                                 │
│ • OPD Registration Desk #1  [ Active - QR Standee ]   │
│ • Emergency Reception      [ Active - QR Standee ]   │
│ • Pharmacy Counter #3      [ Active - QR Standee ]   │
│                                                        │
│ Staff Readiness Leaderboard & Department Breakdown     │
└────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Scope & Requirements

1. **Institution Management**:
   - Hospital administrator login, profile configuration, and service point management.

2. **Staff Enrollment & Monitoring**:
   - Bulk staff onboarding, department tagging (e.g. *Reception*, *Nursing*, *OPD*, *Billing*).
   - Real-time training completion percentages and assessment scores.

3. **Institutional Readiness Algorithm**:
   - Compute Readiness Score based on:
     $$\text{Readiness Score} = (w_1 \cdot \% \text{Staff Trained}) + (w_2 \cdot \% \text{Active Service Points}) + (w_3 \cdot \text{Usage Volume Metric})$$

4. **Privacy-Preserving Analytics**:
   - Aggregate session metrics (e.g., total communication requests, peak hours, language breakdown: 60% Marathi, 25% Hindi, 15% English) without storing raw user content or video.

---

## 4. Granular Deliverables

- [ ] **Dashboard Home Page**: Build `frontend/src/pages/Dashboard/index.jsx` with analytics widgets.
- [ ] **Readiness Score Component**: Build `frontend/src/components/dashboard/ReadinessScore.jsx`.
- [ ] **Staff Management Page**: Build `frontend/src/components/dashboard/StaffProgress.jsx` with filtering and search.
- [ ] **Service Point Manager**: Build UI to generate and toggle institution QR codes.
- [ ] **Analytics API**: Implement `backend/app/api/routes/institutions.py` and `backend/app/services/institution_service.py`.
- [ ] **Database Schemas**: Define `Institution`, `Staff`, `ServicePoint`, and `SessionMetric` tables in `backend/app/models/`.

---

## 5. Exit Criteria & Verification

- [ ] Hospital administrator can log in and view accurate staff training metrics.
- [ ] Institutional Readiness Score updates automatically as staff complete modules.
- [ ] Active service points and QR codes are managed successfully from the dashboard.
- [ ] All analytics data is aggregated and privacy-compliant.
