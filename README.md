1. My site is named MusicSphere. We can visit my site on: https://capstone-2-frontend-aa76.onrender.com/.

2. This music app aims to offer users a comprehensive and enjoyable experience by delving into artists and their album histories. It strives to assist users in discovering new music, gaining insights into their favorite artists, exploring diverse genres, and curating personal collections of songs. Positioned as a go-to platform, the app caters to music enthusiasts, artists, and anyone intrigued by the rich history of albums and musicians.

3. The implemented features in the music app are:

--- User Login and Signup: ---

Purpose: Provides users with personalized experiences, including the ability to create playlists and manage their collections.
Reason for Implementation: Enhances user engagement and allows for the creation of personalized content.

--- Search Songs, Artists, and Albums: ---

Purpose: Enables users to explore and discover music without the need to log in.
Reason for Implementation: Enhances accessibility and usability, catering to both registered and non-registered users.

--- Add to Playlist: ---

Purpose: Allows users to create and manage playlists by adding songs.
Reason for Implementation: Enhances user experience by providing a customizable and organized way to save and revisit favorite songs.

--- Collection of Songs: ---

Purpose: Lets users curate their own collection of songs.
Reason for Implementation: Fosters user engagement and provides a feature for users to create a personal library of preferred songs.

The chosen features aim to strike a balance between user convenience, engagement, and personalization. User authentication is implemented to unlock advanced features like playlist creation, while core functionalities such as searching and creating song collections are accessible to all users, fostering a user-friendly and inclusive environment.

4. Walkthrough of the standard user flow for the music app:

Homepage:
Initial Landing: Users arrive at the homepage, where they are greeted with the app's name, a brief tagline, and buttons or links to navigate to different sections, such as searching for artists, albums, or songs.

Exploring without Logging In:
Search Feature: Users have the option to explore the app without logging in. They can use the search functionality to discover artists, albums, or songs based on their preferences.

User Registration:
Signup: If users decide to engage more deeply, they can choose to sign up for an account. The signup page typically asks for necessary information, such as username, password, first name, last name, and email.

User Login:
Login: Users who already have an account can log in using their credentials, including username and password.

Personalized Experience for Logged-In Users:
User Dashboard: Once logged in, users are redirected to a personalized dashboard. This dashboard may include options such as viewing their playlists, managing their profile, or exploring recommended content based on their preferences.

Search and Exploration for Logged-In Users:
Enhanced Search: Logged-in users can continue using the search feature with the added benefit of personalized recommendations and the ability to add songs to playlists or their song collection.

Adding Songs to Playlist:
Playlist Management: Users can create new playlists, add songs to existing playlists, and manage their playlist collection.

Profile Management:
Edit Profile: Users have the option to edit their profile information, including details such as password, first name, last name, and email.

Logout:
Logout Option: Users can choose to log out, ending their current session.

User flow is designed to cater to both casual visitors who wish to explore the app without an account and registered users seeking a more personalized and interactive experience. The app provides a seamless transition between these two states, encouraging users to engage at their preferred level of involvement.

5. API Source: The app relies on "https://www.theaudiodb.com/" for fetching data related to artists, albums, and songs.

API Key Requirement: To access the API, an API key is necessary. The key is obtained by purchasing it from the service. The API key is stored in the "/backend/helpers/api_key.js" file.

Code Modification: If you wish to use the provided code, you'll need to buy your API key and replace the placeholder value in the "/backend/helpers/api_key.js" file with your actual key. This ensures proper authorization and access to the API.

Cost Implications: Since the API key needs to be purchased, there might be associated costs depending on the pricing structure of the API service. Users should refer to the API documentation for details on pricing plans.

6. Technology stack: JavaScript, HTML, CSS, Express, React-Bootstrap, NodeJs, PostgreSQL, Axios, jsonwebtoken, bcrypt.
