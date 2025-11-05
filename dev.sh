#!/bin/bash

# FarScore Development Script
# A comprehensive shell script for managing the FarScore Farcaster analytics app

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to setup the project
setup() {
    print_status "Setting up FarScore development environment..."
    
    # Check for required tools
    if ! command_exists npm; then
        print_error "npm is not installed. Please install Node.js and npm first."
        exit 1
    fi
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm install
    
    print_success "Setup complete! You can now run 'dev', 'build', or 'deploy'."
}

# Function to start development server
dev() {
    print_status "Starting development server..."
    npm run dev
}

# Function to build the project
build() {
    print_status "Building FarScore for production..."
    npm run build
    print_success "Build complete!"
}

# Function to deploy to Cloudflare
deploy() {
    print_status "Deploying FarScore to Cloudflare Workers..."
    build
    wrangler deploy
    print_success "Deployment complete!"
}

# Main script logic
case "${1:-help}" in
    setup)
        setup
        ;;
    dev)
        dev
        ;;
    build)
        build
        ;;
    deploy)
        deploy
        ;;
    help|--help|-h)
        echo "FarScore Development Script"
        echo "Usage: ./dev.sh [command]"
        echo "Commands:"
        echo "  setup   - Install dependencies"
        echo "  dev     - Start development server"
        echo "  build   - Build for production"
        echo "  deploy  - Deploy to Cloudflare Workers"
        ;;
    *)
        print_error "Unknown command: $1"
        exit 1
        ;;
esac
