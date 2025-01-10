# Northcoders News API

NC News API provides a backend service for a news website, allowing users to interact with articles. Users can read articles, leave comments, rate articles up or down, and also rate individual comments. The API serves as the core component of the platform, handling article retrieval, comment posting, user interactions, and more.

The backend is built using Node.js and Express for handling requests and serving data. PostgreSQL (PSQL) is used as the relational database to store articles, comments, user ratings, and other information because it offers solid querying, scalability, and reliability. NPM is used to manage dependencies and packages. 

One of the major challenges was getting the 201 POST request to work correctly, particularly with handling data and error responses. I encountered issues where error handling wasn't effectively catching invalid data or missing fields. This was resolved by improving my error-handling middleware and validating request data more thoroughly before processing it. 

Future features could include advanced search for articles, user authentication for personalising experiences, article categorisation, and recommendations based on ratings or comments.

Steps To Install: 
# Clone the repository
git clone https://github.com/yourusername/nc-news-api.git
cd nc-news-api

# Install dependencies
npm install

# Set up the environment variables
# Create a .env file with the following contents:
DATABASE_URL=your_database_url
NODE_ENV=development
PORT=your_port_number

# Run database migrations and seed data
npm run setup-database

# Start the server
npm start

# Seed the database
npm run seed

How to Use The Project: 
## Available Routes

GET /api, gets API
GET /api/topics, fetches article topics
GET /api/articles/:article_id, fetches article by their aticle ID
GET /api/articles, fetches all articles
GET /api/articles/:article_id/comments, fetches article comments by the article ID
POST /api/articles/:article_id/comments, allows to post a comment to an article
PATCH /api/articles/:article_id, allows articles to be rated up or down 

Developed by: Clare Regan
Special thanks to Northcoders for the mentorship and guidance.

This project is licensed under the MIT License - see the LICENSE.md file for details.




