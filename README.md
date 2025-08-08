# Hello Universe

## Description

*A Code:You Web Development Pathway capstone project.*

*Hello Universe* is a space- and astronomy-themed web application created to make good use of high-quality public resources. It aims to make scientific data and imagery more accessible and engaging by combining curated content with interactive visualizations. From skywatching tips to Mars rover data, this project highlights how open data can inspire curiosity.

## Installation Instructions

1. **Clone the repository**
```bash
git clone https://github.com/huansong1214/hello-universe
cd hello-universe
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root of the project and copy the contents of `.env.example` into it. Then replace the placeholder values with your actual API keys.

```bash
cp .env.example .env.local
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser and visit** [http://localhost:3000](http://localhost:3000)

## Features

### What's Up Monthly Skywatching Tips Video
- API: Fetches the latest video from NASA’s YouTube playlist using the YouTube Data API.
- UI: React component loads video data, handles loading and errors, and embeds the video with title and description.

### Astronomy Picture of the Day (APOD) Calendar
- API: Fetches NASA APOD data by date or range with error handling.
- Hook: Caches monthly APOD data in-memory and localStorage, managing loading and errors.
- UI: Interactive calendar with thumbnails and date selection opening a modal with details. Supports lazy loading and keyboard navigation.

### Mars Rover Camera Usage Visualization

#### Mars Rover Missions Timeline
- API: Uses NASA Mars Photos API to fetch mission manifests (status, launch/landing dates, total photos).
- UI: Timeline of rover missions sorted by landing date (most recent first). Each rover appears as a flip card with mission details and link to camera usage data.

#### Mars Rover Camera Usage Visualization
- API: Fetches rover manifest data from NASA Mars Photos API and calculates sols each camera was used. Cameras grouped into Engineering, Science, or Entry/Descent/Landing categories.
- UI: Interactive D3 bar chart visualizes camera activity by sol count, color-coded by category. Sidebar shows camera details on hover and clickable legend toggles categories.

#### Mars Rover Camera Reference Table
- API: Retrieves camera metadata from a Notion database via the Notion API, filtered by rover.
- UI: Responsive table lists camera abbreviation, full name, and category, sorted by category for easy reference.

### Contact Form
- API: Sends emails via Resend API with inputs validated by Zod, returning detailed errors.
- UI: React form with name, email, and message fields. Validation and server errors appear together in a single error block to prevent layout shifts. Submit button disables during submission, and form resets on success.

## Sitemap of Routes

| URL                         | Description                                    |
|-----------------------------|------------------------------------------------|
| `/`                         | Home / What's Up Skywatching Tips Video        |
| `/apod`                     | Astronomy Picture of the Day Calendar          |
| `/mars-rovers`              | Mars Rover Missions Timeline                   |
| `/mars-rovers/[rover]/data` | Mars Rover Camera Data (dynamic route by rover)|
| `/contact`                  | Contact Form                                   |

## Technologies Used

- Next.js
- D3.js
- react-calendar
- react-super-responsive-table
- NASA Open APIs
- YouTube Data API
- Resend API

## Credits

- [Code:You](https://code-you.org)

- APOD calendar design inspiration:
  [NASA's Astronomy Picture of the Day](https://lizkalter.github.io/nasa-apod-calendar/)

- Mars rover camera data:
  [Mars Rover Photos API](https://mars-photos.herokuapp.com)

- D3 interactive bar chart tutorial:
  *JavaScript Crash Course* book by Nick Morgan

- CSS resources:
  [W3Schools](https://www.w3schools.com)
  [freeCodeCamp](https://www.freecodecamp.org)
