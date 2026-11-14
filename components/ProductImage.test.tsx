import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProductImage from "./ProductImage";

describe("ProductImage", () => {
  it("no renderiza nada sin URL", () => {
    const { container } = render(<ProductImage src={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renderiza una imagen decorativa con la URL", () => {
    const { container } = render(<ProductImage src="https://emiskills.com/images/products/a.jpeg" />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "https://emiskills.com/images/products/a.jpeg");
    expect(img).toHaveAttribute("alt", "");
  });
});
