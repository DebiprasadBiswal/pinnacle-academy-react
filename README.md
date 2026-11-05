# Pinnacle Achievers Academy — React website

A responsive React + Vite admissions website built around the supplied academy logo and the supplied 2027–28 brochure content.

## Run locally

1. Install Node.js (18+ recommended).
2. Open a terminal in this folder.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL printed by Vite.

## Production build

Run `npm run build`. The production-ready site will be generated in `dist/`.

## Local search visibility (Soro and Balasore)

The homepage targets +2 Science coaching in Soro, Balasore, with visible programme and location information, local FAQs, crawlable navigation, social sharing metadata and EducationalOrganization/LocalBusiness structured data. `npm run build` pre-renders the actual React page into HTML, then the browser hydrates it for interactions. It also generates `dist/robots.txt` and `dist/sitemap.xml`.

The canonical public URL is `https://pinnacleachieversacademy.com/`, configured in `src/seo.js`. Ensure the domain is connected to this Worker and HTTPS works before publishing or submitting the sitemap. Redirect HTTP and any www or alternate hostnames to that preferred URL in Cloudflare. Do not replace the public domain with a preview or workers.dev address.

Validate with `npm run check:seo` and `npm test`. Deploy using the existing Cloudflare workflow described below. After deployment, check the live homepage, `/robots.txt` and `/sitemap.xml`; inspect the page in Google's URL Inspection tool and test the structured data with Google's Rich Results Test. Search engines decide indexing and rankings; structured data does not guarantee a special search appearance.

Complete these steps in the academy owner's Google accounts:

1. Claim and verify the academy's Google Business Profile. Use the actual academy name, address and phone shown on the website. Select the most accurate available business category and add confirmed services, opening hours and authentic photos. Use the existing physical Soro location, rather than creating fictitious branches in nearby towns.
2. Add the website's domain property to Google Search Console and complete DNS verification. Submit `https://pinnacleachieversacademy.com/sitemap.xml` and request indexing for the homepage. Verification requires access to the owner's Google account and DNS; no verification token has been invented or added to this repository.
3. Invite students and parents to leave honest reviews and respond to them. Keep details consistent across legitimate local listings and academy social profiles. Add verifiable faculty, programme and results information as it becomes available.
4. Track impressions, queries, clicks and enquiries in Search Console and Business Profile. Use the results to improve useful programme information over time.

A 50–60 km radius cannot be enforced with SEO or a metadata setting. Google local results depend on relevance, distance and prominence. The page welcomes enquiries from surrounding areas without promising rankings or inventing facilities. Avoid keyword stuffing and unsupported claims that the academy is ranked "best". See [Google's local ranking guidance](https://support.google.com/business/answer/7091).

## Before publishing

- Add the academy's verified phone number, WhatsApp number and email address.
- Confirm which programmes and residential facilities will be available in 2027–28.
- Replace the email-draft enquiry workflow with a backend/form service if you want enquiries submitted directly to an inbox/database.
- Add authentic campus, classroom, faculty and residential photographs when available.
- Review all claims and admission details before publishing.

The enquiry form currently opens the visitor's default email application with their entered details; it does not store data or automatically send an email.

## Student popup and Cloudflare hosting

The student popup opens five seconds after each page load. It collects the student's name, father's name, class and Indian mobile number, and posts to `/api/student-enquiries`. Only a confirmed database insert shows a success message. The separate, existing admission email form still opens an email draft.

Deploy this project as a **Cloudflare Worker with Static Assets and D1** using the included `wrangler.jsonc`. Uploading only `dist/` to static hosting will not deploy the submission API.

The Git-connected Cloudflare Worker is `pinnacle-academy-react`; the name in `wrangler.jsonc` must match it. In Cloudflare's build settings, use the repository root, build command `npm run build`, and deploy command `npx wrangler deploy`. The D1 binding and hosted table are already configured.

For subsequent updates, run `npm test` and `npm run deploy`. The original deployment at https://pinnacle-achievers-academy.debiprasad1983.workers.dev remains separate; use `npm run deploy:original` to update that address explicitly.

For a fresh Cloudflare account:

1. Run `npx wrangler login` and finish authorization in your browser. If the localhost callback fails, use `npx wrangler login --device` instead.
2. Run `npm run db:create` once to create `pinnacle-students`. If it already exists, use `npx wrangler d1 list` to find it.
3. Update `database_id` in `wrangler.jsonc` with that account's returned database UUID.
4. Run `npm run db:migrate:remote` to create the `student_enquiries` table on Cloudflare.
5. Run `npm run deploy` to build and deploy both the page and its API.

The table contains `id`, `name`, `father_name`, `student_class`, `phone` (normalized with +91), and `created_at` (UTC). Read submissions privately from Cloudflare Dashboard → D1 → `pinnacle-students` → Console:

```sql
SELECT id, name, father_name, student_class, phone, created_at
FROM student_enquiries
ORDER BY created_at DESC;
```

There is no public API for reading student records. No database credentials are shipped to the browser. The submission API validates input, uses SQL parameters, restricts request size and rejects cross-origin browser requests.

For a full local preview (including database saving), run `npm run db:migrate:local` and `npm run dev:cloudflare`. `npm run dev` previews the frontend only. Run `npm test` for the submission and database tests.
