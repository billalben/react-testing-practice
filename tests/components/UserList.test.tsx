import { render, screen } from "@testing-library/react";

import UserList from "../../src/components/UserList";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  it("should render no users when the users array is empty", () => {
    render(<UserList users={[]} />);
    const noUsersMessage = screen.getByText(/no users/i);
    expect(noUsersMessage).toBeInTheDocument();
  });

  it("should render a list of users", () => {
    const users: User[] = [
      { id: 1, name: "John Doe", isAdmin: false },
      { id: 2, name: "Jane Smith", isAdmin: true },
    ];

    render(<UserList users={users} />);

    // const userListItems = screen.getAllByRole("listitem");
    // expect(userListItems).toHaveLength(users.length);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(users.length);

    users.forEach((user, index) => {
      // const userLink = screen.getByText(user.name);
      // expect(userLink).toBeInTheDocument();
      // expect(userLink.closest("a")).toHaveAttribute("href", `/users/${user.id}`);

      // const link = screen.getByRole("link", { name: user.name });
      // expect(link).toBeInTheDocument();
      // expect(link).toHaveAttribute("href", `/users/${user.id}`);

      expect(links[index]).toBeInTheDocument();
      expect(links[index]).toHaveAttribute("href", `/users/${user.id}`);
    });
  });
});
