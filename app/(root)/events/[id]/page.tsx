import Collection from "@/components/shared/Collection";
import { CollectionType, FREE, eventDefaultValues } from "@/constants";
import {
  getEventById,
  getRelatedEventsByCategory,
} from "@/lib/actions/event.actions";
import { formatDateTime } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import React from "react";

const EventDetail = async ({
  params: { id },
  searchParams,
}: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const event = await getEventById(id);
  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: page.toString(),
  });

  if (!event) return;

  const {
    imageUrl,
    title,
    isFree,
    price,
    startDateTime,
    category,
    organizer,
    endDateTime,
    location,
    description,
    url,
  } = event;
  const { firstName, lastName } = organizer;

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={imageUrl}
            alt="Event Image"
            width={800}
            height={800}
            className="h-full min-h-[300px] object-cover object-center"
          />
          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col">
              <h2 className="h2-bold">{title}</h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    {isFree ? FREE : `$${price}`}
                  </p>
                  <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                    {category.name}
                  </p>
                </div>
                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  by{" "}
                  <span className="text-primary-500">
                    {firstName} {lastName}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="calendar"
                  width={32}
                  height={32}
                />
                <div className="p-medium-16 lg:p-regular-20 flex flex-col md:flex-row gap-1 md:gap-3">
                  <p>
                    {formatDateTime(startDateTime).dateOnly} -{" "}
                    {formatDateTime(startDateTime).timeOnly}
                  </p>
                  <p>
                    {formatDateTime(endDateTime).dateOnly} -{" "}
                    {formatDateTime(endDateTime).timeOnly}
                  </p>
                </div>
              </div>
              <div className="p-regular-20 flex item-center gap-3">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location"
                  width={32}
                  height={32}
                />
                <p className="p-medium-16 lg:p-regular-20">{location}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600">Description:</p>
              <p className="p-medium-16 lg:p-regular-18">{description}</p>
              <p className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline">
                {url}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Related Events</h2>
        <Collection
          data={relatedEvents?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType={CollectionType.allEvents}
          limit={6}
          page={page}
          totalPages={relatedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default EventDetail;
