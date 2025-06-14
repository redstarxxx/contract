# ps aux | grep "react-scripts/scripts/start.js" | awk '{print $2}' | xargs kill -9
ps aux | grep "react-scripts/scripts/start.js"
echo "Stop command: pkill -f react-scripts/scripts/start.js"
# pkill -f "react-scripts/scripts/start.js"