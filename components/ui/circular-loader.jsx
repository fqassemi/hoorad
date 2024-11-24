import { Loader2 } from 'lucide-react';

function CircularLoader({ className }) {
   return <Loader2 className={`mx-auto size-8 animate-spin text-black lg:size-12 ${className}`} />;
}

export default CircularLoader;
