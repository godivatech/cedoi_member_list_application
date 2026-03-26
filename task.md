You are a senior product designer and full-stack engineer.

Build a production-ready mobile-first web app for collecting business listing data.

---

DESIGN SYSTEM (VERY IMPORTANT)

Follow high-quality UI/UX principles inspired by Airbnb design system:

* Clean, minimal, modern interface
* Soft rounded corners (border-radius: 12px–16px)
* Generous spacing (padding and margins)
* Clear visual hierarchy (headings, labels, inputs)
* Conversational and friendly UI (not robotic)
* Consistent reusable components

Design must feel:

* Professional (corporate level)
* Trustworthy
* Extremely simple for non-technical users

---

COLOR SYSTEM

Use a Royal Blue based theme:

* Primary: #2563EB (Royal Blue)
* Primary Hover: #1D4ED8
* Background: #FFFFFF
* Secondary Background: #F9FAFB
* Text Primary: #111827
* Text Secondary: #6B7280
* Border: #E5E7EB

Use colors minimally:

* Focus more on spacing, typography, and layout
* Avoid too many colors

---

TYPOGRAPHY

* Use clean modern font (Inter or system font)
* Large readable text
* Strong hierarchy:

  * Title
  * Label
  * Input text

---

UI COMPONENT STYLE

* Inputs:

  * Rounded
  * Soft border
  * Focus ring (blue glow)

* Buttons:

  * Full width (mobile)
  * Rounded
  * Strong primary color
  * Slight shadow

* Cards:

  * White background
  * Soft shadow
  * Rounded corners

---

APP FEATURES

1. Form Screen:

* Name
* Business Name
* Category (text + suggestions, no strict dropdown)
* Phone (10 digit validation)
* Address
* Photo upload (camera enabled)

2. Photo Upload UX:

* Use mobile camera directly
* Show preview
* Clean upload interaction

3. UX Behavior:

* Sticky submit button
* Loading spinner
* Success message:
  "Data submitted successfully ✅"

4. Validation:

* Show friendly error messages
* Prevent empty submission

---

BACKEND

* Firebase Firestore (store all data)
* Cloudinary (image upload)

---

CODE REQUIREMENTS

* React + Vite + Tailwind
* Clean folder structure
* Reusable components
* Mobile-first responsive

---

OUTPUT

Provide:

* Full code
* UI components
* Firebase setup
* Cloudinary setup
* Deployment steps

---

IMPORTANT

* Do NOT make it look like a basic form
* Make it look like a premium SaaS product
* Focus heavily on mobile UX
* UI quality should feel like Airbnb / modern startup apps

---

This is a real product, not a demo.
