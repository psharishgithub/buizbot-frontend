import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { connectToDatabase } from "./lib/mongodb";
import User from "@/app/models/User"


 
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks:  {async session({ session, token }) {
    if (session.user) {
      // Add the user ID from the token to the session object
      session.user.id = token.sub as string;
    }
    return session;
  },
  async jwt({ token, account, profile }) {
    if (account && profile) {
      // Add the user ID to the token if the user is available
      token.id = profile.sub;
    }
    return token;
  },

  async signIn({ user, account }) {
    try {
      await connectToDatabase();
      console.log("User object:", user);
      console.log("Account object:", account);
  
      // First, try to find the user by googleId
      let existingUser = await User.findOne({email: user.email });
  
      // If not found by googleId, try to find by email
      
  
      if (existingUser) {
        console.log("Existing user found:", existingUser);
       
      } else {
        // Create a new user if not found
        const newUser = new User({
          email: user.email,
          name: user.name,
          image: user.image,
          googleId: user.id,
        });
        console.log("New user to be created:", newUser);
        await newUser.save();
        console.log("New user saved successfully");
      }
  
      return true;
    } catch (error: unknown) {
      console.error('Error in signIn callback:', error);
      
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      
      if (typeof error === 'object' && error !== null) {
        if ('code' in error && 'keyValue' in error) {
          const mongoError = error ;
          if (mongoError.code === 11000) {
            console.error('Duplicate key error. Attempted to insert:', mongoError.keyValue);
          }
        }
      }
      
      return false;
    }
  }


}
})