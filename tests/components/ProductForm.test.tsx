import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";
import { Category, Product } from "../../src/entities";
import { db } from "../mocks/db";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

describe("ProductForm", () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = (product?: Product) => {
    const submitHandler = vi.fn();

    render(
      <>
        <ProductForm onSubmit={submitHandler} product={product} />
        <Toaster />
      </>,
      {
        wrapper: AllProviders,
      }
    );

    return {
      onSubmit: submitHandler,

      expectErrorToBeInTheDocument: (errorMessage: RegExp) => {
        const error = screen.getByRole("alert");
        expect(error).toBeInTheDocument();
        expect(error).toHaveTextContent(errorMessage);
      },

      waitForForm: async () => {
        await screen.findByRole("form");

        const nameInput = screen.getByPlaceholderText(/name/i);
        const priceInput = screen.getByPlaceholderText(/price/i);
        const categoryInput = screen.getByRole("combobox", {
          name: /category/i,
        });
        const submitButton = screen.getByRole("button", {
          name: /submit/i,
        });

        const fill = async (product: Partial<Product>) => {
          const user = userEvent.setup();

          if (product.name !== undefined) {
            await user.type(nameInput, product.name);
          }

          if (product.price !== undefined) {
            await user.type(priceInput, product.price.toString());
          }

          await user.tab(); // Move focus to the category input
          await user.click(categoryInput);

          const options = screen.getAllByRole("option");
          await user.click(options[0]);
          await user.click(submitButton);
        };

        return {
          nameInput,
          priceInput,
          categoryInput,
          submitButton,
          fill,
        };
      },
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

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "longer than 255 characters",
      name: "a".repeat(256),
      errorMessage: /255/i,
    },
    {
      scenario: "whitespace only",
      name: "   ",
      errorMessage: /required/i,
    },
  ])(
    "should display an error if name is $scenario",
    async ({ name, errorMessage }) => {
      const { waitForForm, expectErrorToBeInTheDocument } = renderComponent();

      const form = await waitForForm();

      await form.fill({
        id: 1,
        name: name || undefined,
        price: 100,
        categoryId: category.id,
      });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it.each([
    { scenario: "missing", errorMessage: /required/i },
    {
      scenario: "less than 1",
      price: 0,
      errorMessage: /must be greater than/i,
    },
    {
      scenario: "greater than 1000",
      price: 1001,
      errorMessage: /must be less than/i,
    },
  ])(
    "should display an error if price is $scenario",
    async ({ price, errorMessage }) => {
      const { waitForForm, expectErrorToBeInTheDocument } = renderComponent();

      const form = await waitForForm();
      await form.fill({
        id: 1,
        name: "Valid Product Name",
        price: price,
        categoryId: category.id,
      });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it("should call onSubmit with the correct data", async () => {
    const mockProduct: Partial<Product> = {
      name: "Test Product",
      price: 100,
      categoryId: category.id,
    };

    const { waitForForm, onSubmit } = renderComponent();

    const form = await waitForForm();
    await form.fill(mockProduct);

    expect(onSubmit).toHaveBeenCalledWith(mockProduct);
  });

  it("should display a toast if submission fails", async () => {
    const { waitForForm, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue(new Error("Submission failed"));

    const form = await waitForForm();
    await form.fill({
      id: 1,
      name: "Test Product",
      price: 100,
      categoryId: category.id,
    });

    const toast = await screen.findByRole("status");
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/error/i);
  });

  it("should disabled the submit button upon submission", async () => {
    const { waitForForm, onSubmit } = renderComponent();
    onSubmit.mockReturnValue(new Promise((resolve) => resolve));

    const form = await waitForForm();
    await form.fill({
      id: 1,
      name: "Test Product",
      price: 100,
      categoryId: category.id,
    });

    expect(form.submitButton).toBeDisabled();
  });

  it("should enable the submit button after submission", async () => {
    const { waitForForm, onSubmit } = renderComponent();
    onSubmit.mockResolvedValue({});

    const form = await waitForForm();
    await form.fill({
      id: 1,
      name: "Test Product",
      price: 100,
      categoryId: category.id,
    });

    // expect(form.submitButton).toBeEnabled();
    expect(form.submitButton).not.toBeDisabled();
  });
});
