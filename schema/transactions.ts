import { z } from 'zod'

export const TransactionSchema = z.object({
	amount: z.number().int(),
	payee: z.string(),
	notes: z.string().optional(),
	date: z.date().default(() => new Date()),
	accountId: z.string(),
	categoryId: z.string().optional(),
})
