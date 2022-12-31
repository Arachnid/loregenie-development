# Getting Started

## Firebase

- Create Firebase project
- Generate your Firebase Admin SDK Private Key
- Save your ```private-key.json``` into ```/node_modules```

## Discord and Twitch SSO

- Create Discord project
- Save redirect URI as ```http://localhost:3000/api/auth/callback/discord```
- Copy ```CLIENT ID``` and ```CLIENT SECRET``` into env
- repeat steps above for Twitch

## Environment Variables

- create a ```.env.local``` file
- env file template:
```
GOOGLE_SERVICE_ACCOUNT='./node_modules/private-key.json'
DISCORD_CLIENT_ID='discord-client-id'
DISCORD_CLIENT_SECRET='dicord-client-secret'
TWITCH_CLIENT_ID='twitch-client-id'
TWITCH_CLIENT_SECRET='twitch-client-secret'
```

## Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

