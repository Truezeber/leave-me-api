import { validator } from "../utils/validators";

describe("E-mail validator", () => {
  test("Valid e-mail", () => {
    expect(validator.email("test@test.com")).toBe(true);
  });

  test("No domain", () => {
    expect(validator.email("test@test")).toBe(false);
  });

  test("No username", () => {
    expect(validator.email("@test.com")).toBe(false);
  });

  test("No domain & username", () => {
    expect(validator.email("@test")).toBe(false);
  });

  test("No @", () => {
    expect(validator.email("testtest.com")).toBe(false);
  });
});
