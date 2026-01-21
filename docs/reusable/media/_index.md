```mdx-code-block
import CodeBlock from '@theme/CodeBlock';
import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

export const PLATFORM_LABELS = {
  'js-tag': 'JavaScript (tag)',
  'js-browser': 'Browser (npm)',
  'ios': 'iOS',
  'android-kotlin': 'Android (Kotlin)',
  'android-java': 'Android (Java)',
  'flutter': 'Flutter',
  'roku': 'Roku'
};

export const PlatformTabs = ({ platforms, children }) => {
  const availablePlatforms = platforms.filter(p => children[p]);
  if (availablePlatforms.length === 0) return null;
  if (availablePlatforms.length === 1) {
    return children[availablePlatforms[0]];
  }
  return (
    <Tabs groupId="platform" queryString>
      {availablePlatforms.map((platform, index) => (
        <TabItem
          key={platform}
          value={platform}
          label={PLATFORM_LABELS[platform]}
          default={index === 0}
        >
          {children[platform]}
        </TabItem>
      ))}
    </Tabs>
  );
};

The Snowplow media tracking APIs enable you to track events from media playback on the web and in mobile apps. Track changes in playback state (play, pause, seek), playback position (ping and percentage progress events), and ad playback (ad breaks, ad progress, ad clicks).

The APIs are player-agnostic, so you can implement tracking for any media player. For details on the events and entities tracked, see the [media tracking overview](/docs/events/ootb-data/media-events/index.md).

:::info Example app
See the tracked media events and entities live as you watch a video in our [React example app](https://snowplow-industry-solutions.github.io/snowplow-javascript-tracker-examples/media). [View the source code](https://github.com/snowplow-industry-solutions/snowplow-javascript-tracker-examples/tree/master/react).
:::

## Quick start

A media tracking session follows this lifecycle:

1. **Start tracking** when the player loads (before playback begins)
2. **Update player state** every second during playback
3. **Track events** as they occur (play, pause, seek, etc.)
4. **End tracking** when the user leaves

<PlatformTabs platforms={props.platforms}>
{{
  'js-tag': (
    <CodeBlock language="javascript">
{`// 1. Start tracking when player loads
const id = crypto.randomUUID();
window.snowplow('startMediaTracking', {
    id,
    player: {
        duration: 300,
        label: 'My Video Title',
        mediaType: 'video',
        playerType: 'html5'
    }
});

// 2. Update player state every second
setInterval(() => {
    window.snowplow('updateMediaTracking', {
        id,
        player: { currentTime: player.currentTime }
    });
}, 1000);

// 3. Track events as they occur
window.snowplow('trackMediaPlay', { id });
window.snowplow('trackMediaPause', { id });
window.snowplow('trackMediaSeekStart', { id });
window.snowplow('trackMediaSeekEnd', { id });
window.snowplow('trackMediaEnd', { id });

// 4. End tracking when done
window.snowplow('endMediaTracking', { id });`}
    </CodeBlock>
  ),
  'js-browser': (
    <CodeBlock language="javascript">
{`import {
    startMediaTracking,
    updateMediaTracking,
    endMediaTracking,
    trackMediaPlay,
    trackMediaPause,
    trackMediaSeekStart,
    trackMediaSeekEnd,
    trackMediaEnd,
    MediaType
} from "@snowplow/browser-plugin-media";

// 1. Start tracking when player loads
const id = crypto.randomUUID();
startMediaTracking({
    id,
    player: {
        duration: 300,
        label: 'My Video Title',
        mediaType: MediaType.Video,
        playerType: 'html5'
    }
});

// 2. Update player state every second
setInterval(() => {
    updateMediaTracking({
        id,
        player: { currentTime: player.currentTime }
    });
}, 1000);

// 3. Track events as they occur
trackMediaPlay({ id });
trackMediaPause({ id });
trackMediaSeekStart({ id });
trackMediaSeekEnd({ id });
trackMediaEnd({ id });

// 4. End tracking when done
endMediaTracking({ id });`}
    </CodeBlock>
  ),
  'ios': (
    <CodeBlock language="swift">
{`// 1. Start tracking when player loads
let id = UUID().uuidString
let player = MediaPlayerEntity()
    .duration(300)
    .label("My Video Title")
    .mediaType(.video)

let mediaTracking = tracker.media.startMediaTracking(id: id, player: player)

// 2. Update player state every second (or use AVPlayer auto-tracking)
mediaTracking.update(player: MediaPlayerEntity().currentTime(currentTime))

// 3. Track events as they occur
mediaTracking.track(MediaPlayEvent())
mediaTracking.track(MediaPauseEvent())
mediaTracking.track(MediaSeekStartEvent())
mediaTracking.track(MediaSeekEndEvent())
mediaTracking.track(MediaEndEvent())

// 4. End tracking when done
tracker.media.endMediaTracking(id: id)`}
    </CodeBlock>
  ),
  'android-kotlin': (
    <CodeBlock language="kotlin">
{`// 1. Start tracking when player loads
val id = UUID.randomUUID().toString()
val player = MediaPlayerEntity(
    duration = 300.0,
    label = "My Video Title",
    mediaType = MediaType.Video
)
val mediaTracking = tracker?.media?.startMediaTracking(id, player)

// 2. Update player state every second
mediaTracking?.update(player = MediaPlayerEntity(currentTime = currentTime))

// 3. Track events as they occur
mediaTracking?.track(MediaPlayEvent())
mediaTracking?.track(MediaPauseEvent())
mediaTracking?.track(MediaSeekStartEvent())
mediaTracking?.track(MediaSeekEndEvent())
mediaTracking?.track(MediaEndEvent())

// 4. End tracking when done
tracker?.media?.endMediaTracking(id)`}
    </CodeBlock>
  ),
  'android-java': (
    <CodeBlock language="java">
{`// 1. Start tracking when player loads
String id = UUID.randomUUID().toString();
MediaPlayerEntity player = new MediaPlayerEntity();
player.setDuration(300.0);
player.setLabel("My Video Title");
player.setMediaType(MediaType.Video);

TrackerController tracker = Snowplow.getDefaultTracker();
MediaTracking mediaTracking = tracker.getMedia().startMediaTracking(id, player);

// 2. Update player state every second
MediaPlayerEntity update = new MediaPlayerEntity();
update.setCurrentTime(currentTime);
mediaTracking.update(update, null, null);

// 3. Track events as they occur
mediaTracking.track(new MediaPlayEvent(), null, null, null);
mediaTracking.track(new MediaPauseEvent(), null, null, null);
mediaTracking.track(new MediaSeekStartEvent(), null, null, null);
mediaTracking.track(new MediaSeekEndEvent(), null, null, null);
mediaTracking.track(new MediaEndEvent(), null, null, null);

// 4. End tracking when done
tracker.getMedia().endMediaTracking(id);`}
    </CodeBlock>
  ),
  'flutter': (
    <CodeBlock language="dart">
{`// 1. Start tracking when player loads
final id = const Uuid().v4();
MediaTracking mediaTracking = await tracker.startMediaTracking(
    configuration: MediaTrackingConfiguration(
        id: id,
        player: const MediaPlayerEntity(
            duration: 300,
            label: 'My Video Title',
            mediaType: MediaType.video,
        )
    )
);

// 2. Update player state every second
await mediaTracking.update(
    player: MediaPlayerEntity(currentTime: currentTime)
);

// 3. Track events as they occur
await mediaTracking.track(MediaPlayEvent());
await mediaTracking.track(MediaPauseEvent());
await mediaTracking.track(MediaSeekStartEvent());
await mediaTracking.track(MediaSeekEndEvent());
await mediaTracking.track(MediaEndEvent());

// 4. End tracking when done
await tracker.endMediaTracking(id: id);`}
    </CodeBlock>
  ),
  'roku': (
    <CodeBlock language="brightscript">
{`' 1. Start tracking when player loads (events are auto-tracked)
m.global.snowplow.enableMediaTracking = {
    media: m.Video,
    version: 2,
    label: "My Video Title"
}

' 2-3. Player state and events are automatically tracked from the Video node

' 4. End tracking when done
m.global.snowplow.disableMediaTracking = {
    media: m.Video
}`}
    </CodeBlock>
  )
}}
</PlatformTabs>

{props.platforms.includes('flutter') && (
<Admonition type="info" title="Flutter web configuration">
To track media events on web with the Flutter tracker, configure the JavaScript plugin URL:
<CodeBlock language="dart">
{`SnowplowTracker tracker = await Snowplow.createTracker(
    namespace: namespace,
    endpoint: endpoint,
    trackerConfig: const TrackerConfiguration(
        jsMediaPluginURL: "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-media@latest/dist/index.umd.min.js"
    )
);`}
</CodeBlock>
</Admonition>
)}

## Configuration

Configure media tracking when you call `startMediaTracking`. All configuration is optional.

### Player properties

Set initial player properties to populate the [media player entity](/docs/events/ootb-data/media-events/index.md#media-player). The `label` property is recommended as it helps identify content during analysis.

<PlatformTabs platforms={props.platforms}>
{{
  'js-tag': (
    <CodeBlock language="javascript">
{`window.snowplow('startMediaTracking', {
    id,
    player: {
        currentTime: 0,          // Current playback position in seconds
        duration: 300,           // Total duration in seconds
        ended: false,            // Whether playback has ended
        livestream: false,       // Whether this is a live stream
        label: 'My Video',       // Human-readable title (recommended)
        loop: false,             // Whether to restart after ending
        mediaType: 'video',      // 'video' or 'audio'
        muted: false,            // Whether audio is muted
        paused: true,            // Whether playback is paused
        pictureInPicture: false, // Whether in picture-in-picture mode
        playerType: 'html5',     // Player type identifier
        playbackRate: 1.0,       // Playback speed (1 = normal)
        quality: '1080p',        // Quality level
        volume: 100              // Volume percentage (0-100)
    }
});`}
    </CodeBlock>
  ),
  'js-browser': (
    <CodeBlock language="javascript">
{`import { startMediaTracking, MediaType } from "@snowplow/browser-plugin-media";

startMediaTracking({
    id,
    player: {
        currentTime: 0,          // Current playback position in seconds
        duration: 300,           // Total duration in seconds
        ended: false,            // Whether playback has ended
        livestream: false,       // Whether this is a live stream
        label: 'My Video',       // Human-readable title (recommended)
        loop: false,             // Whether to restart after ending
        mediaType: MediaType.Video, // MediaType.Video or MediaType.Audio
        muted: false,            // Whether audio is muted
        paused: true,            // Whether playback is paused
        pictureInPicture: false, // Whether in picture-in-picture mode
        playerType: 'html5',     // Player type identifier
        playbackRate: 1.0,       // Playback speed (1 = normal)
        quality: '1080p',        // Quality level
        volume: 100              // Volume percentage (0-100)
    }
});`}
    </CodeBlock>
  ),
  'ios': (
    <CodeBlock language="swift">
{`let player = MediaPlayerEntity()
    .currentTime(0)          // Current playback position in seconds
    .duration(300)           // Total duration in seconds
    .ended(false)            // Whether playback has ended
    .livestream(false)       // Whether this is a live stream
    .label("My Video")       // Human-readable title (recommended)
    .loop(false)             // Whether to restart after ending
    .mediaType(.video)       // .video or .audio
    .muted(false)            // Whether audio is muted
    .paused(true)            // Whether playback is paused
    .pictureInPicture(false) // Whether in picture-in-picture mode
    .playbackRate(1.0)       // Playback speed (1 = normal)
    .quality("1080p")        // Quality level
    .volume(100)             // Volume percentage (0-100)

let mediaTracking = tracker.media.startMediaTracking(id: id, player: player)`}
    </CodeBlock>
  ),
  'android-kotlin': (
    <CodeBlock language="kotlin">
{`val player = MediaPlayerEntity(
    currentTime = 0.0,        // Current playback position in seconds
    duration = 300.0,         // Total duration in seconds
    ended = false,            // Whether playback has ended
    livestream = false,       // Whether this is a live stream
    label = "My Video",       // Human-readable title (recommended)
    loop = false,             // Whether to restart after ending
    mediaType = MediaType.Video, // MediaType.Video or MediaType.Audio
    muted = false,            // Whether audio is muted
    paused = true,            // Whether playback is paused
    pictureInPicture = false, // Whether in picture-in-picture mode
    playbackRate = 1.0,       // Playback speed (1 = normal)
    quality = "1080p",        // Quality level
    volume = 100              // Volume percentage (0-100)
)

val mediaTracking = tracker?.media?.startMediaTracking(id, player)`}
    </CodeBlock>
  ),
  'android-java': (
    <CodeBlock language="java">
{`MediaPlayerEntity player = new MediaPlayerEntity();
player.setCurrentTime(0.0);          // Current playback position in seconds
player.setDuration(300.0);           // Total duration in seconds
player.setEnded(false);              // Whether playback has ended
player.setLivestream(false);         // Whether this is a live stream
player.setLabel("My Video");         // Human-readable title (recommended)
player.setLoop(false);               // Whether to restart after ending
player.setMediaType(MediaType.Video); // MediaType.Video or MediaType.Audio
player.setMuted(false);              // Whether audio is muted
player.setPaused(true);              // Whether playback is paused
player.setPictureInPicture(false);   // Whether in picture-in-picture mode
player.setPlaybackRate(1.0);         // Playback speed (1 = normal)
player.setQuality("1080p");          // Quality level
player.setVolume(100);               // Volume percentage (0-100)

MediaTracking mediaTracking = tracker.getMedia().startMediaTracking(id, player);`}
    </CodeBlock>
  ),
  'flutter': (
    <CodeBlock language="dart">
{`MediaTracking mediaTracking = await tracker.startMediaTracking(
    configuration: const MediaTrackingConfiguration(
        id: id,
        player: MediaPlayerEntity(
            currentTime: 0,          // Current playback position in seconds
            duration: 300,           // Total duration in seconds
            ended: false,            // Whether playback has ended
            livestream: false,       // Whether this is a live stream
            label: 'My Video',       // Human-readable title (recommended)
            loop: false,             // Whether to restart after ending
            mediaType: MediaType.video, // MediaType.video or MediaType.audio
            muted: false,            // Whether audio is muted
            paused: true,            // Whether playback is paused
            pictureInPicture: false, // Whether in picture-in-picture mode
            playerType: 'html5',     // Player type identifier
            playbackRate: 1.0,       // Playback speed (1 = normal)
            quality: '1080p',        // Quality level
            volume: 100              // Volume percentage (0-100)
        )
    )
);`}
    </CodeBlock>
  ),
  'roku': (
    <CodeBlock language="brightscript">
{`m.global.snowplow.enableMediaTracking = {
    media: m.Video,
    version: 2,
    label: "My Video"  ' Other properties are automatically tracked from the Video node
}`}
    </CodeBlock>
  )
}}
</PlatformTabs>

### Ping events

Media ping events are sent at regular intervals (default: 30 seconds) to report playback position. Configure the interval, change how many pings to send while paused, or turn off pings entirely.

<PlatformTabs platforms={props.platforms}>
{{
  'js-tag': (
    <CodeBlock language="javascript">
{`window.snowplow('startMediaTracking', {
    id,
    pings: {
        pingInterval: 30,   // Seconds between pings (default: 30)
        maxPausedPings: 1   // Max pings while paused (default: 1)
    }
});

// Or turn off pings entirely
window.snowplow('startMediaTracking', { id, pings: false });`}
    </CodeBlock>
  ),
  'js-browser': (
    <CodeBlock language="javascript">
{`startMediaTracking({
    id,
    pings: {
        pingInterval: 30,   // Seconds between pings (default: 30)
        maxPausedPings: 1   // Max pings while paused (default: 1)
    }
});

// Or turn off pings entirely
startMediaTracking({ id, pings: false });`}
    </CodeBlock>
  ),
  'ios': (
    <CodeBlock language="swift">
{`let configuration = MediaTrackingConfiguration(id: id)
    .pingInterval(30)   // Seconds between pings (default: 30)
    .maxPausedPings(1)  // Max pings while paused (default: 1)

// Or turn off pings entirely
let configuration = MediaTrackingConfiguration(id: id)
    .pings(false)`}
    </CodeBlock>
  ),
  'android-kotlin': (
    <CodeBlock language="kotlin">
{`val configuration = MediaTrackingConfiguration(
    id = id,
    pingInterval = 30,   // Seconds between pings (default: 30)
    maxPausedPings = 1   // Max pings while paused (default: 1)
)

// Or turn off pings entirely
val configuration = MediaTrackingConfiguration(id = id, pings = false)`}
    </CodeBlock>
  ),
  'android-java': (
    <CodeBlock language="java">
{`MediaTrackingConfiguration configuration = new MediaTrackingConfiguration(id, null);
configuration.setPingInterval(30);   // Seconds between pings (default: 30)
configuration.setMaxPausedPings(1);  // Max pings while paused (default: 1)

// Or turn off pings entirely
configuration.setPings(false);`}
    </CodeBlock>
  ),
  'flutter': (
    <CodeBlock language="dart">
{`MediaTracking mediaTracking = await tracker.startMediaTracking(
    configuration: const MediaTrackingConfiguration(
        id: id,
        pingInterval: 30,   // Seconds between pings (default: 30)
        maxPausedPings: 1   // Max pings while paused (default: 1)
    )
);

// Or turn off pings entirely
MediaTracking mediaTracking = await tracker.startMediaTracking(
    configuration: const MediaTrackingConfiguration(id: id, pings: false)
);`}
    </CodeBlock>
  ),
  'roku': (
    <CodeBlock language="brightscript">
{`m.global.snowplow.enableMediaTracking = {
    media: m.Video,
    version: 2,
    pings: true,        ' Enabled by default
    pingInterval: 30    ' Seconds between pings (default: 30)
}

' Or turn off pings entirely
m.global.snowplow.enableMediaTracking = {
    media: m.Video,
    version: 2,
    pings: false
}`}
    </CodeBlock>
  )
}}
</PlatformTabs>

{(props.platforms.includes('js-browser') || props.platforms.includes('js-tag')) && (
<Admonition type="info" title="Media pings vs page pings">
Media ping events are separate from page ping events tracked by <a href="/docs/events/ootb-data/page-activity-tracking">activity tracking</a>. Media pings contain playback information (player and session entities), while page pings do not.
</Admonition>
)}

### Percentage progress

Track events when playback reaches specified percentage boundaries.

<PlatformTabs platforms={props.platforms}>
{{
  'js-tag': (
    <CodeBlock language="javascript">
{`window.snowplow('startMediaTracking', {
    id,
    boundaries: [10, 25, 50, 75, 90]  // Fire events at these percentages
});`}
    </CodeBlock>
  ),
  'js-browser': (
    <CodeBlock language="javascript">
{`startMediaTracking({
    id,
    boundaries: [10, 25, 50, 75, 90]  // Fire events at these percentages
});`}
    </CodeBlock>
  ),
  'ios': (
    <CodeBlock language="swift">
{`let configuration = MediaTrackingConfiguration(id: id)
    .boundaries([10, 25, 50, 75, 90])  // Fire events at these percentages`}
    </CodeBlock>
  ),
  'android-kotlin': (
    <CodeBlock language="kotlin">
{`val configuration = MediaTrackingConfiguration(
    id = id,
    boundaries = listOf(10, 25, 50, 75, 90)  // Fire events at these percentages
)`}
    </CodeBlock>
  ),
  'android-java': (
    <CodeBlock language="java">
{`MediaTrackingConfiguration configuration = new MediaTrackingConfiguration(id, null);
configuration.setBoundaries(Arrays.asList(10, 25, 50, 75, 90));  // Fire events at these percentages`}
    </CodeBlock>
  ),
  'flutter': (
    <CodeBlock language="dart">
{`MediaTracking mediaTracking = await tracker.startMediaTracking(
    configuration: const MediaTrackingConfiguration(
        id: id,
        boundaries: [10, 25, 50, 75, 90]  // Fire events at these percentages
    )
);`}
    </CodeBlock>
  ),
  'roku': (
    <CodeBlock language="brightscript">
{`m.global.snowplow.enableMediaTracking = {
    media: m.Video,
    version: 2,
    boundaries: [10, 25, 50, 75, 90]  ' Fire events at these percentages
}`}
    </CodeBlock>
  )
}}
</PlatformTabs>

### Session tracking

The [media session entity](/docs/events/ootb-data/media-events/index.md#media-session) is attached to all media events by default. It's optional for the [Media Player](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-media-player-data-model/index.md) data model, so you could choose not to include it.

We recommend tracking this entity.

<PlatformTabs platforms={props.platforms}>
{{
  'js-tag': (
    <CodeBlock language="javascript">
{`window.snowplow('startMediaTracking', { id, session: false });`}
    </CodeBlock>
  ),
  'js-browser': (
    <CodeBlock language="javascript">
{`startMediaTracking({ id, session: false });`}
    </CodeBlock>
  ),
  'ios': (
    <CodeBlock language="swift">
{`let configuration = MediaTrackingConfiguration(id: id).session(false)`}
    </CodeBlock>
  ),
  'android-kotlin': (
    <CodeBlock language="kotlin">
{`val configuration = MediaTrackingConfiguration(id = id, session = false)`}
    </CodeBlock>
  ),
  'android-java': (
    <CodeBlock language="java">
{`MediaTrackingConfiguration configuration = new MediaTrackingConfiguration(id, null);
configuration.setSession(false);`}
    </CodeBlock>
  ),
  'flutter': (
    <CodeBlock language="dart">
{`MediaTracking mediaTracking = await tracker.startMediaTracking(
    configuration: const MediaTrackingConfiguration(id: id, session: false)
);`}
    </CodeBlock>
  ),
  'roku': (
    <CodeBlock language="brightscript">
{`m.global.snowplow.enableMediaTracking = {
    media: m.Video,
    version: 2,
    session: false
}`}
    </CodeBlock>
  )
}}
</PlatformTabs>

### Custom entities

You can attach custom entities to all events for this media tracking instance.

<PlatformTabs platforms={props.platforms}>
{{
  'js-tag': (
    <CodeBlock language="javascript">
{`window.snowplow('startMediaTracking', {
    id,
    context: [
        {
            schema: 'iglu:com.example/video_metadata/jsonschema/1-0-0',
            data: { contentId: 'abc123', category: 'tutorial' }
        }
    ]
});`}
    </CodeBlock>
  ),
  'js-browser': (
    <CodeBlock language="javascript">
{`startMediaTracking({
    id,
    context: [
        {
            schema: 'iglu:com.example/video_metadata/jsonschema/1-0-0',
            data: { contentId: 'abc123', category: 'tutorial' }
        }
    ]
});`}
    </CodeBlock>
  ),
  'ios': (
    <CodeBlock language="swift">
{`let configuration = MediaTrackingConfiguration(id: id)
    .entities([
        SelfDescribingJson(
            schema: "iglu:com.example/video_metadata/jsonschema/1-0-0",
            andData: ["contentId": "abc123", "category": "tutorial"]
        )
    ])`}
    </CodeBlock>
  ),
  'android-kotlin': (
    <CodeBlock language="kotlin">
{`val configuration = MediaTrackingConfiguration(
    id = id,
    entities = listOf(
        SelfDescribingJson(
            schema = "iglu:com.example/video_metadata/jsonschema/1-0-0",
            data = mapOf("contentId" to "abc123", "category" to "tutorial")
        )
    )
)`}
    </CodeBlock>
  ),
  'android-java': (
    <CodeBlock language="java">
{`MediaTrackingConfiguration configuration = new MediaTrackingConfiguration(id, null);
configuration.setEntities(Collections.singletonList(
    new SelfDescribingJson(
        "iglu:com.example/video_metadata/jsonschema/1-0-0",
        new HashMap<String, Object>() {{
            put("contentId", "abc123");
            put("category", "tutorial");
        }}
    )
));`}
    </CodeBlock>
  ),
  'flutter': (
    <CodeBlock language="dart">
{`MediaTracking mediaTracking = await tracker.startMediaTracking(
    configuration: const MediaTrackingConfiguration(
        id: id,
        contexts: [
            SelfDescribing(
                schema: "iglu:com.example/video_metadata/jsonschema/1-0-0",
                data: {"contentId": "abc123", "category": "tutorial"}
            )
        ]
    )
);`}
    </CodeBlock>
  ),
  'roku': (
    <CodeBlock language="brightscript">
{`m.global.snowplow.enableMediaTracking = {
    media: m.Video,
    version: 2,
    entities: [
        {
            schema: "iglu:com.example/video_metadata/jsonschema/1-0-0",
            data: {"contentId": "abc123", "category": "tutorial"}
        }
    ]
}`}
    </CodeBlock>
  )
}}
</PlatformTabs>

### Filter events

<PlatformTabs platforms={props.platforms}>
{{
  'js-tag': (
    <>
      <p>Only track specific event types by providing an allowlist:</p>
      <CodeBlock language="javascript">
{`window.snowplow('startMediaTracking', {
    id,
    captureEvents: ['play', 'pause', 'end']  // Only track these events
});`}
      </CodeBlock>
      <p>When users scrub through video, media players can generate many rapid seek or volume change events. The tracker automatically coalesces these into just the first and last event. This behavior is optional:</p>
      <CodeBlock language="javascript">
{`// Turn off filtering entirely
window.snowplow('startMediaTracking', { id, filterOutRepeatedEvents: false });

// Or configure separately for seek and volume events
window.snowplow('startMediaTracking', {
    id,
    filterOutRepeatedEvents: {
        seekEvents: true,
        volumeChangeEvents: false,
        flushTimeoutMs: 5000  // Time before flushing buffered events (default: 5000)
    }
});`}
      </CodeBlock>
    </>
  ),
  'js-browser': (
    <>
      <p>Only track specific event types by providing an allowlist:</p>
      <CodeBlock language="javascript">
{`import { MediaEventType } from "@snowplow/browser-plugin-media";

startMediaTracking({
    id,
    captureEvents: [MediaEventType.Play, MediaEventType.Pause, MediaEventType.End]
});`}
      </CodeBlock>
      <p>When users scrub through video, media players can generate many rapid seek or volume change events. The tracker automatically coalesces these into just the first and last event. This behavior is optional:</p>
      <CodeBlock language="javascript">
{`// Turn off filtering entirely
startMediaTracking({ id, filterOutRepeatedEvents: false });

// Or configure separately for seek and volume events
startMediaTracking({
    id,
    filterOutRepeatedEvents: {
        seekEvents: true,
        volumeChangeEvents: false,
        flushTimeoutMs: 5000  // Time before flushing buffered events (default: 5000)
    }
});`}
      </CodeBlock>
    </>
  ),
  'ios': (
    <>
      <p>Only track specific event types by providing an allowlist:</p>
      <CodeBlock language="swift">
{`let configuration = MediaTrackingConfiguration(id: id)
    .captureEvents([MediaPlayEvent.self, MediaPauseEvent.self, MediaEndEvent.self])`}
      </CodeBlock>
    </>
  ),
  'android-kotlin': (
    <>
      <p>Only track specific event types by providing an allowlist:</p>
      <CodeBlock language="kotlin">
{`val configuration = MediaTrackingConfiguration(
    id = id,
    captureEvents = listOf(MediaPlayEvent::class, MediaPauseEvent::class, MediaEndEvent::class)
)`}
      </CodeBlock>
    </>
  ),
  'android-java': (
    <>
      <p>Only track specific event types by providing an allowlist:</p>
      <CodeBlock language="java">
{`MediaTrackingConfiguration configuration = new MediaTrackingConfiguration(id, null);
configuration.setCaptureEvents(Arrays.asList(
    MediaPlayEvent.class, MediaPauseEvent.class, MediaEndEvent.class
));`}
      </CodeBlock>
    </>
  ),
  'flutter': (
    <p>Media event filtering isn't available for the Flutter tracker.</p>
  ),
  'roku': (
    <>
      <p>Only track specific event types by providing an allowlist:</p>
      <CodeBlock language="brightscript">
{`m.global.snowplow.enableMediaTracking = {
    media: m.Video,
    version: 2,
    captureEvents: ["play", "pause", "end"]
}`}
      </CodeBlock>
    </>
  )
}}
</PlatformTabs>

## Tracking events

Track events by calling the appropriate function when player events occur. For a complete list of available events and their properties, see the [media events reference](/docs/events/ootb-data/media-events/index.md#available-event-types).

### Playback events

<PlatformTabs platforms={props.platforms}>
{{
  'js-tag': (
    <CodeBlock language="javascript">
{`window.snowplow('trackMediaReady', { id });        // Player is ready
window.snowplow('trackMediaPlay', { id });          // Playback started
window.snowplow('trackMediaPause', { id });         // Playback paused
window.snowplow('trackMediaEnd', { id });           // Playback ended
window.snowplow('trackMediaSeekStart', { id });     // Seek operation started
window.snowplow('trackMediaSeekEnd', { id });       // Seek operation ended
window.snowplow('trackMediaBufferStart', { id });   // Buffering started
window.snowplow('trackMediaBufferEnd', { id });     // Buffering ended`}
    </CodeBlock>
  ),
  'js-browser': (
    <CodeBlock language="javascript">
{`import {
    trackMediaReady, trackMediaPlay, trackMediaPause, trackMediaEnd,
    trackMediaSeekStart, trackMediaSeekEnd, trackMediaBufferStart, trackMediaBufferEnd
} from "@snowplow/browser-plugin-media";

trackMediaReady({ id });        // Player is ready
trackMediaPlay({ id });         // Playback started
trackMediaPause({ id });        // Playback paused
trackMediaEnd({ id });          // Playback ended
trackMediaSeekStart({ id });    // Seek operation started
trackMediaSeekEnd({ id });      // Seek operation ended
trackMediaBufferStart({ id });  // Buffering started
trackMediaBufferEnd({ id });    // Buffering ended`}
    </CodeBlock>
  ),
  'ios': (
    <CodeBlock language="swift">
{`mediaTracking.track(MediaReadyEvent())        // Player is ready
mediaTracking.track(MediaPlayEvent())         // Playback started
mediaTracking.track(MediaPauseEvent())        // Playback paused
mediaTracking.track(MediaEndEvent())          // Playback ended
mediaTracking.track(MediaSeekStartEvent())    // Seek operation started
mediaTracking.track(MediaSeekEndEvent())      // Seek operation ended
mediaTracking.track(MediaBufferStartEvent())  // Buffering started
mediaTracking.track(MediaBufferEndEvent())    // Buffering ended`}
    </CodeBlock>
  ),
  'android-kotlin': (
    <CodeBlock language="kotlin">
{`mediaTracking?.track(MediaReadyEvent())        // Player is ready
mediaTracking?.track(MediaPlayEvent())         // Playback started
mediaTracking?.track(MediaPauseEvent())        // Playback paused
mediaTracking?.track(MediaEndEvent())          // Playback ended
mediaTracking?.track(MediaSeekStartEvent())    // Seek operation started
mediaTracking?.track(MediaSeekEndEvent())      // Seek operation ended
mediaTracking?.track(MediaBufferStartEvent())  // Buffering started
mediaTracking?.track(MediaBufferEndEvent())    // Buffering ended`}
    </CodeBlock>
  ),
  'android-java': (
    <CodeBlock language="java">
{`mediaTracking.track(new MediaReadyEvent(), null, null, null);        // Player is ready
mediaTracking.track(new MediaPlayEvent(), null, null, null);         // Playback started
mediaTracking.track(new MediaPauseEvent(), null, null, null);        // Playback paused
mediaTracking.track(new MediaEndEvent(), null, null, null);          // Playback ended
mediaTracking.track(new MediaSeekStartEvent(), null, null, null);    // Seek operation started
mediaTracking.track(new MediaSeekEndEvent(), null, null, null);      // Seek operation ended
mediaTracking.track(new MediaBufferStartEvent(), null, null, null);  // Buffering started
mediaTracking.track(new MediaBufferEndEvent(), null, null, null);    // Buffering ended`}
    </CodeBlock>
  ),
  'flutter': (
    <CodeBlock language="dart">
{`await mediaTracking.track(MediaReadyEvent());        // Player is ready
await mediaTracking.track(MediaPlayEvent());         // Playback started
await mediaTracking.track(MediaPauseEvent());        // Playback paused
await mediaTracking.track(MediaEndEvent());          // Playback ended
await mediaTracking.track(MediaSeekStartEvent());    // Seek operation started
await mediaTracking.track(MediaSeekEndEvent());      // Seek operation ended
await mediaTracking.track(MediaBufferStartEvent());  // Buffering started
await mediaTracking.track(MediaBufferEndEvent());    // Buffering ended`}
    </CodeBlock>
  ),
  'roku': (
    <p>Playback events are automatically tracked from Audio/Video nodes. To track events manually, use <code>trackMediaEvent</code>.</p>
  )
}}
</PlatformTabs>

### Player state events

<PlatformTabs platforms={props.platforms}>
{{
  'js-tag': (
    <CodeBlock language="javascript">
{`window.snowplow('trackMediaPlaybackRateChange', { id, newRate: 1.5 });
window.snowplow('trackMediaVolumeChange', { id, newVolume: 80 });
window.snowplow('trackMediaFullscreenChange', { id, fullscreen: true });
window.snowplow('trackMediaPictureInPictureChange', { id, pictureInPicture: true });
window.snowplow('trackMediaQualityChange', {
    id,
    newQuality: '1080p',
    bitrate: 5000,
    framesPerSecond: 30,
    automatic: true
});
window.snowplow('trackMediaError', {
    id,
    errorCode: '500',
    errorName: 'NetworkError',
    errorDescription: 'Failed to load media'
});`}
    </CodeBlock>
  ),
  'js-browser': (
    <CodeBlock language="javascript">
{`import {
    trackMediaPlaybackRateChange, trackMediaVolumeChange, trackMediaFullscreenChange,
    trackMediaPictureInPictureChange, trackMediaQualityChange, trackMediaError
} from "@snowplow/browser-plugin-media";

trackMediaPlaybackRateChange({ id, newRate: 1.5 });
trackMediaVolumeChange({ id, newVolume: 80 });
trackMediaFullscreenChange({ id, fullscreen: true });
trackMediaPictureInPictureChange({ id, pictureInPicture: true });
trackMediaQualityChange({
    id,
    newQuality: '1080p',
    bitrate: 5000,
    framesPerSecond: 30,
    automatic: true
});
trackMediaError({
    id,
    errorCode: '500',
    errorName: 'NetworkError',
    errorDescription: 'Failed to load media'
});`}
    </CodeBlock>
  ),
  'ios': (
    <CodeBlock language="swift">
{`mediaTracking.track(MediaPlaybackRateChangeEvent(newRate: 1.5))
mediaTracking.track(MediaVolumeChangeEvent(newVolume: 80))
mediaTracking.track(MediaFullscreenChangeEvent(fullscreen: true))
mediaTracking.track(MediaPictureInPictureChangeEvent(pictureInPicture: true))
mediaTracking.track(MediaQualityChangeEvent(
    newQuality: "1080p",
    bitrate: 5000,
    framesPerSecond: 30,
    automatic: true
))
mediaTracking.track(MediaErrorEvent(
    errorCode: "500",
    errorName: "NetworkError",
    errorDescription: "Failed to load media"
))`}
    </CodeBlock>
  ),
  'android-kotlin': (
    <CodeBlock language="kotlin">
{`mediaTracking?.track(MediaPlaybackRateChangeEvent(newRate = 1.5))
mediaTracking?.track(MediaVolumeChangeEvent(newVolume = 80))
mediaTracking?.track(MediaFullscreenChangeEvent(fullscreen = true))
mediaTracking?.track(MediaPictureInPictureChangeEvent(pictureInPicture = true))
mediaTracking?.track(MediaQualityChangeEvent(
    newQuality = "1080p",
    bitrate = 5000,
    framesPerSecond = 30,
    automatic = true
))
mediaTracking?.track(MediaErrorEvent(
    errorCode = "500",
    errorName = "NetworkError",
    errorDescription = "Failed to load media"
))`}
    </CodeBlock>
  ),
  'android-java': (
    <CodeBlock language="java">
{`mediaTracking.track(new MediaPlaybackRateChangeEvent(null, 1.5), null, null, null);
mediaTracking.track(new MediaVolumeChangeEvent(null, 80), null, null, null);
mediaTracking.track(new MediaFullscreenChangeEvent(true), null, null, null);
mediaTracking.track(new MediaPictureInPictureChangeEvent(true), null, null, null);

MediaQualityChangeEvent qualityEvent = new MediaQualityChangeEvent();
qualityEvent.setNewQuality("1080p");
qualityEvent.setBitrate(5000);
qualityEvent.setFramesPerSecond(30);
qualityEvent.setAutomatic(true);
mediaTracking.track(qualityEvent, null, null, null);

MediaErrorEvent errorEvent = new MediaErrorEvent();
errorEvent.setErrorCode("500");
errorEvent.setErrorName("NetworkError");
errorEvent.setErrorDescription("Failed to load media");
mediaTracking.track(errorEvent, null, null, null);`}
    </CodeBlock>
  ),
  'flutter': (
    <CodeBlock language="dart">
{`await mediaTracking.track(const MediaPlaybackRateChangeEvent(newRate: 1.5));
await mediaTracking.track(const MediaVolumeChangeEvent(newVolume: 80));
await mediaTracking.track(const MediaFullscreenChangeEvent(fullscreen: true));
await mediaTracking.track(const MediaPictureInPictureChangeEvent(pictureInPicture: true));
await mediaTracking.track(const MediaQualityChangeEvent(
    newQuality: '1080p',
    bitrate: 5000,
    framesPerSecond: 30,
    automatic: true
));
await mediaTracking.track(const MediaErrorEvent(
    errorCode: '500',
    errorName: 'NetworkError',
    errorDescription: 'Failed to load media'
));`}
    </CodeBlock>
  ),
  'roku': (
    <CodeBlock language="brightscript">
{`m.global.snowplow.trackMediaEvent = {
    media: m.Video,
    schema: "iglu:com.snowplowanalytics.snowplow.media/playback_rate_change_event/jsonschema/1-0-0",
    data: { "newRate": 1.5 }
}

m.global.snowplow.trackMediaEvent = {
    media: m.Video,
    schema: "iglu:com.snowplowanalytics.snowplow.media/volume_change_event/jsonschema/1-0-0",
    data: { "newVolume": 80 }
}`}
    </CodeBlock>
  )
}}
</PlatformTabs>

### Ad events

Track advertising events with ad and ad break information. See the [media ad](/docs/events/ootb-data/media-events/index.md#media-ad) and [media ad break](/docs/events/ootb-data/media-events/index.md#media-ad-break) entity schemas for property details.

<PlatformTabs platforms={props.platforms}>
{{
  'js-tag': (
    <CodeBlock language="javascript">
{`// Ad break events
window.snowplow('trackMediaAdBreakStart', {
    id,
    adBreak: {
        breakId: 'break-1',
        name: 'pre-roll',
        breakType: 'linear',
        podSize: 3
    }
});
window.snowplow('trackMediaAdBreakEnd', { id });

// Ad events
window.snowplow('trackMediaAdStart', {
    id,
    ad: {
        adId: 'ad-1',
        name: 'Product Ad',
        creativeId: 'creative-1',
        duration: 30,
        skippable: true
    }
});
window.snowplow('trackMediaAdFirstQuartile', { id });
window.snowplow('trackMediaAdMidpoint', { id });
window.snowplow('trackMediaAdThirdQuartile', { id });
window.snowplow('trackMediaAdComplete', { id });
window.snowplow('trackMediaAdSkip', { id });
window.snowplow('trackMediaAdClick', { id });
window.snowplow('trackMediaAdPause', { id });
window.snowplow('trackMediaAdResume', { id });`}
    </CodeBlock>
  ),
  'js-browser': (
    <CodeBlock language="javascript">
{`import {
    trackMediaAdBreakStart, trackMediaAdBreakEnd, trackMediaAdStart,
    trackMediaAdFirstQuartile, trackMediaAdMidpoint, trackMediaAdThirdQuartile,
    trackMediaAdComplete, trackMediaAdSkip, trackMediaAdClick,
    trackMediaAdPause, trackMediaAdResume, MediaPlayerAdBreakType
} from "@snowplow/browser-plugin-media";

// Ad break events
trackMediaAdBreakStart({
    id,
    adBreak: {
        breakId: 'break-1',
        name: 'pre-roll',
        breakType: MediaPlayerAdBreakType.Linear,
        podSize: 3
    }
});
trackMediaAdBreakEnd({ id });

// Ad events
trackMediaAdStart({
    id,
    ad: {
        adId: 'ad-1',
        name: 'Product Ad',
        creativeId: 'creative-1',
        duration: 30,
        skippable: true
    }
});
trackMediaAdFirstQuartile({ id });
trackMediaAdMidpoint({ id });
trackMediaAdThirdQuartile({ id });
trackMediaAdComplete({ id });
trackMediaAdSkip({ id });
trackMediaAdClick({ id });
trackMediaAdPause({ id });
trackMediaAdResume({ id });`}
    </CodeBlock>
  ),
  'ios': (
    <CodeBlock language="swift">
{`// Ad break events
let adBreak = MediaAdBreakEntity(breakId: "break-1")
    .name("pre-roll")
    .breakType(.linear)
    .podSize(3)
mediaTracking.track(MediaAdBreakStartEvent(), adBreak: adBreak)
mediaTracking.track(MediaAdBreakEndEvent())

// Ad events
let ad = MediaAdEntity(adId: "ad-1")
    .name("Product Ad")
    .creativeId("creative-1")
    .duration(30)
    .skippable(true)
mediaTracking.track(MediaAdStartEvent(), ad: ad)
mediaTracking.track(MediaAdFirstQuartileEvent())
mediaTracking.track(MediaAdMidpointEvent())
mediaTracking.track(MediaAdThirdQuartileEvent())
mediaTracking.track(MediaAdCompleteEvent())
mediaTracking.track(MediaAdSkipEvent())
mediaTracking.track(MediaAdClickEvent())
mediaTracking.track(MediaAdPauseEvent())
mediaTracking.track(MediaAdResumeEvent())`}
    </CodeBlock>
  ),
  'android-kotlin': (
    <CodeBlock language="kotlin">
{`// Ad break events
val adBreak = MediaAdBreakEntity(
    breakId = "break-1",
    name = "pre-roll",
    breakType = MediaAdBreakType.Linear,
    podSize = 3
)
mediaTracking?.track(MediaAdBreakStartEvent(), adBreak = adBreak)
mediaTracking?.track(MediaAdBreakEndEvent())

// Ad events
val ad = MediaAdEntity(
    adId = "ad-1",
    name = "Product Ad",
    creativeId = "creative-1",
    duration = 30.0,
    skippable = true
)
mediaTracking?.track(MediaAdStartEvent(), ad = ad)
mediaTracking?.track(MediaAdFirstQuartileEvent())
mediaTracking?.track(MediaAdMidpointEvent())
mediaTracking?.track(MediaAdThirdQuartileEvent())
mediaTracking?.track(MediaAdCompleteEvent())
mediaTracking?.track(MediaAdSkipEvent())
mediaTracking?.track(MediaAdClickEvent())
mediaTracking?.track(MediaAdPauseEvent())
mediaTracking?.track(MediaAdResumeEvent())`}
    </CodeBlock>
  ),
  'android-java': (
    <CodeBlock language="java">
{`// Ad break events
MediaAdBreakEntity adBreak = new MediaAdBreakEntity("break-1");
adBreak.setName("pre-roll");
adBreak.setBreakType(MediaAdBreakType.Linear);
adBreak.setPodSize(3);
mediaTracking.track(new MediaAdBreakStartEvent(), null, null, adBreak);
mediaTracking.track(new MediaAdBreakEndEvent(), null, null, null);

// Ad events
MediaAdEntity ad = new MediaAdEntity("ad-1");
ad.setName("Product Ad");
ad.setCreativeId("creative-1");
ad.setDuration(30.0);
ad.setSkippable(true);
mediaTracking.track(new MediaAdStartEvent(), null, ad, null);
mediaTracking.track(new MediaAdFirstQuartileEvent(), null, null, null);
mediaTracking.track(new MediaAdMidpointEvent(), null, null, null);
mediaTracking.track(new MediaAdThirdQuartileEvent(), null, null, null);
mediaTracking.track(new MediaAdCompleteEvent(), null, null, null);
mediaTracking.track(new MediaAdSkipEvent(), null, null, null);
mediaTracking.track(new MediaAdClickEvent(), null, null, null);
mediaTracking.track(new MediaAdPauseEvent(), null, null, null);
mediaTracking.track(new MediaAdResumeEvent(), null, null, null);`}
    </CodeBlock>
  ),
  'flutter': (
    <CodeBlock language="dart">
{`// Ad break events
await mediaTracking.track(
    MediaAdBreakStartEvent(),
    adBreak: const MediaAdBreakEntity(
        breakId: 'break-1',
        name: 'pre-roll',
        breakType: MediaAdBreakType.linear,
        podSize: 3
    )
);
await mediaTracking.track(MediaAdBreakEndEvent());

// Ad events
await mediaTracking.track(
    MediaAdStartEvent(),
    ad: const MediaAdEntity(
        adId: 'ad-1',
        name: 'Product Ad',
        creativeId: 'creative-1',
        duration: 30,
        skippable: true
    )
);
await mediaTracking.track(MediaAdFirstQuartileEvent());
await mediaTracking.track(MediaAdMidpointEvent());
await mediaTracking.track(MediaAdThirdQuartileEvent());
await mediaTracking.track(MediaAdCompleteEvent());
await mediaTracking.track(MediaAdSkipEvent());
await mediaTracking.track(MediaAdClickEvent());
await mediaTracking.track(MediaAdPauseEvent());
await mediaTracking.track(MediaAdResumeEvent());`}
    </CodeBlock>
  ),
  'roku': (
    <CodeBlock language="brightscript">
{`' Ad break start
m.global.snowplow.trackMediaEvent = {
    media: m.Video,
    schema: "iglu:com.snowplowanalytics.snowplow.media/ad_break_start_event/jsonschema/1-0-0",
    data: {},
    adBreak: {
        "breakId": "break-1",
        "name": "pre-roll",
        "breakType": "linear",
        "podSize": 3
    }
}

' Ad start
m.global.snowplow.trackMediaEvent = {
    media: m.Video,
    schema: "iglu:com.snowplowanalytics.snowplow.media/ad_start_event/jsonschema/1-0-0",
    data: {},
    ad: {
        "adId": "ad-1",
        "name": "Product Ad",
        "duration": 30
    }
}`}
    </CodeBlock>
  )
}}
</PlatformTabs>

### Custom events

Track custom self-describing events within the media session. The tracker automatically attaches media entities.

<PlatformTabs platforms={props.platforms}>
{{
  'js-tag': (
    <CodeBlock language="javascript">
{`window.snowplow('trackMediaSelfDescribingEvent', {
    id,
    event: {
        schema: 'iglu:com.example/video_interaction/jsonschema/1-0-0',
        data: { action: 'share', platform: 'twitter' }
    }
});`}
    </CodeBlock>
  ),
  'js-browser': (
    <CodeBlock language="javascript">
{`import { trackMediaSelfDescribingEvent } from "@snowplow/browser-plugin-media";

trackMediaSelfDescribingEvent({
    id,
    event: {
        schema: 'iglu:com.example/video_interaction/jsonschema/1-0-0',
        data: { action: 'share', platform: 'twitter' }
    }
});`}
    </CodeBlock>
  ),
  'ios': (
    <CodeBlock language="swift">
{`mediaTracking.track(SelfDescribing(
    schema: "iglu:com.example/video_interaction/jsonschema/1-0-0",
    payload: ["action": "share", "platform": "twitter"]
))`}
    </CodeBlock>
  ),
  'android-kotlin': (
    <CodeBlock language="kotlin">
{`mediaTracking?.track(SelfDescribing(
    "iglu:com.example/video_interaction/jsonschema/1-0-0",
    mapOf("action" to "share", "platform" to "twitter")
))`}
    </CodeBlock>
  ),
  'android-java': (
    <CodeBlock language="java">
{`mediaTracking.track(new SelfDescribing(
    "iglu:com.example/video_interaction/jsonschema/1-0-0",
    new HashMap<String, Object>() {{
        put("action", "share");
        put("platform", "twitter");
    }}
), null, null, null);`}
    </CodeBlock>
  ),
  'flutter': (
    <CodeBlock language="dart">
{`await mediaTracking.track(
    const SelfDescribing(
        schema: "iglu:com.example/video_interaction/jsonschema/1-0-0",
        data: {"action": "share", "platform": "twitter"}
    )
);`}
    </CodeBlock>
  ),
  'roku': (
    <CodeBlock language="brightscript">
{`m.global.snowplow.trackMediaEvent = {
    media: m.Video,
    schema: "iglu:com.example/video_interaction/jsonschema/1-0-0",
    data: { "action": "share", "platform": "twitter" }
}`}
    </CodeBlock>
  )
}}
</PlatformTabs>

## Update player state

<PlatformTabs platforms={props.platforms}>
{{
  'js-tag': (
    <>
      <p>Update the player state every second during playback. This ensures accurate metrics in ping events and the session entity. This function does not send any events.</p>
      <CodeBlock language="javascript">
{`window.snowplow('updateMediaTracking', {
    id,
    player: { currentTime: player.currentTime }
});`}
      </CodeBlock>
    </>
  ),
  'js-browser': (
    <>
      <p>Update the player state every second during playback. This ensures accurate metrics in ping events and the session entity. This function does not send any events.</p>
      <CodeBlock language="javascript">
{`import { updateMediaTracking } from "@snowplow/browser-plugin-media";

updateMediaTracking({
    id,
    player: { currentTime: player.currentTime }
});`}
      </CodeBlock>
    </>
  ),
  'ios': (
    <>
      <p>Update the player state every second during playback. This ensures accurate metrics in ping events and the session entity. This function does not send any events.</p>
      <CodeBlock language="swift">
{`mediaTracking.update(player: MediaPlayerEntity().currentTime(currentTime))`}
      </CodeBlock>
    </>
  ),
  'android-kotlin': (
    <>
      <p>Update the player state every second during playback. This ensures accurate metrics in ping events and the session entity. This function does not send any events.</p>
      <CodeBlock language="kotlin">
{`mediaTracking?.update(player = MediaPlayerEntity(currentTime = currentTime))`}
      </CodeBlock>
    </>
  ),
  'android-java': (
    <>
      <p>Update the player state every second during playback. This ensures accurate metrics in ping events and the session entity. This function does not send any events.</p>
      <CodeBlock language="java">
{`MediaPlayerEntity player = new MediaPlayerEntity();
player.setCurrentTime(currentTime);
mediaTracking.update(player, null, null);`}
      </CodeBlock>
    </>
  ),
  'flutter': (
    <>
      <p>Update the player state every second during playback. This ensures accurate metrics in ping events and the session entity. This function does not send any events.</p>
      <CodeBlock language="dart">
{`await mediaTracking.update(
    player: MediaPlayerEntity(currentTime: currentTime)
);`}
      </CodeBlock>
    </>
  ),
  'roku': (
    <p>Manual player state updates aren't needed for the Roku tracker. The tracker automatically tracks player state from the registered media node.</p>
  )
}}
</PlatformTabs>
