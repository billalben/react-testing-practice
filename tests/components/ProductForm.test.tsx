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

  const renderComponent = (product?: Product) => {
    render(<ProductForm onSubmit={vi.fn()} product={product} />, {
      wrapper: AllProviders,
    });

    return {
      waitForForm: () => screen.findByRole("form"),
      getInputs: () => {
        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
        };
      },

      //   getNameInput: () => screen.getByPlaceholderText(/name/i),
      //   getPriceInput: () => screen.getByPlaceholderText(/price/i),
    };
  };

  it("should render form fields", async () => {
    const { waitForForm, getInputs } = renderComponent();

    await waitForForm();

    const { nameInput, priceInput, categoryInput } = getInputs();

    // Check if the name input is rendered
    expect(nameInput).toBeInTheDocument();

    // Check if the price input is rendered
    expect(priceInput).toBeInTheDocument();

    // Check if the category select is rendered
    expect(categoryInput).toBeInTheDocument();
  });

  it("should populate form fields when editing a product", async () => {
    const mockProduct: Product = {
      id: 1,
      name: "Test Product",
      price: 100,
      categoryId: category.id,
    };

    const { waitForForm, getInputs } = renderComponent(mockProduct);

    await waitForForm();

    const inputs = getInputs();

    expect(inputs.nameInput).toHaveValue(mockProduct.name);

    expect(inputs.priceInput).toHaveValue(mockProduct.price.toString());

    expect(inputs.categoryInput).toHaveTextContent(category.name);
  });
});
