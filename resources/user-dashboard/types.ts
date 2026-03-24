import { z } from "zod";

export const propSchema = z.object({
  user: z.object({
    userId: z.string(),
    email: z.string(),
  }),
  todos: z.array(z.object({
    id: z.number(),
    title: z.string(),
    completed: z.boolean(),
    created_at: z.string(),
  })),
  isAuthenticated: z.boolean(),
});

export type UserDashboardProps = z.infer<typeof propSchema>;

export type Todo = UserDashboardProps["todos"][number];
