# Authentication Setup Guide

## Overview
This guide helps you add authentication protection to all HTML files in your MathauraX project.

## What's Been Done
✅ Created `scripts/auth.js` - Authentication check script
✅ Updated `home.html` - Added auth script and functional logout
✅ Updated `topics/algebra.html` - Added auth protection
✅ Updated `class10/class-10.html` - Added auth protection

## How It Works
1. **Login Required**: Users must log in through `index.html` first
2. **Automatic Redirect**: If someone tries to access protected pages without login, they're redirected to `index.html`
3. **Logout Function**: The logout button in settings now properly signs out users
4. **Excluded Pages**: `index.html` and all pages in `kidmode/` folder are excluded from auth check

## Files That Need Authentication Script Added

### Topics Folder (26 files)
Add this line before `</body>` or `</html>` in each file:
```html
<script type="module" src="../scripts/auth.js"></script>
```

Files to update:
- topics/famous-mathemethicians.html
- topics/bodmas.html
- topics/linear-algebra.html
- topics/trigonometry.html
- topics/statistics.html
- topics/calculus.html
- topics/geometry.html
- topics/arithmetic.html
- topics/order-of-operations.html
- topics/fractions.html
- topics/combinatorics.html
- topics/analysis.html
- topics/percentage.html
- topics/numbertheory.html
- topics/mathematical-physics.html
- topics/probability.html
- topics/postulates-axioms.html
- topics/numbers.html
- topics/measurement.html
- topics/logic.html
- topics/game-theory.html
- topics/equations.html
- topics/discrete-mathematics.html
- topics/differential-equations.html
- topics/decimal.html

### Class 10 Folder (6 files)
Add this line before `</body>` or `</html>` in each file:
```html
<script type="module" src="../scripts/auth.js"></script>
```

Files to update:
- class10/chapter-1.html
- class10/chapter-2.html
- class10/chapter-3.html
- class10/chapter-4.html
- class10/chapter-5.html
- class10/chapter-6.html

### Root Files (1 file)
Add this line before `</body>` or `</html>` in:
```html
<script type="module" src="scripts/auth.js"></script>
```

Files to update:
- comprehensive-test.html

## Testing
1. Open `index.html` in your browser
2. Sign up or sign in with your credentials
3. Try accessing `home.html` directly - it should work
4. Try accessing any topic page directly - it should work
5. Click logout - you should be redirected to `index.html`
6. Try accessing any protected page after logout - you should be redirected to `index.html`

## Security Notes
- This is client-side authentication using Supabase
- For production use, consider adding server-side validation
- The authentication state is stored in browser localStorage
- Users can bypass this by disabling JavaScript (consider server-side protection for critical data)

## Troubleshooting
- Check browser console for any JavaScript errors
- Ensure Supabase credentials are correct in `scripts/auth.js`
- Make sure all paths to `auth.js` are correct relative to each HTML file 