import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import AllProviders from "../AllProviders";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import { db } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.category.create({ name: "Category " + item });
      categories.push(category);

      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = products.map((p) => p.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it("should show a loading skeleton when fetching categories", () => {
    simulateDelay("/categories");

    const { getCategoriesSkeleton } = renderComponent();

    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });

  it("should hide the loading skeleton after categories are fetched", async () => {
    render(<BrowseProducts />, { wrapper: AllProviders });

    const { getCategoriesSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });

  it("should show a loading skeleton when fetching products", () => {
    simulateDelay("/products");

    const { getProductsSkeleton } = renderComponent();

    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it("should not render an error if categories cannot be fetched", async () => {
    simulateError("/categories");

    const { getCategoriesSkeleton, getCategoriesComboBox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
    expect(getCategoriesComboBox()).not.toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("should render an error if products cannot fetched", async () => {
    simulateError("/products");

    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it("should render categories", async () => {
    const { getCategoriesSkeleton, getCategoriesComboBox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesComboBox();
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox!);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);
    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});

const renderComponent = () => {
  render(<BrowseProducts />, { wrapper: AllProviders });

  const getCategoriesSkeleton = () =>
    screen.queryByRole("progressbar", { name: /categories/i });

  const getProductsSkeleton = () =>
    screen.queryByRole("progressbar", { name: /products/i });

  const getCategoriesComboBox = () => screen.queryByRole("combobox");

  const selectCategory = async (name: RegExp | string) => {
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    const combobox = getCategoriesComboBox();
    const user = userEvent.setup();
    await user.click(combobox!);

    const option = screen.getByRole("option", { name });
    await user.click(option);
  };

  return {
    getCategoriesSkeleton,
    getProductsSkeleton,
    getCategoriesComboBox,
    selectCategory,
  };
};
