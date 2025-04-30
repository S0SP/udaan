import { DeliveryTracking } from "@/components/customer/delivery-tracking"

export default function DeliveryTrackingPage({ params }: { params: { id: string } }) {
  return <DeliveryTracking orderId={params.id} />
}
