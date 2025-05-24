import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToastDemo from "../../src/components/ToastDemo";
import { Toaster } from "react-hot-toast";

describe("ToastDemo", () => {
  it("should display a toast when button is clicked", async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    const button = screen.getByRole("button", { name: /show toast/i });
    const user = userEvent.setup();
    await user.click(button);

    // Wait for the toast message to appear
    const toast = await screen.findByText(/success/i);
    expect(toast).toBeInTheDocument();
  });
});
