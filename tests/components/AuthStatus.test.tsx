import { render, screen } from "@testing-library/react";
import { mockAuthState } from "../utils";
import AuthStatus from "../../src/components/AuthStatus";

describe("AuthStatus", () => {
  it("should render the loading message while fetching the auth status", () => {
    mockAuthState({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render the login button if the user is not authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);

    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("should render the user name if authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: { name: "John Doe", email: "test@gmail.com" },
    });

    render(<AuthStatus />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log in/i })
    ).not.toBeInTheDocument();
  });
});
