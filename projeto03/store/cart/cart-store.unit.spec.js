import { act, renderHook } from "@testing-library/react";
import { setAutoFreeze } from "immer";
import { makeServer } from "../../miragejs/server";
import { useCartStore } from "./index";

setAutoFreeze(false);

describe("useCartStore", () => {
	let server;
	let result;
	let spy;
	let add;
	let toggle;
	let reset;
	let remove;
	let removeAll;

	beforeEach(() => {
		server = makeServer({ environment: "test" });
		result = renderHook(() => useCartStore()).result;
		add = result.current.actions.add;
		reset = result.current.actions.reset;
		toggle = result.current.actions.toggle;
		remove = result.current.actions.remove;
		removeAll = result.current.actions.removeAll;
		spy = jest.spyOn(result.current.actions, "toggle");
	});

	afterEach(() => {
		server.shutdown();
		act(() => result.current.actions.reset());
		jest.clearAllMocks();
	});

	it("should return open equals false on initial state", async () => {
		expect(result.current.state.open).toBe(false);
	});

	it("should return an empty array for products on initial state", async () => {
		expect(result.current.state.products).toHaveLength(0);
	});

	it("should add 2 products to the list and open the cart", async () => {
		const products = server.createList("product", 2);
		const {
			actions: { add },
		} = result.current;

		for (const product of products) {
			act(() => add(product));
		}

		expect(result.current.state.products).toHaveLength(2);
		expect(result.current.state.open).toBe(true);
	});

	it("should toggle open state", async () => {
		const {
			actions: { toggle },
		} = result.current;

		expect(result.current.state.open).toBe(false);

		act(() => toggle());

		expect(result.current.state.open).toBe(true);
	});

	it("should not add same product twice", () => {
		const product = server.create("product");
		const {
			actions: { add },
		} = result.current;

		act(() => add(product));
		act(() => add(product));

		expect(result.current.state.products).toHaveLength(1);
	});

	it("should remove a product from the store", () => {
		const [product1, product2] = server.createList("product", 2);

		act(() => {
			add(product1);
			add(product2);
		});

		expect(result.current.state.products).toHaveLength(2);

		act(() => {
			remove(product1);
		});

		expect(result.current.state.products).toHaveLength(1);
		expect(result.current.state.products[0]).toEqual(product2);
	});

	it("should clear the cart", () => {
		const [product1, product2] = server.createList("product", 2);

		act(() => {
			add(product1);
			add(product2);
		});

		expect(result.current.state.products).toHaveLength(2);

		act(() => {
			removeAll();
		});

		expect(result.current.state.products).toHaveLength(0);
	});

	it("should remove a product from the store only if it exists on cart", () => {
		const [product1, product2, product3] = server.createList("product", 3);

		act(() => {
			add(product1);
			add(product2);
		});

		expect(result.current.state.products).toHaveLength(2);

		act(() => {
			remove(product3);
		});

		expect(result.current.state.products).toHaveLength(2);
	});

	it("should assign 1 as initial quantity on product add()", async () => {
		const product = server.create("product");
		const {
			actions: { add },
		} = result.current;

		act(() => add(product));

		expect(result.current.state.products[0].quantity).toBe(1);
	});

	it("should increase quantity", async () => {
		const product = server.create("product");
		const {
			actions: { add, increase },
		} = result.current;

		act(() => {
			add(product);
			increase(product);
		});

		expect(result.current.state.products[0].quantity).toBe(2);
	});

	it("should decrease quantity", async () => {
		const product = server.create("product");
		const {
			actions: { add, increase, decrease },
		} = result.current;

		act(() => {
			add(product);
			increase(product);
			decrease(product);
		});

		expect(result.current.state.products[0].quantity).toBe(1);
	});

	it("should NOT decrease bellow zero", async () => {
		const product = server.create("product");
		const {
			actions: { add, decrease },
		} = result.current;

		act(() => {
			add(product);
			decrease(product);
			decrease(product);
		});

		expect(result.current.state.products[0].quantity).toBe(0);
	});
});
