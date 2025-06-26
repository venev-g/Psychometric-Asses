# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/db0d0fed-41e0-4d08-b16f-698667b9671b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/db0d0fed-41e0-4d08-b16f-698667b9671b) and start prompting.

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

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/db0d0fed-41e0-4d08-b16f-698667b9671b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Psychometric Assessment Platform

A comprehensive platform for conducting psychometric assessments with AI-powered mentoring capabilities.

## Features

- **Assessment Types**: Personality, Intelligence, and VARK Learning Style assessments
- **AI Mentor Integration**: Powered by Langflow for personalized learning guidance
- **Real-time Analytics**: Comprehensive dashboard with detailed insights
- **Responsive Design**: Modern UI that works across all devices
- **Admin Panel**: Complete management interface for assessments and users

## AI Mentor Integration

The platform includes an AI-powered mentor system that provides personalized learning guidance. The mentor is powered by Langflow and can:

- Create customized learning modules based on user preferences
- Provide real-time chat support during learning sessions
- Adapt content based on learning style and cognitive profile
- Generate visual concept maps and problem-solving strategies

### Setup for AI Mentor

1. **Install Langflow**: Follow the [Langflow installation guide](https://docs.langflow.org/)
2. **Configure API**: Set up your Langflow flow and note the API endpoint
3. **Environment Variables**: Create a `.env.local` file with:
   ```bash
   NEXT_PUBLIC_LANGFLOW_API_URL=http://127.0.0.1:7860/api/v1/run/YOUR_FLOW_ID
   ```

### Using the AI Mentor

1. Navigate to the dashboard
2. Click on "Request Mentor" 
3. Fill out the learning request form with:
   - Target topic
   - Learning objectives
   - Prerequisites
   - Curriculum standards
4. Submit to start a conversation with the AI mentor
5. Continue the conversation to get personalized guidance

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Langflow instance (for AI mentor)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Psychometric-Asses
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Set up the database:
   ```bash
   npm run db:setup
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Integration

The platform uses several APIs:

- **Supabase**: Database and authentication
- **Langflow**: AI mentor functionality
- **Custom Assessment APIs**: For test administration and scoring

### Langflow API Configuration

The AI mentor uses Langflow's API with the following configuration:

```typescript
const payload = {
  input_value: "User message",
  output_type: "chat",
  input_type: "chat"
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
