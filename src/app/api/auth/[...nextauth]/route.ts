import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from 'next-auth/providers/google'
import { compare } from "bcryptjs"
import prisma from '@/lib/prisma'
// import { User } from "@prisma/client";
import type { User as NextAuthUser } from "next-auth";

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
    CredentialsProvider({
        name: "Email Login",
        credentials:{ //MAKE SURE TO CHECK THESE CREDENTIALS ARE CORRECTLY ALIGNED WITH FRONTEND
            email:{label: "Email", type: "email"},
            password: {label: "Password", type: "password"},
        },
        async authorize(credentials){
            //fast fail if input is invalid
            if(!credentials?.email || !credentials?.password){ return null;}

            //db search
            const user = await prisma.user.findUnique({
                where: {email:credentials.email},
            })
            if (!user || !user.password ) {return null}
            
            //password check
            const isValid = await compare(credentials.password, user.password)
            if(!isValid){ return null }

            return{
                id: user.id,
                email: user.email,
                name: user.name ?? undefined
            }

        },
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
    // ...add more providers here
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    
    pages: {
        signIn: '/login',
    },

    callbacks: {
        async redirect({ url, baseUrl }) {
            return baseUrl;
        },
        async signIn({user, account}){
            if(account?.provider === "google") {
                const existingUser = await prisma.user.findUnique({
                    where: {email: user.email! },
                });
                if(!existingUser){
                    await prisma.user.create({
                        data: {
                            email:user.email!,
                            name: user.name,
                        },
                    });
                }
            }
            return true;
        },

        //add DB user.id to JWT
        async jwt({ token, user }) {
            if (user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where:{ email: user.email},
                });
                if(dbUser) {
                    token.id = dbUser.id;
                }
            }
            return token;
        },

        //Makes token.id available to session (client + server)
        async session({ session, token }) {
            if (token?.id && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};