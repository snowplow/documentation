import React from 'react'

export default function Badges(props) {
  if (props.badgeType === 'Docker Pulls') {
    const { repo } = props
    return (
      <a href={`https://hub.docker.com/r/${repo}`}>
        <img
          loading="lazy"
          src={`https://img.shields.io/docker/pulls/${repo}`}
          alt="Docker Pulls"
          title="Docker Pulls"
          className="shield"
        ></img>
      </a>
    )
  }
  if (props.badgeType === 'Actively Maintained') {
    return (
      <a href="/docs/collecting-data/collecting-from-own-applications/tracker-maintenance-classification">
        <img
          loading="lazy"
          src="https://img.shields.io/static/v1?style=flat&amp;label=Snowplow&amp;message=Actively%20Maintained&amp;color=6638b8&amp;labelColor=9ba0aa&amp;logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAeFBMVEVMaXGXANeYANeXANZbAJmXANeUANSQAM+XANeMAMpaAJhZAJeZANiXANaXANaOAM2WANVnAKWXANZ9ALtmAKVaAJmXANZaAJlXAJZdAJxaAJlZAJdbAJlbAJmQAM+UANKZANhhAJ+EAL+BAL9oAKZnAKVjAKF1ALNBd8J1AAAAKHRSTlMAa1hWXyteBTQJIEwRgUh2JjJon21wcBgNfmc+JlOBQjwezWF2l5dXzkW3/wAAAHpJREFUeNokhQOCA1EAxTL85hi7dXv/E5YPCYBq5DeN4pcqV1XbtW/xTVMIMAZE0cBHEaZhBmIQwCFofeprPUHqjmD/+7peztd62dWQRkvrQayXkn01f/gWp2CrxfjY7rcZ5V7DEMDQgmEozFpZqLUYDsNwOqbnMLwPAJEwCopZxKttAAAAAElFTkSuQmCC"
          alt="Actively Maintained"
          title="Actively Maintained badge"
          className="img_ev3q"
        ></img>
      </a>
    )
  }
  if (props.badgeType === 'Maintained') {
    return (
      <a href="/docs/collecting-data/collecting-from-own-applications/tracker-maintenance-classification">
        <img
          loading="lazy"
          src="https://img.shields.io/static/v1?style=flat&label=Snowplow&message=Maintained&color=9e62dd&labelColor=9ba0aa&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAeFBMVEVMaXGXANeYANeXANZbAJmXANeUANSQAM+XANeMAMpaAJhZAJeZANiXANaXANaOAM2WANVnAKWXANZ9ALtmAKVaAJmXANZaAJlXAJZdAJxaAJlZAJdbAJlbAJmQAM+UANKZANhhAJ+EAL+BAL9oAKZnAKVjAKF1ALNBd8J1AAAAKHRSTlMAa1hWXyteBTQJIEwRgUh2JjJon21wcBgNfmc+JlOBQjwezWF2l5dXzkW3/wAAAHpJREFUeNokhQOCA1EAxTL85hi7dXv/E5YPCYBq5DeN4pcqV1XbtW/xTVMIMAZE0cBHEaZhBmIQwCFofeprPUHqjmD/+7peztd62dWQRkvrQayXkn01f/gWp2CrxfjY7rcZ5V7DEMDQgmEozFpZqLUYDsNwOqbnMLwPAJEwCopZxKttAAAAAElFTkSuQmCC"
          alt="Maintained"
          title="Maintained badge"
          className="img_ev3q"
        ></img>
      </a>
    )
  }
  if (props.badgeType === 'Early Release') {
    return (
      <a href="/docs/collecting-data/collecting-from-own-applications/tracker-maintenance-classification">
        <img
          loading="lazy"
          src="https://img.shields.io/static/v1?style=flat&amp;label=Snowplow&amp;message=Early%20Release&amp;color=014477&amp;labelColor=9ba0aa&amp;logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAeFBMVEVMaXGXANeYANeXANZbAJmXANeUANSQAM+XANeMAMpaAJhZAJeZANiXANaXANaOAM2WANVnAKWXANZ9ALtmAKVaAJmXANZaAJlXAJZdAJxaAJlZAJdbAJlbAJmQAM+UANKZANhhAJ+EAL+BAL9oAKZnAKVjAKF1ALNBd8J1AAAAKHRSTlMAa1hWXyteBTQJIEwRgUh2JjJon21wcBgNfmc+JlOBQjwezWF2l5dXzkW3/wAAAHpJREFUeNokhQOCA1EAxTL85hi7dXv/E5YPCYBq5DeN4pcqV1XbtW/xTVMIMAZE0cBHEaZhBmIQwCFofeprPUHqjmD/+7peztd62dWQRkvrQayXkn01f/gWp2CrxfjY7rcZ5V7DEMDQgmEozFpZqLUYDsNwOqbnMLwPAJEwCopZxKttAAAAAElFTkSuQmCC"
          alt="Early Release"
          title="Early Release badge"
          className="img_ev3q"
        ></img>
      </a>
    )
  }
  if (props.badgeType === 'Unsupported') {
    return (
      <a href="/docs/collecting-data/collecting-from-own-applications/tracker-maintenance-classification">
        <img
          loading="lazy"
          src="https://img.shields.io/static/v1?style=flat&label=Snowplow&message=Unsupported&color=24292e&labelColor=lightgrey&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAeFBMVEVMaXGXANeYANeXANZbAJmXANeUANSQAM+XANeMAMpaAJhZAJeZANiXANaXANaOAM2WANVnAKWXANZ9ALtmAKVaAJmXANZaAJlXAJZdAJxaAJlZAJdbAJlbAJmQAM+UANKZANhhAJ+EAL+BAL9oAKZnAKVjAKF1ALNBd8J1AAAAKHRSTlMAa1hWXyteBTQJIEwRgUh2JjJon21wcBgNfmc+JlOBQjwezWF2l5dXzkW3/wAAAHpJREFUeNokhQOCA1EAxTL85hi7dXv/E5YPCYBq5DeN4pcqV1XbtW/xTVMIMAZE0cBHEaZhBmIQwCFofeprPUHqjmD/+7peztd62dWQRkvrQayXkn01f/gWp2CrxfjY7rcZ5V7DEMDQgmEozFpZqLUYDsNwOqbnMLwPAJEwCopZxKttAAAAAElFTkSuQmCC"
          alt="Unsupported"
          title="Unsupported badge"
          className="img_ev3q"
        ></img>
      </a>
    )
  }
  if (props.badgeType === 'Snowplow Tracker Release') {
    return (
      <img
        src="https://img.shields.io/packagist/v/snowplow/snowplow-tracker"
        alt="Latest version"
      ></img>
    )
  }
  if (props.badgeType === 'React Native Tracker Release') {
    return (
      <a href="https://www.npmjs.com/package/@snowplow/react-native-tracker">
        <img
          src="https://img.shields.io/npm/v/@snowplow/react-native-tracker"
          alt="Latest version"
        ></img>
      </a>
    )
  }
  if (props.badgeType === 'Pypi Tracker Release') {
    return (
      <a href="https://pypi.org/project/snowplow-tracker/">
        <img
          src="https://img.shields.io/pypi/v/snowplow-tracker"
          alt="Latest version"
        ></img>
      </a>
    )
  }

  if (props.badgeType === 'Snowplow Tracker PHP Release') {
    return (
      <img
        src="https://img.shields.io/packagist/php-v/snowplow/snowplow-tracker"
        alt="PHP Version"
      ></img>
    )
  }
  if (props.badgeType === 'Snowplow Tracker React Native Release') {
    return (
      <a href="https://www.npmjs.com/package/@snowplow/react-native-tracker">
        <img
          src="https://img.shields.io/npm/dependency-version/@snowplow/react-native-tracker/peer/react-native"
          alt="React Native Version"
        ></img>
      </a>
    )
  }
  if (props.badgeType === 'Snowplow Tracker Pypi Release') {
    return (
      <a href="https://pypi.org/project/snowplow-tracker/">
        <img
          src="https://img.shields.io/pypi/pyversions/snowplow-tracker"
          alt="React Native Version"
        ></img>
      </a>
    )
  }
  if (props.badgeType === 'Snowplow Tracker JavaScript Release') {
    return (
      <a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">
        <img
          src="https://img.shields.io/github/v/release/snowplow/snowplow-javascript-tracker?include_prereleases&sort=semver&style=flat"
          alt="JavaScript version"
        ></img>
      </a>
    )
  }
}
