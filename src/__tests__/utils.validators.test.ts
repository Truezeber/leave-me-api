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

describe("Password validator", () => {
  test("Valid password with lower case letters", () => {
    expect(validator.password("reallyvalidpassword")).toBe(true);
  });

  test("Valid password with upper case letters", () => {
    expect(validator.password("ReallyValidPassword")).toBe(true);
  });

  test("Valid password with special characters", () => {
    expect(validator.password("re@llyv@lidp@ssw()rd")).toBe(true);
  });

  test("Valid password with numbers", () => {
    expect(validator.password("r3a11yvalidpassw0rd")).toBe(true);
  });

  test("Valid password with combined characters", () => {
    expect(validator.password("ReallyValidPassword@#123")).toBe(true);
  });

  test("Too short", () => {
    expect(validator.password("InPas")).toBe(false);
  });
});

describe("Nickname validator", () => {
  test("Valid nickname with lower case letters", () => {
    expect(validator.nickname("reallyvalidnickname")).toBe(true);
  });

  test("Valid nickname with upper case letters", () => {
    expect(validator.nickname("ReallyValidNickname")).toBe(true);
  });

  test("Valid nickname with special characters", () => {
    expect(validator.nickname("re@llyv@lidn@()me")).toBe(true);
  });

  test("Valid nickname with numbers", () => {
    expect(validator.nickname("r3a11yvalidnickn4me")).toBe(true);
  });

  test("Valid nickname with combined characters", () => {
    expect(validator.nickname("Re@11yVal1dN1(kn@m3")).toBe(true);
  });

  test("Too short", () => {
    expect(validator.nickname("In")).toBe(false);
  });
});

describe("URL validator", () => {
  test("Valid URL", () => {
    expect(validator.url("https://www.google.com")).toBe(true);
  });

  test("Valid URL with port", () => {
    expect(validator.url("https://www.google.com:8080")).toBe(true);
  });

  test("Valid URL with path", () => {
    expect(validator.url("https://www.google.com/path")).toBe(true);
  });

  test("Valid URL with query", () => {
    expect(validator.url("https://www.google.com/path?query")).toBe(true);
  });

  test("Valid URL with fragment", () => {
    expect(validator.url("https://www.google.com/path?query#fragment")).toBe(
      true
    );
  });

  test("Valid URL with file", () => {
    expect(validator.url("https://www.google.com/path/file.png")).toBe(true);
  });

  test("Valid URL with port, path, query, and fragment", () => {
    expect(
      validator.url("https://www.google.com:8080/path?query#fragment")
    ).toBe(true);
  });

  test("Valid HTTP URL", () => {
    expect(validator.url("http://www.google.com")).toBe(true);
  });

  test("Valid FTP URL", () => {
    expect(validator.url("ftp://www.google.com")).toBe(true);
  });

  test("Valid URL with / at the end", () => {
    expect(validator.url("https://www.google.com/")).toBe(true);
  });

  test("Invalid URL", () => {
    expect(validator.url("www.google.com")).toBe(false);
  });
});
