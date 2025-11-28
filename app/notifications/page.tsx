'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Bell } from 'lucide-react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

interface Notification {
  id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  link_to: string | null;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching notifications:', error);
        } else {
          setNotifications(data || []);
        }
      }
      setLoading(false);
    };

    fetchUserAndNotifications();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-secondary-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href={user ? '/citoyen' : '/'} className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-secondary-600" />
            </Link>
            <h1 className="text-xl font-semibold text-secondary-900">Mes Notifications</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <p className="text-center text-secondary-500">Chargement des notifications...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-800">Aucune notification pour le moment</h2>
            <p className="text-secondary-500 mt-2">Vos notifications apparaîtront ici dès qu'il y aura du nouveau.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-5 rounded-lg border-l-4 ${notif.is_read ? 'bg-white border-secondary-200' : 'bg-primary-50 border-primary-500'}`}>
                <div className="flex justify-between items-start">
                    <p className="text-secondary-700 pr-4">{notif.message}</p>
                    {!notif.is_read && <div className="w-3 h-3 bg-primary-500 rounded-full flex-shrink-0 mt-1.5"></div>}
                </div>
                <p className="text-xs text-secondary-400 mt-2">
                  {new Date(notif.created_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                </p>
                {notif.link_to && (
                  <Link href={notif.link_to} className="text-sm text-primary-600 hover:underline mt-3 inline-block">
                    Voir les détails
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
