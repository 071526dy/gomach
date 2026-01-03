# Gomach Testing Guide (for Friends)

This guide outlines how to set up the app for external testing and what features your friends should focus on.

## 1. How to Share the App

Since the app is currently running on your local machine, you need to "deploy" it so others can access it via a URL.

### Recommended: Vercel Deployment (Easiest)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New"** > **"Project"**.
3. Import your `gomach` repository.
4. Click **"Deploy"**.
5. Vercel will give you a public URL (e.g., `gomach-app.vercel.app`) to share with your friends.

## 2. Testing Steps for Friends

### PC/Mac Users
1. Open the URL in a browser (Chrome/Safari/Edge).
2. Use the **Monitor/Smartphone icons** at the bottom right to switch views.
3. Test the "Mobile View" to see how it looks on a phone screen.

### Smartphone Users
1. Open the URL directly on your phone.
2. The app should automatically fit the screen.

## 3. Key Points to Test

Please ask your friends to check the following:

- **Welcome Screen**: Is the nickname and activity area easy to enter?
- **Matching**: Do the match profiles look good? Can they open the compatibility modal?
- **Calendar/Goals**: Are the screens easy to navigate back and forth?
- **User Profile**: Can they edit and save their profile info?
- **General Feel**: Does the app feel smooth? Are any icons or text cut off?

## 4. Known Issues / Limitations
- **Data Persistence**: Data is currently saved to the browser's "Local Storage". If they clear their cache or change browsers, their data will reset.
- **Simulated Chat**: The chat is currently a demo; messages are not yet sent to real users.

---
*Thank you for testing! Please share any screenshots of bugs.*
