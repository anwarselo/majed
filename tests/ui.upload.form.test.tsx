import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

describe("Upload form", () => {
  it("renders inputs and submits form", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ slug: "demo-1234" }),
    });
    vi.stubGlobal("fetch", mockFetch as unknown as typeof fetch);

    const originalLocation = window.location;
    const hrefSetter = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...originalLocation,
        set href(value: string) {
          hrefSetter(value);
        },
        get href() {
          return "";
        },
      },
    });

    render(<Home />);
    fireEvent.change(screen.getByPlaceholderText("Acme Repairs"), {
      target: { value: "Acme Repairs" },
    });

    const fileInput = screen.getByLabelText("Document") as HTMLInputElement;
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.submit(screen.getByRole("button", { name: /upload/i }).closest("form")!);

    await vi.waitFor(() => expect(mockFetch).toHaveBeenCalled());
    await vi.waitFor(() => expect(hrefSetter).toHaveBeenCalledWith("/b/demo-1234"));

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });
});

