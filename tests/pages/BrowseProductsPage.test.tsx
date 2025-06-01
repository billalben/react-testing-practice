import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { server } from "../mocks/server";
import { http, HttpResponse, delay } from "msw";
import AllProviders from "../AllProviders";
import BrowseProducts from "../../src/pages/BrowseProductsPage";

describe("BrowseProductsPage", () => {
  it("should show a loading skeleton when fetching categories", () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    render(<BrowseProducts />, { wrapper: AllProviders });
    // screen.debug();
    expect(
      screen.getByRole("progressbar", {
        name: /categories/i,
      })
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton after categories are fetched", async () => {
    render(<BrowseProducts />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );
  });

  it("should show a loading skeleton when fetching products", () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    render(<BrowseProducts />, { wrapper: AllProviders });

    expect(
      screen.getByRole("progressbar", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should not render an error if categories cannot be fetched", async () => {
    server.use(http.get("/categories", () => HttpResponse.error()));

    render(<BrowseProducts />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("should render an error if products cannot fetched", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    render(<BrowseProducts />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
