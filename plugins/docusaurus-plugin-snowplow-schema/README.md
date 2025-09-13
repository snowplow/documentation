# JSON-LD Schema Validation Guide

This project includes automatic **JSON-LD schema generation** for all pages.  
Follow this guide to validate and debug schema for any page locally or after deployment.

---

## 📝 How to Test JSON-LD Per Page (Google Rich Results)

1. Open the desired page in your browser.
2. Right-click and select **View Page Source**.
3. Search for `<script type="application/ld+json">`.
4. Copy the JSON-LD block.
5. Visit [Google Rich Results Test](https://search.google.com/test/rich-results).
6. Paste the URL or JSON-LD code into the tool.
7. Review any errors or warnings and adjust your schema if needed.

---

## 🧪 Local Validation Command

Use the following command to validate the JSON-LD schema of a page on your **local development server**:

```bash
# Install jq and curl if not already installed
# macOS: brew install jq curl
# Ubuntu/Debian: sudo apt install jq curl

# Replace /docs/example-page with your actual page path
curl -s http://localhost:3000/docs/example-page \
  | grep -o '<script type="application/ld+json">.*</script>' \
  | sed 's/<script type="application\/ld+json">//' \
  | sed 's/<\/script>//' \
  | jq .
