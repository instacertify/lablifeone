# Mettra

A European-mannered analytical testing house for [www.mettra.com](https://www.mettra.com), built on Next.js 16.

**Be testing. Be unstoppable.**

A Block, Sector 62, Institutional Area, Noida, Uttar Pradesh, India 201301  
[contact@mettra.com](mailto:contact@mettra.com)

## Public house

- Running laboratory cinema on the home page
- Disciplines you can grow (food, cosmetics, electronics, and any new category)
- Lead capture on every public page
- SEO metadata, sitemap, robots, and laboratory JSON-LD

## The Conservatory

Editorial backstage at `/conservatory` — not a generic CMS.

| Room | Purpose |
| --- | --- |
| Ledger | House at a glance |
| Folio | TipTap word editor for pages and insights |
| Atelier | Add and edit testing categories |
| Cinema | Running hero banners |
| Vault | Image upload |
| Compass | SEO scores and practice |
| Chamber | Captured leads |
| House | Address, email, hours, map, tagline |

Default keys (change after first login):

- Email: `conservatory@mettra.com`
- Password: `Unstoppable2026`

## Develop

```bash
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

The site reads SQLite at `prisma/dev.db`. House details and new disciplines are edited in The Conservatory, not in code.
