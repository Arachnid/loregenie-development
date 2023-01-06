# Getting Started

## Firebase

- Create Firebase project
- Generate your Firebase Admin SDK Private Key
- Save your ```private-key.json``` into ```/node_modules```

## Firebase Local Emulator

- run: ```npm install -g firebase-tools```
- run: ```firebase init```
- select Emulators
- select Authentication Emulator and Firestore Emulator
- copy auth and firestore ports into the env. By default, the values are:
  - ```FIRESTORE_EMULATOR_HOST='localhost:8080'```
  - ```FIREBASE_AUTH_EMULATOR_HOST='localhost:9099'```
- run: ```firebase emulators:start``` OR run firebase emulator with persistent data:
  - create ```exported-firebase-data``` folder in root directory
  - run: ```npm run emulator```

## Discord and Twitch SSO

- Create Discord project
- Save redirect URI as ```http://localhost:3000/api/auth/callback/discord```
- Copy ```CLIENT ID``` and ```CLIENT SECRET``` into env
- repeat steps above for Twitch

## Environment Variables

- create a ```.env.local``` file
- env file template example:
```
GOOGLE_SERVICE_ACCOUNT='./node_modules/private-key.json'
DISCORD_CLIENT_ID='discord-client-id'
DISCORD_CLIENT_SECRET='dicord-client-secret'
TWITCH_CLIENT_ID='twitch-client-id'
TWITCH_CLIENT_SECRET='twitch-client-secret'
FIRESTORE_EMULATOR_HOST='localhost:8080'
FIREBASE_AUTH_EMULATOR_HOST='localhost:9099'
```

## Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

