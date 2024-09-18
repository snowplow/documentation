import React, { useRef, useEffect, RefObject } from 'react'
import FilePlayer, { FilePlayerProps } from 'react-player/file'
import { v4 as uuidv4 } from 'uuid'

import {
  trackMediaReady,
  trackMediaPlay,
  trackMediaPause,
  trackMediaBufferStart,
  trackMediaBufferEnd,
  trackMediaEnd,
  trackMediaError,
  trackMediaSeekEnd,
  trackMediaPlaybackRateChange,
  trackMediaPictureInPictureChange,
  startMediaTracking,
  updateMediaTracking,
} from '@snowplow/browser-plugin-media'

interface PlayerProps {
  label?: string
}

// Taken from:
// https://github.com/cookpete/react-player/blob/795b19614977fbe2b89f6fd14503d1bfb121a722/types/base.d.ts#L53
interface PlayerError {
  error: any
  data?: any
  hlsInstance?: any
  hlsGlobal?: any
}

function playerData(
  player?: RefObject<FilePlayer>,
  label?: string
): Record<string, any> | undefined {
  if (player?.current) {
    const internal = player.current.getInternalPlayer()
    return {
      label,
      mediaType: 'video',
      playerType: 'react-player/file',
      currentTime: internal?.currentTime ?? 0,
      duration: internal?.duration,
      muted: internal?.muted,
      loop: internal?.loop,
      paused: internal?.paused,
      ended: internal?.ended,
      playbackRate: internal?.playbackRate,
      volume: internal?.muted ?? false ? 0 : internal?.volume * 100,
    }
  }
}

/**
 * A wrapped version of the FilePlayer component that tracks media events
 * using the Snowplow Media Tracking plugin.
 * @returns FilePlayer
 */
export default function TrackedFilePlayer(
  props: FilePlayerProps & PlayerProps
): JSX.Element {
  const id = uuidv4()
  const { label } = props

  const playerRef = useRef<FilePlayer>(null)

  useEffect(() => {
    startMediaTracking({ id })
  }, [id])

  const trackingCallbacks = {
    onReady: () => {
      trackMediaReady({ id, player: playerData(playerRef, label) })
    },
    onPlay: () => {
      trackMediaPlay({ id, player: playerData(playerRef, label) })
    },
    onPause: () => {
      trackMediaPause({ id, player: playerData(playerRef, label) })
    },
    onBuffer: () => {
      trackMediaBufferStart({ id, player: playerData(playerRef, label) })
    },
    onBufferEnd: () => {
      trackMediaBufferEnd({ id, player: playerData(playerRef, label) })
    },
    onEnded: () => {
      trackMediaEnd({ id, player: playerData(playerRef, label) })
    },
    onEnablePIP: () => {
      trackMediaPictureInPictureChange({
        id,
        pictureInPicture: true,
        player: playerData(playerRef, label),
      })
    },
    onDisablePIP: () => {
      trackMediaPictureInPictureChange({
        id,
        pictureInPicture: false,
        player: playerData(playerRef, label),
      })
    },
    onError: (error: PlayerError) => {
      trackMediaError({
        id,
        errorCode: error.error?.code,
        errorDescription: error.error?.message,
      })
    },
    onSeek: (seconds: number) => {
      trackMediaSeekEnd({
        id,
        player: { ...playerData(playerRef, label), currentTime: seconds },
      })
    },
    onPlaybackRateChange: (newRate: number) => {
      trackMediaPlaybackRateChange({
        id,
        newRate,
        player: playerData(playerRef, label),
      })
    },
    onTimeUpdate: () => {
      updateMediaTracking({ id, player: playerData(playerRef, label) })
    },
  }

  return <FilePlayer ref={playerRef} {...props} {...trackingCallbacks} />
}
