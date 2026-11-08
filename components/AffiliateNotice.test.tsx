import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AffiliateNotice from "@/components/AffiliateNotice";

describe("AffiliateNotice", () => {
  it("muestra 'Aviso de afiliado'", () => {
    render(<AffiliateNotice />);
    expect(screen.getByText(/Aviso de afiliado/)).toBeInTheDocument();
  });

  it("menciona 'comisión' y 'sin costo extra'", () => {
    render(<AffiliateNotice />);
    expect(screen.getByText(/comisión/i)).toBeInTheDocument();
    expect(screen.getByText(/sin costo extra/i)).toBeInTheDocument();
  });

  it('tiene enlace con href="/#aviso-afiliados"', () => {
    render(<AffiliateNotice />);
    const link = screen.getByRole("link", { name: /Más información/ });
    expect(link).toHaveAttribute("href", "/#aviso-afiliados");
  });
});