import { Field, Input } from "@chakra-ui/react";

const MeField = ({ label, customError = "", register, ...restProps }) => {

  return (
    <Field.Root invalid={customError}>
      <Field.Label>
        {label}
        <Field.RequiredIndicator />
      </Field.Label>
      <Input {...register} {...restProps} />
      <Field.HelperText />
      {
        customError &&
        <Field.ErrorText>
          {customError}
        </Field.ErrorText>
      }
    </Field.Root>
  );
};

export default MeField;