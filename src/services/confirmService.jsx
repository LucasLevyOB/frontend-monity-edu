import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import { Provider as ChakraProvider } from '../components/ui/provider.jsx';

let resolveCallback;
let root;

function ConfirmDialog({ options }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        close(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const close = (result) => {
    setIsOpen(false);
    resolveCallback(result);
    setTimeout(() => {
      if (root) {
        root.unmount();
      }
    }, 300);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ChakraProvider>
      <div style={styles.overlay}>
        <VStack style={styles.dialog} gap={4}>
          <Text fontSize="2xl">{options.title || "Confirmação"}</Text>
          <Text fontSize="md">{options.message || "Tem certeza?"}</Text>
          <HStack spacing={4} justifyContent="right" w="100%">
            <Button onClick={() => close(false)} variant="outline" style={styles.cancel}>
              {options.cancelText || "Cancelar"}
            </Button>
            <Button onClick={() => close(true)} colorPalette={options.confirmColor || 'blue'} style={styles.confirm}>
              {options.confirmText || "Confirmar"}
            </Button>
          </HStack>
        </VStack>
      </div>
    </ChakraProvider>,
    document.getElementById("confirm-root")
  );
}

export function confirm(options) {
  const modalRoot = document.getElementById("confirm-root");
  if (!modalRoot) {
    const div = document.createElement("div");
    div.id = "confirm-root";
    document.body.appendChild(div);
  }

  const container = document.getElementById("confirm-root");
  root = createRoot(container);

  return new Promise((resolve) => {
    resolveCallback = resolve;
    root.render(<ConfirmDialog options={options} />);
  });
}

// Estilos inline simples
const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw", height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
  },
  dialog: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
};
