# STYLE GUIDE — Editorial Judgment

RoastMyGitHub is an editorial experience that delivers high-fidelity technical roasts. 

The aesthetic is not a tool; it is a statement.

---

## 🎨 Visual Aesthetic: "The High-End Review"

The interface should feel like a premium, dark-mode article or a boutique performance review. 

### Core Attributes
- **Monochrome & Moody:** High contrast. Pure black and pure white.
- **Negative Space:** Use spacing to create tension and focus. 
- **No Chrome:** Remove all unnecessary UI elements, panels, and borders.
- **Minimalist Tactical:** Use thin (1px) dividers and small, tracked-out uppercase text for metadata.

### Color Palette
- **Background:** `#000000` (Pure Black)
- **Primary Text:** `#FFFFFF` (White)
- **Secondary Text:** `#71717A` (Zinc-500)
- **Accents:** Selective use of muted colors for specific judges (e.g., `#3F3F46` Zinc-700 for dividers).
- **Selection:** `bg-white text-black`

---

## 🔤 Typography: "Massive & Italic"

Typography is the primary design element.

- **Primary Font:** Inter or any clean modern Sans-Serif.
- **Headlines:** Oversized (`text-6xl` to `text-9xl`), bold, tracking-tighter. Use italics for emphasis and "attitude."
- **Metadata:** Very small (`text-[10px]`), uppercase, wide tracking (`tracking-[0.4em]` or higher), font-black.
- **Body:** Normal weight, leading-relaxed, slightly dimmed white or gray.

### Typographic Rules
- **No Underscores:** Avoid technical labels like `EXECUTE_SCAN`. Use "Initiate Roast" or "Hear Judgment."
- **Human Casing:** Use proper sentence casing or bold uppercase sparingly.
- **Italic Inflection:** Use italics to denote the "sarcastic voice" of the reviewer.

---

## 📐 Layout: "Center-Left Editorial"

Avoid centered "SaaS landing page" layouts.

- **Alignment:** Prefer center-left alignment for main content boxes.
- **Constraints:** `max-w-6xl` for the main container to ensure breathing room on large screens.
- **Linear Flow:** Content should reveal itself as a series of distinct observations, not a dashboard.

---

## 🎭 Tone System: "The Jaded Senior"

The copy is the soul of the experience. It must sound human, not like an LLM.

### The Voice
- **Confident:** Does not apologize.
- **Sarcastic:** Finds the flaw in every "achievement."
- **Witty:** Uses developer culture as a weapon (framework hopping, abandoned side projects, cryptic commits).
- **Observant:** Cites specific data as evidence for the roast.

### Tone Rules
- **Avoid AI Tropes:** Never say "Processing...", "AI Analysis...", or "Heuristic."
- **Avoid Terminal Tropes:** No green text on black, no "hacking" visuals, no underscores in labels.
- **Human-Driven:** Use phrases like "Sighing at your commits," "We admire your honesty," or "A dream and twelve frameworks."

---

## ⚡ Interaction & Motion

- **Reveal-Driven:** Content should feel like it's being "presented" to the user.
- **Smooth Staggering:** Use Framer Motion for subtle y-axis offsets on entry.
- **Breathing Loading:** Loading states should be textual and sarcastic. Rotate messages like "Calculating the carbon footprint of your bad logic..."
- **No Progress Bars:** Use thin, animated lines or simple text logs if needed.

---

## 🚫 Avoid

- **Sparkles/Glows:** Anything that looks like a "magical AI assistant."
- **Technical Bloat:** Excessive borders, shadows, or "dashboard" widgets.
- **Generic Icons:** Use icons sparingly, only when they add tactical value.
- **Polished SaaS Tone:** Avoid "Optimize your workflow" or "Unlock your potential."

---

## 🧠 Core Principle

The UI is the stage. The text is the performer. 

**Keep the stage empty so the performance hits harder.**
