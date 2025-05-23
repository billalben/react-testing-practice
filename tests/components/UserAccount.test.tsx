import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  const adminUser: User = { id: 1, name: "John Doe", isAdmin: true };
  const nonAdminUser: User = { id: 2, name: "John Doe", isAdmin: false };

  const renderUser = (user: User) => render(<UserAccount user={user} />);

  it("should render user name if the user is not admin", () => {
    renderUser(nonAdminUser);
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });

  it("should render user name if the user is admin", () => {
    renderUser(adminUser);
    expect(screen.getByText(/John doe/i)).toBeInTheDocument();
  });

  it("should render edit button for admin user", () => {
    renderUser(adminUser);
    const button = screen.getByRole("button", { name: /edit/i });
    expect(button).toBeInTheDocument();
  });

  it("should not render edit button if he is not admin", () => {
    renderUser(nonAdminUser);
    const button = screen.queryByRole("button", { name: /edit/i });
    expect(button).toBeNull();
  });
});
