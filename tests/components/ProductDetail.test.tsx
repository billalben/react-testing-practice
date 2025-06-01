import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import ProductDetail from "../../src/components/ProductDetail";
import { db } from "../mocks/db";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import AllProviders from "../AllProviders";

describe("ProductDetail", () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("should render product detail", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();
  });

  it("should render message if product not found", async () => {
    server.use(http.get("/products/1", () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });

  // it("should render error message if productId is invalid", async () => {
  //   render(<ProductDetail productId={1231240} />, { wrapper: AllProviders });

  //   expect(await screen.findByText(/error/i)).toBeInTheDocument();
  // });

  it("should render error message if API returns an error", async () => {
    // server.use(
    //   http.get("/products/1", () => HttpResponse.json(null, { status: 500 }))
    // );
    server.use(http.get("/products/1", () => HttpResponse.error()));

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    const errorMessage = await screen.findByText(/error/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("should render loading state while fetching product details", async () => {
    server.use(
      http.get("/products/1", async () => {
        // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay
        await delay();
        return HttpResponse.json(
          db.product.findFirst({ where: { id: { equals: 1 } } })
        );
      })
    );

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    const loadingMessage = await screen.findByText(/loading/i);
    expect(loadingMessage).toBeInTheDocument();
  });

  it("should remove loading state if data fetching failed", async () => {
    // server.use(http.get("/products/1", () => HttpResponse.error()));
    server.use(
      http.get("/products/1", async () => {
        await delay(); // Simulate a delay
        return HttpResponse.error();
      })
    );

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    await screen.findByText(/error/i);
  });
});
