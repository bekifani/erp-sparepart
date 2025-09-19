import * as lucideIcons from "lucide-react";
import { twMerge } from "tailwind-merge";

export const { icons } = lucideIcons;

interface LucideProps extends React.ComponentPropsWithoutRef<"svg"> {
  icon: string;
  title?: string;
}

function Lucide(props: LucideProps) {
  const { icon, className, ...computedProps } = props;
  
  // Convert kebab-case to PascalCase for lucide-react compatibility
  const convertToPascalCase = (str: string) => {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  };
  
  // Try to get the component with the original name first, then try PascalCase conversion
  let Component = (lucideIcons as any)[icon] || (lucideIcons as any)[convertToPascalCase(icon)];
  
  // Fallback to common icon mappings
  if (!Component) {
    const iconMappings: { [key: string]: any } = {
      'plus': lucideIcons.Plus,
      'edit': lucideIcons.Edit,
      'trash-2': lucideIcons.Trash2,
      'list': lucideIcons.List,
      'alert-triangle': lucideIcons.AlertTriangle,
      'info': lucideIcons.Info,
    };
    Component = iconMappings[icon];
  }
  
  // If still no component found, use a default icon or return null
  if (!Component) {
    console.warn(`Lucide icon "${icon}" not found`);
    Component = lucideIcons.HelpCircle; // Default fallback icon
  }
  
  return (
    <Component
      {...computedProps}
      className={twMerge(["stroke-[1] w-5 h-5", props.className])}
    />
  );
}

export default Lucide;
