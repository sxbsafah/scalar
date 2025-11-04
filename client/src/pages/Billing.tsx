import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { BadgeCheck, TriangleAlert, Zap } from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import BillingSkeleton from "@/components/BillingSkeleton";
import formatDate from "@/lib/formateDate";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const Billing = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const subscription = useQuery(api.subscriptions.getSubscription, {});

  const createPremiumCheckoutSession = useAction(
    api.stripe.createPremiumCheckoutSession
  );
  const createBillingPortalSession = useAction(
    api.stripe.createBillingPortalSession
  );

  const handlePortalCreation = async () => {
    setIsProcessing(true);
    try {
      const session = await createBillingPortalSession();
      if (session) {
        window.location.href = session.portal_url;
      }
    } catch (error) {
      toast.error(
        "Redirecting To Billing Portail Failed, Please Try Again Later",
        {
          position: "bottom-right",
        }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBillingCreation = async () => {
    setIsProcessing(true);
    try {
      const session = await createPremiumCheckoutSession({
        plan: "month",
      });
      if (session) {
        window.location.href = session.checkout_url;
      }
    } catch (error) {
      toast.error("Creating Checkout Session Failed, Please Try Again Later", {
        position: "bottom-right",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <>
      <Title Title="Billing" subTitle="Manage your Billing" />
      {subscription ? (
        <div className="bg-card p-6 rounded-lg relative overflow-hidden z-10">
          <div className="flex items-center gap-3 mb-2">
            <BadgeCheck size={30} />
            <h1 className="text-3xl font-bold">
              {subscription.subscription ? "Active" : "Free"} Subscription
            </h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Manage Your Subsciption Details Below
          </p>
          <div className="bg-muted px-8 py-6 rounded-xl shadow-xl mb-8">
            <div className="flex justify-between mb-6">
              <div>
                <h3 className="text-[20px] text-muted-foreground font-medium">
                  Plan
                </h3>
                <h2 className="text-2xl font-semibold">
                  {subscription.subscription?.planType || "Free"}
                </h2>
              </div>
              <div>
                <h3 className="text-[20px] text-muted-foreground font-medium">
                  Status
                </h3>
                <h2 className="text-2xl font-semibold">Active</h2>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-[20px] text-muted-foreground font-medium">
                Next Billing Date
              </h3>
              <h2 className="text-2xl font-semibold">
                {subscription?.subscription?.endingDate
                  ? formatDate(subscription.subscription?.endingDate as number)
                  : "N/A"}
              </h2>
            </div>
            {subscription.subscription?.cancelAtPeriodEnd && (
              <div className="bg-destructive/20 text-destructive px-4 py-3 rounded-md flex items-center gap-3 w-fit">
                <TriangleAlert />
                <p>
                  Your Subscription Will be Cancelled at the end of the current
                  billing Period
                </p>
              </div>
            )}
          </div>
          {subscription.subscription ? (
            <div className="w-fit ml-auto">
              <Button
                variant="outline"
                disabled={isProcessing}
                onClick={() => handlePortalCreation()}
              >
                {isProcessing ? (
                  <>
                    <Spinner />
                    Processing
                  </>
                ) : (
                  "Manage Your Billing"
                )}
              </Button>
            </div>
          ) : (
            <div className="w-fit ml-auto">
              <Button
                disabled={isProcessing}
                onClick={() => handleBillingCreation()}
              >
                {isProcessing ? (
                  <>
                    <Spinner />
                    Processing
                  </>
                ) : (
                  <>
                    <Zap />
                    Upgrade To Pro
                  </>
                )}
              </Button>
            </div>
          )}
          <div className="bg-[#ddd]/5 w-60 h-60 absolute -top-[120px] -left-[140px] rounded-full blur-3xl z-10"></div>
        </div>
      ) : (
        <BillingSkeleton />
      )}
    </>
  );
};

export default Billing;
