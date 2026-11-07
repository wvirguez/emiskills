// components/Hero.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Hero from "@/components/Hero";

describe("Hero (test de humo)", () => {
  it("renderiza el h1 con el mensaje principal", () => {
    render(<Hero />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Desbloquea tu potencial");
    expect(heading).toHaveTextContent("con Nosotros");
    expect(heading).toHaveTextContent("Explora, Aprende y Crece!");
  });

  it("muestra los CTAs con sus destinos", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: "COMPRAR AHORA" })).toHaveAttribute("href", "/productos");
    expect(screen.getByRole("link", { name: "VER CATEGORÍAS" })).toHaveAttribute(
      "href",
      "/#categorias",
    );
  });

  it("ya no muestra los textos anteriores", () => {
    render(<Hero />);
    expect(screen.queryByText("Obten una Propuesta")).not.toBeInTheDocument();
    expect(screen.queryByText("Intentalo Ahora!")).not.toBeInTheDocument();
  });
});
