import { Button } from "@/components/ui/button";
import { Check, CreditCard, BookOpen } from "lucide-react"
import { Link, useSearchParams } from "react-router"




const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  return (
    <main className="h-screen flex items-center justify-center">
      <div className='px-8 py-6 border border-border bg-card rounded-sm shadow-lg text-center'>
        <div className="flex flex-col items-center gap-2 mb-4">
          <Check className="size-24" color={"#00c951"} />
          <h1 className="text-3xl font-semibold text-[#00c951]">Purchase Successfuly</h1>
        </div>
        <h2 className="text-2xl font-semibold leading-10 text-card-foreground mb-6">Thank you for Buying Our Premium Product. Your Journey To new Skills and Knowledge begins now </h2>
        <div className="text-muted-foreground bg-muted p-3 text-center mb-6 rounded-sm">
          <h3>TransactionId: </h3>
          <h4>{searchParams.get("session_id")}</h4>
        </div>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button>
              <BookOpen />
              Go To Library
            </Button>
          </Link>
          <Link to="/billing">
            <Button variant="outline">
              <CreditCard />
              Go To Billing
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default PaymentSuccess