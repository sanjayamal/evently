export const headerLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "Create Event",
    route: "/events/create",
  },
  {
    label: "My Profile",
    route: "/profile",
  },
];

export const eventDefaultValues = {
  title: "",
  description: "",
  location: "",
  imageUrl: "",
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: "",
  price: "",
  isFree: false,
  url: "",
};

export const enum CollectionType {
  eventOrganized = "Events_Organized",
  allEvents = "All_Events",
  myTickets = "My_Tickets",
}

export const enum EventFormAction {
  create = "Create",
  update = "Update",
}

export const FREE = "FREE";
