import { parse, queryString } from "./queryString";

describe("Object to query string", () => {
	it("shoud create a valid query strinbg when a object is given", () => {
		const obj = {
			name: "Ingrid",
			profession: "dev",
		};

		expect(queryString(obj)).toBe("name=Ingrid&profession=dev");
	});

	it("shoud create a valid query strinbg when an array is given", () => {
		const obj = {
			name: "Ingrid",
			technologies: ["JS", "TDD"],
		};

		expect(queryString(obj)).toBe("name=Ingrid&technologies=JS,TDD");
	});

	it("shoud throw an error when a object is padded as value", () => {
		const obj = {
			name: "Ingrid",
			technologies: {
				first: "JS",
				second: "TDD",
			},
		};

		expect(() => {
			queryString(obj);
		}).toThrowError();
	});
});

describe("Query string to object", () => {
	it("shoud convert a query string to object", () => {
		const qs = "name=Ingrid&profession=dev";

		expect(parse(qs)).toEqual({
			name: "Ingrid",
			profession: "dev",
		});
	});

	it("shoud convert a query string to an object taking care of comma separeted values", () => {
		const qs = "name=Ingrid&abilities=dev,agile";

		expect(parse(qs)).toEqual({
			name: "Ingrid",
			abilities: ["dev", "agile"],
		});
	});
});
