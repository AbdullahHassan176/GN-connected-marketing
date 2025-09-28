import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
// import MicrosoftProvider from 'next-auth/providers/microsoft';

// Demo users for development
const demoUsers = [
  {
    id: 'user_admin',
    email: 'admin@globalnextconsulting.com',
    password: 'admin123',
    name: 'Sarah Mitchell',
    avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
    orgId: 'org_123',
    roles: [{ scope: 'org' as const, scopeId: 'org_123', role: 'owner' as const }],
    status: 'active' as const,
  },
  {
    id: 'user_manager',
    email: 'manager@globalnextconsulting.com',
    password: 'manager123',
    name: 'Marcus Chen',
    avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
    orgId: 'org_123',
    roles: [{ scope: 'org' as const, scopeId: 'org_123', role: 'manager' as const }],
    status: 'active' as const,
  },
  {
    id: 'user_client',
    email: 'ahmed@premiumhotels.com',
    password: 'client123',
    name: 'Ahmed Al-Rashid',
    avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
    orgId: 'org_123',
    roles: [{ scope: 'org' as const, scopeId: 'org_123', role: 'client' as const }],
    status: 'active' as const,
  },
];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user in demo users
        const user = demoUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
          orgId: user.orgId,
          roles: user.roles,
          status: user.status,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.OAUTH_GOOGLE_ID || '',
      clientSecret: process.env.OAUTH_GOOGLE_SECRET || '',
    }),
    // MicrosoftProvider({
    //   clientId: process.env.OAUTH_MICROSOFT_ID || '',
    //   clientSecret: process.env.OAUTH_MICROSOFT_SECRET || '',
    //   tenantId: 'common',
    // }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.orgId = user.orgId;
        token.roles = user.roles;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.orgId = token.orgId as string;
        session.user.roles = token.roles as any[];
        session.user.status = token.status as 'active' | 'inactive' | 'suspended';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
});

export { handler as GET, handler as POST };
