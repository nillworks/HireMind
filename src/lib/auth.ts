import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { jwt } from 'better-auth/plugins';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db('TalentAI');

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    jwt({
      jwks: {
        keyPairConfig: {
          alg: 'EdDSA',
          crv: 'Ed25519',
        },
      },
      jwt: {
        definePayload: (session) => {
          return {
            sub: session.user.id,
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
            plan: session.user.plan,
          };
        },
      },
    }),
  ],

  hooks: {
    before: async (request) => {
      return { request };
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "seeker",
        input: true,
      },
      plan: {
        type: "string",
        required: false,
        defaultValue: "free_seeker",
        input: true,
      },
    },
  },
});
