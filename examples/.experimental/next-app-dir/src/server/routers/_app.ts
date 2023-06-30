import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';

let latestPost = {
  id: 0,
  title: 'latest post',
  content: 'hello world',
  createdAt: new Date(),
};

export const createPost = publicProcedure
  .input(
    z.object({
      title: z.string(),
      content: z.string(),
    }),
  )
  .mutation(async (opts) => {
    latestPost = {
      id: latestPost.id + 1,
      createdAt: new Date(),
      ...opts.input,
    };

    return latestPost;
  });

export const appRouter = router({
  foo: router({
    bar: publicProcedure.query(
      () => `bar - ${new Date().toISOString().split('T')[1]}`,
    ),
    baz: publicProcedure.query(
      () => `baz - ${new Date().toISOString().split('T')[1]}`,
    ),
  }),
  greeting: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async (opts) => {
      console.log('request from', opts.ctx.headers?.['x-trpc-source']);
      return `hello ${opts.input.text} - ${Math.random()}`;
    }),

  secret: publicProcedure.query(async (opts) => {
    if (!opts.ctx.session) {
      return 'You are not authenticated';
    }
    return "Cool, you're authenticated!";
  }),

  me: publicProcedure.query((opts) => {
    return opts.ctx.session;
  }),

  createPost,

  getLatestPost: publicProcedure.query(async () => {
    return latestPost;
  }),
});

export type AppRouter = typeof appRouter;
