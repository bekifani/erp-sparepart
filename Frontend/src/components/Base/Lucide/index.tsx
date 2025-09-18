import * as lucideIcons from "lucide-react";
import { twMerge } from "tailwind-merge";

interface LucideProps extends React.ComponentPropsWithoutRef<"svg"> {
  icon: keyof typeof lucideIcons;
  title?: string;
}

function Lucide(props: LucideProps) {
  const { icon, className, ...computedProps } = props;
  const Component = lucideIcons[props.icon] as React.ComponentType<any>;
  
  if (!Component) {
    console.warn(`Lucide icon "${props.icon}" not found`);
    return null;
  }
  
  return (
    <Component
      {...computedProps}
      className={twMerge(["stroke-[1] w-5 h-5", props.className])}
    />
  );
}

export default Lucide;
