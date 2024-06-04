import Dinero from "dinero.js";
import find from "lodash/find";
import remove from "lodash/remove";

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
			return acc.add(
				Money({
					amount: current.quantity * current.product.price,
				})
			);
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
		const total = this.getTotal().getAmount();
		const items = this.items;

		return {
			total,
			items,
		};
	}
}
