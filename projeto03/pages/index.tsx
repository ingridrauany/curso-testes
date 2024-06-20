import { useEffect, useState } from "react";
import ProductCard from "../components/product-card";
import Search from "../components/search";
import { useFetchProducts } from "../hooks/useFetchProducts";
import { useCartStore } from "../store/cart/index";

export default function ProductList() {
	const { products, error } = useFetchProducts();
	const [term, setTerm] = useState("");
	const [localProducts, setLocalProducts] = useState([]);
	const addToCart = useCartStore((store) => store.actions.add);

	useEffect(() => {
		if (term === "") {
			setLocalProducts(products);
		} else {
			setLocalProducts(
				products.filter(({ title }) => {
					return title.toLowerCase().indexOf(term.toLowerCase()) > -1;
				})
			);
		}
	}, [products, term]);

	return (
		<main className="my-8" data-testid="product-list">
			<Search doSearch={(term) => setTerm(term)} />
			<div className="container mx-auto px-6">
				<h3 className="text-gray-700 text-2xl font-medium">
					Wrist Watch
				</h3>
				<span className="mt-3 text-sm text-gray-500">
					{localProducts.length} Products
				</span>
				<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
					{error && (
						<h4 data-testid="server-error">Server is down</h4>
					)}
					{products.length === 0 && !error && (
						<h4 data-testid="no-products">No products</h4>
					)}
					{localProducts.map((product, index) => (
						<ProductCard
							product={product}
							addToCart={addToCart}
							key={product.id}
						/>
					))}
				</div>
			</div>
		</main>
	);
}
