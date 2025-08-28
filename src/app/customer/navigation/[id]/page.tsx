import { DeliveryTracking } from "@/components/customer/delivery-tracking"

type PageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function DeliveryTrackingPage({ params }: PageProps) {
  return <DeliveryTracking orderId={params.id} />
}
