import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useInsuranceBenefits } from '../useInsurances';
import { CreateInsuranceBenefitDto, UpdateInsuranceBenefitDto } from '../insurances.interfaces';

const formSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  additionalCost: z.coerce.number().min(0, 'El costo adicional debe ser un número positivo'),
});

type FormValues = z.infer<typeof formSchema>;

interface BenefitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  insuranceId: string;
  benefit?: any;
  mode: 'create' | 'edit';
}

export const BenefitFormModal: React.FC<BenefitFormModalProps> = ({
  isOpen,
  onClose,
  insuranceId,
  benefit = null,
  mode = 'create',
}) => {
  const { createBenefit, updateBenefit, isCreating, isUpdating } =
    useInsuranceBenefits(insuranceId);
  const isProcessing = isCreating || isUpdating;

  const [formData, setFormData] = useState<FormValues>({
    name: '',
    description: '',
    additionalCost: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && benefit && isOpen) {
      setFormData({
        name: benefit.name,
        description: benefit.description,
        additionalCost: benefit.additionalCost,
      });
    }
  }, [benefit, isOpen, mode]);

  const resetForm = () => {
    if (mode === 'edit' && benefit) {
      setFormData({
        name: benefit.name,
        description: benefit.description,
        additionalCost: benefit.additionalCost,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        additionalCost: 0,
      });
    }
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? Number(value) : 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      formSchema.parse(formData);
      setErrors({});

      if (mode === 'create') {
        createBenefit(formData as CreateInsuranceBenefitDto, {
          onSuccess: () => {
            resetForm();
            onClose();
          },
        });
      } else if (mode === 'edit' && benefit) {
        const updateDto: UpdateInsuranceBenefitDto = {};

        if (formData.name !== benefit.name) updateDto.name = formData.name;
        if (formData.description !== benefit.description)
          updateDto.description = formData.description;
        if (formData.additionalCost !== benefit.additionalCost)
          updateDto.additionalCost = formData.additionalCost;

        if (Object.keys(updateDto).length === 0) {
          toast.info('No se detectaron cambios');
          onClose();
          return;
        }

        updateBenefit(benefit.id, updateDto, {
          onSuccess: () => {
            resetForm();
            onClose();
          },
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path.length > 0) {
            fieldErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(fieldErrors);
        toast.error('Por favor, corrija los errores en el formulario');
      } else {
        console.error('Error inesperado:', err);
        toast.error('Ha ocurrido un error inesperado');
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
      modal={true}
    >
      <DialogContent className="sm:max-w-[600px] pointer-events-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Crear Beneficio' : 'Editar Beneficio'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Añadir un nuevo beneficio al plan'
              : 'Actualizar la información del beneficio'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Nombre del Beneficio</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Asistencia Médica 24/7"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Servicio de asistencia médica disponible las 24 horas..."
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="additionalCost">Costo Adicional (USD)</Label>
            <Input
              id="additionalCost"
              name="additionalCost"
              type="number"
              min="0"
              step="0.01"
              value={formData.additionalCost || ''}
              onChange={handleChange}
              placeholder="25"
              className={errors.additionalCost ? 'border-red-500' : ''}
            />
            {errors.additionalCost && (
              <p className="text-destructive text-sm">{errors.additionalCost}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing
                ? 'Guardando...'
                : mode === 'create'
                  ? 'Guardar Beneficio'
                  : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
