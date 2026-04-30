'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Trash2, Upload, Loader2, Globe, Star, MessageSquare, Home, Plus } from 'lucide-react'
import { Room, Review } from '@/types'
import { parseImages, parseAmenities } from '@/lib/parse'
import { parseLocalizedStringToForm, createLocalizedString, getLocalizedValue } from '@/lib/localize'
import { languages, Language } from '@/lib/i18n'
import { useToast } from '@/hooks/use-toast'

interface AdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isAdmin: boolean
  adminPassword: string
  setAdminPassword: (password: string) => void
  onLogin: () => void
  rooms: Room[]
  onRoomUpdate: (room: Room) => void
  onReviewsUpdate?: () => void
}

// Localized field state
interface LocalizedField {
  ru: string
  az: string
  en: string
}

// Tab type
type AdminTab = 'rooms' | 'reviews'

export function AdminDialog({ 
  open, 
  onOpenChange, 
  isAdmin, 
  adminPassword, 
  setAdminPassword, 
  onLogin,
  rooms,
  onRoomUpdate,
  onReviewsUpdate
}: AdminDialogProps) {
  const { toast } = useToast()
  
  // Tab state
  const [activeTab, setActiveTab] = useState<AdminTab>('rooms')
  
  // ===================== ROOMS STATE =====================
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  
  // Localized fields
  const [editName, setEditName] = useState<LocalizedField>({ ru: '', az: '', en: '' })
  const [editDescription, setEditDescription] = useState<LocalizedField>({ ru: '', az: '', en: '' })
  const [editConditions, setEditConditions] = useState<LocalizedField>({ ru: '', az: '', en: '' })
  const [editAdvantages, setEditAdvantages] = useState<LocalizedField>({ ru: '', az: '', en: '' })
  const [editAmenities, setEditAmenities] = useState<LocalizedField>({ ru: '', az: '', en: '' })
  
  // Non-localized fields (common for all languages)
  const [editPrice, setEditPrice] = useState(0)
  const [editCapacity, setEditCapacity] = useState(2)
  const [editImages, setEditImages] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // Current language tab
  const [editLang, setEditLang] = useState<Language>('ru')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileInputKey, setFileInputKey] = useState(0)

  // ===================== REVIEWS STATE =====================
  const [reviews, setReviews] = useState<Review[]>([])
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [editReviewName, setEditReviewName] = useState('')
  const [editReviewRating, setEditReviewRating] = useState(5)
  const [editReviewComment, setEditReviewComment] = useState('')
  const [savingReview, setSavingReview] = useState(false)
  const [loadingReviews, setLoadingReviews] = useState(false)

  const fetchReviews = async () => {
    setLoadingReviews(true)
    try {
      const res = await fetch('/api/reviews?all=true')
      const data = await res.json()
      setReviews(data.slice(0, 5)) // Max 5 reviews
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoadingReviews(false)
    }
  }

  // Load reviews when tab changes or dialog opens
  useEffect(() => {
    if (open && isAdmin && activeTab === 'reviews') {
      fetchReviews()
    }
  }, [open, isAdmin, activeTab])

  // Helper to update localized field
  const updateLocalizedField = (
    setter: (val: LocalizedField) => void,
    field: LocalizedField,
    lang: Language,
    value: string
  ) => {
    setter({ ...field, [lang]: value })
  }

  const startEditingRoom = (room: Room) => {
    setEditId(room.id)
    setEditName(parseLocalizedStringToForm(room.name))
    setEditPrice(room.price)
    setEditCapacity(room.capacity)
    setEditDescription(parseLocalizedStringToForm(room.description))
    setEditConditions(parseLocalizedStringToForm(room.conditions))
    setEditAdvantages(parseLocalizedStringToForm(room.advantages))
    setEditAmenities(parseLocalizedStringToForm(room.amenities))
    setEditImages(parseImages(room.images))
    setEditLang('ru')
  }
  
  const cancelEditing = () => {
    setEditId(null)
    setEditName({ ru: '', az: '', en: '' })
    setEditPrice(0)
    setEditCapacity(2)
    setEditDescription({ ru: '', az: '', en: '' })
    setEditConditions({ ru: '', az: '', en: '' })
    setEditAdvantages({ ru: '', az: '', en: '' })
    setEditAmenities({ ru: '', az: '', en: '' })
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
        toast({
          title: 'Ошибка',
          description: error.error || 'Ошибка при загрузке файла',
          variant: 'destructive'
        })
        return null
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Ошибка',
        description: 'Ошибка при загрузке файла',
        variant: 'destructive'
      })
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
    setSaving(true)
    
    // Parse advantages for each language (split by newline)
    const advantagesArr = {
      ru: editAdvantages.ru.split('\n').map(s => s.trim()).filter(Boolean),
      az: editAdvantages.az.split('\n').map(s => s.trim()).filter(Boolean),
      en: editAdvantages.en.split('\n').map(s => s.trim()).filter(Boolean),
    }
    
    // Parse amenities for each language (split by comma)
    const amenitiesArr = {
      ru: editAmenities.ru.split(',').map(s => s.trim()).filter(Boolean),
      az: editAmenities.az.split(',').map(s => s.trim()).filter(Boolean),
      en: editAmenities.en.split(',').map(s => s.trim()).filter(Boolean),
    }
    
    const roomData = {
      id: editId,
      name: createLocalizedString(editName.ru, editName.az, editName.en),
      price: editPrice,
      capacity: editCapacity,
      description: createLocalizedString(editDescription.ru, editDescription.az, editDescription.en),
      conditions: createLocalizedString(editConditions.ru, editConditions.az, editConditions.en),
      advantages: JSON.stringify(advantagesArr),
      amenities: JSON.stringify(amenitiesArr),
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
        toast({
          title: 'Сохранено',
          description: 'Данные успешно сохранены',
        })
      } else {
        const error = await res.json()
        toast({
          title: 'Ошибка',
          description: error.error || 'Не удалось сохранить',
          variant: 'destructive'
        })
      }
    } catch (err) {
      console.error('Save error:', err)
      toast({
        title: 'Ошибка',
        description: 'Ошибка при сохранении',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  // ===================== REVIEWS FUNCTIONS =====================
  
  const startEditingReview = (review: Review) => {
    setEditingReviewId(review.id)
    setEditReviewName(review.guestName)
    setEditReviewRating(review.rating)
    setEditReviewComment(review.comment)
  }

  const cancelEditingReview = () => {
    setEditingReviewId(null)
    setEditReviewName('')
    setEditReviewRating(5)
    setEditReviewComment('')
  }

  const saveReview = async () => {
    if (!editingReviewId) return
    setSavingReview(true)
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingReviewId,
          guestName: editReviewName,
          rating: editReviewRating,
          comment: editReviewComment,
          isApproved: true
        })
      })
      
      if (res.ok) {
        await fetchReviews()
        onReviewsUpdate?.()
        cancelEditingReview()
        toast({
          title: 'Сохранено',
          description: 'Отзыв успешно обновлен',
        })
      } else {
        const error = await res.json()
        toast({
          title: 'Ошибка',
          description: error.error || 'Не удалось сохранить',
          variant: 'destructive'
        })
      }
    } catch (err) {
      console.error('Save review error:', err)
      toast({
        title: 'Ошибка',
        description: 'Ошибка при сохранении',
        variant: 'destructive'
      })
    } finally {
      setSavingReview(false)
    }
  }

  const deleteReview = async (id: string) => {
    if (!confirm('Удалить этот отзыв?')) return
    
    try {
      const res = await fetch(`/api/reviews?id=${id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        await fetchReviews()
        onReviewsUpdate?.()
        toast({
          title: 'Удалено',
          description: 'Отзыв удален',
        })
      }
    } catch (err) {
      console.error('Delete review error:', err)
      toast({
        title: 'Ошибка',
        description: 'Ошибка при удалении',
        variant: 'destructive'
      })
    }
  }

  const addNewReview = async () => {
    setSavingReview(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: 'Новый гость',
          rating: 5,
          comment: 'Текст отзыва...',
          isApproved: true
        })
      })
      
      if (res.ok) {
        await fetchReviews()
        onReviewsUpdate?.()
        toast({
          title: 'Добавлено',
          description: 'Новый отзыв создан',
        })
      }
    } catch (err) {
      console.error('Add review error:', err)
      toast({
        title: 'Ошибка',
        description: 'Ошибка при добавлении',
        variant: 'destructive'
      })
    } finally {
      setSavingReview(false)
    }
  }

  // Language tab button style
  const langTabClass = (lang: Language) => `
    px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1
    ${editLang === lang 
      ? 'bg-primary text-white' 
      : 'bg-muted hover:bg-muted/80'
    }
  `

  // Main tab button style
  const mainTabClass = (tab: AdminTab) => `
    flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
    ${activeTab === tab 
      ? 'bg-primary text-white' 
      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
    }
  `

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
            <p className="text-xs text-muted-foreground">Введите пароль администратора</p>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Админ-панель</DialogTitle>
              <DialogDescription>Управление контентом сайта</DialogDescription>
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
            
            {/* Main Tabs */}
            <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('rooms')}
                className={mainTabClass('rooms')}
              >
                <Home className="w-4 h-4" />
                Домики
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={mainTabClass('reviews')}
              >
                <MessageSquare className="w-4 h-4" />
                Отзывы
              </button>
            </div>
            
            {/* ===================== ROOMS TAB ===================== */}
            {activeTab === 'rooms' && (
              <div className="space-y-6 py-4">
                {rooms.slice(0, 2).map((room) => {
                  const displayName = getLocalizedValue(room.name, 'ru', room.name)
                  
                  return (
                    <Card key={room.id} className="overflow-hidden">
                      {editId === room.id ? (
                        <CardContent className="p-4 space-y-4">
                          {/* Language Tabs */}
                          <div className="flex items-center gap-2 pb-2 border-b">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Язык:</span>
                            <div className="flex gap-1">
                              {languages.map(l => (
                                <button
                                  key={l.code}
                                  type="button"
                                  onClick={() => setEditLang(l.code)}
                                  className={langTabClass(l.code)}
                                >
                                  {l.flag} {l.code.toUpperCase()}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Name & Price */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-name">
                                Название 
                                <Badge variant="outline" className="ml-2 text-xs">{editLang.toUpperCase()}</Badge>
                              </Label>
                              <Input 
                                id="edit-name" 
                                value={editName[editLang]} 
                                onChange={(e) => updateLocalizedField(setEditName, editName, editLang, e.target.value)} 
                              />
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
                            <Label htmlFor="edit-description">
                              Описание
                              <Badge variant="outline" className="ml-2 text-xs">{editLang.toUpperCase()}</Badge>
                            </Label>
                            <Textarea 
                              id="edit-description" 
                              value={editDescription[editLang]} 
                              onChange={(e) => updateLocalizedField(setEditDescription, editDescription, editLang, e.target.value)} 
                              rows={3} 
                            />
                          </div>
                          
                          {/* Conditions */}
                          <div>
                            <Label htmlFor="edit-conditions">
                              Условия проживания
                              <Badge variant="outline" className="ml-2 text-xs">{editLang.toUpperCase()}</Badge>
                            </Label>
                            <Textarea 
                              id="edit-conditions" 
                              value={editConditions[editLang]} 
                              onChange={(e) => updateLocalizedField(setEditConditions, editConditions, editLang, e.target.value)} 
                              rows={4} 
                              placeholder="• Заезд: с 14:00&#10;• Выезд: до 12:00&#10;• Курение запрещено" 
                            />
                          </div>
                          
                          {/* Advantages */}
                          <div>
                            <Label htmlFor="edit-advantages">
                              Преимущества (каждое с новой строки)
                              <Badge variant="outline" className="ml-2 text-xs">{editLang.toUpperCase()}</Badge>
                            </Label>
                            <Textarea 
                              id="edit-advantages" 
                              value={editAdvantages[editLang]} 
                              onChange={(e) => updateLocalizedField(setEditAdvantages, editAdvantages, editLang, e.target.value)} 
                              rows={4}
                              placeholder="Красивый вид&#10;Тихое место&#10;Камин"
                            />
                          </div>
                          
                          {/* Amenities */}
                          <div>
                            <Label htmlFor="edit-amenities">
                              Удобства (через запятую)
                              <Badge variant="outline" className="ml-2 text-xs">{editLang.toUpperCase()}</Badge>
                            </Label>
                            <Input 
                              id="edit-amenities" 
                              value={editAmenities[editLang]} 
                              onChange={(e) => updateLocalizedField(setEditAmenities, editAmenities, editLang, e.target.value)} 
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
                                  <Image src={img} alt={`Фото ${i + 1}`} fill sizes="150px" className="object-cover" />
                                  <button
                                    onClick={() => removeImageFromEdit(i)}
                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
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
                            <Button onClick={saveRoomChanges} className="bg-primary hover:bg-primary/90" disabled={saving}>
                              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                              Сохранить
                            </Button>
                            <Button variant="outline" onClick={cancelEditing} disabled={saving}>
                              Отмена
                            </Button>
                          </div>
                        </CardContent>
                      ) : (
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{displayName}</h3>
                              <p className="text-sm text-muted-foreground">{room.price} AZN / ночь • до {room.capacity} гостей</p>
                            </div>
                            <Button onClick={() => startEditingRoom(room)}>Редактировать</Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </div>
            )}
            
            {/* ===================== REVIEWS TAB ===================== */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Максимум 5 отзывов для отображения на сайте
                  </p>
                  <Button 
                    onClick={addNewReview} 
                    disabled={loadingReviews || reviews.length >= 5}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить отзыв
                  </Button>
                </div>
                
                {loadingReviews ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <Card key={review.id} className="overflow-hidden">
                        {editingReviewId === review.id ? (
                          <CardContent className="p-4 space-y-4">
                            {/* Guest Name */}
                            <div>
                              <Label htmlFor="review-name">Имя гостя</Label>
                              <Input 
                                id="review-name" 
                                value={editReviewName} 
                                onChange={(e) => setEditReviewName(e.target.value)} 
                              />
                            </div>
                            
                            {/* Rating */}
                            <div>
                              <Label htmlFor="review-rating">Оценка</Label>
                              <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setEditReviewRating(star)}
                                    className="p-1"
                                  >
                                    <Star 
                                      className={`w-6 h-6 ${
                                        star <= editReviewRating 
                                          ? 'text-yellow-400 fill-yellow-400' 
                                          : 'text-muted-foreground'
                                      }`} 
                                    />
                                  </button>
                                ))}
                                <span className="text-sm text-muted-foreground ml-2">
                                  {editReviewRating}/5
                                </span>
                              </div>
                            </div>
                            
                            {/* Comment */}
                            <div>
                              <Label htmlFor="review-comment">Текст отзыва</Label>
                              <Textarea 
                                id="review-comment" 
                                value={editReviewComment} 
                                onChange={(e) => setEditReviewComment(e.target.value)} 
                                rows={3}
                              />
                            </div>
                            
                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button onClick={saveReview} className="bg-primary hover:bg-primary/90" disabled={savingReview}>
                                {savingReview ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Сохранить
                              </Button>
                              <Button variant="outline" onClick={cancelEditingReview} disabled={savingReview}>
                                Отмена
                              </Button>
                            </div>
                          </CardContent>
                        ) : (
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">{review.guestName}</span>
                                  <div className="flex">
                                    {Array.from({length: 5}, (_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${
                                          i < review.rating 
                                            ? 'text-yellow-400 fill-yellow-400' 
                                            : 'text-muted-foreground'
                                        }`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button size="sm" variant="outline" onClick={() => startEditingReview(review)}>
                                  Изменить
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => deleteReview(review.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                    
                    {reviews.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Нет отзывов</p>
                        <p className="text-sm">Нажмите "Добавить отзыв" чтобы создать</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
