<div align="center">
<h3 align="center">Fluxed</h3>

  <p align="center">
An app that helps reducing your pain of rescheduling whether disruption happens!
    <br />
    <a href="https://github.com/joes131205/fluxed/graphs/contributors"><img src="https://img.shields.io/github/contributors/joes131205/fluxed.svg?style=for-the-badge" alt="Contributors"> </a>
    <a href="https://github.com/joes131205/fluxed/stargazers"><img src="https://img.shields.io/github/stars/joes131205/fluxed.svg?style=for-the-badge" alt="Stars"> </a>
      <a href="https://github.com/joes131205/fluxed/network/members"><img src="https://img.shields.io/github/forks/joes131205/fluxed.svg?style=for-the-badge" alt="Forks"></a>
    <a href="https://github.com/joes131205/fluxed/issues">  <img src="https://img.shields.io/github/issues/joes131205/fluxed.svg?style=for-the-badge" alt="Issues"> </a><a href="https://wakatime.com/badge/github/Joes131205/fluxed"><img src="https://wakatime.com/badge/github/Joes131205/fluxed.svg?style=for-the-badge" alt="wakatime"> </a>
    <a href="https://github.com/joes131205/fluxed/blob/master/LICENSE.txt"><img src="https://img.shields.io/github/license/joes131205/fluxed.svg?style=for-the-badge" alt="License"></a>
    <br />
    <a href="https://github.com/joes131205/repo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
<a href="https://github.com/joes131205/fluxed/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/joes131205/fluxed/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>

## About The Project

When your daily schedule got interrupted by unexpected events (e.g. Unexpected Meetings, Delayed Event, etc.), manually adjusting the rest of your day takes so much time. In which, **Fluxed** can help you reschedule whenever needed!

### Built With

- [![React Native][ReactNative-shield]][ReactNative-url]
- [![Expo][Expo-shield]][Expo-url]
- [![Tailwind CSS][Tailwind-shield]][Tailwind-url]
- [![Hono][Hono-shield]][Hono-url]
- [![Drizzle ORM][Drizzle-shield]][Drizzle-url]
- [![PostgreSQL][Postgres-shield]][Postgres-url]

## Getting Started

To get a local copy of the Fluxed mobile client up and running, follow these steps.

### Prerequisites

- Bun 1.3+ (package manager and runtime used in this workspace)
- PostgreSQL (for local development)
- Expo CLI / native toolchain if you want to run the mobile app on device/simulator (Android Studio or Xcode)
    ```sh
    npm install -g expo-cli
    ```

### Installation

1. Clone the repo

```sh
git clone https://github.com/Joes131205/fluxed.git
```

2. Navigate into the project directory

```sh
cd fluxed
```

3. Install dependencies (from the repository root):

```bash
bun install
```

4. Copy the example environment file and fill in secrets for mobile, server, and packages/db:

```bash
cp .env.example .env
# Edit .env and replace placeholders (DB_URL, JWT_SECRET, Google credentials, etc.)
```

5. Create and prepare the database (ensure Postgres is running and `DB_URL` in `.env` is correct):

```bash
# Run Drizzle migrations (this uses the workspace script)
bun run db:migrate
```

6. Start a single service or the full workspace:

Start the API server only:

```bash
cd apps/server
bun run dev
```

Start the mobile app only (Expo):

```bash
cd apps/mobile
bun run dev
```

Start the whole workspace (Turbo will start workspace dev tasks):

```bash
bun run dev
```

If you need to open the Drizzle studio for DB inspection:

```bash
bun run db:studio
```

[contributors-shield]: https://img.shields.io/github/contributors/joes131205/fluxed.svg?style=for-the-badge
[contributors-url]: https://github.com/joes131205/fluxed/graphs/contributors
[contributions-shield]: https://img.shields.io/github/contributors/joes131205/fluxed.svg?style=for-the-badge
[contributions-url]: https://github.com/joes131205/fluxed/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/joes131205/fluxed.svg?style=for-the-badge
[forks-url]: https://github.com/joes131205/fluxed/network/members
[stars-shield]: https://img.shields.io/github/stars/joes131205/fluxed.svg?style=for-the-badge
[stars-url]: https://github.com/joes131205/fluxed/stargazers
[issues-shield]: https://img.shields.io/github/issues/joes131205/fluxed.svg?style=for-the-badge
[issues-url]: https://github.com/joes131205/fluxed/issues
[important-shield]: https://img.shields.io/github/issues/joes131205/fluxed.svg?style=for-the-badge
[important-url]: https://github.com/joes131205/fluxed/issues
[license-shield]: https://img.shields.io/github/license/joes131205/fluxed.svg?style=for-the-badge
[license-url]: https://github.com/joes131205/fluxed/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/joes131205
[product-screenshot]: images/screenshot.png
[ReactNative-shield]: https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[ReactNative-url]: https://reactnative.dev/
[Expo-shield]: https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white
[Expo-url]: https://expo.dev/
[Tailwind-shield]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Hono-shield]: https://img.shields.io/badge/Hono-E0234E?style=for-the-badge&logo=hono&logoColor=white
[Hono-url]: https://hono.dev/
[Drizzle-shield]: https://img.shields.io/badge/Drizzle_ORM-000000?style=for-the-badge&logo=drizzle&logoColor=white
[Drizzle-url]: https://orm.drizzle.team/
[Postgres-shield]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org/
