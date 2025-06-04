import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";

describe.only("ProductForm", () => {
  it("should render form fields", async () => {
    render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProviders });

    await screen.findByRole("form");
    // await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    // Check if the name input is rendered
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();

    // Check if the price input is rendered
    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();

    // Check if the category select is rendered
    expect(
      screen.getByRole("combobox", { name: /category/i })
    ).toBeInTheDocument();
  });
});
