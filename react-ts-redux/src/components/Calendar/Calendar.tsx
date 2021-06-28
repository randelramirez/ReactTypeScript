import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { addZero } from "../../lib/utils";
import { RootState } from "../../redux/store";
import {
  loadUserEvents,
  selectUserEvents,
  UserEvent,
} from "../../redux/user-events";
import "./Calendar.css";
import EventItem from "./EventItem";

const mapState = (state: RootState) => ({ events: selectUserEvents(state) });

const mapDispatch = {
  loadUserEvents,
};

const connector = connect(mapState, mapDispatch);

// PropsFromRedux infers the type connector, this way whatever is mapState & mapDispatch will be inferred
type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {}

export const createDateKey = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${addZero(year)}-${addZero(month)}-${addZero(day)}`;
};

const groupEventsByDay = (events: UserEvent[]) => {
  const groups: Record<string, UserEvent[]> = {};
  const addToGroup = (dateKey: string, event: UserEvent) => {
    if (groups[dateKey] === undefined) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(event);
  };

  events.forEach((event) => {
    const dateStartKey = createDateKey(new Date(event.dateStart));
    const dateEndKey = createDateKey(new Date(event.dateEnd));

    addToGroup(dateStartKey, event);

    if (dateEndKey !== dateStartKey) {
      addToGroup(dateEndKey, event);
    }
  });

  return groups;
};

//NOTE: We can also just use PropsFromRedux as the generic parameter on React.FC<>
export const Calendar: React.FC<Props> = ({ events, loadUserEvents }) => {
  useEffect(() => {
    loadUserEvents();
  }, [loadUserEvents]);
  let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined;
  let sortedGroupKeys: string[] | undefined;

  if (events.length) {
    groupedEvents = groupEventsByDay(events);
    sortedGroupKeys = Object.keys(groupedEvents).sort(
      (date1, date2) => +new Date(date2) - +new Date(date1)
    );
  }

  return groupedEvents && sortedGroupKeys ? (
    <div className="calendar">
      {sortedGroupKeys.map((dayKey) => {
        // fix for groupedEvents Object is possibly 'undefined'
        // we can use either ! operator or do a manual check
        // const events = groupedEvents![dayKey]; //groupedEvents[dayKey];
        const events = groupedEvents ? groupedEvents[dayKey] : [];
        const groupDate = new Date(dayKey);
        const day = groupDate.getDate();
        const month = groupDate.toLocaleString(undefined, { month: "long" });

        return (
          <div className="calendar-day">
            <div className="calendar-day-label">
              <span>
                {day} {month}
              </span>
            </div>
            <div className="calendar-events">
              {events.map((event) => {
                return (
                  <EventItem
                    key={`event_${event.id}`}
                    event={event}
                  ></EventItem>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p>Loading...</p>
  );
};

// export default connect(mapState, mapDispatch)(Calendar);
export default connector(Calendar);
