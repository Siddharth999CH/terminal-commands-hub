# Shell Integration for Terminal Commands Hub
# Supports both Zsh and Bash.
# To load this in your shell, add the following to your ~/.zshrc or ~/.bashrc:
# source "path/to/cli/shell-integration.sh"

# Determine the directory of this script when sourced
if [ -n "$ZSH_VERSION" ]; then
    SCRIPT_DIR="${0:a:h}"
elif [ -n "$BASH_VERSION" ]; then
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
else
    SCRIPT_DIR="."
fi
CLI_PATH="$SCRIPT_DIR/dist/index.js"

# Zsh key binding
if [ -n "$ZSH_VERSION" ]; then
    term-hub-widget() {
        if [ ! -f "$CLI_PATH" ]; then
            echo "\n[Terminal Hub Warning] CLI file not found at: $CLI_PATH. Please run 'npm run build' first."
            zle && zle reset-prompt
            return
        fi
        
        local cmd
        cmd=$(node "$CLI_PATH" interactive)
        
        if [ -n "$cmd" ]; then
            BUFFER="$cmd"
            zle accept-line
        else
            zle && zle reset-prompt
        fi
    }
    zle -N term-hub-widget
    bindkey '\eq' term-hub-widget
    echo "Terminal Commands Hub: Alt+Q keybinding registered in Zsh."

# Bash key binding
elif [ -n "$BASH_VERSION" ]; then
    term_hub_bash_run() {
        if [ ! -f "$CLI_PATH" ]; then
            echo -e "\n[Terminal Hub Warning] CLI file not found. Please run 'npm run build' first."
            return
        fi
        local cmd
        cmd=$(node "$CLI_PATH" interactive)
        if [ -n "$cmd" ]; then
            eval "$cmd"
        fi
    }
    # Bind Alt+Q to run our function
    bind -x '"\eq": term_hub_bash_run'
    echo "Terminal Commands Hub: Alt+Q keybinding registered in Bash."
fi
