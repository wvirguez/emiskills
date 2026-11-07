import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const pathname = vi.hoisted(() => ({ value: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.value }));

import Navbar from "./Navbar";

describe("Navbar", () => {
  beforeEach(() => {
    pathname.value = "/";
  });

  it("muestra 'Inicio' como primer enlace de la navegación", () => {
    render(<Navbar />);
    const inicio = screen.getAllByRole("link", { name: "Inicio" })[0];
    expect(inicio).toHaveAttribute("href", "/");
    expect(inicio.parentElement?.querySelector("a")).toBe(inicio);
  });

  it("conserva los demás enlaces", () => {
    render(<Navbar />);
    const expected = {
      Productos: "/#productos",
      Categorías: "/#categorias",
      Buscar: "/#buscar",
      "Cómo funciona": "/#como-funciona",
    };
    for (const [name, href] of Object.entries(expected)) {
      expect(screen.getAllByRole("link", { name })[0]).toHaveAttribute("href", href);
    }
  });

  it("marca 'Inicio' como página actual solo en '/'", () => {
    const { unmount } = render(<Navbar />);
    for (const l of screen.getAllByRole("link", { name: "Inicio" })) {
      expect(l).toHaveAttribute("aria-current", "page");
    }
    unmount();
    pathname.value = "/productos";
    render(<Navbar />);
    for (const l of screen.getAllByRole("link", { name: "Inicio" })) {
      expect(l).not.toHaveAttribute("aria-current");
    }
  });

  it("el menú móvil incluye 'Inicio' y se cierra al pulsarlo", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: "Toggle navigation" });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const inicio = screen.getAllByRole("link", { name: "Inicio" });
    expect(inicio).toHaveLength(2);
    fireEvent.click(inicio[1]);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
