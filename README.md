
# CineBooker - Your Movie Ticket Booking App

CineBooker is a web application designed to help users discover movies, view showtimes, select seats, and book tickets online. This project is built with a modern tech stack and focuses on providing a seamless user experience.

## Application Demo -
https://movie-ticket-booking-system-ui-prachipanditraos-projects.vercel.app/login

- **Test User**
    - username - user
    - password - password

## Tech Stack

- **Frontend Framework:** Next.js (with App Router)
- **Language:** TypeScript
- **UI Components:** ShadCN UI
- **Styling:** Tailwind CSS
- **State Management:** React Context API (for Auth), React Hooks (`useState`, `useEffect`)
- **AI Integration (Core):** Genkit (for any potential AI-driven features)
- **API Communication:** Fetch API

## Key Features

- **User Authentication:**
    - User registration and login.
    - Session management using tokens.
- **Movie Browsing:**
    - Homepage displaying a list of "Now Showing" movies.
    - Individual movie details page with poster, description, genre, and duration.
- **Showtime Information:**
    - Display of available showtimes for each movie.
    - Theatre names displayed for each show (fetched via API).
- **Seat Selection:**
    - Interactive seat selection grid for chosen shows.
    - Real-time display of seat availability (available, booked, selected).
    - Calculation of total price based on selected seats (default price: ₹150 per seat).
- **Ticket Booking:**
    - Secure ticket booking process for authenticated users.
    - Integration with a backend API for booking confirmation.
- **Responsive Design:**
    - UI adapted for various screen sizes.
- **Error Handling & Loading States:**
    - User-friendly error messages and loading indicators (skeletons) for a better UX.
- **Image Optimization:**
    - Use of `next/image` for optimized image loading, with fallbacks for invalid or inaccessible poster URLs.

## Getting Started

### Prerequisites

- Node.js (version 18.x or later recommended)
- npm or yarn

### Installation

1.  **Clone the repository (if applicable):**
    ```bash
    git clone https://github.com/prachipanditrao/Movie-Ticket-Booking-System-UI.git
    cd Movie-Ticket-Booking-System-UI
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Environment Variables:**
    This project likely requires a backend API. Ensure you have the API base URL configured. Typically, this would be in a `.env.local` file:
    ```env
    NEXT_PUBLIC_API_BASE_URL=https://your-api-endpoint.com
    ```
    For this project, the default is set to `https://movie-ticket-booking-system-ui-prachipanditraos-projects.vercel.app`.

## Available Scripts

In the project directory, you can run:

-   **`npm run dev` or `yarn dev`**:
    Runs the app in development mode using Next.js with Turbopack.
    Open [http://localhost:9002](http://localhost:9002) (or the port specified in your setup) to view it in the browser.
    The page will reload if you make edits.

-   **`npm run build` or `yarn build`**:
    Builds the app for production to the `.next` folder.
    It correctly bundles React in production mode and optimizes the build for the best performance.

-   **`npm run start` or `yarn start`**:
    Starts a Next.js production server. Requires a build to be run first.

-   **`npm run lint` or `yarn lint`**:
    Lints the project files using Next.js's built-in ESLint configuration.

-   **`npm run typecheck` or `yarn typecheck`**:
    Runs the TypeScript compiler to check for type errors.

-   **Genkit Scripts (if Genkit features are actively used):**
    -   `npm run genkit:dev` or `yarn genkit:dev`
    -   `npm run genkit:watch` or `yarn genkit:watch`

## Project Structure (Simplified)

-   **`src/app/`**: Contains the pages and layouts using Next.js App Router.
    -   `page.tsx`: Homepage.
    -   `movies/[movieId]/page.tsx`: Movie details page.
    -   `movies/[movieId]/shows/[showId]/seats/page.tsx`: Seat selection page.
    -   `login/page.tsx` & `register/page.tsx`: Authentication pages.
-   **`src/components/`**: Reusable UI components.
    -   `auth/`: Login and Register forms.
    -   `layout/`: Header and Footer.
    -   `movies/`: MovieCard, ShowTimeCard, SeatSelectionGrid.
    -   `ui/`: ShadCN UI components.
-   **`src/lib/`**: Utility functions, API communication (`api.ts`), authentication logic (`auth.ts`).
-   **`src/providers/`**: React Context providers (e.g., `AuthProvider.tsx`).
-   **`src/hooks/`**: Custom React hooks (e.g., `useAuth.ts`).
-   **`src/types/`**: TypeScript type definitions.
-   **`src/ai/`**: Genkit related files (if AI features are implemented).
-   **`public/`**: Static assets.
-   **`next.config.js`**: Next.js configuration.
-   **`tailwind.config.ts`**: Tailwind CSS configuration.
-   **`globals.css`**: Global styles and Tailwind CSS theme variables.