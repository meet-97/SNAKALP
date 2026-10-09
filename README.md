# AI-Native Content Creator Marketplace

> **Event:** HacXLerate 2026 — Round 1 (24-Hour Campus Hackathon)  
> **Team Name:** SNAKALP  
> **Institution:** Universal SkillTech University  
> **Selected Challenge:** Challenge 2 — AI Content Creator Marketplace (Kampus.VC)  
> **Deployment Link:** [Insert your deployed Vercel/Nimbus link here]  
> **GitHub Repository:** [Repository](https://github.com/meet-97/SNAKALP)  

---

## 📌 Executive Summary & Problem Context
Generative AI has produced a new class of creative professionals (AI filmmakers, animators, prompt specialists), but traditional freelancing platforms fail to evaluate AI-specific workflows, verify tool capabilities, manage prompt iterations, or handle commercial IP licensing.

**Our Solution:** An AI-native marketplace connecting brands and creative agencies with verified generative AI creators. The platform streamlines the entire workflow: from AI-assisted brief creation and portfolio evaluation to discovery, matching, and asset delivery.

---

## ⚙️ Core Scope & Acceptance Rubric (100 Points)

### 1. Creator Profiles & AI Portfolios (30% Weight)
- [x] **Rich Portfolio Showcase:** Displays AI-generated videos, animations, and graphics with attached workflow metadata.
- [x] **Model & Tool Attribution:** Tracks tools used per asset (Midjourney, Stable Diffusion, ComfyUI, Runway Gen-3, ElevenLabs, Sora).
- [x] **Specialization Tags:** Tagging for AI animation, photorealism, voice synthesis, and visual style.
- [x] **Creator Verification Signals (Bonus):** Trust badges and visible indicators verifying tools, past workflows, and delivered projects.

### 2. Brand & Agency Briefs (20% Weight)
- [x] **Structured Campaign Builder:** Allows brands to define:
  - Campaign objectives & scope.
  - Deliverable formats & aspect ratios (e.g., 9:16 vertical reels, 16:9 cinematic, 1:1 square).
  - Aesthetic guidelines and visual style.
  - Commercial-use licensing and IP rights.
- [x] **AI-Assisted Brief Builder (Bonus):** Generative tool that transforms rough brand concepts into structured creative briefs.

### 3. Creator Search & Filtering (25% Weight)
- [x] **Multi-Attribute Filtering:** Real-time search by skills, specific AI tools, content format, and style domains.
- [x] **Graceful Zero-Results Handling:** Smart fallback suggestions and query relaxation when exact criteria yield no matches.

### 4. User Experience & Flows (15% Weight)
- [x] Streamlined creator onboarding and portfolio management.
- [x] Clean agency portal for reviewing portfolios and managing briefs.
- [x] High-resolution asset preview with technical workflow inspection.

---

## 🗄️ Data Model Specifications

```text
CreatorProfile:
  id: String (UUID)
  name: String
  bio: String
  specializations: List<String>       # e.g., ["AI Filmmaking", "StyleGAN", "Motion"]
  tools_stack: List<String>           # e.g., ["ComfyUI", "Runway", "Midjourney"]
  verification_signals:
    verified_tools: Boolean
    portfolio_verified: Boolean
  portfolio_items:
    - id: String (UUID)
      asset_url: String
      content_type: Enum              # video | animation | graphic | audio
      aspect_ratio: String            # 16:9 | 9:16 | 1:1
      tools_used: List<String>
      workflow_notes: String
      commercial_ready: Boolean

CreativeBrief:
  id: String (UUID)
  brand_name: String
  title: String
  campaign_objective: String
  content_type: String
  style_guide: String
  aspect_ratio: Enum                 # 16:9 | 9:16 | 1:1 | 4:5
  commercial_use_terms: Enum         # Full Commercial Buyout | Non-Exclusive | Internal
  budget_range: String
  status: Enum                       # Draft | Published | In_Progress | Completed
