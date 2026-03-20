/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Facebook, 
  MessageCircle, 
  Github, 
  ExternalLink,
  Check,
  Type,
  Palette,
  Layout as LayoutIcon,
  Share2,
  ImagePlus,
  Monitor,
  Moon,
  Sun,
  Sparkles,
  Camera,
  Ghost
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// import { toPng } from 'html-to-image';

// --- Types ---

interface SocialIcon {
  id: string;
  platform: string;
  url: string;
  enabled: boolean;
  color?: string;
  bgColor?: string;
}

interface SignatureData {
  name: string;
  title: string;
  mobile: string;
  email: string;
  websiteLabel: string;
  websiteUrl: string;
  location: string;
  profileImage: string;
  bannerImage: string;
  bannerUrl: string;
  bannerAlt: string;
  tagline: string;
  companyName: string;
  socials: SocialIcon[];
}

interface SignatureStyles {
  // Typography
  nameFont: string;
  nameSize: number;
  nameWeight: string;
  nameColor: string;
  titleFont: string;
  titleSize: number;
  titleWeight: string;
  titleColor: string;
  contactFont: string;
  contactSize: number;
  contactColor: string;
  linkColor: string;
  linkHoverColor: string;
  locationColor: string;
  
  // Icons
  iconColor: string;
  iconBgColor: string;
  iconBorderColor: string;
  iconBorderWidth: number;
  iconSize: number;
  buttonSize: number;
  iconBorderRadius: number;
  iconSpacing: number;
  iconStyle: 'filled' | 'outline' | 'plain';
  iconShape: 'square' | 'rounded' | 'circle' | 'pill';
  iconShadow: boolean;
  iconShadowStrength: number;
  
  // Global
  width: number;
  bgColor: string;
  accentColor: string;
  dividerColor: string;
  dividerThickness: number;
  dividerHeight: number;
  padding: number;
  columnGap: number;
  lineSpacing: number;
  bannerRadius: number;
  bannerHeight: number;
  bannerWidth: string; // 'full' or percentage
}

// --- Constants ---

const FONT_FAMILIES = [
  'Inter, sans-serif',
  'Montserrat, sans-serif',
  'Playfair Display, serif',
  'Roboto, sans-serif',
  'Open Sans, sans-serif',
  'Arial, sans-serif',
  'Helvetica, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Verdana, sans-serif',
  'Tahoma, sans-serif',
  'Trebuchet MS, sans-serif',
  'Courier New, monospace',
];

const SOCIAL_PLATFORMS = [
  { name: 'Instagram', icon: Instagram, slug: 'instagram' },
  { name: 'LinkedIn', icon: Linkedin, slug: 'linkedin' },
  { name: 'TikTok', icon: MessageCircle, slug: 'tiktok' },
  { name: 'X', icon: Twitter, slug: 'x' },
  { name: 'Snapchat', icon: Ghost, slug: 'snapchat' },
  { name: 'YouTube', icon: Youtube, slug: 'youtube' },
  { name: 'Facebook', icon: Facebook, slug: 'facebook' },
  { name: 'WhatsApp', icon: MessageCircle, slug: 'whatsapp' },
  { name: 'Behance', icon: Globe, slug: 'behance' },
  { name: 'Dribbble', icon: Globe, slug: 'dribbble' },
  { name: 'Website', icon: Globe, slug: 'globe' },
  { name: 'Github', icon: Github, slug: 'github' },
  { name: 'Custom', icon: Share2, slug: 'share' },
];

const PRESETS: Record<string, { data?: Partial<SignatureData>, styles: Partial<SignatureStyles> }> = {
  'Modern Blue': {
    styles: {
      accentColor: '#007AFF',
      iconBgColor: '#007AFF',
      nameColor: '#1a1a1a',
      titleColor: '#666666',
      iconStyle: 'filled',
      iconShape: 'circle',
    }
  },
  'Minimal Dark': {
    styles: {
      accentColor: '#1a1a1a',
      iconBgColor: '#1a1a1a',
      nameColor: '#000000',
      titleColor: '#333333',
      iconStyle: 'plain',
      iconShape: 'square',
      dividerColor: '#000000',
      dividerThickness: 2,
    }
  },
  'Creative Pink': {
    styles: {
      accentColor: '#FF2D55',
      iconBgColor: '#FF2D55',
      nameColor: '#1a1a1a',
      titleColor: '#666666',
      iconStyle: 'outline',
      iconShape: 'rounded',
      iconBorderRadius: 8,
    }
  },
  'Professional Gold': {
    styles: {
      accentColor: '#B8860B',
      iconBgColor: '#B8860B',
      nameColor: '#2C3E50',
      titleColor: '#7F8C8D',
      nameFont: 'Playfair Display, serif',
      iconStyle: 'filled',
      iconShape: 'circle',
    }
  }
};

const DEFAULT_DATA: SignatureData = {
  name: 'Your Name',
  title: 'Your Job Title',
  mobile: '+1 (000) 000-0000',
  email: 'hello@yourdomain.com',
  websiteLabel: 'yourwebsite.com',
  websiteUrl: 'https://yourwebsite.com',
  location: 'City, Country',
  profileImage: 'https://picsum.photos/seed/sig-profile/200/200',
  bannerImage: 'https://picsum.photos/seed/sig-banner/800/200',
  bannerUrl: 'https://yourwebsite.com',
  bannerAlt: 'Signature Banner',
  tagline: 'Your inspiring tagline goes here',
  companyName: 'Your Company Name',
  socials: [
    { id: '1', platform: 'Instagram', url: 'https://instagram.com/', enabled: true, color: '#ffffff', bgColor: '#E1306C' },
    { id: '2', platform: 'Snapchat', url: 'https://snapchat.com/add/', enabled: true, color: '#000000', bgColor: '#FFFC00' },
    { id: '3', platform: 'X', url: 'https://twitter.com/', enabled: true, color: '#ffffff', bgColor: '#000000' },
  ],
};

const DEFAULT_STYLES: SignatureStyles = {
  nameFont: 'Inter, sans-serif',
  nameSize: 18,
  nameWeight: '700',
  nameColor: '#1a1a1a',
  titleFont: 'Inter, sans-serif',
  titleSize: 14,
  titleWeight: '400',
  titleColor: '#666666',
  contactFont: 'Inter, sans-serif',
  contactSize: 13,
  contactColor: '#444444',
  linkColor: '#007AFF',
  linkHoverColor: '#0056b3',
  locationColor: '#888888',
  
  iconColor: '#ffffff',
  iconBgColor: '#007AFF',
  iconBorderColor: 'transparent',
  iconBorderWidth: 0,
  iconSize: 16,
  buttonSize: 32,
  iconBorderRadius: 50,
  iconSpacing: 8,
  iconStyle: 'filled',
  iconShape: 'circle',
  iconShadow: false,
  iconShadowStrength: 2,
  
  width: 500,
  bgColor: '#f9f9f9',
  accentColor: '#007AFF',
  dividerColor: '#e0e0e0',
  dividerThickness: 1,
  dividerHeight: 80,
  padding: 24,
  columnGap: 24,
  lineSpacing: 4,
  bannerRadius: 12,
  bannerHeight: 100,
  bannerWidth: '100%',
};

// --- Components ---

const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</label>
    <div className="group relative flex items-center gap-2 p-1 bg-white border border-zinc-200 rounded-xl hover:border-blue-400 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
      <div className="relative w-8 h-8 rounded-lg border border-zinc-100 overflow-hidden shadow-inner flex-shrink-0">
        <input 
          type="color" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
        />
      </div>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-2 py-1.5 text-sm bg-transparent border-none focus:outline-none focus:ring-0 font-mono font-bold text-zinc-700"
      />
    </div>
  </div>
);

const Slider = ({ label, value, min, max, step = 1, onChange, unit = 'px' }: { label: string, value: number, min: number, max: number, step?: number, onChange: (val: number) => void, unit?: string }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-center">
      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</label>
      <span className="text-xs font-mono text-zinc-400">{value}{unit}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
  </div>
);

const Select = ({ label, value, options, onChange }: { label: string, value: string, options: { label: string, value: string }[], onChange: (val: string) => void }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const Input = ({ label, value, onChange, placeholder, type = "text", icon: Icon }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string, type?: string, icon?: any }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />}
      <input 
        type={type}
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'px-3'} py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
      />
    </div>
  </div>
);

const Section = ({ title, icon: Icon, children, defaultOpen = false }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-semibold text-zinc-700">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 flex flex-col gap-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [data, setData] = useState<SignatureData>(DEFAULT_DATA);
  const [styles, setStyles] = useState<SignatureStyles>(DEFAULT_STYLES);
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const updateData = (key: keyof SignatureData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const updateStyle = (key: keyof SignatureStyles, value: any) => {
    setStyles(prev => ({ ...prev, [key]: value }));
  };

  const updateBrandColor = (color: string) => {
    setStyles(prev => ({
      ...prev,
      accentColor: color,
      iconBgColor: color,
      linkColor: color,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: 'profileImage' | 'bannerImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateData(key, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSocial = () => {
    const newSocial: SocialIcon = {
      id: Math.random().toString(36).substr(2, 9),
      platform: 'Instagram',
      url: '',
      enabled: true,
      color: '#ffffff',
      bgColor: styles.accentColor
    };
    setData(prev => ({ ...prev, socials: [...prev.socials, newSocial] }));
  };

  const removeSocial = (id: string) => {
    setData(prev => ({ ...prev, socials: prev.socials.filter(s => s.id !== id) }));
  };

  const updateSocial = (id: string, key: keyof SocialIcon, value: any) => {
    setData(prev => ({
      ...prev,
      socials: prev.socials.map(s => s.id === id ? { ...s, [key]: value } : s)
    }));
  };

  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all settings?')) {
      setData(DEFAULT_DATA);
      setStyles(DEFAULT_STYLES);
    }
  };

  const loadSample = () => {
    setData(DEFAULT_DATA);
    setStyles(DEFAULT_STYLES);
  };

  const applyPreset = (name: string) => {
    const preset = PRESETS[name];
    if (preset.data) setData(prev => ({ ...prev, ...preset.data }));
    if (preset.styles) setStyles(prev => ({ ...prev, ...preset.styles }));
  };

  const downloadPNG = async () => {
    if (previewRef.current) {
      try {
        const { toPng } = await import('html-to-image');
        const dataUrl = await toPng(previewRef.current, {
          cacheBust: true,
          style: {
            borderRadius: '0px',
            boxShadow: 'none',
            border: 'none'
          }
        });
        const link = document.createElement('a');
        link.download = 'signature.png';
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('oops, something went wrong!', err);
        alert('Failed to generate PNG. Please try again.');
      }
    }
  };

  const exportSettings = () => {
    const settings = { data, styles };
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signature-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const settings = JSON.parse(event.target?.result as string);
          if (settings.data) setData(settings.data);
          if (settings.styles) setStyles(settings.styles);
        } catch (err) {
          alert('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const generateHTML = (isExport: boolean = false) => {
    const { 
      name, title, mobile, email, websiteLabel, websiteUrl, location, 
      profileImage, bannerImage, bannerUrl, bannerAlt, socials 
    } = data;
    
    const s = styles;

    const imageRadius = s.iconShape === 'circle' ? '50%' : 
                        s.iconShape === 'rounded' ? '8px' : '0px';

    const iconStyle = (soc: SocialIcon) => {
      let bg = soc.bgColor || s.iconBgColor;
      let color = soc.color || s.iconColor;
      let border = `1px solid ${s.iconBorderColor}`;
      
      if (s.iconStyle === 'outline') {
        bg = 'transparent';
        color = soc.bgColor || s.iconBgColor;
        border = `1px solid ${soc.bgColor || s.iconBgColor}`;
      } else if (s.iconStyle === 'plain') {
        bg = 'transparent';
        color = soc.bgColor || s.iconBgColor;
        border = 'none';
      }

    const radiusValue = s.iconShape === 'circle' ? '50%' : 
                          s.iconShape === 'pill' ? '20px' : 
                          s.iconShape === 'rounded' ? `${s.iconBorderRadius}px` : '0px';

      return `
        display: inline-block;
        width: ${s.buttonSize}px;
        height: ${s.buttonSize}px;
        line-height: ${s.buttonSize}px;
        text-align: center;
        background-color: ${bg};
        color: ${color};
        border-radius: ${radiusValue};
        border: ${border};
        margin-right: ${s.iconSpacing}px;
        text-decoration: none;
        ${s.iconShadow ? `box-shadow: 0 ${s.iconShadowStrength}px ${s.iconShadowStrength * 2}px rgba(0,0,0,0.1);` : ''}
      `;
    };

    // Table-based HTML for email compatibility
    return `
      <table cellpadding="0" cellspacing="0" border="0" style="background-color: ${s.bgColor}; width: ${s.width}px; font-family: ${s.nameFont}; border-collapse: collapse; overflow: hidden; border-radius: 8px;">
        <tr>
          <td style="padding: ${s.padding}px;">
            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
              <tr>
                <!-- Profile Image -->
                <td style="vertical-align: middle; width: 100px;">
                  <img src="${profileImage}" alt="${name}" width="100" height="100" style="border-radius: ${imageRadius}; display: block; width: 100px; height: 100px; min-width: 100px; min-height: 100px; max-width: 100px; max-height: 100px; object-fit: cover;" />
                </td>
                
                <!-- Divider -->
                <td style="width: ${s.columnGap}px; text-align: center; vertical-align: middle;">
                  <div style="width: ${s.dividerThickness}px; height: ${s.dividerHeight}px; background-color: ${s.dividerColor}; margin: 0 auto;"></div>
                </td>
                
                <!-- Info Section -->
                <td style="vertical-align: middle;">
                  <div style="font-family: ${s.nameFont}; font-size: ${s.nameSize}px; font-weight: ${s.nameWeight}; color: ${s.nameColor}; margin-bottom: ${s.lineSpacing}px; line-height: 1.2;">${name}</div>
                  <div style="font-family: ${s.titleFont}; font-size: ${s.titleSize}px; font-weight: ${s.titleWeight}; color: ${s.titleColor}; margin-bottom: ${s.lineSpacing * 2}px; line-height: 1.2;">${title}</div>
                  
                  <table cellpadding="0" cellspacing="0" border="0" style="font-family: ${s.contactFont}; font-size: ${s.contactSize}px; color: ${s.contactColor}; line-height: 1.4;">
                    <tr>
                      <td style="padding-bottom: ${s.lineSpacing}px;">
                        <span style="color: ${s.accentColor}; font-weight: bold; margin-right: 4px;">M</span> ${mobile}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: ${s.lineSpacing}px;">
                        <span style="color: ${s.accentColor}; font-weight: bold; margin-right: 4px;">E</span> <a href="mailto:${email}" style="color: ${s.contactColor}; text-decoration: none;">${email}</a>
                        <span style="margin: 0 8px; color: ${s.dividerColor};">|</span>
                        <span style="color: ${s.accentColor}; font-weight: bold; margin-right: 4px;">W</span> <a href="${websiteUrl}" style="color: ${s.linkColor}; text-decoration: none;">${websiteLabel}</a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span style="color: ${s.accentColor}; font-weight: bold; margin-right: 4px;">L</span> <span style="color: ${s.locationColor};">${location}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- Social Icons -->
            <div style="margin-top: 16px; font-size: 0; line-height: 0;">
              ${socials.filter(soc => soc.enabled).map(soc => {
                const platform = SOCIAL_PLATFORMS.find(p => p.name === soc.platform);
                const slug = platform?.slug || 'globe';
                
                // Determine icon color based on style
                let iconHex = (soc.color || s.iconColor).replace('#', '');
                if (s.iconStyle === 'outline' || s.iconStyle === 'plain') {
                  iconHex = (soc.bgColor || s.iconBgColor).replace('#', '');
                }
                
                const iconUrl = `https://cdn.simpleicons.org/${slug}/${iconHex}`;
                
                return `
                  <a href="${soc.url}" style="${iconStyle(soc)}">
                    <img src="${iconUrl}" width="${s.iconSize}" height="${s.iconSize}" style="display: inline-block; vertical-align: middle; border: 0; width: ${s.iconSize}px; height: ${s.iconSize}px;" />
                  </a>
                `;
              }).join('')}
            </div>
          </td>
        </tr>
        
        <!-- Banner -->
        ${bannerImage ? `
          <tr>
            <td style="padding: 0 ${s.padding}px ${s.padding}px ${s.padding}px;">
              <a href="${bannerUrl}" style="text-decoration: none; display: block;">
                <img src="${bannerImage}" alt="${bannerAlt}" width="${s.width - (s.padding * 2)}" style="display: block; border-radius: ${s.bannerRadius}px; height: ${s.bannerHeight}px; object-fit: cover;" />
              </a>
            </td>
          </tr>
        ` : ''}
      </table>
    `;
  };

  const copySignature = async () => {
    const html = generateHTML();
    try {
      const blob = new Blob([html], { type: 'text/html' });
      const textBlob = new Blob([previewRef.current?.innerText || ''], { type: 'text/plain' });
      
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blob,
          'text/plain': textBlob
        })
      ]);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support ClipboardItem
      const el = document.createElement('div');
      el.innerHTML = html;
      el.style.position = 'fixed';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      
      const range = document.createRange();
      range.selectNode(el);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');
      document.body.removeChild(el);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadHTML = () => {
    const html = generateHTML(true);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signature.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col lg:flex-row font-sans text-zinc-900">
      {/* --- Left Panel: Settings --- */}
      <div className="w-full lg:w-[450px] bg-white border-r border-zinc-200 flex flex-col h-screen overflow-hidden shadow-xl z-10">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Signature Pro</h1>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">Builder v1.0</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={resetToDefault}
              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Reset All"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Settings Management */}
          <Section title="Manage Settings" icon={LayoutIcon}>
            <div className="flex flex-col gap-3">
              <p className="text-xs text-zinc-500 leading-relaxed">
                Save your current signature configuration to a file so you can load it back later.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={exportSettings}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
                <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-50 cursor-pointer transition-all">
                  <Plus className="w-4 h-4" /> Import
                  <input type="file" className="hidden" accept=".json" onChange={importSettings} />
                </label>
              </div>
            </div>
          </Section>

          {/* Personal Info */}
          <Section title="Personal Info" icon={User} defaultOpen>
            <Input label="Full Name" value={data.name} onChange={(v) => updateData('name', v)} placeholder="John Doe" />
            <Input label="Job Title" value={data.title} onChange={(v) => updateData('title', v)} placeholder="Creative Director" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Mobile" value={data.mobile} onChange={(v) => updateData('mobile', v)} placeholder="+1 234 567 890" icon={Phone} />
              <Input label="Email" value={data.email} onChange={(v) => updateData('email', v)} placeholder="john@example.com" icon={Mail} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Website Label" value={data.websiteLabel} onChange={(v) => updateData('websiteLabel', v)} placeholder="MySite.com" icon={Globe} />
              <Input label="Website URL" value={data.websiteUrl} onChange={(v) => updateData('websiteUrl', v)} placeholder="https://..." />
            </div>
            <Input label="Location" value={data.location} onChange={(v) => updateData('location', v)} placeholder="New York, USA" icon={MapPin} />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Profile Image</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden">
                  {data.profileImage ? (
                    <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-zinc-300" />
                  )}
                </div>
                <label className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100 cursor-pointer transition-colors text-center">
                  Upload Photo
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'profileImage')} />
                </label>
              </div>
            </div>
          </Section>

          {/* Typography */}
          <Section title="Typography" icon={Type}>
            <div className="p-4 bg-zinc-50 rounded-xl flex flex-col gap-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Name Styles</h3>
              <Select 
                label="Font Family" 
                value={styles.nameFont} 
                options={FONT_FAMILIES.map(f => ({ label: f.split(',')[0], value: f }))} 
                onChange={(v) => updateStyle('nameFont', v)} 
              />
              <div className="grid grid-cols-2 gap-4">
                <Slider label="Size" value={styles.nameSize} min={12} max={32} onChange={(v) => updateStyle('nameSize', v)} />
                <Select 
                  label="Weight" 
                  value={styles.nameWeight} 
                  options={[{label:'Light',value:'300'},{label:'Regular',value:'400'},{label:'Medium',value:'500'},{label:'Bold',value:'700'},{label:'Black',value:'900'}]} 
                  onChange={(v) => updateStyle('nameWeight', v)} 
                />
              </div>
              <ColorPicker label="Color" value={styles.nameColor} onChange={(v) => updateStyle('nameColor', v)} />
            </div>

            <div className="p-4 bg-zinc-50 rounded-xl flex flex-col gap-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Title Styles</h3>
              <div className="grid grid-cols-2 gap-4">
                <Slider label="Size" value={styles.titleSize} min={10} max={24} onChange={(v) => updateStyle('titleSize', v)} />
                <ColorPicker label="Color" value={styles.titleColor} onChange={(v) => updateStyle('titleColor', v)} />
              </div>
            </div>

            <div className="p-4 bg-zinc-50 rounded-xl flex flex-col gap-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Contact Styles</h3>
              <div className="grid grid-cols-2 gap-4">
                <Slider label="Size" value={styles.contactSize} min={10} max={20} onChange={(v) => updateStyle('contactSize', v)} />
                <ColorPicker label="Text Color" value={styles.contactColor} onChange={(v) => updateStyle('contactColor', v)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ColorPicker label="Link Color" value={styles.linkColor} onChange={(v) => updateStyle('linkColor', v)} />
                <ColorPicker label="Location Color" value={styles.locationColor} onChange={(v) => updateStyle('locationColor', v)} />
              </div>
            </div>
          </Section>

          {/* Colors & Global */}
          <Section title="Colors & Layout" icon={Palette}>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker label="Accent Color" value={styles.accentColor} onChange={(v) => updateStyle('accentColor', v)} />
              <ColorPicker label="Background" value={styles.bgColor} onChange={(v) => updateStyle('bgColor', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker label="Divider Color" value={styles.dividerColor} onChange={(v) => updateStyle('dividerColor', v)} />
              <Slider label="Divider Thickness" value={styles.dividerThickness} min={1} max={5} onChange={(v) => updateStyle('dividerThickness', v)} />
            </div>
            <Slider label="Divider Height" value={styles.dividerHeight} min={20} max={150} onChange={(v) => updateStyle('dividerHeight', v)} />
            <Slider label="Signature Width" value={styles.width} min={300} max={800} onChange={(v) => updateStyle('width', v)} />
            <div className="grid grid-cols-2 gap-4">
              <Slider label="Padding" value={styles.padding} min={0} max={60} onChange={(v) => updateStyle('padding', v)} />
              <Slider label="Column Gap" value={styles.columnGap} min={10} max={60} onChange={(v) => updateStyle('columnGap', v)} />
            </div>
            <Slider label="Line Spacing" value={styles.lineSpacing} min={0} max={20} onChange={(v) => updateStyle('lineSpacing', v)} />
          </Section>

          {/* Social Icons */}
          <Section title="Social Icons" icon={Share2}>
            <div className="flex flex-col gap-4">
              {data.socials.map((soc) => (
                <div key={soc.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center">
                        {React.createElement(SOCIAL_PLATFORMS.find(p => p.name === soc.platform)?.icon || Globe, { className: "w-4 h-4" })}
                      </div>
                      <select 
                        value={soc.platform} 
                        onChange={(e) => updateSocial(soc.id, 'platform', e.target.value)}
                        className="bg-transparent font-semibold text-sm focus:outline-none"
                      >
                        {SOCIAL_PLATFORMS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={soc.enabled} 
                        onChange={(e) => updateSocial(soc.id, 'enabled', e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                      />
                      <button onClick={() => removeSocial(soc.id)} className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    value={soc.url} 
                    onChange={(e) => updateSocial(soc.id, 'url', e.target.value)}
                    placeholder="Profile URL..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Icon</label>
                      <div className="flex items-center gap-2 p-1 bg-white border border-zinc-200 rounded-lg">
                        <input 
                          type="color" 
                          value={soc.color || styles.iconColor} 
                          onChange={(e) => updateSocial(soc.id, 'color', e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer"
                        />
                        <span className="text-[10px] font-mono text-zinc-500">{(soc.color || styles.iconColor).toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Background</label>
                      <div className="flex items-center gap-2 p-1 bg-white border border-zinc-200 rounded-lg">
                        <input 
                          type="color" 
                          value={soc.bgColor || styles.iconBgColor} 
                          onChange={(e) => updateSocial(soc.id, 'bgColor', e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer"
                        />
                        <span className="text-[10px] font-mono text-zinc-500">{(soc.bgColor || styles.iconBgColor).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={addSocial}
                className="w-full py-3 border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add Social Icon
              </button>

              <div className="mt-4 p-4 bg-blue-50 rounded-xl flex flex-col gap-4">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Icon Styling</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ColorPicker label="Icon Color" value={styles.iconColor} onChange={(v) => updateStyle('iconColor', v)} />
                  <ColorPicker label="Icon Background" value={styles.iconBgColor} onChange={(v) => updateStyle('iconBgColor', v)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select 
                    label="Style" 
                    value={styles.iconStyle} 
                    options={[{label:'Filled',value:'filled'},{label:'Outline',value:'outline'},{label:'Plain',value:'plain'}]} 
                    onChange={(v: any) => updateStyle('iconStyle', v)} 
                  />
                  <Select 
                    label="Shape" 
                    value={styles.iconShape} 
                    options={[{label:'Square',value:'square'},{label:'Rounded',value:'rounded'},{label:'Circle',value:'circle'},{label:'Pill',value:'pill'}]} 
                    onChange={(v: any) => updateStyle('iconShape', v)} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Slider label="Icon Size" value={styles.iconSize} min={10} max={30} onChange={(v) => updateStyle('iconSize', v)} />
                  <Slider label="Button Size" value={styles.buttonSize} min={20} max={60} onChange={(v) => updateStyle('buttonSize', v)} />
                </div>
                <Slider label="Spacing" value={styles.iconSpacing} min={0} max={30} onChange={(v) => updateStyle('iconSpacing', v)} />
              </div>
            </div>
          </Section>

          {/* Banner */}
          <Section title="Banner" icon={ImagePlus}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Banner Image</label>
              <div className="flex flex-col gap-4">
                <div className="w-full aspect-[4/1] rounded-xl bg-zinc-100 border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden">
                  {data.bannerImage ? (
                    <img src={data.bannerImage} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-zinc-300" />
                  )}
                </div>
                <label className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100 cursor-pointer transition-colors text-center">
                  Upload Banner Image
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'bannerImage')} />
                </label>
              </div>
            </div>
            <Input label="Banner Destination URL" value={data.bannerUrl} onChange={(v) => updateData('bannerUrl', v)} placeholder="https://..." icon={ExternalLink} />
            <div className="grid grid-cols-2 gap-4">
              <Slider label="Height" value={styles.bannerHeight} min={40} max={300} onChange={(v) => updateStyle('bannerHeight', v)} />
              <Slider label="Corner Radius" value={styles.bannerRadius} min={0} max={40} onChange={(v) => updateStyle('bannerRadius', v)} />
            </div>
          </Section>
        </div>

        {/* --- Footer Actions --- */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex flex-col gap-3">
          <button 
            onClick={copySignature}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${copied ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20 active:scale-[0.98]'}`}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Signature'}
          </button>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={downloadHTML}
              className="py-3 px-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-all flex flex-col items-center justify-center gap-1"
            >
              <Download className="w-4 h-4" /> HTML
            </button>
            <button 
              onClick={downloadPNG}
              className="py-3 px-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-all flex flex-col items-center justify-center gap-1"
            >
              <Camera className="w-4 h-4" /> PNG
            </button>
            <button 
              onClick={loadSample}
              className="py-3 px-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-all flex flex-col items-center justify-center gap-1"
            >
              <RefreshCw className="w-4 h-4" /> Sample
            </button>
          </div>
        </div>
      </div>

      {/* --- Right Panel: Preview --- */}
      <div className={`flex-1 flex flex-col ${previewMode === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100'} transition-colors duration-500`}>
        {/* Preview Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-lg border border-white/10">
              <button 
                onClick={() => setPreviewMode('light')}
                className={`p-2 rounded-md transition-all ${previewMode === 'light' ? 'bg-white text-blue-600 shadow-sm' : 'text-zinc-400 hover:text-white'}`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPreviewMode('dark')}
                className={`p-2 rounded-md transition-all ${previewMode === 'dark' ? 'bg-zinc-800 text-blue-400 shadow-sm' : 'text-zinc-400 hover:text-white'}`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Desktop Preview
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Live Rendering</span>
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div 
            layout
            className="relative group"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* Email Client Chrome Mock */}
            <div className="absolute -top-12 left-0 right-0 h-12 bg-white/50 backdrop-blur-md rounded-t-2xl border-x border-t border-zinc-200/50 flex items-center px-6 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/50" />
              <div className="w-3 h-3 rounded-full bg-amber-400/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/50" />
              <div className="ml-4 h-6 w-48 bg-zinc-200/50 rounded-full" />
            </div>

            <div 
              ref={previewRef}
              className="bg-white shadow-2xl rounded-b-2xl overflow-hidden border border-zinc-200/50"
              style={{ width: styles.width }}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: generateHTML() }} 
                className="signature-preview-content"
              />
            </div>

            {/* Floating Hint */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-zinc-400 text-xs font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="w-3 h-3" />
              Click "Copy Signature" to use in your email client
            </div>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e4e4e7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d4d4d8;
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=Montserrat:wght@300;400;500;600;700;900&family=Playfair+Display:wght@400;500;600;700;900&family=Roboto:wght@300;400;500;700;900&family=Open+Sans:wght@300;400;500;600;700;800&display=swap');
        
        .signature-preview-content table {
          border-collapse: collapse;
          margin: 0;
          padding: 0;
        }
        .signature-preview-content img {
          display: block;
        }
        .signature-preview-content a {
          text-decoration: none;
        }
      `}} />
    </div>
  );
}
