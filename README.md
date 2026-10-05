# Sabse Upar: setup (about 45 minutes)
1. **GitHub**: create a private repo, upload this folder.
2. **Supabase** (free): new project, SQL Editor, paste supabase/schema.sql, Run. Settings > API: copy Project URL and the service_role key (secret).
3. **Razorpay**: sign up, finish KYC, add YOUR bank account for settlements in the Razorpay dashboard only (never in code or chat). Start in Test Mode. Settings > API Keys: generate Key ID + Secret.
   Ask Razorpay support in writing whether a paid-ranking leaderboard is an approved use case before going Live.
4. **Vercel** (free): import the repo. Add every variable from .env.example in Settings > Environment Variables. Deploy.
5. **Webhook**: Razorpay > Settings > Webhooks > Add: URL https://YOURDOMAIN/api/webhook, events payment.captured and order.paid, set a secret, put the same value in RAZORPAY_WEBHOOK_SECRET on Vercel, redeploy.
6. **Test**: Test Mode payment with a Razorpay test UPI/card. The bid should appear on the board within seconds.
7. **Go live**: switch Razorpay to Live keys in Vercel, redeploy, make a real Rs 49 bid yourself.
8. **Admin**: open /admin and sign in with ADMIN_USER / ADMIN_PASS (16+ characters required). Only you can hide or restore bids.
9. **Domain**: buy a .in domain, add it in Vercel > Domains.
10. **Legal pages**: add Terms, Privacy and Refund policy pages (Razorpay requires them). Ask a CA about GST invoicing.

## Hero board (added)
- Run supabase/heroes.sql in Supabase SQL Editor (after schema.sql).
- Add HASH_SALT in Vercel env vars.
- Open /admin/heroes to add heroes (text names only) and set tiers. "Remove now" is your instant takedown button.
- Public page: /heroes. Legal pages: /legal/terms, /legal/refund, /legal/privacy, /legal/takedown (templates; lawyer must review).
