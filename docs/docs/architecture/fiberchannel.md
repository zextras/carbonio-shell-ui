---
title: FiberChannel
---

The fiberchannel is a method to deliver [events][4] inside Shell and Apps and is inspired by the [BLoC patten][1].

The fiberchannel is composed by a stream to listen for events and a "[Sink][3]" to emit events on the stream.

The fiberchannel is provided into the App Context and as import.

## Event
### Input event
The Sink can accept a `FCPartialEvent` object which defines the event that will be emitted on the fiberchannel.
```typescript
type FCPartialEvent<T extends {} | string> = {
	to?: string;
	event: string;
	data: T;
};
```
If the `to` parameter is set the event will be delivered only to that package name.

### Output event
The fiberchannel stream will emit a `FCEvent` object to each subscription.

The `FCEvent` is a `FCPartialEvent` with attached the information of the emitting App.

```typescript
type FCEvent<T extends {} | string> = FCPartialEvent<T> & {
	from: string;
	version: string;
};
```

## Sink
The sink is a function to emit events on the stream. The sink itself will attach the data of the emitting package.

```typescript
type FCSink = <T extends {} | string>(event: string | FCPartialEvent<T>, data?: T) => void;
```

The simple usage of the sink is with two parameters:
```typescript
import { fiberChannelSink } from '@zextras/zapp-shell';

fiberChannelSink('event-name', { param1: 42 });
```

The sink can be used to emit a complete event object:
```typescript
import { fiberChannelSink } from '@zextras/zapp-shell';

fiberChannelSink({ to: 'com_example_destination_package', event: 'event-name', data: { param1: 42 } });
```

## Stream
The stream is provided as an [RxJS Observable][2].
```javascript
import { fiberChannel } from '@zextras/zapp-shell';

fiberChannel.subscribe((ev) => console.log(ev));
```

## React
To use the fiberchannel into React components the `useFiberChannel` hook can be used.
```javascript
import { hooks } from '@zextras/zapp-shell';

const { fiberChannelSink, fiberChannel } = hooks.useFiberChannel();
```

[1]: http://flutterdevs.com/blog/bloc-pattern-in-flutter-part-1/
[2]: https://rxjs-dev.firebaseapp.com/guide/observable
[3]: #sink
[4]: #event
