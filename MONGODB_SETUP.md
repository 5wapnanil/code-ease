# MongoDB Setup Guide

## The Error: "Database connection not available"

This means MongoDB is not connected. Follow these steps to fix it.

## Option 1: Local MongoDB Installation

### Step 1: Install MongoDB
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install it on your system
3. Make sure MongoDB service is running

### Step 2: Start MongoDB
**Windows:**
- MongoDB usually runs as a Windows service automatically
- Or run manually: `mongod` in a terminal
- Check if running: Open Services (services.msc) and look for "MongoDB"

**Mac:**
```bash
brew services start mongodb-community
# Or manually:
mongod --config /usr/local/etc/mongod.conf
```

**Linux:**
```bash
sudo systemctl start mongod
# Or:
sudo service mongod start
```

### Step 3: Verify MongoDB is Running
Open a new terminal and run:
```bash
mongo
# Or for newer versions:
mongosh
```

If you see the MongoDB shell, it's working!

### Step 4: Update .env File
In `backend/.env`, make sure you have:
```
MONGODB_URI=mongodb://localhost:27017/portfolio
```

## Option 2: MongoDB Atlas (Cloud - Recommended for Beginners)

### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a free cluster (M0 - Free tier)

### Step 2: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. It looks like: `mongodb+srv://username:password@cluster.mongodb.net/portfolio`

### Step 3: Update .env File
In `backend/.env`, replace with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
```

**Important:** Replace `your-username` and `your-password` with your actual credentials!

### Step 4: Whitelist IP Address
1. In Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development) or add your IP

## Option 3: Quick Test Without MongoDB (Temporary)

If you just want to test the website without setting up MongoDB, you can modify the code temporarily, but **messages won't be saved**.

## Verify Connection

### Check Server Console
When you start the server, you should see:
```
✓ MongoDB Connected Successfully!
Database: portfolio
Connection state: 1
```

### Test Database Connection
Open in browser: `http://localhost:5000/api/test-db`

You should see:
```json
{
  "status": "Database connected",
  "messageCount": 0,
  "collection": "contacts"
}
```

## Troubleshooting

### Error: "MongoServerError: Authentication failed"
- Check your username and password in the connection string
- Make sure credentials are correct

### Error: "MongoServerSelectionError: connect ECONNREFUSED"
- MongoDB is not running
- Start MongoDB service
- Check if port 27017 is available

### Error: "MongoNetworkError: failed to connect"
- Check your internet connection (for Atlas)
- Verify IP is whitelisted (for Atlas)
- Check firewall settings

### Error: "Connection timeout"
- MongoDB might be slow to start
- Wait a few seconds and try again
- Check MongoDB logs for errors

## Quick Commands

**Check if MongoDB is running:**
```bash
# Windows
net start MongoDB

# Mac/Linux
brew services list | grep mongodb
# or
sudo systemctl status mongod
```

**Start MongoDB manually:**
```bash
mongod --dbpath /path/to/data
```

**Test MongoDB connection:**
```bash
mongo
# or
mongosh
```

## Still Having Issues?

1. Check the server console for detailed error messages
2. Verify your `.env` file exists and has correct `MONGODB_URI`
3. Make sure MongoDB service is running
4. Try restarting the backend server after MongoDB is running
5. Check MongoDB logs for connection errors

