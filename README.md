# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/cad105a3-5899-4613-be8a-55e83d17fc04

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cad105a3-5899-4613-be8a-55e83d17fc04) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cad105a3-5899-4613-be8a-55e83d17fc04) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## n8n Integration

This application integrates with n8n to process IT support tickets. When a ticket is submitted, it is sent to an n8n webhook, which processes the ticket and performs various actions, such as:

- Recording the ticket in Google Sheets
- Sending email notifications
- Prioritizing tickets based on severity
- Providing AI-enhanced analysis and solutions

### Setup Requirements

1. Make sure you have n8n installed and running
2. Import the `n8n.json` workflow into your n8n instance
3. Set up the Google Sheets and SMTP credentials in n8n
4. Ensure the webhook endpoint is correctly configured

### Webhook Configuration

By default, the application attempts to connect to an n8n webhook at:
- `http://localhost:5678/webhook/medical-it-support` (for local development)
- `https://yourdomain.com/webhook/medical-it-support` (for production)

You can configure a custom webhook URL through the Admin panel in the application.

### Troubleshooting Webhook Issues

If you encounter the "Failed to fetch" error or other webhook connection issues:

1. **Check that n8n is running**
   - Verify your n8n instance is running and accessible
   - The default URL is `http://localhost:5678`

2. **Verify webhook path**
   - Ensure the webhook node in n8n has the correct path: `/medical-it-support`
   - Authentication should be set to "None" (unless you've configured otherwise)

3. **CORS Issues**
   - If you get CORS errors, you need to configure n8n to allow requests from your application's domain
   - Add your domain to the allowed origins in n8n settings

4. **Network/Firewall Issues**
   - Check if there are any network restrictions preventing the connection
   - If using localhost, ensure both the app and n8n are running on the same machine

5. **Check Console for Errors**
   - Open your browser's developer tools (F12) and check the Console tab for detailed error messages

6. **Test the Connection**
   - Use the "Test n8n Webhook Connection" button in the Admin panel
   - This will send a test ticket to verify connectivity

7. **Configure Custom URL**
   - If your n8n instance is running on a different URL, use the Configuration tab in the Admin panel to set a custom webhook URL

### Google Sheets Columns

The n8n workflow is configured to work with the following columns in Google Sheets:

1. Ticket ID
2. Clinic
3. Department
4. Location
5. Phone
6. Priority
7. Category
8. Description
9. AI Analysis
10. Suggested Solution
11. Response Time
12. Alert Level
13. Timestamp
14. Status

Make sure your Google Sheets document has these columns in this exact order.
