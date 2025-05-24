import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
  const limit = 255;

  const longText = "t".repeat(limit + 1); // 256 characters
  const shortText = "t".repeat(limit); // 255 characters

  const renderComponent = (text: string) =>
    render(<ExpandableText text={text} />);

  const showMoreButton = () =>
    screen.getByRole("button", { name: /show more/i });
  const showLessButton = () =>
    screen.getByRole("button", { name: /show less/i });

  it("should render full text if it is under limit", () => {
    renderComponent(shortText);
    const article = screen.getByRole("article");
    expect(article).toBeInTheDocument();
    expect(article).toHaveTextContent(shortText);

    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });

  it("should render truncated text and button if it is over limit", () => {
    renderComponent(longText);
    const article = screen.getByRole("article");
    expect(article).toBeInTheDocument();
    expect(article).toHaveTextContent(
      longText.substring(0, limit - 30) + "..."
    );

    const button = screen.getByRole("button", { name: /show more/i });
    expect(button).toBeInTheDocument();
  });

  it("should expand text when button is clicked", async () => {
    renderComponent(longText);
    const button = showMoreButton();
    await userEvent.click(button);

    const article = screen.getByRole("article");
    expect(article).toHaveTextContent(longText);

    const buttonLess = showLessButton();
    expect(buttonLess).toBeInTheDocument();
  });
});
