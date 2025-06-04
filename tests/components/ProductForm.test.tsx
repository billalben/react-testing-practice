import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";
import { Category, Product } from "../../src/entities";
import { db } from "../mocks/db";

describe("ProductForm", () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

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

  it("should populate form fields when editing a product", async () => {
    const mockProduct: Product = {
      id: 1,
      name: "Test Product",
      price: 100,
      categoryId: category.id,
    };

    render(<ProductForm onSubmit={vi.fn()} product={mockProduct} />, {
      wrapper: AllProviders,
    });

    await screen.findByRole("form");

    expect(screen.getByPlaceholderText(/name/i)).toHaveValue(mockProduct.name);

    expect(screen.getByPlaceholderText(/price/i)).toHaveValue(
      mockProduct.price.toString()
    );

    expect(
      screen.getByRole("combobox", { name: /category/i })
    ).toHaveTextContent(category.name);
  });
});
