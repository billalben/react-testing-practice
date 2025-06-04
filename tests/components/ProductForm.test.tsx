import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";
import { Category, Product } from "../../src/entities";
import { db } from "../mocks/db";
import userEvent from "@testing-library/user-event";

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
      waitForForm: async () => {
        await screen.findByRole("form");

        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
          submitButton: screen.getByRole("button", { name: /submit/i }),
        };
      },

      //   getInputs: () => {
      //     return {
      //       nameInput: screen.getByPlaceholderText(/name/i),
      //       priceInput: screen.getByPlaceholderText(/price/i),
      //       categoryInput: screen.getByRole("combobox", { name: /category/i }),
      //     };
      //   },

      //   getNameInput: () => screen.getByPlaceholderText(/name/i),
      //   getPriceInput: () => screen.getByPlaceholderText(/price/i),
    };
  };

  it("should render form fields", async () => {
    const { waitForForm } = renderComponent();

    const { nameInput, priceInput, categoryInput } = await waitForForm();

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

    const { waitForForm } = renderComponent(mockProduct);

    const inputs = await waitForForm();

    expect(inputs.nameInput).toHaveValue(mockProduct.name);

    expect(inputs.priceInput).toHaveValue(mockProduct.price.toString());

    expect(inputs.categoryInput).toHaveTextContent(category.name);
  });

  it("should put focus on the name field when form mounting", async () => {
    const { waitForForm } = renderComponent();

    const { nameInput } = await waitForForm();

    expect(nameInput).toHaveFocus();
  });

  it("should display an error if name is missing", async () => {
    const { waitForForm } = renderComponent();

    const form = await waitForForm();

    const user = userEvent.setup();
    await user.type(form.priceInput, "10"); // type a valid price
    await user.click(form.categoryInput); // open the category select
    const options = screen.getAllByRole("option");
    await user.click(options[0]); // select the first category
    await user.click(form.submitButton); // submit the form

    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(/required/i);
  });

  it("should display an error if price is missing", async () => {
    const { waitForForm } = renderComponent();

    const form = await waitForForm();

    const user = userEvent.setup();
    await user.type(form.nameInput, "Test Product"); // type a valid name
    await user.click(form.categoryInput); // open the category select
    const options = screen.getAllByRole("option");
    await user.click(options[0]); // select the first category
    await user.click(form.submitButton); // submit the form

    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(/required/i);
  });
});
