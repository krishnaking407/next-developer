import { useRazorpay } from "@/hooks/useRazorpay";
import AIPowerCollection from "@/components/AIPowerCollection";
export default function AIProductsSection() {
  const { handlePurchase, processing } = useRazorpay();

  return (
    <AIPowerCollection handlePurchase={handlePurchase} processing={processing} />
  );
}
