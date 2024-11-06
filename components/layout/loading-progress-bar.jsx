'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

function LoadingProgressBar() {
   return <ProgressBar height="4px" color="#0929A7" options={{ showSpinner: false }} />;
}

export default LoadingProgressBar;
