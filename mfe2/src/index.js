
import('./bootstrap').then(({ mount }) => {
  const el = document.getElementById('root');
  if (el) {
    mount(el, { user: 'Standalone Dev' });
  }
});
