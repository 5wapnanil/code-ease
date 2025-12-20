# Full Stack Portfolio Website

A modern, fully functional portfolio website built with Express.js backend and vanilla JavaScript frontend, featuring GSAP animations and MongoDB integration.

## Features

- **Hero Section** - Eye-catching introduction with user information
- **About Section** - Detailed information about the user with statistics
- **Education Section** - Timeline view of educational qualifications
- **Skills Section** - Interactive icon grid showcasing technical skills
- **Projects Section** - Showcase of completed projects with details
- **Contact Section** - Fully functional contact form integrated with MongoDB
- **Messages Page** - View and manage all contact form submissions
- **Navigation Bar** - Smooth scrolling navigation with active link highlighting
- **Footer** - Social media links and site map
- **GSAP Animations** - Modern scroll-triggered animations throughout
- **Responsive Design** - Mobile-friendly layout

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- CORS
- Body Parser

### Frontend
- HTML5
- CSS3 (Custom styles, no Tailwind)
- Vanilla JavaScript
- GSAP (GreenSock Animation Platform)
- Font Awesome Icons

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

The frontend files are static HTML/CSS/JS files. Simply open `frontend/index.html` in a browser or serve them through the Express server (which is already configured).

## Usage

1. **Start MongoDB**: Make sure MongoDB is running on your system
   - Local MongoDB: `mongod` (if installed locally)
   - Or use MongoDB Atlas and update the connection string in `.env`

2. **Start Backend Server**:
   ```bash
   cd backend
   npm start
   ```

3. **Access the Website**:
   - Open `frontend/index.html` in your browser
   - Or access through the Express server at `http://localhost:5000`

4. **View Messages**:
   - Navigate to the Messages page to see all contact form submissions
   - Messages are stored in MongoDB and can be deleted individually

## Project Structure

```
portfolio/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables (create this)
├── frontend/
│   ├── index.html        # Main portfolio page
│   ├── messages.html     # Messages viewing page
│   ├── styles.css        # Custom CSS styles
│   ├── script.js         # Main JavaScript with GSAP animations
│   └── messages.js       # Messages page JavaScript
└── README.md             # This file
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/contact` - Submit contact form
- `GET /api/messages` - Get all messages
- `GET /api/messages/:id` - Get single message by ID
- `DELETE /api/messages/:id` - Delete a message

## Customization

### Update User Information

1. **Hero Section**: Edit `frontend/index.html` - Update name, title, and description
2. **About Section**: Modify the about text and statistics
3. **Education**: Update timeline items in the education section
4. **Skills**: Add or remove skill items in the skills grid
5. **Projects**: Update project cards with your actual projects
6. **Contact Info**: Update email, phone, and location in the contact section
7. **Social Links**: Update footer social media links

### Styling

All styles are in `frontend/styles.css`. Customize colors, fonts, and layouts by modifying CSS variables in the `:root` selector.

### Animations

GSAP animations are configured in `frontend/script.js`. Adjust animation timings, effects, and triggers as needed.

## Notes

- Make sure MongoDB is running before starting the backend server
- Update the MongoDB connection string in `.env` if using MongoDB Atlas
- The contact form requires all fields to be filled
- Messages are stored permanently in MongoDB until deleted

## License

This project is open source and available for personal and commercial use.

