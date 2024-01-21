import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { CollectionType } from "@/constants";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const ProfilePage = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const organizedEvents = await getEventsByUser({ userId, page: 1 });
  return (
    <>
      <section className="bg-primary-50 bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild size='lg' className='button hidden sm:flex'> 
            <Link href="/events">Explore More Events</Link>
          </Button>
        </div>
      </section>
      <section className="wrapper my-8">
        <Collection
          data={[]}
          emptyTitle="No Events tickets purchased yet"
          emptyStateSubtext="No worries - plenty of exciting events to explore!"
          collectionType={CollectionType.myTickets}
          limit={3}
          page={1}
          totalPages={1}
          urlParamName="ordersPage"
        />
      </section>
      <section className="bg-primary-50 bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Event Organized</h3>
          <Button asChild size='lg' className='button hidden sm:flex'>
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </section>
      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="No Events have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType={CollectionType.eventOrganized}
          limit={6}
          page={1}
          totalPages={organizedEvents?.totalPages}
          urlParamName="eventsPage"
        />
      </section>
    </>
  );
};

export default ProfilePage;
