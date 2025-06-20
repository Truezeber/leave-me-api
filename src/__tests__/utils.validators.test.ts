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

describe("LeaveMeId validator", () => {
  test("Valid LeaveMeId", () => {
    expect(validator.leaveMeId("@thisisid")).toBe(true);
  });

  test("Valid LeaveMeId with special character", () => {
    expect(validator.leaveMeId("@thisisid#")).toBe(true);
  });

  test("Valid LeaveMeId with number", () => {
    expect(validator.leaveMeId("@thisisid1")).toBe(true);
  });

  test("Valid LeaveMeId with upper case letters", () => {
    expect(validator.leaveMeId("@ThisisID")).toBe(true);
  });

  test("Valid LeaveMeId with combined characters", () => {
    expect(validator.leaveMeId("@ThisisID#1")).toBe(true);
  });

  test("No @", () => {
    expect(validator.leaveMeId("ThisIsID#1")).toBe(false);
  });

  test("@ at the end instead", () => {
    expect(validator.leaveMeId("ThisIsID#1@")).toBe(false);
  });

  test("Too short", () => {
    expect(validator.leaveMeId("@Th")).toBe(false);
  });

  test("Too long", () => {
    expect(validator.leaveMeId("@ThisIsTooLongID#1")).toBe(false);
  });
});
