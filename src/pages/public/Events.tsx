import placeHolderImage from "@/assets/placeHolderImage.png";
import Event from "@/components/Event";
import { useState } from "react";

export default function Events() {
  const upcomingEvents = [];

  for (let i = 0; i < 5; i++) {
    upcomingEvents.push(
      <Event
        key={i}
        title={`Event ${i + 1}`}
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Error eius nisi ex veniam optio minima a et nostrum qui soluta, aperiam nihil ad dolorem omnis, labore tempore expedita vitae possimus!"
        imageUrl={placeHolderImage}
      />,
    );
  }

  const previousEvents = [];

  for (let i = 0; i < 5; i++) {
    previousEvents.push(
      <Event
        key={i}
        title={`Previous Event ${i + 1}`}
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Error eius nisi ex veniam optio minima a et nostrum qui soluta, aperiam nihil ad dolorem omnis, labore tempore expedita vitae possimus!"
        imageUrl={placeHolderImage}
      />,
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upcoming Events:</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 justify-items-center">
        {upcomingEvents}
      </div>
      <h1 className="text-2xl font-bold my-4">Previous Events:</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 justify-items-center">
        {previousEvents}
      </div>
    </div>
  );
}
