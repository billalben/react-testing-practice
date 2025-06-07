import { render, screen } from "@testing-library/react";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import Label from "../../src/components/Label";
import { Language } from "../../src/providers/language/type";

type LocalizedLabelProps = {
  labelId: string;
  text: string;
  language: Language;
};

describe("Label", () => {
  const renderComponent = (language: Language, labelId: string) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    );
  };

  describe("Given the current language is EN", () => {
    it.each<LocalizedLabelProps>([
      { labelId: "welcome", text: "Welcome", language: "en" },
      {
        labelId: "new_product",
        text: "New Product",
        language: "en" as Language,
      },
      {
        labelId: "edit_product",
        text: "Edit Product",
        language: "en" as Language,
      },
    ])(
      'should render "$text" for labelId "$labelId" in language "$language"',
      ({ labelId, text, language }) => {
        renderComponent(language, labelId);
        expect(screen.getByText(text)).toBeInTheDocument();
      }
    );
  });

  describe("Given the current language is ES", () => {
    it.each<LocalizedLabelProps>([
      { labelId: "welcome", text: "Bienvenidos", language: "es" },
      {
        labelId: "new_product",
        text: "Nuevo Producto",
        language: "es" as Language,
      },
      {
        labelId: "edit_product",
        text: "Editar Producto",
        language: "es" as Language,
      },
    ])(
      'should render "$text" for labelId "$labelId" in language "$language"',
      ({ labelId, text, language }) => {
        renderComponent(language, labelId);
        expect(screen.getByText(text)).toBeInTheDocument();
      }
    );
  });

  it("should not render text for an unknown labelId", () => {
    expect(() => renderComponent("en", "unknown_label")).toThrowError();
  });
});
