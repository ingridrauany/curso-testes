import { fireEvent, render, screen } from "@testing-library/react";
import ProductCard from "./product-card";

const product = {
	title: "Relógio",
	price: "22.00",
	image: "https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
};

const addToCard = jest.fn();

const renderProductCart = () => {
	render(<ProductCard product={product} addToCart={addToCard} />);
};

describe("<ProductCard/>", () => {
	it("Should render ProductCard", () => {
		renderProductCart();

		expect(screen.getByTestId("product-card")).toBeInTheDocument();
	});

	it("Should display proper content", () => {
		renderProductCart();

		expect(
			screen.getByText(new RegExp(product.title, "i"))
		).toBeInTheDocument();
		expect(
			screen.getByText(new RegExp(product.price, "i"))
		).toBeInTheDocument();
		expect(
			getComputedStyle(screen.getByTestId("image")).getPropertyValue(
				"background-image"
			)
		).toEqual(`url(${product.image})`);
	});

	it("should call props.addToCart() when button gets clicked", async () => {
		renderProductCart();

		const button = screen.getByRole("button");

		await fireEvent.click(button);

		expect(addToCard).toHaveBeenCalledTimes(1);
		expect(addToCard).toHaveBeenCalledWith(product);
	});
});
