import { CollectionType } from "@/constants";
import { IEvent } from "@/lib/database/models/event.model";
import Card from "./Card";
import PaginationHandler from "./PaginationHandler";

type CollectionProps = {
  data: Array<IEvent>;
  emptyTitle: string;
  emptyStateSubtext: string;
  collectionType: CollectionType;
  limit: number;
  page: number | string;
  totalPages?: number;
  urlParamName?: string;
};
const Collection = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  limit,
  page,
  totalPages,
  urlParamName,
  collectionType,
}: CollectionProps) => {
  return (
    <>
      {data?.length ? (
        <div className="flex flex-col items-center gap-10">
          <ul className="grid grid-cols-1 w-full gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
            {data.map((event: IEvent) => {
              const hasOrderLink =
                collectionType === CollectionType.eventOrganized;
              const hidePrice = collectionType === CollectionType.myTickets;

              return (
                <li key={event._id} className="flex justify-center">
                  <Card
                    event={event}
                    hidePrice={hidePrice}
                    hasOrderLink={hasOrderLink}
                  />
                </li>
              );
            })}
          </ul>
          {totalPages && totalPages > 1 && (
            <PaginationHandler
              urlParamName={urlParamName}
              page={page}
              totalPages={totalPages}
            />
          )}
        </div>
      ) : (
        <div className="flex-center wrapper min-h-[200px] w-full flex flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
          <h3 className="p-bold-20 md:h5-bold">{emptyTitle}</h3>
          <p className="p-regular-14">{emptyStateSubtext}</p>
        </div>
      )}
    </>
  );
};

export default Collection;
