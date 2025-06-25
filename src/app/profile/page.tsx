'use client'

import React, { useState } from 'react'
import { AuthenticatedLayout } from '@/components/layouts/AuthenticatedLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { RoleType, BloodType } from '../../modules/auth/auth.interfaces'
import { Badge } from '@/components/ui/badge'
import {
  IconEdit,
  IconPhone,
  IconMapPin,
  IconHeartbeat,
  IconEmergencyBed,
  IconUser,
  IconMail,
  IconCalendar,
  IconBlender,
  IconDroplet,
  IconRuler,
  IconWeight,
} from '@tabler/icons-react'
import { useAuthService } from '../../modules/auth/useAuth'

export default function ProfilePage() {
  const { user, updateOnboarding } = useAuthService()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    birthDate: user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
    gender: user?.gender || '',
    bloodType: user?.bloodType || '',
    height: user?.height?.toString() || '',
    weight: user?.weight?.toString() || '',
    emergencyContact: user?.emergencyContact || '',
    emergencyPhone: user?.emergencyPhone || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...formData,
      birthDate: new Date(formData.birthDate),
      bloodType: formData.bloodType as BloodType,
      height: Number(formData.height) || 0,
      weight: Number(formData.weight) || 0,
    }
    updateOnboarding(data)
    setIsEditing(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  if (!user) {
    return (
      <AuthenticatedLayout>
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p>Cargando información de usuario...</p>
          </CardContent>
        </Card>
      </AuthenticatedLayout>
    )
  }

  const isClient = (user.role?.name as RoleType) === RoleType.CLIENT

  return (
    <AuthenticatedLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Mi Perfil
          </h1>
          {isClient && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSubmit} className="gap-2">
                    Guardar cambios
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="gap-2">
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                  <IconEdit size={16} />
                  Editar perfil
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
              <CardHeader className="text-center pb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-xl" />
                  <Avatar className="mx-auto h-32 w-32 relative z-10 border-4 border-background">
                    <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-6 space-y-2">
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <p className="text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-2 text-sm px-4 py-1">
                    {user.role?.name}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {isClient && (
              <Card className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <IconEmergencyBed className="text-primary" size={20} />
                    Contacto de Emergencia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Nombre del contacto</Label>
                      <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                        <IconUser size={16} className="text-primary" />
                        <span>{user.emergencyContact || 'No especificado'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Teléfono de emergencia</Label>
                      <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                        <IconPhone size={16} className="text-primary" />
                        <span>{user.emergencyPhone || 'No especificado'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {isClient ? (
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconUser className="text-primary" size={20} />
                      Información Personal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Nombre completo</Label>
                        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                          <IconUser size={16} className="text-primary" />
                          {isEditing ? (
                            <Input
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="border-0 p-0 h-auto bg-transparent"
                            />
                          ) : (
                            <span>{user.name}</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Correo electrónico</Label>
                        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                          <IconMail size={16} className="text-primary" />
                          {isEditing ? (
                            <Input
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="border-0 p-0 h-auto bg-transparent"
                            />
                          ) : (
                            <span>{user.email}</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Teléfono</Label>
                        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                          <IconPhone size={16} className="text-primary" />
                          {isEditing ? (
                            <Input
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              className="border-0 p-0 h-auto bg-transparent"
                            />
                          ) : (
                            <span>{user.phoneNumber || 'No especificado'}</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Dirección</Label>
                        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                          <IconMapPin size={16} className="text-primary" />
                          {isEditing ? (
                            <Input
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              className="border-0 p-0 h-auto bg-transparent"
                            />
                          ) : (
                            <span>{user.address || 'No especificada'}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconHeartbeat className="text-primary" size={20} />
                      Información de Salud
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Fecha de nacimiento</Label>
                        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                          <IconCalendar size={16} className="text-primary" />
                          {isEditing ? (
                            <Input
                              type="date"
                              name="birthDate"
                              value={formData.birthDate}
                              onChange={handleChange}
                              className="border-0 p-0 h-auto bg-transparent"
                            />
                          ) : (
                            <span>
                              {user.birthDate
                                ? new Date(user.birthDate).toLocaleDateString()
                                : 'No especificada'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Género</Label>
                        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                          <IconBlender size={16} className="text-primary" />
                          {isEditing ? (
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={(e) => handleSelectChange('gender', e.target.value)}
                              className="border-0 p-0 h-auto bg-transparent w-full"
                            >
                              <option value="">Seleccionar género</option>
                              <option value="Masculino">Masculino</option>
                              <option value="Femenino">Femenino</option>
                              <option value="Otro">Otro</option>
                            </select>
                          ) : (
                            <span>{user.gender || 'No especificado'}</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Tipo de sangre</Label>
                        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                          <IconDroplet size={16} className="text-primary" />
                          {isEditing ? (
                            <select
                              name="bloodType"
                              value={formData.bloodType}
                              onChange={(e) => handleSelectChange('bloodType', e.target.value)}
                              className="border-0 p-0 h-auto bg-transparent w-full"
                            >
                              <option value="">Seleccionar tipo de sangre</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                            </select>
                          ) : (
                            <span>{user.bloodType || 'No especificado'}</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Altura</Label>
                        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                          <IconRuler size={16} className="text-primary" />
                          {isEditing ? (
                            <Input
                              type="number"
                              name="height"
                              value={formData.height}
                              onChange={handleChange}
                              className="border-0 p-0 h-auto bg-transparent"
                              placeholder="cm"
                            />
                          ) : (
                            <span>{user.height ? `${user.height} cm` : 'No especificada'}</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Peso</Label>
                        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                          <IconWeight size={16} className="text-primary" />
                          {isEditing ? (
                            <Input
                              type="number"
                              name="weight"
                              value={formData.weight}
                              onChange={handleChange}
                              className="border-0 p-0 h-auto bg-transparent"
                              placeholder="kg"
                            />
                          ) : (
                            <span>{user.weight ? `${user.weight} kg` : 'No especificado'}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input id="name" value={user.name} disabled className="bg-card" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                        className="bg-card"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="role">Rol</Label>
                      <Input id="role" value={user.role?.name} disabled className="bg-card" />
                    </div>

                    {user.role?.permissions.length > 0 && (
                      <div className="grid gap-2">
                        <Label>Permisos</Label>
                        <div className="flex flex-wrap gap-2">
                          {user.role?.permissions.map((permission, index) => (
                            <Badge key={index} variant="secondary" className="bg-primary/10">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
