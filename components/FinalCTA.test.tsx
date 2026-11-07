import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FinalCTA from "@/components/FinalCTA";

describe("FinalCTA", () => {
  it("'Ver productos' lleva al catálogo", () => {
    render(<FinalCTA />);
    expect(screen.getByRole("link", { name: /Ver productos/ })).toHaveAttribute("href", "/productos");
  });
});
