import { PLANS } from "@/lib/constants";
import { vectoriseDocument } from "@/lib/vectorise";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { CollaboratorRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { deleteFileFromUploadThing } from "@/utils/uploadthing";

export const documentRouter = createTRPCRouter({
  getDocData: protectedProcedure
    .input(
      z.object({
        docId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const res = await ctx.prisma.document.findUnique({
        where: {
          id: input.docId,
          OR: [
            { ownerId: ctx.session.user.id },
            {
              collaborators: {
                some: {
                  userId: ctx.session.user.id,
                },
              },
            },
          ],
        },

        include: {
          highlights: {
            include: {
              boundingRectangle: true,
              rectangles: true,
            },
          },
          owner: true,
          collaborators: {
            include: {
              user: true,
            },
          },
          messages: true,
        },
      });

      if (!res) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Document not found or you do not have access to it.",
        });
      }

      const highlightData = res.highlights.map((highlight) => ({
        id: highlight.id,
        position: {
          boundingRect: {
            id: highlight.boundingRectangle?.id,
            x1: highlight.boundingRectangle?.x1,
            y1: highlight.boundingRectangle?.y1,
            x2: highlight.boundingRectangle?.x2,
            y2: highlight.boundingRectangle?.y2,
            width: highlight.boundingRectangle?.width,
            height: highlight.boundingRectangle?.height,
            pageNumber: highlight.boundingRectangle?.pageNumber,
          },
          rects: highlight.rectangles.map((rect) => ({
            id: rect.id,
            x1: rect.x1,
            y1: rect.y1,
            x2: rect.x2,
            y2: rect.y2,
            width: rect.width,
            height: rect.height,
            pageNumber: rect.pageNumber,
          })),
          pageNumber: highlight.pageNumber,
        },
      }));

      const collaborator = res.collaborators.find(
        (c) => c.userId === ctx.session.user.id,
      );

      const isOwner = res.owner.id === ctx.session.user.id;
      const canEdit = isOwner || collaborator?.role === CollaboratorRole.EDITOR;
      const username = isOwner ? res.owner.name : collaborator?.user.name || "";

      return {
        id: res.id,
        title: res.title,
        highlights: highlightData!,
        owner: res.owner,
        collaborators: res.collaborators,
        messages: res.messages,
        url: res.url,
        isVectorised: res.isVectorised,
        userPermissions: {
          canEdit,
          username,
          isOwner: res.owner.id === ctx.session.user.id,
        },
      };
    }),

  addCollaborator: protectedProcedure
    .input(
      z.object({
        documentId: z.string(),
        data: z.object({
          email: z.string(),
          role: z.nativeEnum(CollaboratorRole),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const doc = await ctx.prisma.document.findUnique({
          where: {
            id: input.documentId,
            ownerId: ctx.session.user.id,
          },
        });

        if (!doc) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Document not found or you do not have access to it.",
          });
        }

        const user = await ctx.prisma.user.findUnique({
          where: {
            email: input.data.email,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found.",
          });
        }

        await ctx.prisma.collaborator.create({
          data: {
            role: input.data.role,
            documentId: input.documentId,
            userId: user.id,
          },
        });

        return true;
      } catch (err: any) {
        console.log(err.message);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err.message,
        });
      }
    }),

  removeCollaboratorById: protectedProcedure
    .input(
      z.object({
        documentId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const doc = await ctx.prisma.document.findUnique({
          where: {
            id: input.documentId,
            ownerId: ctx.session.user.id,
          },
        });

        if (!doc) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Document not found or you do not have access to it.",
          });
        }

        await ctx.prisma.collaborator.delete({
          where: {
            documentId_userId: {
              documentId: input.documentId,
              userId: input.userId,
            },
          },
        });

        return true;
      } catch (err: any) {
        console.log(err.message);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err.message,
        });
      }
    }),

  getCollaborators: protectedProcedure
    .input(
      z.object({
        documentId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const doc = await ctx.prisma.document.findUnique({
        where: {
          id: input.documentId,
          ownerId: ctx.session.user.id,
        },
        select: {
          collaborators: {
            select: {
              role: true,
              user: {
                select: {
                  email: true,
                  id: true,
                },
              },
            },
          },
          owner: {
            select: {
              email: true,
              id: true,
            },
          },
        },
      });

      if (!doc) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Document not found or you are not the owner.",
        });
      }
      return [
        {
          email: doc.owner.email ?? "Invalid Email",
          role: CollaboratorRole.OWNER,
          id: doc.owner.id,
        },
        ...doc.collaborators.map((cur) => ({
          email: cur.user.email ?? "Invalid Email",
          role: cur.role,
          id: cur.user.id,
        })),
      ];
    }),

  vectorise: protectedProcedure
    .input(
      z.object({
        documentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const doc = await ctx.prisma.document.findUnique({
        where: {
          id: input.documentId,
          ownerId: ctx.session.user.id,
        },
        select: {
          owner: {
            select: {
              plan: true,
            },
          },
          isVectorised: true,
          url: true,
          id: true,
        },
      });

      if (!doc) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Document not found or you are not the owner.",
        });
      }

      if (doc.isVectorised) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Document already vectorised.",
        });
      }

      const docOwnerPlan = doc.owner.plan;
      const maxPagesAllowed = PLANS[docOwnerPlan].maxPagesPerDoc;

      try {
        await vectoriseDocument(doc.url, doc.id, maxPagesAllowed);
      } catch (err: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err.message,
        });
      }

      return true;
    }),
  addDocumentByLink: protectedProcedure
    .input(
      z.object({
        url: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: ctx.session.user.id,
          },
          select: {
            plan: true,
            _count: {
              select: {
                documents: true,
              },
            },
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not found.",
          });
        }

        const docCount = user._count.documents;
        const docOwnerPlan = user.plan;
        const maxPagesAllowed = PLANS[docOwnerPlan].maxPagesPerDoc;

        if (docCount >= PLANS[user.plan].maxDocs) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "You have reached the maximum number of documents allowed. Please upgrade your plan to add more documents.",
          });
        }

        const newFile = await ctx.prisma.document.create({
          data: {
            title: input.title,
            url: input.url,
            isUploaded: false,
            owner: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });

        try {
          await vectoriseDocument(input.url, newFile.id, maxPagesAllowed);
          return newFile;
        } catch (err: any) {
          console.log(err.message);
        }
      } catch (err: any) {
        console.log(err.message);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err.message,
        });
      }
    }),
    deleteDocument: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findUnique({
        where: { id: input.documentId, ownerId: ctx.session.user.id },
        select: { url: true, isUploaded: true },
      });

      if (!document) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found or you're not the owner.",
        });
      }

      // Delete file from UploadThing if it was uploaded there
      if (document.isUploaded) {
        try {
          await deleteFileFromUploadThing(document.url);
        } catch (error) {
          console.error("Error deleting file from UploadThing:", error);
          // Continue with database deletion even if UploadThing deletion fails
        }
      }

      // Delete related records and the document itself
      await ctx.prisma.$transaction([
        ctx.prisma.collaborator.deleteMany({ where: { documentId: input.documentId } }),
        ctx.prisma.highlight.deleteMany({ where: { documentId: input.documentId } }),
        ctx.prisma.message.deleteMany({ where: { documentId: input.documentId } }),
        ctx.prisma.flashcard.deleteMany({ where: { documentId: input.documentId } }),
        ctx.prisma.document.delete({ where: { id: input.documentId } }),
      ]);

      return true;
    }),
  

});
