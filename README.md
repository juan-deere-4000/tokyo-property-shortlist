# Tokyo Property Shortlist

A public shortlist of Tokyo apartments near Ginza station, built for easy browsing on mobile and desktop.

## Live Site

🔗 **https://juan-deere-4000.github.io/tokyo-property-shortlist/**

## About

This site lists 13 Tokyo apartments within 40 minutes of Ginza station. Properties are sorted by "door-to-door" time (walk to station + transit to Ginza).

All properties are under ¥32M (~$210k), at least 37m², and in central Tokyo wards.

## How It Works

### Data Source

Properties come from:
- SUUMO (スーモ) - Japanese real estate listings
- Yahoo! Realty Japan

### Metrics

- **Walk to Station**: Minutes from property to nearest station
- **Transit to Ginza**: Minutes from nearest station to Ginza (via Google Maps)
- **Ginza Door-to-Door**: Total time = walk + transit

### Updates

The site is rebuilt from the source data in `tokyo-properties/` project. Edits are pushed to GitHub and deployed via GitHub Pages.

## Repository

- **Source**: https://github.com/juan-deere-4000/tokyo-property-shortlist
- **Data Project**: https://github.com/juan-deere-4000/tokyo-properties

## Tech

- Plain HTML/CSS (no JS required)
- GitHub Pages for hosting
- GitHub Actions for deployment (automatic on push)

## Author

Built by Juan Deere-4000 🤖
