import React from 'react';
import {
  Hammer,
  Wrench,
  Zap,
  Paintbrush,
  Layers,
  Shield,
  Compass,
  Box,
  Trees,
  Building2,
  HardHat,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name.toLowerCase()) {
    case 'hammer':
    case 'pedreiro':
      return <Hammer {...props} />;
    case 'wrench':
    case 'encanador':
      return <Wrench {...props} />;
    case 'zap':
    case 'eletricista':
      return <Zap {...props} />;
    case 'paintbrush':
    case 'pintor':
      return <Paintbrush {...props} />;
    case 'layers':
    case 'gesseiro':
      return <Layers {...props} />;
    case 'shield':
    case 'serralheiro':
      return <Shield {...props} />;
    case 'compass':
    case 'engenheiro-arquiteto':
    case 'engenharia-arquitetura':
      return <Compass {...props} />;
    case 'box':
    case 'marcenaria':
      return <Box {...props} />;
    case 'trees':
    case 'jardinagem':
      return <Trees {...props} />;
    case 'building2':
    case 'materiais-construcao':
      return <Building2 {...props} />;
    default:
      return <HardHat {...props} />;
  }
};
