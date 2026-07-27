"use client";

import { useCallback, useEffect, useRef } from "react";
import { driver, type Config, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { format, addDays, subDays } from "date-fns";
import { hasSeenTutorial, markTutorialSeen } from "@/lib/tutorial-storage";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function waitFor(selector: string, timeout = 2000): Promise<HTMLElement | null> {
  const existing = document.querySelector<HTMLElement>(selector);
  if (existing) return Promise.resolve(existing);

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        observer.disconnect();
        clearTimeout(timer);
        resolve(el);
      }
    });
    const timer = setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

function waitForGone(selector: string, timeout = 2000): Promise<void> {
  if (!document.querySelector(selector)) return Promise.resolve();

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.querySelector(selector)) {
        observer.disconnect();
        clearTimeout(timer);
        resolve();
      }
    });
    const timer = setTimeout(() => {
      observer.disconnect();
      resolve();
    }, timeout);
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

const POPUP_SELECTOR = "[data-tour='day-status-popup']";

async function clickDayAndSelect(dateKey: string, type: "work" | "off") {
  const dayCell = await waitFor(`[data-date='${dateKey}']`);
  if (!dayCell || dayCell.hasAttribute("disabled")) return;

  dayCell.click();

  const popup = await waitFor(POPUP_SELECTOR);
  if (!popup) return;

  const optionButton = popup.querySelector<HTMLButtonElement>(
    `[data-tour='day-status-${type}']`
  );
  optionButton?.click();

  await waitForGone(POPUP_SELECTOR);
}

function todayKey() {
  return format(new Date(), "yyyy-MM-dd");
}

function offsetKey(offset: number) {
  const base = new Date();
  const date = offset >= 0 ? addDays(base, offset) : subDays(base, -offset);
  return format(date, "yyyy-MM-dd");
}

function dummyElement(): HTMLElement {
  let el = document.getElementById("driver-tour-anchor");
  if (!el) {
    el = document.createElement("div");
    el.id = "driver-tour-anchor";
    el.style.cssText = "position:fixed;top:50%;left:50%;width:0;height:0;pointer-events:none;";
    document.body.appendChild(el);
  }
  return el;
}

function elementResolver(selector: string) {
  return () => document.querySelector<HTMLElement>(selector) || dummyElement();
}

function makeStep(config: DriveStep, run?: () => Promise<void>): DriveStep {
  let ran = false;
  return {
    ...config,
    onHighlightStarted: (element, step, opts) => {
      if (run && !ran) {
        ran = true;
        void run();
      }
      config.onHighlightStarted?.(element, step, opts);
    },
  };
}

function buildSteps(): DriveStep[] {
  return [
    {
      popover: {
        title: "Welcome to Shifty",
        description:
          "Shifty helps you plan a repeating work/off shift rotation and see it laid out across the whole year. This tour will show you around automatically — just press Next.",
      },
    },
    makeStep(
      {
        element: elementResolver("[data-tour='year-select']"),
        popover: {
          title: "Pick a year",
          description: "Choose which year's calendar you want to plan or review.",
          side: "bottom",
          align: "start",
        },
      },
      async () => {
        const select = document.querySelector<HTMLElement>("[data-tour='year-select']");
        select?.click();
      }
    ),
    {
      element: "[data-tour='legend']",
      popover: {
        title: "Work vs. off days",
        description: "Green marks a work day, rose marks an off day, once a rotation is set.",
        side: "bottom",
      },
    },
    makeStep(
      {
        element: elementResolver(`[data-date='${todayKey()}']`),
        popover: {
          title: "Start your rotation",
          description: "Watch — clicking a date opens a popup to mark it Work or Off. Today just got marked as a Work day.",
          side: "top",
        },
      },
      async () => {
        await clickDayAndSelect(todayKey(), "work");
      }
    ),
    makeStep(
      {
        element: elementResolver(`[data-date='${offsetKey(2)}']`),
        popover: {
          title: "Extend the rotation",
          description:
            "Once a day is set, nearby dates become clickable to extend the pattern, one day at a time, up to 7 days. Watch the days around today fill in.",
          side: "top",
        },
      },
      async () => {
        await clickDayAndSelect(offsetKey(-1), "off");
        await sleep(150);
        await clickDayAndSelect(offsetKey(1), "work");
        await sleep(150);
        await clickDayAndSelect(offsetKey(2), "off");
      }
    ),
    makeStep(
      {
        element: elementResolver("[data-tour='month-reset']"),
        popover: {
          title: "Start over",
          description: "Reset clears the whole year's rotation. Watch — it just cleared the demo days we set above.",
          side: "bottom",
        },
      },
      async () => {
        const resetButton = document.querySelector<HTMLElement>("[data-tour='month-reset']");
        resetButton?.click();
      }
    ),
  ];
}

const TOUR_CONFIG: Omit<Config, "steps"> = {
  showProgress: true,
  overlayOpacity: 0.6,
  stagePadding: 6,
};

export function useTutorial() {
  const startedRef = useRef(false);

  const startTour = useCallback(() => {
    const driverObj = driver({
      ...TOUR_CONFIG,
      steps: buildSteps(),
      onDestroyed: () => {
        markTutorialSeen();
      },
    });
    driverObj.drive();
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (!hasSeenTutorial()) {
      startTour();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { startTour };
}
