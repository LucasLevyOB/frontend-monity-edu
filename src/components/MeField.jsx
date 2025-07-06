import { CloseButton, Field, Input, InputGroup } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

const MeField = ({ label, value, customError = "", register, startElement, type, clear, placeholder, onChange, ...restProps }) => {
  const inputRef = useRef(null);

  const endElement = clear && value ? (
    <CloseButton
      size="xs"
      onClick={() => {
        clear();
        inputRef.current?.focus();
      }}
      me="-2"
    />
  ) : undefined;

  useEffect(() => {
    console.log('customError: ', customError);
  }, [customError]);

  return (
    <Field.Root invalid={customError} {...restProps}>
      <Field.Label>
        {label}
        <Field.RequiredIndicator />
      </Field.Label>
      <InputGroup startElement={startElement} endElement={endElement}>
        <Input ref={inputRef} value={value} {...register} type={type} placeholder={placeholder} onChange={onChange} />
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