import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setAutoFreeze } from "immer";
import { useCartStore } from "../store/cart";
import CartItem from "./cart-item";

setAutoFreeze(false);

const product = {
	title: "Relógio",
	price: "22.00",
	image: "https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
};

const renderCartItem = () => {
	render(<CartItem product={product} />);
};

describe("<CartItem/>", () => {
	it("Should render CartItem", () => {
		renderCartItem();

		expect(screen.getByTestId("cart-item")).toBeInTheDocument();
	});

	it("Should display proper content", () => {
		renderCartItem();

		expect(
			screen.getByText(new RegExp(product.title, "i"))
		).toBeInTheDocument();
		expect(
			screen.getByText(new RegExp(product.price, "i"))
		).toBeInTheDocument();
		expect(screen.getByTestId("image")).toHaveAttribute(
			"src",
			`${product.image}`
		);
		expect(screen.getByTestId("image")).toHaveAttribute(
			"alt",
			`${product.title}`
		);
	});

	it("should call remove() when remove button is clicked", async () => {
		const result = renderHook(() => useCartStore()).result;
		const spy = jest.spyOn(result.current.actions, "remove");

		renderCartItem();

		const button = screen.getByRole("button", { name: /remove/i });
		await userEvent.click(button);

		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith(product);
	});

	it("should call increase() when increase button is clicked", async () => {
		const result = renderHook(() => useCartStore()).result;
		const spy = jest.spyOn(result.current.actions, "increase");

		renderCartItem();

		const button = screen.getByTestId("increase-button");
		await userEvent.click(button);

		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith(product);
	});

	it("should call decrease() when decrease button is clicked", async () => {
		const result = renderHook(() => useCartStore()).result;
		const spy = jest.spyOn(result.current.actions, "decrease");

		renderCartItem();

		const button = screen.getByTestId("decrease-button");
		await userEvent.click(button);

		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith(product);
	});
});
