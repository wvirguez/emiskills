import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Benefits from "./Benefits"

describe("Benefits", () => {
  it("muestra la región y los 4 beneficios con su descripción", () => {
    render(<Benefits />)
    expect(screen.getByRole("region", { name: "Beneficios" })).toBeInTheDocument()
    const items: [string, string][] = [
      ["Alta Calidad", "Productos Premium y útiles"],
      ["Acceso Instantáneo", "Descarga inmediata después de comprar"],
      ["Pago Seguro", "Pagos seguros y encriptados"],
      ["Gran Apoyo", "Estamos aquí para ayudarte en cualquier momento"],
    ]
    for (const [title, desc] of items) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument()
      expect(screen.getByText(desc)).toBeInTheDocument()
    }
    expect(screen.getAllByRole("listitem")).toHaveLength(4)
  })

  it("marca los íconos como decorativos", () => {
    const { container } = render(<Benefits />)
    const svgs = container.querySelectorAll("svg")
    expect(svgs).toHaveLength(4)
    svgs.forEach((s) => expect(s).toHaveAttribute("aria-hidden", "true"))
  })
})
