#!/bin/bash

# Script to manage the continuously running email server

# Make sure we're in the server directory
cd "$(dirname "$0")"

# Function to start the server
start_server() {
  echo "Starting email server in continuous mode..."
  nohup node continuous-email-server.js > /dev/null 2>&1 &
  echo $! > .server.pid
  echo "Email server started successfully with PID: $(cat .server.pid)"
  echo "To view logs, check the logs directory:"
  echo "  - Standard output: logs/out.log"
  echo "  - Error log: logs/error.log"
}

# Function to stop the server
stop_server() {
  if [ -f .server.pid ]; then
    echo "Stopping email server..."
    PID=$(cat .server.pid)
    if ps -p $PID > /dev/null; then
      kill $PID
      echo "Email server stopped (PID: $PID)."
    else
      echo "Email server is not running (PID: $PID not found)."
    fi
    rm .server.pid
  else
    echo "Email server is not running (no PID file found)."
  fi
}

# Function to restart the server
restart_server() {
  stop_server
  sleep 2
  start_server
}

# Function to check server status
status() {
  if [ -f .server.pid ]; then
    PID=$(cat .server.pid)
    if ps -p $PID > /dev/null; then
      echo "Email server is running with PID: $PID"
    else
      echo "Email server is not running (PID: $PID not found)."
      rm .server.pid
    fi
  else
    echo "Email server is not running (no PID file found)."
  fi
}

# Function to view server logs
logs() {
  echo "Showing the last 50 lines of email server logs..."
  echo "Standard output:"
  tail -n 50 logs/out.log
  echo ""
  echo "Error log:"
  tail -n 50 logs/error.log
}

# Function to follow logs in real-time
follow_logs() {
  echo "Following email server logs in real-time (press Ctrl+C to exit)..."
  tail -f logs/out.log logs/error.log
}

# Main script logic
case "$1" in
  start)
    start_server
    ;;
  stop)
    stop_server
    ;;
  restart)
    restart_server
    ;;
  status)
    status
    ;;
  logs)
    logs
    ;;
  follow)
    follow_logs
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|logs|follow}"
    echo ""
    echo "Commands:"
    echo "  start   - Start the email server in continuous mode"
    echo "  stop    - Stop the email server"
    echo "  restart - Restart the email server"
    echo "  status  - Check the status of the email server"
    echo "  logs    - View the email server logs"
    echo "  follow  - Follow the email server logs in real-time"
    exit 1
    ;;
esac

exit 0
