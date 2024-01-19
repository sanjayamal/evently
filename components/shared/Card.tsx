import { FREE } from "@/constants";
import { IEvent } from "@/lib/database/models/event.model";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import DeleteConfirmation from "./DeleteConfirmation";

type CardProps = {
  event: IEvent;
  hidePrice?: boolean;
  hasOrderLink?: boolean;
};

const Card = ({ event, hidePrice, hasOrderLink }: CardProps) => {
  const {
    _id,
    imageUrl,
    isFree,
    price,
    category,
    startDateTime,
    title,
    location,
    organizer,
  } = event;
  const { name: categoryName } = category;
  const { firstName, lastName, _id: organizerId } = organizer;

  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const isEventCreator = userId === organizerId.toString();

  return (
    <div
      className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden 
    rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]"
    >
      <Link
        href={`/events/${_id}`}
        style={{ backgroundImage: `url(${imageUrl})` }}
        className="flex-center flex-grow bg-gray-50  bg-cover bg-center text-grey-50"
      />
      {isEventCreator && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <Link href={`/events/${_id}/update`}>
            <Image
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            />
          </Link>
          <DeleteConfirmation eventId={_id} />
        </div>
      )}
      <Link
        href={`/events/${_id}`}
        className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4"
      >
        {!hidePrice && (
          <div className="flex gap-2">
            <span className="p-semibold-14 w-min rounded-full text-green-60 bg-green-200 px-4 py-1">
              {isFree ? FREE : `$${price}`}
            </span>
            <p className="p-semibold-14  bg-grey-500/10 text-grey-500 w-min rounded-full px-4 py-1 line-clamp-1">
              {categoryName}
            </p>
          </div>
        )}
        <div className="flex flex-row gap-4 justify-between">
          <p className="p-medium-16 p-medium-18 text-grey-500">
            {formatDateTime(startDateTime).dateTime}
          </p>
          <div className="p-medium-18 flex item-center ">
            <Image
              src="/assets/icons/location.svg"
              alt="location"
              width={18}
              height={18}
            />
            <p className="p-medium-16 ">{location}</p>
          </div>
        </div>
        <p className="p-medium-16 md:p-medium-20 line-clamp-2 text-black flex-1">
          {title}
        </p>
        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-grey-600">
            {firstName} {lastName}
          </p>

          {hasOrderLink && (
            <Link href={`/orders?eventId=${_id}`} className="flex gap-2">
              <p className="text-primary-500">Order Details</p>
              <Image
                src="/assets/icons/arrow.svg"
                alt="search"
                width={10}
                height={10}
              />
            </Link>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Card;
