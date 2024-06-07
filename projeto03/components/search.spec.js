import { render, screen } from "@testing-library/react";
import Search from "./search";

describe("<Search/>", () => {
	it("Should render Search component", () => {
		render(<Search />);

		expect(screen.getByTestId("search")).toBeInTheDocument();
	});
});
