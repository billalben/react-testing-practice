import { render, screen } from "@testing-library/react";

import ProductDetail from "../../src/components/ProductDetail";
import { products } from "../mocks/data";

describe("ProductDetail", () => {
  it("should render the detail of product", async () => {
    render(<ProductDetail productId={1} />);

    expect(
      await screen.findByText(new RegExp(products[0].name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(products[0].price.toString()))
    ).toBeInTheDocument();
  });

  it("should render message if product not found", async () => {
    render(<ProductDetail productId={999} />);

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("should render error message if productId is invalid", async () => {
    render(<ProductDetail productId={0} />);

    expect(await screen.findByText(/invalid/i)).toBeInTheDocument();
  });
});
