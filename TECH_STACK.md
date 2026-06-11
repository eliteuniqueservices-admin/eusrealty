# EUSRealty Tech Stack Documentation

This document outlines the core technologies, libraries, and frameworks used to build the EUSRealty application, as defined in `package.json`.

## Core Frameworks
*   **Next.js (16.1.6):** The primary React framework for building the application, utilizing Server-Side Rendering (SSR) and the App Router for optimal SEO and performance.
*   **React & React DOM (19.2.3):** The core JavaScript library for building responsive user interfaces.

## Styling & UI
*   **Tailwind CSS (3.4.19):** A utility-first CSS framework for rapid, consistent, and responsive styling.
*   **Framer Motion (12.34.3):** A powerful animation library driving all the smooth micro-interactions, scroll reveals, and hover effects across the site to give it a premium feel.
*   **Lucide React:** Providing the beautiful, consistent SVG icons used throughout the interface.
*   **Radix UI:** Used for building accessible, headless UI components (like Dialogs, Selects, Dropdowns, Tabs, and Toast notifications) without writing complex accessibility logic from scratch.
*   **Tailwind Merge & CLSX:** Utilities for dynamically merging and conditionally applying Tailwind classes.

## Backend & Database
*   **Mongoose (9.6.3):** An Object Data Modeling (ODM) library for connecting and interacting with the MongoDB database (where properties, leads, and jobs are stored).
*   **Next Auth (v5 Beta):** The authentication solution handling secure Admin Login and session management.

## AI & Integrations
*   **Google Generative AI:** The official Gemini API SDK powering the AI WhatsApp Chat Widget for handling customer inquiries intelligently.
*   **Cloudinary & Next Cloudinary:** Handling secure image uploads and optimized image delivery, heavily utilized in the Admin dashboard for uploading property images.
*   **Nodemailer:** Used for sending emails securely from the application via an SMTP server (such as when contact forms or job applications are submitted).

## Data Visualization & Utilities
*   **Recharts & Chart.js:** Used for rendering interactive data graphs and analytics in the Admin Dashboard.
*   **Bcryptjs:** Securely hashing and comparing admin passwords to ensure they are never stored in plaintext.
*   **jspdf & html2canvas:** Used for generating downloadable PDF documents (like reports, receipts, or brochures) directly within the browser without requiring a backend PDF generator.
*   **Date-fns:** A utility library for easily formatting, parsing, and calculating dates and times.
