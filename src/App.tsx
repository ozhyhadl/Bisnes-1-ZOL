import { Toaster as Sonner } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const DownloadPage = lazy(() => import("./pages/Download"));
const NotFound = lazy(() => import("./pages/NotFound"));

const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={null}>{children}</Suspense>
);

const App = () => (
  <>
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/privacy" element={<LazyRoute><PrivacyPolicy /></LazyRoute>} />
        <Route path="/terms" element={<LazyRoute><TermsOfService /></LazyRoute>} />
        <Route path="/download" element={<LazyRoute><DownloadPage /></LazyRoute>} />
        <Route path="*" element={<LazyRoute><NotFound /></LazyRoute>} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  </>
);

export default App;
