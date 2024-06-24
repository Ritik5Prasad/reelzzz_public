const eventHandlers: any = {};

export const subscribeToEvent = (eventName: any, handler: any) => {
  if (!eventHandlers[eventName]) {
    eventHandlers[eventName] = [];
  }
  eventHandlers[eventName].push(handler);
};

export const unsubscribeFromEvent = (eventName: any, handler: any) => {
  if (eventHandlers[eventName]) {
    eventHandlers[eventName] = eventHandlers[eventName].filter(
      (existingHandler: any) => existingHandler !== handler,
    );
  }
};

export const emitEvent = (eventName: any, data: any) => {
  if (eventHandlers[eventName]) {
    eventHandlers[eventName].forEach((handler: any) => handler(data));
  }
};
