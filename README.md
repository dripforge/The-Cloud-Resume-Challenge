# Jon Rogol — personal website

Live at **[acloudyday.net](https://acloudyday.net/)**. A personal portfolio focused on network engineering, enterprise and healthcare environments, and a practical AWS hosting project.

## Current website

The production website lives in [`Website/`](Website/). It uses semantic HTML and responsive CSS; there is no build step. Optional visitor analytics uses a small consent script; the portfolio works without JavaScript. Portrait images use responsive WebP sources with a JPEG fallback. The site includes keyboard focus styles, a skip link, reduced-motion support, print styles, structured profile data, and a social sharing image.

```text
Browser → HTTPS → Amazon CloudFront → Amazon S3
```

GitHub holds the source and change history. `Example Website/` and `HTML Templates/` contain earlier reference material; they are not the current deployed frontend. Their sample backend code is not a claim that a visitor counter or API is running on the live site.

## Preview locally

From the repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory Website
```

Open `http://127.0.0.1:8765/`. Check narrow mobile and desktop widths, keyboard navigation, internal anchors, external links, and image loading before publishing changes.

## Publish

The existing AWS deployment uses the `acloudyday.net` S3 bucket and CloudFront distribution `E194NF418BRUEG`. Use an authorized AWS session. Preview changed files before uploading; do not delete other bucket contents.

```sh
aws s3 sync Website/ s3://acloudyday.net/ --cache-control 'public,max-age=300' --dryrun
aws s3 sync Website/ s3://acloudyday.net/ --cache-control 'public,max-age=300'
aws cloudfront create-invalidation --distribution-id E194NF418BRUEG --paths '/*'
```

Verify the invalidation completes and the public page and changed assets match the release. When editing the stylesheet, update its version query in `index.html` so returning visitors request the latest CSS.

## Visitor analytics

GA4 property **acloudyday.net** (560432695), account **Jon Rogol — acloudyday.net** (413180626), web stream 16189848627, measurement ID `G-TMS4PX6SKX`.

[Open Analytics](https://analytics.google.com/analytics/web/#/a413180626p560432695/reports/intelligenthome). On Home, select **Total users** in the first metric dropdown and **Last 30 days** in its date picker; **Total users** estimates distinct visitors, while Views counts page loads. Realtime shows recent test visits. Standard reports can take 24–48 hours to populate. Tracking starts with this release and cannot backfill previous visits.

`analytics.js` loads Google's tag only on the production apex/www hostnames and only after explicit visitor consent. No requests go to Analytics when a visitor declines. The footer and privacy page reopen the choice; withdrawing consent disables collection, removes GA cookies, and reloads the page to unload the tag. Local previews never load Analytics. Page/referrer query strings and fragments are stripped. Google Signals, ad personalization, optional account sharing, and enhanced measurement are off; basic page views and automatic session/user measurement remain enabled.

Counts cover consenting, unblocked browsers and are estimates, not a census of people. Separate browsers/devices may count separately; known bots are filtered by GA4, but no analytics system detects every bot. Keep `privacy.html` in sync with future measurement changes.

Live verification on October 23, 2026: the four published files matched the release, CloudFront invalidation `IA31899CLFTSKR43G2J1BWMFXS` completed, and Realtime received one test user with `first_visit`, `session_start`, and `page_view` events.
