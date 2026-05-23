export type Language = 'en' | 'es';

export const translations = {
  en: {
    // Common
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      update: 'Update',
      search: 'Search',
      back: 'Back',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      send: 'Send',
      yes: 'Yes',
      no: 'No',
      loading: 'Loading...',
    },
    
    // Home Page
    home: {
      title: 'TERESARIDE',
      heroTitle: 'Your Adventure Starts Here',
      heroSubtitle: 'Premium transportation services to make your trip an unforgettable experience',
      reserveNow: 'Book Now',
      viewServices: 'View Services',
      rating: 'Rating 4.9/5',
      happyCustomers: '+10,000 Happy Customers',
      
      // Features
      guaranteedSecurity: 'Guaranteed Security',
      guaranteedSecurityDesc: 'Certified drivers and fully insured vehicles',
      availability247: '24/7 Availability',
      availability247Desc: 'Service available 24 hours, 7 days a week',
      bestService: 'Best Service',
      bestServiceDesc: 'Recognized as leader in tourist transportation',
      continuousSupport: 'Continuous Support',
      continuousSupportDesc: 'Customer service available at all times',
      
      // About Us
      aboutUs: 'About Us',
      aboutUsDesc: 'Blue Jay Taxi Transport is a leading company in tourist transportation services with over 15 years of experience in the market.',
      aboutUsPara1: 'We specialize in offering premium transportation experiences for tourists seeking comfort, safety and reliability on every trip.',
      aboutUsPara2: 'Our fleet of modern vehicles and our team of professional drivers are committed to making every journey a memorable experience.',
      yearsExperience: 'Years of Experience',
      premiumVehicles: 'Premium Vehicles',
      certifiedDrivers: 'Certified Drivers',
      satisfiedCustomers: 'Satisfied Customers',
      
      // Services
      services: 'Our Services',
      servicesDesc: 'We offer a wide range of transportation services for all your needs',
      vehicleRental: 'Vehicle Rental',
      vehicleRentalDesc: 'Wide selection of premium vehicles to rent by day or week. From compact cars to luxury vans.',
      modernVehicles: 'Modern and safe vehicles',
      competitivePrices: 'Competitive prices',
      insuranceIncluded: 'Insurance included',
      customTours: 'Custom Tours',
      customToursDesc: 'Guided excursions to the most incredible destinations. Experiences designed to create unforgettable memories.',
      expertGuides: 'Expert local guides',
      flexibleItineraries: 'Flexible itineraries',
      allInclusive: 'All inclusive',
      groupTransport: 'Group Transport',
      groupTransportDesc: 'Specialized service for large groups. Ideal for corporate events, weddings and family excursions.',
      luxuryVansBuses: 'Luxury vans and buses',
      capacityUp50: 'Capacity up to 50 people',
      professionalCoordination: 'Professional coordination',
      exploreServices: 'Explore All Services',
      
      // Testimonials
      testimonials: 'What Our Customers Say',
      testimonialsDesc: 'Thousands of tourists trust us',
      
      // Contact
      contact: 'Contact Us',
      contactDesc: "We're here to help you plan your next adventure",
      phone: 'Phone',
      phoneSchedule: 'Mon - Sun: 24/7',
      email: 'Email',
      emailResponse: 'Response in 24 hours',
      location: 'Location',
      mainAvenue: 'Main Avenue',
      
      // Footer
      allRightsReserved: 'All rights reserved',
      
      // Navigation
      home: 'Home',
      whoWeAre: 'Who We Are',
      contactUs: 'Contact Us',
    },
    
    // Login Page
    login: {
      title: 'Welcome to Blue Jay',
      subtitle: 'Log in or create an account to start your adventure',
      loginTab: 'Login',
      registerTab: 'Register',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      password: 'Password',
      passwordPlaceholder: '••••••••',
      fullName: 'Full Name',
      namePlaceholder: 'Your name',
      loginButton: 'Login',
      createAccount: 'Create Account',
      backToHome: 'Back to Home',
      
      // Errors
      emailRequired: 'Email is required',
      emailInvalid: 'Please enter a valid email',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 6 characters',
      nameRequired: 'Name is required',
      nameMinLength: 'Name must be at least 3 characters',
      
      // Success
      welcomeBack: 'Welcome back!',
      accountCreated: 'Account created successfully!',
      
      // Features
      luxuryVehicles: 'Luxury Vehicles',
      luxuryVehiclesDesc: 'Modern and comfortable fleet',
      uniqueDestinations: 'Unique Destinations',
      uniqueDestinationsDesc: 'Personalized tours for you',
      fiveStarService: '5 Star Service',
      fiveStarServiceDesc: 'Verified tourist reviews',
    },
    
    // Dashboard
    dashboard: {
      adminPanel: 'Admin Panel',
      vehicles: 'Vehicles',
      trips: 'Trips',
      myReservations: 'My Reservations',
      welcome: 'Welcome,',
      logout: 'Logout',
    },
    
    // Vehicle Catalog
    vehicles: {
      title: 'Vehicle Catalog',
      subtitle: 'Find the perfect vehicle for your adventure',
      perDay: 'per day',
      people: 'people',
      viewDetails: 'View Details',
      backToCatalog: 'Back to Catalog',
      capacity: 'Capacity',
      features: 'Features:',
      bookNow: 'Book Now',
    },
    
    // Trip Catalog
    trips: {
      title: 'Trip Catalog',
      subtitle: 'Discover unique and unforgettable experiences',
      perPerson: 'per person',
      viewDetails: 'View Details',
      backToCatalog: 'Back to Catalog',
      duration: 'Duration',
      tripIncludes: 'The trip includes:',
      bookNow: 'Book Now',
    },
    
    // Reservations
    reservations: {
      title: 'My Reservations',
      subtitle: 'Manage all your reservations in one place',
      noReservations: 'You have no reservations yet',
      noReservationsDesc: 'Explore our vehicle and trip catalog to start your adventure',
      vehicle: 'Vehicle',
      trip: 'Trip',
      startDate: 'Start date',
      endDate: 'End date',
      totalPaid: 'Total paid',
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      reviewSent: 'Review sent',
      yourReview: 'Your review:',
      leaveReview: 'Leave a review',
    },
    
    // Payment Form
    payment: {
      back: 'Back',
      reservationDetails: 'Reservation Details',
      booking: 'Booking:',
      startDate: 'Start Date',
      endDate: 'End Date',
      tripDate: 'Trip Date',
      passengers: 'Number of Passengers',
      paymentInfo: 'Payment Information',
      cardNumber: 'Card Number',
      cardName: 'Name on Card',
      expiryDate: 'Expiry Date',
      cvv: 'CVV',
      confirmPayment: 'Confirm Payment',
      summary: 'Summary',
      pricePerDay: 'Price per day:',
      pricePerPerson: 'Price per person:',
      days: 'Days:',
      total: 'Total:',
      freeCancellation: 'Free cancellation up to 24h before',
      insuranceIncluded: 'Insurance included',
      support247: '24/7 customer support',
      
      // Errors
      dateRequired: 'Date is required',
      endDateRequired: 'End date is required',
      endDateInvalid: 'End date must be after start date',
      passengersMin: 'Must have at least 1 passenger',
      cardNumberRequired: 'Card number is required',
      cardNumberInvalid: 'Invalid card number (16 digits)',
      cardNameRequired: 'Name is required',
      cardNameInvalid: 'Invalid name (letters only)',
      expiryRequired: 'Expiry date is required',
      expiryInvalid: 'Invalid date (MM/YY)',
      cvvRequired: 'CVV is required',
      cvvInvalid: 'Invalid CVV (3-4 digits)',
      verifyDates: 'Please verify selected dates',
      correctErrors: 'Please correct the errors in the form',
      
      // Success
      paymentSuccess: 'Payment processed successfully! Your reservation has been confirmed.',
    },
    
    // Review Dialog
    review: {
      title: 'How was the service?',
      subtitle: "We'd love to know your experience with",
      rating: 'Rating',
      excellent: 'Excellent!',
      veryGood: 'Very good',
      good: 'Good',
      fair: 'Fair',
      needsImprovement: 'Needs improvement',
      comment: 'Tell us about your experience',
      commentPlaceholder: 'What did you like most? Is there anything we can improve?',
      remindLater: 'Remind me later',
      submitReview: 'Submit Review',
      commentRequired: 'Please write a comment',
      thankYou: 'Thank you for your review!',
      remindedLater: "We'll remind you later",
    },
    
    // Admin
    admin: {
      // Users
      userManagement: 'User Management',
      userManagementDesc: 'Manage system users',
      newUser: 'New User',
      users: 'Users',
      documentId: 'ID/Passport',
      nationality: 'Nationality',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      noUsersFound: 'No users found',
      editUser: 'Edit User',
      updateUserInfo: 'Update user information',
      enterNewUserData: 'Enter new user data',
      newPassword: 'New Password (leave blank to keep current)',
      userUpdated: 'User updated',
      userCreated: 'User created',
      areYouSure: 'Are you sure?',
      cannotBeUndone: 'This action cannot be undone. This will permanently delete the user',
      userDeleted: 'User deleted',
      
      // Notifications
      notificationManagement: 'Notification Management',
      notificationManagementDesc: 'Manage system notifications',
      newNotification: 'New Notification',
      notifications: 'Notifications',
      subject: 'Subject',
      description: 'Description',
      sendDate: 'Send Date',
      priority: 'Priority',
      attachment: 'Attachment',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      noNotificationsFound: 'No notifications found',
      editNotification: 'Edit Notification',
      updateNotificationInfo: 'Update notification information',
      enterNewNotificationData: 'Enter new notification data',
      fileName: 'File name',
      notificationUpdated: 'Notification updated',
      notificationCreated: 'Notification created',
      notificationDeleted: 'Notification deleted',
      
      // Trips
      tripManagement: 'Trip Management',
      tripManagementDesc: 'Manage available trips',
      newTrip: 'New Trip',
      searchTrips: 'Search trips...',
      destination: 'Destination',
      departure: 'Departure',
      price: 'Price',
      availableSeats: 'Available Seats',
      noTripsFound: 'No trips found',
      editTrip: 'Edit Trip',
      updateTripInfo: 'Update trip information',
      enterNewTripData: 'Enter new trip data',
      priceMustBePositive: 'Price must be greater than 0',
      departureRequired: 'Departure date is required',
      descriptionRequired: 'Description is required',
      destinationRequired: 'Destination is required',
      seatsMustBePositive: 'Seats must be greater than 0',
      tripUpdated: 'Trip updated',
      tripCreated: 'Trip created',
      tripDeleted: 'Trip deleted',
      tripTo: 'trip to',
      
      // Vehicles
      vehicleManagement: 'Vehicle Management',
      vehicleManagementDesc: 'Manage vehicle fleet',
      newVehicle: 'New Vehicle',
      searchVehicles: 'Search vehicles...',
      plate: 'Plate',
      brand: 'Brand',
      model: 'Model',
      year: 'Year',
      capacity: 'Capacity',
      status: 'Status',
      available: 'Available',
      inUse: 'In Use',
      maintenance: 'Maintenance',
      noVehiclesFound: 'No vehicles found',
      editVehicle: 'Edit Vehicle',
      updateVehicleInfo: 'Update vehicle information',
      enterNewVehicleData: 'Enter new vehicle data',
      plateRequired: 'Plate is required',
      brandRequired: 'Brand is required',
      modelRequired: 'Model is required',
      capacityMustBePositive: 'Capacity must be greater than 0',
      invalidYear: 'Invalid year',
      vehicleUpdated: 'Vehicle updated',
      vehicleCreated: 'Vehicle created',
      vehicleDeleted: 'Vehicle deleted',
      withPlate: 'with plate',
    },
  },
  
  es: {
    // Common
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      create: 'Crear',
      update: 'Actualizar',
      search: 'Buscar',
      back: 'Volver',
      login: 'Iniciar Sesión',
      logout: 'Salir',
      register: 'Registrarse',
      send: 'Enviar',
      yes: 'Sí',
      no: 'No',
      loading: 'Cargando...',
    },
    
    // Home Page
    home: {
      title: 'TERESARIDE',
      heroTitle: 'Tu Aventura Comienza Aquí',
      heroSubtitle: 'Servicios de transporte para hacer de tu viaje una experiencia inolvidable',
      reserveNow: 'Reservar Ahora',
      viewServices: 'Ver Servicios',
      
      // Features
      guaranteedSecurity: 'Seguridad Garantizada',
      guaranteedSecurityDesc: 'Conductores certificados y vehículos con seguro completo',
      availability247: 'Disponibilidad 24/7',
      availability247Desc: 'Servicio disponible las 24 horas, los 7 días de la semana',
      continuousSupport: 'Soporte Continuo',
      continuousSupportDesc: 'Atención al cliente disponible en todo momento',
      groupTransport: 'Viajes en grupo',
      // About Us
      aboutUs: 'Quiénes Somos',
      aboutUsDesc: 'TERESARIDE es una empresa líder en servicios de transporte turístico ',
      aboutUsPara1: 'Nos especializamos en ofrecer experiencias de transporte  para turistas que buscan comodidad, seguridad y confiabilidad en cada viaje.',
      aboutUsPara2: 'Nuestro vehiculos son los mejores de la zona.',
      yearsExperience: 'Años de Experiencia',
      premiumVehicles: 'Vehículos ',
      certifiedDrivers: 'Conductores ',
      satisfiedCustomers: 'Clientes Satisfechos',
      
      // Services
      services: 'Nuestros Servicios',
      servicesDesc: 'Ofrecemos una amplia gama de servicios de transporte para todas tus necesidades',
      vehicleRental: 'Alquiler de Vehículos',
      vehicleRentalDesc: 'Amplia selección de vehículos  para alquilar por días o semanas. Desde autos compactos hasta busetas.',
      modernVehicles: 'Vehículos modernos y seguros',
      competitivePrices: 'Precios competitivos',
      insuranceIncluded: 'Seguro incluido',
      groupTransportDesc: 'Servicio especializado para grupos grandes.',
      luxuryVansBuses: 'Vehiculos y busetas',
      capacityUp50: 'Capacidad hasta 50 personas',
      professionalCoordination: 'Coordinación profesional',
      exploreServices: 'Explorar Todos los Servicios',
      
      // Testimonials
      testimonials: 'Lo Que Dicen Nuestros Clientes',
      testimonialsDesc: 'Miles de turistas confían en nosotros',
      
      // Contact
      contact: 'Contáctanos',
      contactDesc: 'Estamos aquí para ayudarte a planificar tu próxima aventura',
      phone: 'Teléfono',
      phoneSchedule: 'Lun - Dom: 24/7',
      email: 'Email',
      emailResponse: 'Respuesta en 24 horas',
      location: 'Ubicación',
      mainAvenue: 'Avenida Principal',
      
      // Footer
      allRightsReserved: 'Todos los derechos reservados',
      
      // Navigation
      home: 'Inicio',
      whoWeAre: 'Quiénes Somos',
      contactUs: 'Contáctanos',
    },
    
    // Login Page
    login: {
      title: 'Bienvenido a Blue Jay',
      subtitle: 'Inicia sesión o crea una cuenta para comenzar tu aventura',
      loginTab: 'Iniciar Sesión',
      registerTab: 'Registrarse',
      email: 'Correo Electrónico',
      emailPlaceholder: 'tu@email.com',
      password: 'Contraseña',
      passwordPlaceholder: '••••••••',
      fullName: 'Nombre Completo',
      namePlaceholder: 'Tu nombre',
      loginButton: 'Iniciar Sesión',
      createAccount: 'Crear Cuenta',
      backToHome: 'Volver al Inicio',
      
      // Errors
      emailRequired: 'El correo electrónico es requerido',
      emailInvalid: 'Por favor ingresa un correo electrónico válido',
      passwordRequired: 'La contraseña es requerida',
      passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
      nameRequired: 'El nombre es requerido',
      nameMinLength: 'El nombre debe tener al menos 3 caracteres',
      
      // Success
      welcomeBack: '¡Bienvenido de vuelta!',
      accountCreated: '¡Cuenta creada exitosamente!',
      
      // Features
      luxuryVehicles: 'Vehículos de Lujo',
      luxuryVehiclesDesc: 'Flota moderna y confortable',
      uniqueDestinations: 'Destinos Únicos',
      uniqueDestinationsDesc: 'Tours personalizados para ti',
      fiveStarService: 'Servicio 5 Estrellas',
      fiveStarServiceDesc: 'Reseñas verificadas de turistas',
    },
    
    // Dashboard
    dashboard: {
      adminPanel: 'Panel de Administrador',
      vehicles: 'Vehículos',
      trips: 'Viajes',
      myReservations: 'Mis Reservaciones',
      welcome: 'Bienvenido,',
      logout: 'Salir',
    },
    
    // Vehicle Catalog
    vehicles: {
      title: 'Catálogo de Vehículos',
      subtitle: 'Encuentra el vehículo perfecto para tu aventura',
      perDay: 'por día',
      people: 'personas',
      viewDetails: 'Ver Detalles',
      backToCatalog: 'Volver al Catálogo',
      capacity: 'Capacidad',
      features: 'Características:',
      bookNow: 'Reservar Ahora',
    },
    
    // Trip Catalog
    trips: {
      title: 'Catálogo de Viajes',
      subtitle: 'Descubre experiencias únicas e inolvidables',
      perPerson: 'por persona',
      viewDetails: 'Ver Detalles',
      backToCatalog: 'Volver al Catálogo',
      duration: 'Duración',
      tripIncludes: 'El viaje incluye:',
      bookNow: 'Reservar Ahora',
    },
    
    // Reservations
    reservations: {
      title: 'Mis Reservaciones',
      subtitle: 'Gestiona todas tus reservaciones en un solo lugar',
      noReservations: 'No tienes reservaciones aún',
      noReservationsDesc: 'Explora nuestro catálogo de vehículos y viajes para comenzar tu aventura',
      vehicle: 'Vehículo',
      trip: 'Viaje',
      startDate: 'Fecha de inicio',
      endDate: 'Fecha de fin',
      totalPaid: 'Total pagado',
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      completed: 'Completada',
      reviewSent: 'Reseña enviada',
      yourReview: 'Tu reseña:',
      leaveReview: 'Dejar una reseña',
    },
    
    // Payment Form
    payment: {
      back: 'Volver',
      reservationDetails: 'Detalles de la Reservación',
      booking: 'Reservando:',
      startDate: 'Fecha de Inicio',
      endDate: 'Fecha de Fin',
      tripDate: 'Fecha del Viaje',
      passengers: 'Número de Pasajeros',
      paymentInfo: 'Información de Pago',
      cardNumber: 'Número de Tarjeta',
      cardName: 'Nombre en la Tarjeta',
      expiryDate: 'Fecha de Vencimiento',
      cvv: 'CVV',
      confirmPayment: 'Confirmar Pago',
      summary: 'Resumen',
      pricePerDay: 'Precio por día:',
      pricePerPerson: 'Precio por persona:',
      days: 'Días:',
      total: 'Total:',
      freeCancellation: 'Cancelación gratuita hasta 24h antes',
      insuranceIncluded: 'Seguro incluido',
      support247: 'Atención al cliente 24/7',
      
      // Errors
      dateRequired: 'La fecha es requerida',
      endDateRequired: 'La fecha de fin es requerida',
      endDateInvalid: 'La fecha de fin debe ser posterior a la fecha de inicio',
      passengersMin: 'Debe haber al menos 1 pasajero',
      cardNumberRequired: 'El número de tarjeta es requerido',
      cardNumberInvalid: 'Número de tarjeta inválido (16 dígitos)',
      cardNameRequired: 'El nombre es requerido',
      cardNameInvalid: 'Nombre inválido (solo letras)',
      expiryRequired: 'La fecha de vencimiento es requerida',
      expiryInvalid: 'Fecha inválida (MM/AA)',
      cvvRequired: 'El CVV es requerido',
      cvvInvalid: 'CVV inválido (3-4 dígitos)',
      verifyDates: 'Por favor verifica las fechas seleccionadas',
      correctErrors: 'Por favor corrige los errores en el formulario',
      
      // Success
      paymentSuccess: '¡Pago procesado exitosamente! Tu reservación ha sido confirmada.',
    },
    
    // Review Dialog
    review: {
      title: '¿Qué te pareció el servicio?',
      subtitle: 'Nos encantaría conocer tu experiencia con',
      rating: 'Calificación',
      excellent: '¡Excelente!',
      veryGood: 'Muy bueno',
      good: 'Bueno',
      fair: 'Regular',
      needsImprovement: 'Necesita mejorar',
      comment: 'Cuéntanos sobre tu experiencia',
      commentPlaceholder: '¿Qué fue lo que más te gustó? ¿Hay algo que podamos mejorar?',
      remindLater: 'Recordar más tarde',
      submitReview: 'Enviar Reseña',
      commentRequired: 'Por favor escribe un comentario',
      thankYou: '¡Gracias por tu reseña!',
      remindedLater: 'Te recordaremos más tarde',
    },
    
    // Admin
    admin: {
      // Users
      userManagement: 'Gestión de Usuarios',
      userManagementDesc: 'Administra los usuarios del sistema',
      newUser: 'Nuevo Usuario',
      users: 'Usuarios',
      documentId: 'Cédula/Pasaporte',
      nationality: 'Nacionalidad',
      name: 'Nombre',
      email: 'Correo',
      password: 'Contraseña',
      noUsersFound: 'No se encontraron usuarios',
      editUser: 'Editar Usuario',
      updateUserInfo: 'Actualiza la información del usuario',
      enterNewUserData: 'Ingresa los datos del nuevo usuario',
      newPassword: 'Nueva Contraseña (dejar en blanco para mantener)',
      userUpdated: 'Usuario actualizado',
      userCreated: 'Usuario creado',
      areYouSure: '¿Estás seguro?',
      cannotBeUndone: 'Esta acción no se puede deshacer. Se eliminará permanentemente el usuario',
      userDeleted: 'Usuario eliminado',
      
      // Notifications
      notificationManagement: 'Gestión de Notificaciones',
      notificationManagementDesc: 'Administra las notificaciones del sistema',
      newNotification: 'Nueva Notificación',
      notifications: 'Notificaciones',
      subject: 'Asunto',
      description: 'Descripción',
      sendDate: 'Fecha de Envío',
      priority: 'Prioridad',
      attachment: 'Adjunto',
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      noNotificationsFound: 'No se encontraron notificaciones',
      editNotification: 'Editar Notificación',
      updateNotificationInfo: 'Actualiza la información de la notificación',
      enterNewNotificationData: 'Ingresa los datos de la nueva notificación',
      fileName: 'Nombre del archivo',
      notificationUpdated: 'Notificación actualizada',
      notificationCreated: 'Notificación creada',
      notificationDeleted: 'Notificación eliminada',
      
      // Trips
      tripManagement: 'Gestión de Viajes',
      tripManagementDesc: 'Administra los viajes disponibles',
      newTrip: 'Nuevo Viaje',
      searchTrips: 'Buscar viajes...',
      destination: 'Destino',
      departure: 'Salida',
      price: 'Precio',
      availableSeats: 'Cupos',
      noTripsFound: 'No se encontraron viajes',
      editTrip: 'Editar Viaje',
      updateTripInfo: 'Actualiza la información del viaje',
      enterNewTripData: 'Ingresa los datos del nuevo viaje',
      priceMustBePositive: 'El precio debe ser mayor a 0',
      departureRequired: 'La fecha de salida es requerida',
      descriptionRequired: 'La descripción es requerida',
      destinationRequired: 'El destino es requerido',
      seatsMustBePositive: 'Los cupos deben ser mayor a 0',
      tripUpdated: 'Viaje actualizado',
      tripCreated: 'Viaje creado',
      tripDeleted: 'Viaje eliminado',
      tripTo: 'viaje a',
      
      // Vehicles
      vehicleManagement: 'Gestión de Vehículos',
      vehicleManagementDesc: 'Administra la flota de vehículos',
      newVehicle: 'Nuevo Vehículo',
      searchVehicles: 'Buscar vehículos...',
      plate: 'Placa',
      brand: 'Marca',
      model: 'Modelo',
      year: 'Año',
      capacity: 'Capacidad',
      status: 'Estado',
      available: 'Disponible',
      inUse: 'En Uso',
      maintenance: 'Mantenimiento',
      noVehiclesFound: 'No se encontraron vehículos',
      editVehicle: 'Editar Vehículo',
      updateVehicleInfo: 'Actualiza la información del vehículo',
      enterNewVehicleData: 'Ingresa los datos del nuevo vehículo',
      plateRequired: 'La placa es requerida',
      brandRequired: 'La marca es requerida',
      modelRequired: 'El modelo es requerido',
      capacityMustBePositive: 'La capacidad debe ser mayor a 0',
      invalidYear: 'Año inválido',
      vehicleUpdated: 'Vehículo actualizado',
      vehicleCreated: 'Vehículo creado',
      vehicleDeleted: 'Vehículo eliminado',
      withPlate: 'con placa',
    },
  },
};

export const t = (key: string, lang: Language = 'en'): string => {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
};
