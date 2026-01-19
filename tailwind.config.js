/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "xl-ish": "1200px", // Custom breakpoint for 1200px
      },
      maxWidth: {
        a4: "210mm", // Standard A4 width for print considerations
      },
      colors: {
        // --- Original Enhancv-style colors (keep if you still use them) ---
        "primary-text": "#1a202c", // Very dark grey/almost black for main text
        "secondary-text": "#4a5568", // Slightly lighter grey for secondary text
        "accent-blue": "#2b6cb0", // The distinct blue from Enhancv for highlights
        "light-bg": "#edf2f7", // Light grey background for header/sidebar
        "very-light-bg": "#e2e8f0", // Even lighter grey for skill tags, borders
        "subtle-border": "#e2e8f0", // Using the same light grey for borders

        // --- NEW Modern Design colors ---
        "primary-dark": "#1f2937", // A deep charcoal (for header background, main headings)
        "primary-light": "#f3f4f6", // A very light gray (for main content background)
        "accent-teal": "#14b8a6", // A vibrant teal (for highlights like skill tags, section underlines)
        "text-body": "#374151", // Medium dark gray (for general body text)
        "text-muted": "#6b7280", // Lighter gray (for dates/locations, subtle text)
      },
      fontFamily: {
        // You might want to match the font if it's not a standard system font
        // For a very close match to Enhancv, you might need to import a specific font like 'Inter' or 'Roboto'
        sans: ["Inter", "Roboto", "Arial", "sans-serif"], // Added Inter, Roboto as examples
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    function ({ addUtilities }) {
      addUtilities({
        // Prevents an element from breaking across pages in print. ESSENTIAL for resume sections.
        ".break-inside-avoid": {
          "break-inside": "avoid",
          "page-break-inside": "avoid",
        },
        // Forces a page break after an element (useful if you wanted multi-page control, not for single-page)
        ".page-break": {
          "page-break-after": "always",
        },
        // Hides an element specifically when printing
        ".print-hide": {
          "@media print": {
            display: "none",
          },
        },
      });
    },
  ],
};
