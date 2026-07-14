# Project Requirements Specification

> **IMPORTANT**
>
> This document contains the complete project requirements.
>
> **Every requirement below is mandatory.**
>
> Do not skip, simplify, replace, or ignore any item.
>
> If any requirement conflicts with implementation choices, prioritize this document.
>
> No placeholder, dummy, lorem ipsum, or fake content is allowed anywhere in the application.

---

# 1. General Requirements

## Tech Requirements

Implement a complete production-ready web application.

The project must include:

- Responsive UI
- Authentication
- Public pages
- Protected pages
- CRUD functionality where applicable
- Clean reusable component architecture

---

# 2. Global UI & Design Rules

## Color System

Use:

- Maximum **3 primary colors**
- Optional **1 neutral color**

Avoid random colors throughout the application.

---

## Consistency

Maintain consistent:

- Typography
- Component sizes
- Border radius
- Shadows
- Padding
- Margins
- Card layout
- Button styles
- Icon styles

Every card and reusable component should look visually consistent.

---

## Layout

Maintain consistent:

- Grid spacing
- Section spacing
- Container width
- Alignment

---

## Responsiveness

Must be fully responsive for:

- Mobile
- Tablet
- Desktop

No broken layouts.

No overflowing components.

No horizontal scrolling.

---

## Content Rules

Do NOT use:

- Lorem Ipsum
- Placeholder paragraphs
- Dummy descriptions
- Fake product names
- Fake reviews

Every visible content should appear realistic and meaningful.

---

# 3. Home / Landing Page

---

## Navbar

Requirements:

- Full-width navbar
- Sticky OR fixed
- Responsive
- Mobile menu
- Proper active route highlighting

### Logged Out Navigation

Minimum **3 routes**

Example:

- Home
- Explore
- Login

### Logged In Navigation

Minimum **5 routes**

Example:

- Home
- Explore
- Add Item
- Manage Items
- Profile
- Logout

---

## Hero Section

Requirements

Height:

- 60–70% of viewport

Must include:

- Strong heading
- Supporting text
- CTA button
- Animation OR slider OR interactive element

The visual flow should naturally guide users to the next section.

---

## Landing Page Sections

Minimum:

**7 meaningful sections**

Possible examples:

- Features
- Services
- Categories
- Statistics
- Popular Items
- Testimonials
- Latest Blogs
- Newsletter
- FAQ
- Call To Action

These are examples only.

The chosen sections should match the project context.

---

## Footer

Requirements

Must include:

- Working navigation links
- Contact information
- Email
- Phone
- Address (if applicable)
- Social media links

No broken links.

---

# 4. Core Listing / Card Section

Each card MUST include:

- Image
- Title
- Short description
- Meta information

Meta information may include:

- Price
- Date
- Rating
- Location
- Category

Include:

- View Details button

---

## Card Design Rules

Every card must have:

- Same width
- Same height
- Same border radius
- Same spacing
- Same layout
- Same button position

Desktop layout:

- 4 cards per row

Responsive layout:

- Tablet
- Mobile

Implement:

- Skeleton loading state while data loads

---

# 5. Details Page

The details page must be publicly accessible.

Include:

## Image Section

Support:

- Multiple images
- Gallery
- Carousel (if applicable)

---

## Description Section

Include:

- Full description
- Overview

---

## Specifications

Display:

- Key information
- Important metadata
- Specifications

---

## Reviews

If applicable include:

- Ratings
- Reviews

---

## Related Items

Display related items using reusable cards.

---

# 6. Listing / Explore Page

Must include:

## Search

Working search bar.

---

## Filtering

Implement at least **2 filters**

Examples:

- Category
- Price
- Rating
- Date
- Location

Filtering must actually work.

---

## Sorting

Implement sorting options.

Examples:

- Latest
- Oldest
- Price Low → High
- Price High → Low
- Rating

---

## Pagination

Implement either:

- Pagination

OR

- Infinite scrolling

---

# 7. Authentication System

Create:

- Login page
- Registration page

Requirements:

- Proper validation
- Error handling
- Loading state
- Success feedback

---

## Demo Login

Provide:

Demo Login button

Requirements:

- Automatically fills credentials
- Allows quick testing

---

## Optional

Support:

- Google Login
- Facebook Login

---

## UI

Authentication pages should have:

- Modern layout
- Professional design
- Responsive interface

---

# 8. Protected Page — Add Items

Route:

```
/items/add
```

Requirements:

- Accessible only after login
- Redirect unauthenticated users to:

```
/login
```

---

## Form Fields

Include:

- Title
- Short Description
- Full Description
- Price / Date / Priority / Relevant Field
- Optional Image URL

Buttons:

- Submit

Perform:

- Validation
- Error handling
- Success notification

---

# 9. Protected Page — Manage Items

Route:

```
/items/manage
```

Requirements

Display all user items using:

- Table

OR

- Grid

Each row/card must include:

- View
- Delete

Design should be:

- Clean
- Responsive
- Readable

---

# 10. Additional Pages

Create at least **2 additional pages**

Examples:

- About
- Contact
- Blog
- Help
- Support
- Privacy Policy
- Terms & Conditions

Pages should contain meaningful content.

---

# 11. UX & Responsiveness

Requirements

No placeholder content.

No broken links.

Every button must work.

Every navigation link must work.

Proper:

- Alignment
- Spacing
- Typography
- Hover states
- Loading states
- Empty states
- Error states

Responsive across:

- Mobile
- Tablet
- Desktop

---

# 12. Final Submission Requirements

Provide:

## Live Website

- Live deployment URL

---

## GitHub

Provide repository links for:

- Frontend
- Backend

---

## Demo Credentials

Provide:

### Regular User

Email:

Password:

---

### Admin

Email:

Password:

---

# Development Standards

The project should follow these standards throughout development.

## Code Quality

- Clean architecture
- Reusable components
- Proper folder structure
- Maintainable code
- No duplicated code

---

## UI Components

Use reusable components for:

- Cards
- Buttons
- Forms
- Navbar
- Footer
- Modal
- Tables
- Pagination
- Skeleton Loader

---

## Accessibility

Implement:

- Semantic HTML
- Proper labels
- Keyboard accessibility
- Accessible buttons
- Alt text for images

---

## Performance

Optimize:

- Images
- Lazy loading
- Code splitting where applicable
- Loading states

---

# Final AI Instruction

Treat every item in this document as **MANDATORY**.

Before considering the project complete, verify that every checklist item has been implemented.

Do not omit any feature.

Do not replace any requirement with an alternative unless explicitly instructed.

The final application should be production-ready, fully responsive, visually consistent, and satisfy every requirement listed in this specification.