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

The current deployment is https://pinnacle-achievers-academy.debiprasad1983.workers.dev. The D1 binding and hosted table are already configured. For subsequent updates, run `npm test` and `npm run deploy`.

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
