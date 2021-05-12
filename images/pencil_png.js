/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAGQCAYAAADfrrmFAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAABCZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjMyMDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NDAwPC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAg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';
export default image;