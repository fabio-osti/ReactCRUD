export interface IPerson {
	id?: number;
	name?: string;
	age?: number;
	sex?: boolean;
	hairColor?: hairColor;
}

export enum hairColor {
	black,
	darkBrown,
	brown,
	auburn,
	ginger,
	darkBlond,
	blond,
	lightBlond,
}

export class FormPerson {
	id?: number;
	name: string;
	age: string | number;
	sex: string;
	hairColor: string;

	constructor(person?: IPerson) {
		this.id = person?.id
		this.name = person?.name ?? "";
		this.age = person?.age ?? "";
		this.sex = person?.sex === undefined ? "" : person?.sex ? "m" : "f";
		this.hairColor = person?.hairColor?.toString() ?? "";
	}

	toPerson(): IPerson {
		return {
			id: this.id,
			name: this.name === "" ? undefined : this.name,
			age: this.age === "" ? undefined : Number(this.age),
			sex: this.sex === "" ? undefined : this.sex === "m",
			hairColor: this.hairColor === "" ? undefined : Number(this.hairColor),
		};
	}
}
