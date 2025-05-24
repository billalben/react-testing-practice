// import { screen, render, waitFor } from "@testing-library/react";
import { screen, render } from "@testing-library/react";
import TagList from "../../src/components/TagList";

describe("TagList", () => {
  it("should show loading and then render tags", async () => {
    render(<TagList />);

    // Initially shows loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // await waitFor(() => {
    //   const listItems = screen.getAllByRole("listitem"); // default timeout is 1000ms
    //   expect(listItems.length).toBeGreaterThan(0);
    // }, { timeout: 2000 }); // if you don't set timeout, the default is 1000ms

    // const listItems = await screen.findAllByRole("listitem", {}, { timeout: 2000 }); // if you want to increase the default timeout
    const listItems = await screen.findAllByRole("listitem"); // default timeout is 1000ms
    expect(listItems.length).toBeGreaterThan(0);

    // Loading should disappear
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
