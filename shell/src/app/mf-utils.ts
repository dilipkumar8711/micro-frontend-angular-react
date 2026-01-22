
// Type declarations for Webpack share scope globals
declare const __webpack_init_sharing__: (scope: string) => Promise<void>;
declare const __webpack_share_scopes__: Record<string, any>;

export async function ensureRemoteLoaded(remoteEntryUrl: string): Promise<void> {
  // If already present, do nothing
  if ([...document.scripts].some(s => s.src === remoteEntryUrl)) return;

  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = remoteEntryUrl;
    s.type = 'text/javascript';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${remoteEntryUrl}`));
    document.head.appendChild(s);
  });
}

export async function loadMfExposed<T = any>(opts: {
  remoteEntry: string;     // e.g. http://localhost:4400/remoteEntry.js
  remoteName: string;      // e.g. 'mfe2'  (must match ModuleFederationPlugin.name)
  exposedModule: string;   // e.g. './WidgetApp'
}): Promise<T> {
  const { remoteEntry, remoteName, exposedModule } = opts;

  // 1) Ensure the remote script is in the page
  await ensureRemoteLoaded(remoteEntry);

  // 2) Initialize the default share scope on the host
  await __webpack_init_sharing__('default');

  // 3) Grab the global container created by the remote
  const container: any = (window as any)[remoteName];
  if (!container) {
    throw new Error(`MF container ${remoteName} not found on window — check 'name' and 'library' in the remote config.`);
  }

  // 4) Initialize the container with the host's share scope
 await container.init(__webpack_share_scopes__['default']);

  // 5) Fetch the exposed module factory and execute it
  const factory = await container.get(exposedModule);
  return factory();
}
