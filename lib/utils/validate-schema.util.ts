type ValidatedSchemaResult = {
  error: { message: string };
  validatedConfig: Record<string, any>;
};

/**
 * Validates the config using Zod
 */
export function validateZod(
  schema: any,
  config: Record<string, unknown>,
): ValidatedSchemaResult {
  let error;
  const zodValidation = schema.safeParse(config);
  if (!zodValidation.success) {
    error = zodValidation.error.issues.reduce(
      (
        acc: { message: string },
        issue: { path: string[]; message: string },
      ) => {
        return {
          message: `${acc.message} "${
            issue.path[0]
          }" is ${issue.message.toLowerCase()}.`,
        };
      },
      { message: '' },
    );
    error.message = error.message.slice(0, -1);
  }
  const validatedConfig = zodValidation.success
    ? zodValidation.data
    : undefined;
  return { error, validatedConfig };
}

/**
 * Validates the config using Joi
 */
export function validateJoi(
  schema: any,
  config: Record<string, unknown>,
  validationOptions?: Record<string, unknown>,
): ValidatedSchemaResult {
  const joiValidation = schema.validate(config, validationOptions);
  const error = joiValidation.error;
  const validatedConfig = joiValidation.value;

  return { error, validatedConfig };
}
