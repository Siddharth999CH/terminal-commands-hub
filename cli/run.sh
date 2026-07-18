# Run wrapper for Terminal Commands Hub
tempFile=$(mktemp)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
node "$DIR/dist/index.js" interactive > "$tempFile"
if [ -s "$tempFile" ]; then
    eval "$(cat "$tempFile")"
fi
rm "$tempFile"
