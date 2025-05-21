'use client';

import React, { useState } from 'react';
import { AuthenticatedLayout } from '@/components/layouts/AuthenticatedLayout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/modules/auth/auth.store';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement the actual update logic with API call
    // For now we'll just simulate a successful update
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: 'Actualizando perfil...',
      success: 'Perfil actualizado con éxito',
      error: 'Error al actualizar el perfil',
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) {
    return (
      <AuthenticatedLayout>
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p>Cargando información de usuario...</p>
          </CardContent>
        </Card>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mi Perfil</h1>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={isEditing ? formData.name : user.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={isEditing ? formData.email : user.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">Rol</Label>
                  <Input id="role" value={user.roles?.[0]?.name || 'Sin rol asignado'} disabled />
                </div>

                {user.roles?.[0]?.permissions?.length > 0 && (
                  <div className="grid gap-2">
                    <Label>Permisos</Label>
                    <div className="flex flex-wrap gap-2">
                      {user.roles[0].permissions.map((permission, index) => (
                        <div
                          key={index}
                          className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs"
                        >
                          {permission}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar cambios</Button>
                </div>
              )}
            </form>
          </CardContent>

          {!isEditing && (
            <CardFooter className="flex justify-end">
              <Button onClick={() => setIsEditing(true)}>Editar perfil</Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
