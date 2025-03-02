# CUETbook

CUETbook is a social platform built using the MERN (MongoDB, Express.js, React.js, Node.js) stack with Next.js for the frontend. It is designed for CUET students and alumni to connect, share posts, and engage with content. 

## Features
- User authentication (login/register) using email/password
- Eligibility verification to ensure only CUET students can sign up
- Post creation and sharing
- Like, comment, and share functionality
- Profile management displaying user type (Alumni/Student), department, student ID, graduation year, and batch
- Search functionality to find alumni or students using "alumni" or "student" keyword, department, or student ID
- Job posts appear distinct from regular posts for easy navigation
- Filter functionality to separate job posts from regular posts
- Real-time friend requests, mutual friends, and friend suggestions
- Video uploading and story management

## Tech Stack
- **Frontend:** Next.js, React.js, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **State Management:** Context API 
- **Authentication:** JWT (JSON Web Tokens)

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone [https://github.com/PrithS24/CUETbook-A-Social-Media-website-to-connect-CUETians.git](https://github.com/PrithS24/CUETbook-A-Social-Media-website-to-connect-Cuetians.git)
   cd CUETbook
2. Install dependencies:
   ```sh
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```
3. Create a `.env` file in the backend directory and add the required environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=8080
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=http://localhost:3000

   ```
4. Run the backend server:
   ```sh
   cd backend
   nodemon index.js
   ```
5. Run the frontend server:
   ```sh
   cd frontend
   npm run dev
   ```
6. Open `http://localhost:3000` in your browser to access the application.

## Contribution
Feel free to contribute! Fork the repository, make changes, and submit a pull request.

## License
This project is licensed under the MIT License.
   
