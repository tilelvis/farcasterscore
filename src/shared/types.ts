import z from "zod";

/**
 * Types shared between the client and server go here.
 */

export const NeynarUserDataSchema = z.object({
  fid: z.number(),
  username: z.string().optional(),
  displayName: z.string().optional(),
  pfpUrl: z.string().optional(),
  followerCount: z.number(),
  followingCount: z.number(),
  score: z.number().optional(),
});

export type NeynarUserData = z.infer<typeof NeynarUserDataSchema>;

export const UserStatsResponseSchema = z.object({
  success: z.boolean(),
  data: NeynarUserDataSchema.optional(),
  error: z.string().optional(),
});

export type UserStatsResponse = z.infer<typeof UserStatsResponseSchema>;
