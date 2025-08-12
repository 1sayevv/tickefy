export interface TicketHistory {
  id: string
  action: string
  status: string
  timestamp: string
  user: string
  comment?: string
}

export interface TicketMessage {
  id: string
  sender: string
  senderType: 'customer' | 'customer_manager' | 'admin'
  content: string
  timestamp: string
  attachments?: string[]
  isInternal?: boolean // For internal notes
}

export interface Ticket {
  id: string
  title: string
  description: string
  company: "Nike" | "Adidas"
  status: "open" | "in progress" | "done"
  image: string
  createdAt: string
  user_email: string
  history?: TicketHistory[]
  messages?: TicketMessage[] // New field for conversation messages
  isDeactivated?: boolean // New field to track if ticket is deactivated
}

// Глобальный массив тикетов
let mockTickets: Ticket[] = [
  // Nike tickets (7 тикетов)
  {
    id: "1",
    title: "Update main page design",
    description: "Need to update the main page design of the Nike website taking into account new branding requirements and improve user experience",
    company: "Nike",
    status: "in progress",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=1",
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), // 13 days ago
    user_email: "user1",
    history: [
      {
        id: "1-1",
        action: "created",
        status: "open",
        timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        user: "user1",
        comment: "Initial ticket creation"
      },
      {
        id: "1-2",
        action: "status_changed",
        status: "in progress",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        user: "admin",
        comment: "Started working on design updates"
      }
    ],
    messages: [
      {
        id: "msg-1-1",
        sender: "ahmet can demirbaş",
        senderType: "customer",
        content: "memnun kalmadım iade hakkımı kullanmak istiyorum",
        timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: ["gzhost.PNG"]
      },
      {
        id: "msg-1-2",
        sender: "Melih A",
        senderType: "customer_manager",
        content: "Merhaba, Ücretsiz hosting peketinizin kullanım amacı yalnızca alan adı bilgilerinizi barındırmasıdır, kartvizit gibi de düşünebilirsiniz. Alan adı iadesinde 2.5($)+KDV kesintisi olmaktadır\n\nİyi Çalışmalar\nMelih A\nLevel I Support Operator\nwww.guzel.net.tr",
        timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000 + 9 * 60 * 1000).toISOString()
      },
      {
        id: "msg-1-3",
        sender: "ahmet can demirbaş",
        senderType: "customer",
        content: "şakamı yapryonuz 2.5 dolar diyonuz birde kdv adigımı fiyat okadar degil iyi yapmayın iade iade sözleşmenize uymadıgınız için gün içinde avukata veriyorum iyi günler sözleşmenize açıkca var uymuyorsunuz sorun yok kat kat fazlasını alırım",
        timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000 + 13 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: "2",
    title: "Fix shopping cart bug",
    description: "Users cannot add items to cart on mobile devices. Urgent fix needed to improve conversion",
    company: "Nike",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=2",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    user_email: "user1",
    messages: [
      {
        id: "msg-2-1",
        sender: "Ahmet Yılmaz",
        senderType: "customer",
        content: "Merhaba, mobil cihazlarda sepet işlevi çalışmıyor. Kullanıcılar ürün ekleyemiyor. Bu çok acil bir sorun.",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: ["cart-error.png"]
      },
      {
        id: "msg-2-2",
        sender: "Ayşe Kaya",
        senderType: "customer_manager",
        content: "Merhaba Ahmet Bey,\n\nSorununuzu anlıyorum. Mobil sepet sorunu için teknik ekibimizi bilgilendirdim. Bu sorunu öncelikli olarak ele alacağız.\n\nŞu anda hangi mobil cihaz ve tarayıcı kullanıyorsunuz? Bu bilgi sorunu çözmemize yardımcı olacaktır.\n\nİyi çalışmalar,\nAyşe Kaya\nNike Teknik Destek",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "msg-2-3",
        sender: "Ahmet Yılmaz",
        senderType: "customer",
        content: "iPhone 14 ve Safari kullanıyorum. Sorun sadece mobilde oluyor, masaüstünde normal çalışıyor.",
        timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: "3",
    title: "Optimize image loading",
    description: "Need to optimize product image loading to improve site performance and speed up page loading",
    company: "Nike",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=3",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    user_email: "user1",
    history: [
      {
        id: "3-1",
        action: "created",
        status: "open",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        user: "user1",
        comment: "Performance optimization needed"
      },
      {
        id: "3-2",
        action: "status_changed",
        status: "in progress",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        user: "admin",
        comment: "Started image optimization implementation"
      },
      {
        id: "3-3",
        action: "status_changed",
        status: "done",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        user: "admin",
        comment: "Image optimization completed successfully"
      }
    ],
    messages: [
      {
        id: "msg-3-1",
        sender: "Mehmet Demir",
        senderType: "customer",
        content: "Sayfa yükleme hızı çok yavaş. Ürün resimleri çok geç yükleniyor. Bu satışları etkiliyor.",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "msg-3-2",
        sender: "Fatma Özkan",
        senderType: "customer_manager",
        content: "Merhaba Mehmet Bey,\n\nPerformans sorununuzu anlıyorum. Görsel optimizasyonu için çalışmaya başladık. Bu işlem 2-3 gün sürecek.\n\nİyi çalışmalar,\nFatma Özkan\nNike Teknik Destek",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "msg-3-3",
        sender: "Mehmet Demir",
        senderType: "customer",
        content: "Teşekkürler, hızlandırma için ne yapabiliriz?",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "msg-3-4",
        sender: "Fatma Özkan",
        senderType: "customer_manager",
        content: "Görsel sıkıştırma ve lazy loading uyguluyoruz. %60 hız artışı bekliyoruz.",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "msg-3-5",
        sender: "Mehmet Demir",
        senderType: "customer",
        content: "Mükemmel! Çok teşekkürler.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: "4",
    title: "Add new product categories",
    description: "Need to add new product categories to catalog and configure filtering to improve user navigation",
    company: "Nike",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=4",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    user_email: "user1"
  },
  {
    id: "5",
    title: "Integrate loyalty system",
    description: "Development of bonus points and discount system for regular customers with integration into personal account",
    company: "Nike",
    status: "in progress",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=5",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    user_email: "user1"
  },
  {
    id: "6",
    title: "Create review system",
    description: "Implementation of product review and rating system with moderation and spam filtering",
    company: "Nike",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=6",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    user_email: "user1"
  },
  {
    id: "7",
    title: "Improve product search",
    description: "Adding smart search with autocomplete, filters by size, color and price for customer convenience",
    company: "Nike",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=7",
    createdAt: new Date().toISOString(), // Today
    user_email: "user1"
  },
  // Adidas tickets (7 тикетов)
  {
    id: "8",
    title: "Integrate payment system",
    description: "Need to integrate new payment system for order processing and improve transaction security",
    company: "Adidas",
    status: "in progress",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=8",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    user_email: "user2",
    messages: [
      {
        id: "msg-8-1",
        sender: "Zeynep Arslan",
        senderType: "customer",
        content: "Ödeme sistemi entegrasyonu için yardım istiyorum. Hangi ödeme yöntemlerini destekleyeceğiz?",
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "msg-8-2",
        sender: "Can Yıldız",
        senderType: "customer_manager",
        content: "Merhaba Zeynep Hanım,\n\nÖdeme sistemi entegrasyonu için size yardımcı olacağım. Şu anda şu yöntemleri destekliyoruz:\n\n• Kredi Kartı (Visa, MasterCard)\n• PayPal\n• Banka Transferi\n• Kapıda Ödeme\n\nHangi ek yöntemler eklemek istiyorsunuz?\n\nİyi çalışmalar,\nCan Yıldız\nAdidas Teknik Destek",
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "msg-8-3",
        sender: "Zeynep Arslan",
        senderType: "customer",
        content: "Apple Pay ve Google Pay de ekleyebilir miyiz?",
        timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "msg-8-4",
        sender: "Can Yıldız",
        senderType: "customer_manager",
        content: "Evet, kesinlikle! Apple Pay ve Google Pay entegrasyonu için çalışmaya başladık. 1 hafta içinde tamamlanacak.",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: "9",
    title: "Create mobile application",
    description: "Development of mobile application for iOS and Android with full e-commerce functionality",
    company: "Adidas",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=9",
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
    user_email: "user2",
    messages: [
      {
        id: "msg-9-1",
        sender: "Burak Kaya",
        senderType: "customer",
        content: "Mobil uygulama geliştirme projesi için başvuru yapıyorum. iOS ve Android için tam e-ticaret özellikli uygulama istiyoruz.",
        timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: ["app-requirements.pdf", "design-mockups.zip"]
      },
      {
        id: "msg-9-2",
        sender: "Elif Demir",
        senderType: "customer_manager",
        content: "Merhaba Burak Bey,\n\nMobil uygulama projeniz için teşekkürler. Gereksinimlerinizi inceledim. Proje süreci şu şekilde olacak:\n\n1. Analiz ve Planlama (1 hafta)\n2. UI/UX Tasarım (2 hafta)\n3. Geliştirme (6-8 hafta)\n4. Test ve Yayın (2 hafta)\n\nToplam süre: 11-13 hafta\n\nDetaylı teklif hazırlayıp size göndereceğim.\n\nİyi çalışmalar,\nElif Demir\nAdidas Proje Yöneticisi",
        timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "msg-9-3",
        sender: "Burak Kaya",
        senderType: "customer",
        content: "Süre biraz uzun değil mi? Daha hızlı tamamlayabilir miyiz?",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "msg-9-4",
        sender: "Elif Demir",
        senderType: "customer_manager",
        content: "Hızlı geliştirme için ek ekip alabiliriz. 8-10 haftaya düşürebiliriz ama maliyet %20 artacak.",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: "10",
    title: "Update notification system",
    description: "Improving email notification system for customers with personalized content and automation",
    company: "Adidas",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=10",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    user_email: "user2",
    messages: [
      {
        id: "msg-10-1",
        sender: "Selin Özkan",
        senderType: "customer",
        content: "E-posta bildirimleri çok genel. Müşterilere özel içerik gönderebiliyor muyuz?",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "msg-10-2",
        sender: "Mert Yılmaz",
        senderType: "customer_manager",
        content: "Merhaba Selin Hanım,\n\nEvet, kişiselleştirilmiş bildirim sistemi geliştiriyoruz. Müşteri alışveriş geçmişine göre özel içerik gönderebileceğiz.\n\nÖzellikler:\n• Kişiselleştirilmiş ürün önerileri\n• Doğum günü tebrikleri\n• Özel kampanya bildirimleri\n• Sipariş durumu güncellemeleri\n\nİyi çalışmalar,\nMert Yılmaz\nAdidas Müşteri Deneyimi",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "msg-10-3",
        sender: "Selin Özkan",
        senderType: "customer",
        content: "Harika! Ne zaman aktif olacak?",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "msg-10-4",
        sender: "Mert Yılmaz",
        senderType: "customer_manager",
        content: "Sistem hazır! Bugün aktif ediyoruz. Test e-postası göndereceğim.",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "msg-10-5",
        sender: "Selin Özkan",
        senderType: "customer",
        content: "Mükemmel! Çok teşekkürler.",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: "11",
    title: "Sales analytics",
    description: "Creating dashboard for sales analysis and reporting with CRM system integration",
    company: "Adidas",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=11",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    user_email: "user2"
  },
  {
    id: "12",
    title: "Warehouse management system",
    description: "Development of warehouse inventory system with automatic stock updates and low quantity notifications",
    company: "Adidas",
    status: "in progress",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=12",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    user_email: "user2"
  },
  {
    id: "13",
    title: "Social media integration",
    description: "Adding social media login capability and product sharing in social networks",
    company: "Adidas",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=13",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    user_email: "user2"
  },
  {
    id: "14",
    title: "Personal recommendation system",
    description: "Implementing machine learning algorithm for personal product recommendations based on purchase history",
    company: "Adidas",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=14",
    createdAt: new Date().toISOString(), // Today
    user_email: "user2"
  }
]

export const getTicketsByCompany = async (company: string): Promise<Ticket[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log(`Loading tickets for company: ${company}`)
  const filteredTickets = mockTickets.filter(ticket => ticket.company === company)
  console.log(`Found ${filteredTickets.length} tickets for ${company}`)
  return filteredTickets
}

export const getAllTickets = async (): Promise<Ticket[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log(`Loading all tickets: ${mockTickets.length} total`)
  return mockTickets
}

export const createTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt'>): Promise<Ticket> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  console.log('Creating ticket with data:', ticketData)
  
  const newTicket: Ticket = {
    id: String(mockTickets.length + 1),
    ...ticketData,
    createdAt: new Date().toISOString()
  }
  
  console.log('New ticket created:', newTicket)
  
  // Добавляем новый тикет в глобальный массив
  mockTickets.push(newTicket)
  
  console.log('New ticket created:', newTicket)
  console.log('Total tickets:', mockTickets.length)
  
  return newTicket
}

// Функция для получения текущего состояния тикетов (для отладки)
export const getCurrentTickets = () => {
  return mockTickets
} 