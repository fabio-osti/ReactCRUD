export class AuthHandler {
	private _name: string | null
	private _token: string | null
	private onSet: ((user: AuthAgent) => void)[]

	get username() {
		return this._name ?? undefined
	}

	get token() {
		return this._token ?? undefined
	}

	constructor(...callbacks: ((user: AuthAgent) => void)[]) {
		this.onSet = callbacks
		this._name = localStorage.getItem("username")
		this._token = localStorage.getItem("token")
		this.onSet.forEach((s) => s({username: this.username, token: this.token}))
	}

	readonly addCallback = (c: (user: AuthAgent) => void) => this.onSet.push(c)

	readonly setUser = (username?: string, token?: string) => {
		if (username === undefined || token === undefined) {
			this._name = this._token = null
			localStorage.removeItem("username")
			localStorage.removeItem("token")
		} else {
			this._name = username
			localStorage.setItem("username", username)
			this._token = token
			localStorage.setItem("token", token)

		}
		this.onSet.forEach((s) => s({username: this.username, token: this.token}))
	}
}

interface AuthAgent {
	username?: string
	token?: string
}