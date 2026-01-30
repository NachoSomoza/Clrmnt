
import React from 'react';
import { 
  FileText, 
  HelpCircle, 
  Image as ImageIcon, 
  Video, 
  BookOpen, 
  Settings,
  Sun,
  Moon,
  Coffee,
  Zap
} from 'lucide-react';

export const THEMES = {
  light: {
    bg: 'bg-[#FDFCF0]',
    text: 'text-gray-900',
    card: 'bg-white',
    accent: 'bg-blue-500',
    icon: <Sun className="w-5 h-5" />
  },
  dark: {
    bg: 'bg-gray-900',
    text: 'text-gray-100',
    card: 'bg-gray-800',
    accent: 'bg-indigo-400',
    icon: <Moon className="w-5 h-5" />
  },
  sepia: {
    bg: 'bg-[#F4ECD8]',
    text: 'text-[#5B4636]',
    card: 'bg-[#EFE3C8]',
    accent: 'bg-[#A67B5B]',
    icon: <Coffee className="w-5 h-5" />
  },
  contrast: {
    bg: 'bg-black',
    text: 'text-yellow-400',
    card: 'bg-gray-900',
    accent: 'bg-yellow-400',
    icon: <Zap className="w-5 h-5" />
  }
};

export const MODULE_CARDS = [
  {
    id: 'READER',
    title: 'Lectura Adaptativa',
    description: 'Lee a tu ritmo con fuentes y colores que te ayudan a concentrarte.',
    icon: <BookOpen className="w-12 h-12 text-blue-500" />,
    color: 'border-blue-200 bg-blue-50'
  },
  {
    id: 'EXPLAIN',
    title: 'Explicación Simple',
    description: 'Pregunta lo que no entiendas a nuestro tutor amigable.',
    icon: <HelpCircle className="w-12 h-12 text-green-500" />,
    color: 'border-green-200 bg-green-50'
  },
  {
    id: 'COMIC',
    title: 'Cómic Visual',
    description: 'Transforma el texto en una historia con dibujos mágicos.',
    icon: <ImageIcon className="w-12 h-12 text-purple-500" />,
    color: 'border-purple-200 bg-purple-50'
  },
  {
    id: 'VIDEO',
    title: 'Video Narrado',
    description: 'Mira una película mágica sobre tu historia creada por IA.',
    icon: <Video className="w-12 h-12 text-orange-500" />,
    color: 'border-orange-200 bg-orange-50',
    disabled: false
  }
];
