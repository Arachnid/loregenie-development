import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { FirestoreAdapter } from '@lowfront/firebase-adapter';
import { db } from '../../../lib/db';

export const authOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
        }),
    ],
    adapter: FirestoreAdapter(db),
};

export default NextAuth(authOptions);
