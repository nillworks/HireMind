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

  plugins: [
    jwt({
      jwks: {
        keyPairConfig: {
          alg: 'EdDSA',
          crv: 'Ed25519',
        },
      },
    }),
  ],
});
