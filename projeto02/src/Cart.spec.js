import Cart from "./Cart";

describe("Cart", () => {
	let cart;
	let product = {
		title: "Tenis",
		price: 35388,
	};
	let product1 = {
		title: "Blua",
		price: 41872,
	};

	beforeEach(() => {
		cart = new Cart();
	});

	describe("getTotal()", () => {
		it("should return 0 when getTotal() is executed in a newly created instance", () => {
			expect(cart.getTotal().getAmount()).toEqual(0);
		});

		it("should mutiply quantity and price and receive the total amount", () => {
			cart.add({
				product,
				quantity: 2,
			});

			expect(cart.getTotal().getAmount()).toEqual(70776);
		});

		it("should ensure no more than on product exists at a time", () => {
			cart.add({
				product,
				quantity: 2,
			});

			cart.add({
				product,
				quantity: 1,
			});

			expect(cart.getTotal().getAmount()).toEqual(35388);
		});

		it("should update total when a product gets included and the remove", () => {
			cart.add({
				product,
				quantity: 2,
			});

			cart.add({
				product: product1,
				quantity: 1,
			});

			cart.remove(product);

			expect(cart.getTotal().getAmount()).toEqual(41872);
		});
	});

	describe("checkout()", () => {
		it("should return an object with the total and the list of items", () => {
			cart.add({
				product: product,
				quantity: 2,
			});

			cart.add({
				product: product1,
				quantity: 3,
			});

			expect(cart.checkout()).toMatchInlineSnapshot(`
{
  "items": [
    {
      "product": {
        "price": 35388,
        "title": "Tenis",
      },
      "quantity": 2,
    },
    {
      "product": {
        "price": 41872,
        "title": "Blua",
      },
      "quantity": 3,
    },
  ],
  "total": 196392,
}
`);
		});

		it("should reset the cart when checkout() is called", () => {
			cart.add({
				product: product,
				quantity: 2,
			});

			cart.checkout();

			expect(cart.getTotal().getAmount()).toEqual(0);
		});
	});

	describe("summary()", () => {
		it("should return an object with the total and the list of items when summary is called", () => {
			cart.add({
				product: product,
				quantity: 2,
			});

			cart.add({
				product: product1,
				quantity: 3,
			});

			expect(cart.summary()).toMatchInlineSnapshot(`
{
  "formatted": "R$1,963.92",
  "items": [
    {
      "product": {
        "price": 35388,
        "title": "Tenis",
      },
      "quantity": 2,
    },
    {
      "product": {
        "price": 41872,
        "title": "Blua",
      },
      "quantity": 3,
    },
  ],
  "total": 196392,
}
`);
		});
	});

	describe("special conditions", () => {
		it("should apply percentage discount when  quantity above the minimum is passed", () => {
			const condition = {
				percentage: 30,
				minimum: 2,
			};

			cart.add({
				product,
				condition,
				quantity: 3,
			});

			expect(cart.getTotal().getAmount()).toEqual(74315);
		});

		it("should apply quantity discount for even quantities", () => {
			const condition = {
				quantity: 2,
			};

			cart.add({
				product,
				condition,
				quantity: 4,
			});

			expect(cart.getTotal().getAmount()).toEqual(70776);
		});

		it("shoud apply quantity discount for odd quantities", () => {
			const condition = {
				quantity: 2,
			};

			cart.add({
				product,
				condition,
				quantity: 5,
			});

			expect(cart.getTotal().getAmount()).toEqual(106164);
		});

		it("should not apply the discount quantity is below or equals the minium", () => {
			const condition = {
				quantity: 2,
			};

			cart.add({
				product,
				condition,
				quantity: 2,
			});

			expect(cart.getTotal().getAmount()).toEqual(70776);
		});

		it("should not apply the discount quantity is below or equals the minium", () => {
			const condition = {
				quantity: 2,
			};

			cart.add({
				product,
				condition,
				quantity: 1,
			});

			expect(cart.getTotal().getAmount()).toEqual(35388);
		});

		it("should receive tow or more conditions and determine/apply the best discount. First Case", () => {
			const condition1 = {
				percentage: 30,
				minimum: 2,
			};

			//this is the best condition - 40%
			const condition2 = {
				quantity: 2,
			};

			cart.add({
				product,
				condition: [condition1, condition2],
				quantity: 5,
			});

			expect(cart.getTotal().getAmount()).toEqual(106164);
		});

		it("should receive tow or more conditions and determine/apply the best discount. Second Case", () => {
			const condition1 = {
				percentage: 80,
				minimum: 2,
			};

			const condition2 = {
				quantity: 2,
			};

			cart.add({
				product,
				condition: [condition1, condition2],
				quantity: 5,
			});

			expect(cart.getTotal().getAmount()).toEqual(35388);
		});
	});
});
