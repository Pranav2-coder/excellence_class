import { Zap } from 'lucide-react';

export default function DemoBadge() {
  return (
    <span className="demo-badge animate-pulse-slow">
      <Zap size={11} className="fill-amber-500" />
      Demo Version
    </span>
  );
}
