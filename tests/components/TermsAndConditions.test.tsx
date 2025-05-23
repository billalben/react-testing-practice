import { render, screen } from "@testing-library/react";
import TermsAndConditions from "../../src/components/TermsAndConditions";
import userEvent from "@testing-library/user-event";

// import { fireEvent } from "@testing-library/react";

describe("TermsAndConditions", () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);

    screen.getByRole("heading", { name: /terms/i });

    return {
      checkbox: screen.getByRole("checkbox"),
      button: screen.getByRole("button", { name: /submit/i }),
    };
  };

  it("should render with correct text and initial state", () => {
    const { checkbox, button } = renderComponent();

    expect(checkbox).not.toBeChecked();
    expect(button).toBeDisabled();
  });

  it("should enable the button when checkbox is checked", async () => {
    const { checkbox, button } = renderComponent();

    const user = userEvent.setup();
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(button).toBeEnabled();
  });
});
