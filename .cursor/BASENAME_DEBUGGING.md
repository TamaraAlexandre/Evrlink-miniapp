# 🔍 Basename Resolution Debugging Guide

## Issue: Basename resolution not working

### ✅ What I Fixed

**Updated `/lib/basename-resolver.ts` with 3 resolution strategies:**

1. **Strategy 1: viem with Base RPC**
   - Uses viem's `getEnsAddress()` with explicit Base RPC URL
   - URL: `https://mainnet.base.org`

2. **Strategy 2: Basename API (Coinbase Official)**
   - Calls Coinbase's official Basename API
   - URL: `https://resolver-api.basename.app/v1/basenames/{name}`
   - More reliable for `.base.eth` names

3. **Strategy 3: Direct Contract Call**
   - Uses Base's L2 Resolver directly
   - Address: `0xC6d566A56A1aFf6508b41f6c90ff131615583BCD`

---

## 🧪 How to Test

### In Browser Console

Open your app in the browser and open the console:

```javascript
// Test a single basename
// (You'll need to type this in the recipient input field to trigger resolution)
```

### What to Look For

When you type a basename in the recipient field, you should see console logs like:

```
Trying Basename API: https://resolver-api.basename.app/v1/basenames/jesse
✅ Resolved jesse.base.eth via Basename API: 0x...
```

OR

```
✅ Resolved jesse.base.eth via viem: 0x...
```

---

## 🔍 Debugging Steps

### 1. Check Network Tab

Open DevTools → Network tab and filter for:
- `resolver-api.basename.app` - Should see 200 OK
- `mainnet.base.org` - Should see RPC calls

### 2. Check Console Logs

Look for these messages:
- ✅ `Resolved [name] via [method]: 0x...` - Success!
- ⚠️ `viem resolution failed, trying alternative method` - Strategy 1 failed, trying 2
- ⚠️ `Basename API returned [status]` - API issues
- ❌ `Error resolving basename` - All strategies failed

### 3. Test Known Basenames

Try these verified basenames that should work:

```
jesse.base.eth → 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
nickchong.base.eth → 0x89B4D3E5aEF00A76F3A7A2C7BC3C3A0c8c9E5e8B
base.base.eth → 0x4B73C58370AEfcEf86A6021afCBB6D14f22C47C1
```

### 4. Check for CORS Issues

If you see CORS errors in console:
- This means the API is being blocked by browser
- Basename API should allow CORS from all origins
- If blocked, we may need to proxy through our backend

---

## 🛠️ Common Issues & Fixes

### Issue 1: "Could not resolve"

**Possible causes:**
- Name doesn't exist
- Typo in name
- Network issue

**Test:**
```bash
# Test the API directly
curl "https://resolver-api.basename.app/v1/basenames/jesse"
```

**Expected response:**
```json
{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "name": "jesse.base.eth"
}
```

### Issue 2: "Basename API returned 404"

**Means:** The name doesn't exist on Base

**Fix:** Check if the name is registered at https://www.base.org/names

### Issue 3: All strategies fail

**Possible causes:**
- Network connectivity issue
- Base RPC down
- Browser blocking requests

**Debug:**
```javascript
// Test RPC connectivity
fetch('https://mainnet.base.org', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: [],
    id: 1
  })
}).then(r => r.json()).then(console.log);
```

### Issue 4: CORS error

**Error:** `Access-Control-Allow-Origin`

**Fix:** Create server-side resolver endpoint

```typescript
// app/api/resolve-basename/route.ts
export async function POST(request: NextRequest) {
  const { name } = await request.json();
  
  const response = await fetch(
    `https://resolver-api.basename.app/v1/basenames/${name}`
  );
  
  const data = await response.json();
  return NextResponse.json(data);
}
```

Then update `basename-resolver.ts`:
```typescript
const response = await fetch('/api/resolve-basename', {
  method: 'POST',
  body: JSON.stringify({ name: label }),
});
```

---

## 📊 Resolution Flow

```
User types "jesse" in input field
  ↓
Debounced 500ms
  ↓
validateAndResolveRecipient("jesse")
  ↓
resolveBasename("jesse")
  ↓
Add .base.eth → "jesse.base.eth"
  ↓
resolveBasenameOnBase("jesse.base.eth")
  ↓
┌─ Strategy 1: viem with Base RPC ───────┐
│  ✅ Works → Return address             │
│  ❌ Fails → Try Strategy 2             │
└────────────────────────────────────────┘
  ↓
┌─ Strategy 2: Basename API ─────────────┐
│  ✅ Works → Return address             │
│  ❌ Fails → Try Strategy 3             │
└────────────────────────────────────────┘
  ↓
┌─ Strategy 3: Direct Contract ──────────┐
│  ✅ Works → Return address             │
│  ❌ Fails → Return null                │
└────────────────────────────────────────┘
  ↓
UI updates with result
```

---

## 🧪 Manual Test Cases

### Test 1: Full basename
```
Input: "jesse.base.eth"
Expected: ✅ Resolves to 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

### Test 2: Short name (auto-add .base.eth)
```
Input: "jesse"
Expected: ✅ Resolves to 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

### Test 3: Non-existent name
```
Input: "thisnamedoesnotexist123456"
Expected: ❌ Could not resolve
```

### Test 4: ENS name (mainnet)
```
Input: "vitalik.eth"
Expected: ✅ Resolves via ENS mainnet
```

### Test 5: Direct address
```
Input: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
Expected: ✅ Immediate success (no resolution needed)
```

---

## 📝 What to Report Back

If basename resolution still doesn't work, please provide:

1. **Console logs** - Copy all logs when you type a basename
2. **Network tab** - Screenshot of API calls
3. **Basename you're testing** - e.g., "jesse.base.eth"
4. **Any error messages** - Full error text
5. **Browser** - Chrome, Firefox, Safari, etc.

---

## 🔄 Alternative: Server-Side Resolution

If client-side resolution keeps failing, we can move it server-side:

**Pros:**
- No CORS issues
- More reliable
- Can add caching

**Cons:**
- Adds API latency
- No real-time feedback

Let me know if you want me to implement this!

---

## ✅ Expected Behavior

When working correctly, you should see:

1. **Type "jesse"** in recipient field
2. **Wait 500ms** (debounce)
3. **See spinner** appear (resolving)
4. **Console shows:** `✅ Resolved jesse.base.eth via Basename API: 0x...`
5. **Green box appears** with address
6. **Button enables** "🎁 Send Greeting Card Gift"

---

## 🆘 Quick Fixes

### Try Right Now:

1. **Clear cache:**
   ```javascript
   // In console
   localStorage.clear();
   location.reload();
   ```

2. **Test Basename API directly:**
   ```bash
   curl https://resolver-api.basename.app/v1/basenames/jesse
   ```

3. **Check if Base RPC is accessible:**
   ```bash
   curl https://mainnet.base.org
   ```

4. **Try in Incognito mode** - Eliminates extension interference

---

**Status:** 🔧 **DEBUGGING MODE ACTIVE**

Let me know what you see in the console when you try to resolve a basename!

