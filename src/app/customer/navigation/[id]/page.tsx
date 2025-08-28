import { DeliveryTracking } from "@/components/customer/delivery-tracking"

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DeliveryTrackingPage({ params }: PageProps) {
  const { id } = await params;
  return <DeliveryTracking orderId={id} />
}
