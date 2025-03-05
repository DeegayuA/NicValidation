import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  // adapter: PrismaAdapter(prisma),
  // secret: process.env.SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      return "/dashboard";
    },
  },
  //You can add more customization and options here.
});
// const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);


export { handler as GET, handler as POST };
