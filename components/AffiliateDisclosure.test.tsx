import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";

describe("AffiliateDisclosure", () => {
  it("tiene id='aviso-afiliados'", () => {
    render(<AffiliateDisclosure />);
    const disclosure = document.getElementById("aviso-afiliados");
    expect(disclosure).toBeInTheDocument();
  });

  it("el elemento raíz tiene id='aviso-afiliados'", () => {
    const { container } = render(<AffiliateDisclosure />);
    const root = container.firstElementChild;
    expect(root).toHaveAttribute("id", "aviso-afiliados");
  });
});