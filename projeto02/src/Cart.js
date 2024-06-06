import Dinero from "dinero.js";
import find from "lodash/find";
import remove from "lodash/remove";
import { calculateDiscount } from "./utils/discount";

const Money = Dinero;

Money.defaultCurrency = "BRL";
Money.defaultPrecision = 2;

export default class Cart {
	items = [];

	add(item) {
		const itemToFind = { product: item.product };
		if (find(this.items, itemToFind)) {
			remove(this.items, itemToFind);
		}
		this.items.push(item);
	}

	remove(product) {
		remove(this.items, { product });
	}

	getTotal() {
		return this.items.reduce((acc, current) => {
			const amount = Money({
				amount: current.quantity * current.product.price,
			});

			let discount = Money({ amount: 0 });

			if (current.condition) {
				discount = calculateDiscount(
					amount,
					current.quantity,
					current.condition
				);
			}

			return acc.add(amount).subtract(discount);
		}, Money({ amount: 0 }));
	}

	checkout() {
		const { total, items } = this.summary();

		this.items = [];

		return {
			total,
			items,
		};
	}

	summary() {
		const total = this.getTotal();
		const items = this.items;
		const formatted = total.toFormat("$0,0.00");

		return {
			total: total.getAmount(),
			items,
			formatted,
		};
	}
}
