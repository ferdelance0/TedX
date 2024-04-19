from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests

class ActionCreateEvent(Action):
    def name(self) -> Text:
        return "action_create_event"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        event_name = tracker.get_slot("event_name")
        event_description = tracker.get_slot("event_description")
        event_date = tracker.get_slot("event_date")
        event_location = tracker.get_slot("event_location")

        # Make a POST request to the server to create the event
        response = requests.post("http://localhost:3000/createevents", json={
            "eventname": event_name,
            "eventdescription": event_description,
            "eventscheduleddate": event_date,
            "eventvenue": event_location
        })

        if response.status_code == 200:
            dispatcher.utter_message(text="Event created successfully!")
        else:
            dispatcher.utter_message(text="Failed to create the event. Please try again.")

        return []