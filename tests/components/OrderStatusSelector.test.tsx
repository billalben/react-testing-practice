import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    const handleChange = vi.fn();

    render(
      <Theme>
        <OrderStatusSelector onChange={handleChange} />
      </Theme>
    );

    return {
      trigger: screen.getByRole("combobox"), // Radix Select uses combobox role
      user: userEvent.setup(),
      handleChange,
      getOptions: () => screen.getAllByRole("option"),
      getOption: (label: RegExp) => screen.getByRole("option", { name: label }),
    };
  };

  it("should render New as the default value", () => {
    const { trigger } = renderComponent();
    expect(trigger).toHaveTextContent("New");
  });

  it("should render correct statuses", async () => {
    const { trigger, user, getOptions } = renderComponent();
    await user.click(trigger);

    const options = getOptions();
    expect(options).toHaveLength(3);

    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });

  it.each([
    // { label: /new/i, value: "new" },
    { label: /processed/i, value: "processed" },
    { label: /fulfilled/i, value: "fulfilled" },
  ])(
    "should call onChange with $label when $value is selected",
    async ({ label, value }) => {
      const { trigger, user, handleChange, getOption } = renderComponent();
      await user.click(trigger);

      const option = getOption(label);
      await user.click(option);

      expect(handleChange).toHaveBeenCalledWith(value);
    }
  );

  it("should not call onChange when the same value is selected", async () => {
    const { trigger, user, handleChange, getOption } = renderComponent();
    await user.click(trigger);

    const option = getOption(/new/i);
    await user.click(option);

    expect(handleChange).not.toHaveBeenCalled();
  });
});
