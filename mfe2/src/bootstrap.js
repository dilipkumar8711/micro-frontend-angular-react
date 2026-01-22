
import React from 'react';
import { createRoot } from 'react-dom/client';
import Widget from './Widget';

export function mount(el, props) {
  const root = createRoot(el);
  root.render(<Widget {...props} />);
  el.__root = root;
}

export function unmount(el) {
  el.__root?.unmount();
}
