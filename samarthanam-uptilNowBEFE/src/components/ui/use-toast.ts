import { toast } from 'sonner';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

export const useToast = () => {
  const showToast = ({ title, description, variant = 'default' }: ToastProps) => {
    if (variant === 'destructive') {
      toast.error(title, {
        description: description,
      });
    } else {
      toast.success(title, {
        description: description,
      });
    }
  };

  return { toast: showToast };
};
