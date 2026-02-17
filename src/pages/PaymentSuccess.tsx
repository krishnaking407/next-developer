import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { 
  CheckCircle2, 
  ExternalLink, 
  LayoutDashboard, 
  Copy, 
  Check, 
  Send, 
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);

  const productName = searchParams.get("productName") ?? "Premium Product";
  const amount = searchParams.get("amount") ?? "0";
  const paymentId = searchParams.get("paymentId") ?? "PAY-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  // सेलिब्रेशन इफेक्ट
  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00ff00', '#00ffee', '#ffffff']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00ff00', '#00ffee', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const telegramText = `Hello 👋\n\nI've just completed a purchase on Next Developer.\n\n• Product: ${productName}\n• Amount: ₹${amount}\n• Payment ID: ${paymentId}\n\nCould you please share the access/details for this purchase?\n\nThank you! 🙏✨`;
  const telegramHref = `https://t.me/krishnaking407?text=${encodeURIComponent(telegramText)}`;

  return (
    <Layout>
      <section className="min-h-screen py-12 relative overflow-hidden flex items-center">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/50 mb-6 relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </motion.div>
              <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-green-100 to-white">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Your order for <span className="text-primary font-semibold">{productName}</span> has been confirmed.
            </p>
          </motion.div>

          <div className="grid max-w-5xl mx-auto gap-8 lg:grid-cols-2">
            {/* Payment Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="h-full border-white/10 hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Order Summary
                </h3>
                
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Product</span>
                      <span className="font-semibold">{productName}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <span className="text-muted-foreground">Amount Paid</span>
                      <span className="text-2xl font-bold text-primary">₹{amount}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Transaction ID</label>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-black/40 border border-white/10 font-mono text-sm group">
                      <span className="flex-1 truncate">{paymentId}</span>
                      <button 
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-white/10 rounded-md transition-colors text-primary"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Next Steps Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="h-full border-primary/20 bg-primary/5">
                <div className="relative h-full flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">How to get access?</h3>
                    <p className="text-sm text-muted-foreground">
                      Follow these 2 simple steps to activate your purchase:
                    </p>
                  </div>

                  <div className="space-y-6 mb-8 flex-grow">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                      <p className="text-sm leading-relaxed">Click the <span className="text-primary font-semibold">Message on Telegram</span> button below.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                      <p className="text-sm leading-relaxed">Send the pre-filled message. Our team will verify and grant access within <span className="text-white font-semibold">5-10 minutes</span>.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <a
                      href={telegramHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#229ED9] hover:bg-[#28a8e9] text-white font-bold text-lg shadow-[0_0_20px_rgba(34,158,217,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Send className="w-5 h-5 animate-bounce-x" />
                      Message on Telegram
                      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </a>
                    
                    <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">
                      Support Available 24/7
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Bottom Actions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/dashboard">
              <GlowButton variant="secondary" className="min-w-[200px]">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Go to Dashboard
              </GlowButton>
            </Link>
            <Link to="/shop" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tailwind Custom Animation in global.css or style tag */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}} />
    </Layout>
  );
}