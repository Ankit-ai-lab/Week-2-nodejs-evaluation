Q: 1
Problem Statement
You are tasked with building the backend for a simple Blog Platform. The platform allows users to register and log in, and authenticated users can create, manage, and interact with blog posts.

Set up the project from scratch — no scaffolding tools. The codebase should be organized into separate folders for models, routes, controllers, and middleware. Sensitive config (MongoDB URI, JWT secret, port) must be stored in a .env file and never committed. Provide a .env.example instead.

Part 1 — Server & Database Setup
Initialize a Node.js project and set up an Express server. Connect to a MongoDB database using Mongoose. The server should log a clear message indicating whether the database connection succeeded or failed.

Set up a custom request logger middleware that prints the HTTP method, URL, and timestamp of every incoming request. Also implement a global error-handling middleware that catches unhandled errors across all routes and returns a consistent JSON error response with an appropriate HTTP status code.

Part 2 — Data Models
Design two Mongoose schemas:

User — should store the user's name, email (unique), hashed password, and role (user or admin). Passwords must be hashed automatically before saving. The model should also expose a method to compare a plain-text password against the stored hash.

Post — should store a title, content, a reference to the author (User), an array of tags, a like count, and a timestamp.

Part 3 — Authentication
Build a registration and login flow:

Register: Accept name, email, and password. Reject duplicate emails. Store the user with a hashed password and return the created profile (without the password).
Login: Validate credentials and, on success, return a signed JWT valid for 7 days.
Create an auth middleware that reads and verifies the JWT from the Authorization: Bearer <token> header, attaches the decoded user to req.user, and blocks unauthenticated requests with a 401 response.

Part 4 — Posts API
Build a REST API for managing posts. All write operations must require authentication.

A user can create a post, where the author is automatically set to the logged-in user.
Anyone can list all posts or fetch a single post by ID. The author field in list responses should show the author's name and email, not just their ID.
The list endpoint should support filtering by a ?tag= query parameter.
A user can update or delete only their own posts. An admin user can delete any post.
Return meaningful 404 and 403 errors where appropriate.
Part 5 — MongoDB Queries
In a standalone file called queries.js, write the following as individual named async functions. Each function should include a brief comment describing its purpose.

Standard Queries
Find all posts with more than 10 likes, sorted by likes descending, returning only the title, likes, and creation date.
Find all users whose email ends with @gmail.com and have the role user.
Find all posts tagged with either "nodejs" or "mongodb" (case-insensitive).
Increment the like count by 1 on all posts belonging to a given author ID.
Delete all posts older than 30 days that have zero likes.
Aggregation Pipeline
Build each of the following using MongoDB's aggregation pipeline (.aggregate([])). Each pipeline must use at least the stages indicated.

Post count per author — Group all posts by author and count how many posts each author has written. Join the result with the users collection to include the author's name in the output. (Stages: $group, $lookup, $project)
Top 3 authors by total likes — Find the three authors whose posts have accumulated the highest combined likes. (Stages: $group, $sort, $limit, $lookup)
Monthly post activity — Break down the total number of posts published per calendar month across all time. The output should include the year, month, and post count, sorted chronologically. (Stages: $group with $dateToString or date operators, $sort)
Tag popularity — Unwind the tags array across all posts and produce a ranked list of the most frequently used tags along with how many posts each tag appears in. (Stages: $unwind, $group, $sort)
Authors with no posts — Identify users who have not authored any post. (Stages: $lookup, $match on empty joined array)
Bonus
Add ?page= and ?limit= query parameters to the list posts endpoint and return pagination metadata (total, page, pages) alongside the results.
Apply a rate limit of 100 requests per 15 minutes to all /api/ routes using express-rate-limit.
Deliverables
A GitHub repository with the complete, working source code.
A README.md with steps to install dependencies, configure environment variables, and run the server.
A .env.example file showing the required environment variable keys (no real values).
A queries.js file at the project root containing all seven query functions from Part 5.
All API endpoints should return JSON responses with appropriate HTTP status codes.
