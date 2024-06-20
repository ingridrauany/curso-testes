import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setAutoFreeze } from "immer";
import { makeServer } from "../miragejs/server";
import { useCartStore } from "../store/cart/index";
import Cart from "./cart";

setAutoFreeze(false);

describe("Cart", () => {
	let server;
	let result;
	let spy;
	let add;

	beforeEach(() => {
		server = makeServer({ environment: "test" });
		result = renderHook(() => useCartStore()).result;
		add = result.current.actions.add;
		spy = jest.spyOn(result.current.actions, "toggle");
	});

	afterEach(() => {
		server.shutdown();
		jest.clearAllMocks();
	});

	it('should add class "hidden" in the component ', () => {
		render(<Cart />);

		expect(screen.getByTestId("cart")).toHaveClass("hidden");
	});

	it('should remove class "hidden" in the component when the toggle is called', async () => {
		render(<Cart />);

		await act(async () => {
			await userEvent.click(screen.getByTestId("close-button"));
		});

		expect(screen.getByTestId("cart")).not.toHaveClass("hidden");
	});

	it("should call store toggle() twice", async () => {
		render(<Cart />);

		const button = screen.getByTestId("close-button");

		await act(async () => {
			await userEvent.click(button);
			await userEvent.click(button);
		});

		expect(spy).toHaveBeenCalledTimes(2);
	});

	it("should display 2 prodcuts cards", async () => {
		const products = server.createList("product", 2);

		await act(async () => {
			for (const product of products) {
				add(product);
			}
		});

		render(<Cart />);

		expect(screen.getAllByTestId("cart-item")).toHaveLength(2);
	});

	it("should remove all products when clear cart button is clicked", async () => {
		const products = server.createList("product", 2);

		for (const product of products) {
			act(() => add(product));
		}

		render(<Cart />);

		expect(screen.getAllByTestId("cart-item")).toHaveLength(2);

		const button = screen.getByRole("button", { name: /clear cart/i });

		await userEvent.click(button);

		expect(screen.queryAllByTestId("cart-item")).toBeNull();
	});

	it("should not display the clear cart button if there are no products in the cart", async () => {
		render(<Cart />);

		expect(screen.getByRole("button", { name: /clear cart/i })).toBeNull();
	});
});
