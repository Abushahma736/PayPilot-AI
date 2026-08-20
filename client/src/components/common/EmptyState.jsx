import { PackageOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = PackageOpen, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mb-4">
        <Icon size={28} className="text-surface-500" />
      </div>
      <h3 className="text-lg font-semibold text-surface-300 mb-1">{title}</h3>
      <p className="text-sm text-surface-500 max-w-md mb-6">{message}</p>
      {action && action}
    </div>
  );
}
