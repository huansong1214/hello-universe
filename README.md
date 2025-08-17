# Hello Universe

## Description

_A Code:You Web Development Pathway capstone project._

_Hello Universe_ is a space- and astronomy-themed web application created to make good use of high-quality public resources. It aims to make scientific data and imagery more accessible and engaging by combining curated content with interactive visualizations. From skywatching tips to Mars rover data, this project highlights how open data can inspire curiosity.

## Capstone Requirements Fulfilled

- APIs Used

  ```tree
  /app/api/
  ├── /apod/route.ts             # NASA APOD API
  ├── /contact/route.ts          # Resend API
  ├── /mars-rover/[rover]/       # Dynamic route by rover
  │   ├── /chart/route.ts        # NASA Mars Rover Photos API
  │   ├── /manifest/route.ts     # NASA Mars Rover Photos API
  │   └── /table/route.ts        # Notion API
  └── /whats-up/route.ts         # YouTube Data API
  ```

- Responsive Design
  - Mobile-first layout using media queries
  - Hamburger menu for smaller screens
  - Flexbox layout for camera chart
  - Calendar overlay hidden on smaller screens
  - Alternating rover cards on larger screens
  - Camera table styled with `react-super-responsive-table`
  - Max content width of 768px for better readability
- Data Visualization
  - D3 bar chart for Mars rover camera usage
- Data Persistence
  - Caches latest YouTube video, monthly APOD data, and Mars mission manifests in `localStorage`
- Interactive UI
  - `react-calendar` for APOD date selection and modals
- Framework Used
  - Built with Next.js (React)

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

### Sitemap of Routes

| URL                         | Description                                     |
| --------------------------- | ----------------------------------------------- |
| `/`                         | Home / What's Up – Skywatching Tips Video       |
| `/apod`                     | Astronomy Picture of the Day (APOD) Calendar    |
| `/mars-rovers`              | Mars Rover Missions Timeline                    |
| `/mars-rovers/[rover]/data` | Mars Rover Camera Data (dynamic route by rover) |
| `/contact`                  | Contact Form                                    |

### What's Up – Monthly Skywatching Tips Video

- API: Fetches the latest video from NASA’s YouTube playlist using the YouTube Data API.
- Caching: Stores the latest video in `localStorage` and reuses it until the start of the next month.
- UI: React component loads video data, handles loading and errors, and embeds the video with title and description.

### Astronomy Picture of the Day (APOD) Calendar

- API: Fetches APOD data by date or range using the NASA APOD API.
- Hook: Handles loading, error handling, and data fetching logic.
- Caching: Stores monthly APOD data in `localStorage`.
- UI: Interactive calendar with thumbnails and modals for selected dates.

### Mars Rover Camera Usage Visualization

#### Mars Rover Missions Timeline

- API: Uses the NASA Mars Photos API to fetch mission manifests (status, launch/landing dates, total photos).
- UI: Displays a timeline sorted by landing date (most recent first). Each rover appears as a flip card with mission details and link to camera usage data.

#### Mars Rover Camera Usage Bar Chart

- API: Fetches rover manifest data from NASA Mars Photos API and calculates the number of sols each camera was used. Cameras are grouped by category: Engineering, Science, or Entry/Descent/Landing.
- UI: Interactive D3 bar chart visualizes camera activity by sol count, color-coded by category. Sidebar shows camera details on hover and clickable legend toggles categories.

#### Mars Rover Camera Reference Table

- API: Fetches camera metadata from a Notion database via the Notion API, filtered by rover.
- UI: Responsive table lists camera abbreviation, full name, and category, sorted by category for easy reference.

### Contact Form

- API: Sends emails via the Resend API, with inputs validated by Zod.
- UI: React form with fields for name, email, and message. Displays validation and server errors together in one block to avoid layout shifts.

## Credits

- [Code:You](https://code-you.org)

- APOD calendar design inspiration:
  [NASA's Astronomy Picture of the Day](https://lizkalter.github.io/nasa-apod-calendar/)

- Mars rover camera data:
  - [Mars Rover Photos API](https://mars-photos.herokuapp.com)
  - [Perseverance Raw Images](https://mars.nasa.gov/mars2020/multimedia/raw-images/)
  - [Curiosity Raw Images](https://mars.nasa.gov/msl/multimedia/raw-images/)

- D3 interactive bar chart tutorial:
  _JavaScript Crash Course_ book by Nick Morgan

- CSS resources:
  [W3Schools](https://www.w3schools.com)
  [freeCodeCamp](https://www.freecodecamp.org)
