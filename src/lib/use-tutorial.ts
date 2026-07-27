"use client";

import { useCallback, useEffect } from "react";
import { driver, type Config } from "driver.js";
import "driver.js/dist/driver.css";
import { hasSeenTutorial, markTutorialSeen } from "@/lib/tutorial-storage";

const TOUR_CONFIG: Config = {
  showProgress: true,
  overlayOpacity: 0.6,
  stagePadding: 6,
  steps: [
    {
      popover: {
        title: "Welcome to Shifty",
        description:
          "Shifty helps you plan a repeating work/off shift rotation and see it laid out across the whole year.",
      },
    },
    {
      element: "[data-tour='year-select']",
      popover: {
        title: "Pick a year",
        description: "Choose which year's calendar you want to plan or review.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='legend']",
      popover: {
        title: "Work vs. off days",
        description: "Green marks a work day, rose marks an off day, once a rotation is set.",
        side: "bottom",
      },
    },
    {
      element: "[data-tour='calendar-grid']",
      popover: {
        title: "Start your rotation",
        description:
          "Click any date to open a small popup and mark it Work or Off. That's the start of your rotation.",
        side: "top",
      },
    },
    {
      element: "[data-tour='calendar-grid']",
      popover: {
        title: "Extend the rotation",
        description:
          "Once a day is set, hover nearby dates to see a triangle appear — those are the days you can add to extend the pattern, one day at a time, up to 7 days.",
        side: "top",
      },
    },
    {
      element: "[data-tour='month-reset']",
      popover: {
        title: "Start over",
        description: "Use Reset on any month card to clear the whole year's rotation.",
        side: "bottom",
      },
    },
  ],
};

export function useTutorial() {
  const startTour = useCallback(() => {
    const driverObj = driver({
      ...TOUR_CONFIG,
      onDestroyed: () => {
        markTutorialSeen();
      },
    });
    driverObj.drive();
  }, []);

  useEffect(() => {
    if (!hasSeenTutorial()) {
      startTour();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { startTour };
}
