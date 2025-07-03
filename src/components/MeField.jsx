import { Field, Input, InputGroup } from "@chakra-ui/react";

const MeField = ({ label, customError = "", register, startElement, type, placeholder, ...restProps }) => {

  return (
    <Field.Root invalid={customError} {...restProps}>
      <Field.Label>
        {label}
        <Field.RequiredIndicator />
      </Field.Label>
      <InputGroup startElement={startElement}>
        <Input {...register} type={type} placeholder={placeholder} />
      </InputGroup>
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