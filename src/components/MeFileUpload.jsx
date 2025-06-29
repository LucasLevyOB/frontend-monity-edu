import { Button, FileUpload, Text } from "@chakra-ui/react";
import { MdUpload } from "react-icons/md";

const MeFileUpload = ({ register, customError, label, ...restProps }) => {
  return (
    <FileUpload.Root accept={["application/pdf"]} invalid={!!customError} {...restProps}>
      <FileUpload.HiddenInput {...register} />
      <FileUpload.Label>
        {label}
      </FileUpload.Label>
      <FileUpload.Trigger asChild>
        <Button variant="outline" size="sm">
          <MdUpload /> Anexar Arquivo
        </Button>
      </FileUpload.Trigger>
      {customError && <Text textStyle="xs" fontWeight="medium" color="var(--chakra-colors-fg-error)">{customError}</Text>}
      <FileUpload.List />
    </FileUpload.Root>
  );
};

export default MeFileUpload;