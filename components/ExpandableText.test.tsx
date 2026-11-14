import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ExpandableText, { EXPAND_THRESHOLD } from "./ExpandableText";

const long = ["a".repeat(EXPAND_THRESHOLD + 1), "segundo"];

describe("ExpandableText", () => {
  it("no muestra el botón con texto corto", () => {
    render(<ExpandableText paragraphs={["Corto."]} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("con texto largo empieza colapsado con 'Ver más' y el texto completo en el DOM", () => {
    const { container } = render(<ExpandableText paragraphs={long} />);
    const btn = screen.getByRole("button", { name: "Ver más" });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("segundo")).toBeInTheDocument();
    expect(container.querySelector(".max-h-52")).not.toBeNull();
  });

  it("alterna entre 'Ver más' y 'Ver menos'", () => {
    const { container } = render(<ExpandableText paragraphs={long} />);
    fireEvent.click(screen.getByRole("button", { name: "Ver más" }));
    const less = screen.getByRole("button", { name: "Ver menos" });
    expect(less).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelector(".max-h-52")).toBeNull();
    fireEvent.click(less);
    expect(screen.getByRole("button", { name: "Ver más" })).toBeInTheDocument();
  });
});
