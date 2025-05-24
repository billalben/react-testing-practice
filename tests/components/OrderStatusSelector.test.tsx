import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  it("should render New as the default value", () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    const trigger = screen.getByRole("combobox"); // Radix Select uses combobox role
    expect(trigger).toHaveTextContent("New");
  });

  it("should render correct statuses", async () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    const trigger = screen.getByRole("combobox"); // Radix Select uses combobox role
    const user = userEvent.setup();
    await user.click(trigger);

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);

    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });

  it("should call onChange with the selected value", async () => {
    const handleChange = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={handleChange} />
      </Theme>
    );

    const trigger = screen.getByRole("combobox");
    const user = userEvent.setup();
    await user.click(trigger);

    const option = screen.getByText("Processed");
    await user.click(option);

    expect(handleChange).toHaveBeenCalledWith("processed");
  });
});
