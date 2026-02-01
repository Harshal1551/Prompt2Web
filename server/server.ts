import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import { stripeWebhook } from './controllers/stripeWebhook.js';
import { fileURLToPath } from 'url';
import path from 'path';

/* =========================
   INIT
========================= */

const app = express();
const port = 3000;

/* =========================
   __DIRNAME (ESM)
========================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   CORS CONFIG (FIXED)
========================= */

const allowedOrigins = [
  'https://prompt2-web.vercel.app',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('CORS not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/* ❌ DO NOT ADD app.options('*') */
/* ❌ DO NOT ADD app.options('/*') */

/* =========================
   STRIPE WEBHOOK
========================= */

app.post(
  '/api/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

/* =========================
   AUTH ROUTES
========================= */

// app.all('/api/auth/:path*', toNodeHandler(auth));
app.all(/^\/api\/auth\/.*$/, toNodeHandler(auth));


/* =========================
   BODY PARSER
========================= */

app.use(express.json({ limit: '50mb' }));

/* =========================
   ROUTES
========================= */

app.get('/', (req: Request, res: Response) => {
  res.send('Server is Live!');
});

app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);

/* =========================
   START SERVER
========================= */

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
