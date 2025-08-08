# Hello Universe

## Description

*A Code:You Web Development Pathway capstone project.*

**Hello Universe** is a space- and astronomy-themed web application created to make good use of high-quality public resources. It aims to make scientific data and imagery more accessible and engaging by combining curated content with interactive visualizations. From skywatching tips to Mars rover data, this project highlights how open data can inspire curiosity.

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

- What's Up: Monthly skywatching tips from NASA presented via embedded YouTube videos.
- Astronomy Picture of the Day (APOD) Calendar: Interactive calendar displaying daily astronomy images and descriptions.
- Mars Rover Camera Usage Visualization: Dynamic charts showing camera usage data from Mars rover missions.
- Contact Form: Allows users to send messages through the app.

## Sitemap of Routes

| URL                         | Description                                    |
|-----------------------------|------------------------------------------------|
| `/`                         | Home / What's Up Skywatching Tips video        |
| `/apod`                     | Astronomy Picture of the Day calendar          |
| `/mars-rovers`              | Mars rover missions timeline                   |
| `/mars-rovers/[rover]/data` | Mars rover camera data (dynamic route by rover)|
| `/contact`                  | Contact form                                   |

## Technologies Used

- Next.js
- React Calendar
- D3.js
- YouTube API
- NASA Open APIs
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