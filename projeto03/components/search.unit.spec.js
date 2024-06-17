import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Search from "./search";

const doSearch = jest.fn();

describe("<Search/>", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Should render a form", () => {
		render(<Search doSearch={doSearch} />);

		//para que um form seja reconhecido, ele precisa ter um name
		expect(screen.getByRole("form")).toBeInTheDocument();
	});

	it("Should render a input type equals search", () => {
		render(<Search doSearch={doSearch} />);

		expect(screen.getByRole("searchbox")).toHaveProperty("type", "search");
	});

	it("Should call props.doSearch() when form is submitted", async () => {
		render(<Search doSearch={doSearch} />);

		const form = screen.getByRole("form");

		await fireEvent.submit(form);

		expect(doSearch).toHaveBeenCalledTimes(1);
	});

	it("Should call props.doSearch() with the user input", async () => {
		render(<Search doSearch={doSearch} />);

		const inputText = "Some text here";
		const form = screen.getByRole("form");
		const input = screen.getByRole("searchbox");

		await act(async () => {
			await userEvent.type(input, inputText);
			await fireEvent.submit(form);
		});

		expect(doSearch).toHaveBeenCalledWith(inputText);
	});

	it("Should call doSearch when search input is cleared", async () => {
		render(<Search doSearch={doSearch} />);

		const inputText = "Some text here";
		const input = screen.getByRole("searchbox");

		await act(async () => {
			await userEvent.type(input, inputText);
			await userEvent.clear(input);
		});

		expect(doSearch).toHaveBeenCalledTimes(1);
		expect(doSearch).toHaveBeenCalledWith("");
	});
});
