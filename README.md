# Metricalp Official React & NextJS Integration Library

[metricalp.com](https://www.metricalp.com) NextJS and React provider to make integration smooth. It works with Vite, CRA, NextJS 13 App Router, NextJS Pages Router and all React implementations. Please see official documentation pages of [React integration](https://metricalp.com/docs/react) and [NextJS Integration](https://metricalp.com/docs/nextjs)

## Installation

```
yarn add @metricalp/react
```

or

```
npm install @metricalp/react
```

## Integration

In your app's top level `src/index.js` | `src/main.tsx`(Vite) | `src/app/layout.tsx`(NextJS App Router) | `pages/_app.tsx`(NextJS Pages Router)  | `App.js`

wrap your app with `MetricalpReactProvider`. If you are using NextJS 13 App Router, you *don't need* to add 'use client' because this library already has it under the hood 🫡


### NextJS App Router Integration Example

In `src/app/layout.tsx` import library

`import { MetricalpReactProvider } from '@metricalp/react';`

Then wrap your app with `<MetricalpReactProvider allowLocalhost tid='XXXXXX'>`

**DON'T FORGET** to replace tid prop with your _tid_.

We added `allowLocalhost` because defaultly metricalp doesn't work in localhost to protect your quota limits. We allowed localhost for testing purposes. You would want to remove it after testing it once to save your quota.

```
import type { Metadata } from 'next';
import { MetricalpReactProvider } from '@metricalp/react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MetricalpReactProvider allowLocalhost tid="XXXXXX">
            {children}
        </MetricalpReactProvider>
      </body>
    </html>
  );
}
```

### NextJS Pages Router Integration Example

In `src/pages/_app.tsx` import library

`import { MetricalpReactProvider } from '@metricalp/react';`

Then wrap your app with `<MetricalpReactProvider allowLocalhost tid='XXXXXX'>`

**DON'T FORGET** to replace tid prop with your _tid_.

We added `allowLocalhost` because defaultly metricalp doesn't work in localhost to protect your quota limits. We allowed localhost for testing purposes. You would want to remove it after testing it once to save your quota.

```
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { MetricalpReactProvider } from '@metricalp/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MetricalpReactProvider allowLocalhost tid="XXXXXX">
      <Component {...pageProps} />
    </MetricalpReactProvider>
  );
}

```

### Vite React App Integration Example

In `src/main.tsx` import library

`import { MetricalpReactProvider } from '@metricalp/react';`

Then wrap your app with `<MetricalpReactProvider allowLocalhost tid='XXXXXX'>`

**DON'T FORGET** to replace tid prop with your _tid_.

We added `allowLocalhost` because defaultly metricalp doesn't work in localhost to protect your quota limits. We allowed localhost for testing purposes. You would want to remove it after testing it once to save your quota.

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MetricalpReactProvider } from '@metricalp/react';
import './index.css';
import { App } from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MetricalpReactProvider allowLocalhost tid="XXXXXX">
      <App />
    </MetricalpReactProvider>
  </React.StrictMode>
);
```


## USAGE

If you _integrated_ library with your app, it automatically starts to tracking `screen_view` events. Metricalp listens for window.history changes and creates screen_view event on every path change defaultly. So, if you want to track only screen views then your app is ready just after integration. You don't need to do anything extra. But if you want to produce custom events or disable auto route tracking and you will create screen_view events manually then follow this section.

### Produce Events

You have two options to produce Metricalp events with this library. A hook or direct function call.

#### Event produce with Hook

```
import { useMetricalp } from '@metricalp/react';

export default function MyComponent() {
  // Call hook to get the metricalp event function
  const metricalpEvent = useMetricalp();

  return (
    <div>
      <button
        onClick={() => {
          metricalpEvent({ type: 'click_test_button', custom_prop1: 'hook' });
        }}
      >
        Click me
      </button>
    </div>
  );
}
```

#### Event produce with Direct function call

Sometimes (outside of components) you can't call hooks in React. Then you can import direct event trigger function from Metricalp.

```
import { metricalpEvent } from "@metricalp/react";

export default function MyComponent() {

  return (
    <div>
      <button
        onClick={() => {
          metricalpEvent({ type: 'click_test_button', custom_prop1: 'direct' });
        }}
      >
        Click me
      </button>
    </div>
  );
}
```

It is totally up to you prefer hook or direct function call in your whole app. You can decide about usage of only one or you can use both depending usage place.
In above examples we produce custom events with custom props. In your metricalp dashboard you can set custom_prop aliases then you can use directly that key in events. Like: `metricalpEvent({ type: 'click_test_button', user_role: 'admin' });` here we defined user_role as alias of custom_prop1 in Tracker Settings and now we are producing it in events directly.

### Disabling Auto Route Catch

Change `<MetricalpReactProvider allowLocalhost tid="XXXXXX">` with `<MetricalpReactProvider allowLocalhost disableAutoRouteCatch tid="XXXXXX">`.


#### Manual route tracking

If you disabled auto route catch and you want to track it manually then you need to produce 'screen_view' events on route change. Library exports this event as const string `METRICALP_SCREEN_VIEW_EV` you can use it. Here a quick example for NextJS 13 App Router to listen route changes. You can import this component to your root `layout.tsx`

```
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { metricalpEvent, METRICALP_SCREEN_VIEW_EV } from "@metricalp/react";

export function RouteChangeListener() {
  const pathname = usePathname();

  useEffect(() => {
    console.log(`Route changed to: ${pathname}`);
    metricalpEvent({ type: METRICALP_SCREEN_VIEW_EV });
  }, [pathname]);

  return <></>;
}
```

For react-router dom or any router library, you can follow a similar approach to listening route changes manually. You can do this even without disabling auto route catch. For example if you have a in-memory type routing (Basically show-hide pages based on state without mutating url/window.history). You can produce METRICALP_SCREEN_VIEW_EV ('screen_view') events in that situations. We recommend to you not disabling auto-route catch unless you have strong reasons.

For more details please check official [documentation](https://www.metricalp.com/docs) of Metricalp.