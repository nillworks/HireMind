import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { jwt } from 'better-auth/plugins';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

let _auth: any = null;

function getAuthInstance(): any {
  if (!_auth) {
    const client = new MongoClient(
      process.env.MONGODB_URI || 'mongodb://localhost:27017',
    );
    const db = client.db('TalentAI');
    _auth = betterAuth({
      database: mongodbAdapter(db, { client }),
      emailAndPassword: { enabled: true },
      plugins: [
        jwt({
          jwks: {
            keyPairConfig: { alg: 'EdDSA', crv: 'Ed25519' },
          },
          jwt: {
            definePayload: session => ({
              sub: session.user.id,
              id: session.user.id,
              email: session.user.email,
              name: session.user.name,
              role: session.user.role,
              plan: session.user.plan,
            }),
          },
        }),
      ],
      hooks: {
        before: async request => ({ request }),
      },
      user: {
        additionalFields: {
          role: {
            type: 'string',
            required: false,
            defaultValue: 'seeker',
            input: true,
          },
          plan: {
            type: 'string',
            required: false,
            defaultValue: 'free_seeker',
            input: true,
          },
        },
      },
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      },
    });
  }
  return _auth;
}

export { getAuthInstance as auth };
