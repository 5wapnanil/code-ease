# Debugging Guide - Messages Not Showing

## Step-by-Step Debugging

### 1. Check Backend Server
Make sure the server is running:
```bash
cd backend
npm start
```

You should see:
- `MongoDB Connected`
- `Server is running on port 5000`

### 2. Test Database Connection
Open in browser: `http://localhost:5000/api/test-db`

Expected response:
```json
{
  "status": "Database connected",
  "messageCount": 0,
  "collection": "contacts"
}
```

### 3. Test Messages API
Open in browser: `http://localhost:5000/api/messages`

Expected response: `[]` (empty array if no messages) or array of messages

### 4. Check Browser Console
1. Open Messages page: `http://localhost:5000/messages.html`
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for:
   - "Messages page loaded, initializing..."
   - "Fetching messages from: http://localhost:5000/api/messages"
   - "Response status: 200 OK"
   - "Received messages: [...]"
   - "Loaded X messages successfully"

### 5. Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Refresh the Messages page
4. Look for request to `/api/messages`
5. Check:
   - Status should be 200
   - Response should contain array of messages
   - No CORS errors

### 6. Submit a Test Message
1. Go to Contact section on main page
2. Fill out the form
3. Submit
4. Check browser console for success message
5. Check server console for "Contact saved successfully"
6. Go to Messages page and refresh

### 7. Common Issues

**Issue: "Failed to fetch" error**
- Solution: Make sure backend server is running on port 5000

**Issue: CORS error**
- Solution: Backend CORS is configured, but check if server is running

**Issue: Empty array returned**
- Solution: No messages in database yet. Submit a test message first.

**Issue: MongoDB not connected**
- Solution: 
  - Make sure MongoDB is running
  - Check `.env` file has correct `MONGODB_URI`
  - Check server console for connection errors

**Issue: Messages page shows "No messages yet"**
- This is correct if database is empty
- Submit a message through contact form first

### 8. Manual Database Check
If you have MongoDB shell access:
```bash
mongo
use portfolio
db.contacts.find().pretty()
```

This will show all messages in the database.

## Quick Test Commands

Test if server is running:
```bash
curl http://localhost:5000/api/health
```

Test if messages endpoint works:
```bash
curl http://localhost:5000/api/messages
```

Test database connection:
```bash
curl http://localhost:5000/api/test-db
```

