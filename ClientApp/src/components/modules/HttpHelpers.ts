export function buildResponseErrorTreatment(
	condition = (r: Response) => r.ok,
	errorBuilder = (r: Response) => new Error(r.statusText),
	fromResponseGetter = (r: Response): Promise<any> | void => r.json()
) {
	return (r: Response) => {
		if (condition(r)) return fromResponseGetter(r);
		else throw errorBuilder(r);
	};
}

export function buildAspHttpInit(method = "POST", body?: string, token?: string) {
	return {
		method: method,
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...(token === undefined ? {} : { Authorization: `Bearer ${token}` }),
		},
		...(body === undefined ? {} : { body: body }),
	};
}

export interface ApiResponse<TResponse> {
	count: number,
	response: TResponse[]
}