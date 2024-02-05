import React, { useCallback } from 'react';
import { useScript } from 'use-script';

type MetricalpEvent = {
  type: string;
  [key: string]: string | number | boolean | undefined;
};

declare global {
  interface Window {
    metricalp: {
      tid?: string;
      version?: string;
      queue?: MetricalpEvent[];
      event: (e: MetricalpEvent) => void;
    };
  }
}

if (typeof window !== 'undefined') {
  window.metricalp = window.metricalp || {
    queue: [],
    event: function (e: MetricalpEvent) {
      this.queue?.push(e);
    },
  };
}

export const metricalpEvent = (e: MetricalpEvent) => {
  if (typeof window === 'undefined') return;
  window.metricalp?.event(e);
};

const SCRIPT_URL = 'https://cdn.metricalp.com/event/metricalp.js';

export const METRICALP_SCREEN_VIEW_EV = 'screen_view';

interface MetricalpProviderProps {
  children?: any;
  tid: string;
  customEventEndpoint?: string;
  customScriptUrl?: string;
  allowLocalhost?: boolean;
  allowCustomElmEvents?: boolean;
  disableAutoRouteCatch?: boolean;
  hashRouting?: boolean;
}

export const MetricalpReactProvider: React.FC<MetricalpProviderProps> = ({
  children = null,
  tid,
  customEventEndpoint,
  customScriptUrl,
  allowLocalhost,
  allowCustomElmEvents,
  disableAutoRouteCatch,
  hashRouting,
}) => {
  useScript(customScriptUrl || SCRIPT_URL, {
    removeOnUnmount: false,
    customAttributes: {
      'data-tid': tid,
      'data-custom-event-endpoint': customEventEndpoint || undefined,
      'data-allow-localhost': allowLocalhost ? 'true' : 'false',
      'data-disable-auto-route-catch': disableAutoRouteCatch ? 'true' : 'false',
      'data-disable-custom-elm-events': allowCustomElmEvents ? 'false' : 'true',
      'data-hash-routing': hashRouting ? 'true' : 'false',
    },
  });

  return children;
};

export const useMetricalp = () => {
  const sendEvent = useCallback((e: MetricalpEvent) => {
    metricalpEvent(e);
  }, []);

  return sendEvent;
};
