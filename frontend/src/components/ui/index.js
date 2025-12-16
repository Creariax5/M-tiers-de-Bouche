// ===========================================
// UI Components - Re-export direct du Design System
// ===========================================
// Pas de wrappers inutiles, on utilise directement le DS

export { 
  Button,
  Card,
  Input,
  Textarea,
  Select,
  Checkbox,
  Badge,
  Logo,
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell,
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  Alert,
  Modal, 
  Dropdown, 
  DropdownItem,
  useToast, 
  ToastProvider,
  Loader,
  Switch,
  Breadcrumbs,
  DatePicker,
  FileUpload,
  NutritionLabel,
  ProductLabel,
  designConfig
} from '@regal/design-system';

// Composants custom du frontend (pas dans le DS)
export { Loading } from './Loading';
export { EmptyState } from './EmptyState';
export { StatsCard } from './StatsCard';
