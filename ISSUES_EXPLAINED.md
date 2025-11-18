# Issues Found with Dasso Bamboo Microsite

## Summary

I found **two issues** with the microsite at http://localhost:3000/b/dasso-bamboo-n8xt:

1. **GPT-5 Mini Summarization Not Working** - Text is raw OCR output, not cleaned
2. **IndexNow Status is `null`** - Indexing ping failed

---

## Issue 1: LLM Summarization Failed ❌

### What Happened
The content on the microsite is the **raw OCR text** from the PDF with all the formatting artifacts:
- Excessive `<br />` tags
- Poorly formatted text
- No proper paragraphs or structure
- Just a copy-paste of the brochure

### Root Cause
**Missing `OPENAI_API_KEY` in `.env.local`**

The `summarizeText` function in `src/lib/llm.ts` checks if `OPENAI_API_KEY` is set:

```typescript
if (!env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set. Skipping LLM summarization.");
  return text; // Returns raw text without cleaning
}
```

Since the key is missing, it skips GPT-5 mini and returns the raw OCR text directly.

### How to Fix

1. **Get an OpenAI API Key**: Visit https://platform.openai.com/api-keys
2. **Add to `.env.local`**:
```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```
3. **Restart the dev server**:
```bash
pnpm dev
```

---

## Issue 2: IndexNow Status is `null` ⚠️

### What Happened
The footer shows:
```
⚠ Indexing attempt on 11/18/2025 (status: null)
```

This means the IndexNow ping to Bing **failed or didn't return a status code**.

### Root Cause
**Missing `INDEXNOW_KEY` in `.env.local`**

The `pingIndexNow` function in `src/lib/indexnow.ts` tries to send a request to Bing's IndexNow endpoint, but without a valid key, the request fails.

### How to Fix

1. **Generate an IndexNow Key**: 
   - Generate a random 32+ character hex string
   - Example: `openssl rand -hex 32`
   
2. **Add to `.env.local`**:
```bash
INDEXNOW_KEY=your-generated-hex-string-here
```

3. **Create the verification file**: The system will auto-serve it at `/indexnow-key.txt`

4. **Restart the dev server**

---

## Current Environment Variable Status

Based on your configuration, these are **REQUIRED but likely missing**:

| Variable | Status | Impact |
|----------|--------|--------|
| `OPENAI_API_KEY` | ❌ Missing | No text summarization, raw OCR displayed |
| `INDEXNOW_KEY` | ❌ Missing | IndexNow pings fail, status = null |

These are **OPTIONAL** (system falls back gracefully):

| Variable | Status | Impact |
|----------|--------|--------|
| `DEEPSEEK_OCR_API_KEY` | ⚠️ Optional | Falls back to Tesseract OCR |
| `DEEPSEEK_OCR_API_URL` | ⚠️ Optional | Uses Tesseract if not set |

---

## Expected Behavior (After Fix)

### With `OPENAI_API_KEY` set:
✅ **Clean, Summarized Content**
```
Dasso Bamboo

Dasso is a global leader in bamboo products, founded in 1993. The company 
specializes in sustainable bamboo flooring, architectural elements, and furniture. 
With 28 years of experience, Dasso serves 40+ countries and partners with major 
brands like IKEA, Vanke, and Marriott.

Products include:
- Bamboo flooring (Classic, Ecosolid, Industrial)
- Exterior decking (dassoXTR, dassoCTECH)
- Acoustic panels and fire-resistant materials
- Furniture and architectural elements

Contact: info@dassoGroup.com | www.dassoGroup.com
```

### With `INDEXNOW_KEY` set:
✅ **Successful Indexing**
```
✓ Indexed with Bing on 11/18/2025
```

---

## Quick Fix Commands

### 1. Generate IndexNow Key
```bash
openssl rand -hex 32
```

### 2. Update `.env.local`
```bash
# Add these lines to your .env.local file
OPENAI_API_KEY=sk-proj-your-key-here
INDEXNOW_KEY=your-hex-string-here
```

### 3. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
pnpm dev
```

### 4. Test Again
Upload a new file or trigger republish for existing business.

---

## How to Republish the Dasso Bamboo Page

If you want to **fix the existing page** after adding the API keys:

### Option 1: Use the API directly
```bash
curl -X POST http://localhost:3000/api/publish \
  -H "Content-Type: application/json" \
  -d '{"businessId":"c2c6dbe3-14dc-4796-b56c-e3c808952277"}'
```

### Option 2: Create a republish script
I can create a script to republish all existing businesses with the new LLM and IndexNow configuration.

---

## Why These Keys Are Optional

The system is designed to **degrade gracefully**:

1. **No OPENAI_API_KEY**: 
   - Falls back to raw text
   - System still works, just less polished

2. **No INDEXNOW_KEY**: 
   - Indexing attempts are logged but fail
   - Search engines will still find you via sitemap.xml
   - Just slower to index (days instead of minutes)

3. **No DEEPSEEK_OCR_API_KEY**:
   - Falls back to Tesseract OCR (local, free)
   - Still extracts text from images/PDFs

---

## Cost Considerations

### OpenAI API (GPT-5 mini)
- **Model**: gpt-5-mini
- **Cost**: ~$0.0002 per request (very cheap)
- **Usage**: 1 call per business upload
- **Expected**: $0.02 per 100 uploads

### IndexNow
- **Cost**: **FREE** ✅
- **Provider**: Bing/Microsoft
- **Benefit**: Instant indexing for ChatGPT, Bing, Yandex

---

## Testing Checklist

After adding the keys:

- [ ] Restart dev server
- [ ] Upload a test file
- [ ] Check microsite has **clean, summarized text** (not raw OCR)
- [ ] Check footer shows **"✓ Indexed with Bing on {date}"** (not status: null)
- [ ] Verify `/indexnow-key.txt` serves your key
- [ ] Check database `visibletoai_index_events` has `status: 200`

---

## Next Steps

1. **Add `OPENAI_API_KEY`** to `.env.local` (required for text cleaning)
2. **Add `INDEXNOW_KEY`** to `.env.local` (required for instant indexing)
3. **Restart dev server**
4. **Test with a new upload** (or republish existing business)
5. **Verify the microsite looks clean and professional**

Let me know when you've added the keys and I can help test! 🚀

---

**Created**: November 18, 2025  
**Issue**: Dasso Bamboo microsite showing raw OCR text and IndexNow status null  
**Resolution**: Add missing API keys to `.env.local`

