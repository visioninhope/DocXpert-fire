import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { generateSubheadings, generateArticle } from '@/lib/fireworks';

export const articleRouter = createTRPCRouter({
  generateSubheadings: protectedProcedure
    .input(z.object({ topic: z.string() }))
    .mutation(async ({ input }) => {
      const subheadings = await generateSubheadings(input.topic);
      return subheadings;
    }),

  generateArticle: protectedProcedure
    .input(z.object({
      topic: z.string(),
      subheadings: z.array(z.string())
    }))
    .mutation(async ({ input, ctx }) => {
      const article = await generateArticle(input.topic, input.subheadings);

      // Save the generated article to the database
      await ctx.prisma.article.create({
        data: {
          topic: input.topic,
          content: article,
          userId: ctx.session.user.id,
        },
      });

      return article;
    }),
});
