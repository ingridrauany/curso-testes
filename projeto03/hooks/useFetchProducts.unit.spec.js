import { renderHook, waitFor } from "@testing-library/react";
import { Response } from "miragejs";
import { makeServer } from "../miragejs/server";
import { useFetchProducts } from "./useFetchProducts";

describe("useFetchProducts", () => {
	let server;

	beforeEach(() => {
		server = makeServer({ environment: "test" });
	});

	afterEach(() => {
		server.shutdown();
	});

	it("should return a list of 10 products", async () => {
		server.createList("product", 10);

		const { result } = renderHook(() => useFetchProducts());

		await waitFor(() => {
			expect(result.current.products).toHaveLength(10);
			expect(result.current.error).toBe(false);
		});
	});

	it("should set error to true when catch() block is executed", async () => {
		server.get("products", () => {
			return new Response(500, {}, "");
		});

		const { result } = renderHook(() => useFetchProducts());

		await waitFor(() => {
			expect(result.current.products).toHaveLength(0);
			expect(result.current.error).toBe(true);
		});
	});
});
