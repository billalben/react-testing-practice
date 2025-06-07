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

    const getAddToCartButton = () =>
      screen.queryByRole("button", { name: /add to cart/i });

    const getQuantityControls = () => ({
      decBtn: screen.queryByRole("button", { name: "-" }),
      incBtn: screen.queryByRole("button", { name: "+" }),
      quantity: screen.queryByRole("status"),
    });

    const user = userEvent.setup();

    const addToCart = async () => {
      const addButton = getAddToCartButton();
      if (addButton) await user.click(addButton);
    };

    const incrementQuantity = async () => {
      const { incBtn } = getQuantityControls();
      if (incBtn) await user.click(incBtn);
    };

    const decrementQuantity = async () => {
      const { decBtn } = getQuantityControls();
      if (decBtn) await user.click(decBtn);
    };

    return {
      getAddToCartButton,
      getQuantityControls,
      addToCart,
      incrementQuantity,
      decrementQuantity,
    };
  };

  it("should render the Add to Cart button", () => {
    const { getAddToCartButton: addToCartButton } = renderComponent();

    expect(addToCartButton()).toBeInTheDocument();
  });

  it("should add the product to the cart", async () => {
    const { getAddToCartButton, getQuantityControls, addToCart } =
      renderComponent();

    await addToCart();

    const { quantity, incBtn, decBtn } = getQuantityControls();

    expect(quantity).toHaveTextContent("1");
    expect(decBtn).toBeInTheDocument();
    expect(incBtn).toBeInTheDocument();

    expect(getAddToCartButton()).not.toBeInTheDocument();
  });

  it("should increment the quantity", async () => {
    const { getQuantityControls, addToCart, incrementQuantity } =
      renderComponent();

    await addToCart(); // click to add product so we have a quantity to increment

    const { quantity } = getQuantityControls();
    await incrementQuantity();

    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the quantity", async () => {
    const {
      getQuantityControls,
      addToCart,
      incrementQuantity,
      decrementQuantity,
    } = renderComponent();

    await addToCart(); // click to add product so we have a quantity to decrement
    const { quantity } = getQuantityControls();

    await incrementQuantity(); // Increment to 2
    await decrementQuantity(); // Decrement to 1

    expect(quantity).toHaveTextContent("1");
  });

  it("should render add to cart button after we decriment to the 0", async () => {
    const {
      getAddToCartButton,
      getQuantityControls,
      addToCart,
      decrementQuantity,
    } = renderComponent();

    await addToCart(); // click to add product so we have a quantity to decrement

    const { decBtn, incBtn, quantity } = getQuantityControls();
    await decrementQuantity(); // Decrement to 0

    expect(quantity).not.toBeInTheDocument();
    expect(incBtn).not.toBeInTheDocument();
    expect(decBtn).not.toBeInTheDocument();

    expect(getAddToCartButton()).toBeInTheDocument();
  });
});
