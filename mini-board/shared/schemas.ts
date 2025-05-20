import { z } from 'zod';

export const boardSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string().optional(),
});

export const groupSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  order: z.number().int(),
  boardId: z.string().uuid(),
});

export const itemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullish(),
  statusLabel: z.string(),
  statusColor: z.string(),
  assignee: z.string().nullish(),
  notes: z.string().nullish(),
  position: z.number().int(),
  groupId: z.string().uuid(),
  boardId: z.string().uuid(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  statusChangedAt: z.string().nullish(),
});

export type Board = z.infer<typeof boardSchema>;
export type Group = z.infer<typeof groupSchema>;
export type Item = z.infer<typeof itemSchema>;
