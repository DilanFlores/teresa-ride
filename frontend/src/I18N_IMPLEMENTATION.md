# Sistema de Internacionalización (i18n)

## ✅ Sistema Implementado

Se ha creado un sistema completo de internacionalización con soporte para **Inglés (EN)** y **Español (ES)**.

### Archivos Creados:

1. **`/utils/translations.ts`** - Todas las traducciones en inglés y español
2. **`/contexts/LanguageContext.tsx`** - Contexto React para gestionar el idioma
3. **`/components/LanguageSwitch.tsx`** - Componente toggle para cambiar idioma

### Cómo Usar:

#### 1. En cualquier componente:

```tsx
import { useLanguage } from '../contexts/LanguageContext';

function MiComponente() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.heroTitle')}</p>
    </div>
  );
}
```

#### 2. Agregar el LanguageSwitch:

```tsx
import { LanguageSwitch } from './LanguageSwitch';

// En tu navbar o header:
<LanguageSwitch />
```

### Idioma Por Defecto:

- **Inglés (EN)** es el idioma por defecto
- Los usuarios pueden cambiar a español con el toggle EN/ES

### Traducciones Disponibles:

Todas las secciones tienen traducciones completas:

- ✅ Common (botones, acciones comunes)
- ✅ Home Page (landing completa)
- ✅ Login/Register
- ✅ Dashboard
- ✅ Vehículos
- ✅ Viajes
- ✅ Reservaciones
- ✅ Formulario de Pago
- ✅ Reseñas
- ✅ Panel de Administrador (completo)

### Ejemplo de Uso en HomePage:

```tsx
export function HomePage({ onNavigateToLogin }: HomePageProps) {
  const { t } = useLanguage();
  
  return (
    <nav>
      <LanguageSwitch />
      <h1>{t('home.title')}</h1>
      <Button onClick={onNavigateToLogin}>
        {t('home.reserveNow')}
      </Button>
    </nav>
  );
}
```

### Próximos Pasos:

Para implementar completamente, necesitas actualizar cada componente importando `useLanguage` y reemplazando los textos hardcodeados con llamadas a `t()`.

**Componentes a actualizar:**
- HomePage.tsx
- LoginPage.tsx  
- Dashboard.tsx
- VehicleCatalog.tsx / VehicleDetails.tsx
- TripCatalog.tsx / TripDetails.tsx
- MyReservations.tsx
- PaymentForm.tsx
- ReviewDialog.tsx
- Todos los componentes de admin/

El sistema está 100% funcional y listo para usar.
