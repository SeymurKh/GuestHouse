'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Trash2, Upload, Loader2 } from 'lucide-react'
import { Room } from '@/types'
import { parseImages, parseAmenities, parseAdvantages } from '@/lib/parse'

interface AdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isAdmin: boolean
  adminPassword: string
  setAdminPassword: (password: string) => void
  onLogin: () => void
  rooms: Room[]
  onRoomUpdate: (room: Room) => void
}

export function AdminDialog({ 
  open, 
  onOpenChange, 
  isAdmin, 
  adminPassword, 
  setAdminPassword, 
  onLogin,
  rooms,
  onRoomUpdate
}: AdminDialogProps) {
  // Edit state
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState(0)
  const [editCapacity, setEditCapacity] = useState(2)
  const [editDescription, setEditDescription] = useState('')
  const [editConditions, setEditConditions] = useState('')
  const [editAdvantagesText, setEditAdvantagesText] = useState('')
  const [editAmenitiesText, setEditAmenitiesText] = useState('')
  const [editImages, setEditImages] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileInputKey, setFileInputKey] = useState(0)

  const startEditingRoom = (room: Room) => {
    setEditId(room.id)
    setEditName(room.name)
    setEditPrice(room.price)
    setEditCapacity(room.capacity)
    setEditDescription(room.description)
    setEditConditions(room.conditions || '')
    setEditAdvantagesText(parseAdvantages(room.advantages).join('\n'))
    setEditAmenitiesText(parseAmenities(room.amenities).join(', '))
    setEditImages(parseImages(room.images))
  }
  
  const cancelEditing = () => {
    setEditId(null)
    setEditName('')
    setEditPrice(0)
    setEditCapacity(2)
    setEditDescription('')
    setEditConditions('')
    setEditAdvantagesText('')
    setEditAmenitiesText('')
    setEditImages([])
  }

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (res.ok) {
        const data = await res.json()
        return data.url
      } else {
        const error = await res.json()
        alert(error.error || 'Ошибка при загрузке')
        return null
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Ошибка при загрузке файла')
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const deleteFile = async (imageUrl: string): Promise<boolean> => {
    if (!imageUrl.startsWith('/uploads/')) {
      return true
    }
    
    try {
      const res = await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE'
      })
      return res.ok
    } catch (error) {
      console.error('Delete error:', error)
      return false
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !editId) return
    
    const file = files[0]
    const url = await uploadFile(file)
    if (url) {
      setEditImages(prev => [...prev, url])
    }
    
    setFileInputKey(prev => prev + 1)
  }

  const triggerFileInput = () => {
    setTimeout(() => {
      fileInputRef.current?.click()
    }, 0)
  }

  const removeImageFromEdit = async (index: number) => {
    const imageToDelete = editImages[index]
    await deleteFile(imageToDelete)
    setEditImages(prev => prev.filter((_, i) => i !== index))
  }

  const saveRoomChanges = async () => {
    if (!editId) return
    
    const advantages = editAdvantagesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
    
    const amenities = editAmenitiesText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    
    const roomData = {
      id: editId,
      name: editName,
      price: editPrice,
      capacity: editCapacity,
      description: editDescription,
      conditions: editConditions,
      advantages: JSON.stringify(advantages),
      amenities: JSON.stringify(amenities),
      images: JSON.stringify(editImages)
    }
    
    try {
      const res = await fetch('/api/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
      })
      if (res.ok) {
        const updated = await res.json()
        onRoomUpdate(updated)
        cancelEditing()
        alert('Сохранено успешно!')
      } else {
        const error = await res.json()
        alert('Ошибка: ' + (error.error || 'Не удалось сохранить'))
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('Ошибка при сохранении')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        {!isAdmin ? (
          <>
            <DialogHeader>
              <DialogTitle>Админ-панель</DialogTitle>
              <DialogDescription>Введите пароль для доступа</DialogDescription>
            </DialogHeader>
            <div className="flex gap-2">
              <Input 
                type="password" 
                placeholder="Пароль" 
                value={adminPassword} 
                onChange={(e) => setAdminPassword(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && onLogin()} 
              />
              <Button onClick={onLogin}>Войти</Button>
            </div>
            <p className="text-xs text-muted-foreground">Демо пароль: admin123</p>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Управление домиками</DialogTitle>
              <DialogDescription>Редактирование информации (только 2 домика)</DialogDescription>
            </DialogHeader>
            
            {/* Hidden file input */}
            <input
              key={fileInputKey}
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />
            
            <div className="space-y-6 py-4">
              {rooms.slice(0, 2).map((room) => (
                <Card key={room.id} className="overflow-hidden">
                  {editId === room.id ? (
                    <CardContent className="p-4 space-y-4">
                      {/* Name & Price */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-name">Название</Label>
                          <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="edit-price">Цена (AZN)</Label>
                          <Input id="edit-price" type="number" value={editPrice} onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)} />
                        </div>
                      </div>
                      
                      {/* Capacity */}
                      <div>
                        <Label htmlFor="edit-capacity">Вместимость (гостей)</Label>
                        <Input id="edit-capacity" type="number" value={editCapacity} onChange={(e) => setEditCapacity(parseInt(e.target.value) || 1)} />
                      </div>
                      
                      {/* Description */}
                      <div>
                        <Label htmlFor="edit-description">Описание</Label>
                        <Textarea id="edit-description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} />
                      </div>
                      
                      {/* Conditions */}
                      <div>
                        <Label htmlFor="edit-conditions">Условия проживания</Label>
                        <Textarea 
                          id="edit-conditions" 
                          value={editConditions} 
                          onChange={(e) => setEditConditions(e.target.value)} 
                          rows={4} 
                          placeholder="• Заезд: с 14:00&#10;• Выезд: до 12:00&#10;• Курение запрещено" 
                        />
                      </div>
                      
                      {/* Advantages */}
                      <div>
                        <Label htmlFor="edit-advantages">Преимущества (каждое с новой строки)</Label>
                        <Textarea 
                          id="edit-advantages" 
                          value={editAdvantagesText} 
                          onChange={(e) => setEditAdvantagesText(e.target.value)} 
                          rows={4}
                          placeholder="Красивый вид&#10;Тихое место&#10;Камин"
                        />
                      </div>
                      
                      {/* Amenities */}
                      <div>
                        <Label htmlFor="edit-amenities">Удобства (через запятую)</Label>
                        <Input 
                          id="edit-amenities" 
                          value={editAmenitiesText} 
                          onChange={(e) => setEditAmenitiesText(e.target.value)} 
                          placeholder="Wi-Fi, Камин, ТВ, Кухня"
                        />
                      </div>
                      
                      {/* Images */}
                      <div>
                        <Label className="flex items-center gap-2 mb-2">
                          Изображения
                          <Badge variant="secondary">{editImages.length}</Badge>
                        </Label>
                        
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {editImages.map((img: string, i: number) => (
                            <div key={i} className="relative group aspect-video rounded overflow-hidden border bg-muted">
                              <img src={img} alt={`Фото ${i + 1}`} className="w-full h-full object-cover" />
                              <button
                                onClick={() => removeImageFromEdit(i)}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <Button variant="outline" onClick={triggerFileInput} disabled={uploadingImage}>
                          {uploadingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                          Добавить фото
                        </Button>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button onClick={saveRoomChanges} className="bg-primary hover:bg-primary/90">
                          Сохранить
                        </Button>
                        <Button variant="outline" onClick={cancelEditing}>
                          Отмена
                        </Button>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{room.name}</h3>
                          <p className="text-sm text-muted-foreground">{room.price} AZN / ночь • до {room.capacity} гостей</p>
                        </div>
                        <Button onClick={() => startEditingRoom(room)}>Редактировать</Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
