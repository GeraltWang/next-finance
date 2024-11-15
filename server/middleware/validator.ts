import type { Env, ValidationTargets } from 'hono'
import { Hook, zValidator } from '@hono/zod-validator'
import { z, ZodSchema } from 'zod'

/**
 * Custom zValidator with default error handling
 */
export function myValidator<
	T extends ZodSchema,
	Target extends keyof ValidationTargets,
	E extends Env,
	P extends string,
>(target: Target, schema: T, hook?: Hook<z.infer<T>, E, P, Target>) {
	const defaultHook: Hook<z.infer<T>, E, P, Target> = async (result, c) => {
		if (!result.success) {
			const zodErrorPayload = JSON.parse(result.error.message)

			let errorMsg

			if (!zodErrorPayload || !Array.isArray(zodErrorPayload) || !zodErrorPayload.length) {
				errorMsg = 'Validation failed'
			} else {
				errorMsg = `Expected ${zodErrorPayload[0].expected} but received ${zodErrorPayload[0].received} on field ${zodErrorPayload[0].path[0]}`
			}

			return c.json({ error: 'Validation error', message: errorMsg }, 400)
		}
	}

	return zValidator(target, schema, hook ?? defaultHook)
}
