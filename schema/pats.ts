import { z } from "zod";

export const PatSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required"
  }).min(3, {
    message: "Name must be at least 3 characters long"
  }).max(40, {
    message: "Name must be less than 40 characters long"
  })
})