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
      sharedCustomProps: {
        [key: string]: Record<string, any>,
      }
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

export const updateSharedCustomPropsForType = (type: string, sharedCustomPropsForType: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.metricalp) {
    if (!window.metricalp.sharedCustomProps) {
      window.metricalp.sharedCustomProps = { _global: {} };
    }
    window.metricalp.sharedCustomProps[type] = sharedCustomPropsForType;
  }
}

export const resetSharedCustomProps = (sharedCustomProps: {
  [key: string]: Record<string, any>,
}) => {
  if (typeof window !== 'undefined' && window.metricalp) {
    window.metricalp.sharedCustomProps = sharedCustomProps;
    if (!window.metricalp.sharedCustomProps._global) {
      window.metricalp.sharedCustomProps._global = {};
    }
  }
}

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
  initialSharedCustomProps?: Record<string, any>
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
  initialSharedCustomProps
}) => {
  if (typeof window !== 'undefined' && initialSharedCustomProps && window.metricalp && !window.metricalp.sharedCustomProps) {
      window.metricalp.sharedCustomProps = initialSharedCustomProps;
    if (!window.metricalp.sharedCustomProps._global) {
      window.metricalp.sharedCustomProps._global = {};
    }
  }

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
