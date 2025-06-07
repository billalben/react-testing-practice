import { render, screen } from "@testing-library/react";
import { CartProvider } from "../../src/providers/CartProvider";
import QuantitySelector from "../../src/components/QuantitySelector";
import { Product } from "../../src/entities";
import userEvent from "@testing-library/user-event";

describe("QuantitySelector", () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: "Test Product",
      price: 100,
      categoryId: 1,
    };

    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    return {
      getAddToCartButton: () =>
        screen.queryByRole("button", { name: /add to cart/i }),
      getQuantityControls: () => ({
        decBtn: screen.queryByRole("button", { name: /-/ }),
        incBtn: screen.queryByRole("button", { name: /\+/ }),
        quantity: screen.queryByRole("status"),
      }),
      user: userEvent.setup(),
    };
  };

  it("should render the Add to Cart button", () => {
    const { getAddToCartButton: addToCartButton } = renderComponent();

    expect(addToCartButton()).toBeInTheDocument();
  });

  it("should add the product to the cart", async () => {
    const { getAddToCartButton, user, getQuantityControls } = renderComponent();

    await user.click(getAddToCartButton()!);

    const { quantity, incBtn, decBtn } = getQuantityControls();

    expect(quantity).toHaveTextContent("1");
    expect(decBtn).toBeInTheDocument();
    expect(incBtn).toBeInTheDocument();

    expect(getAddToCartButton()).not.toBeInTheDocument();
  });

  it("should increment the quantity", async () => {
    const { getAddToCartButton, user, getQuantityControls } = renderComponent();

    await user.click(getAddToCartButton()!);

    const { quantity, incBtn } = getQuantityControls();
    await user.click(incBtn!);

    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the quantity", async () => {
    const { getAddToCartButton, user, getQuantityControls } = renderComponent();

    await user.click(getAddToCartButton()!); // click to add product so we have a quantity to decrement
    const { quantity, incBtn, decBtn } = getQuantityControls();

    await user.click(incBtn!); // Increment to 2

    await user.click(decBtn!);

    expect(quantity).toHaveTextContent("1");
  });

  it("should render add to cart button after we decriment to the 0", async () => {
    const { getAddToCartButton, user, getQuantityControls } = renderComponent();

    await user.click(getAddToCartButton()!); // click to add product so we have a quantity to decrement

    const { decBtn, incBtn, quantity } = getQuantityControls();
    await user.click(decBtn!); // Decrement to 0

    expect(quantity).not.toBeInTheDocument();
    expect(incBtn).not.toBeInTheDocument();
    expect(decBtn).not.toBeInTheDocument();

    expect(getAddToCartButton()).toBeInTheDocument();
  });
});
