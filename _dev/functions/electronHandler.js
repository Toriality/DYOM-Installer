/**
 * @param  {Object} handle - Electron handler
 * @param  {Object} event - AddEventListener event (default: "click")
 * @param  {Array} params - Array of arguments for the electron handler
 */
export default function electronHandler(...args) {
  args.forEach((arg) => {
    // Default event listener is click
    if (!arg.event) {
      arg.event = "click";
    }
    const func = window.dyom[arg.handle];
    document.getElementById(arg.handle).addEventListener(arg.event, () => {
      // If the handle has params
      if (arg.params) return func(...arg.params);
      // If no params is given
      return func();
    });
  });
}
