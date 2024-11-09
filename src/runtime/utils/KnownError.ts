import { type ALL_ERRORS, type ErrorInfo } from "../types/index.js"

/**
 * Creates a known error that extends the base Error with some extra information.
 * All the variables used to create the error message are stored in it's info property so we can easily re-craft error messages for users.
 */
export class KnownError<
	T extends ALL_ERRORS = ALL_ERRORS,
	TInfo extends ErrorInfo<T> = ErrorInfo<T>,
> extends Error {
	code: T

	info: TInfo

	constructor(
		code: T,
		str: string,
		info: TInfo,
	) {
		super(str)
		this.code = code
		this.info = info
	}
}
