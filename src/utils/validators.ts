import { z } from "zod/v4";
import { fromError } from "zod-validation-error/v4";
import { logger } from "./logger";

export const validator = {
  email: (email: string) => {
    logger.info(`Validating email: `, email);

    const schema = z.email({ error: "Not an email!" });

    try {
      schema.parse(email);
      logger.success(`Email is valid: `, email);
      return true;
    } catch (error) {
      const validationError = fromError(error);
      logger.error(validationError.toString(), email);
      return false;
    }
  },
  leaveMeId: (id: string) => {
    logger.info(`Validating LeaveMeId: `, id);

    const schema = z
      .string({ error: "Not a string!" })
      .min(4, { error: "Too short!" })
      .max(11, { error: "Too long!" })
      .startsWith("@", { error: "Doesn't start with @!" });

    try {
      schema.parse(id);
      logger.success(`LeaveMeId is valid: `, id);
      return true;
    } catch (error) {
      const validationError = fromError(error);
      logger.error(validationError.toString(), id);
      return false;
    }
  },
  password: (password: string) => {
};
