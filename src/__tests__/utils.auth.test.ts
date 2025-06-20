import { auth } from "../utils/auth.utils";
import { JwtPayload } from "../models/auth.models";

describe("Password hashing", () => {
  test("Hashing password", async () => {
    const testPassword = "XXXXXXXXXXXX";
    const hashedPassword = await auth.hashPassword(testPassword);
    expect(hashedPassword).not.toBe(testPassword);
  });
});

describe("Password comparing", () => {
  test("Password and hash are the same", async () => {
    const testPassword = "XXXXXXXXXXXX";
    const hashedPassword = await auth.hashPassword(testPassword);

    expect(await auth.comparePassword(testPassword, hashedPassword)).toBe(true);
  });

  test("Password and hash are different", async () => {
    const testPassword = "XXXXXXXXXXXX";
    const hashedPassword = await auth.hashPassword(testPassword);

    expect(await auth.comparePassword("XXYYXXYYXXYY", hashedPassword)).toBe(
      false
    );
  });
});

describe("Generating JWT", () => {
  test("JWT is generated", () => {
    const testPayload: JwtPayload = { leave_me_id: "@testID" };

    const jwt = auth.generateJwt(testPayload);
    expect(jwt).not.toBeNull();
  });
});

describe("Verifying JWT", () => {
  test("JWT is valid", () => {
    const testPayload: JwtPayload = { leave_me_id: "@testID" };
    const jwt = auth.generateJwt(testPayload);
    const verified = auth.verifyJwt(jwt);
    expect(verified).not.toBeNull();
    expect(verified?.leave_me_id).toBe(testPayload.leave_me_id);
  });

  test("JWT is invalid", () => {
    const testToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.abc123signature";

    expect(auth.verifyJwt(testToken)).toBeNull();
  });
});
