import { useState } from 'react';
import {
  Button,
  Box,
  Text,
  Dialog,
  CloseButton,
  Portal,
} from '@chakra-ui/react';
import StarRating from './StarComponent';
import ApiService from '../services/ApiService';
import { toaster } from './ui/toaster';

const AvaliacaoModal = ({ isOpen, onClose, monitoriaId }) => {
  const [rating, setRating] = useState(0);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

   const handleCancel = () => {
    setRating(0);
    onClose();
  };


  const handleSubmit = async () => {
    const apiService = new ApiService();
    const response = await apiService.avaliar(monitoriaId, rating);
    toaster.create({
      type: response.success ? "success" : "error",
      description: response.success ? "Avaliação feita com sucesso!" : response.message || "Erro ao fazer avaliação",
    });
    
    handleCancel();
  };

  return (
    <Dialog.Root open={isOpen} onClose={onClose} >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Avaliar Monitoria</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Text mb={4}>
                Como foi sua experiência durante a monitoria?
              </Text>
              <Box>
                <StarRating
                  maxStars={5}
                  initialRating={0}
                  onRatingChange={handleRatingChange}
                  size="32px"
                  readonly={false}
                />
              </Box>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" colorScheme="gray" onClick={handleCancel}>
                  Cancelar
                </Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette="blue" 
                onClick={handleSubmit}
                disabled={rating === 0}
                minW="140px"
              >
                Enviar Avaliação
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild onClick={handleCancel}>
              <CloseButton size="sm" position="absolute" top="4" right="4" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AvaliacaoModal;
