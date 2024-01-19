import EventForm from "@/components/shared/EventForm";
import { EventFormAction } from "@/constants";
import { getEventById } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs";

const UpdateEvent = async ({ params: { id } }: SearchParamProps) => {
  const event = await getEventById(id);
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  return (
    <>
      <section className="bg-primary-50 bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>
      <div className="wrapper  my-8">
        <EventForm
          userId={userId}
          type={EventFormAction.update}
          event={event}
          eventId={event._id}
        />
      </div>
    </>
  );
};

export default UpdateEvent;
