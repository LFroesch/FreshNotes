# Fresh Notes Makefile
# This Makefile helps manage the full-stack application with proper process cleanup

.PHONY: help install dev build start stop clean frontend backend frontend-dev backend-dev production

# Default target
help:
	@echo "Fresh Notes Application Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start both frontend and backend in development mode"
	@echo "  make frontend-dev - Start only frontend development server"
	@echo "  make backend-dev  - Start only backend development server"
	@echo ""
	@echo "Production:"
	@echo "  make build        - Build the frontend for production"
	@echo "  make start        - Start the production server"
	@echo "  make production   - Build and start production server"
	@echo ""
	@echo "Management:"
	@echo "  make install      - Install all dependencies"
	@echo "  make stop         - Stop all running processes"
	@echo "  make clean        - Clean node_modules and build files"
	@echo "  make restart      - Stop and restart development servers"
	@echo ""

# Install dependencies for both frontend and backend
install:
	@echo "Installing dependencies..."
	@cd backend && npm install
	@cd frontend && npm install
	@echo "Dependencies installed successfully!"

# Development mode - runs both frontend and backend
dev: stop
	@echo "Starting development servers..."
	@echo "$$$$" > .dev.pid; \
	trap 'make stop' INT; \
	(cd backend && npm run dev) & echo $$! >> .dev.pid & \
	(cd frontend && npm run dev) & echo $$! >> .dev.pid & \
	wait

# Start only frontend development server
frontend-dev: 
	@echo "Starting frontend development server..."
	@echo "$$$$" > .frontend.pid; \
	trap 'kill $$(cat .frontend.pid 2>/dev/null) 2>/dev/null; rm -f .frontend.pid' INT; \
	(cd frontend && npm run dev) & echo $$! > .frontend.pid; \
	wait

# Start only backend development server
backend-dev:
	@echo "Starting backend development server..."
	@echo "$$$$" > .backend.pid; \
	trap 'kill $$(cat .backend.pid 2>/dev/null) 2>/dev/null; rm -f .backend.pid' INT; \
	(cd backend && npm run dev) & echo $$! > .backend.pid; \
	wait

# Build frontend for production
build:
	@echo "Building frontend for production..."
	@cd frontend && npm run build
	@echo "Frontend built successfully!"

# Start production server
start: build
	@echo "Starting production server..."
	@echo "$$$$" > .production.pid; \
	trap 'kill $$(cat .production.pid 2>/dev/null) 2>/dev/null; rm -f .production.pid' INT; \
	(cd backend && npm start) & echo $$! > .production.pid; \
	wait

# Build and start production
production: install build start

# Stop all development processes
stop:
	@echo "Stopping project processes..."
	@if [ -f .dev.pid ]; then \
		for pid in $$(cat .dev.pid | grep -v "$$$$"); do \
			kill $$pid 2>/dev/null || true; \
		done; \
		rm -f .dev.pid; \
	fi
	@if [ -f .frontend.pid ]; then \
		kill $$(cat .frontend.pid) 2>/dev/null || true; \
		rm -f .frontend.pid; \
	fi
	@if [ -f .backend.pid ]; then \
		kill $$(cat .backend.pid) 2>/dev/null || true; \
		rm -f .backend.pid; \
	fi
	@if [ -f .production.pid ]; then \
		kill $$(cat .production.pid) 2>/dev/null || true; \
		rm -f .production.pid; \
	fi
	@echo "Project processes stopped."

# Restart development servers
restart: stop dev

# Clean all build files and dependencies
clean:
	@echo "Cleaning project..."
	@rm -rf frontend/node_modules
	@rm -rf backend/node_modules
	@rm -rf frontend/dist
	@rm -rf node_modules
	@rm -f .*.pid
	@echo "Project cleaned!"

# Quick development setup
setup: clean install
	@echo "Project setup complete! Run 'make dev' to start development."

# Show running processes
status:
	@echo "Checking project processes..."
	@if [ -f .dev.pid ]; then \
		echo "Development processes (PIDs):"; \
		cat .dev.pid | grep -v "$$$$" | while read pid; do \
			if ps -p $$pid > /dev/null 2>&1; then \
				echo "  Process $$pid is running"; \
			else \
				echo "  Process $$pid is not running"; \
			fi; \
		done; \
	else \
		echo "No development processes tracked"; \
	fi
	@if [ -f .frontend.pid ]; then \
		pid=$$(cat .frontend.pid); \
		if ps -p $$pid > /dev/null 2>&1; then \
			echo "Frontend process $$pid is running"; \
		else \
			echo "Frontend process $$pid is not running"; \
		fi; \
	fi
	@if [ -f .backend.pid ]; then \
		pid=$$(cat .backend.pid); \
		if ps -p $$pid > /dev/null 2>&1; then \
			echo "Backend process $$pid is running"; \
		else \
			echo "Backend process $$pid is not running"; \
		fi; \
	fi
	@if [ -f .production.pid ]; then \
		pid=$$(cat .production.pid); \
		if ps -p $$pid > /dev/null 2>&1; then \
			echo "Production process $$pid is running"; \
		else \
			echo "Production process $$pid is not running"; \
		fi; \
	fi
