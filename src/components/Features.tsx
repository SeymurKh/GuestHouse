'use client'

import { Mountain, Trees, Heart, Utensils } from 'lucide-react'

const features = [
  { icon: Mountain, title: 'Горные виды', desc: 'Кавказские горы' },
  { icon: Trees, title: 'Лесная тишина', desc: 'Густые леса' },
  { icon: Heart, title: 'Уют', desc: 'Домашний комфорт' },
  { icon: Utensils, title: 'Кухня', desc: 'Национальная кухня' },
]

export function Features() {
  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((item, i) => (
            <div key={i} className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
