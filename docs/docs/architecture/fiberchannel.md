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
	asPromise?: true;
	to?: { app: string; version: string; };
	event: string;
	data: T;
};
```
If the `to` parameter is set the event will be delivered only to that package.

If the `asPromise` parameter is set to `true` the sink will return a [Promise][5] to wait for the return value.

### Output event
The fiberchannel stream will emit a `FCEvent` or `FCPromisedEvent` objects to each subscription.

The `FCEvent` is a `FCPartialEvent` with attached the information of the emitting App.

The `FCPromisedEvent` is a `FCEvent` enhanced with the callback to return the result triggered by the event call.

```typescript
type FCEvent<T extends {} | string> = FCPartialEvent<T> & {
	from: string;
	version: string;
};

type FCPromisedEvent<T extends {} | string, R extends {} | string> = FCEvent<T> & {
	sendResponse: (data: R) => void;
};
```

## API Versioning
When an App needs to call another App API using the fiberchannel setting the `to` field of the event a version check
is triggered to prevent an App to call a newer version of an installed App.

> An App must handle API calls from all previous version.

The check is performed using the [semver][6] library.

## Sink
The sink is a function to emit events on the stream. The sink itself will attach the data of the emitting package.

```typescript
type FCSink = <T extends {} | string, R extends {} | string>(event: FCPartialEvent<T> | FCPartialPromisedEvent<T>) => void | Promise<R>;
```

The sink can be used to emit a complete event object:
```typescript
import { fiberChannelSink } from '@zextras/zapp-shell';

fiberChannelSink({
	to: {
		app: 'com_example_destination_package',
        version: '1.0.0'
	},
	event: 'event-name',
	data: {
		param1: 42
	}
});
```

The sink can return a [Promise][5] to wait for the return value:
```typescript
import { fiberChannelSink } from '@zextras/zapp-shell';

fiberChannelSink({
	asPromise: true, // <- Note this flag on the event object
	to: {
		app: 'com_example_destination_package',
        version: '1.0.0'
	},
	event: 'event-name',
	data: {
		param1: 42
	}
}).then(
  (response) => console.log(response)
);
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
[5]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[6]: https://www.npmjs.com/package/semver
