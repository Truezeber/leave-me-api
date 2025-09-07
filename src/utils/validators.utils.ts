import { z } from "zod/v4";

export const validator = {
  email: (email: string) => {
    const schema = z.email({ error: "Not an email!" });

    try {
      schema.parse(email);

      return true;
    } catch (error) { return false };
  },
  leaveMeId: (id: string) => {
    const schema = z
      .string({ error: "Not a string!" })
      .min(4, { error: "Too short!" })
      .max(11, { error: "Too long!" })
      .startsWith("@", { error: "Doesn't start with @!" });

    try {
      schema.parse(id);

      return true;
    } catch (error) { return false };
  },
  password: (password: string) => {
    const schema = z
      .string({ error: "Not a string!" })
      .min(6, { error: "Too short!" });

    try {
      schema.parse(password);

      return true;
    } catch (error) { return false };
  },
  nickname: (nickname: string) => {
    const schema = z
      .string({ error: "Not a string!" })
      .min(3, { error: "Too short!" })
      .max(20, { error: "Too long!" });

    try {
      schema.parse(nickname);

      return true;
    } catch (error) { return false };
  },
  url: (url: string) => {
    const schema = z.url({ error: "Not a valid URL!" });

    try {
      schema.parse(url);

      return true;
    } catch (error) { return false };
  },
};
