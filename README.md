# YouTube Search Bookmark App

## Project Overview

The YouTube Search App is a web application that allows users to search for YouTube videos using the YouTube Data API V3. The application provides a user-friendly interface to input search queries and displays the search results in a structured format. Additionally, cookies are used to store the session ID of a user to maintain the session and retrieve Firebase data for that particular session.

## Features

- Search for YouTube videos by keywords
- Display video results with thumbnails, titles, and descriptions
- Pagination to navigate through search results
- Responsive design for mobile and desktop views

## Technologies Used

- **Frontend**: NextJs,React
- **Backend**: Firebase, Next SSR
- **API**: YouTube Data API v3
- **Deployment**: Vercel

## Environment Variables

To run this project, you will need to set up the following environment variables:

- `YOUTUBE_API_KEY`: YouTube Data API key
- `NEXT_PUBLIC_APP_ID`:Firebase App Id
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API Key

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine
- A YouTube Data API key

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/aaqifshafi/yt_search_app.git
   ```
2. Navigate to the project directory:
   ```sh
   cd yt_search_app
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

### Running the Application

1. Create a `.env` file in the root directory and add your API key:
   ```env
   YOUTUBE_API_KEY=api_key_here
   ```
   ```env
   NEXT_PUBLIC_APP_ID=app id firebase (from firbase console)
   ```
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=API key firebase (from firbase console)
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Usage

1. Enter a search query in the search bar.
2. Click the "Search" button.
3. Browse through the search results displayed on the page.
4. Use the pagination controls to navigate through multiple pages of results.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact [aaqifshafi](aaqif.codes).
