import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { http, HttpResponse, delay } from "msw";
import { db } from "../mocks/db";
import AllProviders from "../AllProviders";
// import delay from "delay";

describe("ProductList", () => {
  const productIds: number[] = [];

  beforeAll(() => {
    Array.from({ length: 3 }).forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it("should render the list of products", async () => {
    render(<ProductList />, { wrapper: AllProviders });

    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should render no products available if no product is found", async () => {
    // Override the /products endpoint to return an empty array
    server.use(http.get("/products", () => HttpResponse.json([])));

    render(<ProductList />, { wrapper: AllProviders });

    const noProductsMessage = await screen.findByText(/No products/i);
    expect(noProductsMessage).toBeInTheDocument();
  });

  it("should render error message if the API returns an error", async () => {
    server.use(
      http.get("/products", () => HttpResponse.json(null, { status: 500 }))
    );

    render(<ProductList />, { wrapper: AllProviders });

    const errorMessage = await screen.findByText(/error/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("should render loading state while fetching products", async () => {
    // server.use(http.get("/products", () => new Promise(() => {}))); // Keep the request pending

    server.use(
      http.get("/products", async () => {
        await delay(); // Simulate a delay
        return HttpResponse.json([]);
      })
    );

    render(<ProductList />, { wrapper: AllProviders });

    const loadingMessage = await screen.findByText(/loading/i);
    expect(loadingMessage).toBeInTheDocument();
  });

  it("should remove loading state after fetching products", async () => {
    render(<ProductList />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should remove loading state if data fetching failed", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    render(<ProductList />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
