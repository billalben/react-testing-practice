import { render, screen } from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

describe("ProductList", () => {
  it("should render the list of products", async () => {
    render(<ProductList />);

    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should render no products available if no product is found", async () => {
    // Override the /products endpoint to return an empty array
    server.use(http.get("/products", () => HttpResponse.json([])));
    render(<ProductList />);

    const noProductsMessage = await screen.findByText(/No products/i);
    expect(noProductsMessage).toBeInTheDocument();
  });
});
