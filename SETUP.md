# How to Run the Portfolio Website

## Prerequisites

Before starting, make sure you have installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either:
  - Local MongoDB installation - [Download here](https://www.mongodb.com/try/download/community)
  - OR MongoDB Atlas account (cloud) - [Sign up here](https://www.mongodb.com/cloud/atlas)

## Step-by-Step Setup

### Step 1: Install Backend Dependencies

Open your terminal/command prompt and navigate to the backend folder:

```bash
cd backend
npm install
```

This will install all required packages (Express, Mongoose, CORS, etc.)

### Step 2: Set Up Environment Variables

Create a `.env` file in the `backend` folder with the following content:

**For Local MongoDB:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
NODE_ENV=development
```

> **Note:** Replace `your_mongodb_atlas_connection_string_here` with your actual MongoDB Atlas connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/portfolio`)

### Step 3: Start MongoDB

**If using Local MongoDB:**
- On Windows: MongoDB should start automatically as a service, or run `mongod` in a separate terminal
- On Mac/Linux: Run `mongod` in a terminal, or start MongoDB service

**If using MongoDB Atlas:**
- No need to start anything locally, just make sure your connection string is correct

### Step 4: Start the Backend Server

In the `backend` folder, run:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

You should see:
```
MongoDB Connected
Server is running on port 5000
```

### Step 5: Access the Website

You have two options:

**Option A: Via Express Server (Recommended)**
- Open your browser and go to: `http://localhost:5000`
- The Express server serves the frontend files automatically

**Option B: Direct HTML File**
- Open `frontend/index.html` directly in your browser
- Note: The contact form will only work if the backend is running on `http://localhost:5000`

## Testing the Setup

1. **Check Backend Health:**
   - Visit: `http://localhost:5000/api/health`
   - Should return: `{"status":"Server is running"}`

2. **Test Contact Form:**
   - Go to the Contact section
   - Fill out and submit the form
   - Check the Messages page to see your submission

3. **View Messages:**
   - Navigate to the Messages page
   - You should see all submitted contact forms

## Troubleshooting

### MongoDB Connection Error
- **Local MongoDB:** Make sure MongoDB is running (`mongod` command)
- **MongoDB Atlas:** Check your connection string and ensure your IP is whitelisted

### Port Already in Use
- Change the PORT in `.env` file to a different number (e.g., 5001)
- Update the API URL in `frontend/script.js` and `frontend/messages.js` if needed

### CORS Errors
- Make sure the backend server is running
- Check that the API URL in frontend files matches your backend URL

### Contact Form Not Working
- Ensure backend server is running
- Check browser console for errors
- Verify MongoDB connection is successful

## Quick Start Commands Summary

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Create .env file (manually create it with content above)

# 3. Start MongoDB (if local) - in separate terminal
mongod

# 4. Start backend server
npm start

# 5. Open browser to http://localhost:5000
```

## Development Mode

For development with auto-reload when files change:

```bash
npm run dev
```

This requires `nodemon` which should be installed automatically with `npm install`.

